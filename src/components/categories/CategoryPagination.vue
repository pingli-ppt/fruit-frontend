<template>
  <div class="category-pagination">
    <div class="pagination-info">
      显示 {{ startItem }} - {{ endItem }} 条，共 {{ totalItems }} 条
    </div>
    
    <div class="pagination-controls">
      <button
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        class="pagination-btn prev-btn"
      >
        &lt; 上一页
      </button>
      
      <div class="page-numbers">
        <!-- 第一页 -->
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          :class="['page-btn', { active: currentPage === 1 }]"
        >
          1
        </button>
        
        <!-- 省略号 -->
        <span v-if="showLeftEllipsis" class="ellipsis">...</span>
        
        <!-- 中间页码 -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        
        <!-- 省略号 -->
        <span v-if="showRightEllipsis" class="ellipsis">...</span>
        
        <!-- 最后一页 -->
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          :class="['page-btn', { active: currentPage === totalPages }]"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <button
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        class="pagination-btn next-btn"
      >
        下一页 &gt;
      </button>
    </div>
    
    <div class="page-size-selector">
      <span>每页显示：</span>
      <select v-model="localPageSize" @change="handlePageSizeChange" class="size-select">
        <option value="12">12条</option>
        <option value="24">24条</option>
        <option value="48">48条</option>
        <option value="96">96条</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 12
  }
})

const emit = defineEmits(['page-change'])

// 本地页面大小
const localPageSize = ref(props.itemsPerPage)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage)
})

// 计算显示的页码范围
const visiblePages = computed(() => {
  const pages = []
  const delta = 2 // 左右显示2页
  
  let start = Math.max(2, props.currentPage - delta)
  let end = Math.min(totalPages.value - 1, props.currentPage + delta)
  
  // 调整范围以确保显示5个页码
  if (end - start < 4) {
    if (props.currentPage < totalPages.value / 2) {
      end = Math.min(start + 4, totalPages.value - 1)
    } else {
      start = Math.max(2, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 控制显示逻辑
const showFirstPage = computed(() => {
  return !visiblePages.value.includes(1)
})

const showLastPage = computed(() => {
  return !visiblePages.value.includes(totalPages.value) && totalPages.value > 1
})

const showLeftEllipsis = computed(() => {
  return visiblePages.value[0] > 2
})

const showRightEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
})

// 当前页显示的项目范围
const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return Math.min(end, props.totalItems)
})

// 跳转到指定页
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
  }
}

// 处理页面大小变化
const handlePageSizeChange = () => {
  emit('page-change', 1) // 重置到第一页
}

// 监听props变化
watch(() => props.itemsPerPage, (newSize) => {
  localPageSize.value = newSize
})
</script>

<style scoped>
.category-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.pagination-info {
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pagination-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #4caf50;
  color: #4caf50;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(.active) {
  border-color: #4caf50;
  color: #4caf50;
}

.page-btn.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
  font-weight: 500;
}

.ellipsis {
  color: #999;
  font-size: 14px;
  user-select: none;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-selector span {
  font-size: 14px;
  color: #666;
}

.size-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.size-select:focus {
  outline: none;
  border-color: #4caf50;
}

@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .page-numbers {
    order: 2;
  }
  
  .prev-btn {
    order: 1;
  }
  
  .next-btn {
    order: 3;
  }
  
  .page-btn {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
  
  .pagination-btn {
    min-width: 80px;
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>