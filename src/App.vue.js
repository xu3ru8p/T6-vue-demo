import { ref } from 'vue';
import GameBoard from './GameBoard.vue';
import GameResults from './GameResults.vue';
import WelcomeScreen from './WelcomeScreen.vue';
const gameStarted = ref(false);
const gameEnded = ref(false);
const round = ref(1);
const score = ref(0);
const gameMode = ref('normal'); // 存選擇的遊戲模式
// 接收 WelcomeScreen 傳過來的模式
function startGame(mode) {
    console.log("App.vue 開始遊戲, 模式:", mode); // 測試用
    gameMode.value = mode || 'normal';
    gameStarted.value = true;
}
function nextRound(correct) {
    if (correct)
        score.value += 20;
    if (round.value < 5)
        round.value++;
    else
        endGame();
}
function endGame() {
    gameEnded.value = true;
    gameStarted.value = false;
}
function restartGame() {
    gameStarted.value = false;
    gameEnded.value = false;
    round.value = 1;
    score.value = 0;
    gameMode.value = 'normal';
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
if (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded) {
    // @ts-ignore
    [gameStarted, gameEnded,];
    /** @type {[typeof WelcomeScreen, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(WelcomeScreen, new WelcomeScreen({
        ...{ 'onStart': {} },
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onStart': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ start: {} },
        { onStart: (__VLS_ctx.startGame) });
    // @ts-ignore
    [startGame,];
    var __VLS_2;
}
if (__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded) {
    // @ts-ignore
    [gameStarted, gameEnded,];
    /** @type {[typeof GameBoard, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(GameBoard, new GameBoard({
        ...{ 'onNextRound': {} },
        ...{ 'onEndGame': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
        mode: (__VLS_ctx.gameMode),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onNextRound': {} },
        ...{ 'onEndGame': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
        mode: (__VLS_ctx.gameMode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    const __VLS_12 = ({ nextRound: {} },
        { onNextRound: (__VLS_ctx.nextRound) });
    const __VLS_13 = ({ endGame: {} },
        { onEndGame: (__VLS_ctx.endGame) });
    // @ts-ignore
    [round, score, gameMode, nextRound, endGame,];
    var __VLS_9;
}
if (__VLS_ctx.gameEnded) {
    // @ts-ignore
    [gameEnded,];
    /** @type {[typeof GameResults, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(GameResults, new GameResults({
        ...{ 'onRestart': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onRestart': {} },
        round: (__VLS_ctx.round),
        score: (__VLS_ctx.score),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = ({ restart: {} },
        { onRestart: (__VLS_ctx.restartGame) });
    // @ts-ignore
    [round, score, restartGame,];
    var __VLS_17;
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