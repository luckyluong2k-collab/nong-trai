// js/chat.js - Hệ thống trò chuyện đôi, gửi ảnh và sticker tình yêu

class LoveChat {
    constructor() {
        this.messages = [];
        this.currentRole = window.loveStorage.get('current_role', 'gnoul'); // 'gnoul' hoặc 'minyu'
        this.init();
    }

    async init() {
        this.messages = window.loveStorage.get('chat_messages', this.getDefaultMessages());
        this.renderMessages();
        this.bindEvents();
        this.updateRoleUI();
    }

    getDefaultMessages() {
        return [
            {
                id: 'msg_1',
                sender: 'gnoul',
                type: 'text',
                content: 'Minyu ơi, hôm nay em có nhớ anh không? 💕',
                timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
            },
            {
                id: 'msg_2',
                sender: 'minyu',
                type: 'text',
                content: 'Nhớ Gnoul nhiều lắm luôn á, đang chờ anh rảnh nè 🥰',
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
            },
            {
                id: 'msg_3',
                sender: 'gnoul',
                type: 'sticker',
                content: '💖 Gnoul yêu Minyu nhất trên đời! 💖',
                timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
            }
        ];
    }

    setRole(role) {
        this.currentRole = role;
        window.loveStorage.set('current_role', role);
        this.updateRoleUI();
        this.renderMessages();
    }

    updateRoleUI() {
        const roleNameEl = document.getElementById('chat-current-role-name');
        const roleAvatarEl = document.getElementById('chat-current-role-avatar');
        if (roleNameEl) roleNameEl.textContent = this.currentRole === 'gnoul' ? 'Gnoul (Bạn)' : 'Minyu (Bạn)';
        if (roleAvatarEl) roleAvatarEl.textContent = this.currentRole === 'gnoul' ? '🤴' : '👸';

        // Đổi màu header chat hoặc highlight
        const header = document.querySelector('.chat-header-user');
        if (header) {
            header.setAttribute('data-role', this.currentRole);
        }
    }

    toggleRole() {
        const nextRole = this.currentRole === 'gnoul' ? 'minyu' : 'gnoul';
        this.setRole(nextRole);
        if (window.loveWidgets) window.loveWidgets.setRole(nextRole);
        if (window.loveAudio) window.loveAudio.playPop();
        window.loveWidgets?.showToast(`Đã đổi vai trò sang: ${nextRole === 'gnoul' ? 'Gnoul 🤴' : 'Minyu 👸'}`);
    }

    renderMessages() {
        const container = document.getElementById('chat-messages-container');
        if (!container) return;

        container.innerHTML = this.messages.map(msg => {
            const isMe = msg.sender === this.currentRole;
            const senderName = msg.sender === 'gnoul' ? 'Gnoul' : 'Minyu';
            const avatar = msg.sender === 'gnoul' ? '🤴' : '👸';
            const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            let bodyHtml = '';
            if (msg.type === 'image') {
                bodyHtml = `
                    <div class="chat-image-wrapper" onclick="window.loveChat.viewFullImage('${msg.content}')">
                        <img src="${msg.content}" alt="Sent photo" loading="lazy" class="chat-photo-img"/>
                        ${msg.caption ? `<div class="chat-photo-caption">${this.escapeHtml(msg.caption)}</div>` : ''}
                    </div>
                `;
            } else if (msg.type === 'sticker') {
                bodyHtml = `<div class="chat-sticker-bubble">${this.escapeHtml(msg.content)}</div>`;
            } else {
                bodyHtml = `<div class="chat-text">${this.escapeHtml(msg.content)}</div>`;
            }

            return `
                <div class="chat-row ${isMe ? 'row-me' : 'row-partner'}">
                    ${!isMe ? `<div class="chat-avatar-mini" title="${senderName}">${avatar}</div>` : ''}
                    <div class="chat-bubble-box">
                        <div class="chat-sender-label">${senderName}</div>
                        ${bodyHtml}
                        <div class="chat-timestamp">${time} ${isMe ? '✓✓' : ''}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Tự động cuộn xuống tin nhắn mới nhất
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }

    sendMessage(text, type = 'text', caption = '') {
        if (!text || !text.trim()) return;

        const newMsg = {
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            sender: this.currentRole,
            type: type,
            content: text.trim(),
            caption: caption,
            timestamp: new Date().toISOString()
        };

        this.messages.push(newMsg);
        window.loveStorage.set('chat_messages', this.messages);
        this.renderMessages();

        if (window.loveAudio) window.loveAudio.playPop();

        // Đồng bộ Firebase nếu đã kết nối
        if (window.loveFirebase && window.loveFirebase.isConnected) {
            window.loveFirebase.sendChatMessage(newMsg);
        }

        // Kích hoạt hiệu ứng tim bay nhẹ
        if (window.loveApp) window.loveApp.spawnFloatingHeart(window.innerWidth - 60, window.innerHeight - 100);
    }

    async handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const rawBase64 = event.target.result;
            // Nén ảnh gọn nhẹ
            const compressed = await window.loveWidgets.compressImage(rawBase64, 900, 0.85);

            // Cho phép kèm lời nhắn caption
            const caption = prompt("Nhập lời nhắn kèm theo ảnh (tùy chọn):", "") || "";

            this.sendMessage(compressed, 'image', caption);

            // Tự động cập nhật vào widget Locket nếu muốn
            const updateLocket = confirm("Bạn có muốn cập nhật ảnh này lên Widget Locket màn hình chính luôn không?");
            if (updateLocket) {
                const photoItem = {
                    imageData: compressed,
                    caption: caption || "Ảnh gửi trong Chat 💕",
                    sender: this.currentRole,
                    createdAt: new Date().toISOString(),
                    reactions: 1
                };
                await window.loveStorage.savePhoto(photoItem);
                await window.loveWidgets.renderLocketWidget();
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    sendQuickSticker(stickerText) {
        this.sendMessage(stickerText, 'sticker');
        this.closeStickerPicker();
    }

    toggleStickerPicker() {
        const panel = document.getElementById('chat-stickers-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    closeStickerPicker() {
        document.getElementById('chat-stickers-panel')?.classList.remove('active');
    }

    viewFullImage(src) {
        const modal = document.getElementById('modal-image-lightbox');
        const img = document.getElementById('lightbox-image');
        if (modal && img) {
            img.src = src;
            modal.classList.add('active');
        }
    }

    closeLightbox() {
        document.getElementById('modal-image-lightbox')?.classList.remove('active');
    }

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    bindEvents() {
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input-text');
        const fileInput = document.getElementById('chat-file-input');

        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage(input.value);
                input.value = '';
                this.closeStickerPicker();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage(input.value);
                    input.value = '';
                    this.closeStickerPicker();
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }
    }
}

window.loveChat = new LoveChat();
