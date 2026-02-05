<!-- src/views/Supply.vue -->
<template>
  <MainLayout>
    <div class="supply-page">
        <!-- 供给端页面的基础内容，后续可自定义 -->
        <h1>供给端页面</h1>
        <p>这是点击「供给端」按钮跳转到的页面</p>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '../layouts/MainLayout.vue'
</script>

<style scoped>
.supply-page {
  padding: 20px;
  text-align: center;
}

.supply-page h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>