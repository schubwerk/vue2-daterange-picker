<template>
  <div class="ranges">
    <ul v-if="ranges">
      <li v-for="(value, key) in ranges" :key="key" @click="selectedRange(key)">{{langGet(key)}}</li>
    </ul>

    <div class="range_inputs">
      <button class="applyBtn btn btn-block btn-sm btn-primary" :disabled="canSelect" type="button" @click="$emit('clickApply')">
        {{ langGet('Apply') }}
      </button>
      <button class="cancelBtn btn btn-block btn-sm btn-default" type="button" @click="$emit('clickCancel')">
        {{ langGet('Cancel') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['canSelect', 'ranges'],
  data() {
    return{
      translations:{
        de:{
          'Apply':'Anwenden',
          'Cancel': 'Abbrechen',
          'Last 30 Days':'Letzten 30 Tage',
          'Last 365 Days':'Letzten 365 Tage',
          'This Month':'Dieser Monat',
          'Last Month':'Letzter Monat',
          'This Year':'Dieses Jahr',
          'Maximal Range':'Maximaler Zeitraum',
          'Today':'Heute',
        },
        en:{
          'Apply':'Apply',
          'Cancel':'Cancel',
          'Last 30 Days':'Last 30 Days',
          'Last 365 Days':'Last 365 Days',
          'This Month':'This Month',
          'Last Month':'Last Month',
          'This Year':'This Year',
          'Maximal Range':'Maximal Range',
          'Today':'Today',
        }
      }
    }
  },
  methods: {
    langGet(key) {
      if (lang) {
        return this.translations[lang.getLocale()][key];
      }
    },
    selectedRange(rangeType) {
      this.$emit('rangeSelected', rangeType)
    }
  }
}
</script>

