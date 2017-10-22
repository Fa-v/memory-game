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

function init() {
  shuffle(icons);
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