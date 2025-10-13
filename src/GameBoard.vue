<template>
  <div class="game-board">
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
          wrong: showResult && selectedMessage?.id === msg.id && msg.isScam
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
import { ref, onMounted, watch } from "vue";
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
    const showResult = ref(false);
    const timeLeft = ref(20);
    let timer = null;

    const maxRounds = 30;
    const usedIds = ref(new Set());

    const startTimer = () => {
      clearInterval(timer);
      timeLeft.value = 20;
      timer = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
          clearInterval(timer);
          emit("end-game");
        }
      }, 1000);
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

      if (timer) clearInterval(timer);

      setTimeout(() => {
        emit("next-round", correct);
        initGame();
      }, 1200);
    };

    onMounted(() => {
      initGame();
    });

    watch(() => props.mode, () => initGame());

    return { gameMessages, selectedMessage, selectMessage, showResult, timeLeft };
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
  color: #ff5555;
  margin-bottom: 15px;
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
