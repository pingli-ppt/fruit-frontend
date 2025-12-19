<template>
  <div class="coop">
    <el-card>
      <h2>{{ coop.name }}</h2>

      <p><strong>所在地区：</strong>{{ coop.location }}</p>
      <p><strong>主营产品：</strong>{{ coop.products }}</p>
      <p><strong>合作农户：</strong>{{ coop.farmers }} 户</p>

      <el-divider />

      <h3>助农成效</h3>
      <ul>
        <li>年销售额：{{ coop.sales }} 万元</li>
        <li>农户收入提升：{{ coop.income }}%</li>
        <li>农残检测合格率：{{ coop.passRate }}%</li>
      </ul>

      <el-button type="primary" @click="$router.back()">
        返回首页
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const coopMap = {
  1: {
    name: '奉贤绿源果蔬合作社',
    location: '上海市奉贤区',
    products: '水蜜桃、梨、葡萄',
    farmers: 42,
    sales: 320,
    income: 28,
    passRate: 99.2
  },
  2: {
    name: '奉贤田园果业合作社',
    location: '上海市奉贤区',
    products: '火龙果、草莓',
    farmers: 36,
    sales: 260,
    income: 22,
    passRate: 98.7
  }
}

const coop = computed(() => {
  return coopMap[route.params.id]
})
</script>

<style scoped>
.coop {
  padding: 30px;
}
</style>
