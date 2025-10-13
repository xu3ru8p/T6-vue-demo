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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var database_js_1 = require("./database.js");
var database_true_js_1 = require("./database_true.js");
debugger; /* PartiallyEnd: #3632/script.vue */
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    name: "GameBoard",
    emits: ["next-round"],
    setup: function (props, _a) {
        var emit = _a.emit;
        var gameMessages = (0, vue_1.ref)([]);
        var selectedMessage = (0, vue_1.ref)(null);
        var showResult = (0, vue_1.ref)(false);
        // 隨機挑選元素
        var getRandomItems = function (arr, n) {
            var shuffled = __spreadArray([], arr, true).sort(function () { return 0.5 - Math.random(); });
            return shuffled.slice(0, n);
        };
        var shuffleArray = function (arr) { return __spreadArray([], arr, true).sort(function () { return 0.5 - Math.random(); }); };
        // 初始化遊戲訊息
        var initGame = function () {
            var selectedScams = getRandomItems(database_js_1.scamMessages, 2);
            var selectedReal = getRandomItems(database_true_js_1.realMessages, 1);
            gameMessages.value = shuffleArray(__spreadArray(__spreadArray([], selectedScams, true), selectedReal, true));
            selectedMessage.value = null;
            showResult.value = false;
        };
        var selectMessage = function (msg) {
            if (selectedMessage.value)
                return; // 已選過就不能再點
            selectedMessage.value = msg;
            showResult.value = true;
            // 確認正確與否
            var correct = msg.type === "real";
            // 等 1.2 秒後進入下一回合
            setTimeout(function () {
                emit("next-round", correct);
                initGame();
            }, 1200);
        };
        (0, vue_1.onMounted)(function () { return initGame(); });
        return { gameMessages: gameMessages, selectedMessage: selectedMessage, selectMessage: selectMessage, showResult: showResult };
    },
});
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    name: "GameBoard",
    emits: ["next-round"],
    setup: function (props, _a) {
        var emit = _a.emit;
        var gameMessages = (0, vue_1.ref)([]);
        var selectedMessage = (0, vue_1.ref)(null);
        var showResult = (0, vue_1.ref)(false);
        // 隨機挑選元素
        var getRandomItems = function (arr, n) {
            var shuffled = __spreadArray([], arr, true).sort(function () { return 0.5 - Math.random(); });
            return shuffled.slice(0, n);
        };
        var shuffleArray = function (arr) { return __spreadArray([], arr, true).sort(function () { return 0.5 - Math.random(); }); };
        // 初始化遊戲訊息
        var initGame = function () {
            var selectedScams = getRandomItems(database_js_1.scamMessages, 2);
            var selectedReal = getRandomItems(database_true_js_1.realMessages, 1);
            gameMessages.value = shuffleArray(__spreadArray(__spreadArray([], selectedScams, true), selectedReal, true));
            selectedMessage.value = null;
            showResult.value = false;
        };
        var selectMessage = function (msg) {
            if (selectedMessage.value)
                return; // 已選過就不能再點
            selectedMessage.value = msg;
            showResult.value = true;
            // 確認正確與否
            var correct = msg.type === "real";
            // 等 1.2 秒後進入下一回合
            setTimeout(function () {
                emit("next-round", correct);
                initGame();
            }, 1200);
        };
        (0, vue_1.onMounted)(function () { return initGame(); });
        return { gameMessages: gameMessages, selectedMessage: selectedMessage, selectMessage: selectMessage, showResult: showResult };
    },
});
var __VLS_ctx = {};
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "game-board" }));
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "cards" }));
var _loop_1 = function (msg) {
    // @ts-ignore
    [gameMessages,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.selectMessage(msg);
            // @ts-ignore
            [selectMessage,];
        } }, { key: (msg.id) }), { class: "card" }), { class: ({
            selected: __VLS_ctx.selectedMessage && __VLS_ctx.selectedMessage.id === msg.id,
            correct: __VLS_ctx.showResult && msg.type === 'real',
            wrong: __VLS_ctx.showResult && ((_a = __VLS_ctx.selectedMessage) === null || _a === void 0 ? void 0 : _a.id) === msg.id && __VLS_ctx.selectedMessage.type !== 'real'
        }) }));
    // @ts-ignore
    [selectedMessage, selectedMessage, selectedMessage, selectedMessage, showResult, showResult,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (msg.content);
};
for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.gameMessages)); _i < _b.length; _i++) {
    var msg = _b[_i][0];
    _loop_1(msg);
}
/** @type {__VLS_StyleScopedClasses['game-board']} */ ;
/** @type {__VLS_StyleScopedClasses['cards']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['correct']} */ ;
/** @type {__VLS_StyleScopedClasses['wrong']} */ ;
exports.default = {};
