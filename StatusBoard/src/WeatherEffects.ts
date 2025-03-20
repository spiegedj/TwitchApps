import { Application, Assets, Sprite, Texture, Graphics } from 'pixi.js';

const cloudySVGPromise = Assets.load({
	src: './Images/WeatherSVGs/cloudy.svg',
	data: { parseAsGraphicsContext: true },
});

const dropletSVGPromise = Assets.load({
	src: './Images/WeatherSVGs/droplet.svg',
	data: { parseAsGraphicsContext: true, },
});

export const addRainEffect = async (container: HTMLElement) =>
{
	const app = new Application();

	await app.init({ backgroundAlpha: 0, resizeTo: container, antialias: true });

	const canvas = app.canvas;
	canvas.className = 'rain-effects-canvas';
	container.appendChild(canvas);

	const texture = await Assets.load("./Images/droplet.png");

	const cloudySVG = await cloudySVGPromise;
	const dropletSVG = await dropletSVGPromise;

	const cloud = new Cloud(app, cloudySVG);
	//const cloud2 = new Cloud(app, cloudySVG);
	const animatedSprites: IAnimatedChild[] = [cloud];

	let currentTime = 0;
	let dropletCount = 0;
	app.ticker.add((time) =>
	{
		currentTime += time.deltaTime;
		if (dropletCount < 20)
		{
			const drop = new Droplet(app, dropletSVG, dropletCount);
			animatedSprites.push(drop);
			app.stage.addChild(drop);
			dropletCount++;
		}

		animatedSprites.forEach((sprite) => 
		{
			sprite.update(time.deltaTime, currentTime);
		});
	});
};

interface IAnimatedChild
{
	update(deltaTime: number, currentTime: number): void;
}

abstract class AnimatedSprite extends Graphics implements IAnimatedChild
{
	protected app: Application;

	constructor(app: Application, texture: Texture)
	{
		super(texture);
		this.app = app;
	}

	abstract update(deltaTime: number): void;
}

class Droplet extends AnimatedSprite
{
	private speed: number;
	private index: number;

	constructor(app: Application, texture: Texture, index: number)
	{
		super(app, texture);

		this.index = index;
		this.resetX();
		this.y = 60;
		this.speed = randBetween(.5, 1);
		//this.anchor.set(0.5);

		this.scale.set(2);
	}

	private resetX(): void
	{
		const leftX = 40;
		const rightX = this.app.screen.width - 40;
		const range = (rightX - leftX) / 10;
		const i = (this.index % 10);
		this.x = randBetween(leftX + (i * range), leftX + ((i + 1) * range));
	}

	public update(deltaTime: number)
	{
		this.y += this.speed * deltaTime;
		this.x -= .2 * deltaTime;

		if (this.y > this.app.screen.height)
		{
			this.y = 60;
			this.resetX();
		}
	}
}

class Cloud extends Graphics implements IAnimatedChild
{
	protected app: Application;
	private startX: number;
	private seed: number;

	constructor(app: Application, svg: any)
	{
		super(svg);
		this.app = app;

		const bounds = this.getLocalBounds();
		this.scale.set(3);
		this.pivot.set((bounds.x + bounds.width) / 2, (bounds.y + bounds.height) / 2);
		this.position.set(app.screen.width / 2, app.screen.height / 4);
		//this.alpha = 0.5;
		app.stage.addChild(this);

		//this.x = this.startX = randBetween(0, this.app.screen.width);
		this.startX = this.x;
		this.seed = randBetween(0, 100);
	}
	public update(deltaTime: number, currentTime: number)
	{
		this.position.x = this.startX + (Math.sin((currentTime + this.seed) / 80) * 5);
	}
}

function randBetween(min: number, max: number)
{
	return Math.random() * (max - min) + min;
}