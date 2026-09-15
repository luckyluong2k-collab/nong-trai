// js/capsule.js - Hộp Thư Bí Mật Tương Lai & Ổ Khóa Tình Yêu (Love Capsule)

class LoveCapsule {
    constructor() {
        this.capsules = window.loveStorage ? window.loveStorage.get('love_capsules', this.getDefaultCapsule()) : this.getDefaultCapsule();
        this.init();
    }

    getDefaultCapsule() {
        return [
            {
                id: 'cap_1',
                sender: 'gnoul',
                recipient: 'minyu',
                title: 'Bức Thư Mở Vào Kỷ Niệm 1 Năm 💍',
                content: 'Gửi Minyu - cô gái nhỏ làm thay đổi cả thế giới của anh! Nếu em đang đọc lá thư này, nghĩa là chúng mình đã cùng nhau đi qua trọn vẹn 365 ngày ngọt ngào kể từ ngày 04/04/2026. Cảm ơn em vì đã luôn ở bên, bao dung và yêu thương anh. Gnoul yêu Minyu nhiều hơn bất cứ điều gì trên thế giới này! 💕',
                unlockDate: '2027-04-04T00:00:00.000Z',
                createdAt: '2026-04-04T00:00:00.000Z'
            }
        ];
    }

    init() {
        this.renderCapsulesList();
    }

    renderCapsulesList() {
        const container = document.getElementById('capsules-cards-container');
        if (!container) return;

        const now = new Date();

        if (this.capsules.length === 0) {
            container.innerHTML = `
                <div class="capsule-empty-box" onclick="window.loveCapsule.createCapsulePrompt()">
                    <span style="font-size: 36px;">✉️</span>
                    <p>Chưa có bức thư bí mật nào.</p>
                    <button class="capsule-create-btn">+ Niêm Phong Bức Thư Đầu Tiên</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.capsules.map(cap => {
            const unlock = new Date(cap.unlockDate);
            const isUnlocked = now >= unlock;
            const diffDays = Math.ceil((unlock - now) / (1000 * 60 * 60 * 24));
            const senderName = cap.sender === 'gnoul' ? 'Gnoul 🤴' : 'Minyu 👸';
            const recipientName = cap.recipient === 'gnoul' ? 'Gnoul' : 'Minyu';

            return `
                <div class="capsule-card ${isUnlocked ? 'unlocked' : 'locked'}" onclick="window.loveCapsule.openCapsule('${cap.id}')">
                    <div class="capsule-lock-badge">
                        ${isUnlocked ? '🔓 ĐÃ MỞ KHÓA' : `🔒 CÒN ${diffDays} NGÀY`}
                    </div>

                    <div class="capsule-icon-wrap">
                        ${isUnlocked ? '💌' : '🔐'}
                    </div>

                    <div class="capsule-body">
                        <div class="capsule-title">${cap.title}</div>
                        <div class="capsule-meta">
                            <span>Từ: ${senderName} ➔ ${recipientName}</span>
                            <span>Mở vào: ${unlock.toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>

                    <div class="capsule-status-text">
                        ${isUnlocked ? 'Chạm để đọc thư 💖' : 'Ổ khóa tình yêu đang niêm phong ✨'}
                    </div>
                </div>
            `;
        }).join('');
    }

    openCapsule(id) {
        const cap = this.capsules.find(c => c.id === id);
        if (!cap) return;

        const now = new Date();
        const unlock = new Date(cap.unlockDate);
        const isUnlocked = now >= unlock;

        if (!isUnlocked) {
            // Còn bị khóa
            if (window.loveAudio) window.loveAudio.playPop();
            const diffDays = Math.ceil((unlock - now) / (1000 * 60 * 60 * 24));
            alert(`🔒 Ổ Khóa Tình Yêu Đang Được Niêm Phong!\n\nBức thư này được hẹn giờ mở vào ngày ${unlock.toLocaleDateString('vi-VN')} (còn ${diffDays} ngày nữa).\nHãy cùng kiên nhẫn chờ đợi khoảnh khắc ngọt ngào này nhé! 💕`);
            return;
        }

        // Đã mở khóa
        if (window.loveAudio) window.loveAudio.playWin();
        if (window.loveApp) window.loveApp.spawnHeartsExplosion(window.innerWidth / 2, window.innerHeight / 2);

        const modal = document.getElementById('modal-capsule-letter');
        const content = document.getElementById('capsule-letter-content');
        if (modal && content) {
            content.innerHTML = `
                <div class="letter-stamp">💌 LOVE SEALED</div>
                <h3 class="letter-title">${cap.title}</h3>
                <div class="letter-meta">
                    Viết bởi: <strong>${cap.sender === 'gnoul' ? 'Gnoul' : 'Minyu'}</strong> • Ngày mở: ${unlock.toLocaleDateString('vi-VN')}
                </div>
                <div class="letter-text-body">
                    ${cap.content.replace(/\n/g, '<br>')}
                </div>
                <div class="letter-signature">
                    Mãi mãi yêu nhau • Gnoul ❤️ Minyu
                </div>
            `;
            modal.classList.add('active');
        }
    }

    createCapsulePrompt() {
        const title = prompt("Tiêu đề bức thư bí mật:", "Thư gửi Minyu vào ngày kỷ niệm 1 năm 💕");
        if (!title) return;

        const content = prompt("Nội dung tâm sự bí mật bạn muốn gửi gắm:", "Em yêu à, những ngày qua bên em là điều tuyệt vời nhất...");
        if (!content) return;

        const dateStr = prompt("Ngày mở khóa thư (định dạng YYYY-MM-DD, ví dụ: 2027-04-04):", "2027-04-04");
        if (!dateStr) return;

        const role = window.loveStorage ? window.loveStorage.get('current_role', 'gnoul') : 'gnoul';
        const partner = role === 'gnoul' ? 'minyu' : 'gnoul';

        const newCapsule = {
            id: 'cap_' + Date.now(),
            sender: role,
            recipient: partner,
            title: title.trim(),
            content: content.trim(),
            unlockDate: new Date(dateStr + 'T00:00:00').toISOString(),
            createdAt: new Date().toISOString()
        };

        this.capsules.unshift(newCapsule);
        if (window.loveStorage) window.loveStorage.set('love_capsules', this.capsules);

        this.renderCapsulesList();
        if (window.loveAudio) window.loveAudio.playWin();
        if (window.loveWidgets) window.loveWidgets.showToast("Đã niêm phong bức thư bí mật thành công! 🔐💖");
    }
}

if (typeof window !== 'undefined') {
    window.loveCapsule = new LoveCapsule();
}
