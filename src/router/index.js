import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Trace from '../views/Trace.vue'
import Product from '../views/Product.vue'
import Science from '../views/Science.vue'
import Supply from '../views/Supply.vue' 
import About from '../views/About.vue' 
import ProductDetail from '../views/ProductDetail.vue'
import OriginDetail from '../views/OriginDetail.vue'
import ProductWaterfall from '../components/home/ProductWaterfall.vue'
// 导入品类页面
import CategoriesPage from '../views/categories/CategoriesPage.vue'
import CategoryDetail from '../views/categories/CategoryDetail.vue'

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
  },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/origin/:name', name: 'OriginDetail', component: OriginDetail } ,
  { path: '/product-waterfall', component: ProductWaterfall },
  // 品类路由
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesPage,
    meta: { title: '品类数据库' }
  },
  {
    path: '/category/:id',
    name: 'CategoryDetail',
    component: CategoryDetail,
    props: true,
    meta: { title: '品类详情' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
