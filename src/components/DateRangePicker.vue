<template>
    <div style="position: relative; display: inline-block;">
        <div class="reportrange-text" @click="togglePicker">
            <slot name="input">
                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
                <span v-if="dateFilterApplied">{{startText}} - {{endText}}</span>
                <span v-else>Please select a date range.</span>
                <b class="caret"></b>
            </slot>
        </div>
        <transition name="slide-fade" mode="out-in">
            <div class="daterangepicker dropdown-menu ltr" :class="pickerStyles()" v-if="open"
                 v-on-clickaway="clickAway">

                <div class="calendar left">
                    <div class="daterangepicker_input hidden-xs">
                        <input class="input-mini form-control" type="text" name="daterangepicker_start"
                               :value="startText" readonly/>
                        <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class="calendar-table">
                        <calendar :monthDate="monthDate"
                                  :locale="locale"
                                  :start="start" :end="end"
                                  @nextMonth="nextMonth" @prevMonth="prevMonth"
                                  @dateClick="dateClick" @hoverDate="hoverDate"
                        ></calendar>
                    </div>
                </div>

                <div class="calendar right hidden-xs">
                    <div class="daterangepicker_input">
                        <input class="input-mini form-control" type="text" name="daterangepicker_end"
                               :value="endText" readonly/>
                        <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class="calendar-table">
                        <calendar :monthDate="nextMonthDate"
                                  :locale="locale"
                                  :start="start" :end="end"
                                  @nextMonth="nextMonth" @prevMonth="prevMonth"
                                  @dateClick="dateClick" @hoverDate="hoverDate"
                        ></calendar>
                    </div>
                </div>

                <calendar-ranges @rangeSelected="selectRange" :canSelect="in_selection" @clickCancel="cancelClicked"
                                 @clickApply="clickedApply" :ranges="ranges" class=" hidden-xs">
                </calendar-ranges>
            </div>
        </transition>
    </div>
</template>

<script>
    import moment from 'moment'
    import Calendar from './Calendar.vue'
    import CalendarRanges from './CalendarRanges'
    import { nextMonth, prevMonth, thisMonth, thisYear, lastWeek, lastMonth } from './util'
    import { mixin as clickaway } from 'vue-clickaway'

    export default {
        components: {Calendar, CalendarRanges},
        mixins: [clickaway],
        props: {
            localeData: {
                type: Object,
                default () {
                    return {}
                },
            },
            startDate: {
                default () {
                    return new Date()
                }
            },
            endDate: {
                default () {
                    return new Date()
                }
            },
            ranges: {
                type: Object,
                default () {
                    return {
                        'This month': new Date(),
                        'This year': new Date(),
                        'Last week': new Date(),
                        'Last month': new Date(),
                    }
                }
            },
            opens: {
                type: String,
                default: 'center'
            }
        },
        data () {
            let default_locale = {
                direction: 'ltr',
                format: moment.localeData().longDateFormat('L'),
                separator: ' - ',
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: moment.weekdaysMin(),
                monthNames: moment.monthsShort(),
                firstDay: moment.localeData().firstDayOfWeek()
            }

            // let data = { locale: _locale }
            let data = { locale: {...default_locale, ...this.localeData}}

            data.monthDate = new Date(this.startDate)
            data.start = new Date(this.startDate)
            data.end = new Date(this.endDate)
            data.in_selection = false
            data.open = false
            data.dateFilterApplied = false

            // update day names order to firstDay
            if (data.locale.firstDay !== 0) {
                let iterator = data.locale.firstDay
                while (iterator > 0) {
                    data.locale.daysOfWeek.push(data.locale.daysOfWeek.shift())
                    iterator--
                }
            }
            return data
        },
        methods: {
            nextMonth () {
                this.monthDate = nextMonth(this.monthDate)
            },
            prevMonth () {
                this.monthDate = prevMonth(this.monthDate)
            },
            selectThisMonth () {
                let thisDateRange = thisMonth()
                this.start = thisDateRange.start
                this.end = thisDateRange.end
            },
            selectThisYear () {
                let thisDateRange = thisYear()
                this.start = thisDateRange.start
                this.end = thisDateRange.end
            },
            selectLastWeek () {
                let thisDateRange = lastWeek()
                this.start = thisDateRange.start
                this.end = thisDateRange.end
            },
            selectLastMonth () {
                let thisDateRange = lastMonth()
                this.start = thisDateRange.start
                this.end = thisDateRange.end
            },
            dateClick (value) {
                let selectedDate = new Date(value)
                if (this.in_selection) {
                    if(selectedDate < this.start) {
                        this.start = selectedDate
                    } else {
                        this.in_selection = false
                        this.end = new Date(value)
                    }
                } else {
                    this.in_selection = true
                    this.start = new Date(value)
                    this.end = new Date(value)
                }
            },
            hoverDate (value) {
                let dt = new Date(value)
                if (this.in_selection && dt > this.start)
                    this.end = dt
            },
            togglePicker () {
                this.open = !this.open
            },
            pickerStyles () {
                return {
                    'show-calendar': this.open,
                    opensright: this.opens === 'right',
                    opensleft: this.opens === 'left',
                    openscenter: this.opens === 'center'
                }
            },
            clickedApply () {
                this.open = false
                this.dateFilterApplied = true
                this.$emit('update', {startDate: this.start, endDate: this.end})
            },
            clickAway () {
                if (this.open) {
                    this.open = false
                }
            },
            selectRange(rangeType) {
                let dateRange = {}
                switch( rangeType ) {
                  case 'This month':
                    this.selectThisMonth()
                    break;
                  case 'This year':
                    this.selectThisYear()
                    break;
                  case 'Last week':
                    this.selectLastWeek()
                    break;
                  case 'Last month':
                    this.selectLastMonth()
                    break;
                  default:
                    break;
                }
            },
            cancelClicked() {
                this.dateFilterApplied = false
                this.open = false
                this.$emit('update', null)
            }
        },
        computed: {
            nextMonthDate () {
                return nextMonth(this.monthDate)
            },
            startText () {
                return this.start.toLocaleDateString()
            },
            endText () {
                return this.end.toLocaleDateString()
            }
        },
        watch: {
            startDate (value) {
                this.start = new Date(value)
            },
            endDate (value) {
                this.end = new Date(value)
            }
        }
    }

</script>

<style>
    @import '../styles/DateRangePicker.scss'
</style>
