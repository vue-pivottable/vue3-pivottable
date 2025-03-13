<!-- aggregatorCell -->
<template>
    <template>
        <td
            v-if="this.$slots.aggregatorCell"
            class="pvtVals pvtText"
        >
            <slot name="aggregatorCell"></slot>
        </td>
        <td
            v-else
            class="pvtVals"
        >
            <div>
                <VDropdown
                    :values="Object.keys(this.aggregatorItems)"
                    :value="aggregatorName"
                    @input="handleInputAggregatorName"
                >
                </VDropdown>
                <a
                    class="pvtRowOrder"
                    role="button"
                    @click="handleClickRowOrder"
                >
                </a>
                <a
                    class="pvtColOrder"
                    role="button"
                    @click="handleClickColOrder"
                >

                </a>
            </div>
            <template
                v-if="numValsAllowed > 0"
            >
                <VDropdown
                    v-for="(item, i) in numValsAllowed"
                    :key="i"
                    :values="Object.keys(this.attrValues).filter(e =>
                    !this.hiddenAttributes.includes(e) &&
                    !this.hiddenFromAggregators.includes(e))"
                    :value="vals[i]"
                    @input="(i) => {handleInputHidden(value, i)}"
                >

                </VDropdown>
            </template>
        </td>
    </template>
</template>

<script setup>
import { computed } from 'vue'
import VDropdown from './VDropdown'
import defaultProps from '../../helper/defaultProps'

const aggregatorItems = computed(() => (defaultProps.aggregators) || aggregators)
const numValsAllowed = computed(() => aggregatorItems[this.propsData.aggregatorName]([])().numInputs || 0)
const handleInputAggregatorName = (value) => this.propUpdater('aggregatorName')(value)
// const handleInputHidden = (value) => Object.keys(this.attrValues).filter(e => !this.hiddenAttributes.includes(e) && !this.hiddenFromAggregators.includes(e))
const handleInputHidden = (value, i) => this.propsData.vals.splice(i, 1, value)
const handleClickRowOrder = () => { this.propUpdater('rowOrder')(this.sortIcons[this.propsData.rowOrder].next) }
const handleClickColOrder = () => { this.propUpdater('colOrder')(this.sortIcons[this.propsData.colOrder].next) }
</script>

// aggregators props로 넘겨주기
