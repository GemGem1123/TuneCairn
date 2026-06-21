
//the tune JSON looks like 
/* 
    {
    id: '1234567890',       // Date.now() as a string unique enough for now :)
    name: 'Drowsy Maggie',
    type: 'reel',
    key: 'E dorian',
    notes: '',
    sets: [],
    sessionId: null,        // thesession.org ID
    lastPractised: null
    }
*/


// method to save a tune (to local storage)
function saveTune(tune) {
    const tunes = getAllTunes();
    tunes.push(tune);
    localStorage.setItem('tunes', JSON.stringify(tunes));
}

// get all the tunes from storage 
function getAllTunes() {
    const stored = localStorage.getItem('tunes');
    return stored ? JSON.parse(stored) : [];
}

// method to delete a tune 
function deleteTune(id) {
    const tune = getAllTunes().filter(tunes => tune.id !== id);
    localStorage.setItem('tunes', JSON.stringify(tune));
}

// get tune by id 
function deleteTune(id) {
    const tune = getAllTune().filter(tunes => tune.id !== id);
    return tune ? JSON.parse(tune) : [];
}
