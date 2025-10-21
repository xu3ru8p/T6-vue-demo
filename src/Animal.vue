<!-- Animal.vue -->
<template>
    
  <div class="min-h-screen flex items-center justify-center p-6 relative bg-black">
    <!-- 駭客電網動畫層 -->
    <div class="hacker-grid"></div>

    <div class="w-full max-w-3xl bg-[rgba(0,0,0,0.6)] rounded-2xl border border-[rgba(255,255,255,0.04)] p-6 backdrop-blur-md text-slate-100 relative z-10">
      <div class="flex items-center mb-6">
        <h1 class="text-2xl font-bold">你的防詐靈魂動物</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <!-- 左：動物卡 -->
        <div class="col-span-1 flex flex-col items-center p-4 bg-[rgba(255,255,255,0.02)] rounded-xl">
          <div class="w-40 h-40 flex items-center justify-center mb-3">
            <!-- 簡易卡通 SVG 根據 animalKey 顯示不同圖（示範幾種） -->
            <div v-html="animalSVG" class="w-36 h-36"></div>
          </div>
          <div class="text-lg font-semibold mb-1">{{ animalNameLocal }}</div>
          <div class="text-sm text-slate-300 text-center max-w-xs">{{ animalShort }}</div>
          <div class="mt-3 text-xs text-slate-400">等級：{{ level }}</div>
        </div>

        <!-- 中：深度分析 -->
        <div class="col-span-2 p-4 bg-[rgba(255,255,255,0.02)] rounded-xl">
          <h3 class="font-semibold mb-2">詳細分析</h3>
          <p class="text-slate-300 mb-3">{{ animalLong }}</p>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-[rgba(255,255,255,0.02)] rounded-md">
              <div class="text-xs text-slate-400">反詐意識</div>
              <div class="font-medium">{{ awareness }} （{{ awarenessLabel }}）</div>
            </div>

            <div class="p-3 bg-[rgba(255,255,255,0.02)] rounded-md">
              <div class="text-xs text-slate-400">推估年齡層 / 性別</div>
              <div class="font-medium">{{ agePrediction }} / {{ genderPrediction }}</div>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-sm text-slate-300 mb-2">最易受騙的前三類型</div>
            <div class="flex gap-2 flex-wrap">
              <span v-for="(f, idx) in topFraudRisks" :key="idx" class="px-3 py-1 bg-red-600/10 text-red-400 rounded-full text-sm border border-red-600/10">
                {{ fraudLabelMap[f[0]] }} (score {{ f[1] }})
              </span>
              <span v-if="topFraudRisks.length===0" class="text-slate-400">- 無明顯高風險類型 -</span>
            </div>
          </div>

          <div class="mt-4 text-slate-300">
            <div class="font-semibold">防詐小建議</div>
            <ul class="list-disc ml-5 mt-2">
              <li v-for="(t, idx) in tips" :key="idx" class="text-sm">{{ t }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button @click="onBack" class="px-4 py-2 border rounded-md">準備遊戲挑戰</button>
      </div>
    </div>
  </div>
   
</template>

<script setup>
import { computed } from 'vue'

/**
 * props: resultObject
 * - finalAnimal: string (or 'Mix1-Mix2')
 * - topBreakdown: [ [animal,score],... ]
 * - animalTotals: {...}
 * - agePrediction, genderPrediction, awareness, awarenessLabel, topFraudRisks
 */
const props = defineProps({
  resultObject: { type: Object, required: true }
})
const emit = defineEmits(['backToWelcome','retry'])

// animals metadata（中文名、短文、長文、tips）
const ANIMALS = {
  Fox: {
    name:'狐狸 (Fox)',
    short:'聰明好奇、反應快，但容易被高報酬誘惑。',
    long:`你天生好奇且行動力強，擅長抓住機會與新事物。但這種嗅覺也會讓你在高回報誘因下掉以輕心。財務/投資型詐騙與假金融商品是你需要特別警惕的方向。`,
    tips:[
      '遇到投資邀請務必查證對方資本與牌照。',
      '大額轉帳前設定冷靜期（例如 24 小時）。',
      '對陌生連結先到官網或官方客服比對。'
    ]
  },
  Turtle:{
    name:'烏龜 (Turtle)',
    short:'穩重謹慎、慢而安全，但可能會被官方語氣迷惑。',
    long:`你的穩重是防詐大優勢：不衝動、喜歡查證。但詐騙者常用官方語氣或法務字眼迷惑你，建議遇到「行政/法務/銀行」字眼時，一律以官方電話或官方網站為準。`,
    tips:[
      '看到官方語氣時打官方客服電話確認。',
      '不要輕易在簡訊或連結輸入個資。',
      '遇到法律或行政字眼，可請朋友或律師協助判斷。'
    ]
  },
  Dog:{
    name:'狗 (Dog)',
    short:'情感導向、信任他人，擅長社群互動但易被親友式詐騙影響。',
    long:`你很在意人際關係，容易從情感面給予信任。詐騙者正是利用親友或情感做為切入點。遇到求助訊息，先用電話或共同朋友確認。`,
    tips:[
      '若有人急需金錢，先用電話或面對面確認。',
      '避免透過簡訊直接匯款或提供銀行資料。',
      '鼓勵親友使用多一步驗證（例如語音或視訊確認）。'
    ]
  },
  Cat:{
    name:'貓 (Cat)',
    short:'直覺敏銳、獨立，但熟悉語氣可能讓你漏判假客服/電商。',
    long:`你保有很強的直覺與自主性，不喜歡被強迫。但詐騙會用熟悉用語或品牌信箱來降低你的警覺。建議核對訂單號與官方平台。`,
    tips:[
      '有疑慮時，到原廠官網或APP比對訂單。',
      '保留交易紀錄與客服對話截圖以便查證。',
      '對於要求提供敏感資料的客服多一份懷疑。'
    ]
  },
  Owl:{
    name:'貓頭鷹 (Owl)',
    short:'分析型特務，習慣查證與冷靜思考，是防詐高手。',
    long:`你偏好以證據為基礎，不輕信未驗證資訊，通常會先查證發件來源。持續保持這個習慣，你會是朋友圈裡的防詐諮詢者。`,
    tips:[
      '繼續使用多重來源查證（官網、客服、新聞）',
      '對跨平台不一致的資訊提高警覺',
      '分享防詐知識給身邊人形成正循環'
    ]
  },
  Squirrel:{
    name:'松鼠 (Squirrel)',
    short:'資產保護意識高、習慣儲備與安全，但貸款/借款陷阱要小心。',
    long:`你注重儲備與日常安全，但對金融條款細節可能不熟，詐騙會打「緊急借款/貸款」的票。建議在貸款前詳細核對合約與年利率。`,
    tips:[
      '貸款前仔細審閱合約與總成本',
      '不要回覆要求提供身分證或銀行截圖的訊息',
      '利用官方貸款平台或銀行分行洽詢'
    ]
  },
  Shark:{
    name:'鯊魚 (Shark)',
    short:'機會導向、求利心強；高報酬投資風險是主要威脅。',
    long:`你果敢、追求機會，但這增加你接觸高風險／詐騙投資的次數。把「冷靜查證」當作投資流程的一部分會大幅降低風險。`,
    tips:[
      '設定投資前的三項查證（公司、牌照、交易紀錄）',
      '避免一次投入大額資金給陌生管道',
      '使用受監理平台交易或投資'
    ]
  },
  Mouse:{
    name:'老鼠 (Mouse)',
    short:'觀察保守、容易受群組訊息影響，群組連鎖詐騙要小心。',
    long:`你觀察力佳但在群組裡可能因為大量訊息而被影響。碰到群組中瘋傳的消息，先在外部查證再回覆或分享。`,
    tips:[
      '不要在群組中匆忙回覆或轉發可疑連結',
      '遇到「大家都在做」的說法先查證',
      '使用小範圍先試驗的方式驗證資訊真偽'
    ]
  },
  Octopus:{
    name:'章魚 (Octopus)',
    short:'跨平台高手、社群能力強，但也可能遇到社群混合詐騙。',
    long:`你擅長使用多種社群與平台，這是優勢但也讓你暴露於跨平台詐騙（例如假電商＋假客服）。建議為不同平台使用不同帳密並啟用雙重驗證。`,
    tips:[
      '不同平台使用不同帳號密碼並啟動 2FA',
      '對跨平台一致性錯誤（品牌logo小差異）提高警覺',
      '定期檢查帳戶安全與登入紀錄'
    ]
  },
  Dove:{
    name:'鴿子 (Dove)',
    short:'善良樂於助人、對公益敏感；假募款或情感勒索可能傷害你。',
    long:`你的善良是社會美德，但詐騙者常利用善意做誘餌。捐款或協助他人前，優先透過官方或熟悉的 NGO。`,
    tips:[
      '捐款請透過官方或信用良好的 NGO',
      '對急迫募款保持懷疑態度並查證組織背景',
      '保護自己的個資與轉帳紀錄'
    ]
  }
}

/* fraud map label */
const fraudLabelMap = {
  '1_bank':'假冒金融機構','2_gov':'假冒政府機構','3_ecommerce':'假冒電商平台','4_loan':'假冒貸款服務',
  '5_offer':'假冒獎勳或優惠','6_social':'假冒交友/戀愛','7_family':'假冒親友','8_lottery':'假中獎抽獎',
  '9_investment':'假金融商品/投資','10_law':'假公務/法務機構'
}

/* extract data */
const ro = props.resultObject
const animalKey = ro.finalAnimal.split('-')[0] // 如果混合型，取第一當作主要 key 的顯示
const animalMeta = ANIMALS[animalKey] || ANIMALS.Fox

const animalNameLocal = animalMeta.name
const animalShort = animalMeta.short
const animalLong = animalMeta.long
const tips = animalMeta.tips
const awareness = ro.awareness
const awarenessLabel = ro.awarenessLabel
const agePrediction = ro.agePrediction
const genderPrediction = ro.genderPrediction
const topFraudRisks = ro.topFraudRisks || []

/* 等級判定（根據主要動物分數占比給個小等級）*/
const totalTopScore = Object.values(ro.animalTotals).reduce((a,b)=>a+b,0) || 1
const primaryScore = ro.animalTotals[animalKey] || 0
let level = '特務•見習'
if (primaryScore / totalTopScore > 0.25) level = '特務•中階'
if (primaryScore / totalTopScore > 0.4) level = '特務•高階'

/* 簡單可愛 SVG（示範）*/
const SVG_BANK = {
  Fox: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="56" fill="#FFEDD5"/><g transform="translate(20,20)"><path d="M20 4c6 0 12 5 20 5s14-5 20-5c0 8-7 12-7 20s7 12 7 20c-8 0-14-5-20-5s-14 5-20 5c0-8 7-12 7-20S20 12 20 4z" fill="#FF9F43"/></g></svg>`,
  Turtle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="104" height="104" rx="20" fill="#E6FFFA"/><g fill="#2F855A"><circle cx="60" cy="60" r="30"/></g></svg>`,
  Dog: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#FFF7ED"/><g><circle cx="60" cy="60" r="34" fill="#F6AD55"/></g></svg>`,
  Cat: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#EDF2FF"/><g><circle cx="60" cy="60" r="34" fill="#9F7AEA"/></g></svg>`,
  Owl: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#FFF7ED"/><g><circle cx="60" cy="60" r="34" fill="#805AD5"/></g></svg>`,
  Squirrel:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#FFFBEB"/><g><circle cx="60" cy="60" r="34" fill="#D69E2E"/></g></svg>`,
  Shark:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#EDFDFD"/><g><circle cx="60" cy="60" r="34" fill="#2C7A7B"/></g></svg>`,
  Mouse:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#F7FAFC"/><g><circle cx="60" cy="60" r="34" fill="#A0AEC0"/></g></svg>`,
  Octopus:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#FFF5F7"/><g><circle cx="60" cy="60" r="34" fill="#DD6B20"/></g></svg>`,
  Dove:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" fill="#F0FFF4"/><g><circle cx="60" cy="60" r="34" fill="#48BB78"/></g></svg>`
}

const animalSVG = SVG_BANK[animalKey] || SVG_BANK.Fox

function onBack(){ emit('backToWelcome') }
function onRetry(){ emit('retry') }
</script>

<style scoped>
/* 使用全局的駭客電網動畫背景，定義在 global.css 中 */
</style>
