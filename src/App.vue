<template>
  <div id="app" class="relative min-h-screen bg-black text-cyan-400 font-sans overflow-hidden">
    <!-- 背景粒子動畫 -->
    <canvas id="bg-canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- 主內容區 -->
    <main class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
      
  <!--起始頁-->
  <Login v-if="!isLoggedIn && !gameStarted && !gameEnded && !showWelcome && !showAnalyt && !showLoginALG && !showVoiceRecognition && !showAdmin" 
  :hasCompletedQuiz="hasCompletedQuiz"
  :isLoggedIn="isLoggedIn"
  :currentUser="currentUser"
  @goToWelcome="goToWelcome" 
  @startQuizOrGame="handleStartQuizOrGame"
  @onQuizCompleted="onQuizCompleted"
  @openProfile="openAnalyt" 
  @goToLogin="goToLoginALG"
  @goToVoiceRecognition="goToVoiceRecognition"
  @logout="handleLogout" />
  
  <!--主介面（登入後顯示）-->
  <Login v-if="isLoggedIn && !gameStarted && !gameEnded && !showWelcome && !showAnalyt && !showLoginALG && !showVoiceRecognition && !showAdmin" 
  :hasCompletedQuiz="hasCompletedQuiz"
  :isLoggedIn="isLoggedIn"
  :currentUser="currentUser"
  @goToWelcome="goToWelcome" 
  @startQuizOrGame="handleStartQuizOrGame"
  @onQuizCompleted="onQuizCompleted"
  @openProfile="openAnalyt" 
  @goToLogin="goToLoginALG"
  @goToVoiceRecognition="goToVoiceRecognition"
  @logout="handleLogout" />
      
      
      <!-- Welcome 畫面 -->
      <WelcomeScreen 
        v-if="isLoggedIn && !gameStarted && !gameEnded && showWelcome && !showAdmin" 
        :userId="currentUserId"
        @start="startGame" 
        @back="goBack"
      />

  <!-- Analyt 測試頁（由 Login 的頭像打開） -->
  <Analyt v-if="!gameStarted && !gameEnded && showAnalyt && !showAdmin" @close="closeAnalyt" :currentUser="currentUser" />

  <!-- Login_ALG 頁面 -->
  <LoginALG v-if="!gameStarted && !gameEnded && showLoginALG && !showAdmin" @back="closeLoginALG" @loginSuccess="handleLoginSuccess" @analytSuccess="handleAnalytSuccess" />

  <!-- VoiceRecognition 頁面 -->
  <VoiceRecognition v-if="!gameStarted && !gameEnded && showVoiceRecognition && !showAdmin" @back="closeVoiceRecognition" />

  <!-- Admin 管理頁面 -->
  <Admin v-if="!gameStarted && !gameEnded && showAdmin" @back="closeAdmin" />

      <!-- 遊戲進行中 -->
      <GameBoard 
        v-if="gameStarted && !gameEnded"
        :round="round"
        :score="score"
        :mode="gameMode"
        :gameData="gameSessionData"
        :currentRoundData="currentRoundData"
        @next-round="nextRound"
        @end-game="endGame"
        @wrong-ids="onWrongIds"
        @user-choices="onUserChoices"
      />

      <!-- 遊戲結束 -->
      <GameResults 
        v-if="gameEnded"
        :round="round"
        :score="score"
        @restart="restartGame"
        :wrongIds="wrongIdsForResults"
        :userChoices="userChoicesForResults"
        :userData="userData"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameBoard from './GameBoard.vue'
import GameResults from './GameResults.vue'
import WelcomeScreen from './WelcomeScreen.vue'
import Login from './Login.vue'
import Analyt from './Analyt.vue'
import LoginALG from './Login_ALG.vue'
import VoiceRecognition from './VoiceRecognition.vue'
import Admin from './Admin.vue'
import soulAnimalStore from './soulAnimalStore.js'

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
const userChoicesForResults = ref([]); // 新增：存儲用戶選擇數據
const isAnalytLoggedIn = ref(false); // 新增：Analyt登入狀態
const hasCompletedQuiz = ref(false); // 新增：追蹤是否完成過測驗
const currentUser = ref('guest'); // 新增：當前用戶
const isLoggedIn = ref(false); // 新增：遊戲登入狀態
const currentUserId = ref(null); // 新增：當前用戶ID
const gameSessionData = ref(null) // 存儲從後端獲取的完整遊戲數據
const currentRoundData = ref([]) // 存儲當前關卡的題目數據
const userData = ref(null) // 存儲當前用戶數據


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

// 接收 WelcomeScreen 傳過來的模式和使用者ID
async function startGame(gameData) {
  console.log("App.vue 開始遊戲, 資料:", gameData) // 測試用
  
  // 處理新的參數格式
  if (typeof gameData === 'object' && gameData.mode) {
    gameMode.value = gameData.mode
    console.log("使用者ID:", gameData.userId)
    
    try {
      // 調用後端 API 獲取遊戲數據
      const response = await fetch('http://localhost:8000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: gameData.userId,
          game_mode: gameData.mode
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('遊戲數據獲取成功:', result)
      
      // 檢查新的響應格式
      if (!result.success) {
        throw new Error(result.error || result.message)
      }
      
      // 測試程式碼：打印從資料庫獲取到的題目內容和ID
      console.log('=== 測試：從資料庫獲取的題目內容和ID ===')
      if (result.data && result.data.rounds) {
        result.data.rounds.forEach((round, index) => {
          console.log(`第${index + 1}關題目:`)
          round.questions.forEach((question, qIndex) => {
            console.log(`  題目${qIndex + 1}:`)
            console.log(`    ID: ${question[0]}`)
            console.log(`    來源: ${question[1]}`)
            console.log(`    內容: ${question[2]}`)
            console.log(`    是否真實: ${question[3]}`)
            console.log(`    類別: ${question[4]}`)
            console.log('    ---')
          })
        })
      }
      console.log('=== 測試結束 ===')
      
      // 存儲遊戲數據
      gameSessionData.value = result.data
      
      // 設置第一關的題目數據
      if (result.data && result.data.rounds && result.data.rounds.length > 0) {
        currentRoundData.value = result.data.rounds[0].questions
        console.log('第一關題目:', currentRoundData.value)
      }
      
      gameStarted.value = true
      showWelcome.value = false
      
    } catch (error) {
      console.error('獲取遊戲數據失敗:', error)
      alert('遊戲啟動失敗，請稍後再試')
    }
  } else {
    // 兼容舊格式
    gameMode.value = gameData || 'normal'
    gameStarted.value = true
    showWelcome.value = false
  }
}

function nextRound(correct) {
  if (correct) score.value += 20
  if (round.value < 5) {
    round.value++
    
    // 設置下一關的題目數據
    if (gameSessionData.value && gameSessionData.value.rounds && gameSessionData.value.rounds.length >= round.value) {
      currentRoundData.value = gameSessionData.value.rounds[round.value - 1].questions
      console.log(`第${round.value}關題目:`, currentRoundData.value)
    }
  } else {
    // 遊戲結束時確保錯題ID已經更新
    endGame()
  }
}

async function endGame() {
  gameEnded.value = true
  gameStarted.value = false
  
  // 獲取用戶數據
  if (currentUserId.value) {
    console.log('遊戲結束，開始獲取用戶數據，用戶ID:', currentUserId.value)
    const userInfo = await getUserData(currentUserId.value)
    if (userInfo) {
      userData.value = userInfo
      console.log('用戶數據獲取成功:', userInfo)
    } else {
      console.warn('無法獲取用戶數據')
    }
  }
}

function restartGame() {
  gameStarted.value = false
  gameEnded.value = false
  showWelcome.value = false
  round.value = 1
  score.value = 0
  gameMode.value = 'normal'
  wrongIdsForResults.value = [] // 清空錯題ID
  userChoicesForResults.value = [] // 清空用戶選擇數據
  gameSessionData.value = null // 清空遊戲數據
  currentRoundData.value = [] // 清空當前關卡數據
  // 重置登入狀態（可選，根據需求決定是否重置）
  // isAnalytLoggedIn.value = false
  // 注意：不重置 isLoggedIn 和 currentUserId，保持登入狀態
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
  // 設置遊戲登入狀態
  isLoggedIn.value = true
  currentUserId.value = userInfo.userid || userInfo.id || userInfo.username
  currentUser.value = userInfo.username || userInfo.name
  
  // 關閉登入頁面，回到主介面（Login.vue）
  showLoginALG.value = false
  // 不設置 showWelcome，讓主介面顯示
}

function handleAnalytSuccess(userInfo) {
  console.log('Analyt登入成功:', userInfo)
  
  // 轉移 guest 用戶的記錄到實際登錄用戶
  const transferred = soulAnimalStore.transferRecords('guest', userInfo.username)
  if (transferred) {
    console.log(`已轉移 guest 記錄至 ${userInfo.username}`)
  }
  
  // 設置 Analyt 登入狀態
  isAnalytLoggedIn.value = true
  // 保存當前用戶
  currentUser.value = userInfo.username
  // 關閉登入頁面，打開分析頁面
  showLoginALG.value = false
  showAnalyt.value = true
}

async function getUserData(userId) {
  try {
    // 調用後端 API 獲取用戶數據
    const response = await fetch(`http://localhost:8000/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('用戶數據獲取成功:', result)
    
    if (result.success) {
      return result.data
    } else {
      console.error('獲取用戶數據失敗:', result.message)
      return null
    }
  } catch (error) {
    console.error('獲取用戶數據失敗:', error)
    return null
  }
}

function closeAdmin() {
  showAdmin.value = false
  showLoginALG.value = false
}

function handleLogout() {
  // 重置登入狀態
  isLoggedIn.value = false
  currentUserId.value = null
  currentUser.value = 'guest'
  
  // 關閉所有頁面，回到起始頁
  showWelcome.value = false
  showAnalyt.value = false
  showLoginALG.value = false
  showVoiceRecognition.value = false
  showAdmin.value = false
}
// 接收 GameBoard emit 的錯題 id
function onWrongIds(ids) {
    console.log('App.vue 接收到錯題ID:', ids);
    wrongIdsForResults.value = ids;
}

// 接收 GameBoard emit 的用戶選擇數據
function onUserChoices(choices) {
    console.log('App.vue 接收到用戶選擇數據:', choices);
    userChoicesForResults.value = choices;
}
</script>
