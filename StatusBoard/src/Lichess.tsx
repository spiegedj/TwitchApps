import * as React from "react";

const pieces: string[] = ["P", "N", "R", "B", "K", "Q", "p", "n", "r", "b", "k", "q"];

class ChessBoard
{
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;
    private __size: number;
    private __pieces: Map<string, HTMLImageElement> = new Map();

    constructor(canvas: HTMLCanvasElement, size: number)
    {
        this.__canvas = canvas;
        this.__ctx = canvas.getContext("2d");
        this.__size = size;
    }

    public draw(fen?: string): void
    {
        this.__ctx.clearRect(0, 0, this.__size, this.__size);
        this.__populateImageCache();
        this.__drawBoard();

        if (fen)
        {
            this.__drawPieces(fen);
        }
    }

    private __populateImageCache(): void
    {
        if (this.__pieces.size > 0) { return; }
        for (const key of pieces)
        {
            const source = document.getElementById(key);
            this.__pieces.set(key, source as HTMLImageElement);
        }
    }

    private __drawBoard(): void
    {
        this.__ctx.fillStyle = "#000000";
        this.__ctx.fillRect(0, 0, 300, 300);

        this.__ctx.fillStyle = "#FFFFFF";
        const d = this.__size / 8;

        for (let i = 0; i < 64; i++)
        {
            const x = i % 8;
            const y = Math.floor(i / 8);
            if ((x + y) % 2)
            {
                this.__ctx.fillRect(d * x, d * y, d, d);
            }
        }
    }

    private __drawPieces(fen: string): void
    {
        const ranks = fen.split("/");
        for (let rank = 0; rank < 8; rank++)
        {
            const pieces = ranks[rank];
            if (pieces)
            {
                let file = 0;
                for (let pos = 0; pos <= pieces.length; pos++)
                {
                    const piece = pieces[pos];
                    const emptySpaces = parseInt(piece);
                    if (!isNaN(emptySpaces))
                    {
                        file += emptySpaces;
                        continue;
                    }

                    const source = this.__pieces.get(piece);
                    if (source)
                    {
                        this.__drawPiece(source, rank, file);
                        file++;
                    }
                }
            }
        }
    }

    private __drawPiece(source: HTMLImageElement, rank: number, file: number)
    {
        const d = this.__size / 8;
        this.__ctx.drawImage(source, file * d, rank * d, d, d);
    }
}

export const Lichess = ({ game }: { game?: Response.LichessGame }) =>
{
    if (!game) { return null; }

    const canvas = React.useRef<HTMLCanvasElement>();
    const chessBoard = React.useRef<ChessBoard>();
    const socket = React.useRef<WebSocket>();

    React.useEffect(() =>
    {
        chessBoard.current = new ChessBoard(canvas.current, 300);
        chessBoard.current.draw();
    });

    React.useEffect(() =>
    {
        socket.current?.close();
        socket.current = connectToGame(game.GameId);

        return () => { socket.current?.close() };
    }, [game.GameId]);

    const connectToGame = (gameId: string): WebSocket =>
    {
        const url = "wss://socket1.lichess.org/watch/" + gameId + "/white/v5?sri=f32";
        const webSocket = new WebSocket(url);

        webSocket.onmessage = (event) =>
        {
            const data = JSON.parse(event.data);
            if (data.t === "move") 
            {
                const fen = data.d.fen;
                chessBoard.current.draw(fen);
            }

            if (data.t === "tvSelect")
            {
                const gameId = data.d.id;
                webSocket.send(gameId);
            }

            console.log(event.data);
        };

        return webSocket;
    }

    return <div>
        <canvas ref={canvas} width={300} height={300} />
        <div>{game.GameId}</div>
        <div>{game.Rated}</div>
        <div>{game.Speed}</div>
        <div>{game.Status}</div>
        <div>{game.White.Name}</div>
        <div>{game.Black.Name}</div>
        <div style={{ display: "none" }}>
            <img id="P" src="./Images/Chess/wp.png" />
            <img id="N" src="./Images/Chess/wn.png" />
            <img id="R" src="./Images/Chess/wr.png" />
            <img id="B" src="./Images/Chess/wb.png" />
            <img id="Q" src="./Images/Chess/wq.png" />
            <img id="K" src="./Images/Chess/wk.png" />

            <img id="p" src="./Images/Chess/bp.png" />
            <img id="n" src="./Images/Chess/bn.png" />
            <img id="r" src="./Images/Chess/br.png" />
            <img id="b" src="./Images/Chess/bb.png" />
            <img id="q" src="./Images/Chess/bq.png" />
            <img id="k" src="./Images/Chess/bk.png" />
        </div>
    </div>;
}