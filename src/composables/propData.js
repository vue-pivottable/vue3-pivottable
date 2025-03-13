import { ref } from 'vue'

const newProps = ref({})

export function usePropsData ($props) {
  newProps.value = $props
  const propUpdater = (key, value) => (newProps[key] = value)
  const setProps = ($props) => (newProps.value = $props)
  return {
    newProps,
    setProps,
    propUpdater
  }
}
