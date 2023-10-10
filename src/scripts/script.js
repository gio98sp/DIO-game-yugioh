const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score-points'),
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-cards'),
    computer: document.getElementById('computer-field-cards'),
  },
  playerSides: {
    player1: 'player-cards',
    player1Box: document.querySelector('#player-cards'),
    player2: 'computer-cards',
    player2Box: document.querySelector('#computer-cards'),
  },
  actions: {
    button: document.getElementById('next-duel'),
  },
  cardIcon: {
    cardBack: './src/assets/icons/card-back.png',
  },
};

const pathImages = './src/assets/icons/';
const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Papel',
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magican',
    type: 'Rock',
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}
async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', state.cardIcon.cardBack);
  cardImage.setAttribute('data-id', IdCard);
  cardImage.classList.add('card');

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(cardImage.getAttribute('data-id'));
    });
  }
  return cardImage;
}
async function drawSelectCard(cardID) {
  state.cardSprites.avatar.src = cardData[cardID].img;
  state.cardSprites.avatar.style.width = '100%';
  state.cardSprites.avatar.style.height = '100%';
  state.cardSprites.name.innerText = cardData[cardID].name;
  state.cardSprites.type.innerText = 'Atribute: ' + cardData[cardID].type;
}
async function setCardsField(cardId) {
  await removeAllCardsImages();
  const computerCardId = await getRandomCardId();
  state.fieldCards.computer.style.display = 'block';
  state.fieldCards.player.style.display = 'block';
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
  let duelResults = await checkDuelResults(cardId, computerCardId);
  await drawButton(duelResults);
  await updateScore();
}
async function removeAllCardsImages() {
  let { player1Box, player2Box } = state.playerSides;
  let imageElemtens = player1Box.querySelectorAll('img');
  imageElemtens.forEach((img) => {
    img.remove();
  });
  imageElemtens = player2Box.querySelectorAll('img');
  imageElemtens.forEach((img) => {
    img.remove();
  });
}
async function checkDuelResults(cardId, computerCardId) {
  let duelResults = 'Empate';
  let playerCard = cardData[cardId];
  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = 'Ganhou';
    await audioPlay('win');
    state.score.playerScore++;
  }
  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = 'Perdeu';
    await audioPlay('lose');
    state.score.computerScore++;
  }
  return duelResults;
}
async function updateScore() {
  state.score.scoreBox.innerHTML = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore} `;
}
async function drawButton(result) {
  state.actions.button.innerText = result;
  state.actions.button.style.display = 'block';
}

async function drawCards(cardNumbers, fieldSide) {
  for (let index = 0; index < cardNumbers; index++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}
async function resetDuel() {
  state.cardSprites.avatar.src = '';
  state.cardSprites.avatar.style.width = '';
  state.cardSprites.avatar.style.height = '';
  state.cardSprites.name.innerText = 'Selecionar';
  state.cardSprites.type.innerText = 'uma carta';
  state.actions.button.style.display = 'none';
  state.fieldCards.player.style.display = 'none';
  state.fieldCards.computer.style.display = 'none';
  init();
}
async function audioPlay(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}
function init() {
  const bgm = document.getElementById('bgm');
  bgm.volume = 0.3;
  bgm.play();
  state.fieldCards.computer.style.display = 'none';
  state.fieldCards.player.style.display = 'none';
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.player2);
}
init();
