/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GroupedList = /** @class */ (function (_super) {
    __extends(GroupedList, _super);
    function GroupedList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.noHighlight = false;
        _this.__groups = {};
        return _this;
    }
    GroupedList.prototype.render = function () {
        this.__groups = {};
        _super.prototype.render.call(this);
    };
    GroupedList.prototype.setColor = function (color) {
        this.__groupColor = color;
        _super.prototype.setColor.call(this, color);
    };
    GroupedList.prototype.renderTile = function (item) {
        var group = this.__groups[item.groupName.toLowerCase()];
        if (!group) {
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
                            }
                        ]
                    }
                ]
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
    return GroupedList;
}(ListManager));
var GroupedListItem = /** @class */ (function (_super) {
    __extends(GroupedListItem, _super);
    function GroupedListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GroupedListItem;
}(ListItem));
