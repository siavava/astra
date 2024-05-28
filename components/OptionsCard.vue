<template>
    <div class="options">
      <div class="form-group">
        <label>Speed</label>
        <div class="input-select">
          <div class="select-item">
            <input id="realtime" v-model="speed" name="speed" type="radio" value="realtime" @change="onSpeedChange" >
            <label for="realtime">Realtime</label>
          </div>
          <div class="select-item">
            <input id="day_sec" v-model="speed" checked name="speed" type="radio" value="day_sec" @change="onSpeedChange" >
            <label for="day_sec">1 day/sec</label>
          </div>
          <div class="select-item">
            <input id="mon_sec" v-model="speed" name="speed" type="radio" value="mon_sec" @change="onSpeedChange" >
            <label for="mon_sec">1 mon/sec</label>
          </div>
          <div class="select-item">
            <input id="idealized" v-model="speed" name="speed" type="radio" value="idealized" @change="onSpeedChange" >
            <label for="idealized">Idealized</label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  const speed = ref('day_sec');
  const emit = defineEmits(['speedChanged']);
  
  const onSpeedChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('speedChanged', target.value);
  };
  
  onMounted(() => {
    emit('speedChanged', speed.value);
  });
  </script>
  
  <style scoped lang="sass">
  .options
    position: absolute
    right: 10px
    top: 100px
  
    .form-group
      margin: 15px 5px
      text-align: center
  
      > label
        font-size: 18px
  
    .input-select
      background-color: var(--primary)
      border-radius: var(--radius)
      margin-top: 10px
      max-width: 115px
      margin-left: auto
      overflow: hidden
  
      .select-item
        display: flex
        justify-content: stretch
        align-items: stretch
        text-align: center
  
        input
          appearance: none
  
          &:checked + label
            background-color: var(--tertiary)
  
        label
          padding: 10px 16px
          cursor: pointer
          flex-grow: 1
  
    .input-check
      appearance: none
      margin-top: 8px
      width: 1em
      height: 1em
      background-color: var(--text)
      outline: 2px solid #fff
      border-radius: 50%
      cursor: pointer
      margin-right: 10px
  
      &:checked
        background-color: var(--tertiary)
  
      & + label
        cursor: pointer
  
  @media (max-height: 360px)
    .options
      top: 50px
  </style>
  