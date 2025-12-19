<template>
  <div class="detail">
    <el-card>
      <h2>{{ fruit.name }}</h2>

      <el-tag type="success" size="large" style="margin-bottom: 12px">
        农残检测合格
      </el-tag>

      <el-divider />

      <!-- 农残检测信息 -->
      <el-descriptions
        title="农残检测报告"
        :column="2"
        border
      >
        <el-descriptions-item label="检测机构">
          奉贤农产品检测中心
        </el-descriptions-item>
        <el-descriptions-item label="检测日期">
          2025-11-20
        </el-descriptions-item>
        <el-descriptions-item label="农残指数">
          {{ fruit.residue }}
        </el-descriptions-item>
        <el-descriptions-item label="国家标准">
          ≤ 1.0
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <!-- 溯源时间轴 -->
      <h3>种植与流通溯源</h3>
      <el-timeline>
        <el-timeline-item
          v-for="item in timeline"
          :key="item.time"
          :timestamp="item.time"
          placement="top"
        >
          {{ item.event }}
        </el-timeline-item>
      </el-timeline>

      <el-divider />

      <el-button
        type="primary"
        size="large"
        @click="addToCart"
      >
        助农购买 ￥{{ fruit.price }}/kg
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../store/cart'

const route = useRoute()
const cartStore = useCartStore()

const fruit = ref({
  id: route.params.id,
  name: '奉贤水蜜桃',
  price: 12.8,
  residue: 0.32
})

const timeline = ref([
  { time: '2025-03', event: '合作社有机种植' },
  { time: '2025-06', event: '人工除草，未使用高毒农药' },
  { time: '2025-09', event: '成熟采摘' },
  { time: '2025-11', event: '农残检测合格' },
  { time: '2025-12', event: '平台直供销售' }
])

function addToCart() {
  cartStore.addItem(fruit.value)
}
</script>

<style scoped>
.detail {
  padding: 30px;
}
</style>
