<script setup>
defineProps(['character'])
</script>

<template>
  <div class="absolute left-3 top-4 h-10 max-w-[calc(100%-5rem)] rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-2 px-2 pr-4 shadow-md transition-all duration-200 hover:bg-black/60">
    <div class="avatar">
      <div class="w-7 h-7 rounded-full ring-2 ring-white/30">
        <img :src="character.photo" alt="头像" class="object-cover">
      </div>
    </div>
    <div class="text-white/90 text-sm font-medium truncate max-w-[150px]">
      {{ character.name }}
    </div>
  </div>
</template>

<style scoped>

</style>