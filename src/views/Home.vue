<template>
  <div class="home">
    <!-- 顶部轮播 -->
    <el-carousel height="300px">
      <el-carousel-item v-for="item in banners" :key="item">
        <div class="banner">{{ item }}</div>
      </el-carousel-item>
    </el-carousel>

    <!-- 项目简介 -->
    <section class="intro">
      <h2>安全水果 · 助力乡村振兴</h2>
      <p>
        聚焦奉贤区高品质水果，公开农残检测信息，
        让消费者吃得放心，帮助合作社增收。
      </p>
    </section>

    <!-- 水果列表 -->
    <el-row :gutter="20">
      <el-col
        v-for="fruit in fruits"
        :key="fruit.id"
        :span="6"
      >
        <el-card shadow="hover">
          <h3>{{ fruit.name }}</h3>

          <el-tag type="success" style="margin-bottom: 8px">
            农残合格
          </el-tag>

          <p>￥{{ fruit.price }}/kg</p>

          <!-- 按钮区 -->
          <div class="btn-group">
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/fruit/${fruit.id}`)"
            >
              查看详情
            </el-button>

            <el-button
              type="success"
              size="small"
              plain
              @click="$router.push(`/coop/${fruit.coopId}`)"
            >
              合作社介绍
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const banners = ref([
  '奉贤优质水果直供',
  '农残检测透明公示',
  '每一单都是助农'
])

const fruits = ref([
  {
    id: 1,
    name: '奉贤水蜜桃',
    price: 12.8,
    coopId: 1
  },
  {
    id: 2,
    name: '有机火龙果',
    price: 15.5,
    coopId: 2
  }
])
</script>

<style scoped>
.home {
  padding: 20px;
}

.banner {
  height: 300px;
  background: linear-gradient(135deg, #67c23a, #409eff);
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro {
  margin: 30px 0;
  text-align: center;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
