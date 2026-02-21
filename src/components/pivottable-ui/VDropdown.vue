<template>
  <select
    v-model="valueModel"
    class="pvtDropdown"
  >
    <option
      v-for="(text, index) in options"
      :key="index"
      :value="text"
    >
      {{ text }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (event: 'update:value', value: string): void
}>()

interface DropdownProps {
  options: string[]
  value?: string
}

const props = withDefaults(defineProps<DropdownProps>(), {
  value: ''
})

const valueModel = ref<string>(props.value || props.options[0] || '')

// Watch for external changes to props.value
watch(
  () => props.value,
  (newVal) => {
    if (newVal !== undefined && newVal !== valueModel.value) {
      valueModel.value = newVal
    }
  }
)

watch(
  valueModel,
  (newVal) => {
    emit('update:value', newVal)
  },
  { immediate: true }
)
</script>
