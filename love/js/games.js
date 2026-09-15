// js/games.js - Các trò chơi dành riêng cho cặp đôi Gnoul & Minyu

class LoveGames {
    constructor() {
        this.activeGame = 'tictactoe';
        // Tic-Tac-Toe State
        this.board = Array(9).fill(null);
        this.currentTurn = 'gnoul'; // 'gnoul' (💙) hoặc 'minyu' (💖)
        this.gameActive = true;
        this.scores = window.loveStorage.get('game_tictactoe_scores', { gnoul: 0, minyu: 0, draw: 0 });

        // Wheel State
        this.wheelCanvas = null;
        this.wheelCtx = null;
        this.wheelAngle = 0;
        this.isSpinning = false;
        this.wheelOptions = [
            "🍿 Đi xem phim đêm",
            "🧋 Trà sữa & Ăn vặt",
            "🍳 Cùng nhau nấu ăn",
            "🛵 Lượn phố hóng gió",
            "📸 Chụp 10 tấm ảnh đôi",
            "💆 Massage cho đối phương",
            "🛌 Ôm nhau xem phim",
            "💖 Khen người yêu 5 câu"
        ];

        // Quiz State
        this.quizCurrentIndex = 0;
        this.quizScore = 0;
        this.quizQuestions = [
            {
                q: "Khi Minyu dỗi, Gnoul nên làm gì hiệu quả nhất?",
                options: ["Mua trà sữa & ôm ngay lập tức 💕", "Giải thích lý lẽ logic", "Chờ tự hết dỗi", "Giả vờ không biết gì"],
                correct: 0,
                hint: "Minyu chỉ cần được cưng chiều thôi!"
            },
            {
                q: "Ai là người dễ thương hơn trong mối quan hệ này?",
                options: ["Chắc chắn là Minyu rồi!", "Gnoul lúc làm nũng", "Cả hai đều siêu cấp đáng yêu 🥰", "Không ai cả"],
                correct: 2,
                hint: "Cả hai sinh ra là dành cho nhau!"
            },
            {
                q: "Buổi hẹn hò lý tưởng nhất của hai bạn là?",
                options: ["Ở nhà nấu ăn, xem phim & ôm nhau", "Đi du lịch biển ngắm hoàng hôn", "Ăn sập các quán ngon lề đường", "Tất cả những điều trên chỉ cần có nhau"],
                correct: 3,
                hint: "Ở đâu cũng được, miễn là cùng nhau!"
            },
            {
                q: "Khi Gnoul mệt mỏi sau ngày dài, Minyu sẽ làm gì?",
                options: ["Gửi 100 nụ hôn và lời động viên ngọt ngào", "Pha một ly nước ấm và xoa đầu anh", "Nghe anh tâm sự mọi điều", "Tất cả những điều tuyệt vời này ❤️"],
                correct: 3,
                hint: "Sự dịu dàng của em là liều thuốc tốt nhất!"
            },
            {
                q: "Ngày bắt đầu tình yêu đẹp đẽ của hai bạn là ngày nào?",
                options: ["04/04/2026 💕", "01/01/2026", "14/02/2026", "08/03/2026"],
                correct: 0,
                hint: "Ngày định mệnh mang hai trái tim lại gần nhau!"
            }
        ];

        this.init();
    }

    init() {
        this.renderTicTacToe();
        this.updateScoreUI();
        this.initWheel();
        this.initQuiz();
    }

    switchSubGame(gameName) {
        this.activeGame = gameName;
        document.querySelectorAll('.game-sub-tab').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-subgame') === gameName);
        });
        document.querySelectorAll('.subgame-panel').forEach(p => {
            p.classList.toggle('active', p.id === `game-panel-${gameName}`);
        });

        if (gameName === 'wheel') {
            setTimeout(() => this.drawWheel(), 50);
        }
    }

    // ==================== 1. CỜ CARO TÌNH YÊU (TIC-TAC-TOE) ====================
    renderTicTacToe() {
        const boardEl = document.getElementById('tictactoe-board');
        if (!boardEl) return;

        boardEl.innerHTML = this.board.map((cell, idx) => {
            let symbol = '';
            let cellClass = '';
            if (cell === 'gnoul') {
                symbol = '💙';
                cellClass = 'cell-gnoul';
            } else if (cell === 'minyu') {
                symbol = '💖';
                cellClass = 'cell-minyu';
            }
            return `
                <div class="ttt-cell ${cellClass}" onclick="window.loveGames.handleCellClick(${idx})">
                    ${symbol}
                </div>
            `;
        }).join('');

        this.updateTurnIndicator();
    }

    handleCellClick(idx) {
        if (!this.gameActive || this.board[idx] !== null) return;

        this.board[idx] = this.currentTurn;
        if (window.loveAudio) window.loveAudio.playPop();

        // Kiểm tra thắng thua
        const winner = this.checkWinner();
        if (winner) {
            this.handleWin(winner);
        } else if (this.board.every(cell => cell !== null)) {
            this.handleDraw();
        } else {
            // Đổi lượt
            this.currentTurn = this.currentTurn === 'gnoul' ? 'minyu' : 'gnoul';
            this.renderTicTacToe();

            // Sync nếu có Firebase
            if (window.loveFirebase && window.loveFirebase.isConnected) {
                window.loveFirebase.sendGameMove({
                    board: this.board,
                    turn: this.currentTurn
                });
            }
        }
    }

    checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Hàng ngang
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Hàng dọc
            [0, 4, 8], [2, 4, 6]             // Đường chéo
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }

    handleWin(winner) {
        this.gameActive = false;
        this.renderTicTacToe();
        this.scores[winner]++;
        window.loveStorage.set('game_tictactoe_scores', this.scores);
        this.updateScoreUI();

        if (window.loveAudio) window.loveAudio.playWin();
        if (window.loveApp) window.loveApp.spawnHeartsExplosion(window.innerWidth / 2, window.innerHeight / 2);

        const winnerName = winner === 'gnoul' ? 'Gnoul 💙' : 'Minyu 💖';
        const loserName = winner === 'gnoul' ? 'Minyu' : 'Gnoul';

        const penalties = [
            `Hôn đối phương 10 cái thật kêu 💕`,
            `Mua 1 ly trà sữa trân châu cho ${winnerName} ngay hôm nay 🧋`,
            `Gửi 1 tấm ảnh selfie chu mỏ cute dìm hàng vào chat 📸`,
            `Khen ${winnerName} 5 câu ngọt ngào nhất thế giới 🥰`,
            `Ngoan ngoãn nghe lời ${winnerName} trong vòng 24 giờ 👑`,
            `Hát tặng đối phương 1 đoạn điệp khúc bài hát yêu thích 🎤`,
            `Xoa bóp vai và đấm lưng cho ${winnerName} 15 phút 💆`
        ];
        const randomPenalty = penalties[Math.floor(Math.random() * penalties.length)];

        // Hiển thị modal thắng và hình phạt
        const modal = document.getElementById('modal-game-win');
        const content = document.getElementById('game-win-content');
        if (modal && content) {
            content.innerHTML = `
                <div class="win-trophy">🏆</div>
                <h3 class="win-title">${winnerName} đã chiến thắng!</h3>
                <p class="win-sub">Hình phạt ngọt ngào dành cho <strong>${loserName}</strong>:</p>
                <div class="win-penalty-box">
                    <span>${randomPenalty}</span>
                </div>
                <button class="win-btn-again" onclick="window.loveGames.resetTicTacToe()">Chơi Ván Mới 🎮</button>
            `;
            modal.classList.add('active');
        }
    }

    handleDraw() {
        this.gameActive = false;
        this.scores.draw++;
        window.loveStorage.set('game_tictactoe_scores', this.scores);
        this.updateScoreUI();
        alert("Bất phân thắng bại! Hai trái tim hòa làm một 💖");
        this.resetTicTacToe();
    }

    resetTicTacToe() {
        this.board = Array(9).fill(null);
        this.gameActive = true;
        this.currentTurn = 'gnoul';
        document.getElementById('modal-game-win')?.classList.remove('active');
        this.renderTicTacToe();
    }

    updateTurnIndicator() {
        const turnText = document.getElementById('ttt-turn-text');
        if (turnText) {
            const name = this.currentTurn === 'gnoul' ? 'Gnoul (💙)' : 'Minyu (💖)';
            turnText.innerHTML = `Lượt đi của: <strong>${name}</strong>`;
        }
    }

    updateScoreUI() {
        const gnoulScoreEl = document.getElementById('score-gnoul');
        const minyuScoreEl = document.getElementById('score-minyu');
        if (gnoulScoreEl) gnoulScoreEl.textContent = this.scores.gnoul;
        if (minyuScoreEl) minyuScoreEl.textContent = this.scores.minyu;
    }

    // ==================== 2. VÒNG QUAY TÌNH YÊU (LOVE WHEEL) ====================
    initWheel() {
        this.wheelCanvas = document.getElementById('wheel-canvas');
        if (!this.wheelCanvas) return;
        this.wheelCtx = this.wheelCanvas.getContext('2d');
        this.drawWheel();
    }

    drawWheel() {
        if (!this.wheelCanvas || !this.wheelCtx) return;
        const ctx = this.wheelCtx;
        const width = this.wheelCanvas.width;
        const height = this.wheelCanvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = width / 2 - 10;
        const numSlices = this.wheelOptions.length;
        const sliceAngle = (2 * Math.PI) / numSlices;

        ctx.clearRect(0, 0, width, height);

        const colors = [
            '#ff8fa3', '#ffccd5', '#c8b6ff', '#e2afff',
            '#ff9ebb', '#ffd6e0', '#b8c0ff', '#f3c4fb'
        ];

        for (let i = 0; i < numSlices; i++) {
            const angle = this.wheelAngle + i * sliceAngle;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, angle, angle + sliceAngle);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Vẽ chữ
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#4a2840';
            ctx.font = 'bold 12px "Quicksand", sans-serif';
            ctx.fillText(this.wheelOptions[i], radius - 15, 5);
            ctx.restore();
        }

        // Tâm vòng quay trái tim
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff4d6d';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', cx, cy);
    }

    spinWheel() {
        if (this.isSpinning) return;
        this.isSpinning = true;

        const spinSound = window.loveAudio;
        if (spinSound) spinSound.playPop();

        const extraTurns = 5 + Math.floor(Math.random() * 4); // 5 - 8 vòng
        const randomEndAngle = Math.random() * 2 * Math.PI;
        const totalRotation = extraTurns * 2 * Math.PI + randomEndAngle;
        const duration = 4000;
        const startTime = performance.now();
        const startAngle = this.wheelAngle;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            this.wheelAngle = startAngle + totalRotation * easeOut;
            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.wheelAngle = this.wheelAngle % (2 * Math.PI);
                this.showWheelResult();
            }
        };

        requestAnimationFrame(animate);
    }

    showWheelResult() {
        const numSlices = this.wheelOptions.length;
        const sliceAngle = (2 * Math.PI) / numSlices;
        
        // Kim chỉ ở vị trí 3 giờ (0 rad), hoặc 12 giờ (-PI/2)
        // Canvas kim chỉ ở trên đỉnh (270 độ = 3*PI/2)
        const normalizedAngle = (2 * Math.PI - (this.wheelAngle % (2 * Math.PI)) + (3 * Math.PI / 2)) % (2 * Math.PI);
        const index = Math.floor(normalizedAngle / sliceAngle) % numSlices;
        const result = this.wheelOptions[index];

        if (window.loveAudio) window.loveAudio.playWin();
        if (window.loveApp) window.loveApp.spawnHeartsExplosion(window.innerWidth / 2, window.innerHeight / 2);

        setTimeout(() => {
            alert(`🎉 Vòng quay tình yêu đã chọn:\n\n👉 "${result}"\n\nHai bạn cùng nhau thực hiện ngay nhé! 💕`);
        }, 200);
    }

    // ==================== 3. TRẮC NGHIỆM THẤU HIỂU (COUPLE QUIZ) ====================
    initQuiz() {
        this.quizCurrentIndex = 0;
        this.quizScore = 0;
        this.renderQuizQuestion();
    }

    renderQuizQuestion() {
        const container = document.getElementById('quiz-card-container');
        if (!container) return;

        if (this.quizCurrentIndex >= this.quizQuestions.length) {
            // Hoàn thành quiz
            const percentage = Math.round((this.quizScore / this.quizQuestions.length) * 100);
            container.innerHTML = `
                <div class="quiz-result-box">
                    <div class="quiz-result-icon">💯</div>
                    <h3>Độ Tương Hợp Của Hai Bạn</h3>
                    <div class="quiz-score-meter">${percentage}%</div>
                    <p class="quiz-result-desc">
                        ${percentage >= 80 
                            ? "Chúc mừng Gnoul & Minyu! Hai bạn sinh ra chính là để dành cho nhau, tâm đầu ý hợp chuẩn 10/10! 💖"
                            : "Cần dành thêm nhiều thời gian hò hẹn và tâm sự để hiểu đối phương hơn nữa nhé! Yêu thương đong đầy 💕"}
                    </p>
                    <button class="quiz-btn-restart" onclick="window.loveGames.initQuiz()">Làm Lại Bài Test 🔄</button>
                </div>
            `;
            return;
        }

        const q = this.quizQuestions[this.quizCurrentIndex];
        container.innerHTML = `
            <div class="quiz-progress">Câu ${this.quizCurrentIndex + 1} / ${this.quizQuestions.length}</div>
            <div class="quiz-question">${q.q}</div>
            <div class="quiz-options-grid">
                ${q.options.map((opt, i) => `
                    <button class="quiz-opt-btn" onclick="window.loveGames.answerQuiz(${i})">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    }

    answerQuiz(selectedIndex) {
        const q = this.quizQuestions[this.quizCurrentIndex];
        if (selectedIndex === q.correct) {
            this.quizScore++;
            if (window.loveAudio) window.loveAudio.playWin();
        } else {
            if (window.loveAudio) window.loveAudio.playPop();
        }
        this.quizCurrentIndex++;
        this.renderQuizQuestion();
    }
}

window.loveGames = new LoveGames();
