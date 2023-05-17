
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

export function lerp(x, y, a) {
    return x * (1 - a) + y * a;
}

export function isDev() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function celsiusToFahrenheit(celsius) {
	return celsius * 9 / 5 + 32;
}

export async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}