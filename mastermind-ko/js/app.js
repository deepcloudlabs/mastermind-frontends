let gameViewModel = new GameViewModel();
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
    ko.applyBindings(gameViewModel);
});