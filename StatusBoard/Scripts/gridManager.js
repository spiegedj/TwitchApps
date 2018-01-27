var GridManager = /** @class */ (function () {
    function GridManager(dimensions) {
        this.__width = dimensions.width;
        this.__height = dimensions.height;
        this.__grid = [];
    }
    GridManager.prototype.addBlock = function (block) {
        this.__grid.push(block);
        block.element.style.position = "absolute";
    };
    GridManager.prototype.resize = function (screenWidth, screenHeight) {
        var _this = this;
        var totalWidthPadding = (this.__width + 1) * GridManager.PADDING;
        var blockWidth = (screenWidth - totalWidthPadding) / this.__width;
        var totalHeightPadding = (this.__height + 1) * GridManager.PADDING;
        var blockHeight = (screenHeight - totalHeightPadding) / this.__height;
        this.__grid.forEach(function (block) {
            _this.setSize(block.element, block.w * blockWidth + ((block.w - 1) * GridManager.PADDING), block.h * blockHeight + ((block.h - 1) * GridManager.PADDING));
            _this.setPosition(block.element, block.x * blockWidth + ((block.x + 1) * GridManager.PADDING), block.y * blockHeight + ((block.y + 1) * GridManager.PADDING));
        });
    };
    GridManager.prototype.setSize = function (element, width, height) {
        element.style.width = width + "px";
        element.style.height = height + "px";
    };
    GridManager.prototype.setPosition = function (element, x, y) {
        element.style.left = x + "px";
        element.style.top = y + "px";
    };
    GridManager.PADDING = 15;
    return GridManager;
}());
