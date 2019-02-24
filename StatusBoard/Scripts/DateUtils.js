class DateUtils {
    static getDaysFrom(date) {
        if (!date)
            return 0;
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    }
    static onSameDay(date, other) {
        return date.getDate() === other.getDate() &&
            date.getMonth() === other.getMonth() &&
            date.getFullYear() === other.getFullYear();
    }
    static isToday(date) {
        return this.onSameDay(date, new Date());
    }
    static isTomorrow(date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.onSameDay(date, tomorrow);
    }
    static getDateString(date) {
        if (!date)
            return "";
        if (isNaN(date.getTime())) {
            return "Live";
        }
        return `${this.getDayString(date)} ${this.getTimeString(date)}`;
    }
    static getDayString(date) {
        if (!date)
            return "";
        if (this.isToday(date)) {
            return "Today";
        }
        if (this.isTomorrow(date)) {
            return "Tomorrow";
        }
        const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const dayOfWeek = dayOfWeekNames[date.getDay()];
        const daysFrom = this.getDaysFrom(date);
        if (daysFrom < 6) {
            return `${dayOfWeek}`;
        }
        else {
            return `${month} ${day}`;
        }
    }
    static getTimeString(date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var minutesString = (minutes < 10) ? "0" + minutes : minutes;
        var amPm = (hour > 12) ? "PM" : "AM";
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;
        return `${hour}:${minutesString} ${amPm}`;
    }
    static getCountdownString(date) {
        if (!date) {
            return "Live now";
        }
        var daysFrom = this.getDaysFrom(date);
        var days = Math.floor(daysFrom);
        var hoursFrom = (daysFrom - days) * 24;
        var hours = Math.floor(hoursFrom);
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);
        return days + "d " + hours + "h " + minutes + "m";
    }
    static isLive(startDate, endDate) {
        if (!startDate || !endDate) {
            return false;
        }
        const now = new Date().valueOf();
        return startDate.valueOf() <= now && now <= endDate.valueOf();
    }
}
