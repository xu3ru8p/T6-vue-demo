import { ref, onMounted, watch } from "vue";
import { scamMessages } from "../database.js"; // 根目錄下
import { realMessages } from "../database_true.js"; // 根目錄下
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
    name: "GameBoard",
    props: {
        round: Number,
        score: Number,
        mode: { type: String, default: "normal" }
    },
    emits: ["next-round", "end-game"],
    setup(props, { emit }) {
        const gameMessages = ref([]);
        const selectedMessage = ref(null);
        const showResult = ref(false);
        const timeLeft = ref(20);
        let timer = null;
        const maxRounds = 30;
        const usedIds = ref(new Set());
        const startTimer = () => {
            clearInterval(timer);
            timeLeft.value = 20;
            timer = setInterval(() => {
                timeLeft.value--;
                if (timeLeft.value <= 0) {
                    clearInterval(timer);
                    emit("end-game");
                }
            }, 1000);
        };
        const getRandomItems = (arr, n) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, n);
        };
        const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());
        const availableTypes = Array.from(new Set([...scamMessages, ...realMessages].map((m) => m.type)));
        const initGame = () => {
            if (usedIds.value.size >= maxRounds * 3)
                return; // 遊戲結束
            // 隨機挑一個類型
            const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            // 篩掉已使用的訊息
            const scamsOfType = scamMessages.filter((m) => m.type === type && !usedIds.value.has(m.id));
            const realsOfType = realMessages.filter((m) => m.type === type && !usedIds.value.has(m.id));
            if (scamsOfType.length < 2 || realsOfType.length < 1) {
                return initGame(); // 該類型不足重新挑
            }
            const selectedScams = getRandomItems(scamsOfType, 2);
            const selectedReal = getRandomItems(realsOfType, 1);
            const roundMessages = shuffleArray([...selectedScams, ...selectedReal]);
            roundMessages.forEach((m) => usedIds.value.add(m.id));
            gameMessages.value = roundMessages;
            selectedMessage.value = null;
            showResult.value = false;
            if (props.mode === "challenge")
                startTimer();
            console.log("Round messages:", roundMessages);
        };
        const selectMessage = (msg) => {
            if (selectedMessage.value)
                return;
            selectedMessage.value = msg;
            showResult.value = true;
            const correct = !msg.isScam; // 正確答案判斷
            if (timer)
                clearInterval(timer);
            setTimeout(() => {
                emit("next-round", correct);
                initGame();
            }, 1200);
        };
        onMounted(() => {
            initGame();
        });
        watch(() => props.mode, () => initGame());
        return { gameMessages, selectedMessage, selectMessage, showResult, timeLeft };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: "GameBoard",
    props: {
        round: Number,
        score: Number,
        mode: { type: String, default: "normal" }
    },
    emits: ["next-round", "end-game"],
    setup(props, { emit }) {
        const gameMessages = ref([]);
        const selectedMessage = ref(null);
        const showResult = ref(false);
        const timeLeft = ref(20);
        let timer = null;
        const maxRounds = 30;
        const usedIds = ref(new Set());
        const startTimer = () => {
            clearInterval(timer);
            timeLeft.value = 20;
            timer = setInterval(() => {
                timeLeft.value--;
                if (timeLeft.value <= 0) {
                    clearInterval(timer);
                    emit("end-game");
                }
            }, 1000);
        };
        const getRandomItems = (arr, n) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, n);
        };
        const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());
        const availableTypes = Array.from(new Set([...scamMessages, ...realMessages].map((m) => m.type)));
        const initGame = () => {
            if (usedIds.value.size >= maxRounds * 3)
                return; // 遊戲結束
            // 隨機挑一個類型
            const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            // 篩掉已使用的訊息
            const scamsOfType = scamMessages.filter((m) => m.type === type && !usedIds.value.has(m.id));
            const realsOfType = realMessages.filter((m) => m.type === type && !usedIds.value.has(m.id));
            if (scamsOfType.length < 2 || realsOfType.length < 1) {
                return initGame(); // 該類型不足重新挑
            }
            const selectedScams = getRandomItems(scamsOfType, 2);
            const selectedReal = getRandomItems(realsOfType, 1);
            const roundMessages = shuffleArray([...selectedScams, ...selectedReal]);
            roundMessages.forEach((m) => usedIds.value.add(m.id));
            gameMessages.value = roundMessages;
            selectedMessage.value = null;
            showResult.value = false;
            if (props.mode === "challenge")
                startTimer();
            console.log("Round messages:", roundMessages);
        };
        const selectMessage = (msg) => {
            if (selectedMessage.value)
                return;
            selectedMessage.value = msg;
            showResult.value = true;
            const correct = !msg.isScam; // 正確答案判斷
            if (timer)
                clearInterval(timer);
            setTimeout(() => {
                emit("next-round", correct);
                initGame();
            }, 1200);
        };
        onMounted(() => {
            initGame();
        });
        watch(() => props.mode, () => initGame());
        return { gameMessages, selectedMessage, selectMessage, showResult, timeLeft };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "game-board" },
});
if (__VLS_ctx.mode === 'challenge') {
    // @ts-ignore
    [mode,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "timer" },
    });
    (__VLS_ctx.timeLeft);
    // @ts-ignore
    [timeLeft,];
}
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "cards" },
});
for (const [msg] of __VLS_getVForSourceType((__VLS_ctx.gameMessages))) {
    // @ts-ignore
    [gameMessages,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectMessage(msg);
                // @ts-ignore
                [selectMessage,];
            } },
        key: (msg.id),
        ...{ class: "card" },
        ...{ class: ({
                selected: __VLS_ctx.selectedMessage && __VLS_ctx.selectedMessage.id === msg.id,
                correct: __VLS_ctx.showResult && __VLS_ctx.selectedMessage?.id === msg.id && !msg.isScam,
                wrong: __VLS_ctx.showResult && __VLS_ctx.selectedMessage?.id === msg.id && msg.isScam
            }) },
    });
    // @ts-ignore
    [selectedMessage, selectedMessage, selectedMessage, selectedMessage, showResult, showResult,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "msg-sender" },
    });
    (msg.sender);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "msg-content" },
    });
    (msg.content);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hacker-grid" },
});
/** @type {__VLS_StyleScopedClasses['game-board']} */ ;
/** @type {__VLS_StyleScopedClasses['timer']} */ ;
/** @type {__VLS_StyleScopedClasses['cards']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['correct']} */ ;
/** @type {__VLS_StyleScopedClasses['wrong']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-sender']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hacker-grid']} */ ;
export default {};
//# sourceMappingURL=GameBoard.vue.js.map