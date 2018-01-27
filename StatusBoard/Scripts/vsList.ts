/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

abstract class VSList extends ListManager {

    private __renderedDate: string;

    protected renderTile(item: VSListItem): void {
        if (this.__renderedDate !== item.date) {
            this._listItemsElement.appendChild(this.createMarkup({
                tag: "div",
                className: "vs-list-tile-date-line",
                innerText: item.date
            }))
            this.__renderedDate = item.date;
        }

        this._listItemsElement.appendChild(this.createMarkup({
            tag: "div",
            className: "vs-list-tile-container",
            children: [
                {
                    tag: "div",
                    className: "tile",
                    children: [
                        {
                            tag: "span",
                            className: "vs-comp-1",
                            children: [
                                {
                                    tag: "img",
                                    className: "vs-tile-image",
                                    attributes: [{ name: "src", value: item.competitor1.imageURL}]
                                },
                                {
                                    tag: "span",
                                    className: "tile-tile-line",
                                    innerText: item.competitor1.name
                                }
                            ]
                        }, 
                        {
                            tag: "span",
                            className: "vs-tile-time",
                            innerText: item.time
                        },
                        {
                            tag: "span",
                            className: "vs-comp-2",
                            children: [
                                {
                                    tag: "img",
                                    className: "vs-tile-image",
                                    attributes: [{ name: "src", value: item.competitor2.imageURL}]
                                },
                                {
                                    tag: "span",
                                    className: "tile-tile-line",
                                    innerText: item.competitor2.name
                                }
                            ]
                        }, 
                    ]
                }
            ]
        }));

        // Comp 1
        //comp1.style.backgroundColor = "#" + item.competitor1.primaryColor;
        //comp1.style.color = "#" + item.competitor1.secondaryColor;

        // Comp 2
        //comp2.style.backgroundColor = "#" + item.competitor2.primaryColor;
        //comp2.style.color = "#" + item.competitor2.secondaryColor;
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