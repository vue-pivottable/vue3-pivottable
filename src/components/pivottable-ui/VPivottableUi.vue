<template>
  <table class="pvtUi">
    <tbody>
      <tr>
        <VRendererCell />
        <VDragAndDropCell attrs="unused" />
      </tr>
      <tr>
        <VAggregatorCell />
        <VDragAndDropCell attrs="col" />
      </tr>
      <tr>
        <VDragAndDropCell attrs="row" />
        <td>table rendered</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'

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
