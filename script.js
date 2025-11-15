document.addEventListener('DOMContentLoaded', function() {

// DOM要素の取得
const numberDisplay = document.getElementById('numberDisplay');
const numberHistory = document.getElementById('numberHistory');

// 変数の初期化
let availableImages = []; // 利用可能な画像番号の配列
let totalImages = 11; // 画像の総数(1.png〜11.png)
let drawnImages = []; // 既に選ばれた画像
let isAnimating = false; // アニメーション実行中フラグ

// アニメーションの種類と対応する効果音(各演出を2秒延長して4800msに)
const animationTypes = [
    {
        name: '落下爆発演出',
        className: 'fall-animation',
        duration: 4800,
    },
    {
        name: '高速回転演出',
        className: 'slide-animation',
        duration: 4800,
    },
    {
        name: 'ビッグスロット演出',
        className: 'slot-animation',
        duration: 4800,
    },
    {
        name: '爆発フラッシュ演出',
        className: 'explosion-animation',
        duration: 4800,
    },
    {
        name: '金色キラキラ演出',
        className: 'golden-animation',
        duration: 4800,
    },
    {
        name: '虹色トランジション演出',
        className: 'rainbow-animation',
        duration: 4800,
    },
    {
        name: 'バウンス演出',
        className: 'bounce-animation',
        duration: 4800,
    },
    {
        name: '稲妻エフェクト演出',
        className: 'lightning-animation',
        duration: 4800,
    }
];

// 初期化関数
function init() {
    // 1から11までの画像番号を配列に格納
    availableImages = Array.from({length: totalImages}, (_, i) => i + 1);
    initAudio();
}

// 効果音を再生する関数
function playSound() {
    // 既存のオーディオ要素があれば停止
    const existingAudio = document.getElementById('effectSound');
    if (existingAudio) {
        existingAudio.pause();
        document.body.removeChild(existingAudio);
    }

    // 新しいオーディオ要素を作成
    const audio = document.createElement('audio');
    audio.id = 'effectSound';
    audio.src = 'sounds/sound.mp3';

    // 再生設定
    audio.volume = 1.0;
    document.body.appendChild(audio);

    // 再生を試みる
    const playPromise = audio.play();

    // エラーハンドリング
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error('音声再生エラー:', error);
            // 自動再生に失敗した場合、ユーザージェスチャーを待つオプションを表示
            const playButton = document.createElement('button');
            playButton.textContent = '効果音を再生';
            playButton.style.position = 'fixed';
            playButton.style.top = '10px';
            playButton.style.right = '10px';
            playButton.style.zIndex = '9999';
            playButton.onclick = function() {
                audio.play();
                document.body.removeChild(playButton);
            };
            document.body.appendChild(playButton);
        });
    }
}

// よりスロットらしい演出にするためのランダム画像表示関数(射幸心を煽る仕様に強化)
function showSlotImages(duration, finalImageNumber, callback) {
    const startTime = Date.now();
    const endTime = startTime + duration;
    let updateCount = 0;

    function updateImage() {
        const now = Date.now();
        updateCount++;

        if (now < endTime) {
            // ランダムな画像番号を表示
            const randomImageNum = Math.floor(Math.random() * totalImages) + 1;
            displayImage(randomImageNum);

            // 更新頻度を徐々に遅くする(射幸心を煽るため、より細かく制御)
            const progress = (now - startTime) / duration;
            
            // 前半は高速、中盤は中速、後半は徐々に減速し期待感を高める
            let delay;
            if (progress < 0.3) {
                delay = 30; // 超高速
            } else if (progress < 0.6) {
                delay = 50 + Math.floor((progress - 0.3) * 300); // 中速から減速開始
            } else if (progress < 0.85) {
                delay = 150 + Math.floor((progress - 0.6) * 800); // さらに減速
            } else {
                delay = 350 + Math.floor((progress - 0.85) * 2000); // 最終段階で大幅減速
            }

            setTimeout(updateImage, delay);
        } else {
            // 最終的に選ばれた画像を表示
            displayImage(finalImageNumber);
            callback(); // アニメーション終了時のコールバック
        }
    }

    updateImage();
}

// 画像を表示する関数(サイズを大きく調整)
function displayImage(imageNumber) {
    const imgPath = `images/${imageNumber}.png`;
    // 画像サイズを80%から95%に拡大
    numberDisplay.innerHTML = `<img src="${imgPath}" alt="クッキー${imageNumber}" style="max-width: 95%; max-height: 95%; object-fit: contain;">`;
}

// エフェクト生成関数(より派手に強化)
function createEffects(type) {
    const lotteryStage = document.querySelector('.lottery-stage');

    if (type === '爆発フラッシュ演出') {
        // 爆発エフェクト要素を作成(パーティクル数を増やして派手に)
        for (let i = 0; i < 80; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';

            // ランダムなスタイルを設定
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 20 + 8 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`;
            particle.style.borderRadius = '50%';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.opacity = Math.random() * 0.5 + 0.5;

            // アニメーション設定
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 400 + 150;
            const x = Math.cos(angle) * speed;
            const y = Math.sin(angle) * speed;

            particle.animate([
                { transform: 'translate(-50%, -50%)', opacity: 1 },
                { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, opacity: 0 }
            ], {
                duration: Math.random() * 1500 + 1500,
                easing: 'cubic-bezier(0,.9,.57,1)',
                fill: 'forwards'
            });

            lotteryStage.appendChild(particle);

            // アニメーション終了後に要素を削除
            setTimeout(() => {
                if (lotteryStage.contains(particle)) {
                    lotteryStage.removeChild(particle);
                }
            }, 3000);
        }

    } else if (type === '金色キラキラ演出') {
        // 金色キラキラエフェクト(星の数を増やして豪華に)
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';

            // 星型の設定
            star.style.position = 'absolute';
            star.style.width = Math.random() * 30 + 15 + 'px';
            star.style.height = star.style.width;
            star.style.backgroundColor = '#FFD700';
            star.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.opacity = Math.random() * 0.5 + 0.5;

            // アニメーション設定
            star.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                { transform: 'scale(1.5) rotate(180deg)', opacity: 1, offset: 0.5 },
                { transform: 'scale(0) rotate(360deg)', opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'ease-in-out',
                fill: 'forwards'
            });

            lotteryStage.appendChild(star);

            // アニメーション終了後に要素を削除
            setTimeout(() => {
                if (lotteryStage.contains(star)) {
                    lotteryStage.removeChild(star);
                }
            }, 4000);
        }

    } else if (type === '稲妻エフェクト演出') {
        // 稲妻エフェクト(より激しく)
        const flash = document.createElement('div');
        flash.className = 'lightning-flash';
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '0';
        flash.style.zIndex = '5';
        lotteryStage.appendChild(flash);

        // フラッシュアニメーション(回数を増やして強化)
        flash.animate([
            { opacity: 0 },
            { opacity: 0.95, offset: 0.08 },
            { opacity: 0.1, offset: 0.16 },
            { opacity: 0.9, offset: 0.24 },
            { opacity: 0, offset: 0.32 },
            { opacity: 0.85, offset: 0.40 },
            { opacity: 0, offset: 0.48 },
            { opacity: 0.8, offset: 0.56 },
            { opacity: 0, offset: 0.64 }
        ], {
            duration: 1500,
            fill: 'forwards'
        });

        // 稲妻の線を描画(本数を増やして派手に)
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const lightning = document.createElement('div');
                lightning.className = 'lightning-line';
                lightning.style.position = 'absolute';
                lightning.style.width = '6px';
                lightning.style.height = '0';
                lightning.style.backgroundColor = '#00FFFF';
                lightning.style.left = `${20 + i * 15}%`;
                lightning.style.top = '0';
                lightning.style.zIndex = '6';
                lightning.style.boxShadow = '0 0 15px 3px #00FFFF';
                lotteryStage.appendChild(lightning);

                lightning.animate([
                    { height: '0%' },
                    { height: '100%' }
                ], {
                    duration: 250,
                    fill: 'forwards',
                    easing: 'ease-in'
                });

                // 稲妻の線を削除
                setTimeout(() => {
                    if (lotteryStage.contains(lightning)) {
                        lotteryStage.removeChild(lightning);
                    }
                }, 1200);
            }, i * 150);
        }

        // フラッシュ要素を削除
        setTimeout(() => {
            if (lotteryStage.contains(flash)) {
                lotteryStage.removeChild(flash);
            }
        }, 2500);
    }
}

// 抽選実行関数
function startDraw() {
    // 全ての画像が出た場合
    if (availableImages.length === 0) {
        alert('すべての画像が出揃いました!');
        return;
    }

    // アニメーション中は操作不可
    if (isAnimating) return;

    isAnimating = true;

    // ランダムなアニメーションを選択
    const animationIndex = Math.floor(Math.random() * animationTypes.length);
    const animation = animationTypes[animationIndex];

    // 画像抽選前の演出
    numberDisplay.textContent = '?';
    numberDisplay.className = 'number-display blink-animation';
    console.log(`演出: ${animation.name}`);

    // ランダムな画像番号を選ぶ
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const drawnImageNumber = availableImages[randomIndex];

    // 選ばれた画像番号を利用可能リストから削除
    availableImages.splice(randomIndex, 1);

    // 選ばれた画像番号を履歴に追加
    drawnImages.push(drawnImageNumber);

    setTimeout(() => {
        // アニメーション開始
        numberDisplay.className = `number-display ${animation.className}`;

        // 効果音を再生
        playSound();

        // エフェクトを作成
        createEffects(animation.name);

        // すべての演出タイプで強化したスロット演出を使用
        showSlotImages(animation.duration, drawnImageNumber, function() {
            // 履歴に追加
            addToHistory(drawnImageNumber);

            // アニメーション終了
            isAnimating = false;
        });
    }, 1000); // 1秒間の準備演出後に本演出開始
}

// Enterキーイベントリスナー
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        startDraw();
    }
});

// 初期化時に音声の自動再生許可を得るための一時的な消音オーディオを再生
function initAudio() {
    const silentAudio = document.createElement('audio');
    silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAABAAABIADw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV';
    silentAudio.volume = 0.01;
    silentAudio.play().catch(e => {
        console.log('自動再生に失敗しました。ユーザーインタラクション後に音声を再生します。', e);
    });
}

// 履歴に画像を追加する関数
function addToHistory(imageNumber) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-number';
    
    // 画像を履歴に表示
    const imgPath = `images/${imageNumber}.png`;
    historyItem.innerHTML = `<img src="${imgPath}" alt="クッキー${imageNumber}" style="width: 100%; height: 100%; object-fit: contain;">`;
    
    numberHistory.appendChild(historyItem);

    // スクロールを最下部に移動
    numberHistory.scrollTop = numberHistory.scrollHeight;
}

// ページ読み込み時に初期化
init();

// モバイル用タッチイベント(タップでも抽選開始できるようにする)
document.addEventListener('touchstart', function() {
    // タッチイベントを無視し、ダブルタップでズームしないようにする
}, { passive: false });

document.addEventListener('touchend', function(event) {
    if (!isAnimating) {
        startDraw();
        event.preventDefault();
    }
}, { passive: false });

});
