import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Trace from '../views/Trace.vue'
import Product from '../views/Product.vue'
import Science from '../views/Science.vue'
import Supply from '../views/Supply.vue' 
import About from '../views/About.vue' 

const routes = [
  { path: '/', component: Home },
  { path: '/product', component: Product },
  { path: '/trace', component: Trace },
  { path: '/science', component: Science },
  {
    path: '/supply', // 供给端页面的路由路径
    name: 'Supply',
    component: Supply // 对应供给端页面组件
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
