<template>
  <select
    class="pvtDropdown"
    :value="value"
    v-model="selected"
  >
    <option
      v-for="(text, key) in values"
      :key="key"
      :value="text"
      :selected="text === value ? 'selected' : undefined"
    >
      {{ text }}
    </option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  values: {
    type: Array,
    default: () => []
  },
  value: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:value'])
const selected = ref(props.value || props.values[0])
watch(selected, (newVal) => {
  emit('update:value', newVal)
})
</script>

// v-model 구현
