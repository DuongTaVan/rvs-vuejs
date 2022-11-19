<template>
  <input
    type="text"
    :value="inputValue"
    @input="changeValue"
    :placeholder="placeholder"
    ref="inputRef"
  />
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    require: true
  },
  placeholder: {
    type: String,
    require: false,
    default: ''
  }
});
const inputRef = ref({});
const emit = defineEmits(['update:modelValue']);

const formatDate = (date) => {
  if (date.includes('/')) {
    return date;
  }
  date = date.split('');
  if (date.length > 2) {
    date.splice(2, 0, '/');
  }
  return date.join('');
};

const inputValue = computed(() => formatDate(props.modelValue));

const validateDate = (date) => {
  var date_regex = /[^0-9]/;
  if (!date_regex.test(date) && date.length <= 4) {
    return date;
  }
  return date.slice(0, date.length - 1);
};

const changeValue = () => {
  const inputEle = inputRef.value;
  let inputVal = inputEle.value?.replace('/', '');
  inputVal = validateDate(inputVal);
  inputVal = formatDate(inputVal);
  inputEle.value = inputVal;
  emit('update:modelValue', inputVal);
};
</script>
