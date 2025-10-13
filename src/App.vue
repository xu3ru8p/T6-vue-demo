<template>
  <div id="app" class="relative min-h-screen bg-black text-cyan-400 font-sans overflow-hidden">
    <!-- 背景粒子動畫 -->
    <canvas id="bg-canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- 主內容區 -->
    <main class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
      <!-- Welcome 畫面 -->
      <WelcomeScreen 
        v-if="!gameStarted && !gameEnded" 
        @start="startGame" 
      />

      <!-- 遊戲進行中 -->
      <GameBoard 
        v-if="gameStarted && !gameEnded"
        :round="round"
        :score="score"
        :mode="gameMode"
        @next-round="nextRound"
        @end-game="endGame"
      />

      <!-- 遊戲結束 -->
      <GameResults 
        v-if="gameEnded"
        :round="round"
        :score="score"
        @restart="restartGame"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameBoard from './GameBoard.vue'
import GameResults from './GameResults.vue'
import WelcomeScreen from './WelcomeScreen.vue'

const gameStarted = ref(false)
const gameEnded = ref(false)
const round = ref(1)
const score = ref(0)
const gameMode = ref('normal')  // 存選擇的遊戲模式


// 接收 WelcomeScreen 傳過來的模式
function startGame(mode) {
  console.log("App.vue 開始遊戲, 模式:", mode) // 測試用
  gameMode.value = mode || 'normal'
  gameStarted.value = true
}

function nextRound(correct) {
  if (correct) score.value += 20
  if (round.value < 5) round.value++
  else endGame()
}

function endGame() {
  gameEnded.value = true
  gameStarted.value = false
}

function restartGame() {
  gameStarted.value = false
  gameEnded.value = false
  round.value = 1
  score.value = 0
  gameMode.value = 'normal'
}
</script>
