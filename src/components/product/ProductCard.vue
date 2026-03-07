<template>
  <div class="product-card">
    <!-- 产品标题 -->
    <h3 class="product-name">{{ product.name }}</h3>

    <!-- 产品信息 -->
    <p class="info">产地：{{ product.origin }}</p>
    <p class="info">规格：{{ product.specs }}</p>

    <!-- 价格 -->
    <p class="price" v-if="product.price">¥{{ product.price.toFixed(2) }}</p>

    <!-- 标签组（有机/绿色/可溯源） -->
    <div class="tags" v-if="product.tags && product.tags.length">
      <span class="tag" v-for="tag in product.tags" :key="tag">{{ tag }}</span>
    </div>

    <!-- 按钮组 -->
    <div class="btn-group">
      <button class="btn primary" @click="$router.push(`/product/${product.id}`)">
        查看详情
      </button>
      <button
        class="btn trace-btn"
        v-if="product.batchCode"
        @click="$router.push(`/trace?code=${product.batchCode}`)"
      >
        查看溯源
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>

<style scoped>
/* 主卡片：统一绿色科技风格 */
.product-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(39, 174, 96, 0.12);
  box-shadow: 0 4px 20px rgba(39, 174, 96, 0.06);
  transition: all 0.3s ease;
  text-align: center;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(39, 174, 96, 0.12);
  border-color: rgba(39, 174, 96, 0.2);
}

/* 产品名称：渐变绿色 */
.product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
}

/* 信息文字 */
.info {
  font-size: 14px;
  color: #555;
  margin: 4px 0;
}

/* 价格样式（绿色高亮） */
.price {
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
  margin: 10px 0;
}

/* 标签组 */
.tags {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 10px 0;
  flex-wrap: wrap;
}
.tag {
  padding: 4px 8px;
  background: rgba(39, 174, 96, 0.08);
  color: #27ae60;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 按钮组 */
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

/* 按钮通用 */
.btn {
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* 主按钮：渐变绿 */
.btn.primary {
  background: linear-gradient(90deg, #27ae60, #34d39e);
  color: #fff;
}
.btn.primary:hover {
  background: linear-gradient(90deg, #219653, #27ae60);
  transform: translateY(-1px);
}

/* 溯源按钮 */
.btn.trace-btn {
  background: rgba(39, 174, 96, 0.08);
  color: #27ae60;
}
.btn.trace-btn:hover {
  background: rgba(39, 174, 96, 0.15);
}
</style>