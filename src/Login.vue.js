import { ref, onMounted, onUnmounted } from 'vue';
import { MessageSquare, Gamepad2, Mic } from 'lucide-vue-next';
import Quiz from './Quiz.vue';
import Animal from './Animal.vue';
// 明確宣告元件會發出的事件
const emit = defineEmits(['goToWelcome', 'startQuizOrGame', 'onQuizCompleted', 'openProfile', 'goToLogin', 'goToVoiceRecognition']);
// 定義 props
const props = defineProps({
    hasCompletedQuiz: { type: Boolean, default: false }
});
// Avatar 相關設定
let initialAvatar = '';
try {
    initialAvatar = new URL('../assets/Gemini_Generated_Image_001.png', import.meta.url).href;
}
catch (e) {
    initialAvatar = '';
}
let icons8Avatar = '';
try {
    icons8Avatar = new URL('../assets/icons8_app.svg', import.meta.url).href;
}
catch (e) {
    icons8Avatar = '';
}
let thumbAvatar = '';
try {
    thumbAvatar = new URL('../assets/thumbs/Gemini_Generated_Image_001.png', import.meta.url).href;
}
catch (e) {
    thumbAvatar = initialAvatar;
}
let localPerson = '';
try {
    localPerson = new URL('../assets/svg/person.svg', import.meta.url).href;
}
catch (e) {
    localPerson = '';
}
const avatarSrc = ref(localPerson || icons8Avatar || thumbAvatar || initialAvatar);
const useFallback = ref(false);
const onAvatarError = (e) => {
    avatarSrc.value = '';
};
// 3D 動畫相關
const canvasRef = ref(null);
const particles = ref([]);
const smsIcons = ref([]);
// Generate particles
for (let i = 0; i < 50; i++) {
    particles.value.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4
    });
}
// Generate SMS icons
for (let i = 0; i < 15; i++) {
    smsIcons.value.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 32,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10
    });
}
// 3D Wireframe Sphere Animation
let animationId = null;
onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas)
        return;
    const ctx = canvas.getContext('2d');
    const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    // Sphere parameters - 調整為滿版顯示
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.max(canvas.width, canvas.height) * 0.5; // 使用最大尺寸讓球體滿版
    const segments = 32;
    const rings = 16;
    // Generate sphere vertices
    const vertices = [];
    for (let i = 0; i <= rings; i++) {
        const theta = (i * Math.PI) / rings;
        for (let j = 0; j <= segments; j++) {
            const phi = (j * 2 * Math.PI) / segments;
            vertices.push({
                x: radius * Math.sin(theta) * Math.cos(phi),
                y: radius * Math.cos(theta),
                z: radius * Math.sin(theta) * Math.sin(phi)
            });
        }
    }
    let rotation = 0;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rotation += 0.003;
        // Rotate and project vertices
        const projected = vertices.map(v => {
            // Rotate around Y axis
            const x = v.x * Math.cos(rotation) - v.z * Math.sin(rotation);
            const z = v.x * Math.sin(rotation) + v.z * Math.cos(rotation);
            const y = v.y;
            // Simple perspective projection
            const scale = 300 / (300 + z);
            return {
                x: centerX + x * scale,
                y: centerY + y * scale,
                z: z
            };
        });
        // Draw triangular mesh
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < rings; i++) {
            for (let j = 0; j < segments; j++) {
                const idx1 = i * (segments + 1) + j;
                const idx2 = idx1 + 1;
                const idx3 = (i + 1) * (segments + 1) + j;
                const idx4 = idx3 + 1;
                // Draw lines
                ctx.beginPath();
                ctx.moveTo(projected[idx1].x, projected[idx1].y);
                ctx.lineTo(projected[idx2].x, projected[idx2].y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(projected[idx1].x, projected[idx1].y);
                ctx.lineTo(projected[idx3].x, projected[idx3].y);
                ctx.stroke();
                // Draw diagonal for triangular mesh
                ctx.beginPath();
                ctx.moveTo(projected[idx1].x, projected[idx1].y);
                ctx.lineTo(projected[idx4].x, projected[idx4].y);
                ctx.stroke();
            }
        }
        // Draw vertices as dots
        ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
        projected.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        animationId = requestAnimationFrame(animate);
    };
    animate();
    // Handle resize
    const handleResize = () => {
        updateCanvasSize();
    };
    window.addEventListener('resize', handleResize);
    onUnmounted(() => {
        if (animationId)
            cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    });
});
// 這邊跟Quiz.vue有關係的程式碼:
const state = ref('login'); // 改為 'login'，表示主畫面狀態
const result = ref(null);
// 處理遊戲開始按鈕
function handleGameStart() {
    if (props.hasCompletedQuiz) {
        // 如果已經完成過測驗，直接進入遊戲
        emit('goToWelcome');
    }
    else {
        // 如果還沒完成測驗，先顯示測驗
        state.value = 'quiz';
    }
}
function onResultReady(payload) {
    console.log('Login.vue收到Quiz結果:', payload); // 調試用
    result.value = payload;
    state.value = 'result';
}
function toWelcome() {
    // 從 Animal 頁面的「準備遊戲挑戰」按鈕呼叫
    emit('onQuizCompleted'); // 通知父組件測驗已完成
    emit('goToWelcome'); // 進入 WelcomeScreen
}
function restart() {
    state.value = 'quiz';
    result.value = null;
}
function cancelQuiz() {
    // 從 Quiz 取消回到主畫面
    state.value = 'login';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['avatar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-float-particle']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-float-sms']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative min-h-screen w-full overflow-hidden bg-black text-white" },
});
if (__VLS_ctx.state === 'login') {
    // @ts-ignore
    [state,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.canvas, __VLS_elements.canvas)({
        ref: "canvasRef",
        ...{ class: "absolute inset-0 w-full h-full z-0" },
    });
    /** @type {typeof __VLS_ctx.canvasRef} */ ;
    // @ts-ignore
    [canvasRef,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "absolute inset-0 z-0" },
    });
    for (const [particle, i] of __VLS_getVForSourceType((__VLS_ctx.particles))) {
        // @ts-ignore
        [particles,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: ('particle-' + i),
            ...{ style: ({
                    left: particle.x + '%',
                    top: particle.y + '%',
                    animationDelay: particle.delay + 's',
                    animationDuration: particle.duration + 's'
                }) },
            ...{ class: "absolute w-2 h-2 bg-cyan-400 rounded-full animate-float-particle opacity-60" },
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "absolute inset-0 z-0" },
    });
    for (const [sms, i] of __VLS_getVForSourceType((__VLS_ctx.smsIcons))) {
        // @ts-ignore
        [smsIcons,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: ('sms-' + i),
            ...{ style: ({
                    left: sms.x + '%',
                    top: sms.y + '%',
                    animationDelay: sms.delay + 's',
                    animationDuration: sms.duration + 's'
                }) },
            ...{ class: "absolute animate-float-sms opacity-40" },
        });
        const __VLS_0 = {}.MessageSquare;
        /** @type {[typeof __VLS_components.MessageSquare, ]} */ ;
        // @ts-ignore
        MessageSquare;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            size: (sms.size),
            color: "#ffffff",
            strokeWidth: (1.5),
        }));
        const __VLS_2 = __VLS_1({
            size: (sms.size),
            color: "#ffffff",
            strokeWidth: (1.5),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "absolute top-6 right-8 z-20" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.state === 'login'))
                    return;
                __VLS_ctx.$emit('openProfile');
                // @ts-ignore
                [$emit,];
            } },
        'aria-label': "開啟使用者設定",
        ...{ class: "avatar-btn btn btn-sm btn-style-1 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-cyan-400 focus:outline-none" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "avatar-inner" },
    });
    if (!__VLS_ctx.useFallback && __VLS_ctx.avatarSrc) {
        // @ts-ignore
        [useFallback, avatarSrc,];
        __VLS_asFunctionalElement(__VLS_elements.img)({
            ...{ onError: (__VLS_ctx.onAvatarError) },
            src: (__VLS_ctx.avatarSrc),
            alt: "avatar",
            ...{ class: "avatar-img" },
        });
        // @ts-ignore
        [avatarSrc, onAvatarError,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "avatar-frame" },
            'aria-hidden': "true",
        });
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "avatar-img-svg" },
            viewBox: "0 0 1314 1024",
            xmlns: "http://www.w3.org/2000/svg",
            role: "img",
        });
        __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
            d: "M503.315257 277.467529m-277.467528 0a277.467529 277.467529 0 1 0 554.935057 0 277.467529 277.467529 0 1 0-554.935057 0Z",
            fill: "#13227a",
        });
        __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
            d: "M679.675502 662.61698H326.955013A327.887901 327.887901 0 0 0 0 989.571993a34.516854 34.516854 0 0 0 34.428007 34.428007h937.818924a34.516854 34.516854 0 0 0 34.428007-34.428007 327.887901 327.887901 0 0 0-326.999436-326.955013zM771.142944 463.512039a204.835539 204.835539 0 1 0 49.754024-275.42406 310.074183 310.074183 0 0 1-49.754024 275.42406z",
            fill: "#13227a",
        });
        __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
            d: "M1073.531908 633.65303H812.945208c-6.752332 0-13.326971 0.355386-20.079302 0.888465a363.648605 363.648605 0 0 1 259.520541 265.873064h236.997961A25.498937 25.498937 0 0 0 1314.927769 875.137738a242.106633 242.106633 0 0 0-241.395861-241.484708z",
            fill: "#13227a",
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "text-center space-y-6" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
        ...{ class: "text-4xl md:text-6xl font-bold text-cyan-400 mb-2" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "text-3xl md:text-5xl font-normal text-cyan-400 mb-2" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-lg md:text-2xl text-gray-400 mb-8" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex flex-col sm:flex-row gap-4 justify-center items-center mt-12" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.state === 'login'))
                    return;
                __VLS_ctx.$emit('goToLogin');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white text-base rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] shadow-lg hover:shadow-cyan-500/50" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleGameStart) },
        ...{ class: "group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white text-base rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] shadow-lg hover:shadow-purple-600/50 flex items-center justify-center gap-2" },
    });
    // @ts-ignore
    [handleGameStart,];
    const __VLS_5 = {}.Gamepad2;
    /** @type {[typeof __VLS_components.Gamepad2, ]} */ ;
    // @ts-ignore
    Gamepad2;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        size: (20),
    }));
    const __VLS_7 = __VLS_6({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.state === 'login'))
                    return;
                __VLS_ctx.$emit('goToVoiceRecognition');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] shadow-lg hover:shadow-blue-600/50 flex items-center justify-center gap-2" },
    });
    const __VLS_10 = {}.Mic;
    /** @type {[typeof __VLS_components.Mic, ]} */ ;
    // @ts-ignore
    Mic;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        size: (20),
    }));
    const __VLS_12 = __VLS_11({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "absolute bottom-8 left-0 right-0 z-20" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex justify-center gap-12 text-gray-400 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.state === 'login'))
                    return;
                __VLS_ctx.$emit('goToLogin');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "hover:text-cyan-400 transition-colors" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.state === 'login'))
                    return;
                __VLS_ctx.$emit('openProfile');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "hover:text-cyan-400 transition-colors" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.state === 'login'))
                    return;
                __VLS_ctx.$emit('goToVoiceRecognition');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "hover:text-cyan-400 transition-colors" },
    });
}
if (__VLS_ctx.state === 'quiz') {
    // @ts-ignore
    [state,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    /** @type {[typeof Quiz, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(Quiz, new Quiz({
        ...{ 'onResultReady': {} },
        ...{ 'onCancel': {} },
        currentUser: ('guest'),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onResultReady': {} },
        ...{ 'onCancel': {} },
        currentUser: ('guest'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = ({ resultReady: {} },
        { onResultReady: (__VLS_ctx.onResultReady) });
    const __VLS_21 = ({ cancel: {} },
        { onCancel: (__VLS_ctx.cancelQuiz) });
    // @ts-ignore
    [onResultReady, cancelQuiz,];
    var __VLS_17;
}
if (__VLS_ctx.state === 'result') {
    // @ts-ignore
    [state,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    /** @type {[typeof Animal, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(Animal, new Animal({
        ...{ 'onBackToWelcome': {} },
        ...{ 'onRetry': {} },
        resultObject: (__VLS_ctx.result),
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onBackToWelcome': {} },
        ...{ 'onRetry': {} },
        resultObject: (__VLS_ctx.result),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = ({ backToWelcome: {} },
        { onBackToWelcome: (__VLS_ctx.toWelcome) });
    const __VLS_29 = ({ retry: {} },
        { onRetry: (__VLS_ctx.restart) });
    // @ts-ignore
    [result, toWelcome, restart,];
    var __VLS_25;
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-float-particle']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-float-sms']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-6']} */ ;
/** @type {__VLS_StyleScopedClasses['right-8']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-style-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-img']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-frame']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-img-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['text-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-cyan-500/50']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-purple-600/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-blue-600/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-8']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => ({
        ...props,
        ...{},
        ...{},
    }),
});
export default {};
//# sourceMappingURL=Login.vue.js.map