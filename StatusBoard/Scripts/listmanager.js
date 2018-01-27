var ListManager = /** @class */ (function () {
    function ListManager(container, measureCount, title) {
        this.refreshRate = 30 * 1000;
        this.__measureCount = measureCount;
        this.__title = title;
        this.__startIndex = 0;
        this.__listContainer = this.createMarkup({
            tag: "div",
            className: "list-container",
            children: [
                {
                    tag: "h1",
                    className: "list-title",
                    innerText: this.__title
                },
                {
                    tag: "div",
                    key: "_listItemsElement"
                }
            ]
        }, this);
        container.appendChild(this.__listContainer);
        setInterval(this.refresh.bind(this), this.refreshRate);
    }
    Object.defineProperty(ListManager.prototype, "element", {
        get: function () {
            return this.__listContainer;
        },
        enumerable: true,
        configurable: true
    });
    ListManager.prototype.setBackgroundColor = function (color) {
        this.__listContainer.style.backgroundColor = color;
    };
    ListManager.prototype.refresh = function () {
        this.retrieveItems();
    };
    ListManager.prototype.render = function () {
        this._listItemsElement.innerHTML = '';
        for (var i = this.__startIndex; i < (this.__startIndex + this.__measureCount); i++) {
            if (this._listItems[i]) {
                this.renderTile(this._listItems[i]);
            }
        }
    };
    ListManager.prototype.renderTile = function (item) {
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
                            attributes: [{ name: "src", value: item.imageURL }]
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
    };
    ListManager.prototype.renderTitle = function () {
        this.__titleElement = this.createMarkup({
            tag: "h1",
            className: "list-title",
            innerText: this.__title
        });
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
    ListManager.prototype.createMarkup = function (tree, trackingObject) {
        var _this = this;
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
            tree.attributes.forEach(function (_a) {
                var name = _a.name, value = _a.value;
                element.setAttribute(name, value);
            });
        }
        if (tree.events) {
            tree.events.forEach(function (_a) {
                var name = _a.name, callback = _a.callback;
                element.addEventListener(name, callback);
            });
        }
        tree.children && tree.children.forEach(function (child) {
            element.appendChild(_this.createMarkup(child, trackingObject));
        });
        return element;
    };
    return ListManager;
}());
var ListItem = /** @class */ (function () {
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
