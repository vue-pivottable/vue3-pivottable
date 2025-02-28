<template>
  <select
    class="pvtDropdown"
    :value="value"
    @change="handleChange($event)"
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
import { onMounted } from 'vue'
const props = defineProps({
  // values: Array,
  // value: String
  values: {
    type: Array,
    default: () => ['a', 'b']
  },
  value: {
    type: String,
    default: 'a'
  }
})
const emit = defineEmits(['input'])
const handleChange = (e) => emit('input', e.target.value)
onMounted(() => {
  emit('input', props.value || props.values[0])
})
</script>

// *** model ***
// model: {
//   prop: 'value',
//   event: 'input'
// }
