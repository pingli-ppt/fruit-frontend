<template>
  <section class="hero">
    <h1 class="hero-title">让每一颗果子，都有数据可查</h1>
    <p class="hero-desc">检测 · 认证 · 溯源 · 冷链，让消费更安心</p>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* 首页横幅：统一绿色科技渐变 */
.hero {
  padding: 90px 20px;
  text-align: center;
  background: linear-gradient(120deg, #f8fff9, #f2fff7);
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* 主标题：渐变科技绿（和 trace.vue 完全统一） */
.hero-title {
  font-size: 38px;
  font-weight: 700;
  margin: 0 auto 20px;
  background: linear-gradient(90deg, #27ae60, #00b42a, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

/* 描述文字 */
.hero-desc {
  margin-top: 16px;
  font-size: 17px;
  color: #555;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>