"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var pinia_1 = require("pinia");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use((0, pinia_1.createPinia)());
app.use(router_1.default);
app.mount('#app');
import 'src/assets/global.css'

//  注意因為同時有js跟ts，所以全域 CSS 生效是要寫在 main.ts而不是 main.js

