declare function require(name: string);
const {ipcRenderer} = require('electron');

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
        var tile = this.createElement(this.__listItemsElement, "div", "tile");
        tile.addEventListener("click", function() { 
             ipcRenderer.send('launch-stream', item.title);
        }.bind(this));

        var image = this.createElement(tile, "img", "tile-image");
        image.setAttribute("src", item.imageURL);
        var titleLine = this.createElement(tile, "div", "tile-title-line", item.title);
        var line1 = this.createElement(tile, "div", "tile-line", item.line1);
        var line2 = this.createElement(tile, "div", "tile-line", item.line2);
    }

    private renderTitle(): void {
        this.__titleElement = this.createElement(this.__listContainer, "h1", "list-title", this.__title);
        
        this.__pageUpElement = this.createElement(this.__listContainer, "img", "nav page-up");
        this.__pageUpElement.setAttribute("src", "Images/TriangleUp.png");

        this.__pageDownElement = this.createElement(this.__listContainer, "img", "nav page-down");
        this.__pageDownElement.setAttribute("src", "Images/TriangleDown.png");
    }

    private createElement(container: HTMLElement, type: string, classNames: string = "", innerText: string = ""): HTMLElement {
        var element = document.createElement(type);
        element.className = classNames;
        if (innerText) element.innerText = innerText;
        container.appendChild(element);
        return element;
    }
}

class ListItem {
    public title: string;
    public line1: string;
    public line2: string;
    public details: string;
    public imageURL: string;
    public link: string;
    public statusColor: string;
}