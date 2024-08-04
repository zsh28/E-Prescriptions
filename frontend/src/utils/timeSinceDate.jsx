
export function timeSinceDate(date) {
    const currentDate = new Date();
    const millisecondsDiff = currentDate - date;
    const secondsDiff = Math.floor(millisecondsDiff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);

    if (daysDiff > 30) {
        return "> 30 days ago";
    } else if (hoursDiff < 1) {
        return "Less than an hour ago";
    } else if (hoursDiff < 24) {
        return `${hoursDiff} hours ago`;
    } else {
        return `${daysDiff} days ago`;
    }
}
