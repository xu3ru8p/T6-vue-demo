import axios from "axios";
// 同時引入 scam 與 real（若有）；若只有 scamMessages 也可工作
import { scamMessages } from "../database";
import { realMessages } from "../database_true"; // 如果沒有此檔案，可刪或保留並確保路徑正確
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
    name: "GameResults",
    props: {
        round: Number,
        score: Number,
        wrongIds: {
            type: Array,
            default: () => []
        }
    },
    emits: ["restart"],
    data() {
        return {
            playerName: "",
            leaderboard: [],
            submitted: false,
            wrongAnswers: []
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
        },
        loadWrongQuestions() {
            console.log('GameResults: 開始載入錯題，接收到的wrongIds:', this.wrongIds);
            // 只從詐騙簡訊中載入錯題（因為錯誤的選擇通常是選到詐騙簡訊）
            const scamArray = Array.isArray(scamMessages) ? scamMessages : [];
            console.log('GameResults: 可用的詐騙簡訊數量:', scamArray.length);
            // 容錯：將 wrongIds 與 msg.id 都轉成字串比較（避免 number/string mismatch）
            const wrongIdStrs = this.wrongIds.map((id) => String(id));
            this.wrongAnswers = scamArray.filter((msg) => wrongIdStrs.includes(String(msg.id)));
            console.log('GameResults: 錯題ID字串陣列:', wrongIdStrs);
            console.log('GameResults: 找到的錯題數量:', this.wrongAnswers.length);
            console.log('GameResults: 錯題詳細內容:', this.wrongAnswers);
        }
    },
    mounted() {
        this.fetchLeaderboard();
        this.loadWrongQuestions();
    },
    watch: {
        wrongIds: {
            handler() {
                console.log('GameResults: wrongIds prop 改變，重新載入錯題');
                this.loadWrongQuestions();
            },
            immediate: true
        }
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: "GameResults",
    props: {
        round: Number,
        score: Number,
        wrongIds: {
            type: Array,
            default: () => []
        }
    },
    emits: ["restart"],
    data() {
        return {
            playerName: "",
            leaderboard: [],
            submitted: false,
            wrongAnswers: []
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
        },
        loadWrongQuestions() {
            console.log('GameResults: 開始載入錯題，接收到的wrongIds:', this.wrongIds);
            // 只從詐騙簡訊中載入錯題（因為錯誤的選擇通常是選到詐騙簡訊）
            const scamArray = Array.isArray(scamMessages) ? scamMessages : [];
            console.log('GameResults: 可用的詐騙簡訊數量:', scamArray.length);
            // 容錯：將 wrongIds 與 msg.id 都轉成字串比較（避免 number/string mismatch）
            const wrongIdStrs = this.wrongIds.map((id) => String(id));
            this.wrongAnswers = scamArray.filter((msg) => wrongIdStrs.includes(String(msg.id)));
            console.log('GameResults: 錯題ID字串陣列:', wrongIdStrs);
            console.log('GameResults: 找到的錯題數量:', this.wrongAnswers.length);
            console.log('GameResults: 錯題詳細內容:', this.wrongAnswers);
        }
    },
    mounted() {
        this.fetchLeaderboard();
        this.loadWrongQuestions();
    },
    watch: {
        wrongIds: {
            handler() {
                console.log('GameResults: wrongIds prop 改變，重新載入錯題');
                this.loadWrongQuestions();
            },
            immediate: true
        }
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
/** @type {__VLS_StyleScopedClasses['wrong-section']} */ ;
/** @type {__VLS_StyleScopedClasses['wrong-item']} */ ;
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
if (__VLS_ctx.wrongAnswers.length) {
    // @ts-ignore
    [wrongAnswers,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "wrong-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.wrongAnswers))) {
        // @ts-ignore
        [wrongAnswers,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (item.id),
            ...{ class: "wrong-item" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "question-title" },
        });
        (index + 1);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "question-content" },
        });
        (item.content);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "question-explanation" },
        });
        (item.explanation);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "perfect-text" },
    });
}
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
/** @type {__VLS_StyleScopedClasses['wrong-section']} */ ;
/** @type {__VLS_StyleScopedClasses['wrong-item']} */ ;
/** @type {__VLS_StyleScopedClasses['question-title']} */ ;
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['question-explanation']} */ ;
/** @type {__VLS_StyleScopedClasses['perfect-text']} */ ;
/** @type {__VLS_StyleScopedClasses['leaderboard']} */ ;
/** @type {__VLS_StyleScopedClasses['rank']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['score']} */ ;
/** @type {__VLS_StyleScopedClasses['restart']} */ ;
/** @type {__VLS_StyleScopedClasses['hacker-grid']} */ ;
export default {};
//# sourceMappingURL=GameResults.vue.js.map