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
                <span class="text-primary font-semibold">2,450</span>
                <span class="text-xs text-muted-foreground">經驗值</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg class="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="text-sm">
                  <div class="font-medium">CyberAgent</div>
                  <div class="text-xs text-muted-foreground">等級 15</div>
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
              <span class="text-sm font-medium">總任務數</span>
              <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div class="text-2xl font-bold">485</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-primary">+52</span> 本週完成
            </p>
          </div>

          <div class="border border-accent/20 bg-gradient-to-br from-card to-accent/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">平均準確率</span>
              <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-2xl font-bold">87%</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-accent">+5%</span> 較上週
            </p>
          </div>

          <div class="border border-primary/20 bg-gradient-to-br from-card to-primary/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">全球排名</span>
              <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div class="text-2xl font-bold">#127</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-primary">↑23</span> 名次提升
            </p>
          </div>

          <div class="border border-accent/20 bg-gradient-to-br from-card to-accent/5 rounded-lg p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">AI 信心度</span>
              <svg class="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="text-2xl font-bold">92.5%</div>
            <p class="text-xs text-muted-foreground">模型準確度評分</p>
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
            <div
              v-for="sms in smsHistory"
              :key="sms.id"
              :class="[
                'p-4 rounded-lg border transition-all',
                sms.isCorrect
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
              ]"
            >
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
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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

const fraudTypeData = [
  { type: '假冒金融機構', accuracy: 92, total: 50, correct: 46 },
  { type: '假冒政府機構', accuracy: 88, total: 45, correct: 40 },
  { type: '假冒電商平台', accuracy: 95, total: 60, correct: 57 },
  { type: '假冒貸款服務', accuracy: 85, total: 40, correct: 34 },
  { type: '假冒獎勳或優惠', accuracy: 90, total: 55, correct: 50 },
  { type: '假冒交友或戀愛', accuracy: 78, total: 35, correct: 27 },
  { type: '假冒親友或家人', accuracy: 82, total: 42, correct: 34 },
  { type: '假冒中獎或抽獎', accuracy: 94, total: 58, correct: 55 },
  { type: '假冒投資機會', accuracy: 75, total: 48, correct: 36 },
  { type: '假冒法務機構', accuracy: 87, total: 52, correct: 45 }
]

const missionData = [
  { id: 1, type: '假冒金融機構', difficulty: '困難', reward: 250, completed: 46, total: 50, status: '進行中' },
  { id: 2, type: '假冒政府機構', difficulty: '困難', reward: 240, completed: 40, total: 45, status: '進行中' },
  { id: 3, type: '假冒電商平台', difficulty: '中等', reward: 200, completed: 57, total: 60, status: '進行中' },
  { id: 4, type: '假冒貸款服務', difficulty: '困難', reward: 260, completed: 34, total: 40, status: '進行中' },
  { id: 5, type: '假冒獎勳或優惠', difficulty: '中等', reward: 210, completed: 50, total: 55, status: '進行中' },
  { id: 6, type: '假冒交友或戀愛', difficulty: '極難', reward: 300, completed: 27, total: 35, status: '需加強' },
  { id: 7, type: '假冒親友或家人', difficulty: '困難', reward: 270, completed: 34, total: 42, status: '進行中' },
  { id: 8, type: '假冒中獎或抽獎', difficulty: '簡單', reward: 180, completed: 55, total: 58, status: '進行中' },
  { id: 9, type: '假冒投資機會', difficulty: '極難', reward: 320, completed: 36, total: 48, status: '需加強' },
  { id: 10, type: '假冒法務機構', difficulty: '困難', reward: 250, completed: 45, total: 52, status: '進行中' }
]

const leaderboardData = [
  { rank: 1, name: 'CyberHunter', score: 9850, accuracy: 98, missions: 245 },
  { rank: 2, name: 'PhishSlayer', score: 9420, accuracy: 96, missions: 238 },
  { rank: 3, name: 'TruthSeeker', score: 8990, accuracy: 94, missions: 225 },
  { rank: 4, name: 'ScamBuster', score: 8560, accuracy: 92, missions: 218 },
  { rank: 5, name: 'GuardianAI', score: 8120, accuracy: 90, missions: 205 }
]

const smsHistory = [
  {
    id: 1,
    type: '假冒投資機會',
    content: '【投資通知】恭喜您獲得獨家投資機會！年化報酬率高達35%，名額有限，請立即點擊連結完成認證：http://invest-chance.xyz/verify',
    userAnswer: '真實',
    correctAnswer: '詐騙',
    isCorrect: false,
    timestamp: '2024-01-15 14:23',
    aiAnalysis: {
      confidence: 98.5,
      redFlags: [
        '承諾不合理的高報酬率（35%年化報酬）',
        '使用緊迫性語言「名額有限」、「立即」',
        '可疑的短網址連結',
        '未經授權的投資邀請',
        '缺乏合法金融機構資訊'
      ],
      explanation: '此簡訊具有典型的投資詐騙特徵。合法的投資機構不會透過簡訊主動邀請投資，且承諾35%的年化報酬率遠高於市場合理水平。詐騙集團常用「高報酬、低風險」的話術吸引受害者，並製造緊迫感促使快速決策。'
    }
  },
  {
    id: 2,
    type: '假冒交友或戀愛',
    content: '嗨～我是Amy，在交友軟體上看到你的照片覺得很有緣分。我目前在做投資理財，最近發現一個很棒的投資平台，要不要一起賺錢？加我LINE：amy_invest88',
    userAnswer: '真實',
    correctAnswer: '詐騙',
    isCorrect: false,
    timestamp: '2024-01-14 09:45',
    aiAnalysis: {
      confidence: 96.2,
      redFlags: [
        '陌生人主動搭訕並快速轉向投資話題',
        '結合感情與投資的雙重誘因',
        '要求加入私人通訊軟體',
        '使用「一起賺錢」等誘導性語言',
        '典型的「殺豬盤」詐騙模式'
      ],
      explanation: '這是典型的「殺豬盤」詐騙手法。詐騙集團會先以交友為名建立信任關係，再逐步引導受害者進行投資。真正的交友對象不會在初次接觸就談論投資，更不會急於要求加入其他通訊軟體。'
    }
  },
  {
    id: 3,
    type: '假冒金融機構',
    content: '【銀行通知】您的帳戶出現異常登入，為保障您的資金安全，請立即點擊連結驗證身份：http://bank-secure.com/verify?id=8829',
    userAnswer: '詐騙',
    correctAnswer: '詐騙',
    isCorrect: true,
    timestamp: '2024-01-13 16:30',
    aiAnalysis: {
      confidence: 99.1,
      redFlags: [],
      explanation: '正確判斷！'
    }
  }
]

// 靈魂動物測驗記錄 - 從store獲取
const soulAnimalHistory = ref([])

// 詐騙類型對照表
const fraudLabelMap = {
  '1_bank': '銀行詐騙',
  '2_gov': '政府機關詐騙', 
  '3_ecommerce': '電商詐騙',
  '4_loan': '貸款詐騙',
  '5_offer': '優惠詐騙',
  '6_social': '社交詐騙',
  '7_family': '親友詐騙',
  '8_lottery': '中獎詐騙',
  '9_investment': '投資詐騙',
  '10_law': '法務詐騙'
}

// 載入用戶的靈魂動物記錄
const loadSoulAnimalRecords = () => {
  soulAnimalHistory.value = soulAnimalStore.getUserRecords(props.currentUser)
  console.log(`載入 ${props.currentUser} 的記錄:`, soulAnimalHistory.value)
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

</style>
