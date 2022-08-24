import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSmoothScroll from 'vue3-smooth-scroll'
import { ethers } from "ethers";

createApp(App)
.use(store)
.use(ethers)
.use(VueSmoothScroll)
.use(router)
.mount('#app')
