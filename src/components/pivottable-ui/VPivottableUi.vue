<template>
  <table class="pvtUi">
    <tbody>
      <tr>
        <VRendererCell />
        <VDragAndDropCell
          attrs="unused"
          :items="unUsedItemsForTest"
          @update:filters="updateFilters"
          :classNames="['pvtAxisContainer', 'pvtUnused', 'pvtHorizList']"
        />
      </tr>
      <tr>
        <VAggregatorCell />
        <VDragAndDropCell
          attrs="col"
          :items="rowItemsForTest"
          @update:filters="updateFilters"
          :classNames="['pvtAxisContainer', 'pvtCols', 'pvtHorizList']"
        />
      </tr>
      <tr>
        <VDragAndDropCell
          attrs="row"
          :items="colItemsForTest"
          @update:filters="updateFilters"
          :classNames="['pvtAxisContainer', 'pvtRows', 'pvtVertList']"
        />
        <td>table rendered</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'

const updateFilters = ({ cellType, filters }) => {
  console.log('updated cell type', cellType)
  console.log('updated filter items', filters)
}

</script>

<style>
.pvtUi {
  border-collapse: collapse;
  width: 100%;
}

.pvtUi td, .pvtUi th {
  border: 1px solid black;
  padding: 8px;
}
</style>
