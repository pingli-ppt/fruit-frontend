<template>
  <div class="category-stats">
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-number">{{ safeStats.totalCategories }}</div>
          <div class="stat-label">总品类数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-number">{{ safeStats.demoCooperatives }}</div>
          <div class="stat-label">示范合作社</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    default: null
  }
});

const safeStats = computed(() => {
  return props.stats || {
    totalCategories: 20,
    demoCooperatives: 5,
  };
});
</script>

<style scoped>
.category-stats {
  margin: 0 auto;
  max-width: 600px;
}

.stats-row {
  display: flex;
  justify-content: center;  /* 居中显示 */
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fff8 0%, #f0fff0 100%);
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.3s;
  flex: 1;  /* 两个卡片等宽 */
  max-width: 250px;  /* 限制每个卡片最大宽度 */
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.4);
}

.stat-icon {
  font-size: 36px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2c662d;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;  /* 手机上改为上下排列 */
    align-items: center;
  }
  
  .stat-card {
    width: 100%;
    max-width: 300px;
  }
}
</style>