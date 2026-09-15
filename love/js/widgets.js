// js/widgets.js - Quản lý các tiện ích phong cách Mobile Widget Pro VIP (Locket, Lịch Âm Dương, Mood, Battery, Sticky Note)

class LoveWidgets {
    constructor() {
        this.currentRole = window.loveStorage.get('current_role', 'gnoul'); // 'gnoul' hoặc 'minyu'
        this.selectedFilter = 'none'; // 'none', 'vintage', 'sunset', 'bw', 'pastel'
        this.init();
    }

    async init() {
        this.renderMoodWidget();
        this.renderStickyNote();
        this.renderLunarTodayWidget();
        await this.renderLocketWidget();
        this.initBatterySync();
        this.bindEvents();
    }

    setRole(role) {
        this.currentRole = role;
        window.loveStorage.set('current_role', role);
        this.renderMoodWidget();
        this.renderStickyNote();
    }

    getPartnerRole() {
        return this.currentRole === 'gnoul' ? 'minyu' : 'gnoul';
    }

    getRoleName(role = this.currentRole) {
        return role === 'gnoul' ? 'Gnoul' : 'Minyu';
    }

    // 1. WIDGET LỊCH ÂM DƯƠNG HÔM NAY (LUNAR TODAY WIDGET)
    renderLunarTodayWidget() {
        const container = document.getElementById('widget-lunar-today-content');
        if (!container) return;

        const today = new Date();
        const d = today.getDate();
        const m = today.getMonth() + 1;
        const y = today.getFullYear();

        if (window.vietnameseLunar) {
            const lunar = window.vietnameseLunar.convertSolarToLunar(d, m, y);
            const dayOfWeekNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
            const dow = dayOfWeekNames[today.getDay()];

            container.innerHTML = `
                <div class="lunar-widget-card" onclick="if(window.loveApp) window.loveApp.switchTab('calendar')">
                    <div class="lunar-widget-left">
                        <span class="lunar-dow">${dow}</span>
                        <span class="lunar-solar-day">${d}</span>
                        <span class="lunar-solar-my">Tháng ${m}, ${y}</span>
                    </div>
                    <div class="lunar-widget-divider"></div>
                    <div class="lunar-widget-right">
                        <div class="lunar-tag-badge">ÂM LỊCH VIỆT NAM 🌕</div>
                        <div class="lunar-date-text">
                            Ngày <strong>${lunar.lunarDay}</strong> tháng <strong>${lunar.lunarMonth}</strong>
                        </div>
                        <div class="lunar-canchi-sub">
                            Năm ${lunar.canChiYear} (${lunar.conGiap})
                        </div>
                        <div class="lunar-canchi-day">
                            🎋 Ngày ${lunar.canChiDay} • ${lunar.tietKhi || 'Tiết Khí'}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // 2. WIDGET LOCKET PRO (Ảnh mới nhất đối phương chụp với filter)
    async renderLocketWidget() {
        const photos = await window.loveStorage.getPhotos();
        const locketContainer = document.getElementById('widget-locket-content');
        if (!locketContainer) return;

        if (photos && photos.length > 0) {
            const latest = photos[photos.length - 1];
            const senderName = latest.sender === 'gnoul' ? 'Gnoul' : 'Minyu';
            const timeStr = this.formatTimeAgo(latest.createdAt);
            const filterClass = latest.filter ? `filter-${latest.filter}` : '';

            locketContainer.innerHTML = `
                <div class="locket-card polaroid-style" onclick="window.loveWidgets.openLocketGallery()">
                    <div class="locket-img-container ${filterClass}">
                        <img src="${latest.imageData}" alt="Locket Photo" class="locket-img" id="locket-current-img"/>
                    </div>
                    <div class="locket-polaroid-footer">
                        <div class="locket-sender-pill">
                            <span class="locket-dot"></span>
                            <span>${senderName} vừa gửi</span>
                            <span class="locket-time">• ${timeStr}</span>
                        </div>
                        <div class="locket-caption">"${latest.caption || 'Khoảnh khắc yêu thương 💕'}"</div>
                    </div>
                    <button class="locket-react-btn" onclick="event.stopPropagation(); window.loveWidgets.sendLocketReaction(${latest.id})">
                        💖 ${latest.reactions || 1}
                    </button>
                </div>
            `;
        } else {
            locketContainer.innerHTML = `
                <div class="locket-card empty" onclick="document.getElementById('locket-file-input').click()">
                    <div class="locket-empty-placeholder">
                        <div class="locket-icon-camera">📷</div>
                        <p class="locket-empty-title">Chưa có ảnh Locket nào</p>
                        <span class="locket-empty-sub">Chạm vào đây để gửi tấm ảnh đầu tiên cho ${this.getRoleName(this.getPartnerRole())} ngay nhé!</span>
                    </div>
                </div>
            `;
        }
    }

    async handleLocketUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const rawBase64 = event.target.result;
            const compressed = await this.compressImage(rawBase64, 850, 0.88);

            // Cho phép chọn bộ lọc màu Pro VIP
            const filterChoice = prompt(
                "Chọn bộ lọc màu Locket Pro:\n1. Tự nhiên (Gốc)\n2. Vintage Film cổ điển 🎞️\n3. Warm Sunset hoàng hôn 🌅\n4. Đen trắng nghệ thuật 🖤\n5. Pastel Hồng mộng mơ 🌸\n(Nhập số 1-5):",
                "1"
            );

            let chosenFilter = 'none';
            if (filterChoice === '2') chosenFilter = 'vintage';
            else if (filterChoice === '3') chosenFilter = 'sunset';
            else if (filterChoice === '4') chosenFilter = 'bw';
            else if (filterChoice === '5') chosenFilter = 'pastel';

            const caption = prompt(`Gửi lời nhắn kèm ảnh cho ${this.getRoleName(this.getPartnerRole())}:`, "Khoảnh khắc đáng yêu gửi bé yêu 💕") || "Ảnh tình yêu ❤️";

            const photoItem = {
                imageData: compressed,
                caption: caption,
                sender: this.currentRole,
                filter: chosenFilter,
                createdAt: new Date().toISOString(),
                reactions: 1
            };

            await window.loveStorage.savePhoto(photoItem);
            
            if (window.loveFirebase && window.loveFirebase.isConnected) {
                window.loveFirebase.sendLocketPhoto(photoItem);
            }

            await this.renderLocketWidget();
            if (window.loveAudio) window.loveAudio.playPop();
            this.showToast(`Đã gửi ảnh Locket Pro cho ${this.getRoleName(this.getPartnerRole())}! 🥰`);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    async sendLocketReaction(id) {
        if (window.loveAudio) window.loveAudio.playHeartSound();
        if (window.loveApp) window.loveApp.spawnHeartsExplosion(window.innerWidth / 2, window.innerHeight / 2);
        this.showToast("Đã thả tim ảnh của người ấy! 💕");
    }

    async openLocketGallery() {
        const photos = await window.loveStorage.getPhotos();
        const modal = document.getElementById('modal-locket-gallery');
        const grid = document.getElementById('locket-gallery-grid');
        if (!modal || !grid) return;

        if (photos.length === 0) {
            grid.innerHTML = '<p class="empty-text">Chưa có ảnh kỷ niệm nào trong Locket.</p>';
        } else {
            grid.innerHTML = photos.slice().reverse().map(p => {
                const fClass = p.filter ? `filter-${p.filter}` : '';
                return `
                    <div class="gallery-item ${fClass}" onclick="window.loveChat.viewFullImage('${p.imageData}')">
                        <img src="${p.imageData}" alt="Photo" loading="lazy"/>
                        <div class="gallery-caption">
                            <strong>${p.sender === 'gnoul' ? 'Gnoul' : 'Minyu'}</strong>: ${p.caption || ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
        modal.classList.add('active');
    }

    // 3. WIDGET TÂM TRẠNG & PIN (Mood & Battery)
    renderMoodWidget() {
        const savedMoodGnoul = window.loveStorage.get('mood_gnoul', { emoji: '🥰', text: 'Yêu bạn đời' });
        const savedMoodMinyu = window.loveStorage.get('mood_minyu', { emoji: '🥺', text: 'Nhớ đối phương' });

        const gnoulMoodEl = document.getElementById('widget-gnoul-mood');
        const minyuMoodEl = document.getElementById('widget-minyu-mood');

        if (gnoulMoodEl) {
            gnoulMoodEl.innerHTML = `
                <span class="mood-avatar">🤴 Gnoul</span>
                <span class="mood-status">${savedMoodGnoul.emoji} ${savedMoodGnoul.text}</span>
            `;
        }
        if (minyuMoodEl) {
            minyuMoodEl.innerHTML = `
                <span class="mood-avatar">👸 Minyu</span>
                <span class="mood-status">${savedMoodMinyu.emoji} ${savedMoodMinyu.text}</span>
            `;
        }
    }

    openMoodSelector() {
        const modal = document.getElementById('modal-mood-picker');
        if (modal) modal.classList.add('active');
    }

    selectMood(emoji, text) {
        const role = this.currentRole;
        window.loveStorage.set(`mood_${role}`, { emoji, text });
        
        if (window.loveFirebase && window.loveFirebase.isConnected) {
            window.loveFirebase.updateMood(role, { emoji, text });
        }

        this.renderMoodWidget();
        document.getElementById('modal-mood-picker')?.classList.remove('active');
        if (window.loveAudio) window.loveAudio.playPop();
        this.showToast(`Đã đổi tâm trạng: ${emoji} ${text}`);
    }

    initBatterySync() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const update = () => {
                    const level = Math.round(battery.level * 100);
                    const charging = battery.charging ? '⚡' : '';
                    const role = this.currentRole;
                    const batEl = document.getElementById(`battery-${role}`);
                    if (batEl) batEl.textContent = `${level}% ${charging}`;
                };
                update();
                battery.addEventListener('levelchange', update);
                battery.addEventListener('chargingchange', update);
            }).catch(() => {});
        }
    }

    // 4. WIDGET GHI CHÚ TÌNH YÊU (Love Sticky Note)
    renderStickyNote() {
        const note = window.loveStorage.get('love_sticky_note', {
            content: "Anh/Em nhớ ăn uống đúng giờ và uống thật nhiều nước nha! Thương Minyu/Gnoul nhiều lắm 💖",
            author: "Minyu",
            updatedAt: "Hôm nay"
        });

        const noteTextEl = document.getElementById('sticky-note-text');
        const noteAuthorEl = document.getElementById('sticky-note-author');

        if (noteTextEl) noteTextEl.textContent = note.content;
        if (noteAuthorEl) noteAuthorEl.textContent = `— Lời nhắn từ ${note.author} 💕`;
    }

    editStickyNote() {
        const note = window.loveStorage.get('love_sticky_note', { content: '' });
        const newText = prompt("Nhập lời nhắn dán lên màn hình đối phương:", note.content);
        if (newText && newText.trim()) {
            const author = this.getRoleName();
            const updated = {
                content: newText.trim(),
                author: author,
                updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            window.loveStorage.set('love_sticky_note', updated);

            if (window.loveFirebase && window.loveFirebase.isConnected) {
                window.loveFirebase.updateStickyNote(updated);
            }

            this.renderStickyNote();
            if (window.loveAudio) window.loveAudio.playPop();
            this.showToast("Đã dán ghi chú tình yêu mới!");
        }
    }

    compressImage(base64Str, maxWidth = 800, quality = 0.85) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => resolve(base64Str);
        });
    }

    formatTimeAgo(dateStr) {
        if (!dateStr) return 'Vừa xong';
        const diff = (new Date() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)}p trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    }

    showToast(message) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.className = 'app-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
    }

    bindEvents() {
        const locketInput = document.getElementById('locket-file-input');
        if (locketInput) {
            locketInput.addEventListener('change', (e) => this.handleLocketUpload(e));
        }
    }
}

if (typeof window !== 'undefined') {
    window.loveWidgets = new LoveWidgets();
}
