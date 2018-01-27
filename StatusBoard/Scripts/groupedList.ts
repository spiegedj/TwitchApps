/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

abstract class GroupedList extends ListManager {

    private __groups: { [key: string]: HTMLElement} = {};

    protected render() {
        this.__groups = {};
        super.render();
    }

    protected renderTile(item: GroupedListItem): void {
        let group: HTMLElement = this.__groups[item.groupName];
        if (!group) {
            group = this._listItemsElement.appendChild(this.createMarkup({
                tag: "div",
                className: "vs-list-group",
                children: [
                    {
                        tag: "span",
                        className: "vs-list-group-name",
                        innerText: item.groupName,
                    }]
            }));
            this.__groups[item.groupName] = group;
            this._listItemsElement.appendChild(group);
        }

        group.appendChild(this.createMarkup({
            tag: "div",
            className: "tile-container",
            children: [
                {
                    tag:"div",
                    classNames: ["tile"],
                    events: [{ 
                        name: "click", 
                        callback: function() { window.open( item.link, '_blank'); }
                    }],
                    children: [
                        {
                            tag: "img",
                            className: "tile-image",
                            attributes: [{ name: "src", value: item.imageURL}]
                        },
                        {
                            tag: "div",
                            className: "tile-title-line",
                            innerText: item.title
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
        }));
    }

    protected renderTitle(): void { }
}


class GroupedListItem extends ListItem {
    public groupName: string;
}