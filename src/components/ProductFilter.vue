<template>
  <div class="filter-bar">
    <select :value="category" @change="$emit('update:category', $event.target.value)">
      <option value="">全部品类</option>
      <option value="apple">苹果</option>
      <option value="orange">橙子</option>
      <option value="banana" v-if="mode==='enterprise'">香蕉</option>
    </select>

    <select :value="origin" @change="$emit('update:origin', $event.target.value)">
      <option value="">全部产地</option>
      <option value="上海">上海</option>
      <option value="山东">山东</option>
      <option value="海南" v-if="mode==='enterprise'">海南</option>
    </select>

    <select :value="sort" @change="$emit('update:sort', $event.target.value)">
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
.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}
</style>
