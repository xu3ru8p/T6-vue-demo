<template>
  <div
    class="welcome-screen relative flex flex-col items-center justify-start min-h-screen gap-4 z-10"
    @mousemove="handleMouseMove"
  >
    <!-- 上方空間 -->
    <div class="pt-4"></div>

    <!-- 標題 Header -->
    <div class="text-center mb-4">
      <!-- <h1 class="title"> 詐騙高手</h1>
      <p class="subtitle">System access granted...</p> -->
      <h1 class="text-4xl font-bold text-cyan-400 drop-shadow-lg">想測試你能不能看穿詐騙簡訊的陷阱嗎？</h1>
      <p class="text-lg text-cyan-200">覺醒你的防詐靈魂，成為 TWM 特務的一員。</p>
    </div>

    <!-- 互動科技眼睛 -->
    <div class="eye-container relative w-40 h-40 mb-1">
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <defs>
          <radialGradient id="grad-eye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" :stop-color="eyeColors[0]" />
            <stop offset="70%" :stop-color="eyeColors[1]" />
            <stop offset="100%" :stop-color="eyeColors[2]" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-eye)" class="animate-pulse-slow"/>
        <circle :cx="65 + pupilOffset.x" :cy="41.85 + pupilOffset.y" r="15" :fill="eyeColors[3]" />
        <circle :cx="65 + pupilOffset.x - 5" :cy="41.85 + pupilOffset.y - 5" r="4" fill="white" opacity="0.7" />
      </svg>
    </div>

    <!-- 文字說明 -->
    <div class="text-center mb-2">
      <h2 class="text-3xl font-bold text-cyan-300 drop-shadow-lg">歡迎來到詐騙寶島</h2>
      <p class="text-lg text-cyan-200">請找出唯一的詐騙訊息...</p>
    </div>

    <!-- 難度選擇按鈕 + 小圖示按鈕區（排行榜與管理員） -->
    <div class="flex justify-center items-center gap-4 w-full max-w-md mb-16">
      <!-- 一般 & 挑戰遊戲按鈕 -->
      <button @click="$emit('start', 'normal')" class="game-btn w-40 bg-cyan-700 hover:bg-cyan-500">
        新手挑戰
      </button>
      <button @click="$emit('start', 'challenge')" class="game-btn w-40 bg-purple-700 hover:bg-purple-500">
        極限挑戰
      </button>
      <!-- 返回按鈕（不改變排版） -->
      <button @click="$emit('back')" class="icon-btn bg-cyan-700 hover:bg-cyan-500 text-cyan-200" title="返回">
        ←
      </button>

      <!-- 排行榜按鈕（縮小圖示）與 按鈕顏色 -->
      <!-- 🏆 排行榜 SVG 按鈕 -->
  <button
    @click="openLeaderboard"
    class="icon-btn bg-cyan-700 hover:bg-cyan-600 text-cyan-400 hover:text-cyan-200"
    title="排行榜"
  >
    <!-- ⬇️ 這是 inline SVG，可用 CSS 改色 -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="icon-img"
    >
      <path d="M3 3v18h18V3H3zm2 16V5h14v14H5zm3-2h2v-6H8v6zm6 0h2V9h-2v8zm-3 0h2v-4h-2v4z" />
    </svg>
  </button>

  <!-- 👤 管理員 SVG 按鈕 -->
  <button
    v-show="!isAdmin"
    @click="promptAdmin"
    class="icon-btn bg-cyan-600 hover:bg-cyan-500 text-cyan-900 hover:text-black"
    title="管理員"
  >
    <!-- ⬇️ 這是 inline SVG，可用 CSS 改色 -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="icon-img"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 
      0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  </button>
</div>

    <!-- 管理員面板 -->
    <div
      v-if="isAdmin"
      class="admin-panel fixed right-4 top-1/4 p-4 bg-gray-900 rounded-lg w-72 flex flex-col gap-3 z-50 shadow-lg"
    >
      <h3 class="text-white font-bold mb-2">管理員模式 - 調整眼球顏色</h3>

      <!-- 眼球顏色設定 -->
      <div class="flex flex-col gap-2">
        <label class="text-cyan-200">眼球底色</label>
        <input type="color" v-model="eyeColors[0]" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-cyan-200">中間色</label>
        <input type="color" v-model="eyeColors[1]" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-cyan-200">外圍色</label>
        <input type="color" v-model="eyeColors[2]" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-cyan-200">瞳孔顏色</label>
        <input type="color" v-model="eyeColors[3]" />
      </div>

      <!-- 儲存設定按鈕 -->
      <button @click="saveEyeColors" class="game-btn mt-3 bg-green-600 hover:bg-green-500">
        儲存設定
      </button>

      <!-- 登出按鈕 -->
      <button @click="logoutAdmin" class="game-btn mt-3 bg-red-600 hover:bg-red-500">
        登出
      </button>
    </div>

    <!-- Leaderboard Modal -->
    <div v-if="showLeaderboard" class="leaderboard-modal">
      <div class="leaderboard-content">
        <button class="close-btn" @click="closeLeaderboard">✕</button>
        <h2 class="lb-title">排行榜</h2>
        <ol class="leaderboard-list">
          <li v-for="(entry, index) in leaderboard" :key="index" class="lb-item">
            <span class="rank">{{ index + 1 }}.</span>
            <span class="name">{{ entry.name }}</span>
            <span class="score">{{ entry.score }} 分</span>
          </li>
        </ol>
      </div>
    </div>
    


  </div>
  <!-- 駭客電網動畫層 -->
    <div class="hacker-grid"></div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
// ✅ 宣告 emit（包含 start 與 back）
const emit = defineEmits(['start', 'back'])


// ===========================
// 互動眼睛設定
// ===========================
const pupilOffset = reactive({ x: 0, y: 0 });
const eyeColors = reactive(["#00fff0", "#005f6a", "#001f2a", "#00fff0"]);

const fetchEyeColors = async () => {
  try {
    const res = await fetch("http://localhost:3000/get-eye-settings");
    const data = await res.json();
    eyeColors.splice(0, 4, ...data.eyeColors);
  } catch (err) {
    console.error("取得顏色設定失敗", err);
  }
};
const saveEyeColors = async () => {
  try {
    const res = await fetch("http://localhost:3000/save-eye-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eyeColors }),
    });
    const result = await res.json();
    if (result.success) alert("儲存成功");
    else alert("儲存失敗");
  } catch (err) {
    console.error(err);
    alert("儲存失敗");
  }
};

// ===========================
// 主畫面互動與管理員設定
// ===========================
const isAdmin = ref(false);
function handleMouseMove(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;
  const maxOffset = 15;
  pupilOffset.x = Math.max(Math.min(deltaX / 10, maxOffset), -maxOffset);
  pupilOffset.y = Math.max(Math.min(deltaY / 10, maxOffset), -maxOffset);
}
function promptAdmin() {
  const pwd = prompt("請輸入管理員密碼");
  if (pwd === "123") {
    isAdmin.value = true;
    alert("已進入管理員模式");
  } else {
    alert("密碼錯誤");
  }
}
function logoutAdmin() {
  isAdmin.value = false;
}

// ===========================
// 排行榜 Modal
// ===========================
const showLeaderboard = ref(false);
const leaderboard = ref([]);
const openLeaderboard = async () => {
  try {
    const res = await axios.get("http://localhost:3000/leaderboard");
    leaderboard.value = res.data;
    showLeaderboard.value = true;
  } catch (err) {
    console.error("取得排行榜失敗", err);
  }
};
const closeLeaderboard = () => {
  showLeaderboard.value = false;
};

onMounted(fetchEyeColors);
</script>

<style scoped>
/* =========================== 主畫面基本設定 =========================== */
.welcome-screen { padding-top: 2rem; }

.game-btn {
  color: #ffffff;
  padding-top: .75rem; /* py-3 */
  padding-bottom: .75rem;
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  border-radius: .5rem; /* rounded-lg */
  font-weight: 700; /* font-bold */
  text-align: center;
  transition: transform 0.2s ease; /* transition-transform duration-200 */
}
.game-btn:hover { transform: scale(1.05); }

/* =========================== SVG 眼睛動畫 =========================== */
.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.95); opacity: 0.85; }
}

/* =========================== 管理員面板顏色設定 =========================== */
.admin-panel input[type="color"] {
  width: 100%;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* =========================== Leaderboard Modal =========================== */
.leaderboard-modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}
.leaderboard-content {
  position: relative;
  background: rgba(20, 20, 30, 0.95);
  padding: 40px 30px 30px 30px;
  border-radius: 24px;
  width: 90%; max-width: 400px;
  color: #00ffcc;
  box-shadow: 0 10px 30px rgba(0, 255, 204, 0.4);
  animation: floatUp 0.5s ease-out;
  text-align: center;
}
@keyframes floatUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.close-btn {
  position: absolute;
  top: 12px; right: 12px;
  background: #00ffcc;
  color: #111;
  border: none;
  border-radius: 50%;
  width: 36px; height: 36px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.4);
}
.close-btn:hover {
  background: #0ff;
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.6);
}
.lb-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #00ffcc;
  text-shadow: 0 0 10px rgba(0,255,204,0.6);
}
.leaderboard-list {
  list-style: none;
  padding-left: 0;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
}
.lb-item {
  display: flex; justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0, 255, 204, 0.2);
  font-size: 1rem;
  transition: background 0.2s;
}
.lb-item:hover { background: rgba(0, 255, 204, 0.1); }
.rank { width: 30px; font-weight: bold; }
.name { flex: 1; text-align: left; padding-left: 10px; }
.score { width: 60px; font-weight: bold; }

/* =========================== 小圖示按鈕（排行榜與管理員） =========================== */
/* ====================== 小圖示按鈕（排行榜 / 管理員） ====================== */
.icon-btn {
  width: 2.2rem;              /* 控制按鈕整體大小 */
  height: 2.2rem;
  padding: 0.25rem;           /* 減少 padding 讓比例更緊湊 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.6rem;
  transition: all 0.25s ease;
  color: #00ffff;             /* 🟦 預設顏色 */
  box-shadow: 0 0 6px rgba(0, 255, 255, 0.4);
}

.icon-btn:hover {
  transform: scale(1.15);
  color: #80ffff;             /* 🟦 hover 時顏色 */
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.6);
}

.icon-img {
  width: 1.3rem;              /* 控制圖示大小 */
  height: 1.3rem;
}

/* =========================== 駭客電網動畫層 =========================== */
/* 🟢 背景樣式部分已在全域css的global.css中,套用還需再main.ts做引用喔! */
/* 🟢 文字內容 */
.content {
  z-index: 2;
  text-align: center;
  color: #00ffcc;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffcc;
}

.subtitle {
  margin-top: 10px;
  font-size: 1.2rem;
  opacity: 0.8;
}






</style>
