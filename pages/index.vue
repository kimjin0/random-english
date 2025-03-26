<template>
    <div class="p-6 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">랜덤 영어 생성기</h2>
  
      <div class="control-group">
        <label for="group">그룹 선택:</label>
        <select v-model="selectedGroup" id="group">
          <option value="all">전체</option>
          <option value="farFrom">far from</option>
          <option value="howLong">how long</option>
          <option value="iWanna">I wanna</option>
        </select>

        <button @click="generate">랜덤 문장 보기</button>
      </div>
  
      <div v-if="currentSentence" class="card">
        <p class="korean">{{ currentSentence.ko }}</p>
        <p class="timer" v-if="countdown > 0">🕒 {{ countdown }}초 안에 영어로 말해보세요!</p>
        <p class="ready" v-else>✅ 이제 정답을 확인해보세요!</p>

        <button @click="showAnswer = true" :disabled="countdown > 0">👉 영어 보기</button>
        <p v-if="showAnswer" class="english">{{ currentSentence.en }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const selectedGroup = ref('all')
  const sentences = ref({})
  const currentSentence = ref(null)
  const countdown = ref(10)
  const showAnswer = ref(false)
  let timer = null
  
  const { data } = await useFetch('/api/sentences');
  if (data.value) {
    sentences.value = data.value;
  }  

  function generate() {
    if (!sentences.value || Object.keys(sentences.value).length === 0) {
      alert('문장이 아직 로드되지 않았어요!')
      return
    }
  
    showAnswer.value = false
    countdown.value = 10
    clearInterval(timer)
  
    let pool = []
    if (selectedGroup.value === 'all') {
      for (const key in sentences.value) {
        pool = pool.concat(sentences.value[key])
      }
    } else {
      pool = sentences.value[selectedGroup.value] || []
    }
  
    if (pool.length === 0) {
      alert('선택한 그룹에 문장이 없어요!')
      return
    }
  
    const random = pool[Math.floor(Math.random() * pool.length)]
    currentSentence.value = random
  
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 40px auto;
    padding: 24px;
    font-family: 'Segoe UI', sans-serif;
  }
  
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }
  
  .control-group {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  select {
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  button {
    padding: 6px 14px;
    font-size: 14px;
    border: none;
    background-color: #2b7cff;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
  
  .card {
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .korean {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .timer {
    color: gray;
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .ready {
    color: green;
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .english {
    font-weight: bold;
    font-size: 16px;
    margin-top: 8px;
  }
  </style>
  