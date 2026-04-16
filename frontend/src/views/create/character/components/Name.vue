<script setup>
import {ref, watch} from "vue";

const props = defineProps(['name'])
const myName = ref(props.name)

watch(() => props.name, newVal => {
  myName.value = newVal
})

defineExpose({
  myName,
})
</script>

<template>
  <fieldset class="fieldset rounded-box bg-base-200">
  <legend class="fieldset-legend text-base font-medium ml-1">角色名</legend>
  <input
    v-model="myName"
    type="text"
    class="input input-bordered w-full focus:input-primary transition-all duration-300"
    placeholder="请输入角色名"
  />
</fieldset>
</template>

<style scoped>

</style>