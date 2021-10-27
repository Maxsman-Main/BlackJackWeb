let stack;
let player;
let dealer;
let getCardSound = new Audio();
let clickButtonSound = new Audio();

const suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
const values = ["V", "Q", "K", "A"];

class Player{

    constructor(score){
        this.hand = [];
        this.score = score;
    }

}

class Stack{
    
    constructor(head, data){
        this.head = head;
        this.data = data;
    }
}

class Card{

    constructor(value, suit, sprite){
        this.value = value;
        this.suit = suit;
        this.sprite = sprite;
    }
}

function sleep(ms){
}


function playClickSound(){
    clickButtonSound.play();
}

function playGetCardSound(){
    getCardSound.play();
}

function makeCard(value, suit, sprite){
    return new Card(value, suit, sprite);
}

function shuffle(data){
    let currentIndex = data.length;
    let randomIndex;

    while(currentIndex > 0){

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        let temp = data[currentIndex];
        data[currentIndex] = data[randomIndex];
        data[randomIndex] = temp;
    }

    return data;
}

function fillStack(){
    let stackBuffer = [];
    let counter = 0;
    for(i = 0; i < 32; i++){
        if(counter <= 3){
            stackBuffer.push(makeCard(i % 8 + 6, suits[Math.floor(i / 8)], counter + 6));    
        }
        else{
            stackBuffer.push(makeCard(5, suits[Math.floor(i / 8)], values[counter - 4]));
        }
        counter += 1;
        if(counter > 7){
            counter = 0;
        }    
    }

    let stack = new Stack(31, stackBuffer);

    return stack;
}

function getCard(){
    playGetCardSound();
    return stack.data[stack.head--];
}

function updateGameTable(){
    if(player.hand.length != 0){
        let placePlayerId = "place" + player.hand.length;
        let placePlayer = document.getElementById(placePlayerId);
        placePlayer.style.opacity = 1;
        placePlayer.innerHTML = "<div class='card'>"+"<p>"+player.hand[player.hand.length - 1].sprite+"<p>"+"<p>"+player.hand[player.hand.length - 1].suit+"</p>"+"</div>";
    }
    if(dealer.hand.length != 0){
        let placeDealerId = "place" + (dealer.hand.length + 4);
        let placeDealer = document.getElementById(placeDealerId);
        placeDealer.style.opacity = 1;
        placeDealer.innerHTML = "<div class='card'>"+"<p>"+dealer.hand[dealer.hand.length - 1].sprite+"<p>"+dealer.hand[dealer.hand.length - 1].suit+"</p>"+"</div>";
    }

    let playerCounter = document.getElementsByClassName("playerCounter")[0];
    playerCounter.innerHTML = "<p>" + "Player:" + "</p>" + "<p>" + player.score + "</p>";

    let dealerCounter = document.getElementsByClassName("dealerCounter")[0];
    dealerCounter.innerHTML = "<p>" + "Dealer:" + "</p>" + "<p>" + dealer.score + "</p>";
}

function cleanGameTable(){
    for(i = 0; i < 8; i++){
        let placeId = "place" + (i + 1);
        let place = document.getElementById(placeId);

        place.style.opacity = .5;
    }
    let cards = document.querySelectorAll(".card");
    for(i = 0; i < cards.length; i++){
        cards[i].remove();
    }

    let deck = document.getElementsByClassName("stack")[0];
    deck.style.display = "flex";
}

function cleanGameStats(){
    let playerWinStat = document.getElementsByClassName("playerWinBlock")[0];
    playerWinStat.style.display = "none";
    let playerCounter = document.getElementsByClassName("playerCounter")[0];
    playerCounter.innerHTML = "<p>Player:</p>"
    
    let dealerWinStat = document.getElementsByClassName("dealerWinBlock")[0];
    dealerWinStat.style.display = "none";
    let dealerCounter = document.getElementsByClassName("dealerCounter")[0];
    dealerCounter.innerHTML = "<p>Dealer:</p>"
}

function disableDeck(){
    let deck = document.getElementsByClassName("stack")[0];
    deck.style.display = "none";
}

function playerGetCard(){
    let card = getCard();
    player.hand.push(card);
    player.score += card.value;
}

function dealerGetCard(){
    let card = getCard()
    dealer.hand.push(card);
    dealer.score += card.value;
}

function dealerIsReady(){
    return dealer.score < 19;
}

function dealerAI(){
    if(dealerIsReady()){
        dealerGetCard();
    }
}

function makeStep(){
    playerGetCard();
    dealerAI();
    updateGameTable();
    if(player.hand.length == 4){
        disableDeck();
        giveWin();
    }
}

function playerIsWinner(){
    if(player.score > dealer.score){
        if(player.score <= 21){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        if(dealer.score <= 21){
            return false;
        }
        else{
            return true;
        }
    }
}

function giveWin(){
    if(playerIsWinner()){
        let winBlock = document.getElementsByClassName("playerWinBlock")[0];
        winBlock.style.display = "block";
    }
    else{
        let winBlock = document.getElementsByClassName("dealerWinBlock")[0];
        winBlock.style.display = "block";
    }
}

function stopGame(){
    playClickSound();
    disableDeck();
    while(dealerIsReady()){
        dealerGetCard();
        updateGameTable();
    }
    giveWin();
}

function refreshGame(){
    startGame();
    cleanGameTable();
    cleanGameStats();
    playClickSound();
}

function showGame(){
    let game = document.getElementById("gamePlace");
    let menu = document.getElementsByClassName("menu")[0];
    game.style.display = "flex";
    menu.style.display = "none";
    startGame();
    playClickSound();
}

function showTutorial(){
    playClickSound();
    let tutorial = document.getElementsByClassName("guide")[0];
    let menu = document.getElementsByClassName("menu")[0];
    tutorial.style.display = "flex";
    menu.style.display = "none";    
}

function showMenu(){
    playClickSound();
    let menu = document.getElementsByClassName("menu")[0];
    menu.style.display = "flex";    
}

function backFromGame(){
    playClickSound();
    let game = document.getElementById("gamePlace");
    cleanGameStats();
    cleanGameTable();
    game.style.display = "none";
    showMenu();
}

function backFromGuide(){
    playClickSound();
    let tutorial = document.getElementsByClassName("guide")[0];
    tutorial.style.display = "none";
    showMenu();
}

function startGame(){
    getCardSound.src = './content/audio/getCard.mp3';
    clickButtonSound.src = './content/audio/buttonClick.mp3';
    stack = fillStack();
    stack.data = shuffle(stack.data);
    player = new Player(0);
    dealer = new Player(0);
}