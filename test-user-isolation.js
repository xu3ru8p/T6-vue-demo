// 測試用戶特定數據隔離功能的腳本
// 用於在瀏覽器控制台中運行

console.log('=== 測試用戶特定數據隔離功能 ===');

// 1. 檢查 localStorage 中的用戶帳號
const validAccounts = JSON.parse(localStorage.getItem('validAccounts') || '[]');
console.log('現有帳號:', validAccounts);

// 2. 檢查當前登錄用戶
const currentUser = localStorage.getItem('currentUser');
console.log('當前登錄用戶:', currentUser);

// 3. 檢查用戶記錄
const userRecordsKey = currentUser ? `soulAnimalRecords_${currentUser}` : 'soulAnimalRecords_defaultUser';
const userRecords = JSON.parse(localStorage.getItem(userRecordsKey) || '[]');
console.log(`${currentUser || 'defaultUser'} 的記錄數量:`, userRecords.length);
console.log(`${currentUser || 'defaultUser'} 的記錄:`, userRecords);

// 4. 如果你想要創建一個測試用戶，取消以下註釋：
/*
const testUser = 'testuser';
const testPassword = '123';
const accounts = JSON.parse(localStorage.getItem('validAccounts') || '[]');
if (!accounts.find(acc => acc.username === testUser)) {
  accounts.push({ username: testUser, password: testPassword });
  localStorage.setItem('validAccounts', JSON.stringify(accounts));
  console.log('已創建測試用戶:', testUser);
}
*/

// 5. 檢查不同用戶的記錄分離
validAccounts.forEach(account => {
  const recordsKey = `soulAnimalRecords_${account.username}`;
  const records = JSON.parse(localStorage.getItem(recordsKey) || '[]');
  console.log(`用戶 ${account.username} 的記錄數量:`, records.length);
});