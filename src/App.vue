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
        v-if="gameStarted && !gameEnded"
        :round="round"
        :score="score"
        :mode="gameMode"
        @next-round="nextRound"
        @end-game="endGame"
        @wrong-ids="onWrongIds"
      />

      <!-- 遊戲結束 -->
      <GameResults 
        v-if="gameEnded"
        :round="round"
        :score="score"
        @restart="restartGame"
        :wrongIds="wrongIdsForResults"
        :currentUser="currentUser"
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
const isAnalytLoggedIn = ref(false); // 新增：Analyt登入狀態
const hasCompletedQuiz = ref(false); // 新增：追蹤是否完成過測驗
const currentUser = ref('guest'); // 新增：當前用戶
const newUserData = ref(null); // 新增：儲存新註冊的用戶資料


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
}

function nextRound(correct) {
  if (correct) score.value += 20
  if (round.value < 5) round.value++
  else {
    // 遊戲結束時確保錯題ID已經更新
    endGame()
  }
}

function endGame() {
  gameEnded.value = true
  gameStarted.value = false
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
  
  // 轉移 guest 用戶的記錄到實際登錄用戶
  const transferred = soulAnimalStore.transferRecords('guest', userInfo.username)
  if (transferred) {
    console.log(`已轉移 guest 記錄至 ${userInfo.username}`)
  }
  
  // 設置 Analyt 登入狀態
  isAnalytLoggedIn.value = true
  // 保存當前用戶
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
</script>
