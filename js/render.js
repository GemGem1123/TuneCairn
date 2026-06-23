
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