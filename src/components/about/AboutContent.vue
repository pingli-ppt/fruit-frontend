<template>
  <div class="about-page">
    <!-- 标题：绿色科技感（和 trace 页完全一致） -->
    <h1 class="page-title">
      <span>关于果数说</span>
    </h1>

    <!-- 介绍卡片 -->
    <div class="about-card">
      <p class="intro">
        果数说致力于通过数据、检测与溯源体系，建立农产品质量信任机制。
      </p>
    </div>

    <!-- 内容模块卡片 -->
    <div class="section-card">
      <h2 class="section-title">我们在做什么</h2>
      <ul class="feature-list">
        <li>农产品质检与溯源信息集成</li>
        <li>合作社与产地信息透明化</li>
        <li>为消费者提供可信决策依据</li>
      </ul>
    </div>

    <div class="section-card">
      <h2 class="section-title">我们的理念</h2>
      <p class="idea-text">
        用数据说话，让好农产品被看见。
      </p>
    </div>
  </div>
</template>

<script setup>
// 无逻辑
</script>

<style scoped>
/* 页面整体：和 trace 页完全统一的绿色渐变背景 */
.about-page {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px 40px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fff9, #f2fff7);
}

/* 主标题：科技渐变绿（一模一样） */
.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 36px;
  background: linear-gradient(90deg, #27ae60, #00b42a, #34d39e);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  position: relative;
}
.page-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  margin: 12px auto 0;
  background: linear-gradient(90deg, #27ae60, #34d39e);
  border-radius: 2px;
}

/* 卡片样式：统一绿色风格 */
.about-card,
.section-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 4px 18px rgba(39, 174, 96, 0.07);
  border: 1px solid rgba(39, 174, 96, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 24px;
}
.section-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(39, 174, 96, 0.12);
}

/* 介绍文字 */
.intro {
  font-size: 16px;
  color: #555;
  text-align: center;
  line-height: 1.8;
  margin: 0;
}

/* 二级标题 */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin: 0 0 16px;
  padding-left: 12px;
  border-left: 4px solid #27ae60;
}

/* 列表样式 */
.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.feature-list li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: #555;
  line-height: 1.6;
}
.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
}

/* 理念文字 */
.idea-text {
  font-size: 16px;
  color: #333;
  line-height: 1.8;
  margin: 0;
  text-align: center;
  font-weight: 500;
}
</style>