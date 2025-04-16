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
const valueModel = ref(props.value || props.options[0])
const emit = defineEmits(['update:value'])
watch(
  valueModel,
  (newVal) => {
    emit('update:value', newVal)
  },
  { immediate: true }
)
</script>
