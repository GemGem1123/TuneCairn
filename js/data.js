
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
    const tunes = getAllTunes().filter(tune => tune.id !== id);
    localStorage.setItem('tunes', JSON.stringify(tunes));
}

// get tune by id 
function getTuneById(id) {
    const tunes = getAllTunes();
    return tunes.find(tune => tune.id === id);
}
