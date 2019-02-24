/// <reference path="listmanager.ts"/>

abstract class GroupedList extends ListManager
{

    protected noHighlight: boolean = false;
    private __groups: { [key: string]: HTMLElement } = {};
    private __groupColor: string;

    protected render()
    {
        this.__groups = {};
        super.render();
    }

    public setColor(color: string): void
    {
        //this.__groupColor = color;
        super.setColor(color);
    }

    protected renderTile(item: GroupedListItem): void
    {
        let group: HTMLElement = this.__groups[item.groupName.toLowerCase()];
        if (!group)
        {
            group = this._listItemsElement.appendChild(this.createMarkup({
                tag: "div",
                className: "list-group card",
                children: [
                    {
                        tag: "span",
                        className: "list-group-container",
                        children: [
                            {
                                tag: "img",
                                classNames: ["group-image", item.groupIcon ? "" : "no-disp"],
                                attributes: [{ name: "src", value: item.groupIcon }]
                            }, {
                                tag: "span",
                                attributes: [{ name: "style", value: "color: " + this.__groupColor }],
                                className: "list-group-name",
                                innerText: item.groupName,
                            }]
                    }]
            }));
            this.__groups[item.groupName.toLowerCase()] = group;
            this._listItemsElement.appendChild(group);
        }

        group.appendChild(this.createMarkup({
            tag: "div",
            className: "tile-container",
            children: [
                {
                    tag: "div",
                    classNames: [
                        "tile",
                        this.getStatusClass(item),
                        item.highlight ? "tile-highlight" : "",
                        this.noHighlight ? "no-highlight" : ""
                    ],
                    events: [{
                        name: "click",
                        callback: function () { window.open(item.link, '_blank'); }
                    }],
                    children: [
                        {
                            tag: "img",
                            classNames: ["tile-image", item.imageURL ? "" : "no-disp"],
                            attributes: [
                                { name: "src", value: item.imageURL },
                                { name: "height", value: this.imageHeight + "" }
                            ]
                        },
                        {
                            tag: "div",
                            className: "tile-title-line",
                            innerText: item.title,
                            attributes: [
                                { name: "style", value: "font-size: " + this.titleFontSize + "pt" }
                            ]
                        },
                        {
                            tag: "div",
                            className: "tile-line",
                            innerText: item.line1
                        },
                        {
                            tag: "div",
                            className: "tile-line-2",
                            innerText: item.line2
                        },
                        {
                            tag: "div",
                            className: "tile-details",
                            innerText: item.details
                        }
                    ]
                }
            ]
        } as any));
    }
}


class GroupedListItem extends ListItem
{
    public groupName: string;
    public groupIcon: string;
    public highlight: boolean;
}