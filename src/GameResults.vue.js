import axios from "axios";
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
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
            }
            catch (err) {
                console.error("取得排行榜失敗", err);
            }
        },
        async submitScore() {
            if (!this.playerName)
                return;
            try {
                const res = await axios.post("http://localhost:3000/leaderboard", {
                    name: this.playerName,
                    score: this.score
                });
                if (res.data.success) {
                    this.leaderboard = res.data.leaderboard;
                    this.submitted = true;
                }
            }
            catch (err) {
                console.error("提交分數失敗", err);
            }
        }
    },
    mounted() {
        this.fetchLeaderboard();
    }
});
const __VLS_self = (await import('vue')).defineComponent({
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
            }
            catch (err) {
                console.error("取得排行榜失敗", err);
            }
        },
        async submitScore() {
            if (!this.playerName)
                return;
            try {
                const res = await axios.post("http://localhost:3000/leaderboard", {
                    name: this.playerName,
                    score: this.score
                });
                if (res.data.success) {
                    this.leaderboard = res.data.leaderboard;
                    this.submitted = true;
                }
            }
            catch (err) {
                console.error("提交分數失敗", err);
            }
        }
    },
    mounted() {
        this.fetchLeaderboard();
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard']} */ ;
/** @type {__VLS_StyleScopedClasses['restart']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "results" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "mission" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.round);
// @ts-ignore
[round,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.score);
// @ts-ignore
[score,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "leaderboard-input" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.playerName),
    placeholder: "Your Name",
});
// @ts-ignore
[playerName,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.submitScore) },
    disabled: (!__VLS_ctx.playerName || __VLS_ctx.submitted),
});
// @ts-ignore
[playerName, submitScore, submitted,];
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.ol, __VLS_elements.ol)({
    ...{ class: "leaderboard" },
});
for (const [entry, index] of __VLS_getVForSourceType((__VLS_ctx.leaderboard))) {
    // @ts-ignore
    [leaderboard,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
        key: (index),
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "rank" },
    });
    (index + 1);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "name" },
    });
    (entry.name);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "score" },
    });
    (entry.score);
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('restart');
            // @ts-ignore
            [$emit,];
        } },
    ...{ class: "restart" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hacker-grid" },
});
/** @type {__VLS_StyleScopedClasses['results']} */ ;
/** @type {__VLS_StyleScopedClasses['mission']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard-input']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard']} */ ;
/** @type {__VLS_StyleScopedClasses['rank']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['score']} */ ;
/** @type {__VLS_StyleScopedClasses['restart']} */ ;
/** @type {__VLS_StyleScopedClasses['hacker-grid']} */ ;
export default {};
//# sourceMappingURL=GameResults.vue.js.map