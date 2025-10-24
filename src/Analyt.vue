<template>
  <div class="analyt-root self-stretch w-full">
    <!-- 保留駭客電網背景 -->
    <div class="hacker-grid"></div>
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
  <!-- 保留一個隱藏的 container，避免其他 CSS/JS 依賴出現差異（僅供存在，不會影響版面） -->
  <div class="container mx-auto hidden" aria-hidden="true"></div>

  <!-- Header -->
  <header class="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur" style="position:relative;">
  <div class="w-full" style="padding:1px 1px;">
        <div class="max-w-screen-xl w-full px-4">
          <!-- Refactored header: three-column flex for better RWD -->
          <div class="analyt-header flex items-center justify-between">
            <div class="analyt-left flex items-center">
              <button
                @click="emit('close')"
                aria-label="返回"
                title="返回"
                class="analyt-back-btn icon-btn bg-transparent text-primary p-3 rounded-md"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <div class="analyt-center flex-1 flex items-center justify-center" aria-hidden="false">
              <img :src="logoM" alt="Logo" class="analyt-logo large" />
            </div>

            <div class="analyt-right flex items-center gap-4" style="
              padding-bottom: 2px;
              padding-top: 2px;
            ">
              <div class="flex items-center gap-1 px-3 py-1 border border-primary/40 rounded-full">
                <svg class="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-primary font-semibold">{{ userStats.totalExperience }}</span>
                <span class="text-xs text-muted-foreground">經驗值</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg class="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="text-sm">
                  <div class="font-medium">{{ props.currentUser }}</div>
                  <div class="text-xs text-muted-foreground">等級 {{ userLevel }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- dev-tuner removed -->

  <!-- Main Content -->
  <main class="relative z-10 w-full py-6 px-4 space-y-6">
      <!-- Navigation Tabs -->
  <div class="tabs-wrapper flex gap-2 p-1 card card-variant-3 rounded-lg border border-border/40 backdrop-blur">
            <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all btn btn-md',
            activeTab === tab.id ? 'btn-style-1' : 'btn-style-3'
          ]"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          <span class="font-medium">{{ tab.label }}</span>
        </button>
      </div>

      <!-- 佔位符 - 稍後添加各個頁面內容 -->
      <div class="text-center text-muted-foreground">
        -個人資料-
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-6 animate-fade-in">
        <!-- Stats Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="border border-primary/20 bg-gradient-to-br from-card to-primary/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">測驗次數</span>
              <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div class="text-2xl font-bold">{{ userStats.totalTests }}</div>
            <p class="text-xs text-muted-foreground">
              {{ userStats.totalTests > 0 ? `平均警覺性: ${userStats.averageAwareness}%` : '尚未開始測驗' }}
            </p>
          </div>

          <div class="border border-accent/20 bg-gradient-to-br from-card to-accent/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">平均警覺性</span>
              <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-2xl font-bold">{{ userStats.averageAwareness }}%</div>
            <p class="text-xs text-muted-foreground">
              {{ userStats.totalTests > 0 ? '基於測驗結果' : '尚無數據' }}
            </p>
          </div>

          <div class="border border-primary/20 bg-gradient-to-br from-card to-primary/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">全球排名</span>
              <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div class="text-2xl font-bold">{{ userStats.globalRank }}</div>
            <p class="text-xs text-muted-foreground">
              {{ userStats.totalTests > 0 ? '模擬排名' : '尚未排名' }}
            </p>
          </div>

          <div class="border border-accent/20 bg-gradient-to-br from-card to-accent/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">AI 信心度</span>
              <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="text-2xl font-bold">{{ userStats.aiConfidence }}%</div>
            <p class="text-xs text-muted-foreground">{{ userStats.totalTests > 0 ? '基於測驗經驗' : '初始狀態' }}</p>
          </div>
        </div>

        <!-- Fraud Type Analysis -->
        <div class="border border-primary/20 rounded-lg bg-card">
          <div class="p-6 border-b border-border/40">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <!-- compact shield icon tuned for small headings -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="gSmall" x1="0" x2="1">
                    <stop offset="0%" stop-color="#06B6D4" />
                    <stop offset="100%" stop-color="#7C3AED" />
                  </linearGradient>
                </defs>
                <path d="M12 2c-3 0-6 2-6 5v4c0 6 5 10 6 11 1-1 6-5 6-11V7c0-3-3-5-6-5z" fill="url(#gSmall)" />
                <path d="M9.5 11.5l1.8 1.8L14.5 9" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95" />
              </svg>
              詐騙類型答對比例
            </h3>
            <p class="text-sm text-muted-foreground mt-1">十種金融簡訊詐騙類型的辨識表現</p>
          </div>
          <div class="p-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div
                v-for="fraud in fraudTypeData"
                :key="fraud.type"
                class="fraud-card space-y-2 p-4 rounded-lg border border-border/40 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ fraud.type }}</span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded border',
                      fraud.accuracy >= 90
                        ? 'border-green-500/50 text-green-500'
                        : fraud.accuracy >= 80
                          ? 'border-yellow-500/50 text-yellow-500'
                          : 'border-red-500/50 text-red-500'
                    ]"
                  >
                    {{ fraud.accuracy }}%
                  </span>
                </div>
                <div class="w-full bg-secondary rounded-full h-2">
                  <div
                    class="bg-primary h-2 rounded-full transition-all"
                    :style="{ width: fraud.accuracy + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-muted-foreground">
                  <span>答對 {{ fraud.correct }} / {{ fraud.total }}</span>
                  <span>{{ fraud.total - fraud.correct }} 題待加強</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Missions Tab -->
      <div v-if="activeTab === 'missions'" class="space-y-6 animate-fade-in">
        <div class="border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6">
          <h3 class="text-xl font-bold flex items-center gap-2 mb-2">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            特務任務中心
          </h3>
          <p class="text-sm text-muted-foreground">完成任務提升你的反詐騙能力，獲取經驗值與特務稱號</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="mission in missionData"
            :key="mission.id"
            class="border border-primary/20 hover:border-primary/40 rounded-lg bg-card transition-all hover:shadow-lg hover:shadow-primary/10 group"
          >
            <div class="p-6 space-y-3">
              <div class="flex items-start justify-between">
                <div :class="['p-3 rounded-lg shadow-lg', getDifficultyGradient(mission.difficulty)]">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span :class="['px-2 py-1 text-xs font-semibold rounded text-white border-0 shadow-md', getDifficultyGradient(mission.difficulty)]">
                  {{ mission.difficulty }}
                </span>
              </div>
              <div>
                <h4 class="text-base font-bold leading-tight">{{ mission.type }}</h4>
                <p class="text-sm text-muted-foreground mt-1">辨識訓練任務</p>
              </div>
            </div>
            <div class="p-6 pt-0 space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">完成進度</span>
                  <span class="font-medium">{{ mission.completed }}/{{ mission.total }}</span>
                </div>
                <div class="w-full bg-secondary rounded-full h-2">
                  <div
                    class="bg-primary h-2 rounded-full transition-all"
                    :style="{ width: (mission.completed / mission.total * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-border/40">
                <div class="flex items-center gap-1 text-sm">
                  <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="font-semibold text-primary">+{{ mission.reward }}</span>
                  <span class="text-muted-foreground text-xs">經驗值</span>
                </div>
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded',
                    mission.status === '需加強' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground'
                  ]"
                >
                  {{ mission.status }}
                </span>
              </div>

              <button class="w-full px-4 py-2 btn btn-lg btn-style-4 rounded-md transition-all flex items-center justify-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard Tab -->
      <div v-if="activeTab === 'leaderboard'" class="space-y-6 animate-fade-in">
        <div class="border border-primary/20 rounded-lg bg-card">
          <div class="p-6 border-b border-border/40">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              全球排行榜
            </h3>
            <p class="text-sm text-muted-foreground mt-1">頂尖詐騙特務排名與稱號</p>
          </div>
          <div class="p-6 space-y-4">
            <!-- 如果有排行榜數據 -->
            <div v-if="leaderboardData.length > 0">
              <div
                v-for="player in leaderboardData"
                :key="player.rank"
                :class="[
                  'relative flex items-center gap-4 p-4 rounded-lg border transition-all',
                  player.rank <= 3
                    ? `border-primary/40 ${getRankGradient(player.rank)} shadow-lg ${getRankShadow(player.rank)}`
                    : 'border-border/40 bg-card/50 hover:bg-card'
                ]"
              >
                <div class="relative">
                  <div
                    :class="[
                      'flex items-center justify-center w-12 h-12 rounded-full font-bold',
                      getRankBadgeStyle(player.rank)
                    ]"
                  >
                    {{ player.rank }}
                  </div>
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span :class="['font-bold', player.rank <= 3 ? 'text-white' : 'text-foreground']">
                      {{ player.name }}
                    </span>
                    <span
                      v-if="player.rank <= 5"
                      :class="['px-2 py-1 text-xs font-semibold rounded text-white border-0 shadow-md flex items-center gap-1', getRankGradient(player.rank)]"
                    >
                      {{ getRankTitle(player.rank) }}
                    </span>
                  </div>
                  <div :class="['text-sm', player.rank <= 3 ? 'text-white/90' : 'text-muted-foreground']">
                    準確率: {{ player.accuracy }}% • 完成任務: {{ player.missions }}
                  </div>
                </div>

                <div class="text-right">
                  <div :class="['text-xl font-bold', player.rank <= 3 ? 'text-white' : 'text-primary']">
                    {{ player.score.toLocaleString() }}
                  </div>
                  <div :class="['text-xs', player.rank <= 3 ? 'text-white/80' : 'text-muted-foreground']">
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 如果沒有排行榜數據 -->
            <div v-else class="text-center py-12">
              <svg class="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 class="text-lg font-semibold mb-2">尚無排行榜記錄</h3>
              <p class="text-muted-foreground mb-4">開始遊戲來建立排行榜吧！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Soul Animals Tab -->
      <div v-if="activeTab === 'soulanimals'" class="space-y-6 animate-fade-in">
        <div class="border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6">
          <h3 class="text-xl font-bold flex items-center gap-2 mb-2">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            靈魂動物測驗記錄
          </h3>
          <p class="text-sm text-muted-foreground">查看你的防詐靈魂動物測驗歷史與詳細分析</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="record in soulAnimalHistory"
            :key="record.id"
            class="border border-primary/20 rounded-lg bg-card transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            <div class="p-6">
              <!-- 測驗基本資訊 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <svg class="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold">{{ record.animalResult.animalName }}</h4>
                    <p class="text-sm text-muted-foreground">{{ record.timestamp }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold text-primary">{{ record.animalResult.awareness }}</div>
                  <div class="text-xs text-muted-foreground">反詐意識</div>
                </div>
              </div>

              <!-- 動物特質與等級 -->
              <div class="grid gap-4 md:grid-cols-2 mb-4">
                <div class="p-4 rounded-lg bg-card/50 border border-border/40">
                  <div class="text-sm font-medium text-muted-foreground mb-1">動物特質</div>
                  <p class="text-sm">{{ record.animalResult.summary }}</p>
                </div>
                <div class="p-4 rounded-lg bg-card/50 border border-border/40">
                  <div class="text-sm font-medium text-muted-foreground mb-1">特務等級</div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-1 text-xs font-semibold rounded bg-primary/20 text-primary">
                      {{ record.animalResult.level }}
                    </span>
                    <span class="text-sm">{{ record.animalResult.awarenessLabel }}級警覺</span>
                  </div>
                </div>
              </div>

              <!-- 個人資料預測 -->
              <div class="grid gap-4 md:grid-cols-2 mb-4">
                <div class="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div class="text-sm font-medium text-muted-foreground mb-2">年齡預測</div>
                  <div class="text-lg font-semibold text-accent">{{ record.animalResult.agePrediction }}</div>
                </div>
                <div class="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div class="text-sm font-medium text-muted-foreground mb-2">性別預測</div>
                  <div class="text-lg font-semibold text-accent">{{ record.animalResult.genderPrediction === 'female' ? '女性' : '男性' }}</div>
                </div>
              </div>

              <!-- 高風險詐騙類型 -->
              <div v-if="record.animalResult.topFraudRisks.length > 0" class="mb-4">
                <div class="text-sm font-medium text-muted-foreground mb-2">高風險詐騙類型</div>
                <div class="flex gap-2 flex-wrap">
                  <span
                    v-for="([type, score], index) in record.animalResult.topFraudRisks"
                    :key="index"
                    class="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200"
                  >
                    {{ fraudLabelMap[type] }} ({{ score }})
                  </span>
                </div>
              </div>

              <!-- 詳細分析 -->
              <div class="pt-4 border-t border-border/40">
                <div class="text-sm font-medium mb-2">AI 深度分析</div>
                <p class="text-sm text-muted-foreground leading-relaxed">{{ record.animalResult.analysis }}</p>
              </div>
            </div>
          </div>

          <!-- 空狀態 -->
          <div v-if="soulAnimalHistory.length === 0" class="text-center py-12">
            <svg class="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 class="text-lg font-semibold mb-2">尚無測驗記錄</h3>
            <p class="text-muted-foreground mb-4">完成靈魂動物測驗後，結果將顯示在這裡</p>
            <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              開始測驗
            </button>
          </div>
        </div>
      </div>

      <!-- AI Analysis Tab -->
      <div v-if="activeTab === 'analysis'" class="space-y-6 animate-fade-in">
        <!-- AI Model Info -->
        <div class="border border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg">
          <div class="p-6 border-b border-border/40">
            <h3 class="text-xl font-bold flex items-center gap-2 mb-2">
              <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI 詐騙檢測模型
            </h3>
            <p class="text-sm text-muted-foreground">深度學習驅動的智能反詐騙系統</p>
          </div>
          <div class="p-6">
            <div class="grid gap-6 md:grid-cols-4">
              <div class="space-y-2 p-4 rounded-lg bg-card/50 border border-border/40">
                <div class="flex items-center gap-2 text-muted-foreground text-sm">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  模型版本
                </div>
                <div class="text-2xl font-bold text-primary">v3.2.1</div>
                <div class="text-xs text-muted-foreground">ScamGuard Neural Network</div>
              </div>
              <div class="space-y-2 p-4 rounded-lg bg-card/50 border border-border/40">
                <div class="flex items-center gap-2 text-muted-foreground text-sm">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  訓練數據
                </div>
                <div class="text-2xl font-bold text-accent">1.2M</div>
                <div class="text-xs text-muted-foreground">真實詐騙案例</div>
              </div>
              <div class="space-y-2 p-4 rounded-lg bg-card/50 border border-border/40">
                <div class="flex items-center gap-2 text-muted-foreground text-sm">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  檢測速度
                </div>
                <div class="text-2xl font-bold text-primary">0.3s</div>
                <div class="text-xs text-muted-foreground">平均響應時間</div>
              </div>
              <div class="space-y-2 p-4 rounded-lg bg-card/50 border border-border/40">
                <div class="flex items-center gap-2 text-muted-foreground text-sm">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  整體準確率
                </div>
                <div class="text-2xl font-bold text-accent">97.2%</div>
                <div class="text-xs text-muted-foreground">模型信心度</div>
              </div>
            </div>
          </div>
        </div>

        <!-- SMS History -->
        <div class="border border-accent/20 rounded-lg bg-card">
          <div class="p-6 border-b border-border/40">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              答題記錄與 AI 解析
            </h3>
            <p class="text-sm text-muted-foreground mt-1">查看你的答題歷史，AI 針對錯誤答案提供詳細分析</p>
          </div>
          <div class="p-6 space-y-4">
            <!-- 遊戲測驗回合分隔標頭 -->
            <div
              v-for="sms in smsHistory"
              :key="sms.id"
            >
              <!-- 測驗回合標頭 -->
              <div v-if="sms.isGameHeader" class="game-round-header mb-4">
                <div :class="[
                  'flex items-center justify-between p-4 rounded-lg border',
                  sms.isPerfectRound 
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                    : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30'
                ]">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                      sms.isPerfectRound 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-primary to-accent'
                    ]">
                      <svg v-if="sms.isPerfectRound" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-else>{{ sms.gameNumber }}</span>
                    </div>
                    <div>
                      <h4 :class="[
                        'font-bold text-lg',
                        sms.isPerfectRound ? 'text-green-600' : 'text-primary'
                      ]">
                        第 {{ sms.gameNumber }} 回測驗
                        <span v-if="sms.isPerfectRound" class="text-sm text-green-500">（完美通關！）</span>
                      </h4>
                      <p class="text-sm text-muted-foreground">{{ sms.timestamp }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="flex items-center gap-4">
                      <div class="text-center">
                        <div :class="[
                          'text-xl font-bold',
                          sms.isPerfectRound ? 'text-green-600' : 'text-accent'
                        ]">{{ sms.gameScore }}</div>
                        <div class="text-xs text-muted-foreground">分數</div>
                      </div>
                      <div class="text-center">
                        <div :class="[
                          'text-xl font-bold',
                          sms.isPerfectRound ? 'text-green-600' : 'text-red-500'
                        ]">{{ sms.wrongCount }}</div>
                        <div class="text-xs text-muted-foreground">錯題</div>
                      </div>
                      <div class="text-center">
                        <div class="text-xl font-bold">{{ sms.gameRound }}</div>
                        <div class="text-xs text-muted-foreground">總題數</div>
                      </div>
                      <div class="px-3 py-1 rounded-full text-xs font-semibold" :class="sms.mode === 'challenge' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                        {{ sms.mode === 'challenge' ? '極限挑戰' : '新手挑戰' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 錯題詳細內容 -->
              <div
                v-else-if="!sms.isPerfectRound"
                :class="[
                  'p-4 rounded-lg border transition-all ml-6 mb-3 relative',
                  sms.isCorrect
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                ]"
              >
                <!-- 題目編號指示線 -->
                <div class="absolute -left-6 top-6 w-4 h-0.5 bg-primary/50"></div>
                <div class="absolute -left-8 top-5 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <span class="text-xs font-bold text-primary">{{ sms.questionNumber }}</span>
                </div>

                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <svg
                      v-if="sms.isCorrect"
                      class="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="px-2 py-1 text-xs border border-primary/40 rounded">{{ sms.type }}</span>
                    <span class="px-2 py-1 text-xs bg-primary/10 text-primary rounded">題目 {{ sms.questionNumber }}</span>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ sms.timestamp }}</span>
                </div>

                <div class="mb-3 p-3 rounded bg-card/50 border border-border/40">
                  <div class="text-sm leading-relaxed">{{ sms.content }}</div>
                </div>

                <div class="flex items-center gap-4 mb-3 text-sm">
                  <div>
                    你的答案:
                    <span :class="sms.isCorrect ? 'text-green-500 font-medium' : 'text-red-500 font-medium'">
                      {{ sms.userAnswer }}
                    </span>
                  </div>
                  <div>
                    正確答案: <span class="text-primary font-medium">{{ sms.correctAnswer }}</span>
                  </div>
                </div>

                <div v-if="!sms.isCorrect" class="mt-4 p-4 rounded-lg bg-card border border-accent/20">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span class="font-semibold">AI 深度解析</span>
                    <span class="ml-auto px-2 py-1 text-xs border border-accent/40 text-accent rounded">
                      信心度 {{ sms.aiAnalysis.confidence }}%
                    </span>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <div class="text-sm font-medium mb-2 flex items-center gap-2">
                        <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        詐騙特徵識別
                      </div>
                      <ul class="space-y-1.5 ml-6">
                        <li
                          v-for="(flag, index) in sms.aiAnalysis.redFlags"
                          :key="index"
                          class="text-sm text-muted-foreground list-disc"
                        >
                          {{ flag }}
                        </li>
                      </ul>
                    </div>

                    <div class="pt-3 border-t border-border/40">
                      <div class="text-sm font-medium mb-2">專家建議</div>
                      <p class="text-sm text-muted-foreground leading-relaxed">
                        {{ sms.aiAnalysis.explanation }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 完美通關記錄 -->
              <div
                v-else-if="sms.isPerfectRound"
                class="p-4 rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5 ml-6 mb-3 relative"
              >
                <!-- 完美通關指示線 -->
                <div class="absolute -left-6 top-6 w-4 h-0.5 bg-green-500/50"></div>
                <div class="absolute -left-8 top-5 w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <svg class="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="px-2 py-1 text-xs border border-green-500/40 rounded text-green-600">完美通關</span>
                    <span class="px-2 py-1 text-xs bg-green-500/10 text-green-600 rounded">全部答對</span>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ sms.timestamp }}</span>
                </div>

                <div class="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span class="font-semibold text-green-600">AI 讚賞分析</span>
                    <span class="ml-auto px-2 py-1 text-xs border border-green-500/40 text-green-600 rounded">
                      信心度 {{ sms.aiAnalysis.confidence }}%
                    </span>
                  </div>

                  <div class="space-y-3">
                    <div class="pt-1">
                      <p class="text-sm text-green-700 leading-relaxed">
                        {{ sms.aiAnalysis.explanation }}
                      </p>
                    </div>
                    
                    <div v-if="sms.aiAnalysis.soulAnimalInsight" class="pt-3 border-t border-green-500/20">
                      <div class="text-sm font-medium mb-2 text-green-600">靈魂動物洞察</div>
                      <p class="text-sm text-green-700 leading-relaxed">
                        {{ sms.aiAnalysis.soulAnimalInsight.insight }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import logoM from './assets/svg/Logo_M.svg'
import soulAnimalStore from './soulAnimalStore.js'

// 宣告元件會發出的事件：close
const emit = defineEmits(['close'])

const activeTab = ref('overview')

// 接收用戶資訊 props
const props = defineProps({
  currentUser: {
    type: String,
    default: 'white' // 預設用戶
  }
})

// Logo sizing defaults (no tuner): tweak these variables to change default appearance
const logoBaseSize = ref(84) // px
const logoWidthVal = ref(0) // 0 => auto

// NOTE: default scale set in CSS variables below; change in stylesheet if you want different default

// no dev-tuner functions needed

const tabs = [
  { id: 'overview', label: '總覽'},
  { id: 'missions', label: '任務' },
  { id: 'leaderboard', label: '排行榜' },
  { id: 'soulanimals', label: '靈魂動物' },
  { id: 'analysis', label: 'AI 分析' }
]

// 靈魂動物測驗記錄 - 從store獲取
const soulAnimalHistory = ref([])

// 根據用戶記錄計算的統計數據
const userStats = computed(() => {
  const records = soulAnimalHistory.value
  const gameRecords = soulAnimalStore.getUserGameRecords ? 
    soulAnimalStore.getUserGameRecords(props.currentUser) : 
    soulAnimalStore.getUserGameErrors(props.currentUser) // 向後兼容
  
  if (!records || records.length === 0) {
    return {
      totalTests: gameRecords.length || 0, // 只計算詐騙遊戲測驗次數
      averageAwareness: 0,
      globalRank: 'N/A',
      aiConfidence: 0,
      totalExperience: 0,
      soulAnimalTests: 0,
      gameTests: gameRecords.length || 0
    }
  }

  const soulAnimalTests = records.length
  const gameTests = gameRecords.length
  const totalTests = gameTests // 測驗次數只計算詐騙遊戲次數，不包括靈魂性格測驗
  const totalAwareness = records.reduce((sum, record) => sum + (record.animalResult.awareness || 0), 0)
  const averageAwareness = soulAnimalTests > 0 ? Math.round(totalAwareness / soulAnimalTests) : 0
  const totalExperience = soulAnimalTests * 100 + gameTests * 50 // 靈魂動物測驗100經驗值，遊戲測驗50經驗值
  
  return {
    totalTests,
    averageAwareness,
    globalRank: totalTests > 0 ? `#${Math.max(1, 150 - totalTests * 5)}` : 'N/A',
    aiConfidence: Math.min(95, 50 + totalTests * 3), // 基於總測驗次數計算信心度
    totalExperience,
    soulAnimalTests,
    gameTests
  }
})

// 根據經驗值計算用戶等級
const userLevel = computed(() => {
  const experience = userStats.value.totalExperience
  if (experience === 0) return 1 // 初始等級為1
  return Math.floor(experience / 500) + 1 // 每500經驗值升一級
})

// 根據用戶記錄計算詐騙類型數據（基於實際遊戲錯題記錄）
const fraudTypeData = computed(() => {
  const gameRecords = soulAnimalStore.getUserGameRecords ? 
    soulAnimalStore.getUserGameRecords(props.currentUser) : 
    soulAnimalStore.getUserGameErrors(props.currentUser) // 向後兼容
  
  // 初始化真實訊息類型統計（統計用戶對真實訊息的識別準確率）
  const messageTypeStats = {
    '真實金融機構': { total: 0, correct: 0, wrong: 0 },
    '真實政府機構': { total: 0, correct: 0, wrong: 0 },
    '真實電商平台': { total: 0, correct: 0, wrong: 0 },
    '真實貸款服務': { total: 0, correct: 0, wrong: 0 },
    '真實獎勳或優惠': { total: 0, correct: 0, wrong: 0 },
    '真實交友或戀愛': { total: 0, correct: 0, wrong: 0 },
    '真實親友或家人': { total: 0, correct: 0, wrong: 0 },
    '真實中獎或抽獎': { total: 0, correct: 0, wrong: 0 },
    '真實投資機會': { total: 0, correct: 0, wrong: 0 },
    '真實法務機構': { total: 0, correct: 0, wrong: 0 }
  }
  
  if (!gameRecords || gameRecords.length === 0) {
    return Object.entries(messageTypeStats).map(([type, stats]) => ({
      type,
      accuracy: 100,
      total: 0,
      correct: 0,
      wrong: 0
    }))
  }
  
  // 統計每場遊戲的真實訊息識別情況
  gameRecords.forEach(gameRecord => {
    const gameRounds = gameRecord.round || 5 // 每場遊戲的題目數
    
    // 在「兩真一假」的遊戲中，每一輪都有2個真實訊息
    // 為了簡化統計，我們假設每種類型的真實訊息平均出現
    const messageTypes = Object.keys(messageTypeStats)
    
    // 計算這場遊戲中真實訊息的總數（每輪2個真實訊息）
    const totalRealMessages = gameRounds * 2
    
    // 為每種類型分配出現次數
    for (let i = 0; i < totalRealMessages; i++) {
      const typeIndex = i % messageTypes.length
      const messageType = messageTypes[typeIndex]
      messageTypeStats[messageType].total++
      
      // 預設答對（正確識別為真實訊息）
      messageTypeStats[messageType].correct++
    }
    
    // 統計實際錯誤：用戶誤判的真實訊息
    if (gameRecord.wrongAnswers && gameRecord.wrongAnswers.length > 0) {
      gameRecord.wrongAnswers.forEach(wrongItem => {
        const messageType = getMessageType(wrongItem.content)
        if (messageTypeStats[messageType]) {
          // 用戶誤判了這類真實訊息
          messageTypeStats[messageType].wrong++
          messageTypeStats[messageType].correct--
        }
      })
    }
  })
  
  // 轉換為顯示格式
  return Object.entries(messageTypeStats).map(([type, stats]) => {
    const total = stats.total
    const correct = Math.max(0, stats.correct) // 確保不為負數
    const wrong = stats.wrong
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100
    
    return {
      type,
      accuracy,
      total,
      correct,
      wrong
    }
  }).filter(item => item.total > 0) // 只顯示有統計數據的類型
})

// 任務數據（基於用戶統計）
const missionData = computed(() => {
  const stats = userStats.value
  if (stats.totalTests === 0) {
    return [
      { id: 1, type: '假冒金融機構', difficulty: '困難', reward: 250, completed: 0, total: 50, status: '尚未開始' },
      { id: 2, type: '假冒政府機構', difficulty: '困難', reward: 240, completed: 0, total: 45, status: '尚未開始' },
      { id: 3, type: '假冒電商平台', difficulty: '中等', reward: 200, completed: 0, total: 60, status: '尚未開始' },
      { id: 4, type: '假冒貸款服務', difficulty: '困難', reward: 260, completed: 0, total: 40, status: '尚未開始' },
      { id: 5, type: '假冒獎勳或優惠', difficulty: '中等', reward: 210, completed: 0, total: 55, status: '尚未開始' },
      { id: 6, type: '假冒交友或戀愛', difficulty: '極難', reward: 300, completed: 0, total: 35, status: '尚未開始' },
      { id: 7, type: '假冒親友或家人', difficulty: '困難', reward: 270, completed: 0, total: 42, status: '尚未開始' },
      { id: 8, type: '假冒中獎或抽獎', difficulty: '簡單', reward: 180, completed: 0, total: 58, status: '尚未開始' },
      { id: 9, type: '假冒投資機會', difficulty: '極難', reward: 320, completed: 0, total: 48, status: '尚未開始' },
      { id: 10, type: '假冒法務機構', difficulty: '困難', reward: 250, completed: 0, total: 52, status: '尚未開始' }
    ]
  }

  // 根據測驗次數計算任務進度
  const testMultiplier = stats.totalTests
  return [
    { id: 1, type: '假冒金融機構', difficulty: '困難', reward: 250, completed: testMultiplier * 9, total: 50, status: testMultiplier * 9 >= 50 ? '已完成' : '進行中' },
    { id: 2, type: '假冒政府機構', difficulty: '困難', reward: 240, completed: testMultiplier * 8, total: 45, status: testMultiplier * 8 >= 45 ? '已完成' : '進行中' },
    { id: 3, type: '假冒電商平台', difficulty: '中等', reward: 200, completed: testMultiplier * 11, total: 60, status: testMultiplier * 11 >= 60 ? '已完成' : '進行中' },
    { id: 4, type: '假冒貸款服務', difficulty: '困難', reward: 260, completed: testMultiplier * 7, total: 40, status: testMultiplier * 7 >= 40 ? '已完成' : '進行中' },
    { id: 5, type: '假冒獎勳或優惠', difficulty: '中等', reward: 210, completed: testMultiplier * 10, total: 55, status: testMultiplier * 10 >= 55 ? '已完成' : '進行中' },
    { id: 6, type: '假冒交友或戀愛', difficulty: '極難', reward: 300, completed: testMultiplier * 5, total: 35, status: testMultiplier * 5 >= 35 ? '已完成' : testMultiplier * 5 > 0 ? '進行中' : '尚未開始' },
    { id: 7, type: '假冒親友或家人', difficulty: '困難', reward: 270, completed: testMultiplier * 7, total: 42, status: testMultiplier * 7 >= 42 ? '已完成' : '進行中' },
    { id: 8, type: '假冒中獎或抽獎', difficulty: '簡單', reward: 180, completed: testMultiplier * 12, total: 58, status: testMultiplier * 12 >= 58 ? '已完成' : '進行中' },
    { id: 9, type: '假冒投資機會', difficulty: '極難', reward: 320, completed: testMultiplier * 6, total: 48, status: testMultiplier * 6 >= 48 ? '已完成' : testMultiplier * 6 > 0 ? '進行中' : '尚未開始' },
    { id: 10, type: '假冒法務機構', difficulty: '困難', reward: 250, completed: testMultiplier * 9, total: 52, status: testMultiplier * 9 >= 52 ? '已完成' : '進行中' }
  ]
})

const leaderboardData = computed(() => {
  // 從 soulAnimalStore 獲取實時排行榜數據
  const storeLeaderboard = soulAnimalStore.getLeaderboard()
  
  // 轉換為需要的格式並添加排名和額外資訊
  return storeLeaderboard.map((entry, index) => ({
    rank: index + 1,
    name: entry.name,
    score: entry.score,
    accuracy: Math.min(98, 85 + index * 2), // 模擬準確率，排名越高準確率越高
    missions: Math.floor(entry.score / 20) // 根據分數估算完成任務數
  }))
})

// 詐騙類型對照表
const fraudLabelMap = {
  '1_bank': '假冒金融機構',
  '2_gov': '假冒政府機構', 
  '3_ecommerce': '假冒電商平台',
  '4_loan': '假冒貸款服務',
  '5_offer': '假冒獎勳或優惠',
  '6_social': '假冒交友或戀愛',
  '7_family': '假冒親友或家人',
  '8_lottery': '假冒中獎或抽獎',
  '9_investment': '假冒投資機會',
  '10_law': '假冒法務機構'
}

// AI分析歷史（基於用戶的遊戲記錄和靈魂動物測驗結果）
const smsHistory = computed(() => {
  // 獲取用戶的所有遊戲記錄（不只是錯題記錄）
  let gameRecords = soulAnimalStore.getUserGameRecords ? 
    soulAnimalStore.getUserGameRecords(props.currentUser) : 
    soulAnimalStore.getUserGameErrors(props.currentUser) // 向後兼容
  const soulAnimalRecords = soulAnimalHistory.value
  
  if (!gameRecords || gameRecords.length === 0) {
    return []
  }

  // 按時間排序遊戲記錄（最早的在前面）
  gameRecords = [...gameRecords].sort((a, b) => {
    const timeA = new Date(a.timestamp.replace(/\//g, '-')).getTime()
    const timeB = new Date(b.timestamp.replace(/\//g, '-')).getTime()
    return timeA - timeB // 升序排列，最早的在前
  })

  // 將所有遊戲記錄轉換為 AI 分析格式
  const analysisHistory = []
  
  gameRecords.forEach((gameRecord, gameIndex) => {
    // 為每一回測驗創建分組標頭
    const gameHeader = {
      id: `game-header-${gameRecord.id}`,
      type: 'game-header',
      isGameHeader: true,
      gameNumber: gameIndex + 1, // 正確的回合編號：第1回、第2回、第3回...
      timestamp: gameRecord.timestamp,
      gameScore: gameRecord.score,
      gameRound: gameRecord.round,
      wrongCount: (gameRecord.wrongAnswers && gameRecord.wrongAnswers.length) || 0,
      mode: gameRecord.mode || 'normal',
      isPerfectRound: (!gameRecord.wrongAnswers || gameRecord.wrongAnswers.length === 0)
    }
    analysisHistory.push(gameHeader)
    
    // 如果有錯題，顯示錯題分析
    if (gameRecord.wrongAnswers && gameRecord.wrongAnswers.length > 0) {
      gameRecord.wrongAnswers.forEach((wrongItem, index) => {
        // 找到最近的靈魂動物測驗結果作為性格分析基礎
        const latestSoulTest = soulAnimalRecords.length > 0 ? soulAnimalRecords[soulAnimalRecords.length - 1] : null
        
        // 根據錯題類型和用戶的靈魂動物特質生成個性化建議
        const personalizedAnalysis = generatePersonalizedAnalysis(wrongItem, latestSoulTest, props.currentUser)
        
        analysisHistory.push({
          id: `${gameRecord.id}-${index}`,
          type: getMessageType(wrongItem.content),
          content: wrongItem.content,
          userAnswer: '詐騙', // 用戶選擇了錯誤答案（真實訊息），說明認為是詐騙
          correctAnswer: '真實',
          isCorrect: false,
          timestamp: gameRecord.timestamp,
          gameScore: gameRecord.score,
          gameRound: gameRecord.round,
          gameNumber: gameIndex + 1, // 正確的回合編號
          questionNumber: index + 1,
          aiAnalysis: {
            confidence: 95 + Math.random() * 4, // 95-99%的信心度
            redFlags: extractRedFlags(wrongItem.content),
            explanation: personalizedAnalysis,
            soulAnimalInsight: latestSoulTest ? getSoulAnimalInsight(latestSoulTest.animalResult, wrongItem) : null
          }
        })
      })
    } else {
      // 如果沒有錯題，創建一個完美通關的特殊條目
      analysisHistory.push({
        id: `${gameRecord.id}-perfect`,
        type: 'perfect-round',
        isPerfectRound: true,
        timestamp: gameRecord.timestamp,
        gameScore: gameRecord.score,
        gameRound: gameRecord.round,
        gameNumber: gameIndex + 1, // 正確的回合編號
        aiAnalysis: {
          confidence: 100,
          explanation: `🎉 完美表現！在第 ${gameIndex + 1} 回測驗中，您成功識別出所有詐騙訊息，展現了優秀的防詐意識和判斷能力。繼續保持這種警覺性！`,
          soulAnimalInsight: soulAnimalRecords.length > 0 ? {
            animalName: soulAnimalRecords[soulAnimalRecords.length - 1].animalResult.animalName,
            insight: `您的 ${soulAnimalRecords[soulAnimalRecords.length - 1].animalResult.animalName} 特質在這次測驗中發揮了關鍵作用，幫助您準確識別了所有風險。`
          } : null
        }
      })
    }
  })
  
  // 按時間倒序排列，最新的在前
  return analysisHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50) // 增加顯示數量到50
})

// 根據簡訊內容判斷真實訊息類型
const getMessageType = (content) => {
  if (content.includes('銀行') || content.includes('帳戶') || content.includes('ATM')) return '真實金融機構'
  if (content.includes('政府') || content.includes('法院') || content.includes('警察')) return '真實政府機構'
  if (content.includes('購物') || content.includes('訂單') || content.includes('退款')) return '真實電商平台'
  if (content.includes('貸款') || content.includes('借錢') || content.includes('利率')) return '真實貸款服務'
  if (content.includes('優惠') || content.includes('折扣') || content.includes('免費')) return '真實獎勳或優惠'
  if (content.includes('交友') || content.includes('約會') || content.includes('聊天')) return '真實交友或戀愛'
  if (content.includes('家人') || content.includes('朋友') || content.includes('急用')) return '真實親友或家人'
  if (content.includes('中獎') || content.includes('抽獎') || content.includes('獎品')) return '真實中獎或抽獎'
  if (content.includes('投資') || content.includes('股票') || content.includes('賺錢')) return '真實投資機會'
  if (content.includes('法務') || content.includes('違法') || content.includes('罰款')) return '真實法務機構'
  return '真實訊息'
}

// 提取真實訊息特徵
const extractRedFlags = (content) => {
  const flags = []
  if (content.includes('官方') || content.includes('正式') || content.includes('合法')) {
    flags.push('具有官方或正式機構特徵')
  }
  if (content.includes('聯絡電話') || content.includes('客服專線') || content.includes('官方網站')) {
    flags.push('提供正確的官方聯絡方式')
  }
  if (content.includes('個人資料保護') || content.includes('隱私政策') || content.includes('安全提醒')) {
    flags.push('包含隱私保護和安全提醒')
  }
  if (content.includes('詳情請洽') || content.includes('如有疑問') || content.includes('客服查詢')) {
    flags.push('提供適當的查詢管道')
  }
  if (content.includes('本訊息為系統發送') || content.includes('請勿回覆') || content.includes('自動發送')) {
    flags.push('明確標示為系統自動發送')
  }
  if (content.includes('感謝您的配合') || content.includes('祝您順心') || content.includes('謝謝')) {
    flags.push('使用適當的禮貌用語')
  }
  return flags.length > 0 ? flags : ['具有真實訊息的典型特徵']
}

// 基於靈魂動物特質的個性化分析
const generatePersonalizedAnalysis = (wrongItem, soulTest, username) => {
  if (!soulTest) {
    return `親愛的 ${username}，這是一則真實的訊息，但您誤判為詐騙。${wrongItem.explanation || '建議在判斷時要更仔細分析訊息特徵。'}`
  }

  const animalName = soulTest.animalResult.animalName || '特務'
  const awareness = soulTest.animalResult.awareness || 50
  
  let personalizedAdvice = `根據您的 ${animalName} 特質分析：\n\n`
  
  // 根據不同動物特質給出針對性建議
  switch (animalName) {
    case '狐狸 (Fox)':
      personalizedAdvice += `您的警覺性很高，但有時可能過度謹慎。這則真實訊息被您誤判為詐騙，可能是因為您對新機會保持高度警戒。建議：學會區分真實機會和詐騙陷阱的細微差別。`
      break
    case '烏龜 (Turtle)':
      personalizedAdvice += `您的謹慎個性讓您對所有訊息都保持懷疑，這是好的防詐態度。但這次誤判了真實訊息，建議：學會識別官方訊息的真實特徵，如正確的聯絡方式和網址。`
      break
    case '狗 (Dog)':
      personalizedAdvice += `您重視安全，但有時可能因為過度保護而錯失真實訊息。建議：學會從可信來源驗證訊息真實性，而不是一概拒絕。`
      break
    case '貓 (Cat)':
      personalizedAdvice += `您的直覺通常很準，但這次可能被某些表面特徵誤導。這則真實訊息有您認為可疑的元素，建議：深入分析訊息的完整脈絡。`
      break
    case '貓頭鷹 (Owl)':
      personalizedAdvice += `您善於分析，但可能在某些細節上過度解讀。這則真實訊息被誤判，建議：平衡理性分析和實際情況，避免過度懷疑。`
      break
    case '松鼠 (Squirrel)':
      personalizedAdvice += `您對金融安全的重視讓您對相關訊息高度警戒，但這次誤判了真實通知。建議：學會識別真實金融機構的正確聯絡方式。`
      break
    case '鯊魚 (Shark)':
      personalizedAdvice += `您的決斷力強，但有時快速判斷可能導致誤判。建議：在做決定前花一點時間驗證訊息來源的真實性。`
      break
    case '老鼠 (Mouse)':
      personalizedAdvice += `您的觀察力敏銳，但可能對某些表面特徵過度敏感。建議：結合多個判斷標準，而不只依賴單一可疑點。`
      break
    case '章魚 (Octopus)':
      personalizedAdvice += `您的多元思考有時會讓您想得過於複雜。這則真實訊息被過度分析而誤判，建議：有時簡單直接的判斷反而更準確。`
      break
    case '鴿子 (Dove)':
      personalizedAdvice += `您的謹慎是美德，但要學會在保護自己和接受真實訊息間找到平衡。建議：建立可靠的驗證管道來確認訊息真實性。`
      break
    default:
      personalizedAdvice += `這則真實訊息被誤判為詐騙，建議加強對真實訊息特徵的識別能力。`
  }
  
  // 根據防詐意識等級給出額外建議
  if (awareness < 50) {
    personalizedAdvice += `\n\n您目前的防詐意識為 ${awareness}，適度的懷疑是好的，但也要學會識別真實訊息。`
  } else if (awareness < 70) {
    personalizedAdvice += `\n\n您的防詐意識為 ${awareness}，已有良好的警覺性，現在需要提升判斷的精確度。`
  } else {
    personalizedAdvice += `\n\n您的防詐意識為 ${awareness}，屬於高警覺群體，但要避免因過度警戒而錯失真實訊息。`
  }
  
  return personalizedAdvice
}

// 靈魂動物特質洞察
const getSoulAnimalInsight = (animalResult, wrongItem) => {
  return {
    animalName: animalResult.animalName,
    awareness: animalResult.awareness,
    vulnerability: animalResult.topFraudRisks?.[0] ? fraudLabelMap[animalResult.topFraudRisks[0][0]] : '未知風險',
    strengthTip: `發揮您的 ${animalResult.animalName} 特質優勢，加強防詐判斷力`
  }
}

// 載入用戶的靈魂動物記錄
const loadSoulAnimalRecords = () => {
  soulAnimalHistory.value = soulAnimalStore.getUserRecords(props.currentUser)
  console.log(`載入 ${props.currentUser} 的記錄:`, soulAnimalHistory.value)
}

// 重新載入排行榜數據
const refreshLeaderboard = () => {
  // 由於 leaderboardData 是 computed，它會自動響應 soulAnimalStore 的變化
  // 這個函數可以用來強制觸發重新計算（如果需要的話）
  console.log('排行榜已刷新')
}

// 組件掛載時載入數據
onMounted(() => {
  soulAnimalStore.setCurrentUser(props.currentUser)
  loadSoulAnimalRecords()
})

// 監聽 currentUser 變化，重新載入數據
watch(() => props.currentUser, (newUser) => {
  if (newUser) {
    soulAnimalStore.setCurrentUser(newUser)
    loadSoulAnimalRecords()
    console.log(`Analyt.vue: 用戶切換至 ${newUser}，重新載入記錄`)
  }
}, { immediate: true })

// 輔助函數
const getDifficultyGradient = (difficulty) => {
  const gradients = {
    '極難': 'bg-gradient-to-br from-red-500 to-orange-500',
    '困難': 'bg-gradient-to-br from-purple-500 to-pink-500',
    '中等': 'bg-gradient-to-br from-blue-500 to-cyan-500',
    '簡單': 'bg-gradient-to-br from-green-500 to-emerald-500'
  }
  return gradients[difficulty] || gradients['中等']
}

const getRankGradient = (rank) => {
  const gradients = {
    1: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    2: 'bg-gradient-to-r from-purple-400 to-pink-500',
    3: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    4: 'bg-gradient-to-r from-green-400 to-emerald-500',
    5: 'bg-gradient-to-r from-indigo-400 to-blue-500'
  }
  return gradients[rank] || ''
}

const getRankShadow = (rank) => {
  const shadows = {
    1: 'shadow-yellow-500/50',
    2: 'shadow-purple-500/50',
    3: 'shadow-blue-500/50',
    4: 'shadow-green-500/50',
    5: 'shadow-indigo-500/50'
  }
  return shadows[rank] || ''
}

const getRankBadgeStyle = (rank) => {
  const styles = {
    1: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/50',
    2: 'bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg shadow-purple-500/50',
    3: 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/50',
    4: 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50',
    5: 'bg-gradient-to-br from-indigo-400 to-blue-500 text-white shadow-lg shadow-indigo-500/50'
  }
  return styles[rank] || 'bg-secondary text-secondary-foreground'
}

const getRankTitle = (rank) => {
  const titles = {
    1: '傳奇特務',
    2: '大師級特務',
    3: '精英特務',
    4: '專家特務',
    5: '資深特務'
  }
  return titles[rank] || ''
}
</script>

<!-- CSS樣式區 -->
<style scoped>
/* 調整任務卡片的背景顏色 */
.p-6[data-v-54abbe69] {
    padding: 1.5rem;
    background-color: #1c87971f;
}
/* 這是Header的空白間距調整：只在寬螢幕啟用固定高度 */
@media (min-width: 641px) {
  .h-14[data-v-54abbe69] {
    height: 5rem;
  }
}
/* 這是AI分析方框的背景顏色調整 */
/* .transition-all[data-v-54abbe69] {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    background-color: #8b32328f;
} */


.bg-grid-pattern {
  background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
  background-size: 20px 20px;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style scoped>
/* Tab interaction polishing for Analyt */
.analyt-root .btn[role="tab"] { transition: transform 160ms ease, box-shadow 160ms ease; }
.analyt-root button.btn { will-change: transform; }
.analyt-root .btn-style-1 { box-shadow: 0 8px 22px rgba(6,182,212,0.12); }
.analyt-root .btn-style-3 { color: rgba(6,182,212,0.9); }
.analyt-root button.btn:focus { outline: 2px solid rgba(6,182,212,0.12); }

/* Ensure button contents (icon + text) are perfectly centered */
.analyt-root .btn,
.analyt-root button.btn,
.analyt-root .analyt-back-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
}

.analyt-root .btn svg,
.analyt-root .analyt-back-btn svg,
.analyt-root svg[role="img"] {
  display: block; /* remove inline gap/baseline shifts */
}

.analyt-root .btn span {
  line-height: 1 !important;
}

/* Back button specific interactions */
.analyt-back-btn {
  transition: transform .14s ease, box-shadow .14s ease, background-color .14s ease;
  border: 1px solid transparent;
}
.analyt-back-btn:hover {
  transform: translateX(-2px) scale(1.02);
  box-shadow: 0 6px 18px rgba(6,182,212,0.12);
  background: linear-gradient(180deg, rgba(6,182,212,0.06), rgba(124,58,237,0.04));
}
.analyt-back-btn:active { transform: translateX(-1px) scale(0.995); }
.analyt-back-btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(6,182,212,0.12);
}

/* refined back button: pill shape, subtle lift + rotate for personality */
.analyt-back-btn {
  border-radius: 10px !important;
  padding: 0.45rem !important;
  background: transparent;
}
.analyt-back-btn:hover {
  transform: translateY(-2px) rotate(-4deg) scale(1.02);
  box-shadow: 0 10px 30px rgba(6,182,212,0.12);
  background: linear-gradient(180deg, rgba(6,182,212,0.06), rgba(124,58,237,0.03));
}
.analyt-back-btn:active { transform: translateY(0) rotate(-2deg) scale(0.995); }

/* logo sizing: keep it compact but crisp */
.analyt-logo {
  /*
    Logo sizing variables
    - If Logo_M.svg requires a specific intrinsic ratio, change these two variables below to scale while preserving aspect ratio.
    - Recommended workflow:
      1) Set --logo-base-size to the pixel height you want (e.g. 48px).
      2) If the SVG has a different intrinsic ratio, set --logo-width to match the correct width (e.g. 72px) or keep it 'auto' to preserve SVG's intrinsic width.
      3) You can also apply a transform scale for fine tuning: --logo-scale (default 1).
    NOTE: These variables are local to this component; adjust here to preview quickly.
  */
  --logo-base-size: 96px; /* recommended UI size */
  --logo-width: auto;     /* set to a pixel value if you want exact width (e.g. 72px) */
  --logo-scale: 1; /* use intrinsic SVG scale for crispness */

  height: var(--logo-base-size);
  width: var(--logo-width);
  max-width: 100%;
  object-fit: contain;
  display: block;
  transform: scale(var(--logo-scale));
}

/* Larger logo option (used in header) - keeps a semantic helper class but sizes from CSS variables above */
.analyt-logo.large {
  /* keep this semantic helper class; sizing controlled by variables and tuner */
  transform-origin: center;
}

  /* Header: three-column responsive layout (left / center / right) */
  .analyt-header { display: flex; align-items: center; gap: 12px; }
  .analyt-left { display: flex; align-items: center; }
  .analyt-center { display: flex; align-items: center; justify-content: center; }
  .analyt-right { display: flex; align-items: center; gap: 12px; }
  /* ensure logo is clickable and not blocking other interactions */
  .analyt-center .analyt-logo { pointer-events: auto; }

/* Back button variants: variant-a (subtle) and variant-b (prominent) */
.analyt-back-btn.variant-a {
  border-radius: 8px !important;
}
.analyt-back-btn.variant-b {
  background: linear-gradient(90deg, rgba(6,182,212,0.08), rgba(124,58,237,0.06));
  border: 1px solid rgba(6,182,212,0.14);
  color: white;
  box-shadow: 0 8px 20px rgba(6,182,212,0.09);
}
.analyt-back-btn.variant-b:hover {
  transform: translateY(-3px) rotate(-3deg) scale(1.03);
  box-shadow: 0 16px 40px rgba(6,182,212,0.12);
}

/* Tabs: make scrollable on small screens and keep buttons centered */
.tabs-wrapper {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.tabs-wrapper::-webkit-scrollbar { display: none; }
.tabs-wrapper .btn { min-width: 120px; }

/* Responsive header: stack items on narrow viewports */
@media (max-width: 640px) {
  /* Mobile header: stack vertically and center content */
  header .max-w-screen-xl { flex-direction: column; gap: 6px; align-items: stretch; }
  .analyt-header { flex-direction: column; align-items: center; gap: 6px; }
  .analyt-left, .analyt-right { width: 100%; display: flex; justify-content: space-between; padding: 0 8px; }
  /* Mobile: slightly smaller logo */
  .analyt-logo.large { --logo-base-size: 72px; }
  /* add a small top margin for tabs so they won't be overlapped by header on very small screens */
  .tabs-wrapper { margin-top: 8px; }
  .tabs-wrapper .btn { min-width: 96px; padding-left: 12px; padding-right: 12px; }
}

/* Analyt-only full-width overrides (不影響其它頁面) */
.analyt-root {
  width: 100% !important;
  max-width: none !important;
  padding: 0 !important;
}

.analyt-root main,
.analyt-root header {
  width: 100% !important;
  max-width: none !important;
}

/* 如果內部有 max-w-screen-xl wrapper 也一併解除 */
.analyt-root .max-w-screen-xl {
  max-width: none !important;
  width: 100% !important;
}

/* 隱藏的 container 保留存在，但不可見 */
.analyt-root .container.hidden { display: none !important; }

/* Dev tuner floating panel styles (temporary) */
.dev-tuner {
  position: fixed;
  right: 12px;
  bottom: 12px;
  width: 300px;
  background: rgba(16,18,23,0.95);
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  z-index: 9999;
  font-size: 13px;
}
.dev-tuner-row{ display:flex; align-items:center; gap:8px; margin-bottom:8px }
.dev-tuner-row label{ width:110px; font-size:12px; color: #cbd5e1 }
.dev-tuner-number{ width:64px }
.dev-tuner-actions{ justify-content: flex-end }
.dev-tuner button{ background:transparent; border:1px solid rgba(255,255,255,0.08); color:#fff; padding:6px 8px; border-radius:6px }

/* Specific styling for fraud cards to avoid broad .transition-all overrides */
.analyt-root .fraud-card {
  background-color: rgba(139,50,50,0.05); /* subtle red tint, similar to #8b32328f but lighter */
  border-color: rgba(139,50,50,0.1);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.analyt-root .fraud-card:hover {
  background-color: rgba(139,50,50,0.10);
  border-color: rgba(220,38,38,0.5); /* stronger red on hover */
}

/* Target specific Tailwind-like utility combination and add explicit background-color
   Note: classes with slash (like border-red-500/30) must be escaped in CSS selectors as \/ */
.analyt-root .p-4.rounded-lg.border.transition-all.border-red-500\/30.bg-red-500\/5 {
  background-color: #8b32328f;
}

/* 遊戲測驗回合分隔樣式 */
.game-round-header {
  position: relative;
  margin-bottom: 1rem;
}

.game-round-header::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -8px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent);
}

.game-round-header .w-10.h-10.rounded-full {
  box-shadow: 0 4px 12px rgba(6,182,212,0.3);
}

/* 錯題連接線樣式 */
.analyt-root .relative .absolute.-left-6 {
  background: linear-gradient(90deg, rgba(6,182,212,0.3), rgba(6,182,212,0.6));
}

.analyt-root .relative .absolute.-left-8 {
  background: rgba(6,182,212,0.1);
  border-color: rgba(6,182,212,0.5);
  transition: all 0.2s ease;
}

.analyt-root .relative:hover .absolute.-left-8 {
  background: rgba(6,182,212,0.2);
  border-color: rgba(6,182,212,0.8);
  transform: scale(1.1);
}

/* 測驗模式標籤動畫 */
.analyt-root .rounded-full.text-xs.font-semibold {
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.analyt-root .rounded-full.text-xs.font-semibold:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

</style>
