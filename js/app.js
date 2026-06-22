
document.addEventListener('DOMContentLoaded', () => {

  renderTuneList();

  const overlay = document.getElementById('overlay');

  //OPEN
  document.querySelector('.add-btn').addEventListener('click', () => {
    overlay.classList.add('overlay--visible');
  });

  //CANCEL
  document.getElementById('form-cancel').addEventListener('click', () => {
    overlay.classList.remove('overlay--visible');
  });

  //SAVE
  document.getElementById('form-save').addEventListener('click', () => {

    const name = document.getElementById('tune-name').value.trim();
    const type = document.getElementById('tune-type').value;
    const key = document.getElementById('tune-key').value.trim();
    const notes = document.getElementById('tune-notes').value.trim();

    //Validation
    if (!name) {
      alert('Yer tune needs a name!')
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
    renderTuneList();

    //Clean stuff up
    overlay.classList.remove('overlay--visible');
    document.getElementById('tune-name').value = '';
    document.getElementById('tune-key').value = '';
    document.getElementById('tune-notes').value = '';
  });
});