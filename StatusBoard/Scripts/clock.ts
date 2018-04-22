/// <reference path="../@types/jquery/jquery.d.ts"/>

class Clock {
    private container: HTMLElement;
    private timeElement : HTMLElement;
    private dateElement : HTMLElement;


    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number = 300;
    private height: number = 300;
    private center: Point;
    private radius: number;

    private padding = 10;
    private secondHandLength = 100;
    private minuteHandLength = 125;
    private hourHandLength = 80;

    public get element(): HTMLElement {
        return this.container;
    }

    public constructor() {
        this.container = document.createElement("div");
        this.container.id = "clock";
            this.dateElement = document.createElement("div");
            this.dateElement.id = "date";
            this.container.appendChild(this.dateElement);

            this.timeElement = document.createElement("div");
            this.timeElement.id = "time";
            this.container.appendChild(this.timeElement);

            this.canvas = document.createElement("canvas");
            this.canvas.id = "analog";
            this.ctx = this.canvas.getContext("2d");
            this.container.appendChild(this.canvas);

        document.body.appendChild(this.container);

        setInterval(this.updateClock.bind(this), 1000);
    }

    private updateClock() : void {
        var now = new Date();

        var hours = now.getHours();
        var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ampm = hours > 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours == 0 ? hours + 12 : hours;

        this.dateElement.innerHTML = now.toLocaleDateString("en-us", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
        this.timeElement.innerHTML = hours + ":" + minutes + " " + ampm;

        //this.drawClock(now);
    }

    private drawClock(now: Date): void {
        this.initializeClock();
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.beginPath();
        this.ctx.lineWidth = 10;
        this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.drawFace();

        var seconds = now.getSeconds();
        var minutes = now.getMinutes() + seconds / 60;
        var hours = now.getHours() + minutes / 60;

        angle = (seconds / 60) * 2 * Math.PI;
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 1;
        this.drawHand(angle, this.secondHandLength);


        angle = (hours / 12) * 2 * Math.PI;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 8;
        this.drawHand(angle, this.hourHandLength);

        var angle = (minutes / 60) * 2 * Math.PI;
        this.ctx.lineWidth = 6;
        this.drawHand(angle, this.minuteHandLength);


    }

    private initializeClock(): void {
        this.width = this.element.offsetWidth;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        }
        this.radius = ((this.width > this.height) ? this.height : this.width) / 2;
        this.radius -= this.padding;
    }

    private drawHand(angle: number, length: number): void {
        angle -= Math.PI / 2;
        let x = this.center.x + (length * Math.cos(angle));
        let y = this.center.y + (length * Math.sin(angle));

        this.ctx.beginPath();
        this.ctx.lineCap = "square";
        this.ctx.moveTo(this.center.x, this.center.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    private drawFace() {
        let length = this.radius - 25;
        this.ctx.font = "25pt calibri";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"; 

        this.ctx.beginPath();
        this.ctx.lineWidth = 10;
        this.ctx.arc(this.center.x, this.center.y, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        for (var i = 1; i < 13; i++) {
            let angle = (i / 12) * 2 * Math.PI;
            this.writeAtAngle(angle, i + "", length);
        }
    }

    private writeAtAngle(angle: number, text: string, length: number) {
        angle -= Math.PI / 2;
        let x = this.center.x + (length * Math.cos(angle));
        let y = this.center.y + (length * Math.sin(angle));
        this.ctx.fillText(text, x, y);
    }
}

interface Point {
    x: number;
    y: number;
}