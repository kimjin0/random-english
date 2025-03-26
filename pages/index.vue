<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">랜덤 영어 생성기</h2>

    <div class="voice-control">
      <label for="rate">말하기 속도:</label>
      <input type="range" id="rate" min="0.5" max="1.5" step="0.05" v-model="speechRate" />
      <span>{{ speechRate }}</span>
    </div>

    <div class="control-group">
      <label for="group">그룹 선택:</label>
      <select v-model="selectedGroup" id="group">
        <option value="all">전체</option>
        <option value="farFrom">far from</option>
        <option value="howLong">how long</option>
        <option value="iWanna">I wanna</option>
        <option value="imGonna">I'm gonna</option>
        <option value="wouldYouLike">Would you like</option>
        <option value="doYouWantTo">Do you want to</option>
        <option value="doYouHaveAny">Do you have any</option>
      </select>

      <button @click="generate">랜덤 문장 보기</button>
    </div>

    <div v-if="currentSentence" class="card">
      <p class="korean">{{ currentSentence.ko }}</p>
      <p class="timer" v-if="countdown > 0">🕒 {{ countdown }}초 안에 영어로 말해보세요!</p>
      <p class="ready" v-else>✅ 이제 정답을 확인해보세요!</p>

      <button @click="showAnswer = true">👉 영어 보기</button>
      <p v-if="showAnswer" class="english">
        {{ currentSentence.en }}
        <button class="replay-btn" @click="speak(currentSentence.en)">🔊</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedGroup = ref('all')
const sentences = ref({})
const usedSentences = ref(new Set())
const currentSentence = ref(null)
const countdown = ref(10)
const showAnswer = ref(false)
const speechRate = ref(0.85)
let timer = null

const { data } = await useFetch('/api/sentences')
if (data.value) {
  sentences.value = data.value
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

  // 필터링: 이미 사용된 문장은 제외
  const filteredPool = pool.filter(s => !usedSentences.value.has(s.ko))

  if (filteredPool.length === 0) {
    alert('선택한 그룹에 더 이상 새로운 문장이 없어요!')
    return
  }

  const random = filteredPool[Math.floor(Math.random() * filteredPool.length)]
  currentSentence.value = random
  usedSentences.value.add(random.ko)

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = speechRate.value
  utterance.pitch = 1.0
  utterance.volume = 1.0

  const voices = speechSynthesis.getVoices()
  const maleVoice = voices.find(v =>
    v.lang.startsWith('en') && /male|daniel|alex/i.test(v.name)
  )
  if (maleVoice) {
    utterance.voice = maleVoice
  }

  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
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

.voice-control {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
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

.replay-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;
}

.replay-btn:hover {
  color: #007bff;
}
</style>