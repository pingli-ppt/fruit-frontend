<template>
  <MainLayout>
    <div class="origin-detail">
      <h1>{{ origin.name }} 产地概况</h1>

      <!-- 地图 -->
      <div class="map">
        <p>地图放大效果区域（可用第三方地图组件）</p>
      </div>

      <!-- 基础信息 -->
      <div class="basic-info">
        <p>地理/气候/种植面积：{{ origin.geo }}</p>
        <p>团队：{{ origin.team }}</p>
        <p>资质：{{ origin.certificates.join(', ') }}</p>
      </div>

      <!-- 产品列表 -->
      <div class="product-list">
        <h3>该产地产品</h3>
        <div class="products">
          <div v-for="p in origin.products" :key="p.id" class="card">
            <p>{{ p.name }}</p>
            <p>价格：￥{{ p.price }}</p>
            <router-link :to="`/products/${p.id}`">查看详情</router-link>
          </div>
        </div>
      </div>

      <!-- 透明化信息 -->
      <div class="transparency">
        <h3>农事/检测记录</h3>
        <p>农事记录摘要：{{ origin.farming }}</p>
        <p>检测记录摘要：{{ origin.testing }}</p>
        <p>直播/相册（可选）：{{ origin.media }}</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const route = useRoute()
const originName = route.params.name

// 假数据，后续可换成接口
const allOrigins = [
  {
    name: '奉贤区',
    geo: '地处上海南部，气候温和，种植面积5000亩',
    team: '张三团队',
    certificates: ['绿色食品认证', '质检报告'],
    farming: '每日记录浇水施肥情况',
    testing: '定期抽检，保证品质',
    media: '直播/相册链接',
    products: [
      { id: 1, name: '红富士苹果', price: 8 },
      { id: 2, name: '赣南脐橙', price: 6 }
    ]
  }
]

const origin = allOrigins.find(o => o.name === originName)
</script>

<style scoped>
.origin-detail {
  max-width: 1000px;
  margin: 30px auto;
}
.map {
  height: 300px;
  background: #eee;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.products {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
}
</style>
