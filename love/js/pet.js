// js/pet.js - Thú Cưng Tình Yêu SumOne-Style (Lớn lên theo ngày yêu của Gnoul & Minyu)

class LovePet {
    constructor() {
        this.petName = window.loveStorage ? window.loveStorage.get('pet_name', 'Bé Bông 💕') : 'Bé Bông 💕';
        this.happiness = window.loveStorage ? window.loveStorage.get('pet_happiness', 85) : 85;
        this.quotes = [
            "Gnoul & Minyu hôm nay đã nói lời yêu thương nhau chưa nè? 🥰",
            "Mỗi ngày nhìn thấy hai bạn bên nhau làm em vui lắm luôn á! 💕",
            "Minyu ơi, Gnoul lúc nào cũng nhớ đến bạn đó nha! 🍓",
            "Gnoul ơi, nhớ mua trà sữa và dỗ dành Minyu nhé! 🧋",
            "Hạnh phúc là khi hai trái tim luôn hướng về nhau! ✨",
            "Em đang lớn lên từng ngày nhờ tình yêu ngọt ngào của hai bạn! 💖"
        ];
        this.init();
    }

    init() {
        this.renderPetUI();
    }

    getPetStage() {
        // Tính theo số ngày yêu từ 04/04/2026
        const startDate = new Date(2026, 3, 4);
        const now = new Date();
        const days = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

        if (days < 30) {
            return {
                level: 1,
                title: "Trứng Tình Yêu 🥚",
                avatar: "🥚",
                desc: "Đang được sưởi ấm bởi tình yêu của Gnoul & Minyu"
            };
        } else if (days < 100) {
            return {
                level: 2,
                title: "Bé Mầm Yêu Thương 🌱",
                avatar: "🐥",
                desc: "Vừa nở ra và đang chập chững biết nhớ thương"
            };
        } else if (days < 200) {
            return {
                level: 3,
                title: "Mèo Bông Ngọt Ngào 🐱",
                avatar: "🐱",
                desc: "Biết làm nũng và thích được hai bạn xoa đầu"
            };
        } else if (days < 365) {
            return {
                level: 4,
                title: "Bé Thỏ Vương Miện 🐰👑",
                avatar: "🐰",
                desc: "Trưởng thành và luôn canh giữ tình yêu bền chặt"
            };
        } else {
            return {
                level: 5,
                title: "Kỳ Lân Thần Thoại 🦄💖",
                avatar: "🦄",
                desc: "Biểu tượng tình yêu vĩnh cửu của Gnoul & Minyu"
            };
        }
    }

    renderPetUI() {
        const container = document.getElementById('love-pet-card-content');
        if (!container) return;

        const stage = this.getPetStage();
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];

        container.innerHTML = `
            <div class="pet-wrapper">
                <div class="pet-speech-bubble" id="pet-speech">
                    "${randomQuote}"
                </div>

                <div class="pet-avatar-stage" onclick="window.lovePet.interactPet()">
                    <div class="pet-glow-aura"></div>
                    <span class="pet-char-emoji">${stage.avatar}</span>
                    <span class="pet-heart-float">💖</span>
                </div>

                <div class="pet-info-box">
                    <div class="pet-name-tag">
                        <span>${this.petName}</span>
                        <span class="pet-level-badge">Lv.${stage.level} ${stage.title}</span>
                    </div>
                    
                    <div class="pet-happiness-bar-wrap">
                        <div class="pet-happy-label">
                            <span>Độ Hạnh Phúc 🌟</span>
                            <span>${this.happiness}%</span>
                        </div>
                        <div class="pet-happy-track">
                            <div class="pet-happy-fill" style="width: ${this.happiness}%"></div>
                        </div>
                    </div>

                    <div class="pet-actions-row">
                        <button class="pet-act-btn" onclick="window.lovePet.feedPet()">🍰 Cho ăn bánh</button>
                        <button class="pet-act-btn" onclick="window.lovePet.patPet()">✨ Vuốt ve</button>
                        <button class="pet-act-btn" onclick="window.lovePet.renamePetPrompt()">✏️ Đổi tên</button>
                    </div>
                </div>
            </div>
        `;
    }

    interactPet() {
        if (window.loveAudio) window.loveAudio.playPop();
        if (window.loveApp) window.loveApp.spawnFloatingHeart(window.innerWidth / 2, window.innerHeight / 2);

        const speechEl = document.getElementById('pet-speech');
        if (speechEl) {
            const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            speechEl.textContent = `"${quote}"`;
            speechEl.classList.add('bounce');
            setTimeout(() => speechEl.classList.remove('bounce'), 400);
        }

        // Tăng nhẹ độ hạnh phúc
        this.addHappiness(2);
    }

    feedPet() {
        this.addHappiness(5);
        if (window.loveAudio) window.loveAudio.playWin();
        if (window.loveWidgets) window.loveWidgets.showToast(`${this.petName} đã được ăn bánh ngọt no nê! 🍰✨`);
    }

    patPet() {
        this.addHappiness(3);
        if (window.loveAudio) window.loveAudio.playHeartSound();
        if (window.loveWidgets) window.loveWidgets.showToast(`${this.petName} dụi đầu vào tay bạn rất thích thú! 🥰`);
    }

    addHappiness(amount) {
        this.happiness = Math.min(100, this.happiness + amount);
        if (window.loveStorage) window.loveStorage.set('pet_happiness', this.happiness);
        const fill = document.querySelector('.pet-happy-fill');
        const label = document.querySelector('.pet-happy-label span:last-child');
        if (fill) fill.style.width = `${this.happiness}%`;
        if (label) label.textContent = `${this.happiness}%`;
    }

    renamePetPrompt() {
        const newName = prompt("Đặt tên mới cho thú cưng tình yêu của hai bạn:", this.petName);
        if (newName && newName.trim()) {
            this.petName = newName.trim();
            if (window.loveStorage) window.loveStorage.set('pet_name', this.petName);
            this.renderPetUI();
        }
    }
}

if (typeof window !== 'undefined') {
    window.lovePet = new LovePet();
}
