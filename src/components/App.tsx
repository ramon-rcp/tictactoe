import React, { Component } from 'react';
import '../styles/global.css';
import {apiURL, Game} from './Game';

type AppState = {
    playState: "start" | "playing" | "finished";
    winner?: "WIN!!" | "YOU LOSE" | "DRAW";
    endBoard?: string[];
    key?: number;
    player: "X" | "O";
    isloading: boolean;
    difficulty: "easy" | "medium" | "hard" | "impossible";
    playerStarts: boolean;
}

export class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            playState: "start",
            player: "X",
            isloading: false,
            difficulty: "easy",
            playerStarts: true,
        }
    }

    render() {
        if (this.state.playState === "start") {
            return this.renderStart();
        }
        else if (this.state.playState === "playing") {
            console.log("Rendering Game component with key:", this.state.key);
            if (this.state.key === undefined) {
                throw new Error("Game key is undefined. Please create a game first.");
            }
            return <Game openGameFinished={this.openGameFinished} getKey={this.getKey} getPlayer={this.getPlayer}/>
        }
        else if (this.state.playState === "finished") {
            return this.renderFinished();
        }
        return <div>Error</div>
    }

    renderStart = (): React.ReactElement => {
        if(this.state.isloading) {
            return <div className='tictactoe-container'>
                <h1>Tic Tac Toe</h1>
                <div className='spinner'></div>
            </div>
        }
        return <div className='tictactoe-container'>
            <h1>Tic Tac Toe</h1>
            <p className='status'>Welcome to the Tic Tac Toe game!</p>
            <p className='status'>Do you want the first turn?</p>
            <div>
                <button className={(this.state.playerStarts) ? 'chosen-diff' : "reset-btn"} onClick={() => this.setState({playerStarts: true})}>Yes</button>
                <span className='space'></span>
                <button className={(this.state.playerStarts) ? "reset-btn" : 'chosen-diff'} onClick={() => this.setState({playerStarts: false})}>No</button>
            </div>
            <p className='status'>Choose a difficulty:</p>
            <div>
                <button className={(this.state.difficulty === "easy") ? 'chosen-diff' : "reset-btn"} onClick={() => this.setState({difficulty: "easy"})}>Easy</button>
                <span className='space'></span>
                <button className={(this.state.difficulty === "medium") ? 'chosen-diff' : "reset-btn"} onClick={() => this.setState({difficulty: "medium"})}>Medium</button>
                <span className='space'></span>
                <button className={(this.state.difficulty === "hard") ? 'chosen-diff' : "reset-btn"} onClick={() => this.setState({difficulty: "hard"})}>Hard</button>
                <span className='space'></span>
                <button className={(this.state.difficulty === "impossible") ? 'chosen-diff' : "reset-btn"} onClick={() => this.setState({difficulty: "impossible"})}>Impossible</button>
            </div>
            <p className='status'>Choose who to play as (circles play first):</p>
            <div>
                <button className={(this.state.player === "X") ? "chosen-square" : "square"} onClick={() => this.setState({player: "X"})}>X</button>
                <span className='space'></span>
                <button className={(this.state.player === "O") ? "chosen-square" : "square"} onClick={() => this.setState({player: "O"})}>O</button>
            </div>
            <p className='status'>Enjoy playing!</p>
            <button className="reset-btn" onClick={this.createGame}>Start Game</button>
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
            <button className="reset-btn" onClick={this.createGame}>Play Again</button>
            <button className="reset-btn" onClick={this.openMenu}>Back to Menu</button>
        </div>
    }

    openGameFinished = (winner: "WIN!!" | "YOU LOSE" | "DRAW", board: string[]): void => {
        this.resetGame();
        this.setState({
            playState: "finished",
            winner: winner,
            endBoard: board,
            isloading: false,
        });
    }

    openMenu = (): void => {
        this.setState({
            playState: "start",
            winner: undefined,
            endBoard: undefined,
            key: undefined,
            isloading: false,
        });
    }

    createGame = (): void => {
        this.setState({isloading: true});
        let ai: string = (this.state.player === "X") ? "O" : "X";
        let startingPlayer: string = (this.state.playerStarts) ? this.state.player : ai;
        fetch(apiURL + "/start?ai_player="+ai+"&opponent_player="+this.state.player+"&starting_player="+startingPlayer+"&difficulty="+this.state.difficulty)
            .then(response => response.json())
            .then(data => {
                console.log("Game created", data);
                console.log("Game key:", data.key);
                this.setState({playState: "playing", key: Number(data.key)});
            })
            .catch(error => {
                console.error("Error creating game", error);
            });
    }

    resetGame = (): void => {
        fetch(apiURL + "/reset?key=" + String(this.state.key))
            .then(response => response.json())
            .then(data => {
                console.log("Game reset", data);
            })
            .catch(error => {
                console.error("Error resetting game", error);
            });
    }

    getKey = (): number => {
        if (this.state.key === undefined) {
            throw new Error("Game key is undefined. Please create a game first.");
        }
        return this.state.key;
    }

    getPlayer = (): "X" | "O" => {
        return this.state.player;
    }
}