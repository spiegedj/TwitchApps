import * as React from "react";

interface IHeadlineProps
{
	headlines: Response.Headline[];
}

export const Headlines = ({ headlines }: IHeadlineProps) =>
{
	const div = document.createElement("div");
	const data = headlines?.map(headline =>
	{
		div.innerHTML = headline.Title;
		return div.innerText;
	}) ?? [];

	const marquee = React.useRef(new Marquee());
	return <canvas
		className="marquee"
		ref={canvas => marquee.current.set_data(canvas, data)}
		height={25}
		width={1920}
	/>;
};

const TEXT_PADDING_TOP = 5;
const TEXT_PADDING_LEFT = 50;
const PIXELS_PER_SECOND = 75;

export class Marquee
{
	private __canvas: HTMLCanvasElement;
	private __ctx: CanvasRenderingContext2D;
	private __data: string[];
	private __stepKey: number;

	private __width: number;
	private __offset: number = 0;

	public set_data(canvas: HTMLCanvasElement, data: string[])
	{
		if (canvas && (this.__canvas !== canvas || this.__didDataChange(data)))
		{
			this.__canvas = canvas;
			this.__ctx = canvas.getContext("2d");
			this.__data = data;
			this.__offset = 0;

			this.__ctx.font = "16px Arial";
			this.__ctx.fillStyle = "white";
			this.__ctx.textBaseline = "top";

			this.__measureWidth();
			cancelAnimationFrame(this.__stepKey);
			this.__stepKey = requestAnimationFrame(() => this.__onStep((new Date().valueOf())));
		}
	}

	private __measureWidth()
	{
		let width = this.__canvas.width;
		for (const line of this.__data)
		{
			width += (this.__ctx.measureText(line).width + TEXT_PADDING_LEFT);
		}
		this.__width = width;
	}

	private __onStep = (previousTime: number) =>
	{
		const currentTime = new Date().valueOf();
		const elapsed = (currentTime - previousTime) / 1000;
		const pixelDelta = elapsed * PIXELS_PER_SECOND;
		this.__offset += pixelDelta;
		this.__offset = this.__offset % this.__width;

		this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);

		let x = this.__canvas.width - this.__offset;
		for (const line of this.__data)
		{
			this.__ctx.fillText(line, x, TEXT_PADDING_TOP);
			x += (this.__ctx.measureText(line).width + TEXT_PADDING_LEFT);
		}

		this.__stepKey = requestAnimationFrame(() => this.__onStep(currentTime));
	};

	private __didDataChange(data: string[])
	{
		return data.some((text, i) => this.__data[i] !== text);
	}
}