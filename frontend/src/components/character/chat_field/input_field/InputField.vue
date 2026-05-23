<script setup>
import {ref, nextTick, useTemplateRef} from 'vue'
import MicIcon from "@/components/character/icons/MicIcon.vue";
import SendIcon from "@/components/character/icons/SendIcon.vue";
import streamApi from "@/js/http/streamApi.js";
import Microphone from "@/components/character/chat_field/input_field/Microphone.vue";

// 双向绑定消息内容
const messageText = ref('')
const textareaRef = useTemplateRef('textarea-ref')
const props = defineProps(['friendId'])
const showMic = ref(false)
let processId = 0

// 发送消息逻辑（对外暴露事件）
const emit = defineEmits(['send', 'pushBackMessage', 'addToLastMessage'])

async function focus() {
  await nextTick()
  textareaRef.value?.focus()
}

// 发送消息
async function sendMessage(event, audio_msg) {
  let content;
  if (audio_msg) {
    content = audio_msg.trim()
  } else {
    content = messageText.value?.trim()
  }
  if (!content) return

  const curId = ++ processId
  messageText.value = ''

  emit('pushBackMessage', {role: 'user', content: content, id: crypto.randomUUID()})
  emit("pushBackMessage", {role: 'ai', content: '', id:crypto.randomUUID()})

  try {
    await streamApi('/api/friend/message/chat/', {
      body: {
        friend_id: props.friendId,
        content: content,
      },
      onmessage(data, isDone) {
        if (curId !== processId) return

        if (data.content) {
          emit('addToLastMessage', data.content)
        }
      },
      onerror(error) {
      },
    })
  } catch (error) {
  }

  // 发送后重置高度
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
}

// 自动调整 textarea 高度
const autoResize = () => {
    if (!textareaRef.value) return

  // 让 textarea 滚动到底部，显示最新输入的内容
  textareaRef.value.scrollTop = textareaRef.value.scrollHeight
}

function close() {
  ++ processId
  showMic.value = false
}

function handleStop() {
  ++ processId
}

// 暴露清空方法等（可选）
defineExpose({
  clearInput: () => {
    messageText.value = ''
    autoResize()
  },
  setMessage: (text) => {
    messageText.value = text
    autoResize()
  },
  focus,
  close,
})
</script>

<template>
  <div v-if="!showMic" class="absolute bottom-0 left-0 right-0 p-4 bg-base-100/80 backdrop-blur-sm border-t border-base-200 rounded-b-2xl">
    <!-- 输入框主体 -->
    <div class="flex items-center gap-2 bg-base-200 rounded-2xl p-2 shadow-inner transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50">
      <!-- 左侧功能按钮区 -->
      <div class="flex items-center gap-1">
        <!-- 麦克风/语音输入按钮 -->
        <MicIcon @click="showMic = true" />
        <!-- 附件/图片按钮 -->
        <button type="button" class="btn btn-sm btn-ghost btn-circle text-base-content/60 hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>
      </div>

      <!-- 文本输入区 -->
      <textarea
        ref="textarea-ref"
        v-model="messageText"
        rows="1"
        class="textarea textarea-bordered overflow-y-auto flex-1 resize-none min-h-[40px] max-h-32 bg-base-100 rounded-xl border-none focus:outline-none focus:ring-0 shadow-none text-base leading-relaxed"
        placeholder="输入消息..."
        @keydown.enter.exact.prevent="sendMessage"
        @input="autoResize"
        style="scroll-behavior: auto;"
      ></textarea>

      <!-- 右侧发送按钮 -->
      <SendIcon :messageText="messageText" :sendMessage="sendMessage"/>
    </div>
  </div>
  <Microphone
      v-else
      @close="showMic = false"
      @send="sendMessage"
      @stop="handleStop"
  />
</template>

<style scoped>
/* 微调 textarea 的滚动条 */
.textarea::-webkit-scrollbar {
  width: 3px;
}
.textarea::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 10px;
}
.textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>