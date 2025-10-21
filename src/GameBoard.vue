<template>
  <div class="game-board" :class="{ 'warn': dangerLevel===1, 'danger': dangerLevel===2 }">
    <!-- 倒數計時器 - 顏色/動畫由 CSS 控制：
      .game-board.warn .timer  => 橘色慢節奏脈動（當剩餘時間 <= 10 秒時觸發）
      .game-board.danger .timer => 紅色快速脈動（當剩餘時間 <= 3 秒時觸發）
      對應的狀態由下方 script 的 updateDangerLevel() 來設定。 -->
    <div v-if="mode === 'challenge'" class="timer">
      剩餘時間: {{ timeLeft }} 秒
    </div>

    <h2>找出唯一的真實訊息</h2>

    <div class="cards">
      <div
        v-for="msg in gameMessages"
        :key="msg.id"
        class="card"
        :class="{
          selected: selectedMessage && selectedMessage.id === msg.id,
          correct: showResult && selectedMessage?.id === msg.id && !msg.isScam,
          wrong: showResult && selectedMessage?.id === msg.id && msg.isScam,
          urgent: dangerLevel === 2 && timeLeft <= 3
        }"
        @click="selectMessage(msg)"
      >
        <div class="msg-sender">{{ msg.sender }}</div>
        <p class="msg-content">{{ msg.content }}</p>
      </div>
    </div>
  </div>
  <!-- 駭客電網動畫層 -->
    <div class="hacker-grid"></div> <!-- ✅ 加上背景 -->
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { scamMessages } from "../database.js"; // 根目錄下
import { realMessages } from "../database_true.js"; // 根目錄下

export default {
  name: "GameBoard",
  props: {
    round: Number,
    score: Number,
    mode: { type: String, default: "normal" }
  },
  emits: ["next-round", "end-game"],
  setup(props, { emit }) {
    const gameMessages = ref([]);
    const selectedMessage = ref(null);
    const wrongIds = ref([]) // 儲存本場遊戲錯誤的訊息 id（會 emit 給父元件）
    const showResult = ref(false);
    const timeLeft = ref(20);
  const dangerLevel = ref(0); // 0: normal, 1: warn, 2: danger
  let audioCtx = null;
  let masterGain = null;
  const timerStarted = ref(false);
    let timer = null;

    const maxRounds = 30;
    const usedIds = ref(new Set());

  // startTimer：啟動整體挑戰倒數（總計 20 秒）
  // 注意：timerStarted 用來避免換題或重入時重複啟動計時器。
  const startTimer = () => {
      if (timerStarted.value) return;
      // total challenge timer (20s for the whole game)
      dangerLevel.value = 0;
      timeLeft.value = 20;
      ensureAudio();
      // main countdown (1s resolution)
      timer = setInterval(() => {
        timeLeft.value--;
        updateDangerLevel();
        updateTickLoop();
        if (timeLeft.value <= 0) {
          clearInterval(timer);
          stopTickLoop();
          dangerLevel.value = 0;
          emit('wrong-ids', wrongIds.value.slice()) // 傳一個淺拷貝，型別是陣列
          emit("end-game");
        }
      }, 1000);
      // start the tick loop (plays short sounds at variable interval)
      startTickLoop();
      timerStarted.value = true;
    };

    let tickTimer = null;
  // getTickIntervalMs：依據剩餘秒數回傳滴答頻率（毫秒）
  // - >10s => 1000ms
  // - <=10s => 500ms
  // - <=3s => 250ms
  // 如要調整加速時機，可在此修改數值門檻。
  const getTickIntervalMs = () => {
      if (timeLeft.value <= 3) return 250; // very fast
      if (timeLeft.value <= 10) return 500; // faster
      return 1000; // normal
    };

    const startTickLoop = () => {
      stopTickLoop();
      const ms = getTickIntervalMs();
      tickTimer = setInterval(() => {
        try { playTick(); } catch (e) {}
      }, ms);
    };

    const stopTickLoop = () => {
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    };

    const updateTickLoop = () => {
      // adjust tick speed if needed
      const ms = getTickIntervalMs();
      if (!tickTimer) {
        startTickLoop();
        return;
      }
      // if current interval differs, restart
      // can't read interval from setInterval, so restart unconditionally when threshold changes
      // simple approach: restart tick loop whenever dangerLevel changes
      // handled by updateDangerLevel caller below
    };

  // ensureAudio：初始化 WebAudio 的 AudioContext 與總音量（masterGain）
  // 若要調整滴答聲音量，可修改下方 masterGain.gain.value 的數值。
  const ensureAudio = () => {
      if (audioCtx) return;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.14; // increased volume
        masterGain.connect(audioCtx.destination);
      } catch (e) {
        console.warn('AudioContext not available', e);
        audioCtx = null;
      }
    };

  // playTick：播放短促的滴答聲。依緊迫程度改變頻率與波形。
  // 若要改為使用音檔，可在此改為載入 AudioBuffer 或使用 HTMLAudioElement 播放。
  const playTick = () => {
      // only play when audio available (and in challenge mode)
      if (!audioCtx) {
        // try to create on first use (user gesture likely happened)
        ensureAudio();
        if (!audioCtx) return;
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      // pitch depends on remaining time: higher pitch as time approaches 0
      // pitch depends on remaining time: higher pitch as time approaches 0
      let freq = 600;
      if (timeLeft.value <= 3) freq = 1400;
      else if (timeLeft.value <= 10) freq = 1000;
      else freq = 600;
      osc.frequency.value = freq;
      osc.type = 'square';
      // sharper tick: short envelope
      gain.gain.value = 1;
      osc.connect(gain);
      gain.connect(masterGain);
      const now = audioCtx.currentTime;
      osc.start(now);
      // very short tick (sharp click)
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.stop(now + 0.035);
    };

  // updateDangerLevel：根據剩餘時間設定 dangerLevel
  // dangerLevel 對應意義：
  // 0 = 正常、1 = 警示（會顯示橘色計時器）、2 = 危急（紅色計時器 + 卡片 urgent 樣式）
  // 若要更改視覺切換的時機，可修改下方的數字門檻（例如 3 秒、10 秒）。
  const updateDangerLevel = () => {
      const prev = dangerLevel.value;
      if (timeLeft.value <= 3) dangerLevel.value = 2;
      else if (timeLeft.value <= 10) dangerLevel.value = 1;
      else dangerLevel.value = 0;
      if (dangerLevel.value !== prev) {
        // when danger level changes, restart tick loop to adjust speed
        startTickLoop();
      }
    };

    const getRandomItems = (arr, n) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    };

    const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

    const availableTypes = Array.from(
      new Set([...scamMessages, ...realMessages].map((m) => m.type))
    );

    const initGame = () => {
      if (usedIds.value.size >= maxRounds * 3) return; // 遊戲結束

      // 隨機挑一個類型
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

      // 篩掉已使用的訊息
      const scamsOfType = scamMessages.filter(
        (m) => m.type === type && !usedIds.value.has(m.id)
      );
      const realsOfType = realMessages.filter(
        (m) => m.type === type && !usedIds.value.has(m.id)
      );

      if (scamsOfType.length < 2 || realsOfType.length < 1) {
        return initGame(); // 該類型不足重新挑
      }

      const selectedScams = getRandomItems(scamsOfType, 2);
      const selectedReal = getRandomItems(realsOfType, 1);

      const roundMessages = shuffleArray([...selectedScams, ...selectedReal]);

      roundMessages.forEach((m) => usedIds.value.add(m.id));

      gameMessages.value = roundMessages;
      selectedMessage.value = null;
      showResult.value = false;

      if (props.mode === "challenge") startTimer();

      console.log("Round messages:", roundMessages);
    };

    const selectMessage = (msg) => {
      if (selectedMessage.value) return;
      selectedMessage.value = msg;
      showResult.value = true;

      const correct = !msg.isScam; // 正確答案判斷

 // ---------- 新增：選擇後若答錯就記錄 id（放在 selectMessage 內，判斷 correct 之後） ----------
if (!correct) {
  // 避免重複加入：若 id 尚未存在才加入
  if (!wrongIds.value.includes(msg.id)) {
    wrongIds.value.push(msg.id)
    console.log('GameBoard: 記錄錯誤選擇ID:', msg.id, '當前錯題列表:', wrongIds.value);
  }
}
      
  // do NOT clear the total timer when selecting — timer runs across rounds

      setTimeout(() => {
        // 每回合結束時都傳遞當前錯題ID
        console.log('GameBoard: 傳遞錯題ID到App:', wrongIds.value);
        emit("wrong-ids", wrongIds.value.slice());
        emit("next-round", correct);
        initGame();
      }, 1200);
    };

    onMounted(() => {
      // 重置錯題ID列表（新遊戲開始）
      wrongIds.value = [];
      console.log('GameBoard: 遊戲開始，重置錯題ID列表');
      
      initGame();
      // start challenge timer only once when component mounts and mode is challenge
      if (props.mode === 'challenge' && !timerStarted.value) {
        startTimer();
      }
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close().catch(() => {});
    });

    watch(() => props.mode, () => initGame());

    return { gameMessages, selectedMessage, selectMessage, showResult, timeLeft, dangerLevel };
  }
};
</script>

<style scoped>
.game-board {
  text-align: center;
  padding: 40px 20px;
  color: #00ffcc;
  position: relative;
  z-index: 10;
  animation: fadeIn 1s ease;
}
.game-board.warn { /* orange subtle heartbeat */ transform: translateZ(0); }
.game-board.danger { /* red fast heartbeat */ transform: translateZ(0); }

.cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.card {
  background: linear-gradient(135deg, #111, #222); /* 背景顏色 */
  border: 2px solid #00ffcc; /* 邊框顏色 */
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  text-align: left;
  box-shadow: 0 0 10px #00ffcc50;
  position: relative;
  z-index: 10;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px #00ffcc;
  border-color: #66fff0;
}

.card.selected {
  border-color: #ffcc00;
  box-shadow: 0 0 25px #ffcc00;
}

.card.correct {
  border-color: #0f0;
  box-shadow: 0 0 25px #0f0;
  animation: glow 1s ease;
}

.card.wrong {
  border-color: #f00;
  box-shadow: 0 0 25px #f00;
  animation: shake 0.5s ease;
}

.card.urgent {
  border-color: #ff3333;
  box-shadow: 0 0 12px #ff6666;
  animation: urgent-shake 0.22s ease-in-out infinite;
}

@keyframes urgent-shake {
  0% { transform: translateY(0) scale(1); }
  25% { transform: translateY(-1px) scale(1.005); }
  50% { transform: translateY(0) scale(1); }
  75% { transform: translateY(1px) scale(0.999); }
  100% { transform: translateY(0) scale(1); }
}

/* heartbeat effect applied to the whole board when warn/danger */
.game-board.warn { transform: translateZ(0); }
.game-board.danger { transform: translateZ(0); }
@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.02); }
  40% { transform: scale(1); }
  60% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.msg-sender {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.msg-content {
  background-color: #1a1a1a;
  border-radius: 10px;
  padding: 10px;
  word-wrap: break-word;
  line-height: 1.4;
  color: #f0f0f0;
  font-size: 0.9rem;
  white-space: pre-line; /* 支援換行符號 \n */
  overflow-y: auto /* 保留超出的文字,用滾動方是閱讀 */
}



.timer {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0be43a;
  margin-bottom: 15px;
  transition: color 0.2s ease, transform 0.15s ease;
}
.game-board.warn .timer { color: #ffae00; transform: scale(1.02); animation: timer-pulse-slow 1s infinite ease-in-out; }
.game-board.danger .timer { color: #ff4d4d; transform: scale(1.08); animation: timer-pulse-fast 0.45s infinite ease-in-out; }

@keyframes timer-pulse-slow {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes timer-pulse-fast {
  0% { transform: scale(1); }
  25% { transform: scale(1.06); }
  50% { transform: scale(1); }
  75% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

@keyframes glow {
  0% { box-shadow: 0 0 0 #0f0; }
  50% { box-shadow: 0 0 25px #0f0; }
  100% { box-shadow: 0 0 10px #0f0; }
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-8px); }
  100% { transform: translateX(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
