<template>
  <div id="app" class="relative min-h-screen bg-black text-cyan-400 font-sans overflow-hidden">
    <!-- 背景粒子動畫 -->
    <canvas id="bg-canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- 主內容區 -->
    <main class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
      
  <!--起始頁-->
  <Login v-if="!gameStarted && !gameEnded && !showWelcome && !showAnalyt && !showLoginALG && !showVoiceRecognition && !showAdmin" 
  :hasCompletedQuiz="hasCompletedQuiz"
  :currentUser="currentUser"
  :isLoggedIn="isAnalytLoggedIn"
  @goToWelcome="goToWelcome" 
  @startQuizOrGame="handleStartQuizOrGame"
  @onQuizCompleted="onQuizCompleted"
  @openProfile="openAnalyt" 
  @goToLogin="goToLoginALG"
  @goToVoiceRecognition="goToVoiceRecognition"
  @logout="handleLogout" />
      
      
      <!-- Welcome 畫面 -->
      <WelcomeScreen 
        v-if="!gameStarted && !gameEnded && showWelcome && !showAdmin" 
        @start="startGame" 
        @back="goBack"
      />

  <!-- Analyt 測試頁（由 Login 的頭像打開） -->
  <Analyt v-if="!gameStarted && !gameEnded && showAnalyt && !showAdmin" @close="closeAnalyt" @logout="handleLogout" :currentUser="currentUser" />

  <!-- Login_ALG 頁面 -->
  <LoginALG v-if="!gameStarted && !gameEnded && showLoginALG && !showAdmin" @back="closeLoginALG" @loginSuccess="handleLoginSuccess" @analytSuccess="handleAnalytSuccess" />

  <!-- VoiceRecognition 頁面 -->
  <VoiceRecognition v-if="!gameStarted && !gameEnded && showVoiceRecognition && !showAdmin" @back="closeVoiceRecognition" />

  <!-- Admin 管理頁面 -->
  <Admin v-if="!gameStarted && !gameEnded && showAdmin" @back="closeAdmin" :newUserData="newUserData" />

      <!-- 遊戲進行中 -->
      <GameBoard 
        ref="gameBoardRef"
        v-if="gameStarted && !gameEnded"
        :round="round"
        :score="score"
        :mode="gameMode"
        @next-round="nextRound"
        @end-game="endGame"
        @wrong-ids="onWrongIds"
        @soul-evolution="onSoulEvolution"
      />

      <!-- 遊戲結束 -->
      <GameResults 
        v-if="gameEnded"
        :round="round"
        :score="score"
        @restart="restartGame"
        :wrongIds="wrongIdsForResults"
        :currentUser="currentUser"
        :evolutionData="lastEvolutionData"
        @close-evolution="closeEvolution"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameBoard from './GameBoard.vue'
import GameResults from './GameResults.vue';
import WelcomeScreen from './WelcomeScreen.vue'
import Login from './Login.vue'
import Analyt from './Analyt.vue'
import LoginALG from './Login_ALG.vue'
import VoiceRecognition from './VoiceRecognition.vue'
import Admin from './Admin.vue'
import soulAnimalStore from './soulAnimalStore.js'
import { useSoulAnimalStore } from './stores/soulAnimalSystem.js'

// 初始化靈魂動物系統
const soulStore = useSoulAnimalStore()

// GameBoard 的引用，用於調用其方法
const gameBoardRef = ref(null)

const gameStarted = ref(false)
const gameEnded = ref(false)
const showWelcome = ref(false)
const showAnalyt = ref(false)
const showLoginALG = ref(false)
const showVoiceRecognition = ref(false)
const showAdmin = ref(false)
const round = ref(1)
const score = ref(0)
const gameMode = ref('normal')  // 存選擇的遊戲模式
const wrongIdsForResults = ref([]); // <- 新增
const isAnalytLoggedIn = ref(false); // 新增：Analyt登入狀態
const hasCompletedQuiz = ref(false); // 新增：追蹤是否完成過測驗
const currentUser = ref('guest'); // 新增：當前用戶
const newUserData = ref(null); // 新增：儲存新註冊的用戶資料
const lastEvolutionData = ref({ hasEvolved: false, xpGained: 0 }); // 新增：儲存最後的進化數據


function goToWelcome() {
  console.log('goToWelcome called from App.vue')
  showWelcome.value = true
}

// 新增：處理測驗完成
function onQuizCompleted() {
  hasCompletedQuiz.value = true
}

// 新增：處理開始測驗或遊戲的邏輯
function handleStartQuizOrGame() {
  // 這個函數會直接由 Login.vue 處理，不需要在 App.vue 中做特別處理
  // Login.vue 會根據 hasCompletedQuiz 的值決定顯示 Quiz 還是直接 emit goToWelcome
}

// 接收 WelcomeScreen 傳過來的模式
function startGame(mode) {
  console.log("App.vue 開始遊戲, 模式:", mode) // 測試用
  gameMode.value = mode || 'normal'
  gameStarted.value = true
  showWelcome.value = false
  
  // 開始新的遊戲會話
  soulStore.startGameSession()
}

function nextRound(correct) {
  if (correct) score.value += 20
  if (round.value < 5) round.value++
  else {
    // 第五回合結束，加載心理測驗結果並結束遊戲
    loadPsychologyQuizResults()
    endGame()
  }
}

function loadPsychologyQuizResults() {
  // 從存儲中加載之前的心理測驗結果
  console.log('加載心理測驗結果...')
  
  try {
    // 方法1: 從soulAnimalStore獲取當前用戶的最新測驗記錄
    const userRecords = soulAnimalStore.getUserRecords(currentUser.value)
    if (userRecords && userRecords.length > 0) {
      const latestRecord = userRecords[0] // 獲取最新的記錄
      console.log('找到用戶測驗記錄:', latestRecord)
      
      if (latestRecord.animalResult) {
        // 將動物類型設置到靈魂系統
        const animalCode = latestRecord.animalResult.finalAnimal
        
        // 需要將動物類型轉換為KTDI代碼格式
        const animalCodeMap = {
          'fox': 'KDSL', 'eagle': 'KDSR', 'owl': 'KDGL', 'shark': 'KDGR',
          'squirrel': 'KISL', 'octopus': 'KISR', 'cat': 'KIGL', 'wolf': 'KIGR',
          'turtle': 'TDSL', 'elephant': 'TDSR', 'hippo': 'TDGL', 'gorilla': 'TDGR',
          'mouse': 'TISL', 'lion': 'TISR', 'deer': 'TIGL', 'dog': 'TIGR'
        }
        
        const ktdiCode = animalCodeMap[animalCode]
        if (ktdiCode) {
          soulStore.setAnimalFromQuiz(ktdiCode)
          console.log('已設置動物類型:', ktdiCode, '對應:', animalCode)
        } else {
          console.warn('找不到對應的KTDI代碼:', animalCode)
        }
      }
      return
    }
    
    // 方法2: 嘗試從localStorage直接讀取
    const quizResults = localStorage.getItem('psychologyQuizResults')
    if (quizResults) {
      const parsedResults = JSON.parse(quizResults)
      console.log('找到localStorage中的心理測驗結果:', parsedResults)
      
      // 將結果設置到靈魂系統
      if (parsedResults.animalType && parsedResults.animalType.code) {
        soulStore.setAnimalFromQuiz(parsedResults.animalType.code, parsedResults.scores)
        console.log('已設置動物類型:', parsedResults.animalType.code)
      }
    } else {
      console.log('未找到心理測驗結果，將使用遊戲中累積的數據')
    }
  } catch (error) {
    console.error('加載心理測驗結果失敗:', error)
  }
}

function endGame() {
  console.log('=== App.vue endGame Debug ===');
  
  // 停止所有音效（遊戲結束時）
  if (gameBoardRef.value && gameBoardRef.value.stopAllAudio) {
    gameBoardRef.value.stopAllAudio()
    console.log('已停止所有遊戲音效')
  }
  
  gameEnded.value = true
  gameStarted.value = false
  
  // 保留最後一回合的 roundGains 數據
  const lastRoundGains = lastEvolutionData.value.roundGains
  console.log('保留的最後一回合 roundGains:', lastRoundGains);
  
  // 結束遊戲會話並獲取本局統計
  const sessionGains = soulStore.endGameSession()
  console.log('App.vue endGame sessionGains:', sessionGains);
  
  // 更新 lastEvolutionData，同時保持 roundGains 和添加 sessionGains
  if (sessionGains) {
    lastEvolutionData.value = {
      ...lastEvolutionData.value,
      sessionGains: sessionGains,
      roundGains: lastRoundGains // 確保保留最後一回合的數據
    }
    console.log('遊戲結束，本局獲得分數:', sessionGains)
    console.log('更新後的 lastEvolutionData:', lastEvolutionData.value);
  }
  console.log('=== App.vue endGame Debug 結束 ===');
}

function restartGame() {
  gameStarted.value = false
  gameEnded.value = false
  showWelcome.value = false
  round.value = 1
  score.value = 0
  gameMode.value = 'normal'
  wrongIdsForResults.value = [] // 清空錯題ID
  // 重置登入狀態（可選，根據需求決定是否重置）
  // isAnalytLoggedIn.value = false
}

function goBack() {
  // 從 WelcomeScreen 返回 Login
  showWelcome.value = false
}

function openAnalyt() {
  // 檢查是否已經使用 white 帳號登入
  if (isAnalytLoggedIn.value) {
    showAnalyt.value = true
  } else {
    alert('你尚未登入，請先登入帳號\n\n請使用 Login 頁面右下角的「Login」按鈕\n使用帳號：white，密碼：123 進行登入')
  }
}

function closeAnalyt() {
  showAnalyt.value = false
  // 注意：不重置 isAnalytLoggedIn.value，保持登入狀態
}

// 新增：處理登出功能
function handleLogout() {
  // 🌟 重置靈魂動物系統的登錄狀態
  soulStore.setUserLoginStatus(false, null)
  
  // 重置所有登入相關狀態
  isAnalytLoggedIn.value = false
  currentUser.value = 'guest'
  hasCompletedQuiz.value = false  // 重置測驗完成狀態
  
  // 關閉分析頁面
  showAnalyt.value = false
  
  // 直接登出，不顯示提示
  console.log('用戶已登出，回到登入頁面')
}

function goToLoginALG() {
  showLoginALG.value = true
}

function closeLoginALG() {
  showLoginALG.value = false
}

function goToVoiceRecognition() {
  showVoiceRecognition.value = true
}

function closeVoiceRecognition() {
  showVoiceRecognition.value = false
}

function handleLoginSuccess(userInfo) {
  console.log('登入成功:', userInfo)
  
  // 設置登入狀態和用戶資訊
  isAnalytLoggedIn.value = true
  currentUser.value = userInfo.username
  
  // 🌟 設置靈魂動物系統的登錄狀態並觸發同步
  soulStore.setUserLoginStatus(true, userInfo.username)
  
  // 如果有新用戶資料，儲存到 newUserData
  if (userInfo.userData) {
    newUserData.value = userInfo.userData
    console.log('新用戶註冊:', userInfo.userData)
  }
  
  // 轉移 guest 用戶的記錄到實際登錄用戶
  const transferred = soulAnimalStore.transferRecords('guest', userInfo.username)
  if (transferred) {
    console.log(`已轉移 guest 記錄至 ${userInfo.username}`)
  }
  
  // 檢查用戶是否已經完成過測驗
  const userRecords = soulAnimalStore.getUserRecords(userInfo.username)
  hasCompletedQuiz.value = userRecords && userRecords.length > 0
  console.log(`用戶 ${userInfo.username} 測驗完成狀態: ${hasCompletedQuiz.value}`)
  
  // 關閉登入頁面
  showLoginALG.value = false
  
  // 根據用戶類型和用戶名決定跳轉
  if (userInfo.username === 'test' && userInfo.type === 'admin') {
    // 只有 test 帳號才能進入管理後台
    showAdmin.value = true
  } else {
    // 其他所有用戶（包括新註冊的用戶）都跳轉到個人頁面
    showAnalyt.value = true
  }
}

function handleAnalytSuccess(userInfo) {
  console.log('Analyt登入成功:', userInfo)
  
  // 🌟 設置靈魂動物系統的登錄狀態並觸發同步
  soulStore.setUserLoginStatus(true, userInfo.username)
  
  // 轉移 guest 用戶的記錄到實際登錄用戶
  const transferred = soulAnimalStore.transferRecords('guest', userInfo.username)
  if (transferred) {
    console.log(`已轉移 guest 記錄至 ${userInfo.username}`)
  }
  
  // 設置 Analyt 登入狀態
  isAnalytLoggedIn.value = true
  // 保存當前用戶
  currentUser.value = userInfo.username
  currentUser.value = userInfo.username
  
  // 檢查用戶是否已經完成過測驗
  const userRecords = soulAnimalStore.getUserRecords(userInfo.username)
  hasCompletedQuiz.value = userRecords && userRecords.length > 0
  console.log(`用戶 ${userInfo.username} 測驗完成狀態: ${hasCompletedQuiz.value}`)
  
  // 關閉登入頁面，打開分析頁面
  showLoginALG.value = false
  showAnalyt.value = true
}

function closeAdmin() {
  // 關閉 Admin 頁面並執行完整登出
  showAdmin.value = false
  showLoginALG.value = false
  
  // 重置登入狀態
  isAnalytLoggedIn.value = false
  currentUser.value = 'guest'
  
  console.log('管理員已登出，回到主頁面')
}
// 接收 GameBoard emit 的錯題 id
function onWrongIds(ids) {
    console.log('App.vue 接收到錯題ID:', ids);
    wrongIdsForResults.value = ids;
}

// 處理靈魂進化事件
function onSoulEvolution(evolutionData) {
    console.log('=== App.vue onSoulEvolution Debug ===');
    console.log('App.vue 接收到靈魂進化數據:', evolutionData);
    console.log('evolutionData.roundGains:', evolutionData.roundGains);
    lastEvolutionData.value = evolutionData;
    
    // 如果有進化發生，可以在這裡添加額外的處理邏輯
    if (evolutionData.hasEvolved) {
        console.log(`🌟 靈魂進化！從 ${evolutionData.previousStage.name} 進化到 ${evolutionData.newStage.name}`);
        if (evolutionData.currentAnimal) {
            console.log(`🦊 覺醒為 ${evolutionData.currentAnimal.animal}型 (${evolutionData.currentAnimal.group})`);
        }
    }
    console.log('=== App.vue Debug 結束 ===');
}

// 關閉進化特效
function closeEvolution() {
    if (lastEvolutionData.value.hasEvolved) {
        lastEvolutionData.value = { ...lastEvolutionData.value, hasEvolved: false };
    }
}

// 開發環境：將 soulStore 掛載到全域，方便控制台調試
if (import.meta.env.DEV) {
  window.soulStore = soulStore;
  window.soulAnimalStore = soulAnimalStore; // 添加 soulAnimalStore
  console.log('🔧 開發模式：soulStore 已掛載到 window.soulStore，可以在控制台中使用');
  console.log('📝 使用方法：');
  console.log('  - 診斷：window.soulStore.diagnosePsychologyScores()');
  console.log('  - 修復：window.soulStore.fixPsychologyScores()');
  console.log('  - 清理用戶：window.soulStore.clearUserData("username")');
  console.log('  - 修復動物名稱：window.soulAnimalStore.fixAnimalNames("username") 或 fixAnimalNames() 修復所有用戶');
}
</script>
