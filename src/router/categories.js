import { createRouter, createWebHashHistory } from 'vue-router'

const CategoriesPage = () => import('../views/categories/CategoriesPage.vue')
const CategoryDetail = () => import('../views/categories/CategoryDetail.vue')

const routes = [
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesPage,
    meta: { title: '农产品品类库' }
  },
  {
    path: '/categories/:id',
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