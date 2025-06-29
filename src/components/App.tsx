import React, { Component } from 'react';
import './styles/global.css';

type AppState = {
    gameState: "start" | "playing" | "finished";
}

export class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            gameState: "start"
        }
    }

    render() {
        if (this.state.gameState === "start") {
            return this.renderStart();
        }
    }

    renderStart = (): React.ReactElement => {
        return <div>
            <h1>Tic Tac Toe</h1>
            <p>Welcome to the Tic Tac Toe game!</p>
            <p>Enjoy playing!</p>
            <button className="reset-btn">Start Game</button>
        </div>
    }
}