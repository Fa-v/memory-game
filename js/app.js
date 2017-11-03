$(document).ready(init);

/**
 * DOM elements
 */
const $stars = $('.fa-star');
const $moves = $('.moves');
const $timer = $('.timer');
const $resetGame = $('.reset-game');
const $cards = $('.card');
const $cardsIcons = $('.card .fa');
const icons = [
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

let game = getInitialGameState();

/**
 * @description Returns the initial state object
 */
function getInitialGameState() {
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
 * clears all intervals and timeouts and adds click handlers to cards
 */
function init() {
  shuffle(icons);

  $($moves).html('Moves: 00');
  $($timer).html('Time: 00:00');

  $('.fa-star').css('color', '#f1c40f');

  clearInterval(startCounting);
  clearTimeout(showModal);

  addClickToCards();
}

/**
 * @description Shuffles the deck of cards when the app is loaded, and calls
 * assignCards
 * @param {array} icons
 */
function shuffle(icons) {
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
  assignCards();
  return icons;
}

/**
 * @description Assigns icons randomly to the DOM
 */
function assignCards() {
  $cardsIcons.each(function (index) {
    $(this).addClass(icons[index]);
  });
}

/**
 * @description Adds event listeners to cards to flip each one on click,
 * calls checkIfMatch and starts timer
 */
function addClickToCards() {
  $cards.each(function (index, card) {
    $(this).click(function (event) {
      event.preventDefault();
      let id = index;
      let cardIcon = icons[index];

      game.count += 1;
      game.clicks += 1;
      game.clicks === 1 && startTimer();
      game.clicks && countStars();
      $(this).addClass('flip-card');

      game.pairToCheck.cardId.push(id);
      game.pairToCheck.iconName.push(cardIcon);

      game.count === 2 && checkIfMatch();
    });
  });
}

/**
 * @description Checks for a match in the icon classes, resets the counter and
 * the pairToCheck array and calls thereIsAMatch and notAMatch functions
 */
function checkIfMatch() {
  let match = game.pairToCheck &&
    (game.pairToCheck.iconName[0] === game.pairToCheck.iconName[1])
  let differentCard = game.pairToCheck &&
    (game.pairToCheck.cardId[0] !== game.pairToCheck.cardId[1]);

  match && differentCard ? thereIsAMatch(match) : notAMatch(match);
  movesCounter(differentCard);
  game.count = 0;
  game.pairToCheck = { iconName: [], cardId: [] };
}

/**
 * @description Increments count by one when two cards have been clicked
 */
function movesCounter(differentCard) {
  let numOfMoves = differentCard ? game.moves += 1 : game.moves;
  let movesText = (numOfMoves < 10)
    ? `Moves: 0${numOfMoves}`
    : `Moves: ${numOfMoves}`;

  $moves.html(movesText);
  calculateWinner();
}

/**
 * @description Applies effects to matched pair of cards
 * @param {boolean} match
 */
function thereIsAMatch(match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];
  let cardIdOne = game.pairToCheck.cardId[0];
  let cardIdTwo = game.pairToCheck.cardId[1];

  handleMatchEffects([cardOne, cardTwo], 'green');
  disableClick(cardIdOne, cardIdTwo);

  game.matchedCards.push(cardIdOne, cardIdTwo);
}

/**
 * @description Cancels the click event if the cards are a match
 */
function disableClick(cardIdOne, cardIdTwo) {
  $($cards[cardIdOne]).off('click');
  $($cards[cardIdTwo]).off('click');
}

/**
 * @description Applies color green and bounce effects to equal cards
 * @param {object} cards
 * @param {string} color
 */
function handleMatchEffects(cards, color) {
  $(cards).each(function () {
    $(this).children('.back')
      .addClass(color, 1000)
      .effect('bounce', { times: 3 }, 500);
  });
}

/**
 * @description Applies effects to pair of cards that doesn't match
 * @param {boolean} match
 */
function notAMatch(match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];

  handleNoMatchEffect([cardOne, cardTwo], 'red');
}

/**
 * @description Applies color red and shake effects when cards are different,
 * after flip cards and remove red color.
 * @param {object} cards
 * @param {string} color
 */
function handleNoMatchEffect(cards, color) {
  $(cards).each(function () {
    $(this).children('.back')
      .addClass('red', 1000)
      .effect('shake', 500, function () {
        $(this).removeClass('flip-card');
        $(this).children('.back').removeClass('red', 500);
      }.bind(this));
  });
}

/**
 * @description Starts timer when the user clicks the first card and
 * ends when all the cards have been matched.
 */
function gameDuration() {
  let gameTimer = game.timer += 1;
  let seconds = (gameTimer >= 60) ? (gameTimer % 60) : gameTimer;
  let minutes = Math.floor(gameTimer / 60);
  let displayTime;

  game.displaySeconds = seconds < 10 ? '0' + seconds : seconds;
  game.displayMinutes = minutes < 10 ? ('0' + minutes) : minutes
  displayTime = `Timer: ${game.displayMinutes}:${game.displaySeconds}`;

  $timer.html(displayTime);
}

/**
 * @description Starts time count
 */
function startTimer() {
  startCounting = setInterval(gameDuration, 1000);
}

/**
 * @description Counts stars depending on number of clicks
 */
function countStars() {
  game.clicks === 16
    ? $($stars[2]).css('color', '#ecf0f1') && (game.stars -= 1)
    : $stars[2];
  game.clicks === 32
    ? $($stars[1]).css('color', '#ecf0f1') && (game.stars -= 1)
    : $stars[1];
  game.clicks === 40
    ? $($stars[0]).css('color', '#ecf0f1') && (game.stars -= 1)
    : $stars[0];
}

/**
 * @description Checks for 16 ids in matchedCards array if true, show modal
 */
function calculateWinner() {
  let movesScore = `Moves: ${game.moves}`;
  let starsScore = (game.stars === 1)
    ? `Star: ${game.stars}`
    : `Stars: ${game.stars}`;
  let timeScore = `Time: ${game.displayMinutes}:${game.displaySeconds}`;

  $('.movesScore').html(movesScore);
  $('.starsScore').html(starsScore);
  $('.timeScore').html(timeScore);

  (game.matchedCards.length === 16) && modalShow();
}

/**
 * @description Shows modal when all cards are matched
 */
function modalShow() {
  clearInterval(startCounting);
  showModal = setTimeout(function () {
    $('.modal').show();
  }, 1200);
}

/**
 * @description Resets all values
 */
$resetGame.click(function () {
  game = getInitialGameState();

  /* Removes all classes assigned during the game */
  $('*').removeClass('flip-card');
  $('*').removeClass('green');
  $('.modal').css('display', 'none');

  $cardsIcons.each(function (index) {
    $(this).removeClass(icons[index]);
  });

  init();
});