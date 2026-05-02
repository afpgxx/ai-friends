<script setup>

import {computed, useTemplateRef} from "vue";
import InputField from "@/components/character/chat_field/input_field/InputField.vue";
import CharacterPhotoField from "@/components/character/chat_field/character_photo_field/CharacterPhotoField.vue";

const props = defineProps(['friend'])
const modalRef = useTemplateRef('modal-ref')

function showModal() {
  modalRef.value.showModal()
}

const modalStyle = computed(() => {
  if (props.friend) {
    return {
      backgroundImage: `url(${props.friend.character.background_image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  } else {
    return {}
  }
})

defineExpose({
  showModal,
})
</script>

<template>
  <dialog ref="modal-ref" class="modal" @click="handleBackdropClick">
    <div class="modal-box w-90 h-150 transition-all duration-200" :style="modalStyle" @click.stop>
      <button
        @click="modalRef.close()"
        class="btn btn-sm btn-circle backdrop-blur-md bg-white/20 hover:bg-red-500/80 text-gray-700 hover:text-white border border-white/30 absolute right-2 top-2 transition-all duration-300 hover:scale-110 hover:rotate-90 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <InputField />
      <CharacterPhotoField v-if="friend" :character="friend.character" />
    </div>
  </dialog>
</template>

<style scoped>

</style>