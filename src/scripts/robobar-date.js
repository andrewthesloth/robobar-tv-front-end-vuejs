export default class RobobarDate extends Date {
    
    /**
     * Expects either a string in format 'YYYY-MM-DD-HH-mm-ss' or an instance of Date.
     * 
     * @param  {String} date
     */
    constructor(date) {
        if (typeof(date) === "string") {
            super();

            const stringToDateRegEx = 
                /(?<year>[0-9]{4})-(?<month>[0-9]{1,2})-(?<day>[0-9]{1,2})/.source +
                /-(?<hours>[0-9]{1,2})-(?<minutes>[0-9]{1,2})-(?<seconds>[0-9]{1,2})/.source;
            const reMatch = date.match(stringToDateRegEx);

            if (reMatch) {
                this.setFullYear(reMatch.groups.year);
                this.setMonth(reMatch.groups.month - 1);
                this.setDate(reMatch.groups.day);
                this.setHours(reMatch.groups.hours);
                this.setMinutes(reMatch.groups.minutes);
                this.setSeconds(reMatch.groups.seconds);
            } else {
                console.log(
                    "RobobarDate could not be initialized, the input string has invalid format.\
                    Accepted format is YYYY-MM-DD-HH-mm-ss."
                );
            }
        } else {
            super(date);
        }
    }
    
    /**
     * Returns Date as a string in format 'YYYY-MM-DD-HH-mm-ss'.
     * 
     * @returns {String} dateString
     */
    toString() {
        const dateStringFormat = (year, month, day, hour, minute, second) =>
            `${year}-` +
            `${month.toString().padStart(2,0)}-` +
            `${day.toString().padStart(2,0)}-` +
            `${hour.toString().padStart(2,0)}-` +
            `${minute.toString().padStart(2,0)}-` +
            `${second.toString().padStart(2,0)}`;

        const dateString = dateStringFormat(
            this.getFullYear(),
            this.getMonth() + 1,
            this.getDate(),
            this.getHours(),
            this.getMinutes(),
            this.getSeconds()
        );

        return dateString;
    }
}
