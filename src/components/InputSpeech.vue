<template>
  <input type="text" :value="modelValue" />
</template>

<script setup>
import { defineEmits, defineExpose } from 'vue';
import speechToText from '@/plugins/speechToText';

defineProps({
  modelValue: {
    type: String,
    require: true,
    default: ''
  }
});

const speechToTextFun = new speechToText();
const emit = defineEmits(['update:modelValue']);

const speechAudio = async () => {
  speechToTextFun.AudioInput((val) => {
    emit('update:modelValue', val);
  });
};

defineExpose({ speechAudio });
</script>
