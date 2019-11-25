class GameController {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.triesSpan = document.getElementById("tries");
        this.guessInputText = document.getElementById("guess");
        this.playButton = document.getElementById("playButton");
        this.movesBody = document.getElementById("movesBody");
        this.winsBadge = document.getElementById("wins");
        this.losesBadge = document.getElementById("loses");
        this.avgWinsTimeBadge = document.getElementById("avgWinsTimeBadge");
        this.pbCounter = document.getElementById("counter");

        this.play = this.play.bind(this);
        this.updateView = this.updateView.bind(this);
        this.emptyElement = this.emptyElement.bind(this);
        this.countDown = this.countDown.bind(this);
        this.validateMove = this.validateMove.bind(this);
        this.playButton.addEventListener("click", this.play, false);
        setInterval(this.countDown, 1000);
        toastr.info('Welcome to the game!');
    }

    play() {
        let guess = this.guessInputText.value;
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
        this.pbCounter.setAttribute("style", "width: " + (10 * this.viewModel.counter) / 6 + "%;");
        let clazz = "progress-bar progress-bar-success";
        if (this.viewModel.counter < 20) {
            clazz = "progress-bar progress-bar-danger";
        }
        else if (this.viewModel.counter < 40) {
            clazz = "progress-bar progress-bar-warning";
        }
        this.pbCounter.setAttribute("class", clazz);
        this.triesSpan.innerText = this.viewModel.tries;
        this.winsBadge.innerText = this.viewModel.statistics.wins;
        this.losesBadge.innerText = this.viewModel.statistics.loses;
        if (!Number.isNaN(this.viewModel.statistics.averageWinsTime))
            this.avgWinsTimeBadge.innerText = this.viewModel.statistics.averageWinsTime;
        this.emptyElement(this.movesBody);
        for (let i in this.viewModel.moves) {
            let move = this.viewModel.moves[i];
            let row = this.movesBody.insertRow();
            let guessColumn = row.insertCell(0);
            let evalColumn = row.insertCell(1);
            let guessTextNode = document.createTextNode(move.guess);
            let evalTextNode = document.createTextNode(move.toString());
            guessColumn.appendChild(guessTextNode);
            evalColumn.appendChild(evalTextNode);
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

    emptyElement(element) {
        var node = element;
        while (element.hasChildNodes()) {
            if (node.hasChildNodes()) {
                node = node.lastChild;
            } else {
                node = node.parentNode;
                node.removeChild(node.lastChild);
            }
        }
    } ;
}

window.onload = () => {
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
};