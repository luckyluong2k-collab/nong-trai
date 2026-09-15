// js/counter.js - Bộ đếm ngày yêu thời gian thực & Cột mốc tình yêu cho Gnoul & Minyu (Pro VIP)

class LoveCounter {
    constructor() {
        // Ngày bắt đầu yêu: 04/04/2026 (dương lịch) = 17/02/2026 (Bính Ngọ Âm lịch)
        this.startDate = new Date(2026, 3, 4, 0, 0, 0); // 04/04/2026 00:00:00
        this.timer = null;
        this.quotes = [
            "Gnoul ❤️ Minyu: Bên nhau từng giây, yêu nhau từng ngày!",
            "Tình yêu không phải là tìm một người hoàn hảo, mà là cùng Minyu tạo nên những điều kỳ diệu.",
            "Cảm ơn em vì đã đến và làm thế giới của Gnoul rực rỡ sắc màu.",
            "Gặp được Minyu là điều may mắn và ngọt ngào nhất trong cuộc đời của Gnoul.",
            "Mỗi khoảnh khắc ở bên nhau đều là một trang nhật ký tuyệt đẹp.",
            "Hôm nay yêu Minyu nhiều hơn hôm qua và ít hơn ngày mai.",
            "Dù cả thế giới có đổi thay, trái tim Gnoul vẫn luôn hướng về Minyu.",
            "Nụ cười của Minyu là ánh nắng sưởi ấm trái tim Gnoul mỗi ngày."
        ];
    }

    start() {
        this.updateCounter();
        this.timer = setInterval(() => this.updateCounter(), 1000);
        this.displayRandomQuote();
        this.updateMilestones();
        this.displayLunarAnniversary();
    }

    displayLunarAnniversary() {
        // Hiển thị ngày âm lịch của ngày bắt đầu yêu và hôm nay
        const startLunarBadge = document.getElementById('anniversary-lunar-badge');
        const todayLunarBadge = document.getElementById('today-lunar-badge');

        if (window.vietnameseLunar) {
            // Ngày bắt đầu yêu: 04/04/2026
            const startLunar = window.vietnameseLunar.convertSolarToLunar(4, 4, 2026);
            if (startLunarBadge && startLunar) {
                startLunarBadge.textContent = `🌕 Âm lịch: Ngày ${startLunar.lunarDay}/${startLunar.lunarMonth} năm ${startLunar.canChiYear}`;
            }

            // Ngày hôm nay
            const today = new Date();
            const todayLunar = window.vietnameseLunar.convertSolarToLunar(today.getDate(), today.getMonth() + 1, today.getFullYear());
            if (todayLunarBadge && todayLunar) {
                todayLunarBadge.innerHTML = `🌕 Hôm nay Âm lịch: <strong>${todayLunar.lunarDay}/${todayLunar.lunarMonth}</strong> (${todayLunar.canChiDay})`;
            }
        }
    }

    updateCounter() {
        const now = new Date();
        let diff = now.getTime() - this.startDate.getTime();
        const isPast = diff >= 0;

        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        // Cập nhật DOM
        const daysEl = document.getElementById('counter-days');
        const hoursEl = document.getElementById('counter-hours');
        const minutesEl = document.getElementById('counter-minutes');
        const secondsEl = document.getElementById('counter-seconds');
        const totalDaysEl = document.getElementById('total-days-badge');

        if (daysEl) daysEl.textContent = days.toLocaleString('vi-VN');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        if (totalDaysEl) totalDaysEl.textContent = `${days} Ngày Yêu`;

        // Tiêu đề phụ
        const subtitleEl = document.getElementById('counter-subtitle');
        if (subtitleEl) {
            subtitleEl.textContent = isPast ? 'Đã ở bên nhau trọn vẹn' : 'Đếm ngược đến ngày chung đôi';
        }
    }

    updateMilestones() {
        const now = new Date();
        const currentDays = Math.floor((now.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));

        const milestoneList = [
            { days: 100, label: '100 Ngày Yêu' },
            { days: 200, label: '200 Ngày Yêu' },
            { days: 365, label: '1 Năm Kỷ Niệm (365 Ngày)' },
            { days: 500, label: '500 Ngày Yêu' },
            { days: 730, label: '2 Năm Kỷ Niệm (730 Ngày)' },
            { days: 1000, label: '1000 Ngày Hạnh Phúc' }
        ];

        // Tìm mốc tiếp theo
        let nextMilestone = milestoneList.find(m => m.days > currentDays);
        if (!nextMilestone) {
            nextMilestone = { days: currentDays + 100, label: `${currentDays + 100} Ngày Yêu` };
        }

        // Tìm mốc gần nhất vừa qua
        const prevMilestoneDays = milestoneList.filter(m => m.days <= currentDays).pop()?.days || 0;
        const progress = Math.min(100, Math.max(0, Math.round(((currentDays - prevMilestoneDays) / (nextMilestone.days - prevMilestoneDays)) * 100)));
        const daysLeft = nextMilestone.days - currentDays;

        const nextLabelEl = document.getElementById('next-milestone-name');
        const daysLeftEl = document.getElementById('milestone-days-left');
        const progressBarEl = document.getElementById('milestone-progress');
        const progressPercentEl = document.getElementById('milestone-percentage');

        if (nextLabelEl) nextLabelEl.textContent = nextMilestone.label;
        if (daysLeftEl) daysLeftEl.textContent = `Còn ${daysLeft} ngày nữa`;
        if (progressBarEl) progressBarEl.style.width = `${progress}%`;
        if (progressPercentEl) progressPercentEl.textContent = `${progress}%`;

        // Render danh sách mốc
        const listContainer = document.getElementById('milestones-grid');
        if (listContainer) {
            listContainer.innerHTML = milestoneList.map(m => {
                const passed = currentDays >= m.days;
                const remaining = m.days - currentDays;
                return `
                    <div class="milestone-item ${passed ? 'passed' : 'upcoming'}">
                        <div class="milestone-icon">${passed ? '🎉' : '⏳'}</div>
                        <div class="milestone-info">
                            <span class="milestone-title">${m.label}</span>
                            <span class="milestone-sub">
                                ${passed ? 'Đã đạt được 💖' : `Còn ${remaining} ngày`}
                            </span>
                        </div>
                        <span class="milestone-badge">${m.days}D</span>
                    </div>
                `;
            }).join('');
        }
    }

    displayRandomQuote() {
        const quoteEl = document.getElementById('love-daily-quote');
        if (quoteEl) {
            const randomIdx = Math.floor(Math.random() * this.quotes.length);
            quoteEl.textContent = `"${this.quotes[randomIdx]}"`;
        }
    }
}

window.loveCounter = new LoveCounter();
