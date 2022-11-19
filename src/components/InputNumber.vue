<template>
  <input
    type="number"
    :value="modelValue"
    :placeholder="placeholder"
    @input="changeValue"
    ref="inputRef"
  />
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    require: true,
    description: 'v-model value'
  },
  max: {
    type: Number,
    require: false,
    default: null
  },
  placeholder: {
    type: String,
    require: false,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const inputRef = ref({});

const isSmallerMax = (num) => {
  if (!num) return;
  if (+num < props.max) {
    return num;
  }
  return num.slice(0, num.length - 1);
};

const changeValue = () => {
  const inputEle = inputRef.value;
  let inputVal = inputEle.value;
  if (props.max) {
    inputVal = isSmallerMax(inputVal);
  }
  inputEle.value = inputVal;
  emit('update:modelValue', inputVal);
};
</script>
