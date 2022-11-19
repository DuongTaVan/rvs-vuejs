<template>
  <div class="process-bar">
    <RadialProgressBar
      :diameter="diameter"
      :completed-steps="currentPercent"
      :total-steps="totalPercent"
      :stroke-width="strokeWidth"
      :inner-stroke-width="innerStrokeWidth"
      :inner-stroke-color="'#d3e0f8'"
      :start-color="'#416ac6'"
      :stop-color="'#416ac6'"
    >
      <slot></slot>
    </RadialProgressBar>
  </div>
</template>
<script setup>
import RadialProgressBar from 'vue-radial-progress';

const props = defineProps({
  totalPercent: {
    type: [String, Number],
    default: 100,
    description: 'Total Process Percent'
  },
  currentPercent: {
    type: [String, Number],
    require: true,
    description: 'Current Process Percent'
  },
  diameter: {
    type: [String, Number],
    default: 210,
    description: 'Diameter Process'
  },
  strokeWidth: {
    type: [String, Number],
    default: 12,
    description: 'Stroke Process Width'
  },
  innerStrokeWidth: {
    type: [String, Number],
    default: 12,
    description: 'Inner Stroke Process Width'
  },
});
</script>
