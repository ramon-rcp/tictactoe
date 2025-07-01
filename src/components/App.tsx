import React, { Component } from 'react';
import '../styles/global.css';
import {apiURL, Game} from './Game';

type AppState = {
    playState: "start" | "playing" | "finished";
    winner?: "WIN!!" | "YOU LOSE" | "DRAW";
    endBoard?: string[];
}

export class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            playState: "start"
        }
    }

    render() {
        this.resetGame();
        if (this.state.playState === "start") {
            return this.renderStart();
        }
        else if (this.state.playState === "playing") {
            return <Game openGameFinished={this.openGameFinished}/>
        }
        else if (this.state.playState === "finished") {
            return this.renderFinished();
        }
        return <div>Error</div>
    }

    renderStart = (): React.ReactElement => {
        return <div className='tictactoe-container'>
            <h1>Tic Tac Toe</h1>
            <p className='status'>Welcome to the Tic Tac Toe game!</p>
            <p className='status'>Enjoy playing!</p>
            <button className="reset-btn" onClick={this.openGame}>Start Game</button>
        </div>
    }

    renderFinished = (): React.ReactElement => {
        return <div className='tictactoe-container'>
            <h1>{this.state.winner}</h1>
            <p className='status'>Thank you for playing!</p>
            <div className='board'>
                {
                    this.state.endBoard?.map((_, index) => (
                        <button
                            key={index}
                            id={String(index)}
                            className="square"
                        >
                            {(this.state.endBoard == undefined) ? "" : this.state.endBoard[index]}
                        </button>))
                }    
            </div>
            <button className="reset-btn" onClick={this.openGame}>Play Again</button>
        </div>
    }

    openGame = (): void => {
        this.resetGame();
        this.setState({playState: "playing"})
    }

    openGameFinished = (winner: "WIN!!" | "YOU LOSE" | "DRAW", board: string[]): void => {
        this.resetGame();
        this.setState({
            playState: "finished",
            winner: winner,
            endBoard: board
        });
    }

    resetGame = (): void => {
        fetch(apiURL + "/reset")
            .then(response => response.json())
            .then(data => {
                console.log("Game reset", data);
            })
            .catch(error => {
                console.error("Error resetting game", error);
            });
    }
}