<script setup>
import {nextTick, ref, useTemplateRef, watch} from "vue";
import Camera from "@/views/user/profile/components/icons/Camera.vue";
import Croppie from 'croppie'
import 'croppie/croppie.css'

const props = defineProps(['photo'])
const myPhoto = ref(props.photo)

watch(() => props.photo, newVal => {
  myPhoto.value = newVal
})

const fileInputRef = useTemplateRef('file-input-ref')
const modalRef = useTemplateRef('modal-ref')
const croppieContainerRef = useTemplateRef('croppie-container-ref')
let croppie = null

// 创建 Croppie 实例
async function initCroppie(imageUrl) {
  // 确保容器存在且清空
  if (!croppieContainerRef.value) return

  // 清空容器
  croppieContainerRef.value.innerHTML = ''

  // 创建一个新的 div 给 Croppie 使用
  const croppieDiv = document.createElement('div')
  croppieDiv.style.width = '300px'
  croppieDiv.style.height = '300px'
  croppieContainerRef.value.appendChild(croppieDiv)

  // 创建新实例
  croppie = new Croppie(croppieDiv, {
    viewport: {width: 200, height: 200, type: 'square'},
    boundary: {width: 300, height: 300},
    enableOrientation: true,
    enforceBoundary: true,
  })

  await croppie.bind({ url: imageUrl })
}

// 销毁 Croppie
function destroyCroppie() {
  if (croppie) {
    croppie.destroy()
    croppie = null
  }
  // 清空容器
  if (croppieContainerRef.value) {
    croppieContainerRef.value.innerHTML = ''
  }
}

async function openModal(photo) {
  // 先销毁旧的
  destroyCroppie()

  // 打开弹窗
  modalRef.value.showModal()
  await nextTick()

  // 初始化新的
  await initCroppie(photo)
}

async function crop() {
  if (!croppie) return

  myPhoto.value = await croppie.result({
    type: 'base64',
    size: { width: 400, height: 400 },
  })

  modalRef.value.close()
  destroyCroppie()
}

function closeModal() {
  modalRef.value.close()
  destroyCroppie()
}

function onFileChange(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    openModal(reader.result)
  }
  reader.readAsDataURL(file)
}

defineExpose({
  myPhoto,
})
</script>

<template>
  <!-- 头像展示区 -->
  <div class="flex justify-center">
    <div class="avatar-group relative group">
      <div class="avatar">
        <div class="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
          <img v-if="myPhoto" :src="myPhoto" alt="" class="object-cover w-full h-full" />
          <div v-else class="bg-black/20 object-cover w-full h-full flex justify-center items-center font-bold">
            点击选择头像
          </div>
        </div>
      </div>
      <div
        @click="fileInputRef.click()"
        class="absolute inset-0 w-28 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center cursor-pointer backdrop-blur-sm"
      >
        <Camera class="w-6 h-6 text-white" />
        <span class="text-white text-xs mt-1">更换</span>
      </div>
    </div>
  </div>

  <!-- 隐藏文件上传 -->
  <input ref="file-input-ref" type="file" class="hidden" accept="image/*" @change="onFileChange"/>

  <!-- 裁剪弹窗 -->
  <dialog ref="modal-ref" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box p-6 bg-base-100 rounded-2xl shadow-2xl max-w-md transition-none">
      <h3 class="text-xl font-bold text-center mb-2">裁剪头像</h3>
      <p class="text-center text-sm text-base-content/60 mb-4">拖动调整裁剪区域</p>

      <!-- Croppie 动态容器 -->
      <div class="flex justify-center items-center bg-base-200 rounded-lg p-4 min-h-[340px]">
        <div ref="croppie-container-ref"></div>
      </div>

      <div class="modal-action flex justify-center gap-3 mt-6">
        <button @click="closeModal" class="btn btn-ghost px-6">
          取消
        </button>
        <button @click="crop" class="btn btn-primary px-8 shadow-md hover:shadow-lg transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          确认裁剪
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>关闭</button>
    </form>
  </dialog>
</template>