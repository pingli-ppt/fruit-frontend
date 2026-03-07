<template>
  <div class="filter-bar">
    <select
      :value="category"
      @change="$emit('update:category', $event.target.value)"
      class="select"
    >
      <option value="">全部品类</option>
      <option value="apple">苹果</option>
      <option value="orange">橙子</option>
      <option value="banana" v-if="mode==='enterprise'">香蕉</option>
    </select>

    <select
      :value="origin"
      @change="$emit('update:origin', $event.target.value)"
      class="select"
    >
      <option value="">全部产地</option>
      <option value="上海">上海</option>
      <option value="山东">山东</option>
      <option value="海南" v-if="mode==='enterprise'">海南</option>
    </select>

    <select
      :value="sort"
      @change="$emit('update:sort', $event.target.value)"
      class="select"
    >
      <option value="">默认排序</option>
      <option value="price">价格排序</option>
      <option value="time" v-if="mode==='consumer'">上架时间</option>
    </select>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  category: String,
  origin: String,
  sort: String,
  mode: String
})

const emit = defineEmits(['update:category','update:origin','update:sort'])
</script>

<style scoped>
/* 筛选栏布局 */
.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

/* 下拉框统一绿色科技风格 */
.select {
  padding: 10px 14px;
  border: 1px solid rgba(39, 174, 96, 0.2);
  border-radius: 12px;
  font-size: 14px;
  color: #333;
  background: #ffffff;
  outline: none;
  transition: all 0.3s ease;
  min-width: 140px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2327ae60' viewBox='0 0 16 16'%3E%3Cpath d='M8 11l4-4H4l4 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

/* 聚焦高亮 */
.select:focus {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

/* hover 效果 */
.select:hover {
  border-color: rgba(39, 174, 96, 0.4);
}
</style>