abstract class ListManager {
    protected __listItems: ListItem[];

    private __listContainer: HTMLElement;
    private __listItemsElement: HTMLElement;
    private __titleElement: HTMLElement;
    private __pageUpElement: HTMLElement;
    private __pageDownElement: HTMLElement;

    private __expandedIndex: number;
    private __pageNumber: number;
    private __measureCount: number;
    private __title: string;
    private __startIndex: number;

    private readonly refreshRate: number = 30 * 1000;

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        this.__listContainer = this.createElement(container, "div", "list-container");
        this.__measureCount = measureCount;
        this.__title = title;
        this.__startIndex = 0;

        this.renderTitle();
        this.__listItemsElement = this.createElement(this.__listContainer, "div");

        setInterval(this.refresh.bind(this), this.refreshRate);
    }

    public setBackgroundColor(color: string) : void {
        this.__listContainer.style.backgroundColor = color;
    }

    public setHeight(height: number)
    {
        this.__listContainer.style.height = height + "px";
    }

    protected abstract retrieveItems();

    public refresh() : void {
        this.retrieveItems();
    }

    public setPosition(top: string, left: string, right: string, bottom: string): void {
        top = top !== "" ? top + "px" : "";
        right = right !== "" ? right + "px" : "";
        left = left !== "" ? left + "px" : "";
        bottom = bottom !== "" ? bottom + "px" : "";

        this.__listContainer.style.top = top;
        this.__listContainer.style.right = right;
        this.__listContainer.style.left = left;
        this.__listContainer.style.bottom = bottom;
    }

    protected render() : void {
        this.__listItemsElement.innerHTML = '';
        for (var i = this.__startIndex; i < (this.__startIndex + this.__measureCount); i++) {
            if (this.__listItems[i]) {
                this.renderTile(this.__listItems[i]);
            }
        }
    }

    private renderTile(item: ListItem): void {
        var tileContainer = this.createElement(this.__listItemsElement, "div", "tile-container");
        var tile = this.createElement(tileContainer, "div", ["tile", this.getStatusClass(item)].join(" "));
        tile.addEventListener("click", function() { window.open( item.link, '_blank'); });

        var image = this.createElement(tile, "img", "tile-image");
        image.setAttribute("src", item.imageURL);
        var titleLine = this.createElement(tile, "div", "tile-title-line", item.title);
        var line1 = this.createElement(tile, "div", "tile-line", item.line1);
        var line2 = this.createElement(tile, "div", "tile-line-2", item.line2);
        var details = this.createElement(tile, "span", "tile-details", item.details);
    }

    private renderTitle(): void {
        this.__titleElement = this.createElement(this.__listContainer, "h1", "list-title", this.__title);
    }

    private createElement(container: HTMLElement, type: string, classNames: string = "", innerText: string = ""): HTMLElement {
        var element = document.createElement(type);
        element.className = classNames;
        if (innerText) element.innerText = innerText;
        container.appendChild(element);
        return element;
    }

    private getStatusClass(item: ListItem) : string {
        switch (item.status) {
            case Status.blue:
                return "tile-blue";
            case Status.green:
                return "tile-green";
            default :
                return "";
        }
    }
}

class ListItem {
    public title: string;
    public line1: string;
    public line2: string;
    public details: string;
    public imageURL: string;
    public link: string;
    public status: Status;
}

enum Status {
    normal,
    blue,
    green
}