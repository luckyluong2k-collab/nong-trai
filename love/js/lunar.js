// js/lunar.js - Thuật toán chuyển đổi Dương lịch <-> Âm lịch Việt Nam chuẩn múi giờ UTC+7 (Hồ Ngọc Đức)

class VietnameseLunarCalendar {
    constructor() {
        this.CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
        this.CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
        this.CON_GIAP = ["Chuột 🐭", "Trâu 🐂", "Hổ 🐯", "Mèo 🐱", "Rồng 🐲", "Rắn 🐍", "Ngựa 🐴", "Dê 🐐", "Khỉ 🐵", "Gà 🐔", "Chó 🐶", "Lợn 🐷"];
        this.TIET_KHI = [
            "Xuân phân", "Thanh minh", "Cốc vũ", "Lập hạ", "Tiểu mãn", "Mang chủng",
            "Hạ chí", "Tiểu thử", "Đại thử", "Lập thu", "Xử thử", "Bạch lộ",
            "Thu phân", "Hàn lộ", "Sương giáng", "Lập đông", "Tiểu tuyết", "Đại tuyết",
            "Đông chí", "Tiểu hàn", "Đại hàn", "Lập xuân", "Vũ thủy", "Kinh trập"
        ];
    }

    jdFromDate(dd, mm, yy) {
        let a = Math.floor((14 - mm) / 12);
        let y = yy + 4800 - a;
        let m = mm + 12 * a - 3;
        let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        if (jd < 2299161) {
            jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
        }
        return jd;
    }

    jdToDate(jd) {
        let a, b, c, d, e, m, day, month, year;
        if (jd > 2299160) {
            let a1 = Math.floor((jd - 1867216.25) / 36524.25);
            a = jd + 1 + a1 - Math.floor(a1 / 4);
        } else {
            a = jd;
        }
        b = a + 1524;
        c = Math.floor((b - 122.1) / 365.25);
        d = Math.floor(365.25 * c);
        e = Math.floor((b - d) / 30.6001);
        day = Math.floor(b - d - Math.floor(30.6001 * e));
        month = e < 14 ? e - 1 : e - 13;
        year = month > 2 ? c - 4716 : c - 4715;
        return [day, month, year];
    }

    getNewMoonDay(k, timeZone = 7) {
        let T = k / 1236.85;
        let T2 = T * T;
        let T3 = T2 * T;
        let dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
        C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
        C1 += 0.0104 * Math.sin(2 * F * dr) - 0.0051 * Math.sin((M + Mpr) * dr);
        C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
        C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
        C1 += 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
        let deltat = 0;
        if (T < -4) {
            deltat = 102.3 + 123.5 * T + 32.5 * T2;
        } else if (T < -1.5) {
            deltat = 5.3 + 18.5 * T + 6.3 * T2;
        } else {
            deltat = 0.4 + 1.2 * T + 0.0005 * T2;
        }
        let JdNew = Jd1 + C1 - deltat / 86400;
        return Math.floor(JdNew + 0.5 + timeZone / 24);
    }

    getSunLongitude(dayNumber, timeZone = 7) {
        let T = (dayNumber - 2451545.0 + 0.5 - timeZone / 24) / 36525;
        let T2 = T * T;
        let dr = Math.PI / 180;
        let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        let C = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        C += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
        let theta = L0 + C;
        theta = theta * dr;
        theta = theta - Math.PI * 2 * Math.floor(theta / (Math.PI * 2));
        return Math.floor((theta / Math.PI) * 6);
    }

    getLunarMonth11(yy, timeZone = 7) {
        let off = this.jdFromDate(31, 12, yy) - 2415021;
        let k = Math.floor(off / 29.530588853);
        let nm = this.getNewMoonDay(k, timeZone);
        let sunLong = this.getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = this.getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    }

    getLeapMonthOffset(a11, timeZone = 7) {
        let k = Math.floor((a11 - 2415021.0769986) / 29.530588853);
        let last = 0;
        let i = 1;
        let arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc !== last && i < 14);
        return i - 1;
    }

    // Chuyển đổi ngày Dương lịch sang Âm lịch Việt Nam chuẩn
    convertSolarToLunar(dd, mm, yy, timeZone = 7) {
        let dayNumber = this.jdFromDate(dd, mm, yy);
        let k = Math.floor((dayNumber - 2415021.0769986) / 29.530588853);
        let monthStart = this.getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = this.getNewMoonDay(k, timeZone);
        }
        let a11 = this.getLunarMonth11(yy, timeZone);
        let b11 = a11;
        let lunarYear;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = this.getLunarMonth11(yy - 1, timeZone);
        } else {
            lunarYear = yy + 1;
            b11 = this.getLunarMonth11(yy + 1, timeZone);
        }
        let lunarDay = dayNumber - monthStart + 1;
        let diff = Math.floor((monthStart - a11) / 29);
        let lunarLeap = 0;
        let lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            let leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff === leapMonthDiff) {
                    lunarLeap = 1;
                }
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }

        // Tính Can Chi chuẩn xác
        const canChiNam = `${this.CAN[(lunarYear + 6) % 10]} ${this.CHI[(lunarYear + 8) % 12]}`;
        const canChiThang = `${this.CAN[(lunarYear * 12 + lunarMonth + 3) % 10]} ${this.CHI[(lunarMonth + 1) % 12]}`;
        const canChiNgay = `${this.CAN[(dayNumber + 9) % 10]} ${this.CHI[(dayNumber + 1) % 12]}`;
        const conGiap = this.CON_GIAP[(lunarYear + 8) % 12];

        // Tiết khí
        const tietKhiIdx = this.getSunLongitude(dayNumber, timeZone);
        const tietKhi = this.TIET_KHI[tietKhiIdx] || "";

        return {
            lunarDay: Math.floor(lunarDay),
            lunarMonth: Math.floor(lunarMonth),
            lunarYear: Math.floor(lunarYear),
            isLeap: Boolean(lunarLeap),
            canChiYear: canChiNam,
            canChiMonth: canChiThang,
            canChiDay: canChiNgay,
            conGiap: conGiap,
            tietKhi: tietKhi,
            fullText: `Ngày ${lunarDay}/${lunarMonth}${lunarLeap ? ' (Nhuận)' : ''} năm ${canChiNam} (${conGiap})`
        };
    }

    // Chuyển đổi Âm Lịch sang Dương Lịch (Quét chính xác trong năm)
    convertLunarToSolar(lunarDay, lunarMonth, lunarYear, isLeap = false, timeZone = 7) {
        let startJd = this.jdFromDate(1, 1, lunarYear);
        let endJd = this.jdFromDate(31, 3, lunarYear + 1);

        for (let jd = startJd; jd <= endJd; jd++) {
            let [d, m, y] = this.jdToDate(jd);
            let lunar = this.convertSolarToLunar(d, m, y, timeZone);
            if (lunar.lunarDay === lunarDay && lunar.lunarMonth === lunarMonth && (!isLeap || lunar.isLeap)) {
                return {
                    solarDay: d,
                    solarMonth: m,
                    solarYear: y,
                    date: new Date(y, m - 1, d)
                };
            }
        }
        return null;
    }
}

// Hỗ trợ cả môi trường trình duyệt và Node.js test
if (typeof window !== 'undefined') {
    window.vietnameseLunar = new VietnameseLunarCalendar();
} else if (typeof global !== 'undefined') {
    global.vietnameseLunar = new VietnameseLunarCalendar();
}
