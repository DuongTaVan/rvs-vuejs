<template>
  <input
    type="text"
    :value="inputValue"
    @input="changeInput"
    :placeholder="placeholder"
    ref="inputRef"
  />
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    require: true,
    description: 'v-model variable'
  },
  type: {
    type: String,
    require: false,
    default: 'integer',
    description: 'type of value'
  },
  subType: {
    type: String,
    require: false,
    default: 'text',
    description: 'type input'
  },
  placeholder: {
    type: String,
    default: '',
    require: false,
    description: 'placeholder for input'
  }
});

const inputRef = ref({});
const emit = defineEmits(['update:modelValue']);

const cardFormat = (value) => {
  var v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
  var matches = v?.match(/\d{4,16}/g);
  var match = (matches && matches[0]) || '';
  var parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

const inputValue = computed(() => cardFormat(props.modelValue));

const removeAlphabet = (num) => {
  const regex = /[^0-9]/;
  // return !regex.test(num);
  if (regex.test(num)) {
    return num?.slice(0, num.length - 1);
  }
  return num;
};

const changeInput = () => {
  const inputEle = inputRef.value;
  let inputVal = inputEle.value?.replace(/ /g, '');

  inputVal = removeAlphabet(inputVal);
  inputEle.value = cardFormat(inputVal);
  emit('update:modelValue', inputVal);
};
</script>
