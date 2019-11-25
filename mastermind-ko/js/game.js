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
    constructor() {
        this.wins = ko.observable(0);
        this.loses = ko.observable(0);
        this.totalWinsTime = ko.observable(0);
        this.averageWinsTime = ko.computed(() => {
            if (this.wins() == 0) return "Not Available!";
            let p = new BigNumber(this.totalWinsTime());
            let q = new BigNumber(this.wins());
            return p.dividedBy(q).toPrecision(5);
        });
    }

    incrementWins(time) {
        this.wins(this.wins() + 1);
        this.totalWinsTime(this.totalWinsTime() + time);
    }
}

class GameViewModel {
    constructor() {
        this.tries = ko.observable(0);
        this.guess = ko.observable(123);
        this.counter = ko.observable(60);
        this.moves = ko.observableArray([]);
        this.statistics = new GameStatistics();
        this.initialize();
        this.play = this.play.bind(this);
        this.initialize = this.initialize.bind(this);
        this.validateMove = this.validateMove.bind(this);
        this.countDown = this.countDown.bind(this);
        this.getProgressBarClass = this.getProgressBarClass.bind(this);
        this.getProgressBarWidth = this.getProgressBarWidth.bind(this);
        this.pbWidth = ko.computed(this.getProgressBarWidth);
        this.pbClass = ko.computed(this.getProgressBarClass);
        setInterval(this.countDown, 1000);
    }

    countDown() {
        this.counter(this.counter() - 1);
        if (this.counter() <= 0) {
            toastr.error("You lose!");
            toastr.warning("Secret is ".concat(this.secret));
            this.statistics.loses(this.statistics.loses() + 1);
            this.initialize();
        }
    }

    getProgressBarWidth() {
        return Math.floor(10 * this.counter() / 6) + "%";
    }

    getProgressBarClass() {
        if (this.counter() < 20) {
            return "progress-bar progress-bar-danger";
        } else if (this.counter() < 40) {
            return "progress-bar progress-bar-warning";
        } else if (this.counter() < 50) {
            return "progress-bar progress-bar-info";
        }
        return "progress-bar progress-bar-success";
    }

    play() {
        let number = Number(this.guess());
        if (!this.validateMove(number)) return;
        if (number === this.secret) {
            toastr.success("You win!");
            this.statistics.incrementWins(60 - this.counter());
            this.initialize();
            return;
        }
        this.tries(this.tries() + 1);
        if (this.tries() > 10) {
            toastr.error("You lose!");
            this.initialize();
            this.statistics.loses(this.statistics.loses() + 1);
            return;
        }
        let move = this.evaluateMove(number);
        this.moves.push(move);
    }

    validateMove(guess) {
        if (Number.isNaN(Number(guess))) {
            toastr.error("This is not a valid integer!");
            return false;
        }
        if (guess.toString().length != 3) {
            toastr.error("Please, enter a 3-digit integer!");
            return false;
        }
        if (hasDuplicateDigits(Number(guess))) {
            toastr.error(guess + " has duplicated digits!");
            return false;
        }
        for (let i in this.moves()) {
            let move = this.moves()[i];
            if (move.guess == guess) {
                toastr.error("You have already used " + guess + "!");
                return false;
            }
        }
        return true;
    }

    initialize() {
        this.tries(0);
        this.counter(60);
        this.moves([]);
        this.secret = createSecret();
        console.log(this.secret);
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