let canvas: HTMLCanvasElement | null = null;
export function getTextWidth(text, font)
{
    // re-use canvas object for better performance
    canvas = canvas || document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return Math.ceil(metrics.width);
}

export function addCommas(num: number): string
{
    var numString = num.toString();
    var commaString = "";

    for (var i = numString.length; i > 3; i -= 3)
    {
        commaString = "," + numString.substr(Math.max(0, i - 3), i) + commaString;
    }
    commaString = numString.substr(0, i) + commaString;
    return commaString;
}