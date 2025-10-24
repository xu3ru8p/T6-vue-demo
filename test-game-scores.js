// 測試遊戲分數和排行榜功能的腳本
// 用於在瀏覽器控制台中運行

console.log('=== 測試遊戲分數和排行榜功能 ===');

// 引入 soulAnimalStore（假設已在全域可用）
// 如果在瀏覽器控制台中，需要直接訪問 store

// 1. 測試添加分數功能
function testAddScore() {
  console.log('\n1. 測試添加分數功能');
  
  // 模擬不同用戶的遊戲分數
  const testUsers = [
    { name: 'white', score: 100 },
    { name: 'testuser', score: 80 },
    { name: 'player1', score: 120 },
    { name: 'white', score: 90 }, // 同一用戶再次遊戲，分數應該累加
    { name: 'admin', score: 150 }
  ];
  
  testUsers.forEach(user => {
    // 模擬添加分數（這會在 GameResults.vue 中自動執行）
    console.log(`模擬用戶 ${user.name} 獲得 ${user.score} 分`);
  });
}

// 2. 測試排行榜功能
function testLeaderboard() {
  console.log('\n2. 測試排行榜功能');
  
  // 檢查 localStorage 中的分數記錄
  const gameScores = JSON.parse(localStorage.getItem('game_scores') || '{}');
  console.log('當前分數記錄:', gameScores);
  
  // 生成排行榜
  const leaderboard = Object.entries(gameScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  console.log('排行榜:', leaderboard);
}

// 3. 模擬完整遊戲流程
function simulateGameFlow() {
  console.log('\n3. 模擬完整遊戲流程');
  
  // 模擬用戶登錄
  const currentUser = localStorage.getItem('currentUser') || 'testuser';
  console.log('當前登錄用戶:', currentUser);
  
  // 模擬遊戲結束，分數為 85
  const gameScore = 85;
  console.log(`遊戲結束，用戶 ${currentUser} 獲得 ${gameScore} 分`);
  
  // 模擬 GameResults.vue 中的分數記錄邏輯
  const allScores = JSON.parse(localStorage.getItem('game_scores') || '{}');
  const currentScore = allScores[currentUser] || 0;
  allScores[currentUser] = currentScore + gameScore;
  localStorage.setItem('game_scores', JSON.stringify(allScores));
  
  console.log(`用戶 ${currentUser} 的總分從 ${currentScore} 增加到 ${allScores[currentUser]}`);
  
  // 顯示更新後的排行榜
  testLeaderboard();
}

// 4. 清除測試數據
function clearTestData() {
  console.log('\n4. 清除測試數據');
  localStorage.removeItem('game_scores');
  console.log('遊戲分數數據已清除');
}

// 執行測試
testAddScore();
testLeaderboard();
simulateGameFlow();

console.log('\n=== 測試完成 ===');
console.log('提示：');
console.log('- 執行 simulateGameFlow() 可以模擬完整遊戲流程');
console.log('- 執行 clearTestData() 可以清除測試數據');
console.log('- 查看 Analyt.vue 的排行榜頁面應該會顯示這些分數');