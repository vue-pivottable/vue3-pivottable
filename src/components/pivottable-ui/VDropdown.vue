<template>
  <select
    class="pvtDropdown"
    v-model="valueModel"
  >
    <option
      v-for="(text, key) in options"
      :key="key"
      :value="text"
      :selected="text === valueModel ? 'selected' : undefined"
    >
      {{ text }}
    </option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  value: {
    type: String,
    default: ''
  }
})
const valueModel = ref(props.value)
const emit = defineEmits(['update:value'])
watch(valueModel, (newVal) => {
  emit('update:value', newVal)
})
</script>

// v-model 구현
