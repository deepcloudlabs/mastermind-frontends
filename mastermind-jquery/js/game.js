class Move {
    constructor(guess, perfectMatch, partialMatch) {
        this.guess = guess;
        this.perfectMatch = perfectMatch;
        this.partialMatch = partialMatch;
    }

    toString() {
        if (this.perfectMatch == 0 && this.partialMatch == 0) {
            return "No match";
        }
        let message = "";
        if (this.partialMatch > 0)
            message += "-" + this.partialMatch;
        if (this.perfectMatch > 0)
            message += "+" + this.perfectMatch;
        return message;
    }
}

class GameStatistics {
    constructor(){
        this.wins = 0;
        this.loses = 0;
        this.totalWinsTime = 0;
        this.averageWinsTime = new BigNumber(NaN);
    }

    incrementWins(time) {
        this.wins++;
        this.totalWinsTime += time;
        let p = new BigNumber(this.totalWinsTime);
        let q = new BigNumber(this.wins);
        this.averageWinsTime = p.dividedBy(q).toPrecision(5);
    }
}
class GameViewModel {
    constructor() {
        this.statistics= new GameStatistics();
        this.initialize();
        this.play = this.play.bind(this);
        this.initialize = this.initialize.bind(this);
    }

    play(guess) {
        let number = Number(guess);
        if (Number.isNaN(number)) { // validation
            return;
        }
        if (number === this.secret) {
            this.statistics.incrementWins(60-this.counter);
            this.initialize();
            return;
        }
        this.tries++;
        if (this.tries > 10) {
            this.initialize();
            this.statistics.loses++;
            return;
        }
        let move = this.evaluateMove(number);
        this.moves.push(move);
    }

    initialize() {
        this.tries = 0;
        this.counter = 60;
        this.secret = createSecret();
        console.log(this.secret);
        this.moves = [];
    }

    evaluateMove(number) {
        let perfectMatch = 0;
        let partialMatch = 0;
        let secretAsString = this.secret.toString();
        let numberAsString = number.toString();
        for (let i = 0; i < secretAsString.length; ++i) {
            let s = secretAsString.charAt(i);
            for (let j = 0; j < numberAsString.length; ++j) {
                let g = numberAsString.charAt(j);
                if (s == g) {
                    if (i == j)
                        perfectMatch++;
                    else
                        partialMatch++;
                }
            }
        }
        return new Move(number, perfectMatch, partialMatch);
    }
}