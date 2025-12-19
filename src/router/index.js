import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home.vue'
import FruitDetail from '../views/FruitDetail.vue'
import Coop from '../views/Coop.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/fruit/:id', component: FruitDetail },
    { path: '/coop/:id', component: Coop }
  ]
})

export default router
