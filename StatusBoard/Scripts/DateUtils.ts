class DateUtils {
    public static getDaysFrom(date: Date): number {
        if (!date) return 0;
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60  * 60 * 24);
    }

    public static getDateString(date: Date): string {
        var monthNames = [ "Jan", "Feb", "Mar", "April", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
        var dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        if (!date) return "";

        if (isNaN(date.getTime())) {
            return "Live";
        }

        var locale = "en-us";
        var month = monthNames[date.getMonth()];
        var day = date.getDate();
        var dayOfWeek = dayOfWeekNames[date.getDay()];
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var minutesString = (minutes < 10) ? "0" + minutes : minutes;
        var amPm = (hour > 12) ? "PM" : "AM";
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;

        if (this.getDaysFrom(date) < 7) {
            return `${dayOfWeek} - ${hour}:${minutesString} ${amPm}`;
        } 
        else {
            return `${month} ${day} - ${hour}:${minutesString} ${amPm}`
        }

        return month + " " + day + " - " + dayOfWeek + " " + hour + ":" + minutesString + " " + amPm;
    }

    public static getCountdownString(date: Date): string {
        if (!date) { return "Live now"; }

        var daysFrom = this.getDaysFrom(date);
        var days = Math.floor(daysFrom);
        var hoursFrom = (daysFrom - days) * 24;
        var hours = Math.floor(hoursFrom);
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);

        return days + "d " + hours + "h " + minutes + "m";
    }
}