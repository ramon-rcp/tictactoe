import React, { Component } from 'react';
import '../styles/global.css';
import {Game} from './Game';

type AppState = {
    playState: "start" | "playing" | "finished";
}

export class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            playState: "start"
        }
    }

    render() {
        if (this.state.playState === "start") {
            return this.renderStart();
        }
        else if (this.state.playState === "playing") {
            return <Game/>
        }
        else if (this.state.playState === "finished") {
            return this.renderFinished();
        }
        return <div>Error</div>
    }

    renderStart = (): React.ReactElement => {
        return <div>
            <h1>Tic Tac Toe</h1>
            <p>Welcome to the Tic Tac Toe game!</p>
            <p>Enjoy playing!</p>
            <button className="reset-btn" onClick={this.openGame}>Start Game</button>
        </div>
    }

    renderFinished = (): React.ReactElement => {
        return <div>
            <h1>Game Over</h1>
            <p>Thank you for playing!</p>
            <button className="reset-btn" onClick={this.openGame}>Play Again</button>
        </div>
    }

    openGame = (): void => {
        this.setState({playState: "playing"})
    }
}