class GridManager {
    constructor(dimensions) {
        this.__width = dimensions.width;
        this.__height = dimensions.height;
        this.__grid = [];
    }
    addBlock(block) {
        this.__grid.push(block);
        block.element.style.overflow = "hidden";
        block.element.style.position = "absolute";
    }
    resize(screenWidth, screenHeight) {
        const totalWidthPadding = (this.__width + 1) * GridManager.PADDING;
        const blockWidth = (screenWidth - totalWidthPadding) / this.__width;
        const totalHeightPadding = (this.__height + 1) * GridManager.PADDING;
        const blockHeight = (screenHeight - totalHeightPadding) / this.__height;
        this.__grid.forEach((block) => {
            this.setSize(block.element, block.w * blockWidth + ((block.w - 1) * GridManager.PADDING), block.h * blockHeight + ((block.h - 1) * GridManager.PADDING));
            this.setPosition(block.element, block.x * blockWidth + ((block.x + 1) * GridManager.PADDING), block.y * blockHeight + ((block.y + 1) * GridManager.PADDING));
        });
    }
    setSize(element, width, height) {
        element.style.width = width + "px";
        element.style.height = height + "px";
    }
    setPosition(element, x, y) {
        element.style.left = x + "px";
        element.style.top = y + "px";
    }
}
GridManager.PADDING = 15;
