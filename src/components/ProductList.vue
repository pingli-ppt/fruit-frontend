<template>
  <section class="product-list">
    <ProductCard
      v-for="item in products"
      :key="item.id"
      :product="item"
    />
  </section>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

const products = [
  { id: 1, name: '苹果', origin: '山东', specs: '1kg/袋', cert: '绿色认证', image: 'https://via.placeholder.com/150' },
  { id: 2, name: '橙子', origin: '四川', specs: '2kg/袋', cert: '有机认证', image: 'https://via.placeholder.com/150' },
  { id: 3, name: '香蕉', origin: '云南', specs: '1.5kg/袋', cert: '绿色认证', image: 'https://via.placeholder.com/150' },
  { id: 4, name: '草莓', origin: '江苏', specs: '500g/盒', cert: '溯源认证', image: 'https://via.placeholder.com/150' }
]
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>
