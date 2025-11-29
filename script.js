document.addEventListener('DOMContentLoaded', function () {

    // DOM要素の取得
    const numberDisplay = document.getElementById('numberDisplay');
    const numberHistory = document.getElementById('numberHistory');
    const winEffect = document.getElementById('winEffect');
    const snowContainer = document.getElementById('snowContainer');

    const resultMessage = document.getElementById('resultMessage');

    // 変数の初期化
    let availableImages = [];
    let totalImages = 11;
    let drawnImages = [];
    let isAnimating = false;

    const animationTypes = [
        { name: '落下爆発演出', className: 'fall-animation', duration: 4800 },
        { name: '高速回転演出', className: 'slide-animation', duration: 4800 },
        { name: 'ビッグスロット演出', className: 'slot-animation', duration: 4800 },
        { name: '爆発フラッシュ演出', className: 'explosion-animation', duration: 4800 },
        { name: '金色キラキラ演出', className: 'golden-animation', duration: 4800 },
        { name: '虹色トランジション演出', className: 'rainbow-animation', duration: 4800 },
        { name: 'バウンス演出', className: 'bounce-animation', duration: 4800 },
        { name: '稲妻エフェクト演出', className: 'lightning-animation', duration: 4800 }
    ];

    function init() {
        availableImages = Array.from({ length: totalImages }, (_, i) => i + 1);
        initAudio();
        createSnowflakes();
    }

    // 雪生成
    function createSnowflakes() {
        const flakeCount = 200;
        const symbols = ['❅', '❆', '●', '.', '✦'];

        for (let i = 0; i < flakeCount; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';

            const sizeType = Math.random();
            if (sizeType < 0.1) flake.classList.add('large');
            else if (sizeType < 0.4) flake.classList.add('medium');
            else flake.classList.add('small');

            flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            flake.style.left = Math.random() * 100 + 'vw';
            const duration = Math.random() * 10 + 5;
            flake.style.animationDuration = duration + 's';
            flake.style.animationDelay = Math.random() * 10 + 's';

            snowContainer.appendChild(flake);
        }
    }

    function playSound() {
        const existingAudio = document.getElementById('effectSound');
        if (existingAudio) {
            existingAudio.pause();
            document.body.removeChild(existingAudio);
        }

        const audio = document.createElement('audio');
        audio.id = 'effectSound';
        audio.src = 'sounds/sound.mp3';
        audio.volume = 1.0;
        document.body.appendChild(audio);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('音声再生エラー:', error);
            });
        }
    }

    function showSlotImages(duration, finalImageNumber, callback) {
        const startTime = Date.now();
        const endTime = startTime + duration;
        let updateCount = 0;

        function updateImage() {
            const now = Date.now();
            updateCount++;

            if (now < endTime) {
                const randomImageNum = Math.floor(Math.random() * totalImages) + 1;
                displayImage(randomImageNum);

                const progress = (now - startTime) / duration;
                let delay;
                if (progress < 0.3) {
                    delay = 30;
                } else if (progress < 0.6) {
                    delay = 50 + Math.floor((progress - 0.3) * 300);
                } else if (progress < 0.85) {
                    delay = 150 + Math.floor((progress - 0.6) * 800);
                } else {
                    delay = 350 + Math.floor((progress - 0.85) * 2000);
                }

                setTimeout(updateImage, delay);
            } else {
                displayImage(finalImageNumber);
                callback();
            }
        }
        updateImage();
    }

    function displayImage(imageNumber) {
        const imgPath = `images/${imageNumber}.png`;
        numberDisplay.innerHTML = `<img src="${imgPath}" alt="クッキー${imageNumber}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(5px 5px 5px rgba(0,0,0,0.2));">`;
    }

    function createEffects(type) {
        const lotteryStage = document.querySelector('.lottery-stage');

        if (type === '爆発フラッシュ演出') {
            for (let i = 0; i < 40; i++) {
                const particle = document.createElement('div');
                particle.className = 'explosion-particle';
                particle.style.position = 'absolute';
                particle.style.width = Math.random() * 15 + 5 + 'px';
                particle.style.height = particle.style.width;
                const hue = Math.floor(Math.random() * 360);
                particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
                particle.style.borderRadius = '50%';
                particle.style.left = '50%'; particle.style.top = '50%';
                particle.style.zIndex = '5';

                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 300 + 100;
                const x = Math.cos(angle) * speed;
                const y = Math.sin(angle) * speed;

                particle.animate([
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`, opacity: 0 }
                ], { duration: 1000, easing: 'ease-out', fill: 'forwards' });

                lotteryStage.appendChild(particle);
                setTimeout(() => { if (lotteryStage.contains(particle)) lotteryStage.removeChild(particle); }, 1000);
            }
        } else if (type === '金色キラキラ演出') {
            for (let i = 0; i < 30; i++) {
                const star = document.createElement('div');
                star.textContent = '★';
                star.style.position = 'absolute';
                star.style.color = '#FFD700';
                star.style.fontSize = Math.random() * 20 + 10 + 'px';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.zIndex = '5';
                star.style.textShadow = '0 0 5px white';

                star.animate([
                    { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                    { transform: 'scale(1) rotate(180deg)', opacity: 1, offset: 0.5 },
                    { transform: 'scale(0) rotate(360deg)', opacity: 0 }
                ], { duration: 2000, delay: Math.random() * 1000, fill: 'forwards' });

                lotteryStage.appendChild(star);
                setTimeout(() => { if (lotteryStage.contains(star)) lotteryStage.removeChild(star); }, 3000);
            }
        }
    }

    // 抽選実行関数
    function startDraw() {
        if (availableImages.length === 0) {
            alert('すべてのプレゼントが行き渡りました！Merry Christmas!');
            return;
        }

        if (isAnimating) return;
        isAnimating = true;

        // 背景演出ON
        document.body.classList.add('is-spinning');

        // メッセージを非表示
        resultMessage.classList.remove('show');

        const animationIndex = Math.floor(Math.random() * animationTypes.length);
        const animation = animationTypes[animationIndex];

        numberDisplay.innerHTML = '<span class="question-mark" style="font-size: clamp(100px, 25vh, 250px);">?</span>';
        numberDisplay.className = 'number-display blink-animation';

        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const drawnImageNumber = availableImages[randomIndex];
        availableImages.splice(randomIndex, 1);
        drawnImages.push(drawnImageNumber);

        setTimeout(() => {
            numberDisplay.className = `number-display ${animation.className}`;
            playSound();
            createEffects(animation.name);

            showSlotImages(animation.duration, drawnImageNumber, function () {
                addToHistory(drawnImageNumber);
                winEffect.classList.add('win-effect-active');

                // メッセージを表示
                resultMessage.classList.add('show');

                isAnimating = false;

                // 背景演出OFF
                document.body.classList.remove('is-spinning');

                setTimeout(() => {
                    numberDisplay.className = 'number-display';
                    winEffect.classList.remove('win-effect-active');
                    resultMessage.classList.remove('show');
                }, 4000);
            });
        }, 500);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') startDraw();
    });

    function initAudio() {
        const s = document.createElement('audio');
        s.volume = 0;
    }

    function addToHistory(imageNumber) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-number';

        const imgPath = `images/${imageNumber}.png`;
        historyItem.innerHTML = `<img src="${imgPath}" alt="Get!">`;

        numberHistory.appendChild(historyItem);

        historyItem.animate([
            { transform: 'scale(0) rotate(-180deg)', opacity: 0 },
            { transform: 'scale(1.2) rotate(10deg)', opacity: 1, offset: 0.8 },
            { transform: 'scale(1) rotate(0deg)', opacity: 1 }
        ], { duration: 500, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });

        numberHistory.scrollTop = numberHistory.scrollHeight;
    }

    init();

    document.addEventListener('touchstart', function () { }, { passive: false });
    document.addEventListener('touchend', function (event) {
        if (!isAnimating && event.target.closest('.container')) {
            startDraw();
            event.preventDefault();
        }
    }, { passive: false });

});