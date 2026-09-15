// js/calendar-events.js - Quản lý Lịch Âm Dương, Sự kiện D-Day & Ngày lễ cho Gnoul & Minyu

class LoveCalendarEvents {
    constructor() {
        this.loveStartDate = new Date(2026, 3, 4); // 04/04/2026
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.customEvents = window.loveStorage ? window.loveStorage.get('custom_couple_events', []) : [];
        this.init();
    }

    init() {
        this.renderCalendarMonth(this.currentYear, this.currentMonth);
        this.renderUpcomingDDays();
    }

    // Danh sách ngày lễ Dương Lịch cố định
    getSolarHolidays() {
        return [
            { day: 1, month: 1, title: "Tết Dương Lịch 🎆", tag: "Nghỉ lễ", icon: "🍾" },
            { day: 14, month: 2, title: "Valentine Đỏ (Lễ Tình Nhân) 💖", tag: "Cặp đôi", icon: "🍫" },
            { day: 8, month: 3, title: "Quốc tế Phụ nữ (Mừng Minyu) 💐", tag: "Tôn vinh em", icon: "🌷" },
            { day: 14, month: 3, title: "Valentine Trắng 🤍", tag: "Cặp đôi", icon: "🍬" },
            { day: 1, month: 4, title: "Cá Tháng Tư 😜", tag: "Vui vẻ", icon: "🤡" },
            { day: 14, month: 4, title: "Valentine Đen 🖤", tag: "Kỷ niệm", icon: "☕" },
            { day: 30, month: 4, title: "Giải Phóng Miền Nam 🇻🇳", tag: "Nghỉ lễ", icon: "⭐" },
            { day: 1, month: 5, title: "Quốc tế Lao Động 💼", tag: "Nghỉ lễ", icon: "🏖️" },
            { day: 1, month: 6, title: "Quốc tế Thiếu Nhi (Em bé Minyu) 🧸", tag: "Cưng chiều em", icon: "🎀" },
            { day: 28, month: 6, title: "Ngày Gia Đình Việt Nam 👨‍👩‍👧", tag: "Ý nghĩa", icon: "🏡" },
            { day: 2, month: 9, title: "Quốc Khánh Việt Nam 🇻🇳", tag: "Nghỉ lễ", icon: "⭐" },
            { day: 20, month: 10, title: "Ngày Phụ Nữ Việt Nam 🌹", tag: "Yêu thương Minyu", icon: "🎁" },
            { day: 31, month: 10, title: "Lễ Hội Halloween 🎃", tag: "Lễ hội", icon: "👻" },
            { day: 20, month: 11, title: "Ngày Nhà Giáo Việt Nam 🎓", tag: "Tri ân", icon: "💐" },
            { day: 24, month: 12, title: "Đêm Giáng Sinh (Noel) 🎄", tag: "Ấm áp bên nhau", icon: "❄️" },
            { day: 25, month: 12, title: "Lễ Giáng Sinh (Noel) 🎅", tag: "Lễ hội", icon: "🔔" },
            { day: 31, month: 12, title: "Đêm Giao Thừa Dương Lịch 🥂", tag: "Đón năm mới", icon: "🎆" }
        ];
    }

    // Danh sách ngày lễ Âm Lịch Việt Nam cố định
    getLunarHolidays() {
        return [
            { lDay: 1, lMonth: 1, title: "Mùng 1 Tết Nguyên Đán 🧧", tag: "Tết cổ truyền", icon: "🌸" },
            { lDay: 2, lMonth: 1, title: "Mùng 2 Tết Nguyên Đán 🎋", tag: "Tết cổ truyền", icon: "🥟" },
            { lDay: 3, lMonth: 1, title: "Mùng 3 Tết Nguyên Đán 🎍", tag: "Tết cổ truyền", icon: "🍊" },
            { lDay: 15, lMonth: 1, title: "Tết Nguyên Tiêu (Rằm tháng Giêng) 🏮", tag: "Lễ hội", icon: "🌕" },
            { lDay: 10, lMonth: 3, title: "Giỗ Tổ Hùng Vương 🇻🇳", tag: "Nghỉ lễ", icon: "🏛️" },
            { lDay: 15, lMonth: 4, title: "Lễ Phật Đản 🪷", tag: "Lễ hội", icon: "🕯️" },
            { lDay: 5, lMonth: 5, title: "Tết Đoan Ngọ (Giết sâu bọ) 🍉", tag: "Lễ hội", icon: "🍇" },
            { lDay: 7, lMonth: 7, title: "Lễ Thất Tịch (Ngưu Lang - Chức Nữ) 🥣", tag: "Ăn chè đậu đỏ 💕", icon: "✨" },
            { lDay: 15, lMonth: 7, title: "Lễ Vu Lan Báo Hiếu 🕯️", tag: "Ý nghĩa", icon: "🪷" },
            { lDay: 15, lMonth: 8, title: "Tết Trung Thu (Rằm tháng Tám) 🥮", tag: "Rước đèn ngắm trăng", icon: "🌕" },
            { lDay: 23, lMonth: 12, title: "Tiễn Táo Quân Về Trời 🐟", tag: "Phong tục", icon: "🎏" }
        ];
    }

    // Kỷ niệm tình yêu tự động tính từ 04/04/2026
    getCoupleMilestones() {
        const milestones = [
            { days: 100, title: "Kỷ Niệm 100 Ngày Yêu 💖", icon: "💯" },
            { days: 200, title: "Kỷ Niệm 200 Ngày Yêu 💕", icon: "🎉" },
            { days: 300, title: "Kỷ Niệm 300 Ngày Yêu 🌸", icon: "💐" },
            { days: 365, title: "1 Năm Kỷ Niệm Tình Yêu (04/04/2027) 💍", icon: "🎂" },
            { days: 500, title: "Kỷ Niệm 500 Ngày Yêu 🌟", icon: "✨" },
            { days: 730, title: "2 Năm Kỷ Niệm Tình Yêu (04/04/2028) 👑", icon: "🥂" },
            { days: 1000, title: "Kỷ Niệm 1000 Ngày Hạnh Phúc ♾️", icon: "🏰" }
        ];

        return milestones.map(m => {
            const date = new Date(this.loveStartDate.getTime() + m.days * 24 * 60 * 60 * 1000);
            return {
                title: m.title,
                targetDate: date,
                tag: "Kỷ niệm đôi",
                icon: m.icon,
                isMilestone: true,
                daysCount: m.days
            };
        });
    }

    // Thu thập tất cả sự kiện sắp tới cho năm hiện tại và năm tới
    getAllUpcomingEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentYear = today.getFullYear();
        const years = [currentYear, currentYear + 1];
        let events = [];

        // 1. Ngày lễ Dương Lịch
        this.getSolarHolidays().forEach(h => {
            years.forEach(y => {
                const target = new Date(y, h.month - 1, h.day);
                events.push({
                    title: h.title,
                    targetDate: target,
                    tag: h.tag,
                    icon: h.icon,
                    type: 'solar_holiday'
                });
            });
        });

        // 2. Ngày lễ Âm Lịch Việt Nam
        if (window.vietnameseLunar) {
            this.getLunarHolidays().forEach(h => {
                years.forEach(y => {
                    const solar = window.vietnameseLunar.convertLunarToSolar(h.lDay, h.lMonth, y);
                    if (solar && solar.date) {
                        events.push({
                            title: h.title,
                            targetDate: solar.date,
                            tag: h.tag,
                            icon: h.icon,
                            type: 'lunar_holiday',
                            lunarDesc: `${h.lDay}/${h.lMonth} Âm lịch`
                        });
                    }
                });
            });
        }

        // 3. Mốc kỷ niệm tình yêu
        this.getCoupleMilestones().forEach(m => {
            events.push({
                ...m,
                type: 'couple_milestone'
            });
        });

        // 4. Sự kiện do Gnoul & Minyu tự tạo
        this.customEvents.forEach(c => {
            const target = new Date(c.date);
            events.push({
                title: c.title,
                targetDate: target,
                tag: c.tag || "Kỷ niệm riêng",
                icon: c.icon || "❤️",
                type: 'custom_event',
                id: c.id
            });
        });

        // Tính khoảng cách ngày và lọc các sự kiện trong tương lai (hoặc hôm nay)
        events = events.map(e => {
            const target = new Date(e.targetDate);
            target.setHours(0, 0, 0, 0);
            const diffTime = target.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            return {
                ...e,
                diffDays: diffDays,
                dDayText: diffDays === 0 ? "D-Day (Hôm nay)" : (diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`),
                formattedDate: `${target.getDate().toString().padStart(2, '0')}/${(target.getMonth() + 1).toString().padStart(2, '0')}/${target.getFullYear()}`
            };
        });

        // Sắp xếp: sự kiện gần nhất lên đầu
        events.sort((a, b) => {
            if (a.diffDays >= 0 && b.diffDays >= 0) return a.diffDays - b.diffDays;
            if (a.diffDays < 0 && b.diffDays < 0) return b.diffDays - a.diffDays;
            return a.diffDays >= 0 ? -1 : 1;
        });

        return events;
    }

    // Render danh sách D-Day Card
    renderUpcomingDDays() {
        const container = document.getElementById('dday-events-list');
        const nextDDayBanner = document.getElementById('widget-next-dday-banner');
        if (!container) return;

        const events = this.getAllUpcomingEvents();
        // Lấy sự kiện chưa trôi qua (diffDays >= 0)
        const upcoming = events.filter(e => e.diffDays >= 0);

        // Cập nhật banner sự kiện gần nhất cho widget Home
        if (nextDDayBanner && upcoming.length > 0) {
            const nearest = upcoming[0];
            nextDDayBanner.innerHTML = `
                <div class="dday-banner-inner">
                    <div class="dday-banner-icon">${nearest.icon}</div>
                    <div class="dday-banner-info">
                        <span class="dday-banner-title">${nearest.title}</span>
                        <span class="dday-banner-date">${nearest.formattedDate} • ${nearest.tag}</span>
                    </div>
                    <div class="dday-banner-badge ${nearest.diffDays === 0 ? 'today' : ''}">
                        ${nearest.dDayText}
                    </div>
                </div>
            `;
        }

        container.innerHTML = upcoming.slice(0, 15).map(e => `
            <div class="dday-item-card ${e.diffDays === 0 ? 'is-today' : ''}">
                <div class="dday-icon-circle">${e.icon}</div>
                <div class="dday-details">
                    <div class="dday-name">${e.title}</div>
                    <div class="dday-sub">
                        <span>🗓️ ${e.formattedDate}</span>
                        ${e.lunarDesc ? `<span class="dday-lunar-tag">🌕 ${e.lunarDesc}</span>` : ''}
                        <span class="dday-tag-pill">${e.tag}</span>
                    </div>
                </div>
                <div class="dday-countdown-badge ${e.diffDays <= 7 ? 'urgent' : ''}">
                    ${e.dDayText}
                </div>
            </div>
        `).join('');
    }

    // ================= DUAL CALENDAR GENERATOR =================
    renderCalendarMonth(year, month) {
        const titleEl = document.getElementById('calendar-month-title');
        const gridEl = document.getElementById('calendar-days-grid');
        if (!gridEl) return;

        this.currentYear = year;
        this.currentMonth = month;

        const monthNames = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];
        if (titleEl) titleEl.textContent = `${monthNames[month]} • ${year}`;

        // Xác định ngày bắt đầu của tháng và tổng số ngày
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();

        // 0: CN, 1: T2, ... -> đổi sang T2 là cột 0
        let startCol = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        let cellsHtml = '';

        // Ô trống đầu tháng
        for (let i = 0; i < startCol; i++) {
            cellsHtml += '<div class="calendar-cell empty"></div>';
        }

        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        const todayDate = today.getDate();

        // Danh sách sự kiện để chấm dot
        const allEvents = this.getAllUpcomingEvents();

        for (let day = 1; day <= totalDays; day++) {
            const cellDate = new Date(year, month, day);
            const isToday = isCurrentMonth && day === todayDate;

            // Tính Âm lịch
            let lunarText = "";
            let isFirstLunarDay = false;
            if (window.vietnameseLunar) {
                const lunar = window.vietnameseLunar.convertSolarToLunar(day, month + 1, year);
                if (lunar) {
                    if (lunar.lunarDay === 1 || day === 1) {
                        lunarText = `${lunar.lunarDay}/${lunar.lunarMonth}`;
                        isFirstLunarDay = true;
                    } else if (lunar.lunarDay === 15) {
                        lunarText = "15 🌕";
                    } else {
                        lunarText = `${lunar.lunarDay}`;
                    }
                }
            }

            // Kiểm tra có sự kiện hoặc ngày kỷ niệm không
            const hasEvent = allEvents.some(e => {
                const d = new Date(e.targetDate);
                return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
            });

            // Ngày bắt đầu yêu 04/04/2026 đặc biệt
            const isLoveStart = year === 2026 && month === 3 && day === 4;

            cellsHtml += `
                <div class="calendar-cell ${isToday ? 'today' : ''} ${isLoveStart ? 'love-start' : ''}" onclick="window.loveCalendar.showDateDetails(${day}, ${month + 1}, ${year})">
                    <span class="solar-num">${day}</span>
                    <span class="lunar-num ${isFirstLunarDay ? 'lunar-first' : ''}">${lunarText}</span>
                    ${hasEvent || isLoveStart ? '<span class="cell-event-dot"></span>' : ''}
                </div>
            `;
        }

        gridEl.innerHTML = cellsHtml;
    }

    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentYear--;
            this.currentMonth = 11;
        } else {
            this.currentMonth--;
        }
        this.renderCalendarMonth(this.currentYear, this.currentMonth);
    }

    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentYear++;
            this.currentMonth = 0;
        } else {
            this.currentMonth++;
        }
        this.renderCalendarMonth(this.currentYear, this.currentMonth);
    }

    // Hiển thị chi tiết ngày khi chạm vào lịch
    showDateDetails(day, month, year) {
        if (!window.vietnameseLunar) return;
        const lunar = window.vietnameseLunar.convertSolarToLunar(day, month, year);

        // Tìm sự kiện trong ngày này
        const allEvents = this.getAllUpcomingEvents();
        const matched = allEvents.filter(e => {
            const d = new Date(e.targetDate);
            return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
        });

        const isLoveStart = year === 2026 && month === 4 && day === 4;

        let eventsStr = matched.length > 0
            ? matched.map(m => `✨ <strong>${m.title}</strong> (${m.tag})`).join('<br>')
            : "Không có ngày lễ lớn.";

        if (isLoveStart) {
            eventsStr = `💖 <strong>Ngày Bắt Đầu Tình Yêu Của Gnoul & Minyu!</strong> 💕<br>` + eventsStr;
        }

        const modal = document.getElementById('modal-date-details');
        const content = document.getElementById('date-details-content');
        if (modal && content) {
            content.innerHTML = `
                <div style="text-align: center; margin-bottom: 12px;">
                    <span style="font-size: 38px;">🗓️</span>
                    <h3 style="font-size: 18px; color: var(--primary); margin: 6px 0 2px;">
                        Ngày ${day} Tháng ${month}, ${year}
                    </h3>
                    <div style="font-size: 13px; color: var(--text-muted);">Dương Lịch</div>
                </div>

                <div class="date-details-card">
                    <div class="date-detail-row">
                        <span class="detail-label">🌕 Âm Lịch:</span>
                        <span class="detail-val"><strong>${lunar.lunarDay}/${lunar.lunarMonth}</strong> năm ${lunar.canChiYear} (${lunar.conGiap})</span>
                    </div>
                    <div class="date-detail-row">
                        <span class="detail-label">🎋 Can Chi Ngày:</span>
                        <span class="detail-val">${lunar.canChiDay}</span>
                    </div>
                    <div class="date-detail-row">
                        <span class="detail-label">🌿 Tiết Khí:</span>
                        <span class="detail-val">${lunar.tietKhi || "Bình thường"}</span>
                    </div>
                </div>

                <div class="date-details-card" style="margin-top: 10px;">
                    <div style="font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 6px;">Sự Kiện & Kỷ Niệm:</div>
                    <div style="font-size: 13px; line-height: 1.5;">${eventsStr}</div>
                </div>
            `;
            modal.classList.add('active');
        }
    }

    // Thêm sự kiện tùy chỉnh mới
    addCustomEventPrompt() {
        const title = prompt("Tên sự kiện / ngày kỷ niệm mới:", "Kỷ niệm chuyến đi Đà Lạt 💕");
        if (!title) return;

        const dateStr = prompt("Ngày diễn ra (định dạng YYYY-MM-DD, ví dụ: 2026-10-20):", new Date().toISOString().split('T')[0]);
        if (!dateStr) return;

        const icon = prompt("Icon biểu tượng (emoji):", "💖") || "💖";
        const tag = prompt("Phân loại (ví dụ: Kỷ niệm đôi, Sinh nhật...):", "Kỷ niệm đôi") || "Kỷ niệm đôi";

        const newEvent = {
            id: 'evt_' + Date.now(),
            title: title.trim(),
            date: dateStr,
            icon: icon.trim(),
            tag: tag.trim()
        };

        this.customEvents.push(newEvent);
        if (window.loveStorage) window.loveStorage.set('custom_couple_events', this.customEvents);

        this.renderUpcomingDDays();
        this.renderCalendarMonth(this.currentYear, this.currentMonth);
        if (window.loveWidgets) window.loveWidgets.showToast("Đã lưu sự kiện kỷ niệm mới! 🎉");
    }
}

if (typeof window !== 'undefined') {
    window.loveCalendar = new LoveCalendarEvents();
}
