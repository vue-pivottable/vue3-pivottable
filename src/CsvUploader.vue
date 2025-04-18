<template>
  <div class="csv-uploader">
    <div class="upload-container">
      <div class="file-upload">
        <p>파일을 업로드하려면...</p>
        <div
          class="dropzone"
          :class="{
            'dropzone-active': isDragging,
            'dropzone-reject': isReject
          }"
          @dragenter.prevent="onDragEnter"
          @dragleave.prevent="onDragLeave"
          @dragover.prevent
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <p>
            CSV 파일을 여기에 드롭하거나 클릭하여 컴퓨터에서 파일을 선택하세요.
          </p>
          <input
            type="file"
            ref="fileInput"
            accept=".csv"
            class="hidden-input"
            @change="onFileSelected"
          />
        </div>
      </div>
      <div class="text-input">
        <p>...또는 데이터를 붙여넣으세요:</p>
        <textarea
          v-model="csvText"
          @input="parseTextarea"
          placeholder="스프레드시트나 CSV와 같은 파일에서 붙여넣기"
        ></textarea>
      </div>
    </div>

    <div class="note">
      <p><em>참고: 데이터는 브라우저를 떠나지 않습니다!</em></p>
    </div>

    <div
      v-if="filename"
      class="result-container"
    >
      <h2>{{ filename }}</h2>

      <!-- 여기에는 피벗 테이블 컴포넌트가 들어갑니다 -->
      <slot :data="parsedData"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import Papa from 'papaparse'

const props = defineProps({
  initialData: {
    type: Array,
    default: () => []
  },
  initialFilename: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['data-parsed'])

const isDragging = ref(false)
const isReject = ref(false)
const filename = ref(props.initialFilename)
const csvText = ref('')
const parsedData = ref(props.initialData)
const isProcessing = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const onDragEnter = (e) => {
  isDragging.value = true

  // CSV 파일인지 확인
  if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
    const item = e.dataTransfer.items[0]
    if (item.kind === 'file' && !item.type.includes('text/csv')) {
      isReject.value = true
    }
  }
}

const onDragLeave = () => {
  isDragging.value = false
  isReject.value = false
}

const onDrop = (e) => {
  isDragging.value = false
  isReject.value = false

  const files = e.dataTransfer.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const onFileSelected = (e) => {
  const files = e.target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  if (!file.type.includes('text/csv') && !file.name.endsWith('.csv')) {
    alert('CSV 파일만 허용됩니다.')
    return
  }

  isProcessing.value = true
  filename.value = '(CSV 파싱 중...)'
  parsedData.value = []

  Papa.parse(file, {
    skipEmptyLines: true,
    error: (e) => {
      alert(e)
      isProcessing.value = false
    },
    complete: (results) => {
      filename.value = file.name
      parsedData.value = results.data
      isProcessing.value = false
      emit('data-parsed', results.data)
    }
  })
}

const parseTextarea = () => {
  if (!csvText.value) {
    parsedData.value = []
    filename.value = ''
    return
  }

  Papa.parse(csvText.value, {
    skipEmptyLines: true,
    error: (e) => {
      alert(e)
    },
    complete: (results) => {
      filename.value = 'textarea에서 가져온 데이터'
      parsedData.value = results.data
      emit('data-parsed', results.data)
    }
  })
}
</script>

<style scoped>
.csv-uploader {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.upload-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.file-upload,
.text-input {
  width: 45%;
  text-align: center;
}

.dropzone {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropzone-active {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.dropzone-reject {
  border-color: #ff5252;
  background-color: #ffebee;
}

.hidden-input {
  display: none;
}

textarea {
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

.note {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}

.result-container {
  margin-top: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
