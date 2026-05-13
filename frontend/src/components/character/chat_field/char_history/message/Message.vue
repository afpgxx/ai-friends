<script setup>
import {useUserStore} from "@/stores/user.js";

defineProps(['message', 'character'])

const user = useUserStore()

// 格式化时间（根据你的时间戳格式调整）
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
}
</script>

<template>
  <div v-if="message.content" class="animate-fade-in">
    <!-- AI 消息（左侧） -->
    <div v-if="message.role === 'ai'" class="chat chat-start">
      <div class="chat-image avatar">
        <div class="w-10 rounded-full ring ring-primary/30 ring-offset-2 ring-offset-base-100">
          <img :src="character.photo" alt="AI头像" class="object-cover" />
        </div>
      </div>
      <div class="chat-header text-xs text-base-content/50">
        AI 助手
        <time class="text-xs ml-1">{{ formatTime(message.timestamp) }}</time>
      </div>
      <div class="whitespace-pre-wrap chat-bubble bg-gradient-to-r from-primary/10 to-secondary/10 text-base-content shadow-md backdrop-blur-sm border border-primary/20">
        <div class="prose prose-sm max-w-none">
          {{ message.content }}
        </div>
      </div>
      <div class="chat-footer text-xs text-base-content/40 opacity-0 group-hover:opacity-100 transition-opacity">
        已读
      </div>
    </div>

    <!-- 用户消息（右侧） -->
    <div v-else class="chat chat-end group">
      <div class="chat-image avatar">
        <div class="w-10 rounded-full ring ring-secondary/30 ring-offset-2 ring-offset-base-100">
          <img :src="user.photo" alt="用户头像" class="object-cover" />
        </div>
      </div>
      <div class="chat-header text-xs text-base-content/50">
        {{ user.username || '我' }}
        <time class="text-xs ml-1">{{ formatTime(message.timestamp) }}</time>
      </div>
      <div class="whitespace-pre-wrap chat-bubble bg-gradient-to-l from-secondary/90 to-primary/90 text-white shadow-md">
        <div class="prose prose-sm prose-invert max-w-none">
          {{ message.content }}
        </div>
      </div>
      <div class="chat-footer text-xs text-base-content/40 opacity-0 group-hover:opacity-100 transition-opacity">
        已发送
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 气泡内文字换行优化 */
.chat-bubble {
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 80%;
}

/* 移除外层 group 的默认样式（仅用于 hover 显示 footer） */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>