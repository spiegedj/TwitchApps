"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
class DateUtils {
    static isTodayOrInFuture(date) {
        return this.isToday(date)
            || (date.valueOf() > (new Date()).valueOf());
    }
    static isTodayOrInPast(date) {
        return this.isToday(date)
            || (date.valueOf() <= (new Date()).valueOf());
    }
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
    static isTodayOrTomorrow(date) {
        return this.isToday(date) || this.isTomorrow(date);
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
        var amPm = (hour >= 12 && hour < 24) ? "PM" : "AM";
        if (hour === 0) {
            amPm = "PM";
        }
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;
        return `${hour}:${minutesString} ${amPm}`;
    }
    static getCountdownString(date) {
        const daysFrom = this.getDaysFrom(date);
        if (daysFrom < 6) {
            return `Starting ${this.getDayString(date)}`;
        }
        else {
            return `In ${Math.ceil(daysFrom)} days`;
        }
    }
    static getAgoString(date) {
        const daysAgo = -this.getDaysFrom(date);
        const yearsAgo = Math.floor(daysAgo / 365);
        if (yearsAgo > 1) {
            return `${yearsAgo} years ago`;
        }
        const monthsAgo = Math.floor(daysAgo / 28);
        if (monthsAgo >= 2) {
            return `${monthsAgo} months ago`;
        }
        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo > 1)
            return `${weeksAgo} weeks ago`;
        if (weeksAgo == 1)
            return `1 week ago`;
        const days = Math.floor(daysAgo);
        var hoursFrom = (daysAgo - days) * 24;
        var hours = Math.floor(hoursFrom);
        if (days >= 1) {
            let agoString = `${days > 1 ? `${days} days` : "1 day"}`;
            if (days < 2 && hours > 0) {
                agoString += ` ${hours > 1 ? `${hours} hours` : "1 hour"}`;
            }
            return agoString + " ago";
        }
        if (hours > 2)
            return `${hours} hours ago`;
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);
        if (hours >= 1) {
            let agoString = `${hours > 1 ? `${hours} hours` : "1 hour"}`;
            if (minutes > 0) {
                agoString += ` ${minutes > 1 ? `${minutes} minutes` : "1 minute"}`;
            }
            return agoString + " ago";
        }
        return `${minutes} minutes ago`;
    }
    static isLive(startDate, endDate) {
        if (!startDate || !endDate) {
            return false;
        }
        const now = new Date().valueOf();
        return startDate.valueOf() <= now && now <= endDate.valueOf();
    }
}
exports.DateUtils = DateUtils;
