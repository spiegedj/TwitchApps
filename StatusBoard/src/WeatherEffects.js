"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRainEffect = void 0;
const pixi_js_1 = require("pixi.js");
const cloudySVGPromise = pixi_js_1.Assets.load({
    src: './Images/WeatherSVGs/cloudy.svg',
    data: { parseAsGraphicsContext: true },
});
const dropletSVGPromise = pixi_js_1.Assets.load({
    src: './Images/WeatherSVGs/droplet.svg',
    data: { parseAsGraphicsContext: true, },
});
const addRainEffect = (container) => __awaiter(void 0, void 0, void 0, function* () {
    const app = new pixi_js_1.Application();
    yield app.init({ backgroundAlpha: 0, resizeTo: container, antialias: true });
    const canvas = app.canvas;
    canvas.className = 'rain-effects-canvas';
    container.appendChild(canvas);
    const texture = yield pixi_js_1.Assets.load("./Images/droplet.png");
    const cloudySVG = yield cloudySVGPromise;
    const dropletSVG = yield dropletSVGPromise;
    const cloud = new Cloud(app, cloudySVG);
    //const cloud2 = new Cloud(app, cloudySVG);
    const animatedSprites = [cloud];
    let currentTime = 0;
    let dropletCount = 0;
    app.ticker.add((time) => {
        currentTime += time.deltaTime;
        if (dropletCount < 20) {
            const drop = new Droplet(app, dropletSVG, dropletCount);
            animatedSprites.push(drop);
            app.stage.addChild(drop);
            dropletCount++;
        }
        animatedSprites.forEach((sprite) => {
            sprite.update(time.deltaTime, currentTime);
        });
    });
});
exports.addRainEffect = addRainEffect;
class AnimatedSprite extends pixi_js_1.Graphics {
    constructor(app, texture) {
        super(texture);
        this.app = app;
    }
}
class Droplet extends AnimatedSprite {
    constructor(app, texture, index) {
        super(app, texture);
        this.index = index;
        this.resetX();
        this.y = 60;
        this.speed = randBetween(.5, 1);
        //this.anchor.set(0.5);
        this.scale.set(2);
    }
    resetX() {
        const leftX = 40;
        const rightX = this.app.screen.width - 40;
        const range = (rightX - leftX) / 10;
        const i = (this.index % 10);
        this.x = randBetween(leftX + (i * range), leftX + ((i + 1) * range));
    }
    update(deltaTime) {
        this.y += this.speed * deltaTime;
        this.x -= .2 * deltaTime;
        if (this.y > this.app.screen.height) {
            this.y = 60;
            this.resetX();
        }
    }
}
class Cloud extends pixi_js_1.Graphics {
    constructor(app, svg) {
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
    update(deltaTime, currentTime) {
        this.position.x = this.startX + (Math.sin((currentTime + this.seed) / 80) * 5);
    }
}
function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}
