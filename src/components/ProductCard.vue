<template>
  <div class="product-card">
    <h3 class="product-title" @click="goDetail">{{ product.name }}</h3>
    <p class="info">产地：{{ product.origin }}</p>
    <p v-if="mode==='consumer'" class="price">价格：￥{{ product.price }}</p>

    <div class="btn-group">
      <button class="btn trace-btn" @click="$emit('trace', product.batchCode)">
        查看溯源
      </button>

      <button v-if="mode==='consumer'" class="btn cart-btn">加入购物车</button>
      <button v-if="mode==='consumer'" class="btn buy-btn">立即购买</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  product: Object,
  mode: String
})

const goDetail = () => {
  router.push({ path: `/products/${props.product.id}` })
}
</script>

<style scoped>
/* 产品卡片：统一绿色科技风格 */
.product-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(39, 174, 96, 0.1);
  box-shadow: 0 4px 18px rgba(39, 174, 96, 0.07);
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12);
}

/* 产品标题：渐变绿色 */
.product-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  cursor: pointer;
}

/* 信息文字 */
.info,
.price {
  margin: 6px 0;
  font-size: 14px;
  color: #555;
}
.price {
  color: #27ae60;
  font-weight: 600;
}

/* 按钮组 */
.btn-group {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 按钮统一风格 */
.btn {
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* 溯源按钮 */
.trace-btn {
  background: linear-gradient(90deg, #27ae60, #34d39e);
  color: #fff;
}
.trace-btn:hover {
  background: linear-gradient(90deg, #219653, #27ae60);
  transform: translateY(-1px);
}

/* 购物车按钮 */
.cart-btn {
  background: rgba(39, 174, 96, 0.08);
  color: #27ae60;
}
.cart-btn:hover {
  background: rgba(39, 174, 96, 0.15);
}

/* 立即购买按钮 */
.buy-btn {
  background: #fa8900;
  color: #fff;
}
.buy-btn:hover {
  background: #e87e00;
}
</style>