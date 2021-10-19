<template>
    <div class="ranges">
        <ul v-if="ranges">
            <li v-for="(value, key) in ranges" :key="key" @click="selectedRange(key)">{{key}}</li>
        </ul>

        <div class="range_inputs">
            <button class="applyBtn btn btn-block btn-sm btn-primary" :disabled="canSelect" type="button" @click="$emit('clickApply')">Anwenden</button>
            <button class="cancelBtn btn btn-block btn-sm btn-default" type="button" @click="$emit('clickCancel')">Abbrechen</button>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['canSelect', 'ranges'],
        methods: {
          selectedRange(rangeType) {
            this.$emit('rangeSelected', rangeType)
          }
        }
    }
</script>