import { ref } from 'vue';
import GameBoard from './GameBoard.vue';
import GameResults from './GameResults.vue';
import WelcomeScreen from './WelcomeScreen.vue';
import Login from './Login.vue';
import Analyt from './Analyt.vue';
import LoginALG from './Login_ALG.vue';
import VoiceRecognition from './VoiceRecognition.vue';
import Admin from './Admin.vue';
import soulAnimalStore from './soulAnimalStore.js';
const gameStarted = ref(false);
const gameEnded = ref(false);
const showWelcome = ref(false);
const showAnalyt = ref(false);
const showLoginALG = ref(false);
const showVoiceRecognition = ref(false);
const showAdmin = ref(false);
const round = ref(1);
const score = ref(0);
const gameMode = ref('normal'); // 存選擇的遊戲模式
const wrongIdsForResults = ref([]); // <- 新增
const isAnalytLoggedIn = ref(false); // 新增：Analyt登入狀態
const hasCompletedQuiz = ref(false); // 新增：追蹤是否完成過測驗
const currentUser = ref('guest'); // 新增：當前用戶
function goToWelcome() {
    console.log('goToWelcome called from App.vue');
    showWelcome.value = true;
}
// 新增：處理測驗完成
function onQuizCompleted() {
    hasCompletedQuiz.value = true;
}
// 新增：處理開始測驗或遊戲的邏輯
function handleStartQuizOrGame() {
    // 這個函數會直接由 Login.vue 處理，不需要在 App.vue 中做特別處理
    // Login.vue 會根據 hasCompletedQuiz 的值決定顯示 Quiz 還是直接 emit goToWelcome
}
// 接收 WelcomeScreen 傳過來的模式
function startGame(mode) {
    console.log("App.vue 開始遊戲, 模式:", mode); // 測試用
    gameMode.value = mode || 'normal';
    gameStarted.value = true;
    showWelcome.value = false;
}
function nextRound(correct) {
    if (correct)
        score.value += 20;
    if (round.value < 5)
        round.value++;
    else {
        // 遊戲結束時確保錯題ID已經更新
        endGame();
    }
}
function endGame() {
    gameEnded.value = true;
    gameStarted.value = false;
}
function restartGame() {
    gameStarted.value = false;
    gameEnded.value = false;
    showWelcome.value = false;
    round.value = 1;
    score.value = 0;
    gameMode.value = 'normal';
    wrongIdsForResults.value = []; // 清空錯題ID
    // 重置登入狀態（可選，根據需求決定是否重置）
    // isAnalytLoggedIn.value = false
}
function goBack() {
    // 從 WelcomeScreen 返回 Login
    showWelcome.value = false;
}
function openAnalyt() {
    // 檢查是否已經使用 white 帳號登入
    if (isAnalytLoggedIn.value) {
        showAnalyt.value = true;
    }
    else {
        alert('你尚未登入，請先登入帳號\n\n請使用 Login 頁面右下角的「Login」按鈕\n使用帳號：white，密碼：123 進行登入');
    }
}
function closeAnalyt() {
    showAnalyt.value = false;
    // 注意：不重置 isAnalytLoggedIn.value，保持登入狀態
}
function goToLoginALG() {
    showLoginALG.value = true;
}
function closeLoginALG() {
    showLoginALG.value = false;
}
function goToVoiceRecognition() {
    showVoiceRecognition.value = true;
}
function closeVoiceRecognition() {
    showVoiceRecognition.value = false;
}
function handleLoginSuccess(userInfo) {
    console.log('登入成功:', userInfo);
    // 關閉登入頁面，打開管理頁面
    showLoginALG.value = false;
    showAdmin.value = true;
}
function handleAnalytSuccess(userInfo) {
    console.log('Analyt登入成功:', userInfo);
    // 轉移 guest 用戶的記錄到實際登錄用戶
    const transferred = soulAnimalStore.transferRecords('guest', userInfo.username);
    if (transferred) {
        console.log(`已轉移 guest 記錄至 ${userInfo.username}`);
    }
    // 設置 Analyt 登入狀態
    isAnalytLoggedIn.value = true;
    // 保存當前用戶
    currentUser.value = userInfo.username;
    // 關閉登入頁面，打開分析頁面
    showLoginALG.value = false;
    showAnalyt.value = true;
}
function closeAdmin() {
    showAdmin.value = false;
    showLoginALG.value = false;
}
// 接收 GameBoard emit 的錯題 id
function onWrongIds(ids) {
    console.log('App.vue 接收到錯題ID:', ids);
    wrongIdsForResults.value = ids;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    id: "app",
    ...{ class: "relative min-h-screen bg-black text-cyan-400 font-sans overflow-hidden" },
});
__VLS_asFunctionalElement(__VLS_elements.canvas, __VLS_elements.canvas)({
    id: "bg-canvas",
    ...{ class: "absolute inset-0 w-full h-full z-0" },
});
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4" },
});
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded && !__VLS_ctx.showWelcome && !__VLS_ctx.showAnalyt && !__VLS_ctx.showLoginALG && !__VLS_ctx.showVoiceRecognition && !__VLS_ctx.showAdmin) {
    // @ts-ignore
    [gameStarted, gameEnded, showWelcome, showAnalyt, showLoginALG, showVoiceRecognition, showAdmin,];
    /** @type {[typeof Login, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(Login, new Login({
        ...{ 'onGoToWelcome': {} },
        ...{ 'onStartQuizOrGame': {} },
        ...{ 'onOnQuizCompleted': {} },
        ...{ 'onOpenProfile': {} },
        ...{ 'onGoToLogin': {} },
        ...{ 'onGoToVoiceRecognition': {} },
        hasCompletedQuiz: (__VLS_ctx.hasCompletedQuiz),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onGoToWelcome': {} },
        ...{ 'onStartQuizOrGame': {} },
        ...{ 'onOnQuizCompleted': {} },
        ...{ 'onOpenProfile': {} },
        ...{ 'onGoToLogin': {} },
        ...{ 'onGoToVoiceRecognition': {} },
        hasCompletedQuiz: (__VLS_ctx.hasCompletedQuiz),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ goToWelcome: {} },
        { onGoToWelcome: (__VLS_ctx.goToWelcome) });
    const __VLS_6 = ({ startQuizOrGame: {} },
        { onStartQuizOrGame: (__VLS_ctx.handleStartQuizOrGame) });
    const __VLS_7 = ({ onQuizCompleted: {} },
        { onOnQuizCompleted: (__VLS_ctx.onQuizCompleted) });
    const __VLS_8 = ({ openProfile: {} },
        { onOpenProfile: (__VLS_ctx.openAnalyt) });
    const __VLS_9 = ({ goToLogin: {} },
        { onGoToLogin: (__VLS_ctx.goToLoginALG) });
    const __VLS_10 = ({ goToVoiceRecognition: {} },
        { onGoToVoiceRecognition: (__VLS_ctx.goToVoiceRecognition) });
    // @ts-ignore
    [hasCompletedQuiz, goToWelcome, handleStartQuizOrGame, onQuizCompleted, openAnalyt, goToLoginALG, goToVoiceRecognition,];
    var __VLS_2;
}
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded && __VLS_ctx.showWelcome && !__VLS_ctx.showAdmin) {
    // @ts-ignore
    [gameStarted, gameEnded, showWelcome, showAdmin,];
    /** @type {[typeof WelcomeScreen, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(WelcomeScreen, new WelcomeScreen({
        ...{ 'onStart': {} },
        ...{ 'onBack': {} },
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onStart': {} },
        ...{ 'onBack': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = ({ start: {} },
        { onStart: (__VLS_ctx.startGame) });
    const __VLS_18 = ({ back: {} },
        { onBack: (__VLS_ctx.goBack) });
    // @ts-ignore
    [startGame, goBack,];
    var __VLS_14;
}
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded && __VLS_ctx.showAnalyt && !__VLS_ctx.showAdmin) {
    // @ts-ignore
    [gameStarted, gameEnded, showAnalyt, showAdmin,];
    /** @type {[typeof Analyt, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(Analyt, new Analyt({
        ...{ 'onClose': {} },
        currentUser: (__VLS_ctx.currentUser),
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClose': {} },
        currentUser: (__VLS_ctx.currentUser),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    const __VLS_25 = ({ close: {} },
        { onClose: (__VLS_ctx.closeAnalyt) });
    // @ts-ignore
    [currentUser, closeAnalyt,];
    var __VLS_22;
}
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded && __VLS_ctx.showLoginALG && !__VLS_ctx.showAdmin) {
    // @ts-ignore
    [gameStarted, gameEnded, showLoginALG, showAdmin,];
    /** @type {[typeof LoginALG, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(LoginALG, new LoginALG({
        ...{ 'onBack': {} },
        ...{ 'onLoginSuccess': {} },
        ...{ 'onAnalytSuccess': {} },
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onBack': {} },
        ...{ 'onLoginSuccess': {} },
        ...{ 'onAnalytSuccess': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = ({ back: {} },
        { onBack: (__VLS_ctx.closeLoginALG) });
    const __VLS_33 = ({ loginSuccess: {} },
        { onLoginSuccess: (__VLS_ctx.handleLoginSuccess) });
    const __VLS_34 = ({ analytSuccess: {} },
        { onAnalytSuccess: (__VLS_ctx.handleAnalytSuccess) });
    // @ts-ignore
    [closeLoginALG, handleLoginSuccess, handleAnalytSuccess,];
    var __VLS_29;
}
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded && __VLS_ctx.showVoiceRecognition && !__VLS_ctx.showAdmin) {
    // @ts-ignore
    [gameStarted, gameEnded, showVoiceRecognition, showAdmin,];
    /** @type {[typeof VoiceRecognition, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(VoiceRecognition, new VoiceRecognition({
        ...{ 'onBack': {} },
    }));
    const __VLS_37 = __VLS_36({
        ...{ 'onBack': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    let __VLS_39;
    let __VLS_40;
    const __VLS_41 = ({ back: {} },
        { onBack: (__VLS_ctx.closeVoiceRecognition) });
    // @ts-ignore
    [closeVoiceRecognition,];
    var __VLS_38;
}
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded && __VLS_ctx.showAdmin) {
    // @ts-ignore
    [gameStarted, gameEnded, showAdmin,];
    /** @type {[typeof Admin, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(Admin, new Admin({
        ...{ 'onBack': {} },
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onBack': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = ({ back: {} },
        { onBack: (__VLS_ctx.closeAdmin) });
    // @ts-ignore
    [closeAdmin,];
    var __VLS_45;
}
if (__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded) {
    // @ts-ignore
    [gameStarted, gameEnded,];
    /** @type {[typeof GameBoard, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(GameBoard, new GameBoard({
        ...{ 'onNextRound': {} },
        ...{ 'onEndGame': {} },
        ...{ 'onWrongIds': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
        mode: (__VLS_ctx.gameMode),
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onNextRound': {} },
        ...{ 'onEndGame': {} },
        ...{ 'onWrongIds': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
        mode: (__VLS_ctx.gameMode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = ({ nextRound: {} },
        { onNextRound: (__VLS_ctx.nextRound) });
    const __VLS_56 = ({ endGame: {} },
        { onEndGame: (__VLS_ctx.endGame) });
    const __VLS_57 = ({ wrongIds: {} },
        { onWrongIds: (__VLS_ctx.onWrongIds) });
    // @ts-ignore
    [round, score, gameMode, nextRound, endGame, onWrongIds,];
    var __VLS_52;
}
if (__VLS_ctx.gameEnded) {
    // @ts-ignore
    [gameEnded,];
    /** @type {[typeof GameResults, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(GameResults, new GameResults({
        ...{ 'onRestart': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
        wrongIds: (__VLS_ctx.wrongIdsForResults),
    }));
    const __VLS_60 = __VLS_59({
        ...{ 'onRestart': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
        wrongIds: (__VLS_ctx.wrongIdsForResults),
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    let __VLS_62;
    let __VLS_63;
    const __VLS_64 = ({ restart: {} },
        { onRestart: (__VLS_ctx.restartGame) });
    // @ts-ignore
    [round, score, wrongIdsForResults, restartGame,];
    var __VLS_61;
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-sans']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=App.vue.js.map