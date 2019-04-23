class Circle {
    constructor(x, y, radius, color) {
        this._x = x;
        this._y = y;
        this._radius = radius;
        this._color = color;
    }
    get radius() {
        return this._radius;
    }
    get color() {
        return this._color;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(value) {
        this._x = value;
    }
    set y(value) {
        this._y = value;
    }
}

class Game {
    constructor() {
        this._circles = [];
        this._colors = ['red', 'lightblue', 'lightgreen', 'black', 'lightyellow'];
        this._seconds = 0;
        this._numberBallsPerColor = this._numberRedBalls = 8;
        this.createCircles();
    }
    get circles() {
        return this._circles;
    }
    get seconds() {
        return this._seconds;
    }
    get numberRedBalls() {
        return this._numberRedBalls;
    }
    get gameTime() {
        return ++this._seconds;
    }
    createCircles() {
        this._colors.forEach(color => {
                for (let j = 0; j < this._numberBallsPerColor; j++) {
                    //straal van cirkel heeft waarde tussen 10 en 20.
                    let r = Math.floor(Math.random() * 10) + 10;
                    this._circles.push(new Circle(0, 0, r, color));
                }
            })
    }
    checkClick(x, y) {
        this._circles.forEach((circle, ind) => {
                if (circle._color === 'red') {
                    const dist = Math.sqrt(Math.pow((circle._x - x), 2) +
                        Math.pow((circle._y - y), 2));
                    //check of er op geklikt is, 
                    //indien erop geklikt is dan wordt die verwijderd.
                    if (dist >= 0 && dist <= circle._radius) {
                        this._circles.splice(ind, 1);
                        this._numberRedBalls--;
                    }
                }
            })
    }
    checkEndGame() {
        return this._numberRedBalls === 0;
    }
}

class DPDIApp {
    constructor(canvas, storage) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");
        this._game = new Game();
        this._timer = null;
        this._storage = storage;
        this.drawGame();
        this.startChronometer();
        this.showRecordTime();
    }
    get canvas() {
        return this._canvas;
    }
    get game() {
        return this._game;
    }
    drawGame() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawCircles();
        this.showNumberRedBalls();
    }
    drawCircles() {
        this.game.circles.forEach((c) => {
            c.x = Math.random() * this._canvas.width;
            c.y = Math.random() * this._canvas.height;
            this._ctx.beginPath();
            this._ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, true);
            this._ctx.fillStyle = c.color;
            this._ctx.fill();
        });
    }
    showNumberRedBalls() {
        document.getElementById('rb').innerText = this.game.numberRedBalls;
    }
    startChronometer() {
        this._timer = setInterval(() => {
            this.showTime()
        }, 1000);
    }
    stopChronometer() {
        clearInterval(this._timer);
    }
    checkClick(x, y) {
        this.game.checkClick(x, y);
    }
    showTime() {
        document.getElementById('gameTime').innerHTML = convertSeconds(this._game.gameTime);
    }
    getTimeRecordFromStorage() {
        if (this._storage &&
            this._storage.getItem("timeRecord")) {
            return this._storage.getItem("timeRecord");
        }
    }
    setTimeRecordInStorage() {
        const recordTime = this.getTimeRecordFromStorage()?parseInt(this.getTimeRecordFromStorage()):Number.MAX_VALUE;
        if (this._storage && this.game.seconds < recordTime) {
            this._storage.setItem("timeRecord", this.game.seconds);
        }
    }
    showRecordTime() {
        const recordTime = this.getTimeRecordFromStorage()?parseInt(this.getTimeRecordFromStorage()):Number.MAX_VALUE;
        document.getElementById('tt').innerHTML = recordTime === Number.MAX_VALUE?
            "Nog geen toptijd":convertSeconds(recordTime);
    }
    checkEndGame() {
        return this._game.checkEndGame();
    }
    stopGame() {
        this.stopChronometer();
        this.setTimeRecordInStorage();
        this.showRecordTime();
        document.getElementById("gameCanvas").onclick = null;
    }
}
const convertSeconds = function(seconds){
    const m = parseInt(seconds / 60); 
    const min = m < 10 ? `0${m}` : m;
    const s = seconds % 60;
    const sec = s < 10 ? `0${s}` : s;
    return `${min}:${sec}`;  
}
const init = function () {
    const canvas = document.getElementById("gameCanvas");
    const DPDI = new DPDIApp(canvas, window.localStorage);
    document.getElementById("gameCanvas").onclick = (event) => {
        // xco is de xcoördinaat van de muisklik op het canvas
        const xco = event.pageX - DPDI.canvas.offsetLeft;
        // yco is de xcoördinaat van de muisklik op het canvas
        const yco = event.pageY - DPDI.canvas.offsetTop;
        DPDI.checkClick(xco, yco);
        DPDI.drawGame();
        if (DPDI.checkEndGame()) DPDI.stopGame();
    };
}
window.onload = init;