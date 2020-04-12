/**
 * Calculates a short, lovely looking time string.
 * @param ts Total seconds.
 * @returns The short, lovely looking time string.
 */
export function prettyTimeString(ts: number) {
    let seconds = Math.round(ts) % 60;
    let minutes = Math.floor(ts / 60) % 60;
    let hours = Math.floor(ts / 3600);
    if (ts < 60) {
        // Show only seconds
        return `${seconds} sec`
    } else if (ts < (60 * 60)) {
        // Show minutes and seconds
        return `${minutes}:${seconds} min`
    } else {
        // Show hours and minutes
        if (minutes > 9) {
            return `${hours}:${minutes} hrs`
        } else {
            return `${hours}:0${minutes} hrs`
        }
    }
}