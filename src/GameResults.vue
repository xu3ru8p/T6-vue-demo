<template>
  <div class="results">
    <h2>遊戲結束</h2>
    <p class="mission">MISSION COMPLETE</p>
    <p>回合: {{ round }}/5</p>
    <p>分數: {{ score }}</p>

    <!-- ✅ 顯示當前登錄用戶及分數提交狀態 -->
    <div class="user-score-info">
      <p class="current-user">玩家: {{ currentUser }}</p>
      <p v-if="scoreSubmitted" class="submit-status success">✅ 分數已記錄！總分: {{ totalUserScore }}</p>
      <p v-else class="submit-status">⏳ 正在記錄分數...</p>
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

    <!-- ✅ 排行榜（顯示來自 soulAnimalStore 的數據） -->
    <h3>排行榜</h3>
    <ol class="leaderboard">
      <li v-for="(entry, index) in leaderboard" :key="index">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="name">{{ entry.name }}</span>
        <span class="score">{{ entry.score }} 分</span>
      </li>
    </ol>

    <!-- 如果排行榜為空的情況 -->
    <div v-if="leaderboard.length === 0" class="empty-leaderboard">
      <p>尚無排行榜記錄</p>
    </div>

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
import soulAnimalStore from './soulAnimalStore.js'; // 引入 soulAnimalStore

export default {
  name: "GameResults",
  props: {
    round: Number,
    score: Number,
    wrongIds: { // 傳入錯誤題目 ID 陣列 (可能是 number 或 string)
      type: Array,
      default: () => []
    },
    currentUser: { // 新增 currentUser prop
      type: String,
      required: true
    }
  },
  emits: ["restart"],
  data() {
    return {
      leaderboard: [],
      wrongAnswers: [],
      scoreSubmitted: false,
      totalUserScore: 0
    };
  },
  methods: {
    async submitScoreToStore() {
      // 自動將分數記錄到 soulAnimalStore
      if (this.currentUser && this.score > 0) {
        try {
          this.totalUserScore = soulAnimalStore.addGameScore(this.currentUser, this.score);
          this.scoreSubmitted = true;
          
          // 保存遊戲記錄（包括分數、錯題等所有數據）
          const gameData = {
            round: this.round,
            score: this.score,
            wrongAnswers: this.wrongAnswers,
            mode: 'normal' // 可以根據需要傳遞遊戲模式
          };
          
          // 使用新的 saveGameRecord 方法來保存完整的遊戲記錄
          if (soulAnimalStore.saveGameRecord) {
            soulAnimalStore.saveGameRecord(this.currentUser, gameData);
          } else {
            // 向後兼容：如果沒有新方法，使用舊方法
            soulAnimalStore.saveGameErrors(this.currentUser, gameData);
          }
          
          // 更新排行榜
          this.loadLeaderboard();
          
          console.log(`分數已記錄: ${this.currentUser} +${this.score} 分，總分: ${this.totalUserScore}`);
          console.log(`遊戲記錄已保存: ${this.wrongAnswers.length} 個錯題`);
        } catch (error) {
          console.error('記錄分數失敗:', error);
        }
      }
    },
    
    loadLeaderboard() {
      // 從 soulAnimalStore 載入排行榜
      this.leaderboard = soulAnimalStore.getLeaderboard();
      console.log('排行榜已更新:', this.leaderboard);
    },
    
    loadWrongQuestions() {
      console.log('GameResults: 開始載入錯題，接收到的wrongIds:', this.wrongIds);
      
      // 現在從真實簡訊中載入錯題（因為錯誤的選擇是選到真實簡訊）
      const realArray = Array.isArray(realMessages) ? realMessages : [];
      console.log('GameResults: 可用的真實簡訊數量:', realArray.length);
      
      // 容錯：將 wrongIds 與 msg.id 都轉成字串比較（避免 number/string mismatch）
      const wrongIdStrs = this.wrongIds.map((id) => String(id));
      this.wrongAnswers = realArray.filter((msg) => wrongIdStrs.includes(String(msg.id)));

      console.log('GameResults: 錯題ID字串陣列:', wrongIdStrs);
      console.log('GameResults: 找到的錯題數量:', this.wrongAnswers.length);
      console.log('GameResults: 錯題詳細內容:', this.wrongAnswers);
    }
  },
  mounted() {
    // 設定當前用戶到 store
    soulAnimalStore.setCurrentUser(this.currentUser);
    
    // 載入錯題和排行榜
    this.loadWrongQuestions();
    this.loadLeaderboard();
    
    // 自動提交分數
    this.submitScoreToStore();
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

/* 用戶分數資訊樣式 */
.user-score-info {
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 255, 204, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.current-user {
  font-size: 1.1rem;
  font-weight: bold;
  color: #00ffcc;
  margin-bottom: 5px;
}

.submit-status {
  font-size: 0.9rem;
  color: #fff;
}

.submit-status.success {
  color: #00ff88;
  font-weight: bold;
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

/* 空排行榜提示 */
.empty-leaderboard {
  margin: 20px 0;
  color: #888;
  font-style: italic;
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
