class ListManager {
    constructor(container, measureCount, title) {
        this.refreshRate = 30 * 1000;
        this.imageHeight = 60;
        this.titleFontSize = 20;
        this._measureCount = measureCount;
        this.__title = title;
        this.__startIndex = 0;
        this._listContainer = this.createMarkup({
            tag: "div",
            className: "list-container",
            children: [
                {
                    tag: "h1",
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
    get element() {
        return this._listContainer;
    }
    setColor(color) {
        this._listContainer.style.borderLeft = "8px solid " + color;
    }
    refresh() {
        this.retrieveItems();
    }
    render() {
        this._listItemsElement.innerHTML = '';
        for (var i = this.__startIndex; i < (this.__startIndex + this._measureCount); i++) {
            var tiles = this._listItemsElement.getElementsByClassName("tile-container");
            var lastChild = tiles[tiles.length - 1];
            var lastHeight = lastChild ? lastChild.offsetHeight : 0;
            if (this._listItemsElement.offsetHeight + lastHeight > this._listContainer.offsetHeight) {
                return;
            }
            if (this._listItems[i]) {
                this.renderTile(this._listItems[i]);
            }
        }
    }
    renderTile(item) {
        this._listItemsElement.appendChild(this.createMarkup({
            tag: "div",
            className: "tile-container",
            children: [
                {
                    tag: "div",
                    classNames: ["tile", this.getStatusClass(item)],
                    events: [{
                            name: "click",
                            callback: function () { window.open(item.link, '_blank'); }
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
    getStatusClass(item) {
        switch (item.status) {
            case Status.blue:
                return "tile-blue";
            case Status.green:
                return "tile-green";
            default:
                return "";
        }
    }
    createMarkup(tree, trackingObject) {
        var element = document.createElement(tree.tag);
        var classes = tree.classNames || [];
        classes.push(tree.className);
        element.className = classes.join(" ");
        if (tree.innerText) {
            element.innerHTML = tree.innerText;
        }
        if (tree.key) {
            trackingObject[tree.key] = element;
        }
        if (tree.attributes) {
            tree.attributes.forEach(({ name, value }) => {
                element.setAttribute(name, value);
            });
        }
        if (tree.events) {
            tree.events.forEach(({ name, callback }) => {
                element.addEventListener(name, callback);
            });
        }
        tree.children && tree.children.forEach((child) => {
            element.appendChild(this.createMarkup(child, trackingObject));
        });
        return element;
    }
}
class ListItem {
    constructor() {
        this.imageURL = "Images/blank.png";
    }
}
var Status;
(function (Status) {
    Status[Status["normal"] = 0] = "normal";
    Status[Status["blue"] = 1] = "blue";
    Status[Status["green"] = 2] = "green";
})(Status || (Status = {}));
