<template>
  <div class="results">
    <h2>遊戲結束</h2>
    <p class="mission">MISSION COMPLETE</p>
    <p>回合: {{ round }}/5</p>
    <p>分數: {{ score }}</p>

    <div class="leaderboard-input">
      <input type="text" v-model="playerName" placeholder="Your Name" />
      <button @click="submitScore" :disabled="!playerName || submitted">提交分數</button>
    </div>

    <h3>排行榜</h3>
    <ol class="leaderboard">
      <li v-for="(entry, index) in leaderboard" :key="index">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="name">{{ entry.name }}</span>
        <span class="score">{{ entry.score }} 分</span>
      </li>
    </ol>

    <button class="restart" @click="$emit('restart')">回首頁</button>
  </div>
  <!-- 駭客電網動畫層 -->
    <div class="hacker-grid"></div> <!-- ✅ 加上背景 -->
</template>

<script>
import axios from "axios";

export default {
  name: "GameResults",
  props: ["round", "score"],
  emits: ["restart"],
  data() {
    return {
      playerName: "",
      leaderboard: [],
      submitted: false
    };
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const res = await axios.get("http://localhost:3000/leaderboard");
        this.leaderboard = res.data;
      } catch (err) {
        console.error("取得排行榜失敗", err);
      }
    },
    async submitScore() {
      if (!this.playerName) return;

      try {
        const res = await axios.post("http://localhost:3000/leaderboard", {
          name: this.playerName,
          score: this.score
        });

        if (res.data.success) {
          this.leaderboard = res.data.leaderboard;
          this.submitted = true;
        }
      } catch (err) {
        console.error("提交分數失敗", err);
      }
    }
  },
  mounted() {
    this.fetchLeaderboard();
  }
};
</script>

<style scoped>
/* 原本樣式保持不變 */
.results {
  position: relative;
  z-index: 999;
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #111, #222);
  color: #00ffcc;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

.mission {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.leaderboard-input {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.leaderboard-input input {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  outline: none;
  width: 180px;
  background-color: #111;
  color: #00ffcc;
}

.leaderboard-input button {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #00ffcc;
  color: #111;
  font-weight: bold;
  transition: 0.2s;
}

.leaderboard-input button:disabled {
  background: #555;
  cursor: not-allowed;
}

.leaderboard-input button:hover:not(:disabled) {
  background: #0ff;
}

.leaderboard {
  margin: 20px auto;
  padding-left: 0;
  max-width: 350px;
  list-style: none;
}

.leaderboard li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #555;
  padding: 8px 0;
}

.rank { width: 30px; }
.name { flex: 1; text-align: left; padding-left: 10px; }
.score { width: 60px; }

.restart {
  margin-top: 20px;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  background-color: #0ff;
  color: #111;
  font-weight: bold;
  border: none;
  transition: background 0.2s;
}

.restart:hover {
  background-color: #00ccaa;
}
</style>
