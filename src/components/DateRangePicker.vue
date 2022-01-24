<template>
    <div style="position: relative; display: inline-block;">
        <div class="reportrange-text" @click="togglePicker">
            <slot name="input">
                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
                <span v-if="dateFilterApplied">{{startText}} - {{endText}}</span>
                <span v-else>Zeitraum auswählen.</span>
                <b class="caret"></b>
            </slot>
        </div>
        <transition name="slide-fade" mode="out-in">
            <div class="daterangepicker dropdown-menu ltr" :class="pickerStyles()" v-if="open"
                 v-on-clickaway="clickAway">

                <div class="calendar left hidden-xs">
                    <div class="daterangepicker_input ">
                        <input class="input-mini form-control" type="text" name="daterangepicker_start"
                               :value="startText"
                               @change="changeInputDateStart"
                               @blur="changeInputDateStart"/>
                        <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class="calendar-table">
                        <calendar :monthDate="monthDate"
                                  :locale="locale"
                                  :start="start" :end="end"
                                  @nextMonth="nextMonth" @prevMonth="prevMonth"
                                  @dateClick="dateClick" @hoverDate="hoverDate"></calendar>
                    </div>
                </div>

                <div class="calendar right hidden-xs hidden-sm">
                    <div class="daterangepicker_input">
                        <input class="input-mini form-control" type="text" name="daterangepicker_end"
                               :value="endText"
                               @change="changeInputDateEnd"
                               @blur="changeInputDateEnd"/>
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
                                 @clickApply="clickedApply" :ranges="ranges" class="">
                </calendar-ranges>
            </div>
        </transition>
    </div>
</template>

<script>

import { mapState } from 'vuex'
import moment from 'moment'
import Calendar from './Calendar.vue'
import CalendarRanges from './CalendarRanges'
import { today, nextMonth, prevMonth, thisMonth, thisYear, lastWeek, lastMonth,last30,last365,maxDateRange } from './util'
import { mixin as clickaway } from 'vue-clickaway'

moment.locale('de');

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
                  'Last 30 Days': new Date(),
                  'Last 365 Days': new Date(),
                  'This Month': new Date(),
                  'Last Month': new Date(),
                  'This Year': new Date(),
                  'Maximal Range': new Date(),
                  'Today': new Date()
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
            format: moment.localeData('de').longDateFormat('L'),
            separator: ' - ',
            applyLabel: 'Anwenden',
            cancelLabel: 'Abbrechen',
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

        changeInputDateStart(event) {
            this.setUserDate(true, event.target.value)
        },

        changeInputDateEnd(event) {
            this.setUserDate(false, event.target.value)
        },

        setUserDate(start, userValue) {
            let date = null
            try {
                // TODO datum anhand der locale parsen
                date = moment(userValue, [
                    'DD.MM.YYYY',
                    'D.M.YYYY',
                    'M/D/YYYY'
                ])
            } catch(err) {
                // TODO display error to user
                return
            }

            if(date === null || !date.isValid()){
                return
            }

            date = date.toDate()

            if(start) {
                this.start = date
            } else {
                this.end = date
            }
        },

        nextMonth () {
            this.monthDate = nextMonth(this.monthDate)
        },
        prevMonth () {
            this.monthDate = prevMonth(this.monthDate)
        },
        selectToday () {
            let todayDate = today()
            this.start = todayDate
            this.end = todayDate
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
        selectLast30 () {
            let thisDateRange = last30()
            this.start = thisDateRange.start
            this.end = thisDateRange.end
        },
        selectLast365 () {
            let thisDateRange = last365()
            this.start = thisDateRange.start
            this.end = thisDateRange.end
        },
        selectMax () {
            let thisDateRange = maxDateRange()
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
                case 'Maximaler Zeitraum':
                    this.selectMax()
                    break;
                case 'Letzten 30 Tage':
                    this.selectLast30()
                    break;
                case 'Letzten 365 Tage':
                    this.selectLast365()
                    break;
                case 'Dieser Monat':
                    this.selectThisMonth()
                    break;
                case 'Dieses Jahr':
                    this.selectThisYear()
                    break;
                case 'Letzte Woche':
                    this.selectLastWeek()
                    break;
                case 'Letzter Monat':
                    this.selectLastMonth()
                    break;
                case 'Heute':
                    this.selectToday()
                    break
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
        ...mapState('user', ['user']),

        nextMonthDate () {
            return nextMonth(this.monthDate)
        },
        startText () {
            return this.start.toLocaleDateString(this.user.locale)
        },
        endText () {
            return this.end.toLocaleDateString(this.user.locale)
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
@import '../styles/DateRangePicker.scss';
</style>
