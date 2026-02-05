<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- 路由挂载点：Home.vue 会在这里显示 -->
    <router-view />
  </div>
</template>

<script setup>
// 根组件无需额外引入 Home.vue，路由会自动处理
</script>
