/**
 *  Student Name:  Elton Peters
 *  Student ID:    A01367028 
 */

class Player {
    NO_SCORE = 0;

    constructor() {
        this.totalScore = this.NO_SCORE;
    }

    addToScore(roundScore) {
        this.totalScore += roundScore;
    }

    getScore() {
        return this.totalScore;
    }

    setScore(score) {
        this.totalScore = score;
    }
}

class DiceGame {
    playRound(player1, player2) {
        let player1DiceRolled = this.rollDice();
        let player1RoundScore = this.determineRoundScore(player1DiceRolled);
        player1.addToScore(player1RoundScore);

        let player2DiceRolled = this.rollDice();
        let player2RoundScore = this.determineRoundScore(player2DiceRolled);
        player2.addToScore(player2RoundScore);

        return [player1DiceRolled, player2DiceRolled];
    }

    rollDice() {
        const MIN_DICE_ROLL = 1;
        const MAX_DICE_ROLL = 6;

        let rollOne = Math.floor(Math.random() * (MAX_DICE_ROLL - MIN_DICE_ROLL + 1) + MIN_DICE_ROLL);
        let rollTwo = Math.floor(Math.random() * (MAX_DICE_ROLL - MIN_DICE_ROLL + 1) + MIN_DICE_ROLL);

        return [rollOne, rollTwo];
    }

    determineRoundScore(diceRolled) {
        const NO_SCORE_DICE_FACE = 1;
        const NO_SCORE = 0;
        const ROLL_ONE = diceRolled[0];
        const ROLL_TWO = diceRolled[1];
        const SAME_ROLL_MULTIPLIER = 2;

        if (diceRolled.includes(NO_SCORE_DICE_FACE)) {
            return NO_SCORE;
        } else if (ROLL_ONE == ROLL_TWO) {
            return SAME_ROLL_MULTIPLIER * (ROLL_ONE + ROLL_TWO);
        } else {
            return ROLL_ONE + ROLL_TWO;
        }
    }

    determineWinner(player1FinalScore, player2FinalScore) {
        if (player1FinalScore > player2FinalScore) {
            return "<p>You win!</p>";
        } else if (player1FinalScore == player2FinalScore) {
            return "<p>It was a tie!</p>";
        } else {
            return "<p>The computer won!</p>";
        }
    }
}

const beginBtn = document.getElementById("begin-btn");
const gameContainer = document.getElementById("game-container");
const welcomeScreen = document.getElementById("welcome");
const gameScreen = document.getElementById("active-game-container");
const playBtn = document.getElementById("play-btn");
const roundTracker = document.getElementById("round-tracker");
const playerStats = document.getElementById("player-stats");
const computerStats = document.getElementById("computer-stats");
const gameSummary = document.getElementById("game-summary");
const playerImage = document.getElementById("player-image-container");
const computerImage = document.getElementById("computer-image-container");
const backgroundMusic = document.getElementById("background-music");
const muteBtn = document.getElementById("mute");

const player1 = new Player();
const player2 = new Player();
const FIRST_ROUND = 1;
const LAST_ROUND = 3;

let currentRound = FIRST_ROUND;
let summaryHTML = "";

diceGame = new DiceGame();

beginBtn.addEventListener("click", begin);

function begin() {
    welcomeScreen.classList.add("fade-out-image");
    gameScreen.classList.add("fade-in-image");
    gameScreen.style.display = "grid";

    backgroundMusic.play();
    backgroundMusic.volume = 0.5;
    backgroundMusic.loop = true;
    muteBtn.addEventListener("click", toggleMuteBackgroundMusic);

    playBtn.addEventListener("click", playRoundOfDiceGame);
}

function playRoundOfDiceGame() {
    summaryHTML = "";

    let allDiceRolls = diceGame.playRound(player1, player2);

    let playerDiceRolls = allDiceRolls[0];
    let playerDiceRollOne = playerDiceRolls[0];
    let playerDiceRollTwo = playerDiceRolls[1];

    let computerDiceRolls = allDiceRolls[1];
    let computerDiceRollOne = computerDiceRolls[0];
    let computerDiceRollTwo = computerDiceRolls[1];

    playerImage.innerHTML = `<img src='./images/dice.png' alt="two dice">`;
    computerImage.innerHTML = `<img src='./images/dice.png' alt="two dice">`;

    playerImage.firstChild.classList.add("shake-image");
    computerImage.firstChild.classList.add("shake-image");

    const MILLISECONDS_PER_SECOND = 1000;

    let animationDurationStyleValue = window.getComputedStyle(playerImage.firstChild).getPropertyValue('animation-duration');
    let animationDelayMs = parseFloat(animationDurationStyleValue) * MILLISECONDS_PER_SECOND;

    setTimeout(function() {
        playerImage.firstChild.classList.remove("shake-image");
        computerImage.firstChild.classList.remove("shake-image");

        setDiceImages(playerDiceRollOne, playerDiceRollTwo, computerDiceRollOne, computerDiceRollTwo);

        let playerRoundScore = diceGame.determineRoundScore(playerDiceRolls);
        let computerRoundScore = diceGame.determineRoundScore(computerDiceRolls);

        let player1TotalScore = player1.getScore();
        let player2TotalScore = player2.getScore();

        if (currentRound < LAST_ROUND) {
            summaryHTML += `<p>You rolled a ${playerDiceRollOne} and a ${playerDiceRollTwo} worth ${playerRoundScore} points.</p>`;
            summaryHTML += `<p>The computer rolled a ${computerDiceRollOne} and a ${computerDiceRollTwo} worth ${computerRoundScore} points.</p>`;
            currentRound++;
        } else {
            generateWinnerSummary(player1TotalScore, player2TotalScore);
            playBtn.innerHTML = "Play Again?";
            playBtn.removeEventListener("click", playRoundOfDiceGame);
            playBtn.addEventListener("click", playAgain);
        }

        updateDisplay(playerRoundScore, computerRoundScore);
    }, animationDelayMs);
}

function updateDisplay(playerRoundScore, computerRoundScore) {
    roundTracker.innerHTML = `<p>Round:${currentRound}</p>`;

    if (currentRound == FIRST_ROUND) {
        playerStats.innerHTML = ``;
        computerStats.innerHTML = ``;
    } else {
        playerStats.innerHTML = `<p>Total Score: ${player1.getScore()}</p>`;
        playerStats.innerHTML += `<p>Round Score: ${playerRoundScore}</p>`;
        computerStats.innerHTML = `<p>Total Score: ${player2.getScore()}</p>`;
        computerStats.innerHTML += `<p>Round Score: ${computerRoundScore}</p>`;
    }

    gameSummary.innerHTML = summaryHTML;
}

function setDiceImages(playerDiceRollOne, playerDiceRollTwo, computerDiceRollOne, computerDiceRollTwo) {
    playerImage.innerHTML = `<img src='./images/dice_${playerDiceRollOne}.png' alt="player first dice roll">`;
    playerImage.innerHTML += `<img src='./images/dice_${playerDiceRollTwo}.png' alt="player second dice roll">`;

    computerImage.innerHTML = `<img src='./images/dice_${computerDiceRollOne}.png' alt="computer first dice roll">`;
    computerImage.innerHTML += `<img src='./images/dice_${computerDiceRollTwo}.png' alt="computer second dice roll">`;
}

function playAgain() {
    player1.setScore(0);
    player2.setScore(0);

    summaryHTML = "";
    currentRound = FIRST_ROUND;
    playerImage.innerHTML = `<img src='./images/dice.png' alt="two dice">`;
    computerImage.innerHTML = `<img src='./images/dice.png' alt="two dice">`;
    updateDisplay();

    playBtn.removeEventListener("click", playAgain);
    playBtn.innerHTML = "Click to Roll";
    playBtn.addEventListener("click", playRoundOfDiceGame);
}

function generateWinnerSummary(player1TotalScore, player2TotalScore) {
    let winnerSummary = diceGame.determineWinner(player1TotalScore, player2TotalScore);

    summaryHTML += winnerSummary;
    summaryHTML += `<p>Your final score was: ${player1TotalScore}</p>`;
    summaryHTML += `<p>The computer's final score was: ${player2TotalScore}</p>`;
}

function toggleMuteBackgroundMusic() {
    if (backgroundMusic.muted == false) {
        backgroundMusic.muted = true;
        muteBtn.setAttribute("src", "./images/mute_icon.svg");
    } else {
        backgroundMusic.muted = false;
        muteBtn.setAttribute("src", "./images/unmuted_icon.svg");
    }
}
