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
debugger; /* PartiallyEnd: #3632/script.vue */
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    name: "GameResults",
    props: ["round", "score"],
    emits: ["restart"],
    data: function () {
        return {
            playerName: "",
            leaderboard: [
                { name: "test15", score: 80 },
                { name: "test4", score: 70 }
            ]
        };
    },
    computed: {
        sortedLeaderboard: function () {
            return __spreadArray([], this.leaderboard, true).sort(function (a, b) { return b.score - a.score; });
        }
    },
    methods: {
        submitScore: function () {
            if (this.playerName) {
                this.leaderboard.push({ name: this.playerName, score: this.score });
                this.playerName = "";
            }
        }
    }
});
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    name: "GameResults",
    props: ["round", "score"],
    emits: ["restart"],
    data: function () {
        return {
            playerName: "",
            leaderboard: [
                { name: "test15", score: 80 },
                { name: "test4", score: 70 }
            ]
        };
    },
    computed: {
        sortedLeaderboard: function () {
            return __spreadArray([], this.leaderboard, true).sort(function (a, b) { return b.score - a.score; });
        }
    },
    methods: {
        submitScore: function () {
            if (this.playerName) {
                this.leaderboard.push({ name: this.playerName, score: this.score });
                this.playerName = "";
            }
        }
    }
});
var __VLS_ctx = {};
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard']} */ ;
/** @type {__VLS_StyleScopedClasses['restart']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "results" }));
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "mission" }));
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.round);
// @ts-ignore
[round,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.score);
// @ts-ignore
[score,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "leaderboard-input" }));
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.playerName),
    placeholder: "Your Name",
});
// @ts-ignore
[playerName,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.submitScore) }, { disabled: (!__VLS_ctx.playerName) }));
// @ts-ignore
[playerName, submitScore,];
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.ol, __VLS_elements.ol)(__assign({ class: "leaderboard" }));
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.sortedLeaderboard)); _i < _a.length; _i++) {
    var _b = _a[_i], entry = _b[0], index = _b[1];
    // @ts-ignore
    [sortedLeaderboard,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
        key: (entry.name),
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "rank" }));
    (index + 1);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "name" }));
    (entry.name);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "score" }));
    (entry.score);
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('restart');
        // @ts-ignore
        [$emit,];
    } }, { class: "restart" }));
/** @type {__VLS_StyleScopedClasses['results']} */ ;
/** @type {__VLS_StyleScopedClasses['mission']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard']} */ ;
/** @type {__VLS_StyleScopedClasses['rank']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['score']} */ ;
/** @type {__VLS_StyleScopedClasses['restart']} */ ;
exports.default = {};
