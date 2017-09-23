var ListManager = (function () {
    function ListManager(container, measureCount, title) {
        this.refreshRate = 30 * 1000;
        this.__listContainer = this.createElement(container, "div", "list-container");
        this.__measureCount = measureCount;
        this.__title = title;
        this.__startIndex = 0;
        this.renderTitle();
        this.__listItemsElement = this.createElement(this.__listContainer, "div");
        setInterval(this.refresh.bind(this), this.refreshRate);
    }
    ListManager.prototype.setBackgroundColor = function (color) {
        this.__listContainer.style.backgroundColor = color;
    };
    ListManager.prototype.setHeight = function (height) {
        this.__listContainer.style.height = height + "px";
    };
    ListManager.prototype.refresh = function () {
        this.retrieveItems();
    };
    ListManager.prototype.setPosition = function (top, left, right, bottom) {
        top = top !== "" ? top + "px" : "";
        right = right !== "" ? right + "px" : "";
        left = left !== "" ? left + "px" : "";
        bottom = bottom !== "" ? bottom + "px" : "";
        this.__listContainer.style.top = top;
        this.__listContainer.style.right = right;
        this.__listContainer.style.left = left;
        this.__listContainer.style.bottom = bottom;
    };
    ListManager.prototype.render = function () {
        this.__listItemsElement.innerHTML = '';
        for (var i = this.__startIndex; i < (this.__startIndex + this.__measureCount); i++) {
            if (this.__listItems[i]) {
                this.renderTile(this.__listItems[i]);
            }
        }
    };
    ListManager.prototype.renderTile = function (item) {
        var tileContainer = this.createElement(this.__listItemsElement, "div", "tile-container");
        var tile = this.createElement(tileContainer, "div", ["tile", this.getStatusClass(item)].join(" "));
        tile.addEventListener("click", function () { window.open(item.link, '_blank'); });
        var image = this.createElement(tile, "img", "tile-image");
        image.setAttribute("src", item.imageURL);
        var titleLine = this.createElement(tile, "div", "tile-title-line", item.title);
        var line1 = this.createElement(tile, "div", "tile-line", item.line1);
        var line2 = this.createElement(tile, "div", "tile-line-2", item.line2);
        var details = this.createElement(tile, "span", "tile-details", item.details);
    };
    ListManager.prototype.renderTitle = function () {
        this.__titleElement = this.createElement(this.__listContainer, "h1", "list-title", this.__title);
    };
    ListManager.prototype.createElement = function (container, type, classNames, innerText) {
        if (classNames === void 0) { classNames = ""; }
        if (innerText === void 0) { innerText = ""; }
        var element = document.createElement(type);
        element.className = classNames;
        if (innerText)
            element.innerText = innerText;
        container.appendChild(element);
        return element;
    };
    ListManager.prototype.getStatusClass = function (item) {
        switch (item.status) {
            case Status.blue:
                return "tile-blue";
            case Status.green:
                return "tile-green";
            default:
                return "";
        }
    };
    return ListManager;
}());
var ListItem = (function () {
    function ListItem() {
    }
    return ListItem;
}());
var Status;
(function (Status) {
    Status[Status["normal"] = 0] = "normal";
    Status[Status["blue"] = 1] = "blue";
    Status[Status["green"] = 2] = "green";
})(Status || (Status = {}));
