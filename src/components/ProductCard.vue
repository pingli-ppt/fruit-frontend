<template>
  <div class="card">
    <h3 @click="goDetail">{{ product.name }}</h3>
    <p>产地：{{ product.origin }}</p>
    <p v-if="mode==='consumer'">价格：￥{{ product.price }}</p>

    <button @click="$emit('trace', product.batchCode)">
      查看溯源
    </button>

    <button v-if="mode==='consumer'">加入购物车</button>
    <button v-if="mode==='consumer'">立即购买</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  product: Object,
  mode: String
})

const router = useRouter()

const goDetail = () => {
  router.push({ path: `/products/${props.product.id}` })
}
</script>


<style scoped>
.card {
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;
}
button {
  margin-top: 10px;
  margin-right: 5px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
}
button:hover { background: #45a049; }
</style>
