"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lichess = void 0;
const React = require("react");
const pieces = ["P", "N", "R", "B", "K", "Q", "p", "n", "r", "b", "k", "q"];
class ChessBoard {
    constructor(canvas, size) {
        this.__pieces = new Map();
        this.__canvas = canvas;
        this.__ctx = canvas.getContext("2d");
        this.__size = size;
    }
    draw(fen) {
        this.__ctx.clearRect(0, 0, this.__size, this.__size);
        this.__populateImageCache();
        this.__drawBoard();
        if (fen) {
            this.__drawPieces(fen);
        }
    }
    __populateImageCache() {
        if (this.__pieces.size > 0) {
            return;
        }
        for (const key of pieces) {
            const source = document.getElementById(key);
            this.__pieces.set(key, source);
        }
    }
    __drawBoard() {
        this.__ctx.fillStyle = "#000000";
        this.__ctx.fillRect(0, 0, 300, 300);
        this.__ctx.fillStyle = "#FFFFFF";
        const d = this.__size / 8;
        for (let i = 0; i < 64; i++) {
            const x = i % 8;
            const y = Math.floor(i / 8);
            if ((x + y) % 2) {
                this.__ctx.fillRect(d * x, d * y, d, d);
            }
        }
    }
    __drawPieces(fen) {
        const ranks = fen.split("/");
        for (let rank = 0; rank < 8; rank++) {
            const pieces = ranks[rank];
            if (pieces) {
                let file = 0;
                for (let pos = 0; pos <= pieces.length; pos++) {
                    const piece = pieces[pos];
                    const emptySpaces = parseInt(piece);
                    if (!isNaN(emptySpaces)) {
                        file += emptySpaces;
                        continue;
                    }
                    const source = this.__pieces.get(piece);
                    if (source) {
                        this.__drawPiece(source, rank, file);
                        file++;
                    }
                }
            }
        }
    }
    __drawPiece(source, rank, file) {
        const d = this.__size / 8;
        this.__ctx.drawImage(source, file * d, rank * d, d, d);
    }
}
const Lichess = ({ game }) => {
    if (!game) {
        return null;
    }
    const canvas = React.useRef();
    const chessBoard = React.useRef();
    const socket = React.useRef();
    React.useEffect(() => {
        chessBoard.current = new ChessBoard(canvas.current, 300);
        chessBoard.current.draw();
    });
    React.useEffect(() => {
        var _a;
        (_a = socket.current) === null || _a === void 0 ? void 0 : _a.close();
        socket.current = connectToGame(game.GameId);
        return () => { var _a; (_a = socket.current) === null || _a === void 0 ? void 0 : _a.close(); };
    }, [game.GameId]);
    const connectToGame = (gameId) => {
        const url = "wss://socket1.lichess.org/watch/" + gameId + "/white/v5?sri=f32";
        const webSocket = new WebSocket(url);
        webSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.t === "move") {
                const fen = data.d.fen;
                chessBoard.current.draw(fen);
            }
            if (data.t === "tvSelect") {
                const gameId = data.d.id;
                webSocket.send(gameId);
            }
            console.log(event.data);
        };
        return webSocket;
    };
    return React.createElement("div", null,
        React.createElement("canvas", { ref: canvas, width: 300, height: 300 }),
        React.createElement("div", null, game.GameId),
        React.createElement("div", null, game.Rated),
        React.createElement("div", null, game.Speed),
        React.createElement("div", null, game.Status),
        React.createElement("div", null, game.White.Name),
        React.createElement("div", null, game.Black.Name),
        React.createElement("div", { style: { display: "none" } },
            React.createElement("img", { id: "P", src: "./Images/Chess/wp.png" }),
            React.createElement("img", { id: "N", src: "./Images/Chess/wn.png" }),
            React.createElement("img", { id: "R", src: "./Images/Chess/wr.png" }),
            React.createElement("img", { id: "B", src: "./Images/Chess/wb.png" }),
            React.createElement("img", { id: "Q", src: "./Images/Chess/wq.png" }),
            React.createElement("img", { id: "K", src: "./Images/Chess/wk.png" }),
            React.createElement("img", { id: "p", src: "./Images/Chess/bp.png" }),
            React.createElement("img", { id: "n", src: "./Images/Chess/bn.png" }),
            React.createElement("img", { id: "r", src: "./Images/Chess/br.png" }),
            React.createElement("img", { id: "b", src: "./Images/Chess/bb.png" }),
            React.createElement("img", { id: "q", src: "./Images/Chess/bq.png" }),
            React.createElement("img", { id: "k", src: "./Images/Chess/bk.png" })));
};
exports.Lichess = Lichess;
