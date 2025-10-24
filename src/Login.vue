<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-black text-white">
    <!-- 只有在主畫面時顯示背景和內容 -->
    <div v-if="state === 'login'">
    <!-- Canvas for 3D Wireframe Sphere -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- Animated Particles -->
    <div class="absolute inset-0 z-0">
      <div
        v-for="(particle, i) in particles"
        :key="'particle-' + i"
        :style="{
          left: particle.x + '%',
          top: particle.y + '%',
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's'
        }"
        class="absolute w-2 h-2 bg-cyan-400 rounded-full animate-float-particle opacity-60"
      ></div>
    </div>

    <!-- Floating SMS Icons -->
    <div class="absolute inset-0 z-0">
      <div
        v-for="(sms, i) in smsIcons"
        :key="'sms-' + i"
        :style="{
          left: sms.x + '%',
          top: sms.y + '%',
          animationDelay: sms.delay + 's',
          animationDuration: sms.duration + 's'
        }"
        class="absolute animate-float-sms opacity-40"
      >
        <MessageSquare :size="sms.size" color="#ffffff" :stroke-width="1.5" />
      </div>
    </div>

    <!-- 右上角使用者按鈕 -->
    <div class="absolute top-6 right-8 z-20">
      <div class="relative">
        <!-- 頭像按鈕容器 -->
        <div class="relative group">
          <!-- 登入狀態光環效果 -->
          <div 
            v-if="props.isLoggedIn && props.currentUser !== 'guest'"
            class="absolute -inset-2 bg-gradient-to-r from-green-400/30 via-emerald-400/40 to-green-500/30 rounded-full opacity-80 group-hover:opacity-100 animate-pulse transition-opacity duration-500"
          ></div>
          
          <!-- 頭像按鈕 -->
          <button 
            @click="$emit('openProfile')" 
            aria-label="開啟使用者設定" 
            :class="[
              'relative avatar-btn w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 focus:outline-none transition-all duration-300 group-hover:scale-105',
              props.isLoggedIn && props.currentUser !== 'guest' 
                ? 'border-green-400/60 bg-green-400/5 shadow-green-400/20' 
                : 'border-cyan-400/60 bg-cyan-400/5 shadow-cyan-400/20'
            ]"
          >
            <!-- 背景光暈 -->
            <div 
              :class="[
                'absolute inset-0 rounded-full transition-all duration-300',
                props.isLoggedIn && props.currentUser !== 'guest'
                  ? 'bg-gradient-to-br from-green-400/15 via-emerald-400/8 to-green-600/12'
                  : 'bg-gradient-to-br from-cyan-400/15 via-blue-400/8 to-cyan-600/12'
              ]"
            ></div>
            
            <!-- 頭像內容 -->
            <span class="relative avatar-inner">
              <img v-if="!useFallback && avatarSrc" :src="avatarSrc" alt="avatar" class="avatar-img" @error="onAvatarError" />
              <span v-else class="avatar-frame" aria-hidden="true">
                <svg class="avatar-img-svg" viewBox="0 0 1314 1024" xmlns="http://www.w3.org/2000/svg" role="img">
                  <path d="M503.315257 277.467529m-277.467528 0a277.467529 277.467529 0 1 0 554.935057 0 277.467529 277.467529 0 1 0-554.935057 0Z" fill="#13227a"></path>
                  <path d="M679.675502 662.61698H326.955013A327.887901 327.887901 0 0 0 0 989.571993a34.516854 34.516854 0 0 0 34.428007 34.428007h937.818924a34.516854 34.516854 0 0 0 34.428007-34.428007 327.887901 327.887901 0 0 0-326.999436-326.955013zM771.142944 463.512039a204.835539 204.835539 0 1 0 49.754024-275.42406 310.074183 310.074183 0 0 1-49.754024 275.42406z" fill="#13227a"></path>
                  <path d="M1073.531908 633.65303H812.945208c-6.752332 0-13.326971 0.355386-20.079302 0.888465a363.648605 363.648605 0 0 1 259.520541 265.873064h236.997961A25.498937 25.498937 0 0 0 1314.927769 875.137738a242.106633 242.106633 0 0 0-241.395861-241.484708z" fill="#13227a"></path>
                </svg>
              </span>
            </span>
          </button>
        </div>
        
        <!-- 帳號名稱標籤 (重新設計，更簡潔) -->
        <div 
          v-if="props.isLoggedIn && props.currentUser !== 'guest'"
          class="absolute top-full mt-3 right-0 transform transition-all duration-300"
        >
          <div 
            :class="[
              'relative backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border transition-all duration-300',
              'bg-gradient-to-r from-gray-900/90 via-gray-800/95 to-gray-900/90',
              'border-green-400/25 shadow-green-400/10'
            ]"
          >
            <!-- 頂部連接線 -->
            <div class="absolute -top-2 right-6 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-green-400/25"></div>
            
            <!-- 用戶資訊 - 橫向排列更緊湊 -->
            <div class="flex items-center gap-3">
              <!-- 狀態指示器 - 使用更精緻的設計 -->
              <div class="relative">
                <div class="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                <div class="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-40"></div>
              </div>
              
              <!-- 帳號名稱 -->
              <div class="text-center">
                <div class="text-green-400 text-sm font-medium tracking-wide">{{ props.currentUser }}</div>
                <div class="text-green-300/60 text-xs font-light">線上</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 詳細資訊浮動標籤 (簡化版) -->
        <div 
          v-if="props.isLoggedIn && props.currentUser !== 'guest'"
          class="absolute top-full mt-20 right-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 pointer-events-none z-30"
        >
          <div class="bg-gray-900/98 backdrop-blur-xl border border-green-400/30 rounded-xl px-5 py-4 shadow-2xl min-w-[160px] relative">
            <!-- 頂部光效 -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-green-400/60 to-transparent"></div>
            
            <!-- 用戶資訊卡片 -->
            <div class="space-y-3">
              <!-- 頭部區域 -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-400/30">
                  <span class="text-green-400 text-sm font-bold">{{ props.currentUser.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="flex-1">
                  <div class="text-white text-sm font-semibold">{{ props.currentUser }}</div>
                  <div class="text-green-400 text-xs">管理員帳號</div>
                </div>
              </div>
              
              <!-- 分隔線 -->
              <div class="border-t border-gray-700/50"></div>
              
              <!-- 操作提示 -->
              <div class="text-center">
                <div class="text-gray-300 text-xs">點擊頭像</div>
                <div class="text-green-400 text-xs font-medium">進入管理後台</div>
              </div>
            </div>
            
            <!-- 底部光效 -->
            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div class="text-center space-y-6">
        <!-- Title with cyan glow -->
        <h1 class="text-4xl md:text-6xl font-bold text-cyan-400 mb-2" style="text-shadow: 0 0 40px rgba(34, 211, 238, 0.8), 0 0 80px rgba(34, 211, 238, 0.4);">
          詐騙特務 TWM
        </h1>
        <span class="text-3xl md:text-5xl font-normal text-cyan-400 mb-2" style="text-shadow: 0 0 40px rgba(34, 211, 238, 0.8), 0 0 80px rgba(34, 211, 238, 0.4)">靈魂覺醒計畫</span>
        <p class="text-lg md:text-2xl text-gray-400 mb-8">
          Anti-Fraud Agent: The Soul Awakening
        </p>

        <!-- Buttons with icons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <button
            @click="handleAuthButton"
            :class="[
              'group relative px-8 py-4 text-white text-base rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] shadow-lg',
              props.isLoggedIn && props.currentUser !== 'guest' 
                ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-600/50' 
                : 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-cyan-500/50'
            ]"
          >
            {{ props.isLoggedIn && props.currentUser !== 'guest' ? '登出' : '註冊登入' }}
          </button>
          <button
            @click="handleGameStart"
            :class="[
              'group relative px-8 py-4 text-white text-base rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] shadow-lg flex items-center justify-center gap-2',
              props.isLoggedIn && props.currentUser !== 'guest'
                ? 'bg-purple-600 hover:bg-purple-500 hover:shadow-purple-600/50'
                : 'bg-gray-600 hover:bg-gray-500 hover:shadow-gray-600/50 opacity-75'
            ]"
          >
            <Gamepad2 :size="20" />
            遊戲開始
            <span v-if="!props.isLoggedIn || props.currentUser === 'guest'" class="text-xs opacity-75 ml-1">🔒</span>
          </button>
          <button
            @click="$emit('goToVoiceRecognition')"
            class="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] shadow-lg hover:shadow-blue-600/50 flex items-center justify-center gap-2"
          >
            <Mic :size="20" />
            語音辨識
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="absolute bottom-8 left-0 right-0 z-20">
      <div class="flex justify-center gap-12 text-gray-400 text-sm">
        <button @click="$emit('goToLogin')" class="hover:text-cyan-400 transition-colors">Login</button>
        <button @click="$emit('openProfile')" class="hover:text-cyan-400 transition-colors">管理後台</button>
        <button @click="$emit('goToVoiceRecognition')" class="hover:text-cyan-400 transition-colors">語音辨識</button>
      </div>
    </div>
    </div> <!-- 關閉 v-if="state === 'login'" -->

    <!-- Quiz 和 Animal 組件 -->
    <div v-if="state === 'quiz'">
      <Quiz @resultReady="onResultReady" @cancel="cancelQuiz" :currentUser="props.currentUser"/>
    </div>
    
    <div v-if="state === 'result'">
      <Animal :resultObject="result" @backToWelcome="toWelcome" @retry="restart"/>
    </div>
  </div>



</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MessageSquare, Gamepad2, Mic } from 'lucide-vue-next'
import Quiz from './Quiz.vue'
import Animal from './Animal.vue'

// 明確宣告元件會發出的事件
const emit = defineEmits(['goToWelcome', 'startQuizOrGame', 'onQuizCompleted', 'openProfile', 'goToLogin', 'goToVoiceRecognition', 'logout'])

// 定義 props
const props = defineProps({
  hasCompletedQuiz: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  currentUser: { type: String, default: 'guest' }
})

// Avatar 相關設定
let initialAvatar = '';
try {
    initialAvatar = new URL('../assets/Gemini_Generated_Image_001.png', import.meta.url).href;
} catch (e) {
    initialAvatar = '';
}

let icons8Avatar = '';
try {
    icons8Avatar = new URL('../assets/icons8_app.svg', import.meta.url).href;
} catch (e) {
    icons8Avatar = '';
}

let thumbAvatar = '';
try {
    thumbAvatar = new URL('../assets/thumbs/Gemini_Generated_Image_001.png', import.meta.url).href;
} catch (e) {
    thumbAvatar = initialAvatar;
}

let localPerson = '';
try {
    localPerson = new URL('../assets/svg/person.svg', import.meta.url).href;
} catch (e) {
    localPerson = '';
}

const avatarSrc = ref(localPerson || icons8Avatar || thumbAvatar || initialAvatar);
const useFallback = ref(false);

const onAvatarError = (e) => {
    avatarSrc.value = '';
};

// 3D 動畫相關
const canvasRef = ref(null)
const particles = ref([])
const smsIcons = ref([])

// Generate particles
for (let i = 0; i < 50; i++) {
  particles.value.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4
  })
}

// Generate SMS icons
for (let i = 0; i < 15; i++) {
  smsIcons.value.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 24 + Math.random() * 32,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10
  })
}

// 3D Wireframe Sphere Animation
let animationId = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  
  const updateCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  updateCanvasSize()

  // Sphere parameters - 調整為滿版顯示
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.max(canvas.width, canvas.height) * 0.5  // 使用最大尺寸讓球體滿版
  const segments = 32
  const rings = 16

  // Generate sphere vertices
  const vertices = []
  for (let i = 0; i <= rings; i++) {
    const theta = (i * Math.PI) / rings
    for (let j = 0; j <= segments; j++) {
      const phi = (j * 2 * Math.PI) / segments
      vertices.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.cos(theta),
        z: radius * Math.sin(theta) * Math.sin(phi)
      })
    }
  }

  let rotation = 0

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    rotation += 0.003

    // Rotate and project vertices
    const projected = vertices.map(v => {
      // Rotate around Y axis
      const x = v.x * Math.cos(rotation) - v.z * Math.sin(rotation)
      const z = v.x * Math.sin(rotation) + v.z * Math.cos(rotation)
      const y = v.y

      // Simple perspective projection
      const scale = 300 / (300 + z)
      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
        z: z
      }
    })

    // Draw triangular mesh
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
    ctx.lineWidth = 1

    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segments; j++) {
        const idx1 = i * (segments + 1) + j
        const idx2 = idx1 + 1
        const idx3 = (i + 1) * (segments + 1) + j
        const idx4 = idx3 + 1

        // Draw lines
        ctx.beginPath()
        ctx.moveTo(projected[idx1].x, projected[idx1].y)
        ctx.lineTo(projected[idx2].x, projected[idx2].y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(projected[idx1].x, projected[idx1].y)
        ctx.lineTo(projected[idx3].x, projected[idx3].y)
        ctx.stroke()

        // Draw diagonal for triangular mesh
        ctx.beginPath()
        ctx.moveTo(projected[idx1].x, projected[idx1].y)
        ctx.lineTo(projected[idx4].x, projected[idx4].y)
        ctx.stroke()
      }
    }

    // Draw vertices as dots
    ctx.fillStyle = 'rgba(34, 211, 238, 0.6)'
    projected.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()

  // Handle resize
  const handleResize = () => {
    updateCanvasSize()
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
  })
})

// 這邊跟Quiz.vue有關係的程式碼:

const state = ref('login') // 改為 'login'，表示主畫面狀態
const result = ref(null)

// 處理遊戲開始按鈕
function handleGameStart() {
  // 檢查是否已登入
  if (!props.isLoggedIn || props.currentUser === 'guest') {
    alert('您尚未註冊登入！\n\n請先點選「註冊登入」按鈕完成註冊，\n獲得專屬帳號後即可開始遊戲。\n\n建議使用帳號：white，密碼：123 進行測試')
    return
  }

  if (props.hasCompletedQuiz) {
    // 如果已經完成過測驗，直接進入遊戲
    emit('goToWelcome')
  } else {
    // 如果還沒完成測驗，先顯示測驗
    state.value = 'quiz'
  }
}

// 處理認證按鈕（登入/登出）
function handleAuthButton() {
  if (props.isLoggedIn && props.currentUser !== 'guest') {
    // 如果已登入，直接執行登出
    emit('logout')
  } else {
    // 如果未登入，前往登入頁面
    emit('goToLogin')
  }
}

function onResultReady(payload) { 
  console.log('Login.vue收到Quiz結果:', payload) // 調試用
  result.value = payload
  state.value = 'result' 
}

function toWelcome() { 
  // 從 Animal 頁面的「準備遊戲挑戰」按鈕呼叫
  emit('onQuizCompleted') // 通知父組件測驗已完成
  emit('goToWelcome') // 進入 WelcomeScreen
}

function restart() { 
  state.value = 'quiz'
  result.value = null 
}

function cancelQuiz() {
  // 從 Quiz 取消回到主畫面
  state.value = 'login'
}



</script>

<style scoped>
/* ALG 粒子和 SMS 動畫 */
@keyframes float-particle {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 1;
  }
}

@keyframes float-sms {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) translateX(15px) rotate(5deg);
  }
  50% {
    transform: translateY(-15px) translateX(-15px) rotate(-5deg);
  }
  75% {
    transform: translateY(-40px) translateX(10px) rotate(3deg);
  }
}

.animate-float-particle {
  animation: float-particle ease-in-out infinite;
}

.animate-float-sms {
  animation: float-sms linear infinite;
}

/* Avatar 相關樣式 (重新設計版) */
.avatar-btn {
    padding: 0.125rem;
    background-clip: padding-box;
    position: relative;
    overflow: visible;
}

.avatar-btn:hover {
    transform: translateY(-2px) scale(1.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-btn:focus {
    outline: 3px solid rgba(56, 248, 184, 0.22);
    outline-offset: 2px;
}

.avatar-btn:hover .avatar-inner {
    animation-play-state: paused;
}

.avatar-img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 9999px;
    position: relative;
    z-index: 1;
}

.avatar-frame {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background: radial-gradient(circle at 30% 30%, #8ef0d6 0%, #37c0ff 60%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    overflow: hidden;
    position: relative;
    z-index: 1;
}

.avatar-img-svg {
    width: 36px;
    height: 36px;
    display: block;
}

.avatar-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    will-change: transform, filter;
    animation: avatar-gentle-float 4s ease-in-out infinite;
    position: relative;
    z-index: 1;
}

/* 群組懸停效果 */
.group:hover .avatar-inner {
    animation-duration: 2s;
}

/* 優化的浮動動畫 */
@keyframes avatar-gentle-float {
    0% { 
        transform: translateY(0) rotate(0deg); 
        filter: hue-rotate(0deg) saturate(1) brightness(1);
    }
    25% { 
        transform: translateY(-1px) rotate(-0.3deg); 
        filter: hue-rotate(3deg) saturate(1.02) brightness(1.05);
    }
    50% { 
        transform: translateY(0) rotate(0.2deg); 
        filter: hue-rotate(-2deg) saturate(1) brightness(1);
    }
    75% { 
        transform: translateY(-0.5px) rotate(0.2deg); 
        filter: hue-rotate(2deg) saturate(1.01) brightness(1.02);
    }
    100% { 
        transform: translateY(0) rotate(0deg); 
        filter: hue-rotate(0deg) saturate(1) brightness(1);
    }
}

/* 光環脈衝動畫 - 更柔和的版本 */
@keyframes glow-pulse {
    0%, 100% { 
        opacity: 0.6;
        transform: scale(1);
    }
    50% { 
        opacity: 0.9;
        transform: scale(1.02);
    }
}

/* 狀態指示器脈衝動畫 */
@keyframes status-ping {
    0% { 
        opacity: 1;
        transform: scale(1);
    }
    75%, 100% { 
        opacity: 0;
        transform: scale(1.4);
    }
}

/* 優雅的浮動標籤動畫 */
@keyframes elegant-fade-up {
    from {
        opacity: 0;
        transform: translateY(12px) scale(0.95);
        filter: blur(2px);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

/* 頭像邊框呼吸效果 */
@keyframes border-breathe {
    0%, 100% { 
        border-color: rgba(34, 197, 94, 0.6);
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
    }
    50% { 
        border-color: rgba(34, 197, 94, 0.8);
        box-shadow: 0 0 25px rgba(34, 197, 94, 0.2);
    }
}

/* 應用動畫到相應元素 */
.avatar-btn[class*="border-green"] {
    animation: border-breathe 3s ease-in-out infinite;
}

.group:hover .elegant-fade-up {
    animation: elegant-fade-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 響應式設計 */
@media (max-width: 640px) {
    .avatar-btn {
        width: 3.5rem;
        height: 3.5rem;
    }
    
    .avatar-img,
    .avatar-frame {
        width: 2rem;
        height: 2rem;
    }
    
    .avatar-img-svg {
        width: 28px;
        height: 28px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .avatar-inner { animation: none; }
    .animate-float-particle { animation: none; }
    .animate-float-sms { animation: none; }
}
</style>