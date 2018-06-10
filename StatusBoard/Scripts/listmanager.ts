abstract class ListManager {
    protected _listContainer: HTMLElement;
    protected _listItems: ListItem[];
    protected _listItemsElement: HTMLElement;
    protected _measureCount: number;

    private __titleElement: HTMLElement;
    private __pageUpElement: HTMLElement;
    private __pageDownElement: HTMLElement;

    private __expandedIndex: number;
    private __pageNumber: number;
    private __title: string;
    private __startIndex: number;

    public refreshRate: number = 30 * 1000;
    public imageHeight: number = 60;
    public titleFontSize: number = 20;

    public get element(): HTMLElement {
        return this._listContainer;
    }

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        this._measureCount = measureCount;
        this.__title = title;
        this.__startIndex = 0;

        this._listContainer = this.createMarkup({
            tag : "div", 
            className: "list-container",
            children: [
                {
                    tag:"h1",
                    className: "list-title",
                    innerText: this.__title,
                    key: "__titleElement"
                }, 
                {
                    tag: "div",
                    key: "_listItemsElement"
                }
            ]
        }, this);
        container.appendChild(this._listContainer);

        if (!this.__title) {
            this.__titleElement.style.display = "none";
        }

        setInterval(this.refresh.bind(this), this.refreshRate);
    }

    public setColor(color: string) : void {
        this._listContainer.style.borderLeft = "8px solid " + color;
    }

    protected abstract retrieveItems();

    public refresh() : void {
        this.retrieveItems();
    }

    protected render() : void {
        this._listItemsElement.innerHTML = '';
        for (var i = this.__startIndex; i < (this.__startIndex + this._measureCount); i++) {
            var tiles = this._listItemsElement.getElementsByClassName("tile-container");
            var lastChild = tiles[tiles.length - 1] as HTMLElement;
            var lastHeight = lastChild ? lastChild.offsetHeight : 0;

            if (this._listItemsElement.offsetHeight + lastHeight > this._listContainer.offsetHeight) {
                return;
            }

            if (this._listItems[i]) {
                this.renderTile(this._listItems[i]);
            }
        }
    }

    protected renderTile(item: ListItem): void {
        this._listItemsElement.appendChild(this.createMarkup({
            tag: "div",
            className: "tile-container",
            children: [
                {
                    tag:"div",
                    classNames: ["tile", this.getStatusClass(item)],
                    events: [{ 
                        name: "click", 
                        callback: function() { window.open( item.link, '_blank'); }
                    }],
                    children: [
                        {
                            tag: "img",
                            className: "tile-image",
                            attributes: [
                                { name: "src", value: item.imageURL },
                                { name: "height", value: this.imageHeight + "" }
                            ]
                        },
                        {
                            tag: "div",
                            className: "tile-title-line",
                            innerText: item.title
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
        }));
    }

    protected getStatusClass(item: ListItem) : string {
        switch (item.status) {
            case Status.blue:
                return "tile-blue";
            case Status.green:
                return "tile-green";
            default :
                return "";
        }
    }

    protected createMarkup(tree: DomElement, trackingObject?: any): HTMLElement {
        var element = document.createElement(tree.tag);

        var classes = tree.classNames || [];
        classes.push(tree.className);
        element.className = classes.join(" ");

        if (tree.innerText) {
            element.innerText = tree.innerText;
        }

        if (tree.key) {
            trackingObject[tree.key] = element;
        }

        if (tree.attributes) {
            tree.attributes.forEach(({name, value}) => {
                element.setAttribute(name, value);
            })
        }

        if (tree.events) {
            tree.events.forEach(({name, callback}) => {
                element.addEventListener(name, callback);
            });
        }

        tree.children && tree.children.forEach((child: DomElement) => {
            element.appendChild(this.createMarkup(child, trackingObject));
        });

        return element;
    }
}

interface DomElement { 
    tag?: string;
    classNames?: string[];
    className?: string;
    innerText?: string;
    key?: string;
    attributes?: [
        { name: string, value: string}
    ],
    events?: [
        { name: string, callback: any}
    ]
    children?: DomElement[];
}

class ListItem {
    public title: string;
    public line1: string;
    public line2: string;
    public details: string;
    public imageURL: string = "Images/blank.png";
    public link: string;
    public status: Status;
    public sortKey: number;
}

enum Status {
    normal,
    blue,
    green
}