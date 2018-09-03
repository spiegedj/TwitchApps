/// <reference path="vsList.ts"/>

class OverwatchLeague extends VSList {

    private __flipColorsList = [
        "BOSTON UPRISING",
        "SAN FRANCISCO SHOCK",
        "HOUSTON OUTLAWS"
    ];
    private __flipColors(competitor: Competitor): void {
        if (this.__flipColorsList.indexOf(competitor.name.toUpperCase()) > -1) {
            var swap = competitor.primaryColor;
            competitor.primaryColor = competitor.secondaryColor;
            competitor.secondaryColor = swap;
        }
    }

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        super(container, measureCount, title);
        this.retrieveItems();
        this.setColor("#FF8820");
    }

    protected retrieveItems() {
        $.get("https://api.overwatchleague.com/schedule?locale=en_US", function(json) {
            this.parseMatches(json);
        }.bind(this));
    }

    private parseMatches(json: any) {
        this._listItems = [];
        let stages: any[] = json.data.stages;
        stages.forEach((stage) => {
            let matches: any[] = stage.matches;
            matches.forEach((match) => {
                let matchState: string = match.state;
                if (matchState.toUpperCase() !== "CONCLUDED" && match.competitors.length === 2) {
                    let competitor1: any = match.competitors[0];
                    let competitor2: any = match.competitors[1];

                    if (competitor1 && competitor2) {
                        var listItem = new VSListItem();

                        listItem.competitor1 = {
                            imageURL: competitor1.icon,
                            name: competitor1.name.toUpperCase(),
                            primaryColor: competitor1.primaryColor,
                            secondaryColor: competitor1.secondaryColor,
                        }

                        listItem.competitor2 = {
                            imageURL: competitor2.icon,
                            name: competitor2.name.toUpperCase(),
                            primaryColor: competitor2.primaryColor,
                            secondaryColor: competitor2.secondaryColor,
                        }

                        this.__flipColors(listItem.competitor1);
                        this.__flipColors(listItem.competitor2);

                        var startDate = new Date(match.startDateTS);
                        var endDate= new Date(match.endDateTS);

                        listItem.date = startDate.toLocaleDateString();

                        var now = new Date().getTime();
                        if (now > match.startDateTS && now < match.endDateTS) {
                            listItem.time = match.scores[0].value + " - " + match.scores[1].value;
                            listItem.live = true;
                        } else {
                            listItem.time = this.getTimeString(startDate);
                        }

                        listItem.sortKey = match.startDateTS;

                        this._listItems.push(listItem);
                    }
                }
            });
        });

        this._listItems.sort((a: ListItem, b:ListItem) => {
            return a.sortKey - b.sortKey;
        });

        this.render();
    }
    
    private getTimeString(date: Date): string {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var minutesString = (minutes < 10) ? "0" + minutes : minutes;
        var amPm = (hour > 12) ? "PM" : "AM";
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;

        return hour + ":" + minutesString + " " + amPm;
    }
}