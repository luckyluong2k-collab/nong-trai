// js/firebase-sync.js - Module đồng bộ đám mây với Firebase Realtime Database

class LoveFirebaseSync {
    constructor() {
        this.isConnected = false;
        this.firebaseApp = null;
        this.database = null;
        this.config = window.loveStorage.get('firebase_config', null);
        this.init();
    }

    async init() {
        if (this.config && this.config.apiKey && this.config.databaseURL) {
            this.connect(this.config);
        } else {
            this.updateStatusUI(false, 'Chế độ Offline (Chưa cấu hình Firebase)');
        }
    }

    connect(config) {
        try {
            if (!window.firebase) {
                console.warn('Firebase SDK chưa được nạp');
                this.updateStatusUI(false, 'Chưa nạp Firebase SDK');
                return false;
            }

            // Nếu đã có app cũ thì dùng hoặc xóa
            if (!firebase.apps.length) {
                this.firebaseApp = firebase.initializeApp(config);
            } else {
                this.firebaseApp = firebase.app();
            }

            this.database = firebase.database();
            this.isConnected = true;
            this.config = config;
            window.loveStorage.set('firebase_config', config);

            this.updateStatusUI(true, 'Đã kết nối Firebase Cloud Realtime 🟢');
            this.setupListeners();
            return true;
        } catch (e) {
            console.error('Lỗi kết nối Firebase:', e);
            this.updateStatusUI(false, 'Lỗi kết nối: ' + e.message);
            return false;
        }
    }

    disconnect() {
        this.isConnected = false;
        this.database = null;
        window.loveStorage.remove('firebase_config');
        this.updateStatusUI(false, 'Chế độ Offline (Đã ngắt kết nối)');
    }

    setupListeners() {
        if (!this.database) return;

        // 1. Lắng nghe tin nhắn chat mới
        const chatRef = this.database.ref('love_chat/messages');
        chatRef.limitToLast(50).on('child_added', (snapshot) => {
            const msg = snapshot.val();
            if (!msg) return;

            // Kiểm tra xem tin nhắn đã có trong mảng local chưa
            const exists = window.loveChat.messages.some(m => m.id === msg.id);
            if (!exists) {
                window.loveChat.messages.push(msg);
                window.loveStorage.set('chat_messages', window.loveChat.messages);
                window.loveChat.renderMessages();

                // Phát âm thanh nếu tin nhắn do đối phương gửi
                if (msg.sender !== window.loveChat.currentRole) {
                    if (window.loveAudio) window.loveAudio.playPop();
                }
            }
        });

        // 2. Lắng nghe ảnh Locket mới
        const locketRef = this.database.ref('love_locket/latest');
        locketRef.on('value', async (snapshot) => {
            const photoItem = snapshot.val();
            if (photoItem) {
                const photos = await window.loveStorage.getPhotos();
                const exists = photos.some(p => p.createdAt === photoItem.createdAt);
                if (!exists) {
                    await window.loveStorage.savePhoto(photoItem);
                    await window.loveWidgets.renderLocketWidget();
                    if (photoItem.sender !== window.loveWidgets.currentRole) {
                        window.loveWidgets.showToast(`Đối phương vừa cập nhật ảnh Locket mới! 📸`);
                    }
                }
            }
        });

        // 3. Lắng nghe Mood cập nhật
        const moodRef = this.database.ref('love_status/moods');
        moodRef.on('value', (snapshot) => {
            const moods = snapshot.val();
            if (moods) {
                if (moods.gnoul) window.loveStorage.set('mood_gnoul', moods.gnoul);
                if (moods.minyu) window.loveStorage.set('mood_minyu', moods.minyu);
                window.loveWidgets.renderMoodWidget();
            }
        });

        // 4. Lắng nghe Sticky Note cập nhật
        const noteRef = this.database.ref('love_status/sticky_note');
        noteRef.on('value', (snapshot) => {
            const note = snapshot.val();
            if (note) {
                window.loveStorage.set('love_sticky_note', note);
                window.loveWidgets.renderStickyNote();
            }
        });

        // 5. Lắng nghe lượt chơi cờ caro online
        const gameRef = this.database.ref('love_game/tictactoe');
        gameRef.on('value', (snapshot) => {
            const gameData = snapshot.val();
            if (gameData && window.loveGames) {
                window.loveGames.board = gameData.board;
                window.loveGames.currentTurn = gameData.turn;
                window.loveGames.renderTicTacToe();
            }
        });
    }

    // Gửi tin nhắn lên Firebase
    sendChatMessage(msg) {
        if (!this.isConnected || !this.database) return;
        this.database.ref('love_chat/messages').push(msg);
    }

    // Gửi ảnh Locket lên Firebase
    sendLocketPhoto(photoItem) {
        if (!this.isConnected || !this.database) return;
        this.database.ref('love_locket/latest').set(photoItem);
    }

    // Cập nhật tâm trạng
    updateMood(role, moodData) {
        if (!this.isConnected || !this.database) return;
        this.database.ref(`love_status/moods/${role}`).set(moodData);
    }

    // Cập nhật sticky note
    updateStickyNote(noteData) {
        if (!this.isConnected || !this.database) return;
        this.database.ref('love_status/sticky_note').set(noteData);
    }

    // Cập nhật nước đi Caro
    sendGameMove(gameData) {
        if (!this.isConnected || !this.database) return;
        this.database.ref('love_game/tictactoe').set(gameData);
    }

    updateStatusUI(connected, text) {
        const badge = document.getElementById('firebase-status-badge');
        const textEl = document.getElementById('firebase-status-text');
        if (badge) {
            badge.className = connected ? 'status-indicator connected' : 'status-indicator disconnected';
        }
        if (textEl) {
            textEl.textContent = text;
        }
    }
}

window.loveFirebase = new LoveFirebaseSync();
