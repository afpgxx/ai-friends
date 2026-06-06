<script setup>
import {ref, watch} from "vue";

const props = defineProps(['voices', 'curVoiceId'])

const myVoice = ref(props.curVoiceId)

watch(() => props.curVoiceId, newVal => {
  myVoice.value = newVal
})

defineExpose({
  myVoice,
})
</script>

<template>
  <fieldset class="fieldset rounded-box bg-base-200">
    <legend class="fieldset-legend text-base font-medium ml-1">音色</legend>
    <select v-model="myVoice" class="select">
      <option
          v-for="voice in voices"
          :id="voice.id"
          :value="voice.id"
      >{{ voice.name }}</option>
    </select>
  </fieldset>
</template>

<style scoped>

</style>