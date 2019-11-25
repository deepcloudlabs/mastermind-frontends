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
};
$(document).ready(() => {
    initializeToastr({
        timeOut: 3000,
        closeDuration: 500,
        closeEasing: 'swing',
        progressBar: true,
        preventDuplicates: true,
        closeButton: true,
        positionClass: 'toast-top-center'
    });
    let app = new Vue({
        el: "#app",
        data: {
            tries: 0,
            guess: 123,
            counter: 60,
            moves: [],
            wins: 0,
            loses: 0,
            totalWinsTime: 0
        },
        computed: {
            getProgressBarWidth: function () {
                return Math.floor(10 * this.counter / 6) + "%";
            },
            getProgressBarClass: function () {
                if (this.counter < 20) {
                    return "progress-bar progress-bar-danger";
                } else if (this.counter < 40) {
                    return "progress-bar progress-bar-warning";
                } else if (this.counter < 50) {
                    return "progress-bar progress-bar-info";
                }
                return "progress-bar progress-bar-success";
            },
            averageWinsTime: function () {
                if (this.wins == 0) return "Not Available!";
                let p = new BigNumber(this.totalWinsTime);
                let q = new BigNumber(this.wins);
                return p.dividedBy(q).toPrecision(5);
            }
        },
        created: function () {
            this.initialize();
            setInterval(this.countDown, 1000);
        },
        methods: {
            countDown: function () {
                this.counter--;
                if (this.counter <= 0) {
                    toastr.error("You lose!");
                    toastr.warning("Secret is ".concat(this.secret));
                    this.loses++;
                    this.initialize();
                }
            },
            play: function () {
                let number = Number(this.guess);
                if (!this.validateMove(number)) return;
                if (number === this.secret) {
                    toastr.success("You win!");
                    this.incrementWins(60 - this.counter);
                    this.initialize();
                    return;
                }
                this.tries++;
                if (this.tries > 10) {
                    toastr.error("You lose!");
                    this.initialize();
                    this.loses++;
                    return;
                }
                let move = this.evaluateMove(number);
                this.moves.push(move);
            },
            incrementWins: function (time) {
                this.wins++;
                this.totalWinsTime += time;
            },
            validateMove: function (guess) {
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
                for (let i in this.moves) {
                    let move = this.moves[i];
                    if (move.guess == guess) {
                        toastr.error("You have already used " + guess + "!");
                        return false;
                    }
                }
                return true;
            },
            initialize: function () {
                this.tries = 0;
                this.counter = 60;
                this.moves.splice(0);
                this.secret = createSecret();
                console.log(this.secret);
            },
            evaluateMove: function (number) {
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
    });
});
