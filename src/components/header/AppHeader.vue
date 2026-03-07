<template>
  <header class="header">
    <div class="left">
      <div class="logo-box">
        <img src="/logo.png" alt="果数说" class="logo-img" />
        <span class="logo-text">果数说</span>
      </div>

      <!-- 导航菜单 -->
      <nav>
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/categories" class="nav-link" active-class="active">品类数据库</router-link>
        <router-link to="/trace" class="nav-link" active-class="active">质检溯源</router-link>
        <router-link to="/science" class="nav-link" active-class="active">科普内容</router-link>
        <router-link to="/about" class="nav-link" active-class="active">关于我们</router-link>
      </nav>
    </div>

    <div class="right">
      <input placeholder="搜索产品 / 批次 / 产地" class="search-input" />
      <button class="mode-btn primary">消费端</button>
      <button class="mode-btn ghost" @click="goToSupplyPage">供给端</button>
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
/* 导航栏整体 */
.header {
  height: 70px;
  display: flex;
  justify-content: space-between;
  padding: 0 36px;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid rgba(39, 174, 96, 0.15);
  box-shadow: 0 2px 15px rgba(39, 174, 96, 0.06);
  position: sticky;
  top: 0;
  z-index: 999;
}

/* ======== 左侧 Logo 区域 ======== */
.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Logo 容器：图片 + 文字 */
.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* Logo 图片（你可以放自己的 logo） */
.logo-img {
  width: 70px;    /* 从 36px 改成 48px —— 更大 */
  height: 70px;   /* 同步放大 */
  object-fit: contain;
  border-radius: 6px;
}

/* 文字 LOGO */
.logo-text {
  font-weight: 700;
  font-size: 25px;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 0.6px;
}

/* ======== 导航菜单 ======== */
nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  padding: 10px 14px;
  text-decoration: none;
  color: #444;
  font-size: 15px;
  border-radius: 10px;
  transition: all 0.26s ease;
}

.nav-link:hover {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.08);
}

/* 选中态：渐变绿色按钮 */
.nav-link.active {
  color: #fff !important;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.2);
}

/* ======== 右侧：搜索 + 模式切换 ======== */
.right {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* 搜索框 */
.search-input {
  width: 190px;
  padding: 10px 15px;
  border: 1px solid rgba(39, 174, 96, 0.22);
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  transition: all 0.24s ease;
}
.search-input:focus {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

/* 模式按钮 */
.mode-btn {
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.24s ease;
  border: none;
}

/* 主按钮 */
.mode-btn.primary {
  background: linear-gradient(90deg, #27ae60, #34d39e);
  color: #fff;
}
.mode-btn.primary:hover {
  background: linear-gradient(90deg, #219653, #27ae60);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(39, 174, 96, 0.2);
}

/* 次要按钮 */
.mode-btn.ghost {
  background: rgba(39, 174, 96, 0.09);
  color: #27ae60;
}
.mode-btn.ghost:hover {
  background: rgba(39, 174, 96, 0.16);
  transform: translateY(-1px);
}
</style>