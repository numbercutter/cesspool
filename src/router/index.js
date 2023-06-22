// src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Staking from '../views/staking.vue' // Import your Staking component
import authGuard from '../api/authGuard'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/staking',
    name: 'Staking',
    component: Staking,
    beforeEnter: authGuard // Protect this route with authGuard
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
