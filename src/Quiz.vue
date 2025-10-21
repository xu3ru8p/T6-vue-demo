<!-- Quiz.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-black text-slate-100 p-6 relative">
    <!-- 駭客電網動畫層 -->
    <div class="hacker-grid"></div>
    
    <div class="w-full max-w-2xl relative">
      <!-- 背景裝飾層 -->
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-purple-600/10 rounded-2xl blur-xl"></div>
      <div class="absolute inset-0 bg-gradient-to-tr from-slate-800/40 via-slate-900/60 to-slate-800/40 rounded-2xl backdrop-blur-sm"></div>
      
      <!-- 主要內容區域 -->
      <div class="relative z-10 bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-slate-800/70 border border-cyan-400/20 rounded-2xl p-6 backdrop-blur-md shadow-2xl shadow-cyan-500/10">
        <!-- 頂部光暈效果 -->
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rounded-full"></div>
      <h2 class="text-2xl font-bold mb-2">防詐特務：靈魂覺醒測驗</h2>
      <p class="text-sm text-slate-400 mb-4">回答 13 題，就會知道你的防詐靈魂動物是什麼!</p>

      <div v-if="!started" class="flex gap-3">
        <button @click="start" class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105">
          開始測驗
        </button>
        <button @click="$emit('cancel')" class="px-6 py-3 border border-slate-600 hover:border-slate-500 rounded-lg font-medium transition-all duration-300 hover:bg-slate-800/50 hover:scale-105">
          回上頁
        </button>
      </div>

      <div v-else>
        <!-- Progress -->
        <div class="mb-6">
          <!-- 進度條標題 -->
          <div class="flex justify-between items-center mb-3">
            <div class="text-cyan-300 font-medium">題目 {{ currentIndex + 1 }} / {{ questions.length }}</div>
            <div class="text-sm bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">
              反詐意識：{{ Math.round(awarenessPreview) }}
            </div>
          </div>
          
          <!-- 視覺化進度條 -->
          <div class="relative">
            <div class="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                   :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }">
              </div>
            </div>
            <!-- 進度條光暈效果 -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 rounded-full blur-sm"
                 :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }">
            </div>
          </div>
        </div>

        <!-- Card -->
        <div class="relative">
          <!-- 題目卡片背景裝飾 -->
          <div class="absolute inset-0 bg-gradient-to-br from-slate-700/30 via-slate-800/40 to-slate-700/30 rounded-xl blur-sm"></div>
          
          <div class="relative bg-gradient-to-br from-slate-800/60 via-slate-900/70 to-slate-800/60 p-6 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <!-- 題目文字 -->
            <div class="mb-5 text-slate-100 font-medium text-lg leading-relaxed" v-html="questions[currentIndex].text"></div>

            <!-- 選項按鈕 -->
            <div class="grid gap-3">
              <button v-for="(opt, idx) in questions[currentIndex].options"
                      :key="idx"
                      @click="choose(idx)"
                      class="group relative text-left p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      :class="selected === idx ? 
                        'bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20' : 
                        'border-slate-600/40 hover:border-slate-500/60 hover:bg-slate-800/40'">
                <!-- 選中狀態的光暈效果 -->
                <div v-if="selected === idx" class="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-cyan-400/5 rounded-xl"></div>
                
                <div class="relative font-medium text-slate-200 group-hover:text-slate-100 transition-colors duration-300">
                  {{ opt }}
                </div>
                
                <!-- 選中指示器 -->
                <div v-if="selected === idx" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Nav -->
        <div class="mt-6 flex justify-between items-center">
          <button @click="prev" 
                  :disabled="currentIndex === 0" 
                  class="px-5 py-2.5 border border-slate-600 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-500 hover:bg-slate-800/50 hover:scale-105">
            上題
          </button>
          
          <div class="flex items-center gap-3">
            <div v-if="currentIndex < questions.length - 1">
              <button @click="nextIfSelected" 
                      class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105">
                下一題
              </button>
            </div>
            <div v-else>
              <button @click="finish" 
                      class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105">
                提交並看結果
              </button>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import soulAnimalStore from './soulAnimalStore.js'

// 定義 emits
const emit = defineEmits(['resultReady', 'cancel'])

// 定義 props - 接收當前用戶
const props = defineProps({
  currentUser: {
    type: String,
    default: 'guest'
  }
})

/**
 * 包含性別問題的 13 題題目
 * 第一題為性別問題，有助於提高結果準確性
 */
const questions = [
  { text: 'Q1. 為了更精準分析你的防詐特質，請選擇最符合你的描述：', options: ['我是帥氣迷人的男生 🧑', '我是美麗可愛的女生 👩'] },
  { text: 'Q2. 你最常使用哪種社群平台或通訊方式？', options: ['TikTok/IG/Discord', 'LINE/FB Messenger', 'Facebook/Email', '電話/簡訊為主'] },
  { text: 'Q3. 收到「免費抽獎/遊戲點數」的訊息，你會？', options: ['馬上參加，超讚的！', '看一下再決定', '先查這是什麼活動', '直接刪除'] },
  { text: 'Q4. 有人說可以「在家兼職月入十萬」，你的反應？', options: ['想了解怎麼做', '覺得可能但要研究', '聽起來很可疑', '絕對是詐騙'] },
  { text: 'Q5. 收到親友「緊急借錢」的訊息，你會？', options: ['先匯款救急', '打電話確認身份', '問詳細情況', '找其他家人確認'] },
  { text: 'Q6. 接到「銀行/政府機關」來電要求操作ATM，你會？', options: ['照指示做', '掛斷後打官方電話', '請對方稍等我查證', '直接掛斷'] },
  { text: 'Q7. 朋友推薦「保證獲利的投資」，你的態度？', options: ['有錢就投', '小額試試看', '詳細研究風險', '投資都有風險，謹慎'] },
  { text: 'Q8. 收到「包裹異常需重新付款」的通知，你會？', options: ['照連結付款', '查物流官網', '聯絡寄件人', '確認沒訂貨就忽略'] },
  { text: 'Q9. 看到「名醫推薦神奇保健品」廣告，你會？', options: ['想買來試試', '上網查評價', '問醫生朋友', '不相信網路醫療廣告'] },
  { text: 'Q10. 你對「區塊鏈/虛擬幣/NFT」投資的看法？', options: ['趨勢，要跟上', '小心但可嘗試', '風險很高要研究', '太複雜，不碰'] },
  { text: 'Q11. 網站要求填寫個人資料時，你通常？', options: ['直接填寫', '看情況填寫', '只填必要欄位', '盡量不填個資'] },
  { text: 'Q12. 判斷詐騙訊息時，你主要依據什麼？', options: ['感覺對不對', '內容有沒有破綻', '查證來源真偽', '詢問專業人士'] },
  { text: 'Q13. 如果要你選：你希望成為哪類特務？（選填）', options: ['狐狸','烏龜','狗','貓'] } // 題13 為主觀選填（不強制）
]

/**
 * SCORING_MAP: 每題每選項對 10 種動物的分數與 meta（年齡票/性別票/awarenessDelta/ fraudRisk）
 * 這是我為你完整設計好的映射（簡潔版，數值可依需微調）
 *
 * animals key order:
 * [Fox,Turtle,Dog,Cat,Owl,Squirrel,Shark,Mouse,Octopus,Dove]
 */
const SCORING_MAP = {
  q1: [
    // 男生
    { animalScores:[0,0,0,0,0,0,0,0,0,0], ageVotes:{}, genderVotes:{male:10}, fraudRisk:{}, awarenessDelta:0 },
    // 女生
    { animalScores:[0,0,0,0,0,0,0,0,0,0], ageVotes:{}, genderVotes:{female:10}, fraudRisk:{}, awarenessDelta:0 }
  ],
  q2: [
    // TikTok/IG/Discord -> 年輕世代
    { animalScores:[2,0,0,1,0,0,1,1,1,0], ageVotes:{'A':3,'B':2}, genderVotes:{female:1,male:1}, fraudRisk:{'8_lottery':1,'3_ecommerce':1}, awarenessDelta:-2 },
    // LINE/FB Messenger -> 青年
    { animalScores:[1,0,1,0,1,0,0,0,0,0], ageVotes:{'B':2,'C':3}, genderVotes:{male:1,female:1}, fraudRisk:{'9_investment':1}, awarenessDelta:0 },
    // Facebook/Email -> 中年
    { animalScores:[0,1,1,0,1,0,0,0,0,1], ageVotes:{'D':3,'E':2}, genderVotes:{female:1,male:1}, fraudRisk:{'2_gov':1}, awarenessDelta:0 },
    // 電話/簡訊為主 -> 高齡
    { animalScores:[0,2,0,0,1,0,0,2,0,1], ageVotes:{'E':2,'F':3}, genderVotes:{female:1,male:1}, fraudRisk:{'7_family':2,'2_gov':1}, awarenessDelta:+1 }
  ],
  q3: [
    // 馬上參加 -> 學生/年輕人易受娛樂詐騙
    { animalScores:[3,0,0,1,0,0,1,1,1,0], ageVotes:{'A':3,'B':1}, genderVotes:{female:1,male:1}, fraudRisk:{'8_lottery':3,'3_ecommerce':1}, awarenessDelta:-3 },
    // 看一下再決定 -> 青年
    { animalScores:[1,0,0,0,1,0,0,1,1,0], ageVotes:{'B':2,'C':1}, genderVotes:{male:1,female:1}, fraudRisk:{'8_lottery':2}, awarenessDelta:-1 },
    // 先查活動 -> 中年
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'C':2,'D':1}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 直接刪除 -> 年長者
    { animalScores:[0,2,0,0,1,0,0,0,0,0], ageVotes:{'E':2,'F':2}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 }
  ],
  q4: [
    // 想了解兼職 -> 學生/初入社會
    { animalScores:[2,0,0,0,0,0,0,1,2,0], ageVotes:{'A':2,'B':3}, genderVotes:{female:1,male:1}, fraudRisk:{'9_investment':2,'5_offer':2}, awarenessDelta:-2 },
    // 可能但要研究 -> 青年
    { animalScores:[1,0,2,0,0,1,0,2,1,0], ageVotes:{'B':1,'C':3}, genderVotes:{female:1,male:1}, fraudRisk:{'9_investment':1}, awarenessDelta:-1 },
    // 聽起來可疑 -> 中年
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'C':1,'D':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 絕對詐騙 -> 年長者
    { animalScores:[0,2,0,0,1,0,0,0,0,1], ageVotes:{'E':2,'F':2}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+3 }
  ],
  q5: [
    // 先匯款救急 -> 情感導向，易受親情詐騙
    { animalScores:[0,0,3,0,0,0,0,2,0,0], ageVotes:{'B':1,'C':1,'F':2}, genderVotes:{female:1,male:1}, fraudRisk:{'7_family':3}, awarenessDelta:-3 },
    // 打電話確認 -> 成熟防詐
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'C':2,'D':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 問詳細情況 -> 謹慎
    { animalScores:[1,0,1,0,0,0,0,1,0,0], ageVotes:{'B':1,'C':2,'D':1}, genderVotes:{female:1,male:1}, fraudRisk:{'7_family':1}, awarenessDelta:0 },
    // 找家人確認 -> 年長者習慣
    { animalScores:[0,1,1,0,0,0,0,0,0,0], ageVotes:{'D':1,'E':2,'F':2}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 }
  ],
  q6: [
    // 照指示做 -> 易受官方詐騙
    { animalScores:[0,0,0,0,0,0,0,2,0,1], ageVotes:{'D':1,'E':2,'F':2}, genderVotes:{male:1,female:1}, fraudRisk:{'2_gov':3,'1_bank':2}, awarenessDelta:-3 },
    // 掛斷後打官方電話 -> 最佳防詐
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'C':3,'D':2}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+3 },
    // 請對方稍等查證 -> 謹慎
    { animalScores:[0,2,0,0,1,0,0,0,0,0], ageVotes:{'D':2,'E':1}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 },
    // 直接掛斷 -> 青年直覺防詐
    { animalScores:[1,0,1,0,0,1,0,1,0,0], ageVotes:{'B':2,'C':1}, genderVotes:{female:1,male:1}, fraudRisk:{}, awarenessDelta:+2 }
  ],
  q7: [
    // 有錢就投 -> 年輕人FOMO心理
    { animalScores:[2,0,0,0,0,0,2,0,1,0], ageVotes:{'A':1,'B':3,'C':1}, genderVotes:{male:1,female:1}, fraudRisk:{'9_investment':3}, awarenessDelta:-3 },
    // 小額試試 -> 青年謹慎嘗試
    { animalScores:[0,1,0,0,2,0,1,0,0,0], ageVotes:{'B':1,'C':3}, genderVotes:{male:1,female:1}, fraudRisk:{'9_investment':1}, awarenessDelta:+1 },
    // 詳細研究風險 -> 中年理性
    { animalScores:[0,1,0,0,2,1,0,0,0,0], ageVotes:{'C':2,'D':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 謹慎態度 -> 年長者保守
    { animalScores:[0,2,0,0,1,1,0,0,0,0], ageVotes:{'E':2,'F':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 }
  ],
  q8: [
    // 照連結付款 -> 易受電商詐騙
    { animalScores:[0,0,0,1,0,0,0,2,1,0], ageVotes:{'A':1,'B':2}, genderVotes:{female:1,male:1}, fraudRisk:{'3_ecommerce':3}, awarenessDelta:-3 },
    // 查物流官網 -> 理性驗證
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'C':3,'D':1}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 聯絡寄件人 -> 謹慎確認
    { animalScores:[0,1,0,0,1,0,0,0,0,0], ageVotes:{'D':2,'E':1}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 },
    // 確認後忽略 -> 年長者謹慎
    { animalScores:[0,2,0,0,1,0,0,0,0,1], ageVotes:{'E':2,'F':2}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 }
  ],
  q9: [
    // 想買試試 -> 年輕人容易受醫療廣告吸引
    { animalScores:[2,0,0,0,0,0,1,0,1,0], ageVotes:{'A':2,'B':1}, genderVotes:{female:1,male:1}, fraudRisk:{'5_offer':2}, awarenessDelta:-2 },
    // 上網查評價 -> 青年習慣
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'B':1,'C':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 },
    // 問醫生朋友 -> 中年理性
    { animalScores:[1,0,2,0,0,1,0,1,1,0], ageVotes:{'C':2,'D':2}, genderVotes:{female:1,male:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 不信網路醫療 -> 年長者謹慎
    { animalScores:[0,2,0,0,1,0,0,0,0,1], ageVotes:{'E':3,'F':2}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 }
  ],
  q10: [
    // 趨勢要跟上 -> 青年FOMO
    { animalScores:[2,0,1,0,0,0,0,1,1,0], ageVotes:{'B':3,'C':1}, genderVotes:{female:1,male:1}, fraudRisk:{'9_investment':2}, awarenessDelta:-1 },
    // 小心嘗試 -> 青年謹慎
    { animalScores:[1,1,1,0,1,0,0,0,0,0], ageVotes:{'C':3,'D':1}, genderVotes:{male:1,female:1}, fraudRisk:{'9_investment':1}, awarenessDelta:0 },
    // 風險高要研究 -> 中年理性
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'D':3,'E':1}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 },
    // 太複雜不碰 -> 年長者保守
    { animalScores:[0,2,0,0,1,0,0,0,0,1], ageVotes:{'E':2,'F':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 }
  ],
  q11: [
    // 直接填寫 -> 年輕人個資意識低
    { animalScores:[1,0,0,0,0,1,1,1,0,0], ageVotes:{'A':3,'B':2}, genderVotes:{female:1,male:1}, fraudRisk:{'3_ecommerce':1,'9_investment':1}, awarenessDelta:-2 },
    // 看情況填寫 -> 青年
    { animalScores:[0,1,0,0,1,1,0,0,0,0], ageVotes:{'B':1,'C':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:0 },
    // 只填必要欄位 -> 中年謹慎
    { animalScores:[0,2,0,0,2,0,0,0,0,0], ageVotes:{'C':1,'D':3,'E':1}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 },
    // 盡量不填個資 -> 年長者高度謹慎
    { animalScores:[0,2,0,0,1,0,0,0,0,1], ageVotes:{'E':2,'F':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 }
  ],
  q12: [
    // 感覺對不對 -> 直覺判斷，年輕人特徵
    { animalScores:[1,0,0,1,0,0,0,1,0,1], ageVotes:{'A':2,'B':2}, genderVotes:{female:1,male:1}, fraudRisk:{}, awarenessDelta:-1 },
    // 內容破綻 -> 青年邏輯思維
    { animalScores:[0,1,0,0,2,0,0,0,0,0], ageVotes:{'B':1,'C':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+1 },
    // 查證來源 -> 中年系統化防詐
    { animalScores:[0,1,0,0,3,0,0,0,0,0], ageVotes:{'C':2,'D':3}, genderVotes:{male:1,female:1}, fraudRisk:{}, awarenessDelta:+2 },
    // 詢問專業人士 -> 年長者求助習慣
    { animalScores:[1,0,2,0,0,1,0,1,1,0], ageVotes:{'D':1,'E':2,'F':2}, genderVotes:{female:1,male:1}, fraudRisk:{}, awarenessDelta:+1 }
  ],
  q13: [
    // 主觀希望成為哪類（非必填，作為交叉參考）
    { animalScores:[1,0,0,0,0,0,0,0,0,0], ageVotes:{}, genderVotes:{}, fraudRisk:{}, awarenessDelta:0 }, // 狐狸
    { animalScores:[0,1,0,0,0,0,0,0,0,0], ageVotes:{}, genderVotes:{}, fraudRisk:{}, awarenessDelta:0 }, // 烏龜
    { animalScores:[0,0,1,0,0,0,0,0,0,0], ageVotes:{}, genderVotes:{}, fraudRisk:{}, awarenessDelta:0 }, // 狗
    { animalScores:[0,0,0,1,0,0,0,0,0,0], ageVotes:{}, genderVotes:{}, fraudRisk:{}, awarenessDelta:0 }  // 貓
  ]
}

/* state */
const started = ref(false)
const currentIndex = ref(0)
const selected = ref(null)
const answers = reactive(Array(questions.length).fill(null))

function start(){ started.value = true }
function choose(idx){
  selected.value = idx
  answers[currentIndex.value] = idx
}
function prev(){
  if(currentIndex.value === 0) return
  currentIndex.value--
  selected.value = answers[currentIndex.value]
}
function nextIfSelected(){
  if(selected.value === null) return alert('請先選擇一個選項')
  currentIndex.value++
  selected.value = answers[currentIndex.value] ?? null
}
function finish(){
  if(answers.slice(0, questions.length-1).some(a => a === null)) {
    return alert('請完成所有題目（第13題為選填）')
  }
  // 計算結果
  const result = calculateResult(answers)
  console.log('Quiz完成，結果:', result) // 調試用
  
  // 保存測驗結果到 store
  try {
    soulAnimalStore.saveRecord(props.currentUser, result)
    console.log(`測驗結果已保存至用戶 ${props.currentUser}`)
  } catch (error) {
    console.error('保存測驗結果失敗:', error)
  }
  
  // emit 結果給父元件
  emit('resultReady', result)
}

/* compute preview of awareness */
const awarenessPreview = computed(()=>{
  // accumulate awarenessDelta for answered questions so far
  let base = 50
  for(let i=0;i<answers.length;i++){
    const a = answers[i]
    if(a === null) continue
    const key = `q${i+1}`
    const map = SCORING_MAP[key]
    if(map && map[a]){
      base += map[a].awarenessDelta || 0
    }
  }
  return base
})

/* ========== 核心計算函數 ========== */

function calculateResult(answersArray){
  // accumulators
  const animalKeys = ['Fox','Turtle','Dog','Cat','Owl','Squirrel','Shark','Mouse','Octopus','Dove']
  const animalTotals = Object.fromEntries(animalKeys.map(k=>[k,0]))
  const ageBuckets = {'A':0,'B':0,'C':0,'D':0,'E':0,'F':0} // A:12-18, B:19-25, C:26-35, D:36-50, E:51-65, F:66+
  const genderBuckets = {male:0,female:0,other:0}
  const fraudTypes = {
    '1_bank':0,'2_gov':0,'3_ecommerce':0,'4_loan':0,'5_offer':0,'6_social':0,'7_family':0,'8_lottery':0,'9_investment':0,'10_law':0
  }
  let awareness = 50

  answersArray.forEach((choice, idx)=>{
    const key = `q${idx+1}`
    const map = SCORING_MAP[key]
    if(!map) return
    const option = map[choice] || null
    if(!option) return
    // animalScores
    option.animalScores.forEach((v,i)=> {
      animalTotals[animalKeys[i]] += v
    })
    // ageVotes
    Object.entries(option.ageVotes || {}).forEach(([k,v]) => { if(ageBuckets[k] !== undefined) ageBuckets[k]+=v })
    // genderVotes
    Object.entries(option.genderVotes || {}).forEach(([k,v]) => { if(genderBuckets[k] !== undefined) genderBuckets[k]+=v })
    // fraudRisk
    Object.entries(option.fraudRisk || {}).forEach(([k,v]) => { if(fraudTypes[k] !== undefined) fraudTypes[k]+=v })
    // awareness
    awareness += (option.awarenessDelta || 0)
  })

  // normalize animal totals to determine top animal
  const animalsSorted = Object.entries(animalTotals).sort((a,b)=>b[1]-a[1])
  const top1 = animalsSorted[0] // [name,score]
  const top2 = animalsSorted[1]
  let finalAnimal = top1[0]
  let mixed = null
  if (top2 && top1[1] > 0) {
    const pct = (top2[1] / top1[1]) * 100
    if (pct >= 85) { // if second is close (>=85% of top1), mark mixed
      mixed = `${top1[0]}-${top2[0]}`
    }
  }

  // agePrediction - 移除不確定，始終給出預測
  const ageSorted = Object.entries(ageBuckets).sort((a,b)=>b[1]-a[1])
  const totalAgeVotes = Object.values(ageBuckets).reduce((a,b) => a+b, 0)
  
  // 年齡分層對應表
  const ageGroupMap = {
    'A': '12-18歲 (學生期)',
    'B': '19-25歲 (初入社會)', 
    'C': '26-35歲 (職場初中期)',
    'D': '36-50歲 (家庭期)',
    'E': '51-65歲 (穩定期)', 
    'F': '66歲以上 (退休族)'
  }
  
  let agePred = ageGroupMap['C'] // 預設為最常見的C層
  
  if (totalAgeVotes > 0) {
    const topScore = ageSorted[0][1]
    const confidence = (topScore / totalAgeVotes) * 100
    agePred = ageGroupMap[ageSorted[0][0]]
    
    // 低信心度時顯示信心度
    if (confidence < 40) {
      agePred += ` (${Math.round(confidence)}%信心度)`
    }
  }

  // genderPrediction
  const genderSorted = Object.entries(genderBuckets).sort((a,b)=>b[1]-a[1])
  const genderPred = genderSorted[0][1] === 0 ? '不確定' : genderSorted[0][0]

  // awareness label
  let awarenessLabel = '中等'
  if (awareness >= 65) awarenessLabel = '高'
  else if (awareness < 45) awarenessLabel = '低'

  // top 3 fraud risks
  const fraudSorted = Object.entries(fraudTypes).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0).slice(0,3)

  return {
    animalTotals,
    finalAnimal: mixed ? mixed : finalAnimal,
    topBreakdown: animalsSorted.slice(0,3),
    agePrediction: agePred,
    genderPrediction: genderPred,
    awareness: Math.round(awareness),
    awarenessLabel,
    topFraudRisks: fraudSorted
  }
}
</script>

<style scoped>
/* 微小 UI 調整 */
</style>