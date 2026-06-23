
function updateTuneCount() {
    const countEl = document.getElementById('tune-count')
    const tunes = getAllTunes()
    countEl.textContent = tunes.length;    
}

async function updateRecordingCount() {
    const countEl = document.getElementById('recording-count')
    const recordings = await getAllRecordings()
    countEl.textContent = recordings.length;    
}

// creates a tune cards and populates it with the tune data
function renderTuneCard(tune) {
    const card = document.createElement('div')
    card.className = 'tune-card'
    card.dataset.id = tune.id
    const tuneTypeClass = tune.type.replace(/\s+/g, '-')
    card.innerHTML = `
        <div class="tune-card__accent tune-card__accent--${tuneTypeClass}"></div>
        <div class="tune-card__body">
          <div class="tune-card__top">
            <span class="tune-card__name"></span>
            <span class="badge badge--${tuneTypeClass}"></span>
          </div>
          <div class="tune-card__meta">
            <span>${tune.key || ''}</span>
            <span>·</span>
            <span>${tune.lastPractised ? new Date(tune.lastPractised).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
          </div>
        </div>
    `

    card.querySelector('.tune-card__name').textContent = tune.name
    card.querySelector('.badge').textContent = tune.type
    card.querySelector('.tune-card__meta span:first-child').textContent = tune.key || ''
    card.querySelector('.tune-card__meta span:last-child').textContent = tune.lastPractised ? new Date(tune.lastPractised).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

    return card
}

async function renderTuneList(filter = 'all') {
    const list = document.querySelector('.tune-list')
    // clear list 
    list.innerHTML = ''  
  
    let tunes = getAllTunes()
    
    // Apply filter
    if (filter !== 'all') {
        tunes = tunes.filter(tune => tune.type === filter)
    }
    
    tunes.forEach(tune => list.appendChild(renderTuneCard(tune)))

    //update stats
    updateTuneCount();
    await updateRecordingCount();
}

function openTuneDetail(tune) {
  // Store the current tune for editing
  document.getElementById('tune-overlay').dataset.currentTune = JSON.stringify(tune)
  
  // fill in the name
  document.getElementById('detail-name').textContent = tune.name

  // fill in the pills, ie the wee tags with tune attributes 
  const pillsEl = document.getElementById('detail-pills')
  pillsEl.innerHTML = ''

  const typePill = document.createElement('span')
  typePill.className = 'detail-pill detail-pill--type'
  typePill.textContent = tune.type
  pillsEl.appendChild(typePill)

  if (tune.key) {
    const keyPill = document.createElement('span')
    keyPill.className = 'detail-pill'
    keyPill.textContent = tune.key
    pillsEl.appendChild(keyPill)
  }

  // notes
  const notesEl = document.getElementById('detail-notes')
  if (tune.notes) {
    notesEl.textContent = tune.notes
    notesEl.classList.remove('tune-detail__notes--empty')
  } else {
    notesEl.textContent = 'Nae notes fae this tune.'
    notesEl.classList.add('tune-detail__notes--empty')
  }

  // recordings async because IndexedDB
  renderRecordingsForTune(tune.id)

  // store which tune is open so the record button knows
  document.getElementById('tune-overlay').dataset.tuneId = tune.id

  // show the overlay
  document.getElementById('tune-overlay').classList.add('overlay--visible')
}

function toggleTuneEditMode(tune) {
  const scroll = document.getElementById('detail-scroll')
  const recordBtn = document.getElementById('detail-record-btn')
  const detailName = document.getElementById('detail-name')
  const detailPills = document.getElementById('detail-pills')
  const detailNotes = document.getElementById('detail-notes')
  const detailRecordings = document.getElementById('detail-recordings')
  
  // Check if in edit mode by looking for the edit form
  const existingForm = scroll.querySelector('.tune-detail__edit-form')
  
  if (existingForm) {
    // Exit edit mode - show view mode
    recordBtn.classList.remove('tune-detail__record-btn--hidden')
    scroll.innerHTML = `
      <div class="tune-detail__section">
        <div class="tune-detail__section-label">Notes</div>
        <p class="tune-detail__notes" id="detail-notes"></p>
      </div>
      <div class="tune-detail__section">
        <div class="tune-detail__section-label">Recordings</div>
        <div class="tune-detail__recordings" id="detail-recordings"></div>
      </div>
    `
    
    // Restore note
    const notesEl = document.getElementById('detail-notes')
    if (tune.notes) {
      notesEl.textContent = tune.notes
      notesEl.classList.remove('tune-detail__notes--empty')
    } else {
      notesEl.textContent = 'Nae notes fae this tune.'
      notesEl.classList.add('tune-detail__notes--empty')
    }
    
    // Re-render recordings
    renderRecordingsForTune(tune.id)
  } else {
    // Enter edit mode - show form and hide record button
    recordBtn.classList.add('tune-detail__record-btn--hidden')
    scroll.innerHTML = `
      <div class="tune-detail__edit-form">
        <div class="tune-detail__form-group">
          <label class="tune-detail__form-label">Name</label>
          <input class="tune-detail__form-input" type="text" id="edit-tune-name" value="${tune.name}" />
        </div>
        
        <div class="tune-detail__form-group">
          <label class="tune-detail__form-label">Type</label>
          <select class="tune-detail__form-input" id="edit-tune-type">
            <option value="reel" ${tune.type === 'reel' ? 'selected' : ''}>Reel</option>
            <option value="jig" ${tune.type === 'jig' ? 'selected' : ''}>Jig</option>
            <option value="waltz" ${tune.type === 'waltz' ? 'selected' : ''}>Waltz</option>
            <option value="strathspey" ${tune.type === 'strathspey' ? 'selected' : ''}>Strathspey</option>
            <option value="hornpipe" ${tune.type === 'hornpipe' ? 'selected' : ''}>Hornpipe</option>
            <option value="polka" ${tune.type === 'polka' ? 'selected' : ''}>Polka</option>
            <option value="slip jig" ${tune.type === 'slip jig' ? 'selected' : ''}>Slip jig</option>
            <option value="march" ${tune.type === 'march' ? 'selected' : ''}>March</option>
          </select>
        </div>
        
        <div class="tune-detail__form-group">
          <label class="tune-detail__form-label">Key</label>
          <input class="tune-detail__form-input" type="text" id="edit-tune-key" value="${tune.key || ''}" />
        </div>
        
        <div class="tune-detail__form-group">
          <label class="tune-detail__form-label">Notes</label>
          <textarea class="tune-detail__form-input tune-detail__form-textarea" id="edit-tune-notes">${tune.notes || ''}</textarea>
        </div>
        
        <div class="tune-detail__edit-actions">
          <button class="tune-detail__edit-btn tune-detail__edit-btn--save" id="edit-tune-save">Save</button>
          <button class="tune-detail__edit-btn tune-detail__edit-btn--cancel" id="edit-tune-cancel">Cancel</button>
        </div>
      </div>
    `
  }
}

async function renderRecordingsForTune(tuneId) {
  const container = document.getElementById('detail-recordings')
  container.innerHTML = ''

  const recordings = await getRecordingsForTune(tuneId)

  if (recordings.length === 0) {
    container.innerHTML = '<p style="font-size:13px; color:var(--color-text-muted)">Nae recordings yet, hit the button below!</p>'
    return
  }

  recordings.forEach(rec => {
    const row = document.createElement('div')
    row.className = 'recording-row'

    const playBtn = document.createElement('button')
    playBtn.className = 'recording-row__play'
    playBtn.setAttribute('aria-label', 'Play recording')
    playBtn.innerHTML = '<div class="recording-row__play-tri"></div>'

    // play the audio when clicked
    playBtn.addEventListener('click', () => {
      const url = URL.createObjectURL(rec.blob)
      const audio = new Audio(url)
      audio.play()
    })

    const info = document.createElement('div')
    info.className = 'recording-row__info'

    const name = document.createElement('div')
    name.className = 'recording-row__name'
    name.textContent = rec.name || 'Untitled recording'

    const meta = document.createElement('div')
    meta.className = 'recording-row__meta'
    meta.textContent = new Date(rec.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    })

    info.appendChild(name)
    info.appendChild(meta)

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'recording-row__delete'
    deleteBtn.textContent = '✕'
    deleteBtn.setAttribute('aria-label', 'Delete recording')
    deleteBtn.addEventListener('click', async () => {
      await deleteRecording(rec.id)
      await updateRecordingCount()
      renderRecordingsForTune(tuneId)
    })

    row.appendChild(playBtn)
    row.appendChild(info)
    row.appendChild(deleteBtn)
    container.appendChild(row)
  })
}