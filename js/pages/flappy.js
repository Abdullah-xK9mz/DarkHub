
        const container = document.getElementById('game-container');
        const bird = document.getElementById('bird');
        const scoreVal = document.getElementById('score-val');
        const msgScreen = document.getElementById('msg-screen');
        const msgTitle = document.getElementById('msg-title');
        const msgDesc = document.getElementById('msg-desc');

        const pauseBtn = document.getElementById('pause-btn');
        const pauseOverlay = document.getElementById('pauseOverlay');
        const resumeBtn = document.getElementById('resume-btn');
        const startBtn = document.getElementById('start-btn');

        let screenWidth = container.clientWidth;
        let screenHeight = container.clientHeight;

        let birdY = screenHeight / 2;
        let velocity = 0;
        let gravity = 0.35;
        const jump = -6.5;

        let score = 0;
        let gameActive = false;
        let pipes = [];
        let gameLoopInterval;
        let pipeGeneratorTimeout;

        let currentSpeed = 3.0;
        let currentGap = 165;
        let spawnRate = 1600;

        let lastTopHeight = null;

        window.addEventListener('resize', () => {
            screenWidth = container.clientWidth;
            screenHeight = container.clientHeight;
        });

        function birdJump(){
            if(!gameActive) return;
            velocity = jump;
            bird.style.transform = "rotate(-25deg)";
        }

        // التعامل الصحيح مع أزرار الواجهة لمنع تسريب الضغطات للعبة
        function handleUIEvent(e, action) {
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
            action();
        }

        pauseBtn.addEventListener('touchstart', (e) => handleUIEvent(e, pauseGame), { passive: false });
        pauseBtn.addEventListener('click', (e) => handleUIEvent(e, pauseGame));

        resumeBtn.addEventListener('touchstart', (e) => handleUIEvent(e, resumeGame), { passive: false });
        resumeBtn.addEventListener('click', (e) => handleUIEvent(e, resumeGame));

        startBtn.addEventListener('touchstart', (e) => handleUIEvent(e, startGame), { passive: false });
        startBtn.addEventListener('click', (e) => handleUIEvent(e, startGame));

        // التحكم بالقفز في منطق اللعبة
        container.addEventListener('touchstart', (e) => {
            if (!gameActive) return;
            // التأكد أن الضغطة لم تكن على أزرار UI
            if (e.target.closest('#pause-btn') || e.target.closest('#pauseOverlay') || e.target.closest('#msg-screen')) return;
            
            e.preventDefault();
            birdJump();
        }, { passive: false });

        container.addEventListener('mousedown', (e) => {
            if (!gameActive) return;
            if (e.target.closest('#pause-btn') || e.target.closest('#pauseOverlay') || e.target.closest('#msg-screen')) return;
            birdJump();
        });

        document.addEventListener('keydown', (e) => {
            if(e.key === ' ' || e.code === 'Space'){
                e.preventDefault();
                birdJump();
            }
        });

        function startGame(){
            birdY = screenHeight / 3;
            velocity = 0;
            score = 0;
            scoreVal.innerText = score;

            currentSpeed = 3.0;
            currentGap = 165;
            spawnRate = 1600;
            lastTopHeight = screenHeight / 3;

            gameActive = true;
            msgScreen.style.display = 'none';

            pipes.forEach(p => p.el.remove());
            pipes = [];

            clearInterval(gameLoopInterval);
            clearTimeout(pipeGeneratorTimeout);

            gameLoopInterval = setInterval(updateGame, 20);
            pipeGeneratorTimeout = setTimeout(createPipePair, 300);
        }

        function createPipePair(){
            if(!gameActive) return;

            const minHeight = 60;
            const maxHeight = screenHeight - currentGap - minHeight;

            let minAllowed = lastTopHeight - 50;
            let maxAllowed = lastTopHeight + 50;

            if(minAllowed < minHeight) minAllowed = minHeight;
            if(maxAllowed > maxHeight) maxAllowed = maxHeight;

            const topHeight = Math.floor(Math.random() * (maxAllowed - minAllowed + 1)) + minAllowed;
            const bottomHeight = screenHeight - currentGap - topHeight;

            lastTopHeight = topHeight;

            const topPipe = document.createElement('div');
            topPipe.classList.add('pipe');
            topPipe.style.height = topHeight + 'px';
            topPipe.style.top = '0px';
            topPipe.style.left = screenWidth + 'px';
            container.appendChild(topPipe);

            const bottomPipe = document.createElement('div');
            bottomPipe.classList.add('pipe');
            bottomPipe.style.height = bottomHeight + 'px';
            bottomPipe.style.bottom = '0px';
            bottomPipe.style.left = screenWidth + 'px';
            container.appendChild(bottomPipe);

            pipes.push(
                { el: topPipe, x: screenWidth, type: 'top', passed: false },
                { el: bottomPipe, x: screenWidth, type: 'bottom', passed: false }
            );

            pipeGeneratorTimeout = setTimeout(createPipePair, spawnRate);
        }

        function updateGame(){
            velocity += gravity;
            birdY += velocity;
            bird.style.top = birdY + 'px';

            if(velocity > 3){
                bird.style.transform = "rotate(35deg)";
            }

            if(birdY < 0 || birdY > (screenHeight - 30)){
                gameOver();
                return;
            }

            const birdLeft = bird.offsetLeft;
            const birdWidth = 40;
            const birdHeight = 30;

            for(let i = pipes.length - 1; i >= 0; i--){
                let p = pipes[i];
                p.x -= currentSpeed;
                p.el.style.left = p.x + 'px';

                if(
                    p.x < (birdLeft + birdWidth) && (p.x + 65) > birdLeft &&
                    ((p.type === 'top' && birdY < parseInt(p.el.style.height)) ||
                     (p.type === 'bottom' && birdY + birdHeight > (screenHeight - parseInt(p.el.style.height))))
                ){
                    gameOver();
                    return;
                }

                if(p.type === 'top' && !p.passed && (p.x + 65) < birdLeft){
                    p.passed = true;
                    score++;
                    scoreVal.innerText = score;

                    if(score % 10 === 0 && score > 0){
                        if(currentSpeed < 5.5) currentSpeed += 0.4;
                        if(currentGap > 125) currentGap -= 8;
                        if(spawnRate > 1200) spawnRate -= 100;
                    }
                }

                if(p.x < -70){
                    p.el.remove();
                    pipes.splice(i, 1);
                }
            }
        }

        function gameOver(){
            gameActive = false;
            clearInterval(gameLoopInterval);
            clearTimeout(pipeGeneratorTimeout);

            msgTitle.innerText = "جيم أوفر! 💥";
            msgTitle.style.color = "#ff3d7f";
            msgDesc.innerHTML = `السكور بتاعك: <b>${score}</b>\n\nكل ما السكور بيزيد، السرعة بتعلى والفتحات بتضيق! وري أصحابك مين أسرع رد فعل!`;
            startBtn.innerText = "إعادة المحاولة 🔄";
            msgScreen.style.display = 'flex';
        }

        function pauseGame(){
            if(!gameActive) return;
            gameActive = false;
            clearInterval(gameLoopInterval);
            clearTimeout(pipeGeneratorTimeout);
            pauseOverlay.style.display = 'flex';
        }

        function resumeGame(){
            gameActive = true;
            pauseOverlay.style.display = 'none';
            gameLoopInterval = setInterval(updateGame, 20);
            pipeGeneratorTimeout = setTimeout(createPipePair, spawnRate);
        }
    