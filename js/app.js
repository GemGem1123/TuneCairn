
document.addEventListener('DOMContentLoaded', () => {

    // render the tune when the page loads
    renderTuneList();

    // add a tune 
    //shows a wee prompt for just now 
    document.querySelector('.add-btn').addEventListener('click', () => {

        const name = prompt('Tune name?');
        if (!name) return;

        const type = prompt('Type? (reel, jig, waltz, hornpipe...)');
        if (!type) return;

        const key = prompt('Key? (e.g. D major, E dorian...)');
        if (!key) return;

        const tune = {
        id: String(Date.now()),
        name: name,
        type: type.toLowerCase(),
        key: key,
        notes: '',
        sets: [],
        sessionId: null,
        lastPractised: new Date().toISOString()
        };

        saveTune(tune);
        renderTuneList();
    });
});