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
var VSList = /** @class */ (function (_super) {
    __extends(VSList, _super);
    function VSList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VSList.prototype.renderTile = function (item) {
        if (this.__renderedDate !== item.date) {
            var tileContainer_1 = this.createElement(this._listItemsElement, "div", "vs-list-tile-date-line", item.date);
            this.__renderedDate = item.date;
        }
        var tileContainer = this.createElement(this._listItemsElement, "div", "vs-list-tile-container");
        var tile = this.createElement(tileContainer, "div", "tile");
        // Comp 1
        var comp1 = this.createElement(tile, "span", "vs-comp-1");
        //comp1.style.backgroundColor = "#" + item.competitor1.primaryColor;
        //comp1.style.color = "#" + item.competitor1.secondaryColor;
        var image1 = this.createElement(comp1, "img", "vs-tile-image");
        image1.setAttribute("src", item.competitor1.imageURL);
        var title1 = this.createElement(comp1, "span", "tile-tile-line", item.competitor1.name);
        var timeLine = this.createElement(tile, "span", "vs-tile-time", item.time);
        // Comp 2
        var comp2 = this.createElement(tile, "span", "vs-comp-2");
        //comp2.style.backgroundColor = "#" + item.competitor2.primaryColor;
        //comp2.style.color = "#" + item.competitor2.secondaryColor;
        var image2 = this.createElement(comp2, "img", "vs-tile-image");
        image2.setAttribute("src", item.competitor2.imageURL);
        var title1 = this.createElement(comp2, "span", "tile-tile-line", item.competitor2.name);
    };
    return VSList;
}(ListManager));
var VSListItem = /** @class */ (function (_super) {
    __extends(VSListItem, _super);
    function VSListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VSListItem;
}(ListItem));
var Competitor = /** @class */ (function () {
    function Competitor() {
    }
    return Competitor;
}());
