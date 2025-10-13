import { createRouter, createWebHistory } from 'vue-router';
const routes = [
// 這裡放你的頁面路由
// { path: '/', component: () => import('../views/Home.vue') }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});
export default router;
//# sourceMappingURL=index.js.map