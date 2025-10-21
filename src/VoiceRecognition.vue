<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-black text-white">
    <!-- 背景效果 (滿版自適應) -->
    <BackgroundEffect class="absolute inset-0 z-0" />

    <!-- 返回按鈕 -->
    <button 
      @click="$emit('back')" 
      class="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-300 text-gray-300 hover:text-cyan-400 text-sm font-medium"
    >
      <ArrowLeft :size="16" />
      <span>返回</span>
    </button>

    <!-- 主容器 -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 py-8">
      <!-- 標題 -->
      <div class="text-center mb-8 md:mb-12">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          AI 語音助理
        </h1>
        <p class="text-gray-400 text-base md:text-lg lg:text-xl">上傳音訊或即時錄音，讓 AI 幫你轉文字與分析</p>
      </div>

      <!-- 主卡片 -->
      <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 lg:p-10 border border-gray-800 max-w-2xl md:max-w-3xl lg:max-w-4xl w-full shadow-2xl">
        <!-- 上傳區 -->
        <div class="mb-6 md:mb-8">
          <div class="flex items-center gap-2 mb-4">
            <Upload class="text-cyan-400" :size="24" />
            <h2 class="text-xl md:text-2xl font-semibold text-white">上傳語音檔案</h2>
          </div>

          <label
            class="flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-cyan-400 transition"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <FileAudio class="text-gray-500 mb-2" :size="40" />
              <p class="mb-2 text-sm md:text-base text-gray-400">
                <span class="font-semibold text-cyan-400">點擊上傳</span> 或拖曳檔案至此
              </p>
              <p class="text-xs md:text-sm text-gray-500">支援 MP3, WAV, M4A 等格式</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" @change="handleFileUpload" />
          </label>
        </div>

        <!-- 錄音區 -->
        <div class="mb-6 md:mb-8">
          <div class="flex items-center gap-2 mb-4">
            <Mic class="text-cyan-400" :size="24" />
            <h2 class="text-xl md:text-2xl font-semibold text-white">即時錄音</h2>
          </div>
          <div class="flex flex-col items-center justify-center bg-gray-800/40 p-6 rounded-xl border border-gray-700">
            <div v-if="!isRecording" class="text-center">
              <button
                @click="startRecording"
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
              >
                <Mic :size="20" /> 開始錄音
              </button>
            </div>
            <div v-else class="text-center">
              <button
                @click="stopRecording"
                class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
              >
                <Square :size="20" /> 停止錄音
              </button>
              <p class="mt-4 text-gray-400 animate-pulse">🎙️ 正在錄音中...</p>
            </div>
          </div>
        </div>

        <!-- 音訊播放與分析 -->
        <div v-if="audioUrl" class="mt-8 space-y-4">
          <div class="flex items-center gap-2">
            <Headphones class="text-gray-600 mb-4" :size="80" />
            <audio :src="audioUrl" controls class="w-full"></audio>
          </div>
          <div class="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
            <h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
              <FileText :size="20" class="text-cyan-400" /> 語音轉文字結果
            </h3>
            <p class="text-gray-300 whitespace-pre-wrap">{{ transcription || '等待 AI 分析中...' }}</p>
          </div>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="error" class="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-2">
          <AlertTriangle :size="20" />
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackgroundEffect from './BackgroundEffect.vue'
import { Upload, FileAudio, Mic, Square, Headphones, FileText, AlertTriangle, ArrowLeft } from 'lucide-vue-next'

const emit = defineEmits(['back'])
const isRecording = ref(false)
const audioUrl = ref('')
const transcription = ref('')
const error = ref('')

// 錄音相關程式保持不變
let mediaRecorder
let audioChunks = []

const startRecording = async () => { /* ...保持原本邏輯... */ }
const stopRecording = () => { /* ...保持原本邏輯... */ }
const handleFileUpload = async (event) => { /* ...保持原本邏輯... */ }
const transcribeAudio = async (file) => { /* ...保持原本邏輯... */ }
</script>

<style scoped>
audio {
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
