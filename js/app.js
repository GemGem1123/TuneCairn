
document.addEventListener('DOMContentLoaded', async () => {

  // Track current filter
  let currentFilter = 'all';

  await renderTuneList();

  const overlay = document.getElementById('overlay');

  // FILTER CHIPS
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      // Remove active class from all chips
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
      // Add active class to clicked chip
      chip.classList.add('chip--active');
      // Filter the tune list
      currentFilter = chip.dataset.filter;
      await renderTuneList(currentFilter);
    });
  });

  //OPEN
  document.querySelector('.add-btn').addEventListener('click', () => {
    overlay.classList.add('overlay--visible');
  });

  //CANCEL
  document.getElementById('form-cancel').addEventListener('click', () => {
    overlay.classList.remove('overlay--visible');
  });

  //SAVE
  document.getElementById('form-save').addEventListener('click', async () => {

    const name = document.getElementById('tune-name').value.trim();
    const type = document.getElementById('tune-type').value;
    const key = document.getElementById('tune-key').value.trim();
    const notes = document.getElementById('tune-notes').value.trim();

    //Validation
    if (!name) {
      name = "Untitled Tune";
      return
    }

    const tune = {
      id: String(Date.now()),
      name: name,
      type: type.toLowerCase(),
      key: key,
      notes: notes,
      sets: [],
      sessionId: null,
      lastPractised: new Date().toISOString()
    }

    saveTune(tune);
    await renderTuneList(currentFilter);

    //Clean stuff up
    overlay.classList.remove('overlay--visible');
    document.getElementById('tune-name').value = '';
    document.getElementById('tune-type').value = 'reel';
    document.getElementById('tune-key').value = '';
    document.getElementById('tune-notes').value = '';
  });

  //for the record buttons 
  //Recording  uses event delegation
    document.querySelector('.tune-list').addEventListener('click', async (e) => {
        if (!e.target.classList.contains('record-btn')) return

        const tuneId = e.target.dataset.id;
        const btn = e.target;

        if (btn.textContent.includes('Record')) {
            //start recording
            await startRecording();
            btn.textContent = '⏹ Stop';
            btn.style.color = 'red';
        } else {
            //stop and save
            const audioBlob = await stopRecording();
            await saveRecording(tuneId, audioBlob);
            await updateRecordingCount();
            btn.textContent = '⏺ Record';
            btn.style.color = '';
            alert('Recording saved!');
        }
    });

    //for the pop up tune information 
    //open detail when a tune card is clicked
    document.querySelector('.tune-list').addEventListener('click', (e) => {
        const card = e.target.closest('.tune-card');
        if (!card) return;

        const tuneId = card.dataset.id;
        const tunes = getAllTunes();
        const tune = tunes.find(t => t.id === tuneId);
        if (tune) openTuneDetail(tune);
    });

    // close button
    document.getElementById('tune-detail-close').addEventListener('click', () => {
        document.getElementById('tune-overlay').classList.remove('overlay--visible');
    });

    //close by clicking the dark backdrop
    document.getElementById('tune-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('tune-overlay')) {
            document.getElementById('tune-overlay').classList.remove('overlay--visible');
        }
    });

    //record button inside the detail view
    document.getElementById('detail-record-btn').addEventListener('click', async () => {
        const btn = document.getElementById('detail-record-btn');
        const tuneId = document.getElementById('tune-overlay').dataset.tuneId;

        if (!btn.classList.contains('recording')) {
            await startRecording();
            btn.classList.add('recording');
            btn.setAttribute('aria-label', 'Stop recording');
        } else {
            const audioBlob = await stopRecording();

            //ask for a name
            const name = prompt('Name this recording:') || 'Untitled';

            await saveRecording(tuneId, audioBlob, name);
            await updateRecordingCount();
            btn.classList.remove('recording');
            btn.setAttribute('aria-label', 'Record');

            //refresh the recordings list
            renderRecordingsForTune(tuneId);
        }
    });
});