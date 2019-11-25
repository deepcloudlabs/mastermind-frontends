import {Component} from "react";
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Table from './Table';
import Badge from './Badge';
import Button from './Button';
import InputText from './InputText';
import Move from './Move';
import ProgressBar from "./ProgressBar";

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: this.createSecret(),
            guess: 0,
            tries: 0,
            moves: [],
            wins: 0,
            loses: 0,
            counter: 60,
            totalWinsTime: 0,
            avgWinsTime: 0,
            pbColor: "progress-bar progress-bar-success",
            pbCounter: {width: "100%"}
        }
        this.handleChange = this.handleChange.bind(this);
        this.play = this.play.bind(this);
    }

    initGame(message) {
        this.state.moves.splice(0);
        if (message !== undefined)
            this.state.moves.push(new Move(this.state.secret, message));
        this.setState({
            moves: this.state.moves,
            secret: this.createSecret(),
            counter: 60,
            tries: 0,
            pbCounter: {width: "100%"},
            pbColor: "progress-bar progress-bar-success"
        });
    }

    componentDidMount() {
        setInterval(() => this.countdown(), 1000);
    }

    handleChange(event) {
        this.setState({
            guess: event.target.value
        })
    }

    countdown() {
        console.log("countdown() is running...")
        this.setState({
            counter: this.state.counter - 1,
            pbCounter: {width: (100 * this.state.counter / 60) + "%"}
        });
        if (this.state.counter < 20)
            this.setState({
                pbColor: "progress-bar progress-bar-danger"
            });
        else if (this.state.counter < 40)
            this.setState({
                pbColor: "progress-bar progress-bar-warning"
            });
        else if (this.state.counter < 50)
            this.setState({
                pbColor: "progress-bar progress-bar-info"
            });

        if (this.state.counter <= 0) {
            this.setState({
                loses: this.state.loses + 1
            });
            this.initGame("time is out!");
        }
    }

    play() {
        if (!Number.isInteger(Number(this.state.guess))) {
            this.setState({validationMessage: this.state.guess + " is not an integer!"});
            return;
        }
        if (Number(this.state.guess) < 0) {
            this.setState({validationMessage: this.state.guess + " is a negative integer!"});
            return;
        }
        if (this.state.guess.toString().length !== 3) {
            this.setState({validationMessage: this.state.guess + " is not a 3-digit integer!"});
            return;
        }
        for (let i in this.state.moves) {
            let move = this.state.moves[i];
            if (move.guess === this.state.guess) {
                this.setState({validationMessage: "Already played with " + this.state.guess + "!"});
                return;
            }
        }

        this.setState({tries: this.state.tries + 1});

        if (this.state.guess.localeCompare(this.state.secret) === 0) {
            let totalWinTime = this.state.totalWinTime + 60 - this.state.counter;
            let wins = this.state.wins + 1;
            this.setState({
                wins: wins,
                total: this.state.total + 1,
                totalWinTime: totalWinTime,
                avgWinTime: totalWinTime / wins,
                validationMessage: ""
            });
            this.initGame("You win!");
        } else {
            let message = this.createMessage(this.state.guess, this.state.secret);
            this.state.moves.push(new Move(this.state.guess, message));
            this.setState({
                validationMessage: "",
                moves: this.state.moves
            });
        }
    }

    createRandomDigit(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    createSecret() {
        let numbers = [this.createRandomDigit(1, 9)];
        while (numbers.length < 3) {
            let candidate = this.createRandomDigit(0, 9);
            if (numbers.indexOf(candidate) === -1) numbers.push(candidate);
        }
        return numbers.join('')
    }

    createMessage(guess, secret) {
        guess = Array.from(guess.toString());
        secret = Array.from(secret.toString());
        let perfectMatch = 0, partialMatch = 0;
        for (let i in guess) {
            let index = secret.indexOf(guess[i]);
            if (index === -1) continue;
            if (index === Number(i)) {
                perfectMatch++;
            } else {
                partialMatch++;
            }
        }
        if (!(perfectMatch || partialMatch)) return "No match.";
        let message = "";
        if (perfectMatch > 0) message = "+" + perfectMatch;
        if (partialMatch > 0) message += "-" + partialMatch;
        return message;
    }

    render() {
        let table;
        if (this.state.moves.length > 0) {
            table = <Table title="Moves" columns="Guess,Message" values={this.state.moves} properties="guess,message"/>;
        }
        return (
            <div className="container">
                <p></p>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h3 className="panel-title">Game Console</h3>
                    </div>
                    <div className="panel-body">
                        <InputText htmlFor="guess" label="Guess" value={this.state.guess}
                                   onChange={this.handleChange}/>
                        <Button label="Play" doClick={this.play}/>
                        <Badge label="Tries" value={this.state.tries}/>
                        <Badge label="Counter" value={this.state.counter}/>
                        <ProgressBar progressColor={this.state.pbColor} progressCounter={this.state.pbCounter}/>
                        <Badge label="Wins" value={this.state.wins}/>
                        <Badge label="Loses" value={this.state.loses}/>
                        <Badge label="Average Win Time" value={this.state.avgWinsTime}/>
                    </div>
                </div>
                {table}
            </div>
        );
    }
}

export default Game;
