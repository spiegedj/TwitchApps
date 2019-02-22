class DateUtils
{
    public static getDaysFrom(date: Date): number
    {
        if (!date) return 0;
        var now = new Date();
        return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    public static onSameDay(date: Date, other: Date): boolean
    {
        return date.getDate() === other.getDate() &&
            date.getMonth() === other.getMonth() &&
            date.getFullYear() === other.getFullYear();
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

        const daysFrom = this.getDaysFrom(date);
        if (daysFrom === 0)
        {
            return "Today";
        }

        if (daysFrom === 1)
        {
            return "Tomorrow";
        }

        const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const dayOfWeek = dayOfWeekNames[date.getDay()];

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
        var amPm = (hour > 12) ? "PM" : "AM";
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

    public static isLive(startDate: Date, endDate: Date)
    {
        if (!startDate || !endDate) { return false; }

        const now = new Date().valueOf();
        return startDate.valueOf() <= now && now <= endDate.valueOf();
    }
}