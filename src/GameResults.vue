<template>
  <div class="results">
    <!-- 靈魂進化特效層 -->
    <div v-if="evolutionData?.hasEvolved" class="evolution-overlay" @click="closeEvolution">
      <div class="evolution-content" @click.stop>
        <h2 class="evolution-title">🌟 靈魂覺醒 🌟</h2>
        <div class="evolution-stages">
          <div class="stage-from">
            <span class="stage-label">{{ evolutionData?.previousStage?.name || '未知' }}</span>
            <div class="stage-desc">{{ evolutionData?.previousStage?.description || '前階段描述' }}</div>
          </div>
          <div class="evolution-arrow">➤</div>
          <div class="stage-to">
            <span class="stage-label">{{ evolutionData?.newStage?.name || '未知' }}</span>
            <div class="stage-desc">{{ evolutionData?.newStage?.description || '新階段描述' }}</div>
          </div>
        </div>
        
        <div v-if="evolutionData?.currentAnimal" class="animal-reveal">
          <h3 class="animal-name">{{ evolutionData?.currentAnimal?.animal || '未知動物' }}</h3>
          <div class="animal-group">{{ evolutionData?.currentAnimal?.group || '未知組別' }}</div>
          <div class="animal-traits">
            <span v-for="trait in (evolutionData?.currentAnimal?.traits || [])" :key="trait" class="trait-tag">
              {{ trait }}
            </span>
          </div>
        </div>
        
        <div class="evolution-stats">
          <p><strong>獲得XP:</strong> +{{ evolutionData?.xpGained || 0 }}</p>
          <p><strong>總XP:</strong> {{ evolutionData?.totalXP || 0 }}</p>
          <p><strong>科技等級:</strong> {{ evolutionData?.techLevel || 1 }}</p>
        </div>
        
        <button class="close-evolution" @click="closeEvolution">繼續遊戲</button>
      </div>
    </div>

    <h2>遊戲結束</h2>
    <p class="mission">MISSION COMPLETE</p>
    
    <!-- 靈魂狀態顯示 -->
    <div class="soul-status">
      <div class="soul-info">
        <h3>靈魂狀態</h3>
        
        <!-- 靈魂分數詳細顯示：只要有心理測驗結果就顯示 -->
        <div v-if="firstAnimalResult">
          <div class="soul-scores-detailed">
            <h4>本回合靈魂變化</h4>
            <div class="round-changes" v-if="roundScoreChanges">
              <div class="round-change-item">
                <span class="dimension-name">權威</span>
                <span class="round-change" :class="{'positive': roundScoreChanges.authority > 0, 'negative': roundScoreChanges.authority < 0}">
                  {{ formatScoreChange(roundScoreChanges.authority) }}
                </span>
              </div>
              <div class="round-change-item">
                <span class="dimension-name">時間</span>
                <span class="round-change" :class="{'positive': roundScoreChanges.timing > 0, 'negative': roundScoreChanges.timing < 0}">
                  {{ formatScoreChange(roundScoreChanges.timing) }}
                </span>
              </div>
              <div class="round-change-item">
                <span class="dimension-name">驗證</span>
                <span class="round-change" :class="{'positive': roundScoreChanges.style > 0, 'negative': roundScoreChanges.style < 0}">
                  {{ formatScoreChange(roundScoreChanges.style) }}
                </span>
              </div>
              <div class="round-change-item">
                <span class="dimension-name">動機</span>
                <span class="round-change" :class="{'positive': roundScoreChanges.motivation > 0, 'negative': roundScoreChanges.motivation < 0}">
                  {{ formatScoreChange(roundScoreChanges.motivation) }}
                </span>
              </div>
              <div class="round-change-item">
                <span class="dimension-name">科技</span>
                <span class="round-change" :class="{'positive': roundScoreChanges.tech > 0, 'negative': roundScoreChanges.tech < 0}">
                  {{ formatScoreChange(roundScoreChanges.tech) }}
                </span>
              </div>
            </div>
            
            <h4>累積總分</h4>
            <div class="scores-list">
              <span class="score-item total">權威: {{ getSoulScores().authority }}</span>
              <span class="score-item total">時間: {{ getSoulScores().timing }}</span>
              <span class="score-item total">驗證: {{ getSoulScores().style }}</span>
              <span class="score-item total">動機: {{ getSoulScores().motivation }}</span>
              <span class="score-item total">科技: {{ getSoulScores().tech }}</span>
            </div>
          </div>
        </div>
        
        <!-- 靈魂覺醒分析：五次後才顯示 -->
        <div v-if="playerGameCount >= 5 && firstAnimalResult">
          <p class="soul-hint">🌟 靈魂覺醒！你的防詐動物靈魂已顯現</p>
          
          <div class="current-animal">
            <div class="animal-emoji">{{ getAwakenedAnimalEmoji() }}</div>
            <div class="animal-info">
              <div class="animal-name">{{ getAwakenedAnimalName() }}</div>
              <div class="animal-group">基於你的心理測驗結果</div>
              <div class="animal-traits">
                <span class="trait-badge">防詐覺醒</span>
                <span class="trait-badge">靈魂顯現</span>
              </div>
            </div>
          </div>
          
          <div class="awakening-analysis">
            <h4>靈魂覺醒分析</h4>
            <p class="awakening-text">
              <span v-if="evolutionData?.hasEvolved && evolutionData?.previousAnimal && evolutionData?.currentAnimal">
                經過{{ playerGameCount }}次防詐實戰訓練後，你的靈魂動物 {{ evolutionData.previousAnimal }} 已發生轉換，轉為 {{ evolutionData.currentAnimal }} 靈魂！
              </span>
              <span v-else>
                經過{{ playerGameCount }}次防詐實戰訓練後，你的 {{ getAwakenedAnimalName() }} 靈魂已完全覺醒！
                這是根據你心理測驗的結果確定的守護動物，代表著你獨特的防詐特質和能力。
              </span>
              (目前總共已完成 {{ playerGameCount }} 次訓練)
            </p>
          </div>
        </div>
        
        <!-- 未完成5次遊戲：顯示未覺醒狀態 -->
        <div v-if="playerGameCount < 5">
          <p class="soul-hint">🥚 靈魂未覺醒，完成5次詐騙測試後解鎖你的防詐動物靈魂...</p>
          <p class="progress-hint">目前進度: {{ playerGameCount }}/5 次遊戲</p>
          <div v-if="!firstAnimalResult" class="quiz-reminder">
            <p class="reminder-text">⚠️ 請先完成心理測驗以確定你的靈魂動物類型</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 顯示當前登錄用戶及分數提交狀態 -->
    <div class="user-score-info">
      <p class="current-user">玩家: {{ currentUser }}</p>
      <p v-if="scoreSubmitted" class="submit-status success">✅ 分數已記錄！總分: {{ totalUserScore }}</p>
      <p v-else class="submit-status">⏳ 正在記錄分數...</p>
    </div>

    <!-- 錯誤題目回顧（若無錯題就不顯示） -->
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

    <!-- 排行榜（顯示來自 soulAnimalStore 的數據） -->
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

    <!-- 回首頁 -->
    <button class="restart" @click="$emit('restart')">回首頁</button>
  </div>

  <!-- 駭客電網動畫層 -->
  <div class="hacker-grid"></div>
</template>

<script>
import { scamMessages } from "../database";
import { realMessages } from "../database_true";
import soulAnimalStore from './soulAnimalStore.js';
import { EVOLUTION_STAGES } from './stores/soulAnimalSystem.js';
// 移除心理評分系統 - 改為使用Quiz.vue完成後給予+100經驗值

export default {
  name: "GameResults",
  props: {
    round: Number,
    score: Number,
    wrongIds: {
      type: Array,
      default: () => []
    },
    currentUser: {
      type: String,
      required: true
    },
    evolutionData: {
      type: Object,
      default: () => ({
        hasEvolved: false,
        xpGained: 0,
        totalXP: 0,
        techLevel: 1
      })
    }
  },
  emits: ["restart"],
  computed: {
    soulStore() {
      // 返回已import的soulAnimalStore實例
      return soulAnimalStore;
    },
    nextStageXP() {
      const currentStage = this.soulStore?.currentStage;
      if (currentStage === EVOLUTION_STAGES.EVOLUTION) {
        return 'MAX';
      }
      return (currentStage?.maxXP || 0) + 1;
    }
  },
  data() {
    return {
      leaderboard: [],
      wrongAnswers: [],
      scoreSubmitted: false,
      totalUserScore: 0,
      playerGameCount: 0,
      firstAnimalResult: null,
      calculatedScores: null,  // 儲存計算後的心理學分數
      roundScoreChanges: null  // 儲存本回合的分數變化
    };
  },
  methods: {
    closeEvolution() {
      this.$emit('close-evolution');
    },
    async submitScoreToStore() {
      console.log('GameResults: submitScoreToStore 開始執行');
      console.log('GameResults: currentUser:', this.currentUser);
      console.log('GameResults: score:', this.score);
      
      if (this.currentUser && this.score >= 0) {
        try {
          console.log('GameResults: 正在提交分數到 soulAnimalStore');
          this.totalUserScore = soulAnimalStore.addGameScore(this.currentUser, this.score);
          this.scoreSubmitted = true;
          
          const gameData = {
            round: this.round,
            score: this.score,
            wrongAnswers: this.wrongAnswers,
            mode: 'normal'
          };
          
          console.log('GameResults: 遊戲數據準備保存:', gameData);
          
          if (soulAnimalStore.saveGameRecord) {
            soulAnimalStore.saveGameRecord(this.currentUser, gameData);
          }
          
          this.loadLeaderboard();
          console.log('GameResults: 分數提交完成，總分:', this.totalUserScore);
        } catch (error) {
          console.error('提交分數時發生錯誤:', error);
          this.scoreSubmitted = false;
        }
      } else {
        console.warn('GameResults: 無效的用戶或分數，跳過分數提交');
      }
    },
    loadLeaderboard() {
      console.log('GameResults: loadLeaderboard 被調用');
      this.leaderboard = soulAnimalStore.getLeaderboard();
      console.log('GameResults: 載入的排行榜數據:', this.leaderboard);
    },
    loadWrongQuestions() {
      console.log('GameResults: loadWrongQuestions 被調用，wrongIds:', this.wrongIds);
      const wrongIdStrs = this.wrongIds.map(id => String(id));
      console.log('GameResults: 轉換後的wrongIdStrs:', wrongIdStrs);
      
      const realArray = Array.isArray(realMessages) ? realMessages : [];
      this.wrongAnswers = realArray.filter((msg) => wrongIdStrs.includes(String(msg.id)));
      
      console.log('GameResults: 找到的錯誤訊息（真實訊息）:', this.wrongAnswers);
    },
    
    loadPlayerProgress() {
      if (!this.currentUser) return;
      
      const gameRecords = soulAnimalStore.getUserGameRecords(this.currentUser);
      this.playerGameCount = gameRecords.length;
      console.log(`玩家 ${this.currentUser} 已完成 ${this.playerGameCount} 次遊戲`);
      
      const userRecords = soulAnimalStore.getUserRecords(this.currentUser);
      if (userRecords && userRecords.length > 0) {
        this.firstAnimalResult = userRecords[userRecords.length - 1].animalResult;
        console.log('玩家第一次心理測驗結果:', this.firstAnimalResult);
      } else {
        this.firstAnimalResult = null;
        console.log('未找到玩家的心理測驗記錄');
      }
    },
    
    getAwakenedAnimalEmoji() {
      if (!this.firstAnimalResult) return '🥚';
      
      const animalName = this.firstAnimalResult.finalAnimal || this.firstAnimalResult.animalName || this.firstAnimalResult.animalId;
      
      const emojiMap = {
        'fox': '🦊', 'Fox': '🦊',
        'turtle': '🐢', 'Turtle': '🐢',
        'dog': '🐶', 'Dog': '🐶',
        'cat': '🐱', 'Cat': '🐱',
        'owl': '🦉', 'Owl': '🦉',
        'squirrel': '🐿️', 'Squirrel': '🐿️',
        'shark': '🦈', 'Shark': '🦈',
        'mouse': '🐭', 'Mouse': '🐭',
        'octopus': '🐙', 'Octopus': '🐙',
        'dove': '🕊️', 'Dove': '🕊️',
        'eagle': '🦅', 'Eagle': '🦅',
        'wolf': '🐺', 'Wolf': '🐺',
        'elephant': '🐘', 'Elephant': '🐘',
        'hippo': '🦛', 'Hippo': '🦛',
        'gorilla': '🦍', 'Gorilla': '🦍',
        'otter': '🦦', 'Otter': '🦦',
        'deer': '🦌', 'Deer': '🦌'
      };
      
      return emojiMap[animalName] || '🦁';
    },
    
    getAwakenedAnimalName() {
      if (!this.firstAnimalResult) return '未知靈魂';
      
      const animalName = this.firstAnimalResult.finalAnimal || this.firstAnimalResult.animalName || this.firstAnimalResult.animalId;
      
      const animalMeta = {
        'fox': '幽影偵探狐',
        'eagle': '天空監察鷹', 
        'owl': '暗夜智者貓頭鷹',
        'shark': '深海獵殺者',
        'squirrel': '閃電警戒松鼠',
        'octopus': '變幻策略章魚',
        'cat': '月影忍者貓',
        'wolf': '荒野守護狼王',
        'turtle': '堡壘守護龜',
        'elephant': '古老記憶象',
        'hippo': '溫柔巨獸河馬',
        'gorilla': '鋼鐵金剛猩',
        'mouse': '好奇探險鼠',
        'otter': '社交明星水獺',
        'deer': '森林精靈鹿',
        'dog': '忠誠護衛犬',
        'Fox': '幽影偵探狐',
        'Eagle': '天空監察鷹', 
        'Owl': '暗夜智者貓頭鷹',
        'Shark': '深海獵殺者',
        'Squirrel': '閃電警戒松鼠',
        'Octopus': '變幻策略章魚',
        'Cat': '月影忍者貓',
        'Wolf': '荒野守護狼王',
        'Turtle': '堡壘守護龜',
        'Elephant': '古老記憶象',
        'Hippo': '溫柔巨獸河馬',
        'Gorilla': '鋼鐵金剛猩',
        'Mouse': '好奇探險鼠',
        'Otter': '社交明星水獺',
        'Deer': '森林精靈鹿',
        'Dog': '忠誠護衛犬'
      };
      
      return animalMeta[animalName] || animalName || '神秘靈魂動物';
    },
    
    getSoulScores() {
      try {
        // 直接從 localStorage 讀取最新的心理分數
        const psychologyScoresData = localStorage.getItem('soul_psychologyScores');
        const techLevelData = localStorage.getItem('soul_techLevel');
        
        if (psychologyScoresData && techLevelData) {
          const psychologyScores = JSON.parse(psychologyScoresData);
          const techLevel = JSON.parse(techLevelData);
          
          return {
            authority: psychologyScores.value?.authority || 0,
            timing: psychologyScores.value?.timing || 0,
            style: psychologyScores.value?.style || 0,
            motivation: psychologyScores.value?.motivation || 0,
            tech: techLevel.value || 0
          };
        }
        
        // 如果沒有數據，返回預設值
        return {
          authority: 0,
          timing: 0,
          style: 0,
          motivation: 0,
          tech: 0
        };
      } catch (error) {
        console.error('讀取累積分數時發生錯誤:', error);
        return {
          authority: 0,
          timing: 0,
          style: 0,
          motivation: 0,
          tech: 0
        };
      }
    },
    
    // 移除心理評分系統 - 改為使用Quiz.vue完成後給予+100經驗值
    async getQuestionPsychologyImpact(questionId, isCorrect) {
      // 返回預設影響值（保持原有的介面）
      const defaultImpact = {
        authority: isCorrect ? -2 : 3,   // 答對增強懷疑，答錯增強信任
        timing: isCorrect ? -1 : 2,      // 答對增強審慎，答錯增強衝動
        style: isCorrect ? 1 : -1,       // 答對增強細節關注，答錯偏向直覺
        motivation: isCorrect ? 2 : -2,  // 答對增強風險意識，答錯偏向獎勵追求
        tech: isCorrect ? 1 : -1         // 答對提升科技素養，答錯降低
      };
      return defaultImpact;
    },
    
    // 計算本回合的分數變化
    async calculateRoundScoreChanges() {
      console.log('🎯 計算本回合分數變化');
      
      if (!this.wrongAnswers || this.wrongAnswers.length === 0) {
        // 沒有錯題，只計算答對的影響
        const perfectRoundImpact = {
          authority: -20,  // 10題全對 × -2
          timing: -10,     // 10題全對 × -1  
          style: 10,       // 10題全對 × 1
          motivation: 20,  // 10題全對 × 2
          tech: 10         // 10題全對 × 1
        };
        
        console.log('🏆 完美通關，本回合影響:', perfectRoundImpact);
        this.roundScoreChanges = perfectRoundImpact;
        return perfectRoundImpact;
      }
      
      let roundImpact = {
        authority: 0,
        timing: 0,
        style: 0,
        motivation: 0,
        tech: 0
      };
      
      // 計算錯題的影響
      for (const wrongAnswer of this.wrongAnswers) {
        const impact = await this.getQuestionPsychologyImpact(wrongAnswer.id, false);
        roundImpact.authority += impact.authority;
        roundImpact.timing += impact.timing;
        roundImpact.style += impact.style;
        roundImpact.motivation += impact.motivation;
        roundImpact.tech += impact.tech;
      }
      
      // 計算答對題目的影響
      const correctCount = 10 - this.wrongAnswers.length;
      const defaultCorrectImpact = {
        authority: -2, timing: -1, style: 1, motivation: 2, tech: 1
      };
      
      roundImpact.authority += correctCount * defaultCorrectImpact.authority;
      roundImpact.timing += correctCount * defaultCorrectImpact.timing;
      roundImpact.style += correctCount * defaultCorrectImpact.style;
      roundImpact.motivation += correctCount * defaultCorrectImpact.motivation;
      roundImpact.tech += correctCount * defaultCorrectImpact.tech;
      
      console.log(`📊 本回合: ${this.wrongAnswers.length}錯 ${correctCount}對, 影響:`, roundImpact);
      this.roundScoreChanges = roundImpact;
      return roundImpact;
    },
    
    // 格式化分數變化顯示
    formatScoreChange(change) {
      if (change > 0) return `+${change}`;
      if (change < 0) return `${change}`;
      return `+0`;
    }
  },
  mounted() {
    console.log('=== GameResults mounted 開始 ===');
    
    soulAnimalStore.setCurrentUser(this.currentUser);
    this.loadWrongQuestions();
    this.loadLeaderboard();
    this.submitScoreToStore();
    
    this.$nextTick(() => {
      setTimeout(async () => {
        this.loadPlayerProgress();
        // 計算本回合分數變化
        await this.calculateRoundScoreChanges();
        
        // 移除心理學分數計算 - 改為使用Quiz.vue完成後給予+100經驗值
        console.log('🔄 已移除心理評分系統，改用Quiz測驗結果');
      }, 100);
    });
    
    console.log('=== GameResults mounted 完成 ===');
  },
  watch: {
    wrongIds: {
      handler() {
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

.score-display {
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 255, 204, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.score-display p {
  margin: 10px 0;
  font-size: 1.1rem;
}

.restart {
  background: linear-gradient(45deg, #00ffcc, #0ff);
  color: #000;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 20px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.restart:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0,255,200,0.5);
}

/* 靈魂進化特效 */
.evolution-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.evolution-content {
  background: linear-gradient(135deg, #0a0a0a, #1a1a3a, #2a2a4a);
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  border: 2px solid #00ffcc;
  box-shadow: 0 0 30px rgba(0,255,200,0.5);
}

.evolution-title {
  color: #ffd700;
  font-size: 2rem;
  margin-bottom: 30px;
  text-shadow: 0 0 10px #ffd700;
}

.evolution-stages {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
}

.stage-from, .stage-to {
  flex: 1;
  padding: 20px;
  background: rgba(0, 255, 204, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.stage-from {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.stage-label {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 10px;
}

.stage-desc {
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.4;
}

.evolution-arrow {
  font-size: 2rem;
  color: #00ffcc;
  margin: 0 20px;
  animation: pulse 2s infinite;
}

.animal-reveal {
  margin: 30px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 255, 204, 0.1));
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.5);
}

.animal-name {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 10px;
}

.animal-group {
  color: #00ffcc;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.animal-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.trait-tag {
  background: rgba(0, 255, 204, 0.2);
  color: #00ffcc;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 255, 204, 0.4);
}

.evolution-stats {
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.close-evolution {
  background: linear-gradient(45deg, #00ffcc, #0ff);
  color: #000;
  border: none;
  padding: 12px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
}

/* 靈魂狀態 */
.soul-status {
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, rgba(0, 255, 204, 0.1), rgba(0, 100, 255, 0.1));
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.soul-info h3 {
  color: #ffd700;
  margin-bottom: 20px;
  font-size: 1.4rem;
  text-shadow: 0 0 8px #ffd700;
}

.soul-hint {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #00ffcc;
  font-style: italic;
}

.progress-hint {
  font-size: 0.9rem;
  color: #ffd700;
  margin: 10px 0;
}

.quiz-reminder {
  margin: 15px 0;
  padding: 15px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 10px;
}

.reminder-text {
  color: #ffa500;
  font-size: 0.9rem;
  margin: 0;
}

.awakening-analysis {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 255, 204, 0.1), rgba(0, 150, 255, 0.1));
  border: 1px solid rgba(0, 255, 204, 0.3);
  border-radius: 15px;
}

.awakening-analysis h4 {
  color: #00ffcc;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
}

.awakening-text {
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
}

.soul-scores-simple {
  margin: 25px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 255, 204, 0.1), rgba(0, 150, 255, 0.1));
  border: 1px solid rgba(0, 255, 204, 0.3);
  border-radius: 15px;
  text-align: center;
}

.soul-scores-detailed {
  margin: 25px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 255, 204, 0.1), rgba(0, 150, 255, 0.1));
  border: 1px solid rgba(0, 255, 204, 0.3);
  border-radius: 15px;
  text-align: center;
}

.soul-scores-simple h4,
.soul-scores-detailed h4 {
  color: #00ffcc;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
}

.round-changes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.round-change-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 80px;
}

.dimension-name {
  font-size: 0.9rem;
  color: #ccc;
  font-weight: bold;
}

.round-change {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 50px;
  text-align: center;
}

.round-change.positive {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.round-change.negative {
  color: #ff6666;
  background: rgba(255, 102, 102, 0.1);
  border: 1px solid rgba(255, 102, 102, 0.3);
}

.scores-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.score-item {
  background: rgba(0, 255, 204, 0.1);
  color: #00ffcc;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  border: 1px solid rgba(0, 255, 204, 0.3);
  min-width: 80px;
  text-align: center;
}

.score-item.total {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 255, 204, 0.1));
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  font-size: 1.1rem;
}

.current-animal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
}

.animal-emoji {
  font-size: 4rem;
  animation: bounce 2s infinite;
}

.animal-info {
  text-align: left;
}

.trait-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 255, 204, 0.1));
  color: #ffd700;
  padding: 4px 10px;
  margin: 2px;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.axes-analysis {
  margin: 25px 0;
  padding: 20px;
  background: rgba(0, 100, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(0, 100, 255, 0.2);
}

.axes-analysis h4 {
  color: #0084ff;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.axes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.axis-item {
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 100, 255, 0.2);
}

.axis-label {
  display: block;
  color: #0084ff;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.axis-value {
  color: #00ffcc;
  font-weight: bold;
}

/* 用戶分數資訊 */
.user-score-info {
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 255, 204, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.current-user {
  font-size: 1.1rem;
  color: #00ffcc;
  margin-bottom: 10px;
}

.submit-status {
  font-size: 1rem;
}

.submit-status.success {
  color: #00ff88;
}

/* 錯誤題目回顧 */
.wrong-section {
  margin: 30px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 100, 100, 0.1), rgba(255, 200, 100, 0.1));
  border-radius: 15px;
  border: 1px solid rgba(255, 100, 100, 0.3);
}

.wrong-section h3 {
  color: #ff6666;
  margin-bottom: 20px;
}

.wrong-item {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  text-align: left;
}

.question-title {
  color: #ff8888;
  font-weight: bold;
  margin-bottom: 8px;
}

.question-content {
  color: #ffcc88;
  margin-bottom: 8px;
  font-style: italic;
}

.question-explanation {
  color: #88ffcc;
  font-size: 0.9rem;
  line-height: 1.4;
}

.perfect-text {
  font-size: 1.2rem;
  color: #ffd700;
  margin: 20px 0;
  text-shadow: 0 0 5px #ffd700;
}

/* 排行榜 */
.leaderboard {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  background: rgba(0, 255, 204, 0.1);
  border-radius: 10px;
  padding: 20px;
}

.leaderboard li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 255, 204, 0.2);
}

.leaderboard li:last-child {
  border-bottom: none;
}

.rank {
  font-weight: bold;
  color: #ffd700;
  min-width: 30px;
}

.name {
  flex: 1;
  text-align: left;
  margin-left: 15px;
}

.score {
  color: #00ffcc;
  font-weight: bold;
}

.empty-leaderboard {
  color: #888;
  font-style: italic;
  padding: 20px;
}

/* 動畫 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* 駭客電網背景 */
.hacker-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(rgba(0,255,200,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,200,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .results {
    padding: 40px 15px;
  }
  
  .evolution-stages {
    flex-direction: column;
    gap: 15px;
  }
  
  .evolution-arrow {
    transform: rotate(90deg);
    margin: 15px 0;
  }
  
  .current-animal {
    flex-direction: column;
    text-align: center;
  }
  
  .animal-info {
    text-align: center;
  }
  
  .axes-grid {
    grid-template-columns: 1fr;
  }
}
</style>