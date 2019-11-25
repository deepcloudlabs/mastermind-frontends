class GameController {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.triesSpan = $("#tries");
        this.guessInputText = $("#guess");
        this.playButton = $("#playButton");
        this.movesBody = $("#movesBody");
        this.winsBadge = $("#wins");
        this.losesBadge = $("#loses");
        this.avgWinsTimeBadge = $("#avgWinsTimeBadge");
        this.pbCounter = $("#counter");

        this.play = this.play.bind(this);
        this.updateView = this.updateView.bind(this);
        this.countDown = this.countDown.bind(this);
        this.validateMove = this.validateMove.bind(this);
        this.playButton.click(this.play);
        setInterval(this.countDown, 1000);
        toastr.info('Welcome to the game!');
    }

    play() {
        let guess = this.guessInputText.val();
        if (this.validateMove(guess)) {
            // Update View Model
            this.viewModel.play(guess);
            // Update View
            this.updateView();
        }
    }

    countDown() {
        this.viewModel.counter--;
        if (this.viewModel.counter <= 0) {
            toastr.error('Time is over!');
            toastr.warning('Secret is ' + this.viewModel.secret);
            this.viewModel.statistics.loses++;
            this.viewModel.initialize();
        }
        this.updateView();
    }

    updateView() {
        this.pbCounter.attr("style", "width: " + (10 * this.viewModel.counter) / 6 + "%;");
        let clazz = "progress-bar progress-bar-success";
        if (this.viewModel.counter < 20) {
            clazz = "progress-bar progress-bar-danger";
        }
        else if (this.viewModel.counter < 40) {
            clazz = "progress-bar progress-bar-warning";
        }
        this.pbCounter.attr("class", clazz);
        this.triesSpan.text(this.viewModel.tries);
        this.winsBadge.text(this.viewModel.statistics.wins);
        this.losesBadge.text(this.viewModel.statistics.loses);
        if (!Number.isNaN(this.viewModel.statistics.averageWinsTime))
            this.avgWinsTimeBadge.text(this.viewModel.statistics.averageWinsTime);
        this.movesBody.empty();
        for (let i in this.viewModel.moves) {
            let move = this.viewModel.moves[i];
            this.movesBody.append(
              "<tr>" +
                    "<td>"+move.guess+"</td>" +
                    "<td>"+move.toString()+"</td>"+
              "</tr>"
            );
        }
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
        for (let i in this.viewModel.moves) {
            let move = this.viewModel.moves[i];
            if (move.guess == guess) {
                toastr.error("You have already used " + guess + "!");
                return false;
            }
        }
        return true;
    }

}

$(document).ready( () => {
    initializeToastr({
        timeOut: 3000,
        closeDuration: 500,
        closeEasing: 'swing',
        progressBar: true,
        preventDuplicates: true,
        closeButton: true,
        positionClass: 'toast-top-center'

    });

    let gameViewModel = new GameViewModel();
    let controller = new GameController(gameViewModel);
});