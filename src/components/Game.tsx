import React, { Component } from "react";
import "../styles/global.css";
import { MouseEvent } from "react";

export const apiURL: string = "https://backend-render-c5uf.onrender.com/api/tictactoe";

type GameState = {
    turn: "Your turn" | "AI's turn",
    board?: string[],
    player: "X" | "O",
    winner: "X" | "O" | "Draw" | null
}

type GameProps = {
    openGameFinished: (winner: "WIN!!" | "YOU LOSE" | "DRAW", board: string[]) => void;
}

export class Game extends Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);
        this.state = {
            turn: "AI's turn",
            player: "O",
            winner: null,
        }
    }

    render() {
        if(this.state.board === undefined) {
            this.getState();
            return <div className="spinner"/>
        }

        if(this.state.turn === "AI's turn") {
            this.makeAImove();
        } 

        if(this.state.winner !== null) {
            if (this.state.winner === "Draw") {
                this.props.openGameFinished("DRAW", this.state.board);
            }
            else if (this.state.winner === this.state.player) {
                this.props.openGameFinished("WIN!!", this.state.board);
            } else {
                this.props.openGameFinished("YOU LOSE", this.state.board);
            }
            return <div className="spinner"/>
        }

        return <div className="tictactoe-container">
            <h1>{this.state.turn}</h1>
            <div className="board">
                {this.renderSquares()}
            </div>
            {(this.state.turn === "AI's turn") ? <div className="spinner"/> : <div/>}
        </div>
    }

    renderSquares() {
        return this.state.board?.map((_, index) => (
            <button
                key={index}
                id={String(index)}
                className="square"
                onClick={this.makeMoveClick}
            >
                {(this.state.board == undefined) ? "" : this.state.board[index]}
            </button>
        ));
    }

    getState = (): void => {
        fetch(apiURL + "/state")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    board: data.board,
                    turn: (data.current_player === this.state.player) ? "Your turn" : "AI's turn",
                    winner: data.winner,
                });
            })
            .catch(error => {
                console.error("Error fetching game state:", error);
            });
    }

    makeAImove = (): void => {
        fetch(apiURL + "/ai-move")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    board: data.board,
                    turn: "Your turn",
                    winner: data.winner,
                });

            })
            .catch(error => {
                console.error("Error fetching AI move:", error);
            });
    }

    makeMoveClick = (evt: MouseEvent<HTMLElement>): void => {
        const target = evt.target as HTMLButtonElement;
        const index = Number(target.id);
        console.log("Clicked square index:", index);
        if(target.value !== "") {
            return; // Ignore clicks on already occupied squares
        }
        if (index >= 0 && index < 9) {
            this.makeMove(index);
        } else {
            console.error("Invalid move index:", index);
        }
    }

    makeMove = (index: number): void => {
        if(index < 0 || index > 8) {
            console.error("Invalid move index");
            return;
        }
        fetch(apiURL + "/move?position=" + index)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    board: data.board,
                    turn: "AI's turn",
                    winner: data.winner,
                });
            })
            .catch(error => {
                console.error("Error making move:", error);
            });
    }

}