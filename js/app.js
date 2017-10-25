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
  count: 0,
  moves: 0,
  timer: 0,
  match: false,
  matchedCards: [],
  pairToCheck: {iconName: [], cardId: []}
}

function init() {
  shuffle(icons);
  clearTimeout(delayEffect);
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
 * @description Add event listeners to cards to flip each one on click and call checkIfMatch
 */
$($cards).each(function (index, card) {
  $(this).click(function () {
    event.preventDefault();
    let id = index;
    let cardIcon = icons[index];

    $(this).addClass('flip-card');
    game.count += 1;

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
  let match = game.pairToCheck && (game.pairToCheck.iconName[0] === game.pairToCheck.iconName[1]);
  match ? thereIsAMatch(match) : notAMatch(match);

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