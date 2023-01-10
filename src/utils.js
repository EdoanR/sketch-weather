
export function randNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randArray(arr) {
    return arr[randNumber(0, arr.length - 1)]
}

export function randId() {
    return randNumber(10000000, 99999999)
}

export function getDateWithTimezoneOffset(timestamp) {
    let date = new Date(timestamp)
    date = new Date(timestamp + ( date.getTimezoneOffset() * 60 * 1000 ))
    return date
}