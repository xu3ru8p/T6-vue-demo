<template>
  <div class="results">
    <h2>遊戲結束</h2>
    <p class="mission">MISSION COMPLETE</p>
    <p>回合: {{ round }}/5</p>
    <p>分數: {{ score }}</p>

    <!-- ✅ 玩家提交分數（保留原本行為） -->
    <div class="leaderboard-input">
      <input type="text" v-model="playerName" placeholder="Your Name" />
      <button @click="submitScore" :disabled="!playerName || submitted">提交分數</button>
    </div>

    <!-- ✅ 錯誤題目回顧（若無錯題就不顯示） -->
    <div v-if="wrongAnswers.length" class="wrong-section">
      <h3>錯誤題目回顧</h3>
      <div
        v-for="(item, index) in wrongAnswers"
        :key="item.id"
        class="wrong-item"
      >
        <p class="question-title">題目 {{ index + 1 }}：</p>
        <p class="question-content">「{{ item.content }}」</p>
        <p class="question-explanation">解析：{{ item.explanation }}</p>
      </div>
    </div>

    <!-- 如果沒有錯題，顯示提示文字 -->
    <div v-else class="perfect-text">🎉 完美通關！無錯題！</div>

    <!-- ✅ 排行榜（保持原本內容與位置） -->
    <h3>排行榜</h3>
    <ol class="leaderboard">
      <li v-for="(entry, index) in leaderboard" :key="index">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="name">{{ entry.name }}</span>
        <span class="score">{{ entry.score }} 分</span>
      </li>
    </ol>

    <!-- ✅ 回首頁（保留原本事件） -->
    <button class="restart" @click="$emit('restart')">回首頁</button>
  </div>

  <!-- ✅ 駭客電網動畫層 -->
  <div class="hacker-grid"></div>
</template>

<script>
import axios from "axios";
// 同時引入 scam 與 real（若有）；若只有 scamMessages 也可工作
import { scamMessages } from "../database";
import { realMessages } from "../database_true"; // 如果沒有此檔案，可刪或保留並確保路徑正確

export default {
  name: "GameResults",
  props: {
    round: Number,
    score: Number,
    wrongIds: { // 傳入錯誤題目 ID 陣列 (可能是 number 或 string)
      type: Array,
      default: () => []
    }
  },
  emits: ["restart"],
  data() {
    return {
      playerName: "",
      leaderboard: [],
      submitted: false,
      wrongAnswers: []
    };
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const res = await axios.get("http://localhost:3000/leaderboard");
        this.leaderboard = res.data;
      } catch (err) {
        console.error("取得排行榜失敗", err);
      }
    },
    async submitScore() {
      if (!this.playerName) return;
      try {
        const res = await axios.post("http://localhost:3000/leaderboard", {
          name: this.playerName,
          score: this.score
        });
        if (res.data.success) {
          this.leaderboard = res.data.leaderboard;
          this.submitted = true;
        }
      } catch (err) {
        console.error("提交分數失敗", err);
      }
    },
    loadWrongQuestions() {
      console.log('GameResults: 開始載入錯題，接收到的wrongIds:', this.wrongIds);
      
      // 只從詐騙簡訊中載入錯題（因為錯誤的選擇通常是選到詐騙簡訊）
      const scamArray = Array.isArray(scamMessages) ? scamMessages : [];
      console.log('GameResults: 可用的詐騙簡訊數量:', scamArray.length);
      
      // 容錯：將 wrongIds 與 msg.id 都轉成字串比較（避免 number/string mismatch）
      const wrongIdStrs = this.wrongIds.map((id) => String(id));
      this.wrongAnswers = scamArray.filter((msg) => wrongIdStrs.includes(String(msg.id)));

      console.log('GameResults: 錯題ID字串陣列:', wrongIdStrs);
      console.log('GameResults: 找到的錯題數量:', this.wrongAnswers.length);
      console.log('GameResults: 錯題詳細內容:', this.wrongAnswers);
    }
  },
  mounted() {
    this.fetchLeaderboard();
    this.loadWrongQuestions();
  },
  watch: {
    wrongIds: {
      handler() {
        console.log('GameResults: wrongIds prop 改變，重新載入錯題');
        this.loadWrongQuestions();
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.results {
  position: relative;
  z-index: 999;
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0a0a, #111, #1b1b1b);
  color: #00ffcc;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0,255,200,0.2), 0 10px 25px rgba(0,0,0,0.5);
  overflow-y: auto;
  max-height: 90vh;
}

.mission {
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 25px;
  text-shadow: 0 0 5px #00ffcc;
}

.leaderboard-input {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.leaderboard-input input {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  outline: none;
  width: 180px;
  background-color: #111;
  color: #00ffcc;
}

.leaderboard-input button {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #00ffcc;
  color: #111;
  font-weight: bold;
  transition: 0.2s;
}

.leaderboard-input button:disabled {
  background: #555;
  cursor: not-allowed;
}

.leaderboard-input button:hover:not(:disabled) {
  background: #0ff;
}

/* 錯誤題目回顧樣式 */
.wrong-section {
  margin: 30px auto;
  padding: 20px;
  background: rgba(0, 30, 30, 0.6);
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0,255,200,0.2);
  max-width: 800px;
  text-align: left;
}

.wrong-section h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #00ffee;
  text-shadow: 0 0 8px #00ffcc;
}

.wrong-item {
  margin-bottom: 18px;
  padding: 12px 15px;
  border-left: 3px solid #00ffcc;
  background: rgba(10, 10, 10, 0.8);
  border-radius: 10px;
  transition: background 0.3s;
}
.wrong-item:hover {
  background: rgba(0, 40, 40, 0.8);
}

.question-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #00ffff;
}

.question-content {
  color: #e0fff5;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.question-explanation {
  color: #ff8080;
  font-size: 0.9rem;
  font-style: italic;
}

/* 完美通關提示 */
.perfect-text {
  margin: 20px 0;
  color: #00ffcc;
  font-weight: bold;
}

/* 其餘保持原樣（排行榜、回首頁等） */
.leaderboard {
  margin: 20px auto;
  padding-left: 0;
  max-width: 350px;
  list-style: none;
}

.leaderboard li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #555;
  padding: 8px 0;
}

.rank { width: 30px; }
.name { flex: 1; text-align: left; padding-left: 10px; }
.score { width: 60px; }

.restart {
  margin-top: 25px;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  background-color: #0ff;
  color: #111;
  font-weight: bold;
  border: none;
  transition: background 0.2s;
}
.restart:hover {
  background-color: #00ccaa;
}
</style>
