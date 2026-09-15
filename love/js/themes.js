// js/themes.js - Quản lý 5 Bộ Theme Pro VIP & Hiệu Ứng Hạt Nền Đa Dạng

class LoveThemes {
    constructor() {
        this.currentTheme = window.loveStorage ? window.loveStorage.get('active_theme', 'rose-gold') : 'rose-gold';
        this.currentParticle = window.loveStorage ? window.loveStorage.get('active_particle', 'hearts') : 'hearts';
        this.themes = [
            {
                id: 'rose-gold',
                name: 'Rose Gold Luxury 👑',
                desc: 'Vàng hồng quý tộc, viền kim loại sang chảnh',
                preview: 'linear-gradient(135deg, #ffccd5, #ffedf2, #e8dff5)'
            },
            {
                id: 'sakura',
                name: 'Sakura Blossom 🌸',
                desc: 'Hồng phấn hoa anh đào, cánh hoa rơi lãng mạn',
                preview: 'linear-gradient(135deg, #ffd6e0, #ffb3c6, #ffdfec)'
            },
            {
                id: 'midnight',
                name: 'Midnight Galaxy 🌌',
                desc: 'Bầu trời đêm ngàn sao và dải ngân hà huyền ảo',
                preview: 'linear-gradient(135deg, #1e1338, #2a1b4e, #472b7a)'
            },
            {
                id: 'matcha',
                name: 'Matcha & Milk Tea 🍵',
                desc: 'Xanh bơ thanh mát và nâu trà sữa ấm áp',
                preview: 'linear-gradient(135deg, #d8f3dc, #b7e4c7, #fefae0)'
            },
            {
                id: 'cyberpunk',
                name: 'Cyberpunk Neon Love ⚡',
                desc: 'Hồng & xanh neon phát sáng thời thượng',
                preview: 'linear-gradient(135deg, #0d0221, #0f084b, #26085a)'
            }
        ];
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme, false);
    }

    applyTheme(themeId, notify = true) {
        this.currentTheme = themeId;
        if (window.loveStorage) window.loveStorage.set('active_theme', themeId);

        const container = document.querySelector('.device-container') || document.body;
        document.body.setAttribute('data-theme', themeId);
        container.setAttribute('data-theme', themeId);

        // Đổi loại hạt nền tương ứng
        if (themeId === 'sakura') {
            this.setParticleType('sakura');
        } else if (themeId === 'midnight' || themeId === 'cyberpunk') {
            this.setParticleType('stars');
        } else {
            this.setParticleType('hearts');
        }

        if (notify && window.loveWidgets) {
            const themeObj = this.themes.find(t => t.id === themeId);
            window.loveWidgets.showToast(`Đã áp dụng Theme: ${themeObj?.name || themeId}! ✨`);
            if (window.loveAudio) window.loveAudio.playPop();
        }

        this.renderThemeSelectorUI();
    }

    setParticleType(type) {
        this.currentParticle = type;
        if (window.loveStorage) window.loveStorage.set('active_particle', type);
        if (window.loveApp && window.loveApp.updateParticleType) {
            window.loveApp.updateParticleType(type);
        }
    }

    openThemeModal() {
        const modal = document.getElementById('modal-theme-picker');
        if (!modal) return;
        this.renderThemeSelectorUI();
        modal.classList.add('active');
    }

    renderThemeSelectorUI() {
        const grid = document.getElementById('theme-options-grid');
        if (!grid) return;

        grid.innerHTML = this.themes.map(t => `
            <div class="theme-card-item ${this.currentTheme === t.id ? 'selected' : ''}" onclick="window.loveThemes.applyTheme('${t.id}')">
                <div class="theme-preview-color" style="background: ${t.preview}"></div>
                <div class="theme-card-info">
                    <div class="theme-card-name">${t.name}</div>
                    <div class="theme-card-desc">${t.desc}</div>
                </div>
                ${this.currentTheme === t.id ? '<span class="theme-badge-check">✓</span>' : ''}
            </div>
        `).join('');
    }
}

if (typeof window !== 'undefined') {
    window.loveThemes = new LoveThemes();
}
