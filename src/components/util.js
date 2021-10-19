const nextMonth = (date) => {
  let dateMoment = moment(date)
  dateMoment.add('1', 'month')
  return dateMoment.toDate();
}

const prevMonth = (date) => {
  let dateMoment = moment(date)
  dateMoment.subtract('1', 'month')
  return dateMoment.toDate();
}

const thisMonth = () => {
  let start = moment().startOf('month').toDate()
  let end = moment().toDate()
  return { 'start': start, 'end': end }
}

const thisYear = () => {
  let start = moment().startOf('year').toDate()
  let end = moment().toDate()
  return { 'start': start, 'end': end }
}

const lastWeek = () => {
  let start = moment().subtract('1', 'week').startOf('week').toDate()
  let end = moment().subtract('1', 'week').endOf('week').toDate()
  return { 'start': start, 'end': end }
}

const lastMonth = () => {
  let start = moment().subtract('1', 'month').startOf('month').toDate()
  let end = moment().subtract('1', 'month').endOf('month').toDate()
  return { 'start': start, 'end': end }
}

const last30 = () => {
  let start = moment().subtract('1', 'month').subtract('1','day').toDate()
  let end = moment().subtract('1','day').toDate()
  return {'start': start, 'end': end}
}

const last365 = () => {
  let start = moment().subtract('1', 'year').toDate()
  let end = moment().subtract('1','day').toDate()
  return {'start': start, 'end': end}
}

const today = () => {
  return moment().toDate()
}

export { nextMonth, prevMonth, thisMonth, thisYear, lastWeek, lastMonth, today,last30,last365}
