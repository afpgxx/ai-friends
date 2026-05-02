<script setup>
const props = defineProps(['messageText', 'sendMessage'])

</script>

<template>
  <button
    type="button"
    class="btn btn-circle btn-primary shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
    :disabled="!messageText.trim()"
    @click="sendMessage"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  </button>
</template>

<style scoped>

</style>