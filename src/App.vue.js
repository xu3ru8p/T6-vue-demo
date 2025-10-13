"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var GameBoard_vue_1 = require("./GameBoard.vue");
var GameResults_vue_1 = require("./GameResults.vue");
var WelcomeScreen_vue_1 = require("./WelcomeScreen.vue");
var gameStarted = (0, vue_1.ref)(false);
var gameEnded = (0, vue_1.ref)(false);
var round = (0, vue_1.ref)(1);
var score = (0, vue_1.ref)(0);
function startGame() {
    gameStarted.value = true;
}
function nextRound(correct) {
    if (correct)
        score.value += 20;
    if (round.value < 5) {
        round.value++; // 只有在小於5時才加1
    }
    else {
        endGame(); // 第5回合結束就結束遊戲
    }
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
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['main-header']} */ ;
/** @type {__VLS_StyleScopedClasses['main-header']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    id: "app",
});
__VLS_asFunctionalElement(__VLS_elements.canvas, __VLS_elements.canvas)({
    id: "bg-canvas",
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)(__assign({ class: "main-header" }));
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded) }), null, null);
// @ts-ignore
[gameStarted, gameEnded,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)(__assign({ class: "main-content" }));
/** @type {[typeof WelcomeScreen, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(WelcomeScreen_vue_1.default, new WelcomeScreen_vue_1.default(__assign({ 'onStart': {} })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onStart': {} })], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3;
var __VLS_4;
var __VLS_5 = ({ start: {} },
    { onStart: (__VLS_ctx.startGame) });
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (!__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded) }), null, null);
// @ts-ignore
[gameStarted, gameEnded, startGame,];
var __VLS_2;
/** @type {[typeof GameBoard, ]} */ ;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(GameBoard_vue_1.default, new GameBoard_vue_1.default(__assign(__assign({ 'onNextRound': {} }, { 'onEndGame': {} }), { round: (__VLS_ctx.round), score: (__VLS_ctx.score) })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign(__assign({ 'onNextRound': {} }, { 'onEndGame': {} }), { round: (__VLS_ctx.round), score: (__VLS_ctx.score) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
var __VLS_10;
var __VLS_11;
var __VLS_12 = ({ nextRound: {} },
    { onNextRound: (__VLS_ctx.nextRound) });
var __VLS_13 = ({ endGame: {} },
    { onEndGame: (__VLS_ctx.endGame) });
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.gameStarted && !__VLS_ctx.gameEnded) }), null, null);
// @ts-ignore
[gameStarted, gameEnded, round, score, nextRound, endGame,];
var __VLS_9;
/** @type {[typeof GameResults, ]} */ ;
// @ts-ignore
var __VLS_15 = __VLS_asFunctionalComponent(GameResults_vue_1.default, new GameResults_vue_1.default(__assign({ 'onRestart': {} }, { round: (__VLS_ctx.round), score: (__VLS_ctx.score) })));
var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign({ 'onRestart': {} }, { round: (__VLS_ctx.round), score: (__VLS_ctx.score) })], __VLS_functionalComponentArgsRest(__VLS_15), false));
var __VLS_18;
var __VLS_19;
var __VLS_20 = ({ restart: {} },
    { onRestart: (__VLS_ctx.restartGame) });
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.gameEnded) }), null, null);
// @ts-ignore
[gameEnded, round, score, restartGame,];
var __VLS_17;
/** @type {__VLS_StyleScopedClasses['main-header']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
