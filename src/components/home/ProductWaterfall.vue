<template>
  <section class="products-wrapper">
    <div class="products-container">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :mode="mode"
        @trace="handleTrace"
      />
    </div>
  </section>
</template>

<script setup>
import ProductCard from '../product/ProductCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = [
  {
    id: 1,
    name: '奉贤黄桃',
    origin: '上海奉贤区',
    specs: '1kg/袋',
    tags: ['绿色', '可溯源'],
    price: 19.9,
    batchCode: 'PC202509001',
    image: '/grape.jpg'  
  },
  {
    id: 2,
    name: '奉贤葡萄',
    origin: '上海奉贤区',
    specs: '500g/盒',
    tags: ['有机'],
    price: 39.9,
    batchCode: 'PC202509002',
    image: '/grape.jpg'  
  }
]

// 模式：消费端/企业端
const mode = 'consumer'

// 查看溯源
const handleTrace = (batchCode) => {
  router.push(`/trace?code=${batchCode}`)
}
</script>

<style scoped>
/* 外层包裹：统一页面背景、留白、质感 */
.products-wrapper {
  width: 100%;
  padding: 50px 20px;
  background: linear-gradient(to bottom, #f8fff9, #f2fff7);
  box-sizing: border-box;
}

/* 产品容器：居中、卡片风、精致阴影 */
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 28px;
}
</style>