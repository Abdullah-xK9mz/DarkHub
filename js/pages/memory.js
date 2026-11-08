
  const gridElement = document.getElementById('grid');
  const movesElement = document.getElementById('moves-count');
  const matchElement = document.getElementById('match-count');
  const totalPairsElement = document.getElementById('total-pairs');
  const difficultySelect = document.getElementById('difficulty');

  const allEmojis = [
    '🐱', '🎮', '🚀', '🔥', '💎', '👻', '👑', '🦁', '🦊', '🍕',
    '🍔', '🎨', '⚽', '🎸', '🪐', '🦄', '🍿', '🎬', '⚡', '🤖'
  ];

  let cardsArray = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let lockBoard = false;
  let targetPairs = 10;

  function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme');
    if(current === 'light'){
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setupDifficulty(){
    const level = difficultySelect.value;
    let rows, cols;

    if(level === 'easy'){ rows = 4; cols = 5; }
    else if(level === 'medium'){ rows = 5; cols = 6; }
    else { rows = 6; cols = 6; }

    targetPairs = (rows * cols) / 2;
    totalPairsElement.innerText = targetPairs;

    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const selectedEmojis = allEmojis.slice(0, targetPairs);
    cardsArray = [...selectedEmojis, ...selectedEmojis];
  }

  function createBoard(){
    gridElement.innerHTML = '';
    setupDifficulty();
    shuffle(cardsArray);

    cardsArray.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-emoji', emoji);
      card.setAttribute('data-index', index);

      card.innerHTML = `
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${emoji}</div>
      `;

      card.addEventListener('click', flipCard);
      gridElement.appendChild(card);
    });
  }

  function flipCard(){
    if(lockBoard) return;
    if(this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if(flippedCards.length === 2){
      moves++;
      movesElement.innerText = moves;
      checkMatch();
    }
  }

  function checkMatch(){
    const [card1, card2] = flippedCards;
    const isMatch = card1.getAttribute('data-emoji') === card2.getAttribute('data-emoji');

    if(isMatch){
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards(){
    flippedCards[0].removeEventListener('click', flipCard);
    flippedCards[1].removeEventListener('click', flipCard);
    flippedCards[0].classList.add('matched');
    flippedCards[1].classList.add('matched');

    matchedPairs++;
    matchElement.innerText = matchedPairs;

    resetTurn();

    if(matchedPairs === targetPairs){
      setTimeout(() => {
        document.getElementById('winDesc').innerHTML =
          `خلصت المستوى بنجاح في <b>${moves}</b> محاولة!`;
        document.getElementById('winOverlay').style.display = 'flex';
      }, 500);
    }
  }

  function unflipCards(){
    lockBoard = true;
    setTimeout(() => {
      flippedCards[0].classList.remove('flipped');
      flippedCards[1].classList.remove('flipped');
      resetTurn();
    }, 900);
  }

  function resetTurn(){
    flippedCards = [];
    lockBoard = false;
  }

  function closeWin(){
    document.getElementById('winOverlay').style.display = 'none';
    resetGame();
  }

  function resetGame(){
    moves = 0;
    matchedPairs = 0;
    movesElement.innerText = '0';
    matchElement.innerText = '0';
    flippedCards = [];
    lockBoard = false;
    createBoard();
  }

  window.onload = createBoard;
