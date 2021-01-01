export class DateUtils
{
    public static getDaysFrom(date: Date): number
    {
        if (!date) return 0;
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    }

    public static onSameDay(date: Date, other: Date): boolean
    {
        return date.getDate() === other.getDate() &&
            date.getMonth() === other.getMonth() &&
            date.getFullYear() === other.getFullYear();
    }

    public static isToday(date: Date): boolean
    {
        return this.onSameDay(date, new Date());
    }

    public static isTomorrow(date: Date): boolean
    {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.onSameDay(date, tomorrow);
    }

    public static getDateString(date: Date): string
    {
        if (!date) return "";

        if (isNaN(date.getTime()))
        {
            return "Live";
        }

        return `${this.getDayString(date)} ${this.getTimeString(date)}`;
    }

    public static getDayString(date: Date): string
    {
        if (!date) return "";

        if (this.isToday(date))
        {
            return "Today";
        }

        if (this.isTomorrow(date))
        {
            return "Tomorrow";
        }

        const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const dayOfWeek = dayOfWeekNames[date.getDay()];

        const daysFrom = this.getDaysFrom(date);
        if (daysFrom < 6)
        {
            return `${dayOfWeek}`;
        }
        else
        {
            return `${month} ${day}`;
        }
    }

    public static getTimeString(date: Date): string 
    {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var minutesString = (minutes < 10) ? "0" + minutes : minutes;
        var amPm = (hour >= 12 && hour < 24) ? "PM" : "AM";
        if (hour === 0) { amPm = "PM"; }
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;

        return `${hour}:${minutesString} ${amPm}`
    }

    public static getCountdownString(date: Date): string
    {
        if (!date) { return "Live now"; }

        var daysFrom = this.getDaysFrom(date);
        var days = Math.floor(daysFrom);
        var hoursFrom = (daysFrom - days) * 24;
        var hours = Math.floor(hoursFrom);
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);

        return days + "d " + hours + "h " + minutes + "m";
    }

    public static getAgoString(date: Date): string
    {
        const daysAgo = -this.getDaysFrom(date);
        const yearsAgo = Math.floor(daysAgo / 365);
        if (yearsAgo > 1)
        {
            return `${yearsAgo} years ago`;
        }

        const monthsAgo = Math.floor(daysAgo / 28);
        if (monthsAgo >= 2)
        {
            return `${monthsAgo} months ago`;
        }

        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo > 1) return `${weeksAgo} weeks ago`;
        if (weeksAgo == 1) return `1 week ago`;

        const days = Math.floor(daysAgo);
        var hoursFrom = (daysAgo - days) * 24;
        var hours = Math.floor(hoursFrom);
        if (days >= 1)
        {
            let agoString = `${days > 1 ? `${days} days` : "1 day"}`;
            if (days < 2 && hours > 0)
            {
                agoString += ` ${hours > 1 ? `${hours} hours` : "1 hour"}`;
            }
            return agoString + " ago";
        }

        if (hours > 2) return `${hours} hours ago`;

        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);
        if (hours >= 1)
        {
            let agoString = `${hours > 1 ? `${hours} hours` : "1 hour"}`;
            if (minutes > 0)
            {
                agoString += ` ${minutes > 1 ? `${minutes} minutes` : "1 minute"}`;
            }
            return agoString + " ago";
        }

        return `${minutes} minutes ago`;
    }

    public static isLive(startDate: Date, endDate: Date)
    {
        if (!startDate || !endDate) { return false; }

        const now = new Date().valueOf();
        return startDate.valueOf() <= now && now <= endDate.valueOf();
    }
}