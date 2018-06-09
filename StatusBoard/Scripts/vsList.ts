/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

abstract class VSList extends ListManager {

    private __renderedDate: string;
    private __comp1: HTMLElement;
    private __comp2: HTMLElement;
    private __img1: HTMLElement;
    private __img2: HTMLElement;

    protected renderTile(item: VSListItem): void {
        if (this.__renderedDate !== item.date) {
            this._listItemsElement.appendChild(this.createMarkup({
                tag: "div",
                className: "vs-list-tile-date-line",
                innerText: item.date
            }));
            this.__renderedDate = item.date;
        }

        this._listItemsElement.appendChild(this.createMarkup({
            tag: "div",
            className: "vs-list-tile-container",
            children: [
                {
                    tag: "div",
                    classNames: ["tile" , item.live ? "tile-green" : "" ],
                    children: [
                        {
                            tag: "span",
                            className: "vs-comp-1",
                            key: "__comp1",
                            children: [
                                {
                                    tag: "img",
                                    className: "vs-tile-image",
                                    key: "__img1",
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
                            key: "__comp2",
                            children: [
                                {
                                    tag: "img",
                                    key: "__img2",
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
        }, this));

        // Comp 1
        //this.__comp1.style.borderLeft = "15px solid #" + item.competitor1.primaryColor;
        //this.__comp2.style.borderRight = "15px solid #" + item.competitor2.primaryColor;

        this.__img1.style.backgroundColor = "#" + item.competitor1.primaryColor;
        this.__img2.style.backgroundColor = "#" + item.competitor2.primaryColor;

        // this.__comp1.style.background = 
        //     "linear-gradient(to right, #" + item.competitor1.primaryColor +", transparent)";
        // this.__comp2.style.background = "linear-gradient(to right, transparent, #" + item.competitor2.primaryColor + ")";

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
    public live: boolean;
}

class Competitor {
    public name: string;
    public imageURL: string;
    public primaryColor: string;
    public secondaryColor: string;
}