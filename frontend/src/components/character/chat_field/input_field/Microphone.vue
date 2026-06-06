<script setup>
import KeyBoard from "@/components/character/icons/KeyBoard.vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {MicVAD} from "@ricky0123/vad-web";
import api from "@/js/http/api.js";

const emit = defineEmits(['close', 'send', 'stop'])
const isSpeaking = ref(false)
let vadInstance = null;

const startRecording = async () => {
  const baseUrl = "http://localhost:5173/vad/";
  try {
    vadInstance = await MicVAD.new({
      baseAssetPath: baseUrl,
      onSpeechStart: () => {
        isSpeaking.value = true;
        emit('stop')
      },
      onSpeechEnd: (audio) => {
        isSpeaking.value = false;
        const pcm16 = float32ToInt16(audio);
        sendToBackend(pcm16);
      },
      ortConfig: (ort) => {
        ort.env.wasm.wasmPaths = baseUrl;
        ort.env.logLevel = "error";
      },
      positiveSpeechThreshold: 0.8,
      negativeSpeechThreshold: 0.65,
      minSpeechFrames: 5,
      redemptionFrames: 5,
    });

    await vadInstance.start();
  } catch (e) {
    console.error("VAD 初始化失败:", e);
  }
};
// 将 Float32 转 PCM 16-bit
const float32ToInt16 = (float32Array) => {
  const buffer = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return buffer.buffer;
};

const sendToBackend = async (arrayBuffer) => {
  const blob = new Blob([arrayBuffer], { type: "audio/pcm" });
  const formData = new FormData()
  formData.append("audio", blob, "voice.pcm")

  try {
    const res = await api.post("/api/friend/message/asr/asr/", formData)
    const data = res.data
    if (data.result === "success") {
      emit("send", null, data.text)
    }
  } catch (error) {
    console.log(error)
  }
};

onMounted(() => {
  startRecording()
})

onBeforeUnmount(() => {
  if (vadInstance) {
    vadInstance.destroy()
    vadInstance = null
  }
})
</script>

<template>
<div class="absolute bottom-0 left-0 right-0 p-4 bg-base-100/90 backdrop-blur-sm border-t border-base-200 rounded-b-2xl">
  <div class="flex items-center gap-3 bg-base-200 rounded-2xl p-3 shadow-inner">
    <!-- 键盘切换按钮 -->
    <button
      @click="emit('close')"
      class="btn btn-sm btn-ghost btn-circle hover:bg-primary/10 transition-colors"
      title="切换文字输入"
    >
      <KeyBoard class="w-5 h-5" />
    </button>

    <!-- 语音识别状态 -->
    <div v-if="isSpeaking" class="flex items-center justify-center gap-1 h-6 flex-1">
      <div
        v-for="i in 32" :key="i"
        class="w-0.5 bg-primary rounded-full animate-wave"
        :style="{ animationDelay: `${i * 0.05}s`, height: `${Math.random() * 20 + 8}px` }"
      ></div>
    </div>
    <div v-else class="flex-1 flex justify-center items-center gap-3">
      <span class="text-sm justify-center text-base-content/70">语音输入</span>
    </div>
  </div>
</div>
</template>

<style scoped>
@keyframes wave {
  0%, 100% {
    height: 8px;
  }
  50% {
    height: 24px;
  }
}

.animate-wave {
  animation: wave 0.8s ease-in-out infinite;
}
</style>