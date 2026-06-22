
// creates a tune cards and populates it with the tune data
function renderTuneCard(tune) {
    const card = document.createElement('div')
    card.className = 'tune-card'
    card.innerHTML = `
        <div class="tune-card__accent tune-card__accent--${tune.type}"></div>
        <div class="tune-card__body">
        <span class="tune-card__name"></span>
        <span class="badge badge--${tune.type}"></span>
        </div>
        <div class="card-actions">
        <button class="record-btn" data-id="${tune.id}">⏺ Record</button>
        </div>
        `

    card.querySelector('.tune-card__name').textContent = tune.name
    card.querySelector('.badge').textContent = tune.type

    return card
}

function renderTuneList() {
    const list = document.querySelector('.tune-list')
    // clear list 
    list.innerHTML = ''  
  
    const tunes = getAllTunes()
    tunes.forEach(tune => list.appendChild(renderTuneCard(tune)))
}