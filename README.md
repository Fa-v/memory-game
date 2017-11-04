# Memory Game

This is the second project of the intermediate JavaScript section for Udacity's front-end web development nanodegree.

It's a card matching game where you have to click on the cards to find every matching pair. You win once you've matched all 8 pairs.

Cards are assigned randomly each time you play thanks to the [Fisher-Yates shuffle algorithm](https://bost.ocks.org/mike/shuffle/) which makes it possible to efficiently shuffle the cards within the same array and take care of possible repeted elements. The icons are from Font Awesome and I used [Flat UI Colors](http://flatuicolors.com/) to chose my color palette.

I used Sass for styling this project. Thanks to gulp I was able to compile the Sass code into CSS and to watch for changes in all my files.

If you want to run the code on your computer, you'll need to make sure you have [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm) installed:

`node --version`

`npm --version`

Also you'll need Sass, if you've already installed it, you can follow the steps below to run the code, otherwise consult the documentation on [how to install Sass](http://sass-lang.com/install).

```
git clone <branch url>
cd memory-game/
npm install --save // to install browser-sync, gulp and gulp-sass
gulp
```

The `gulp` command runs the app in development mode and automatically opens http://localhost:3000/ to view it in the browser. The page will automatically reload if you make changes in the code.
