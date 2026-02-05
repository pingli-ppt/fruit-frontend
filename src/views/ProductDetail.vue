<template>
  <MainLayout>
    <div class="product-detail">
      <h1>{{ product.name }}</h1>

      <!-- 主图轮播 -->
      <div class="carousel">
        <img v-for="(img, idx) in product.images" :key="idx" :src="img" />
      </div>

      <!-- 基本信息 -->
      <div class="basic-info">
        <p>产地：{{ product.origin }}</p>
        <p>规格：{{ product.spec }}</p>
        <p>保鲜/发货说明：{{ product.shipping }}</p>
        <p v-if="product.price">价格：￥{{ product.price }}</p>
        <p v-if="product.stock">库存：{{ product.stock }}</p>
      </div>

      <!-- 证书/检测/溯源 -->
      <div class="certificates">
        <h3>证书/检测信息</h3>
        <ul>
          <li v-for="cert in product.certificates" :key="cert">{{ cert }}</li>
        </ul>
        <button @click="goTrace">查看溯源</button>
      </div>

      <!-- 合作社故事 -->
      <div class="story">
        <h3>合作社介绍 & 种植故事</h3>
        <p>{{ product.story }}</p>
      </div>

      <!-- CTA 按钮 -->
      <div class="cta">
        <button>加入购物车</button>
        <button>立即购买</button>
      </div>

      <!-- 评价/问答（后续扩展） -->
      <div class="reviews">
        <h3>评论与问答（后续）</h3>
        <p>评论、常见问题、售后说明</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const route = useRoute()
const router = useRouter()

// 假数据（后续可通过接口获取）
const allProducts = [
  {
    id: 1,
    name: '红富士苹果',
    images: ['https://via.placeholder.com/300','https://via.placeholder.com/300'],
    origin: '山东',
    spec: '500g/袋',
    shipping: '冷链发货，48小时内送达',
    price: 8,
    stock: 100,
    certificates: ['绿色食品', '质检报告'],
    story: '合作社直供，采用天然肥料，口感脆甜。'
  },
  {
    id: 2,
    name: '赣南脐橙',
    images: ['https://via.placeholder.com/300','https://via.placeholder.com/300'],
    origin: '上海',
    spec: '1kg/袋',
    shipping: '常温快递，48小时内送达',
    price: 6,
    stock: 50,
    certificates: ['有机认证', '质检报告'],
    story: '精选果园，果肉多汁，适合送礼。'
  }
]

// 根据路由 ID 获取当前产品
const product = allProducts.find(p => p.id === parseInt(route.params.id))

const goTrace = () => {
  router.push({ path: '/trace', query: { code: product.batchCode || '' } })
}
</script>

<style scoped>
.product-detail {
  max-width: 900px;
  margin: 30px auto;
}

.carousel img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 10px;
}

.basic-info p, .certificates p, .story p {
  margin: 5px 0;
}

.certificates ul {
  list-style: disc;
  margin-left: 20px;
}

.cta button {
  margin-right: 10px;
  margin-top: 10px;
  padding: 8px 14px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cta button:hover {
  background: #45a049;
}
</style>
