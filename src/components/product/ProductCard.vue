<template>
  <div class="product-card">
    <img :src="product.image" alt="product" />
    <h3>{{ product.name }}</h3>
    <p>产地：{{ product.origin }}</p>
    <p>规格：{{ product.specs }}</p>
    <p class="badge">{{ product.cert }}</p>
    <button @click="$router.push(`/product/${product.id}`)" class="detail-btn">
      查看详情
    </button>
    <button>加入购物车</button>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}
.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}
.product-card h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}
.product-card .badge {
  background-color: #c8e6c9;
  border-radius: 4px;
  display: inline-block;
  padding: 2px 6px;
  margin: 5px 0;
}
.product-card button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.product-card button:hover {
  background-color: #45a049;
}
</style>
