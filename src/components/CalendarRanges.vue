<template>
    <div class="ranges">
        <div class="range_inputs">
            <button class="applyBtn btn btn-sm btn-success" :disabled="canSelect" type="button" @click="$emit('clickApply')">Apply</button>
            <button class="cancelBtn btn btn-sm btn-default" type="button" @click="$emit('clickCancel')">Clear</button>
        </div>

        <ul v-if="ranges">
            <li v-for="(value, key) in ranges" :key="key" @click="selectedRange(key)">{{key}}</li>
        </ul>
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
