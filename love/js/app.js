// js/app.js - Điều khiển Navigation, Canvas hạt nền Pro VIP (Hearts/Sakura/Stars) & Hiệu ứng chuyển động

class LoveApp {
    constructor() {
        this.currentTab = 'home';
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.particleType = 'hearts'; // 'hearts', 'sakura', 'stars'
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindNavigation();
            this.initCanvasParticles();
            this.initInteractiveTouch();
            this.initMemoryTimeline();
            this.initSettingsModal();
            this.startAppModules();
        });
    }

    startAppModules() {
        if (window.loveCounter) window.loveCounter.start();
        if (window.loveCalendar) window.loveCalendar.init();
        if (window.loveThemes) window.loveThemes.init();
        if (window.lovePet) window.lovePet.init();
        if (window.loveCapsule) window.loveCapsule.init();
        this.updateHeaderProfile();
    }

    // Quản lý chuyển đổi Tab mượt mà
    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-tab-btn');
        navItems.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
                if (window.loveAudio) window.loveAudio.playPop();
            });
        });
    }

    switchTab(tabName) {
        if (this.currentTab === tabName) return;
        this.currentTab = tabName;

        // Cập nhật UI nút điều hướng đáy
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            const active = btn.getAttribute('data-tab') === tabName;
            btn.classList.toggle('active', active);
        });

        // Chuyển view
        document.querySelectorAll('.tab-view-container').forEach(view => {
            const isTarget = view.id === `tab-view-${tabName}`;
            view.classList.toggle('active', isTarget);
        });

        // Cuộn về đỉnh của tab mới
        const activeView = document.getElementById(`tab-view-${tabName}`);
        if (activeView) activeView.scrollTop = 0;

        // Trigger updates for specific tabs
        if (tabName === 'calendar' && window.loveCalendar) {
            window.loveCalendar.renderCalendarMonth(window.loveCalendar.currentYear, window.loveCalendar.currentMonth);
            window.loveCalendar.renderUpcomingDDays();
        } else if (tabName === 'games' && window.loveGames) {
            setTimeout(() => window.loveGames.drawWheel(), 50);
        }
    }

    updateHeaderProfile() {
        const role = window.loveStorage.get('current_role', 'gnoul');
        const badge = document.getElementById('header-user-badge');
        if (badge) {
            badge.textContent = role === 'gnoul' ? 'Gnoul 🤴' : 'Minyu 👸';
        }
    }

    // ================= CANVAS HIỆU ỨNG HẠT NỀN PRO VIP (HEARTS / SAKURA / STARS) =================
    initCanvasParticles() {
        this.canvas = document.getElementById('hearts-bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const resize = () => {
            this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
            this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        this.particleType = window.loveStorage ? window.loveStorage.get('active_particle', 'hearts') : 'hearts';

        // Khởi tạo các hạt
        this.particles = [];
        for (let i = 0; i < 26; i++) {
            this.particles.push(this.createParticle(true));
        }

        const animate = () => {
            this.renderParticles();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    updateParticleType(type) {
        this.particleType = type;
        this.particles = [];
        for (let i = 0; i < 28; i++) {
            this.particles.push(this.createParticle(true));
        }
    }

    createParticle(randomY = false) {
        const width = this.canvas ? this.canvas.width : 400;
        const height = this.canvas ? this.canvas.height : 800;

        if (this.particleType === 'sakura') {
            // Cánh hoa anh đào rơi từ trên xuống
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : -20,
                size: 8 + Math.random() * 10,
                speedY: 1.0 + Math.random() * 1.5,
                speedX: (Math.random() - 0.2) * 1.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                alpha: 0.3 + Math.random() * 0.5,
                color: '#ffb3c6'
            };
        } else if (this.particleType === 'stars') {
            // Bụi sao và sao băng
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                size: 1 + Math.random() * 2.5,
                speedY: 0.1 + Math.random() * 0.3,
                speedX: (Math.random() - 0.5) * 0.2,
                alpha: 0.2 + Math.random() * 0.8,
                twinkleSpeed: 0.02 + Math.random() * 0.04,
                twinkleDir: 1,
                color: '#ffffff'
            };
        } else {
            // Trái tim bồng bềnh bay lên
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : height + 20,
                size: 10 + Math.random() * 16,
                speedY: 0.6 + Math.random() * 1.3,
                speedX: (Math.random() - 0.5) * 0.8,
                alpha: 0.18 + Math.random() * 0.38,
                rotation: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.4 ? '#ff758f' : '#ffccd5'
            };
        }
    }

    renderParticles() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            if (this.particleType === 'sakura') {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.02) * p.speedX;
                p.rotation += p.rotationSpeed;
                this.drawSakuraPetal(this.ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);

                if (p.y > this.canvas.height + 20) {
                    this.particles[i] = this.createParticle(false);
                }
            } else if (this.particleType === 'stars') {
                p.alpha += p.twinkleSpeed * p.twinkleDir;
                if (p.alpha > 0.95) p.twinkleDir = -1;
                if (p.alpha < 0.15) p.twinkleDir = 1;

                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            } else {
                p.y -= p.speedY;
                p.x += Math.sin(p.y * 0.02) * 0.5;
                this.drawHeartShape(this.ctx, p.x, p.y, p.size, p.color, p.alpha);

                if (p.y < -30) {
                    this.particles[i] = this.createParticle(false);
                }
            }
        }
    }

    drawHeartShape(ctx, x, y, size, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
        ctx.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawSakuraPetal(ctx, x, y, size, rotation, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-size, -size * 1.5, -size * 0.6, -size * 2.2, 0, -size * 2);
        ctx.bezierCurveTo(size * 0.6, -size * 2.2, size, -size * 1.5, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    // Nổ chùm tim khi tương tác
    spawnHeartsExplosion(cx, cy, count = 22) {
        for (let i = 0; i < count; i++) {
            this.spawnFloatingHeart(cx + (Math.random() - 0.5) * 90, cy + (Math.random() - 0.5) * 90);
        }
    }

    spawnFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'touch-particle-heart';
        const emojis = ['💖', '💕', '💘', '✨', '🌸', '🥰', '💍'];
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        const moveX = (Math.random() - 0.5) * 130;
        const moveY = -80 - Math.random() * 110;
        heart.style.setProperty('--tx', `${moveX}px`);
        heart.style.setProperty('--ty', `${moveY}px`);

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }

    initInteractiveTouch() {
        window.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            this.spawnFloatingHeart(e.clientX, e.clientY);
        });
    }

    // ================= KỶ NIỆM & TIMELINE =================
    initMemoryTimeline() {
        const defaultMemories = [
            {
                date: "04/04/2026 (17/02 Bính Ngọ)",
                title: "Ngày Bắt Đầu Tình Yêu 💖",
                desc: "Ngày Gnoul và Minyu chính thức chung đôi, bắt đầu chuyến hành trình tình yêu đẹp đẽ nhất trần đời.",
                tag: "Cột mốc thiêng liêng",
                icon: "💍"
            },
            {
                date: "Buổi Hẹn Đầu Tiên",
                title: "Cái Nắm Tay Ngại Ngùng 🤝",
                desc: "Lần đầu tiên hai đứa cùng dạo phố, nụ cười của Minyu làm tim Gnoul đập loạn xạ.",
                tag: "Kỷ niệm đầu",
                icon: "✨"
            },
            {
                date: "Cùng Nhau Mỗi Ngày",
                title: "Vượt Qua Mọi Thử Thách 🌈",
                desc: "Chỉ cần nhìn thấy nhau là mọi giông bão cuộc đời đều dừng lại sau cánh cửa.",
                tag: "Hạnh phúc giản đơn",
                icon: "🥰"
            }
        ];

        const memories = window.loveStorage ? window.loveStorage.get('love_memories', defaultMemories) : defaultMemories;
        this.renderTimeline(memories);
    }

    renderTimeline(memories) {
        const container = document.getElementById('memory-timeline-list');
        if (!container) return;

        container.innerHTML = memories.map((m, idx) => `
            <div class="timeline-card animate-slide-up" style="animation-delay: ${idx * 0.08}s">
                <div class="timeline-dot-icon">${m.icon || '❤️'}</div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-date">${m.date}</span>
                        <span class="timeline-tag">${m.tag}</span>
                    </div>
                    <h4 class="timeline-title">${m.title}</h4>
                    <p class="timeline-desc">${m.desc}</p>
                </div>
            </div>
        `).join('');
    }

    addMemoryPrompt() {
        const title = prompt("Tiêu đề kỷ niệm mới:", "Kỷ niệm đáng nhớ 💕");
        if (!title) return;
        const desc = prompt("Mô tả khoảnh khắc đó:", "Hôm nay hai đứa cùng...");
        const date = prompt("Ngày diễn ra (hoặc hôm nay):", new Date().toLocaleDateString('vi-VN'));

        const memories = window.loveStorage ? window.loveStorage.get('love_memories', []) : [];
        memories.unshift({
            date: date || "Hôm nay",
            title: title,
            desc: desc || "",
            tag: "Khoảnh khắc mới",
            icon: "📷"
        });

        if (window.loveStorage) window.loveStorage.set('love_memories', memories);
        this.renderTimeline(memories);
        if (window.loveWidgets) window.loveWidgets.showToast("Đã lưu thêm kỷ niệm mới! 💕");
    }

    // ================= CÀI ĐẶT & FIREBASE =================
    initSettingsModal() {
        const savedConfig = window.loveStorage ? window.loveStorage.get('firebase_config', null) : null;
        if (savedConfig) {
            const el = (id) => document.getElementById(id);
            if (el('cfg-api-key')) el('cfg-api-key').value = savedConfig.apiKey || '';
            if (el('cfg-auth-domain')) el('cfg-auth-domain').value = savedConfig.authDomain || '';
            if (el('cfg-database-url')) el('cfg-database-url').value = savedConfig.databaseURL || '';
            if (el('cfg-project-id')) el('cfg-project-id').value = savedConfig.projectId || '';
        }
    }

    saveFirebaseSettings() {
        const el = (id) => document.getElementById(id)?.value?.trim();
        const apiKey = el('cfg-api-key');
        const authDomain = el('cfg-auth-domain');
        const databaseURL = el('cfg-database-url');
        const projectId = el('cfg-project-id');

        if (!apiKey || !databaseURL) {
            alert("Vui lòng nhập ít nhất API Key và Database URL từ Firebase Console để kết nối!");
            return;
        }

        const config = { apiKey, authDomain, databaseURL, projectId };
        const success = window.loveFirebase.connect(config);

        if (success) {
            alert("Kết nối Firebase Realtime Database thành công! Ứng dụng đã sẵn sàng đồng bộ giữa 2 điện thoại của Gnoul & Minyu! 🎉");
        } else {
            alert("Không thể kết nối. Vui lòng kiểm tra lại thông tin cấu hình.");
        }
    }

    disconnectFirebase() {
        if (confirm("Bạn có chắc chắn muốn ngắt kết nối Firebase và chuyển về chế độ Offline?")) {
            window.loveFirebase.disconnect();
            alert("Đã chuyển về chế độ lưu trữ Offline trên máy.");
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('active');
    }
}

if (typeof window !== 'undefined') {
    window.loveApp = new LoveApp();
}
