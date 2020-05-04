# TIC-TAC-TOE
Tic Tac Toe game built with JS, HTML and CSS (The Odin Project).
[Link to project description](https://www.theodinproject.com/lessons/tic-tac-toe-javascript).

Link to live demo: https://lenachestnut.github.io/tic-tac-toe/.

## Notes for later

### General
First and foremost, I should update README as I go.

## HTML
### Page reload on submit
When I was making my settings form I, I encountered a problem where hitting Enter would refresh the whole page without saving the settings. At first I just changed the type of the button to `type="button"` thinking about coming back to it later after I finish implementing general features of the form and then this [comprehensive README](https://github.com/Saranoya/odin/blob/master/javascript/library/public/README.md) provided the solution to this very problem.
```javascript
<form id="add-new-book", onsubmit="return false">
...
</form>
```

## CSS
### Hand-drawn borders
I wanted the app to have a hand-drawn look but a grid with perfectly straight lines wasn't doing it. I found this [article](https://codemyui.com/hand-drawn-border-buttons-css/) which then pointed me to a [CodePen by Tiffany Rayside](https://codepen.io/tmrDevelops/pen/VeRvKX) which used CSS border-radius to simulate a doodle look. I adapted the values for my grid and some other UI elements and it worked perfectly.

```css
border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
```
That's where I also found out that you can **change elements' dimensions in DevTools using scroll wheel** like you would do in Adobe programs to check what would look better. You can also press Shift so the step is 10px for every time you scroll.

### Maintaining square shape of the grid cells
I've found a number of kind of hacky solutions for this which used pseudo-elements, negative padding/margin dimensions, calculations with 33.33% of the width of the container. Eventually, I had an idea to use dimensions measured in vw for both width AND height of the grid-container. That way both dimensions would be calculated based on the same value of the width of the screen. Setting rows and columns to take 1fr of the parent allows them to remain of the same size. And setting max-width and max-heigth ensures that the grid isn't too big on wide screens.
```css
    width: 90vw;
    height: 90vw;
    max-width: 500px;
    max-height: 500px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
```
Somebody else has probably already come up with it but I'm still quite proud of it. Unless there's something inherently wrong with this approach and I just don't know about it.

### Styling checkboxes
[This article](https://markheath.net/post/customize-radio-button-css) shares a pretty simple and short way to style radio buttons. Other solutions I've found seemed way more obscure.
```css
input[type=radio] {
    opacity: 0;
    position: fixed;
    width: 0;
}

input[type="radio"]:checked + label {
    color: var(--accent-color);
    border-bottom: 2px solid currentColor;
    border-radius: 0px 0px 1300px 100px/390px 0px 40px 30px;
}

input[type="radio"]:focus + label {
    border: 2px dashed #444;
}
```
### Animation
Button and active player animation based on [this article](https://harrybailey.com/2011/09/css3-element-wiggle-with-keyframes/) by Harry Bailey. I've added additional percent stops so it looke more like stop-motion.
```css
@keyframes wiggle {
	0% {
        transform: rotate(5deg);
    }
    49% {
        transform: rotate(5deg);
    }
	50% {
        transform: rotate(-5deg);
    }
    99% {
        transform: rotate(-5deg);
    }
	100% {
        transform: rotate(5deg);
    }
}

button:hover, button:focus {
	--webkit-animation: wiggle 0.5s infinite;
	--moz-animation: wiggle 0.5s infinite;
	animation: wiggle 0.5s infinite;
}
```
## JavaScript
Looking back, I've made the logic pretty overcomplicated. After I wrote it, I've come across different solutions while I was researching minimax and there were much simpler way to check if the game is won (namely, by using an array of winning combinations and not determine current row and column each time an "X" or "O" is set) and do other things.

### Minimax
I built my minimax logic based on [this tutorial](https://www.youtube.com/watch?v=P2TcQ3h0ipQ) by FreeCodeCamp. Had to change some things because of differences in the code but got it working eventually.

#### First moves by AI
After I got minimax working I've run into a problem where whenever AI was the first player, it would take a really long time (about half a minute) to make the first move. To solve this, I've added a conditional statement to check if the board was empty and if it was, the AI would make a random move.

#### Second move by AI
A similar problem with delay (about 4 seconds) occurs when the AI goes second. It takes a few more seconds for computer to make its first move of the game than in later turns. I wanted it to go for the middle square or, if it was taken, make a random move. However, it caused minimax algorithm to not always work on later turns. If the middle square was taken, it would first make a random move and its next move would always be in the top left corner (if it wasn't occupied already) regardless of wether it would lead to human player winning or not. I decided to comment it out for now and leave it as is.

## Used resources
### Assets
#### Audio
https://freesound.org/
* [writing-chalk-oneshot-02.wav](https://freesound.org/people/newagesoup/sounds/377837/)
* [remove chalk](https://freesound.org/people/JuanFG/sounds/471749/)
#### Visuals
* Favicon created with https://favicon.io/
* [Background image](https://raw.github.com/mmoustafa/Chalkboard/master/img/bg.png)
* Fonts - [Amatic SC](https://fonts.google.com/specimen/Amatic+SC?query=ama), [Architects Daughter](https://fonts.google.com/specimen/Architects+Daughter)
* Robot icon by [Font Awesome](https://fontawesome.com/)
* Play, settings and refresh icons by [Feather](https://feathericons.com/)
