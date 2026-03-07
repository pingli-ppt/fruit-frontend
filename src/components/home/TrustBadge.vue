<template>
  <!-- 外层：全屏绿色背景 -->
  <section class="trust-wrapper">
    <!-- 内层：居中布局 1200px -->
    <div class="trust">
      <div class="item" v-for="t in trusts" :key="t.title">
        <div class="icon">{{ t.icon }}</div>
        <p class="title">{{ t.title }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const trusts = [
  { icon: '🧪', title: '农残检测合格' },
  { icon: '📄', title: '权威认证' },
  { icon: '🔍', title: '批次可追溯' },
  { icon: '🚚', title: '冷链运输' }
]
</script>

<style scoped>
/* 外层：全屏背景 + 铺满左右 */
.trust-wrapper {
  width: 100%;
  background: linear-gradient(to bottom, #f8fff9, #f2fff7);
  padding: 40px 20px;
  box-sizing: border-box;
}

/* 内层：居中 + 网格布局 */
.trust {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

/* 信任项：卡片样式不变 */
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 16px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(39, 174, 96, 0.1);
  box-shadow: 0 4px 18px rgba(39, 174, 96, 0.07);
  transition: all 0.3s ease;
}

.item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12);
}

.icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
</style>