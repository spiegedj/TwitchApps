class GridManager {

    private static readonly PADDING : number = 15;

    private __width: number;
    private __height: number;
    private __grid: Block[];

    constructor(dimensions: { width: number, height: number}) {
        this.__width = dimensions.width;
        this.__height = dimensions.height;
        this.__grid = [];
    }

    public addBlock(block: Block): void {
        this.__grid.push(block);

        block.element.style.overflow = "hidden";
        block.element.style.position = "absolute";
    }

    public resize(screenWidth: number, screenHeight: number) {
        const totalWidthPadding: number = (this.__width + 1) * GridManager.PADDING;
        const blockWidth: number = (screenWidth - totalWidthPadding) / this.__width;

        const totalHeightPadding: number = (this.__height + 1) * GridManager.PADDING;
        const blockHeight: number = (screenHeight - totalHeightPadding) / this.__height;

        this.__grid.forEach((block: Block) => {
            this.setSize(block.element, 
                block.w * blockWidth + ((block.w - 1) * GridManager.PADDING), 
                block.h * blockHeight + ((block.h - 1) * GridManager.PADDING));

            this.setPosition(block.element,
                block.x * blockWidth + ((block.x + 1) * GridManager.PADDING),
                block.y * blockHeight + ((block.y + 1) * GridManager.PADDING));
       });
    }

    public setSize(element: HTMLElement, width: number, height: number)
    {
        element.style.width = width + "px";
        element.style.height = height + "px";
    }

    public setPosition(element: HTMLElement, x: number, y: number)
    {
        element.style.left = x + "px";
        element.style.top = y + "px";
    }
}

interface Block {
    element: HTMLElement,
    x: number,
    y: number,
    w: number,
    h: number
}