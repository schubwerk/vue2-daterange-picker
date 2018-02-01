const nextMonth = (date) => {

    let dateMoment = moment(date)
    dateMoment.add('1', 'month')
    console.log("v9")
    return dateMoment.toDate();
}

const prevMonth = (date) => {
    let dateMoment = moment(date)
    dateMoment.subtract('1', 'month')
    return dateMoment.toDate();
}

export { nextMonth, prevMonth }
