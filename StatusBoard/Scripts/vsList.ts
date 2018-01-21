/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

abstract class VSList extends ListManager {

    private __renderedDate: string;

    protected renderTile(item: VSListItem): void {
        if (this.__renderedDate !== item.date) {
            let tileContainer = this.createElement(this._listItemsElement, "div", "vs-list-tile-date-line", item.date);
            this.__renderedDate = item.date;
        }

        var tileContainer = this.createElement(this._listItemsElement, "div", "vs-list-tile-container");
        var tile = this.createElement(tileContainer, "div", "tile");

        // Comp 1
        var comp1 = this.createElement(tile, "span", "vs-comp-1");
        //comp1.style.backgroundColor = "#" + item.competitor1.primaryColor;
        //comp1.style.color = "#" + item.competitor1.secondaryColor;

        var image1 = this.createElement(comp1, "img", "vs-tile-image");
        image1.setAttribute("src", item.competitor1.imageURL);
        var title1 = this.createElement(comp1, "span", "tile-tile-line", item.competitor1.name);

        var timeLine = this.createElement(tile, "span", "vs-tile-time", item.time);

        // Comp 2
        var comp2 = this.createElement(tile, "span", "vs-comp-2");
        //comp2.style.backgroundColor = "#" + item.competitor2.primaryColor;
        //comp2.style.color = "#" + item.competitor2.secondaryColor;

        var image2 = this.createElement(comp2, "img", "vs-tile-image");
        image2.setAttribute("src", item.competitor2.imageURL);
        var title1 = this.createElement(comp2, "span", "tile-tile-line", item.competitor2.name);
    }
}

class VSListItem extends ListItem {
    public competitor1: Competitor;
    public competitor2: Competitor;
    public date: string;
    public time: string;
}

class Competitor {
    public name: string;
    public imageURL: string;
    public primaryColor: string;
    public secondaryColor: string;
}