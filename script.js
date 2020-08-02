//@ts-check

/*
    - WHAT DO WE NEED TO DO? :
        1) not // my work?
        2) make buttons funcional
            - what is "functional". What does it actually mean?
            By functional I mean make them go into different colors randomize when clicked to begin
            so create a random 
            and uh
            uhhhhhhhh OH MAKE THE THING UNDERSTAND IT HAS TO PAIR WITH THE SAME COLOR
        3) cry?

    - So here's what I want you to do. I want you to make a 'recipe'. Every step that happens.
        Just like you're cooking a dish. What happens at what time. (im bad at overcook)
        Step 1) Take out the bowls, mixer, ingredients.
        Step 2) Mix flour, egg, water (ur making me hungry)
        Step 3) Mix vigorously...
        etc etc
        - Now go bake me a chocolate cake, thanks. (stop #1 go to supermarket)

    Steps for Memory:
        1) ??? (Add a pair of each color for the buttons) -When does this happen? 
        2) Make the click any turn them into random
        3) let know that it has to stay on pairs and not switch back
        4) once completed give a congrats msg to appear because i dont think we have that yet
        5) html
*/

const mode = {
    WaitingForFirstClick: "WaitingForFirstClick",
    WaitingOnFirstCard: "WaitingOnFirstCard",
    WaitingOnSecondCard: "WaitingOnSecondCard"
}

var gameState = {}; 

gameState.mode = mode.WaitingForFirstClick;
gameState.firstCard = null; // I set it to null to say "hey this is empty"
gameState.successfulMatches = 0;
gameState.waiting = false; // are we making the player wait for the cards to turn back

var jacks = new Array(16); //Make a new empty array, and pre-populate it with 16 empty slots
var colors = ["violet", "red", "#613613", "yellow",
                "green", "turquoise", "indigo", "white"];
var images = ["url(images/doggo4.png)", //violet
              "url(images/doggo6.png)", //red
              "url(images/doggo2.png)", //brown
              "url(images/doggo1.png)", //yellow
              "url(images/doggo8.png)", //green
              "url(images/doggo3.png)", //turquoise
              "url(images/doggo7.png)", //indigo
              "url(images/doggo5.png)" ] //white
var secretButtonColors = new Array(16);

var secondsToWaitAfterFailedMatch = .4; // wait for .4 seconds
                
function initialize() {
    setText("Click Anywhere to Begin");
    
    var buttons = document.getElementById("buttons");

    for (let index = 0; index < 16; index++) {
        if(buttons.childElementCount < 16) {
            var butt = document.createElement("button");
            butt.className = "memoryButton";

            butt.onclick = function() { onButtonClick(index); }

            buttons.append(butt)
            jacks[index] = butt

            var colorIndexOffset = Math.floor(index/2);
            butt.style.backgroundColor = colors[colorIndexOffset]

            butt.style.backgroundImage = images[colorIndexOffset]
            butt.style.backgroundSize = "100%";
        }

    } 
}

function setText(text) {
    var readStart = document.getElementById("instructions")
    readStart.innerHTML = (text)
    readStart.style.fontSize = "180%";
}

function onButtonClick(index){
    // if we're waiting for the cards to flip back over, don't let the player do anything
    if(gameState.waiting == true) return;

    switch (gameState.mode) {
        case mode.WaitingForFirstClick: {
            resetGameState(index); // this function gets called ONLY if mode is WaitingForFirstClick
        } break;

        case mode.WaitingOnFirstCard: {
            clickedFirstCard(index);
        } break;
            
        case mode.WaitingOnSecondCard: {
            clickedSecondCard(index);
        } break;
    }
}

function resetGameState(index) {
    gameState.mode = mode.WaitingOnFirstCard
    gameState.firstCard = null; 
    gameState.successfulMatches = 0;
    gameState.waiting = false;
    
    for (let index = 0; index < secretButtonColors.length; index++) {
        var butt = jacks[index]

        secretButtonColors[index] = {}
        secretButtonColors[index].color = butt.style.backgroundColor
        secretButtonColors[index].image = butt.style.backgroundImage
        butt.style.backgroundColor = null;
        butt.style.backgroundImage = null;
    }
    
    setText ("Woof")

    Shuffle();
}

function clickedFirstCard(index) {
    // if the button already has a color, ignore the click
    if(jacks[index].style.backgroundColor != "") return;

    //alert("I'm an unloved function :(");
    jacks[index].style.backgroundColor = secretButtonColors[index].color // this is where we set the card color. where we "flip" a card
    jacks[index].style.backgroundImage = secretButtonColors[index].image
    gameState.firstCard = (index); // ()s not required, but they don't hurt
    gameState.mode = mode.WaitingOnSecondCard 


} 

function clickedSecondCard(index) { 
    // if the button already has a color, ignore the click
    if(jacks[index].style.backgroundColor != "") return;

    gameState.mode = mode.WaitingOnFirstCard
    jacks[index].style.backgroundColor = secretButtonColors[index].color
    jacks[index].style.backgroundImage = secretButtonColors[index].image
    
    if (secretButtonColors[gameState.firstCard].color == secretButtonColors[index].color) {
        gameState.successfulMatches++;

        if (gameState.successfulMatches == 8) { //ara was here :3 - nope - cronch cronch cronch
            setText ("Congratulations! You woof your way to the finish line!<br>Click any square to start again.")

            gameState.mode = mode.WaitingForFirstClick
        }
    }
    else {
        gameState.waiting = true;

        setTimeout(function() {
            jacks[index].style.backgroundColor = null;
            jacks[index].style.backgroundImage = null;
            jacks[gameState.firstCard].style.backgroundColor = null;
            jacks[gameState.firstCard].style.backgroundImage = null;
            gameState.waiting = false;
        }, secondsToWaitAfterFailedMatch * 1000);
    }
}


//shenanigans :)
function Shuffle() {
	for(let i = secretButtonColors.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i)
		const temp = secretButtonColors[i]
		secretButtonColors[i] = secretButtonColors[j]
		secretButtonColors[j] = temp //im watching you secret fbi code, im WATCHING YOU :eyes:
	}
};