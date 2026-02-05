<template>
  <div class="about-page">
    <h1>关于果数说</h1>

    <p class="intro">
      果数说致力于通过数据、检测与溯源体系，建立农产品质量信任机制。
    </p>

    <section>
      <h2>我们在做什么</h2>
      <ul>
        <li>农产品质检与溯源信息集成</li>
        <li>合作社与产地信息透明化</li>
        <li>为消费者提供可信决策依据</li>
      </ul>
    </section>

    <section>
      <h2>我们的理念</h2>
      <p>
        用数据说话，让好农产品被看见。
      </p>
    </section>
  </div>
</template>

<script setup>
// 组件的逻辑部分（目前无额外逻辑，可留空）
</script>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.8;
}

.about-page h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.about-page .intro {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 3rem;
  text-align: center;
}

.about-page section {
  margin-bottom: 3rem;
}

.about-page h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  border-left: 4px solid #4caf50;
  padding-left: 10px;
}

.about-page ul {
  list-style: disc;
  padding-left: 20px;
  color: #4a5568;
}

.about-page p {
  color: #4a5568;
}
</style>