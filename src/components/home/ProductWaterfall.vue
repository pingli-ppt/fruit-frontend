<template>
  <section class="products">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
    />
  </section>
</template>

<script setup>
import ProductCard from '../product/ProductCard.vue'

const products = [
  {
    id: 1,
    name: '红富士苹果',
    origin: '山东烟台',
    spec: '1kg/袋',
    tags: ['绿色', '可溯源']
  },
  {
    id: 2,
    name: '阳光玫瑰葡萄',
    origin: '新疆',
    spec: '500g/盒',
    tags: ['有机']
  }
]
</script>

<style scoped>
.products {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
