<template>
  <div class="min-h-screen w-screen transition-all duration-500 overflow-x-hidden flex" :class="currentThemeStyles.main">
    <!-- Sidebar -->
    <div class="w-64 h-screen border-r p-4 transition-all duration-500 z-30 flex-shrink-0 flex flex-col" :class="[currentThemeStyles.sidebar, currentThemeStyles.sidebarBorder]">
      <div class="mb-8">
        <h1 class="text-2xl font-bold transition-colors duration-300" :class="currentThemeStyles.text">反詐特務</h1>
        <p class="text-sm transition-colors duration-300" :class="currentThemeStyles.textSecondary">管理後台</p>
      </div>

      <nav class="space-y-2 flex-1">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="activeMenu = item.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
            activeMenu === item.id ? [currentThemeStyles.activeButton, currentThemeStyles.text] : [currentThemeStyles.textSecondary, currentThemeStyles.cardHover]
          ]"
        >
          <component :is="item.icon" :size="20" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <button
        @click="$emit('back')"
        class="mt-auto mx-4 mb-4 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 border border-red-400"
      >
        <!-- 背景動畫效果 -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        <!-- 按鈕內容 -->
        <div class="relative flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-semibold">登出</span>
        </div>
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 min-h-screen transition-all duration-500 overflow-y-auto" :class="currentThemeStyles.main">
      <!-- Dashboard -->
      <div v-if="activeMenu === 'dashboard'">
        <h2 :class="['text-3xl font-bold mb-6 transition-colors duration-300', currentThemeStyles.text]">數據分析</h2>
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          <div :class="['rounded-xl p-6 border transition-all duration-300', currentThemeStyles.card]">
            <div class="flex items-center justify-between mb-2">
              <span :class="['transition-colors duration-300', currentThemeStyles.textSecondary]">總用戶數</span>
              <Users :size="20" class="text-blue-500" />
            </div>
            <p :class="['text-3xl font-bold transition-colors duration-300', currentThemeStyles.text]">12,458</p>
            <p class="text-sm text-green-500 mt-2">↑ 12.5%</p>
          </div>
          <div :class="['rounded-xl p-6 border transition-all duration-300', currentThemeStyles.card]">
            <div class="flex items-center justify-between mb-2">
              <span :class="['transition-colors duration-300', currentThemeStyles.textSecondary]">檢測次數</span>
              <Activity :size="20" class="text-purple-500" />
            </div>
            <p :class="['text-3xl font-bold transition-colors duration-300', currentThemeStyles.text]">45,892</p>
            <p class="text-sm text-green-500 mt-2">↑ 8.3%</p>
          </div>
          <div :class="['rounded-xl p-6 border transition-all duration-300', currentThemeStyles.card]">
            <div class="flex items-center justify-between mb-2">
              <span :class="['transition-colors duration-300', currentThemeStyles.textSecondary]">攔截詐騙</span>
              <Shield :size="20" class="text-green-500" />
            </div>
            <p :class="['text-3xl font-bold transition-colors duration-300', currentThemeStyles.text]">3,247</p>
            <p class="text-sm text-green-500 mt-2">↑ 15.7%</p>
          </div>
          <div :class="['rounded-xl p-6 border transition-all duration-300', currentThemeStyles.card]">
            <div class="flex items-center justify-between mb-2">
              <span :class="['transition-colors duration-300', currentThemeStyles.textSecondary]">準確率</span>
              <TrendingUp :size="20" class="text-yellow-500" />
            </div>
            <p :class="['text-3xl font-bold transition-colors duration-300', currentThemeStyles.text]">94.2%</p>
            <p class="text-sm text-green-500 mt-2">↑ 2.1%</p>
          </div>
        </div>
      </div>

      <!-- SMS Database -->
      <div v-if="activeMenu === 'sms'">
        <h2 :class="['text-3xl font-bold mb-6 transition-colors duration-300', currentThemeStyles.text]">簡訊資料庫管理</h2>
        <div :class="['rounded-xl p-6 border transition-all duration-300', currentThemeStyles.card]">
          <div class="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="搜尋簡訊..."
              :class="['px-4 py-2 rounded-lg w-96 transition-all duration-300', currentThemeStyles.input]"
            />
            <button :class="['px-4 py-2 rounded-lg transition-all duration-300', currentThemeStyles.activeButton, currentThemeStyles.text]">
              新增簡訊
            </button>
          </div>
          <div class="space-y-2">
            <div v-for="i in 5" :key="i" :class="['p-4 rounded-lg flex justify-between items-center transition-all duration-300', currentThemeStyles.card]">
              <div>
                <p :class="['font-semibold transition-colors duration-300', currentThemeStyles.text]">簡訊 #{{ i }}</p>
                <p :class="['text-sm transition-colors duration-300', currentThemeStyles.textSecondary]">詐騙機率: {{ Math.floor(Math.random() * 100) }}%</p>
              </div>
              <div class="flex gap-2">
                <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">編輯</button>
                <button class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">刪除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Settings -->
      <div v-if="activeMenu === 'api'">
        <h2 :class="['text-3xl font-bold mb-6 transition-colors duration-300', currentThemeStyles.text]">API 與模型設置</h2>
        <div class="space-y-6">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-white mb-4">API 金鑰管理</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">OpenAI API Key</label>
                <input type="password" value="sk-..." class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Binance API Key</label>
                <input type="password" value="..." class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" />
              </div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-white mb-4">模型設置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">語音識別模型</label>
                <select class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white">
                  <option>Whisper Large V3</option>
                  <option>Whisper Medium</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">詐騙檢測模型</label>
                <select class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white">
                  <option>GPT-4</option>
                  <option>GPT-3.5 Turbo</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Management -->
      <div v-if="activeMenu === 'code'">
        <h2 class="text-3xl font-bold text-white mb-6">程式碼管理</h2>
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center gap-4 mb-4">
            <Code :size="24" class="text-blue-500" />
            <div>
              <h3 class="text-xl font-semibold text-white">VS Code 整合</h3>
              <p class="text-sm text-gray-400">管理和編輯網站程式碼</p>
            </div>
          </div>
          <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
            <p>$ git status</p>
            <p>On branch main</p>
            <p>Your branch is up to date with 'origin/main'.</p>
            <p className="mt-2">$ npm run dev</p>
            <p>Server running on http://localhost:3000</p>
          </div>
          <div class="mt-4 flex gap-2">
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">開啟編輯器</button>
            <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">查看日誌</button>
          </div>
        </div>
      </div>

      <!-- Traffic Monitoring -->
      <div v-if="activeMenu === 'traffic'">
        <h2 class="text-3xl font-bold text-white mb-6">網頁瀏覽量監測</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-white mb-4">即時訪客</h3>
            <p class="text-5xl font-bold text-green-500 mb-2">247</p>
            <p class="text-sm text-gray-400">當前線上用戶</p>
          </div>
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-white mb-4">今日瀏覽量</h3>
            <p class="text-5xl font-bold text-blue-500 mb-2">8,542</p>
            <p class="text-sm text-gray-400">頁面瀏覽次數</p>
          </div>
        </div>
      </div>

      <!-- Game Management -->
      <div v-if="activeMenu === 'game'">
        <h2 class="text-3xl font-bold text-white mb-6">遊戲管理設置</h2>
        <div class="space-y-6">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-white mb-4">遊戲設定</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-300">啟用遊戲模式</span>
                <button class="w-12 h-6 bg-green-600 rounded-full relative">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">顯示排行榜</span>
                <button class="w-12 h-6 bg-green-600 rounded-full relative">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">每日挑戰題數</label>
                <input type="number" value="10" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interface Settings -->
      <div v-if="activeMenu === 'settings'" class="max-w-full">
        <h2 :class="['text-3xl font-bold mb-6 transition-colors duration-300', currentThemeStyles.text]">介面風格調整</h2>
        <div class="space-y-6">
          <!-- 主題設定卡片 -->
          <div :class="['rounded-xl p-6 border w-full transition-all duration-300', currentThemeStyles.card]">
            <h3 :class="['text-xl font-semibold mb-6 flex items-center gap-2 transition-colors duration-300', currentThemeStyles.text]">
              <Settings :size="24" class="text-cyan-400" />
              主題設定
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <!-- 深色模式 -->
              <div 
                @click="setTheme('dark')"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer hover:scale-105 transition-all duration-200',
                  currentTheme === 'dark' ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-700 hover:border-gray-500',
                  currentThemeStyles.card
                ]"
              >
                <div class="w-full h-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded mb-3 shadow-lg"></div>
                <p :class="[currentThemeStyles.text, 'text-center font-medium']">深色模式</p>
                <p :class="[currentThemeStyles.textSecondary, 'text-xs text-center mt-1']">經典優雅黑色主題</p>
              </div>

              <!-- 淺色模式 -->
              <div 
                @click="setTheme('light')"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer hover:scale-105 transition-all duration-200',
                  currentTheme === 'light' ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-700 hover:border-gray-500',
                  currentThemeStyles.card
                ]"
              >
                <div class="w-full h-20 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded mb-3 shadow-lg border border-gray-200"></div>
                <p :class="[currentThemeStyles.text, 'text-center font-medium']">淺色模式</p>
                <p :class="[currentThemeStyles.textSecondary, 'text-xs text-center mt-1']">清爽明亮白色主題</p>
              </div>

              <!-- 藍紫模式 -->
              <div 
                @click="setTheme('purple')"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer hover:scale-105 transition-all duration-200',
                  currentTheme === 'purple' ? 'border-purple-500 ring-2 ring-purple-300' : 'border-gray-700 hover:border-gray-500',
                  currentThemeStyles.card
                ]"
              >
                <div class="w-full h-20 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 rounded mb-3 shadow-lg"></div>
                <p :class="[currentThemeStyles.text, 'text-center font-medium']">藍紫模式</p>
                <p :class="[currentThemeStyles.textSecondary, 'text-xs text-center mt-1']">神祕科技感主題</p>
              </div>

              <!-- 翠綠模式 -->
              <div 
                @click="setTheme('emerald')"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer hover:scale-105 transition-all duration-200',
                  currentTheme === 'emerald' ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-gray-700 hover:border-gray-500',
                  currentThemeStyles.card
                ]"
              >
                <div class="w-full h-20 bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 rounded mb-3 shadow-lg"></div>
                <p :class="[currentThemeStyles.text, 'text-center font-medium']">翠綠模式</p>
                <p :class="[currentThemeStyles.textSecondary, 'text-xs text-center mt-1']">自然清新生態主題</p>
              </div>
            </div>
          </div>

          <!-- 顏色設定卡片 -->
          <div :class="['rounded-xl p-6 border w-full transition-all duration-300', currentThemeStyles.card]">
            <h3 :class="['text-xl font-semibold mb-6 flex items-center gap-2 transition-colors duration-300', currentThemeStyles.text]">
              <div class="w-6 h-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-full"></div>
              顏色配置調整
            </h3>
            
            <!-- 主要顏色區塊 -->
            <div class="mb-8">
              <h4 :class="['text-lg font-medium mb-4 transition-colors duration-300', currentThemeStyles.text]">主要配色方案</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div class="flex flex-col items-center space-y-2">
                  <label :class="['text-sm transition-colors duration-300', currentThemeStyles.textSecondary]">主要顏色</label>
                  <input type="color" value="#10b981" class="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-gray-400 transition-colors" />
                  <span :class="['text-xs transition-colors duration-300', currentThemeStyles.textSecondary]">#10b981</span>
                </div>
                <div class="flex flex-col items-center space-y-2">
                  <label :class="['text-sm transition-colors duration-300', currentThemeStyles.textSecondary]">次要顏色</label>
                  <input type="color" value="#3b82f6" class="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-gray-400 transition-colors" />
                  <span :class="['text-xs transition-colors duration-300', currentThemeStyles.textSecondary]">#3b82f6</span>
                </div>
                <div class="flex flex-col items-center space-y-2">
                  <label class="text-sm text-gray-400">警告顏色</label>
                  <input type="color" value="#f59e0b" class="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-gray-400 transition-colors" />
                  <span class="text-xs text-gray-500">#f59e0b</span>
                </div>
                <div class="flex flex-col items-center space-y-2">
                  <label class="text-sm text-gray-400">危險顏色</label>
                  <input type="color" value="#ef4444" class="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-gray-400 transition-colors" />
                  <span class="text-xs text-gray-500">#ef4444</span>
                </div>
                <div class="flex flex-col items-center space-y-2">
                  <label class="text-sm text-gray-400">成功顏色</label>
                  <input type="color" value="#22c55e" class="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-gray-400 transition-colors" />
                  <span class="text-xs text-gray-500">#22c55e</span>
                </div>
                <div class="flex flex-col items-center space-y-2">
                  <label class="text-sm text-gray-400">資訊顏色</label>
                  <input type="color" value="#06b6d4" class="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-gray-400 transition-colors" />
                  <span class="text-xs text-gray-500">#06b6d4</span>
                </div>
              </div>
            </div>

            <!-- 快速配色方案 -->
            <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-200 mb-4">快速配色方案</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <span class="text-white font-medium">經典藍色</span>
                  </div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-blue-400 rounded-sm"></div>
                    <div class="w-4 h-4 bg-blue-600 rounded-sm"></div>
                    <div class="w-4 h-4 bg-blue-700 rounded-sm"></div>
                  </div>
                </div>
                
                <div class="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-500 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-6 h-6 bg-green-500 rounded-full"></div>
                    <span class="text-white font-medium">自然綠色</span>
                  </div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-4 bg-green-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-green-400 rounded-sm"></div>
                    <div class="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-teal-500 rounded-sm"></div>
                  </div>
                </div>

                <div class="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-6 h-6 bg-purple-500 rounded-full"></div>
                    <span class="text-white font-medium">神祕紫色</span>
                  </div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-4 bg-purple-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-purple-400 rounded-sm"></div>
                    <div class="w-4 h-4 bg-indigo-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-violet-500 rounded-sm"></div>
                  </div>
                </div>

                <div class="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-red-500 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-6 h-6 bg-red-500 rounded-full"></div>
                    <span class="text-white font-medium">熱情紅色</span>
                  </div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-4 bg-red-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-red-400 rounded-sm"></div>
                    <div class="w-4 h-4 bg-rose-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-pink-500 rounded-sm"></div>
                  </div>
                </div>

                <div class="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-orange-500 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-6 h-6 bg-orange-500 rounded-full"></div>
                    <span class="text-white font-medium">活力橙色</span>
                  </div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-4 bg-orange-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-orange-400 rounded-sm"></div>
                    <div class="w-4 h-4 bg-amber-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                  </div>
                </div>

                <div class="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-6 h-6 bg-cyan-500 rounded-full"></div>
                    <span class="text-white font-medium">清新青色</span>
                  </div>
                  <div class="flex space-x-1">
                    <div class="w-4 h-4 bg-cyan-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-cyan-400 rounded-sm"></div>
                    <div class="w-4 h-4 bg-sky-500 rounded-sm"></div>
                    <div class="w-4 h-4 bg-blue-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 應用按鈕 -->
            <div class="flex justify-end space-x-3">
              <button class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                重置預設
              </button>
              <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105">
                套用設定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LayoutDashboard, MessageSquare, Settings, Users, Code, BarChart3, Gamepad2, Activity, Shield, TrendingUp } from 'lucide-vue-next'

// 定義 emit 事件
const emit = defineEmits(['back'])

const activeMenu = ref('dashboard')
const currentTheme = ref('dark') // 當前主題

// 主題配色方案
const themes = {
  dark: {
    name: '深色模式',
    sidebar: 'bg-gray-800',
    sidebarBorder: 'border-gray-700',
    main: 'bg-gray-900',
    card: 'bg-gray-800 border-gray-700',
    cardHover: 'hover:bg-gray-700',
    activeButton: 'bg-gradient-to-r from-green-600 to-emerald-600',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    input: 'bg-gray-900 border-gray-700 text-white',
    gradient: 'from-gray-900 to-black'
  },
  light: {
    name: '淺色模式',
    sidebar: 'bg-white',
    sidebarBorder: 'border-gray-200',
    main: 'bg-gray-50',
    card: 'bg-white border-gray-200',
    cardHover: 'hover:bg-gray-100',
    activeButton: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    input: 'bg-white border-gray-300 text-gray-900',
    gradient: 'from-white to-gray-100'
  },
  purple: {
    name: '藍紫模式',
    sidebar: 'bg-gradient-to-b from-indigo-900 to-purple-900',
    sidebarBorder: 'border-purple-700',
    main: 'bg-gradient-to-br from-indigo-950 to-purple-950',
    card: 'bg-gradient-to-br from-indigo-800/40 to-purple-800/40 border-purple-600/50',
    cardHover: 'hover:from-indigo-700/60 hover:to-purple-700/60',
    activeButton: 'bg-gradient-to-r from-purple-500 to-pink-600',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    input: 'bg-indigo-900/50 border-purple-600 text-white',
    gradient: 'from-indigo-900 to-purple-900'
  },
  emerald: {
    name: '翠綠模式',
    sidebar: 'bg-gradient-to-b from-emerald-900 to-teal-900',
    sidebarBorder: 'border-teal-700',
    main: 'bg-gradient-to-br from-emerald-950 to-teal-950',
    card: 'bg-gradient-to-br from-emerald-800/40 to-teal-800/40 border-teal-600/50',
    cardHover: 'hover:from-emerald-700/60 hover:to-teal-700/60',
    activeButton: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    text: 'text-white',
    textSecondary: 'text-emerald-200',
    input: 'bg-emerald-900/50 border-teal-600 text-white',
    gradient: 'from-emerald-800 to-teal-900'
  }
}

// 計算當前主題樣式
const currentThemeStyles = computed(() => themes[currentTheme.value])

// 切換主題函數
const setTheme = (themeName) => {
  currentTheme.value = themeName
}

const menuItems = [
  { id: 'dashboard', label: '數據分析', icon: LayoutDashboard },
  { id: 'sms', label: '簡訊資料庫', icon: MessageSquare },
  { id: 'api', label: 'API 設置', icon: Settings },
  { id: 'code', label: '程式碼管理', icon: Code },
  { id: 'traffic', label: '流量監測', icon: BarChart3 },
  { id: 'game', label: '遊戲管理', icon: Gamepad2 },
  { id: 'settings', label: '介面設定', icon: Settings },
]
</script>
