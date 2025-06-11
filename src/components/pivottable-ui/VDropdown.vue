<template>
  <select
    v-model="valueModel"
    class="pvtDropdown"
  >
    <option
      v-for="(text, key) in options"
      :key="key"
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
  value: string
}

const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],
  value: ''
})

const valueModel = ref<string>('')

watch(
  [() => props.value, () => props.options],
  ([val, opts]: [string, string[]]) => {
    valueModel.value = val || opts[0] || ''
  },
  { immediate: true }
)

watch(
  valueModel,
  (newVal) => {
    emit('update:value', newVal)
  },
  { immediate: true }
)
</script>
