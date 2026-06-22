//setting up the data base to store the audio in 
async function openDB() {
    return idb.openDB('tunecairn', 1, {
        upgrade(db) {
            db.createObjectStore('recordings', {keyPath: 'id'});
        }
    }) 
}

//save a recording 
async function saveRecording(tuneId, audioBlob) {
    const db = await openDB();
    const recording = {
        id: String(Date.now()),
        tuneId: tuneId,
        blob: audioBlob,
        createdAt: new Date().toISOString(),
        //fill this in later
        duration: null
    };
    await db.put('recordings', recording);
    return recording.id;
}

//Get all the recordings for one tune 
async function getRecordingForTune(tuneId) {
    const db = await openDB();
    const all = await db.getAll('recordings');
    return all.filter(r => r.tuneId === tuneId);
}

//Delete a recording 
async function deleteRecording(id) {
    const db = await openDB();
    await db.delete('recordings', id);
}

//Recording, dealing with the mic 
let mediaRecorder = null;
let audioChunks = [];

async function startRecording() {
    //asking for mic access 
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true});

    audioChunks = []
    mediaRecorder = new MediaRecorder(stream);

    //whn a chunck of audio is ready then store it. 
    mediaRecorder.addEventListener('dataavailable', e => {
        audioChunks.push(e.data);
    })

    mediaRecorder.start();
}

function stopRecording() {
  return new Promise(resolve => {
    //when recording stops, combine all chunks into one blob
    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      resolve(audioBlob)
    })
    mediaRecorder.stop()
    //stop the microphone light going off on phone
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
  })
}