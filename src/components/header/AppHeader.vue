<template>
  <header class="header">
    <div class="left">
      <span class="logo">果数说</span>
      <nav>
        <!-- 替换为 router-link，配置对应路由路径 -->
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <!-- 品类数据库链接 -->
        <router-link to="/categories" class="nav-link" active-class="active">
          品类数据库
        </router-link>
        <router-link to="/product" class="nav-link" active-class="active">产品与服务</router-link>
        <router-link to="/trace" class="nav-link" active-class="active">质检溯源</router-link>
        <router-link to="/science" class="nav-link" active-class="active">科普内容</router-link>
        <router-link to="/about" class="nav-link" active-class="active">关于我们</router-link>
      </nav>
    </div>

    <div class="right">
      <input placeholder="搜索产品 / 批次 / 产地" />
      <button class="mode">消费端</button>
      <button class="mode ghost" @click="goToSupplyPage">供给端</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSupplyPage = () => {
  router.push('/supply')
}
</script>

<style scoped>
.header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.logo {
  font-weight: bold;
  font-size: 18px;
  margin-right: 24px;
}
nav {
  display: flex;
  align-items: center;
}
/* 导航按钮基础样式（默认颜色） */
.nav-link {
  margin-right: 16px;
  cursor: pointer;
  text-decoration: none; /* 去掉a标签默认下划线 */
  color: #666; /* 基础颜色 */
  transition: color 0.2s; /* 颜色过渡更顺滑 */
}
/* 导航按钮 hover 效果 */
.nav-link:hover {
  color: #4caf50; /* hover 时先变主色 */
}
/* 激活态样式（跳转后颜色加深） */
.nav-link.active {
  color: #2e7d32; /* 比基础色/hover色更深的绿色 */
  font-weight: 600; /* 可选：激活后加粗，视觉更突出 */
}
.right {
  display: flex;
  gap: 10px;
  align-items: center; /* 新增：让输入框和按钮垂直居中 */
}
.right input {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}
.mode {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px; /* 新增：按钮圆角，和输入框统一 */
  cursor: pointer;
}
.ghost {
  background: #eee;
  color: #333;
}
/* 供给端按钮 hover 反馈 */
.ghost:hover {
  background: #e0e0e0;
}
</style>