<template>
  <div class="pagination">
    <button :disabled="page===1" @click="prevPage">上一页</button>
    <span>{{ page }} / {{ totalPages }}</span>
    <button :disabled="page===totalPages" @click="nextPage">下一页</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 定义 props
const props = defineProps({
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 8 },
  modelValue: { type: Number, default: 1 }
})

// 定义 emit
const emit = defineEmits(['update:modelValue'])

// 当前页
const page = ref(props.modelValue)

// 计算总页数
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 监听 page 变化并同步到 v-model
watch(page, val => {
  emit('update:modelValue', val)
})

// 上一页 / 下一页
const prevPage = () => {
  if (page.value > 1) page.value--
}
const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
button:disabled { cursor: not-allowed; opacity: 0.5; }
</style>
