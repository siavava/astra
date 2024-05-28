<template>
  <canvas ref="canvas" />
  <!-- <Options @speedChanged="onSpeedChange"/> -->
  <!-- <PlanetCard v-if="selectedPlanetCard != null" :planetInfo="selectedPlanetCard"  @closeCard="selectedPlanetCard = null"/> -->
  <div class="date-display" :class="{disabled: idealizedSpeed}">
    <div class="ico">
      <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z" fill="#ffffff" class="fill-000000"/></svg>
    </div>
    <p>{{ date }}</p>
  </div>
</template>

<script lang="ts" setup>

// data
const speed = ref(1)
const idealized = ref(true)
const time = ref(0)
const selected = ref(null)

defineEmits(['onSceneLoad'])

// load data
const { data }  = await queryContent("bodies").findOne()
console.log(`data: ${data}`)

// on mounted...
onMounted(() => {

})

</script>

<style lang="sass" scoped>
canvas
  width: 100vw
  height: 100vh

.date-display
  position: absolute
  top: 0
  left: 0
  padding: 1em
  display: flex
  gap: 8px

  &.disabled
    opacity: 0.2

@media (max-width: 560px)
  .date-display 
    top: 16px

</style>
