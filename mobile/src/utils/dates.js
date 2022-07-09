// Parse a date to week day
function parseDateToWeekDay(date) {
    if (!date)
        return null

    const usedDate = new Date(date)
    const day = usedDate.getDate()
    const month = usedDate.getMonth() + 1
    const year = usedDate.getFullYear()
    const hours = usedDate.getHours()
    const minutes = usedDate.getUTCMinutes()

    console.log(typeof(minutes))

    return `${day}/${month}/${year} ${hours}h${minutes}`
}

export {
    parseDateToWeekDay
}
