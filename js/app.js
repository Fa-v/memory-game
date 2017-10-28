$(document).ready(init);

/**
 * DOM elements
 */
const $stars = $('.fa-star');
const $moves = $('.moves');
const $timer = $('.timer');
const $resetButton = $('.reset-btn');
const $cards = $('.card');
const $cardsIcons = $('.card .fa');
const icons = ['fa-pied-piper', 'fa-pied-piper', 'fa-rebel', 'fa-rebel', 'fa-share-alt', 'fa-share-alt', 'fa-podcast', 'fa-podcast', 'fa-free-code-camp', 'fa-free-code-camp', 'fa-github-alt', 'fa-github-alt', 'fa-stack-overflow', 'fa-stack-overflow', 'fa-slack', 'fa-slack'];

let game = {
  clicks: 0,
  count: 0,
  moves: 0,
  timer: 0,
  stars: 3,
  match: false,
  matchedCards: [],
  pairToCheck: {iconName: [], cardId: []}
}

function init() {
  shuffle(icons);
  clearTimeout(delayEffect);
  clearInterval(gameDuration);
}

/**
 * @description shuffle the deck of cards when the app is loaded, and call assignCards
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
 * @description Assign icons randomly to the DOM
 */
function assignCards() {
  $($cardsIcons).each(function (index) {
    $(this).addClass(icons[index]);
  });
}

/**
 * @description Add event listeners to cards to flip each one on click, call checkIfMatch and start timer
 */
$($cards).each(function (index, card) {
  $(this).click(function () {
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

    (game.count === 2) && checkIfMatch();
  });
});

/**
 * @description Check for a match in the icon classes, reset the counter and the pairToCheck array
 *  and call thereIsAMatch and notAMatch functions
 */
function checkIfMatch() {
  let match = game.pairToCheck && (game.pairToCheck.iconName[0] === game.pairToCheck.iconName[1])
  let differentCard = game.pairToCheck && (game.pairToCheck.cardId[0] !== game.pairToCheck.cardId[1]);
  match && differentCard ? thereIsAMatch(match) : notAMatch(match);

  movesCounter(differentCard);
  game.count = 0;
  game.pairToCheck = { iconName: [], cardId: [] };
}

/**
 * @description Apply effects to matched pair of cards
 * @param {boolean} match
 */
function thereIsAMatch(match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];
  let cardIdOne = game.pairToCheck.cardId[0];
  let cardIdTwo = game.pairToCheck.cardId[1];

  $(cardOne).children('.back').addClass('green');
  $(cardTwo).children('.back').addClass('green');

  /* cancel the click event if the cards are a match */
  $($cards[cardIdOne]).off('click');
  $( $cards[cardIdTwo]).off('click');
  game.matchedCards.push(cardIdOne, cardIdTwo);
}

/**
 * @description Apply effects to pair of cards that doesn't match
 * @param {boolean} match
 */
let delayEffect;
function notAMatch(match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];

  delayEffect = setTimeout(function () {
    $(cardOne).removeClass('flip-card');
    $(cardTwo).removeClass('flip-card');
  }, 1000);
}

/**
 * @description count augments by one when two cards have been clicked
 */
function movesCounter(differentCard) {
  /* prevents to count clicks on the same card */
  let numOfMoves = (differentCard ? game.moves += 1 : game.moves);
  let movesText = (numOfMoves < 10) ? `Moves: 0${numOfMoves}` : `Moves: ${numOfMoves}`;
  $($moves).html(movesText);
}

/**
 * TODO create a function timer that starts when the user click the first card and ends when all the
 * cards have been matched.
 */
function gameDuration() {
  let gameTimer = game.timer += 1;
  let seconds = (gameTimer >= 60) ? (gameTimer % 60) : gameTimer;
  let minutes = Math.floor(gameTimer / 60);
  let displaySeconds = seconds < 10 ? '0' + seconds : seconds;
  let displayMinutes = minutes < 10 ? ('0' + minutes) : minutes
  let displayTime = `Timer: ${displayMinutes}:${displaySeconds}`;

  $($timer).html(displayTime);
}

function startTimer() {
  setInterval(gameDuration, 1000);
}

/**
 * @description count stars depending on number of clicks
 */
function countStars() {
  let minusOne = (game.clicks === 16) ? $($stars[2]).css('color', 'grey') && (game.stars -= 1) : $stars[2];
  let minusTwo = (game.clicks === 32) ? $($stars[1]).css('color', 'grey') && (game.stars -= 2) : $stars[1];
  let minusThree = (game.clicks > 40) ? $($stars[0]).css('color', 'grey') && (game.stars = 0) : $stars[0];
}