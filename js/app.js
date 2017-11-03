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
const icons = ['fa-pied-piper', 'fa-pied-piper', 'fa-rebel', 'fa-rebel', 'fa-share-alt', 'fa-share-alt', 'fa-podcast', 'fa-podcast', 'fa-free-code-camp', 'fa-free-code-camp', 'fa-github-alt', 'fa-github-alt', 'fa-stack-overflow', 'fa-stack-overflow', 'fa-slack', 'fa-slack'];
let starCounting;
let showModal;

let game = {
  clicks: 0,
  count: 0,
  moves: 0,
  timer: 0,
  stars: 3,
  matchedCards: [],
  pairToCheck: { iconName: [], cardId: [] },
  displaySeconds: '',
  displayMinutes: ''
}

/**
 * @description Set initial display when the app is loaded
 *
 */
function init() {
  shuffle(icons);

  /* initial display */
  $($moves).html('Moves: 00');
  $($timer).html('Time: 00:00');
  $('.fa-star').css('color', '#f1c40f');
  clearInterval(starCounting);
  clearTimeout(showModal);
  addClickToCards();
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
function addClickToCards() {
  $($cards).each(function (index, card) {
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

      (game.count === 2) && checkIfMatch();
    });
  });
}

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

    $(cardOne).children('.back').addClass('green', 1000).effect('bounce', {times: 3}, 500);
    $(cardTwo).children('.back').addClass('green', 1000).effect('bounce', {times: 3}, 500);

  /* cancel the click event if the cards are a match */
  $($cards[cardIdOne]).off('click');
  $($cards[cardIdTwo]).off('click');
  game.matchedCards.push(cardIdOne, cardIdTwo);
}

/**
 * @description Apply effects to pair of cards that doesn't match
 * @param {boolean} match
 */
function notAMatch(match) {
  let cardOne = $cards[game.pairToCheck.cardId[0]];
  let cardTwo = $cards[game.pairToCheck.cardId[1]];

  $(cardOne).children('.back').addClass('red', 1000).effect('shake', {times: 3}, 500, function() {
    $(cardOne).removeClass('flip-card');
    $(cardOne).children('.back').removeClass('red', 500);
  });
  $(cardTwo).children('.back').addClass('red', 1000).effect('shake', {times: 3}, 500, function() {
    $(cardTwo).removeClass('flip-card');
    $(cardTwo).children('.back').removeClass('red', 500);
  });
}

/**
 * @description count augments by one when two cards have been clicked
 */
function movesCounter(differentCard) {
  /* prevents to count clicks on the same card */
  let numOfMoves = (differentCard ? game.moves += 1 : game.moves);
  let movesText = (numOfMoves < 10) ? `Moves: 0${numOfMoves}` : `Moves: ${numOfMoves}`;
  $($moves).html(movesText);
  calculateWinner();
}

/**
 * @description timer starts when the user click the first card and ends when all the
 * cards have been matched.
 */
function gameDuration() {
  let gameTimer = game.timer += 1;
  let seconds = (gameTimer >= 60) ? (gameTimer % 60) : gameTimer;
  let minutes = Math.floor(gameTimer / 60);
  game.displaySeconds = seconds < 10 ? '0' + seconds : seconds;
  game.displayMinutes = minutes < 10 ? ('0' + minutes) : minutes
  let displayTime = `Timer: ${game.displayMinutes}:${game.displaySeconds}`;

  $($timer).html(displayTime);
}

function startTimer() {
  starCounting = setInterval(gameDuration, 1000);
}

/**
 * @description count stars depending on number of clicks
 */
function countStars() {
  let minusOne = (game.clicks === 16) ? $($stars[2]).css('color', '#ecf0f1') && (game.stars -= 1) : $stars[2];
  let minusTwo = (game.clicks === 32) ? $($stars[1]).css('color', '#ecf0f1') && (game.stars -= 1) : $stars[1];
  let minusThree = (game.clicks === 40) ? $($stars[0]).css('color', '#ecf0f1') && (game.stars -= 1) : $stars[0];
}

/**
 * @description check for 16 ids in matchedCards array if true, show modal
 */
function calculateWinner() {
  let movesScore = ` Moves: ${game.moves}`;
  let starsScore = (game.stars === 1) ? ` Star: ${game.stars}` : ` Stars: ${game.stars}`;
  let timeScore = `Time: ${game.displayMinutes}:${game.displaySeconds}`;

  $('.movesScore').html(movesScore);
  $('.starsScore').html(starsScore);
  $('.timeScore').html(timeScore);

    (game.matchedCards.length === 16) && clearInterval(starCounting);
    (game.matchedCards.length === 16) && (showModal = setTimeout(function () {
      $('.modal').show();
    }, 1200));
}

/**
 * @description Reset all values
 */
$($resetGame).click(function () {
  game = {
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

  /* Remove all classes assigned during the game */
  $('*').removeClass('flip-card');
  $('*').removeClass('green');
  $('.modal').css('display', 'none');

  $($cardsIcons).each(function (index) {
    $(this).removeClass(icons[index]);
  });

  init();
});