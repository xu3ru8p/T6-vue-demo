<template>
  <div class="results">
    <h2>遊戲結束</h2>
    <p class="mission">MISSION COMPLETE</p>
    <div v-if="userData" class="user-info">
      <p class="user-name">玩家: {{ userData.username || userData.name || '未知用戶' }}</p>
    </div>
    <p>回合: {{ round }}/5</p>
    <p>分數: {{ score }}</p>

    <!-- ✅ 玩家提交分數（保留原本行為） -->
    <div class="leaderboard-input">
      <input type="text" v-model="playerName" placeholder="Your Name" />
      <button @click="submitScore" :disabled="!playerName || submitted">提交分數</button>
    </div>

    <!-- ✅ 遊戲解析區域 -->
    <div v-if="gameAnalysis.length" class="analysis-section">
      <h3>遊戲解析</h3>
      <div
        v-for="analysis in gameAnalysis"
        :key="analysis.round"
        class="analysis-item"
        :class="{ 'correct': analysis.isCorrect, 'incorrect': !analysis.isCorrect }"
      >
        <div class="round-header">
          <h4>第{{ analysis.round }}關</h4>
          <span class="result-badge" :class="{ 'correct': analysis.isCorrect, 'incorrect': !analysis.isCorrect }">
            {{ analysis.isCorrect ? '✓ 正確' : '✗ 錯誤' }}
          </span>
        </div>
        
        <div class="choice-comparison">
          <div class="user-choice">
            <h5>你的選擇</h5>
            <p class="message-content">「{{ analysis.userChoice.content }}」</p>
            <p class="message-category">類別：{{ analysis.userChoice.category }}</p>
            <p class="message-analysis" v-if="analysis.userChoice.analysis">
              解析：{{ analysis.userChoice.analysis }}
            </p>
          </div>
          
          <div class="correct-answer">
            <h5>正確答案</h5>
            <p class="message-content">「{{ analysis.correctAnswer.content }}」</p>
            <p class="message-category">類別：{{ analysis.correctAnswer.category }}</p>
            <p class="message-analysis" v-if="analysis.correctAnswer.analysis">
              解析：{{ analysis.correctAnswer.analysis }}
            </p>
          </div>
        </div>
      </div>
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

    <!-- ✅ 排行榜按鈕和顯示區域 -->
    <div class="leaderboard-section">
      <button class="leaderboard-btn" @click="toggleLeaderboard">
        {{ showLeaderboard ? '隱藏排行榜' : '查看排行榜' }}
      </button>
      
      <div v-if="showLeaderboard" class="leaderboard-container">
        <h3>排行榜</h3>
        <ol class="leaderboard">
          <li v-for="(entry, index) in leaderboard" :key="index">
            <span class="rank">{{ index + 1 }}.</span>
            <span class="name">{{ entry.name }}</span>
            <span class="score">{{ entry.score }} 分</span>
          </li>
        </ol>
      </div>
    </div>

    <!-- ✅ 回首頁（保留原本事件） -->
    <button class="restart" @click="$emit('restart')">回首頁</button>
  </div>

  <!-- ✅ 駭客電網動畫層 -->
  <div class="hacker-grid"></div>
</template>

<script>
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
    },
    userChoices: { // 新增：用戶選擇數據
      type: Array,
      default: () => []
    },
    userData: { // 新增：用戶數據
      type: Object,
      default: () => null
    }
  },
  emits: ["restart"],
  data() {
    return {
      playerName: "",
      leaderboard: [],
      submitted: false,
      wrongAnswers: [],
      gameAnalysis: [], // 新增：遊戲解析數據
      showLeaderboard: false // 新增：控制排行榜顯示
    };
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const response = await fetch('http://localhost:8000/leaderboard?limit=10', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('GameResults: 排行榜獲取成功:', result);
        
        if (result.success) {
          // 轉換後端數據格式為前端需要的格式
          this.leaderboard = result.data.map(entry => ({
            name: entry.username,
            score: entry.total_score
          }));
        } else {
          console.error('獲取排行榜失敗:', result.error || result.message);
          this.leaderboard = [];
        }
      } catch (err) {
        console.error("取得排行榜失敗", err);
        this.leaderboard = [];
      }
    },
    async submitScore() {
      if (!this.playerName) return;
      try {
        // 注意：新的後端API不需要手動提交分數，分數會在遊戲完成時自動記錄
        // 這裡只是更新玩家名稱顯示
        console.log('玩家名稱已設定:', this.playerName);
        this.submitted = true;
        
        // 重新獲取排行榜以顯示最新數據
        await this.fetchLeaderboard();
      } catch (err) {
        console.error("提交分數失敗", err);
      }
    },
    toggleLeaderboard() {
      this.showLeaderboard = !this.showLeaderboard;
      if (this.showLeaderboard && this.leaderboard.length === 0) {
        // 如果排行榜為空且要顯示，則獲取數據
        this.fetchLeaderboard();
      }
    },
    async fetchGameAnalysis() {
      try {
        if (this.userChoices && this.userChoices.length > 0) {
          console.log('GameResults: 開始獲取遊戲解析，用戶選擇:', this.userChoices);
          
          const response = await fetch('http://localhost:8000/games/analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userChoices: this.userChoices
            })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log('GameResults: 遊戲解析獲取成功:', result);
          
          if (result.success) {
            this.gameAnalysis = result.data || [];
          } else {
            console.error('獲取遊戲解析失敗:', result.error || result.message);
          }
        }
      } catch (error) {
        console.error('GameResults: 獲取遊戲解析失敗:', error);
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
    // 移除自動獲取排行榜，改為按鈕觸發
    this.loadWrongQuestions();
    this.fetchGameAnalysis(); // 新增：獲取遊戲解析
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

.user-info {
  margin: 15px 0;
  padding: 10px 20px;
  background: rgba(0, 40, 40, 0.3);
  border-radius: 10px;
  border: 1px solid #00ffcc;
}

.user-name {
  color: #00ffff;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 3px #00ffcc;
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

/* 遊戲解析樣式 */
.analysis-section {
  margin: 30px auto;
  padding: 20px;
  background: rgba(0, 30, 30, 0.6);
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0,255,200,0.2);
  max-width: 900px;
  text-align: left;
}

.analysis-section h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #00ffee;
  text-shadow: 0 0 8px #00ffcc;
}

.analysis-item {
  margin-bottom: 25px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(10, 10, 10, 0.8);
  border: 2px solid transparent;
  transition: all 0.3s;
}

.analysis-item.correct {
  border-color: #00ff88;
  background: rgba(0, 40, 20, 0.3);
}

.analysis-item.incorrect {
  border-color: #ff4444;
  background: rgba(40, 0, 0, 0.3);
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.round-header h4 {
  color: #00ffff;
  margin: 0;
}

.result-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.result-badge.correct {
  background: #00ff88;
  color: #000;
}

.result-badge.incorrect {
  background: #ff4444;
  color: #fff;
}

.choice-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.user-choice, .correct-answer {
  padding: 15px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
}

.user-choice h5, .correct-answer h5 {
  margin: 0 0 10px 0;
  color: #00ffcc;
  font-size: 1rem;
}

.message-content {
  color: #fff;
  margin-bottom: 8px;
  font-style: italic;
  line-height: 1.4;
}

.message-category {
  color: #00ffff;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.message-analysis {
  color: #ccc;
  font-size: 0.85rem;
  line-height: 1.3;
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

/* 排行榜按鈕和容器 */
.leaderboard-section {
  margin: 20px 0;
}

.leaderboard-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.leaderboard-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.leaderboard-container {
  margin-top: 15px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.leaderboard-container h3 {
  color: #00ffff;
  margin-bottom: 15px;
  text-align: center;
}

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
