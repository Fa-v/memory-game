$(document).ready(init);

/**
 * DOM element selectors
 */
const $stars = $('.fa-star');
const $moves = $('.moves');
const $timer = $('.timer');
const $resetGame = $('.reset-game');
const $cards = $('.card');
const $cardsIcons = $('.card .fa');

let icons = [
  'fa-pied-piper',
  'fa-pied-piper',
  'fa-rebel',
  'fa-rebel',
  'fa-share-alt',
  'fa-share-alt',
  'fa-podcast',
  'fa-podcast',
  'fa-free-code-camp',
  'fa-free-code-camp',
  'fa-github-alt',
  'fa-github-alt',
  'fa-stack-overflow',
  'fa-stack-overflow',
  'fa-slack',
  'fa-slack'
];
let startCounting;
let showModal;
let gameHistory;
let game = getInitialGameState();

/**
 * @description Returns the initial state object
 */
function getInitialGameState () {
  return {
    clicks: 0,
    count: 0,
    moves: 0,
    timer: 0,
    stars: 3,
    matchedCards: [],
    pairToCheck: { iconName: [], cardId: [] },
    displaySeconds: '',
    displayMinutes: ''
  };
}

/**
 * @description Shuffles cards, sets initial display when the app is loaded,
 * clears all intervals and timeouts, and gets localStorage
 */
function init () {
  shuffle(icons);

  $moves.text('Moves: 00');
  $timer.text('Time: 00:00');

  $stars.css('color', '#f1c40f');

  clearInterval(startCounting);
  clearTimeout(showModal);

  gameHistory = JSON.parse(localStorage.getItem('record')) || {};
}

/**
 * @description Shuffles the deck of cards when the app is loaded, and calls
 * assignCards
 * @param {array} icons
 */
function shuffle (icons) {
  let m = icons.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = icons[m];
    icons[m] = icons[i];
    icons[i] = t;
  }
  assignCards(icons);
}

/**
 * @description Assigns icons randomly to the DOM
 * @param {object} icons the array of shuffled cards
 */
function assignCards (icons) {
  $cardsIcons.each(function (index) {
    $(this).addClass(icons[index]);
  });
}

/**
 * @description Adds event listeners and calls clickHandler
 */
$cards.on('click', clickHandler);

/**
 * @description Flips each card on click, calls checkIfMatch and starts timer
 * @param {object} event the jQuery event object
 */
function clickHandler (event) {
  event.preventDefault();
  let id = $(this).data('key');
  let cardIcon = icons[id];

  game.count += 1;
  game.clicks += 1;
  if (game.count > 2) {
    return false;
  }

  game.clicks === 1 && startTimer();
  $(this).addClass('flip-card').off('click');

  game.pairToCheck.cardId.push(id);
  game.pairToCheck.iconName.push(cardIcon);

  game.count === 2 && checkIfMatch();
}

/**
 * @description Checks for a match in the icon classes, resets the pairToCheck
 * array, disables clicks and calls matchedPair and noMatch functions
 */
function checkIfMatch () {
  let match = game.pairToCheck &&
    (game.pairToCheck.iconName[0] === game.pairToCheck.iconName[1])
  let differentCard = game.pairToCheck &&
    (game.pairToCheck.cardId[0] !== game.pairToCheck.cardId[1]);

  $cards.off('click');
  match && differentCard ? matchedPair(match) : noMatch(match);
  movesCounter(differentCard);
  game.pairToCheck = { iconName: [], cardId: [] };
}

/**
 * @description Increments moves by one when two cards have been clicked
 * @param {boolean} differentCard
 */
function movesCounter (differentCard) {
  let numOfMoves = differentCard ? game.moves += 1 : game.moves;
  let movesText = (numOfMoves < 10)
    ? `Moves: 0${numOfMoves}`
    : `Moves: ${numOfMoves}`;

  game.moves && countStars();
  $moves.text(movesText);
  calculateWinner();
}

/**
 * @description Applies effects to matched pair of cards
 * @param {boolean} match
 */
function matchedPair (match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];
  let cardIdOne = game.pairToCheck.cardId[0];
  let cardIdTwo = game.pairToCheck.cardId[1];

  game.matchedCards.push(cardIdOne, cardIdTwo);
  handleMatchEffects([cardOne, cardTwo], 'green');
}

/**
 * @description Applies color green and bounce effects to equal cards
 * @param {object} cards
 * @param {string} color
 */
function handleMatchEffects (cards, color) {
  $(cards).each(function () {
    $(this).children('.back')
      .addClass(color, 1000)
      .effect('bounce', { times: 3 }, 500, function () {
        game.count = 0;
      });
  });

  toggleClick();
}

/**
 * @description Applies effects to pair of cards that doesn't match
 * @param {boolean} match
 */
function noMatch (match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];

  handleNoMatchEffect([cardOne, cardTwo], 'red');
}

/**
 * @description Applies color red and shake effects when cards are different,
 * flips cards and removes red color.
 * @param {object} cards
 * @param {string} color
 */
function handleNoMatchEffect (cards, color) {
  $(cards).each(function () {
    $(this).children('.back')
      .addClass('red', 1000)
      .effect('shake', 500, function () {
        $(this).removeClass('flip-card');
        $(this).children('.back').removeClass('red', 500);
        game.count = 0;
      }.bind(this));
  });

  toggleClick();
}

/**
 * @description Disables and enables again clicks on cards
 */
function toggleClick () {
  $cards.each(function () {
    let cardKey = $(this).data('key');

    if (game.matchedCards.indexOf(cardKey) === -1) {
      $(this).on('click', clickHandler);
    } else {
      $(this).off('click', clickHandler);
    }
  });
}

/**
 * @description Starts timer when the user clicks the first card and
 * ends when all the cards have been matched.
 */
function gameDuration () {
  let gameTimer = game.timer += 1;
  let seconds = (gameTimer >= 60) ? (gameTimer % 60) : gameTimer;
  let minutes = Math.floor(gameTimer / 60);
  let displayTime;

  game.displaySeconds = seconds < 10 ? '0' + seconds : seconds;
  game.displayMinutes = minutes < 10 ? '0' + minutes : minutes
  displayTime = `Timer: ${game.displayMinutes}:${game.displaySeconds}`;

  $timer.text(displayTime);
}

/**
 * @description Starts time count
 */
function startTimer () {
  startCounting = setInterval(gameDuration, 1000);
}

/**
 * @description Counts stars depending on the number of moves
 */
function countStars () {
  game.moves === 10
    ? $($stars[2]).css('color', '#ecf0f1') && (game.stars -= 1)
    : $stars[2];
  game.moves === 20
    ? $($stars[1]).css('color', '#ecf0f1') && (game.stars -= 1)
    : $stars[1];
}

/**
 * @description Checks for 16 ids in matchedCards array if true, show modal
 * and calls setGameHistory to set game's record on localStorage
 */
function calculateWinner () {
  let movesScore = `Moves: ${game.moves}`;
  let starsScore = (game.stars === 1)
    ? `Star: ${game.stars}`
    : `Stars: ${game.stars}`;
  let timeScore = `Time: ${game.displayMinutes}:${game.displaySeconds}`;
  let record = {lastGame: [timeScore, movesScore, starsScore]};

  $('.movesScore').text(movesScore);
  $('.starsScore').text(starsScore);
  $('.timeScore').text(timeScore);

  (game.matchedCards.length === 16) && modalShow();

  setGameHistory(record);
}

function setGameHistory (record) {
  localStorage.setItem('record', JSON.stringify(record));
}

/**
 * @description Shows modal when all cards are matched and the last game record
 * if there's any
 */
function modalShow () {
  clearInterval(startCounting);

  let timeScore = gameHistory.lastGame[0];
  let movesScore = gameHistory.lastGame[1];
  let starsScore = gameHistory.lastGame[2];
  let lastGameResults = timeScore.concat(', ', movesScore, ', ', starsScore);
  let lastGame = `Last time you played: ${lastGameResults}`

  showModal = setTimeout(function () {
    gameHistory.lastGame && $('#gameHistory').text(lastGame);
    $('.modal').show();
  }, 1200);
}

/**
 * @description Resets all values
 */
$resetGame.on('click', function () {
  game = getInitialGameState();

  /* Removes all classes assigned during the game */
  $('*').removeClass('flip-card');
  $('*').removeClass('green');
  $('.modal').css('display', 'none');

  $cardsIcons.each(function (index) {
    $(this).removeClass(icons[index]);
  });

  $cards.each(function () {
    $(this).off('click', clickHandler);
    $(this).on('click', clickHandler);
  });

  init();
});