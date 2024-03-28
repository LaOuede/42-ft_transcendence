import { gameInfo, playGame } from "../pong/pong.js"

const playersScores = [0, 0, 0, 0]

let p1TournScore
let p2TournScore
let p3TournScore
let p4TournScore
let tournScores = [p1TournScore,
	p2TournScore,
	p3TournScore,
	p4TournScore]

function initElements() {
	if (document.getElementById("p1TournScore")) {
		tournScores[0] = document.getElementById("p1TournScore")
	}
	if (document.getElementById("p2TournScore")) {
		tournScores[1] = document.getElementById("p2TournScore") 
	}
	if (document.getElementById("p3TournScore")) {
		tournScores[2] = document.getElementById("p3TournScore") 
	}
	if (document.getElementById("p4TournScore")) {
		tournScores[3] = document.getElementById("p4TournScore") 
	}
}

function resetTourn(){
	for(let i = 0; i < playersScores.length; i++){
		playersScores[i] = 0
	}
}

function updateScores(){

	for(let i = 0; i < tournScores.length; i++){
		tournScores[i].textContent = playersScores[i]
	}
}

function giveTournPoints(player){
	const tournPoint = [10, 5, 3, 0]
	playersScores[player] += tournPoint[gameInfo.player_count]
}

function tieBreak(){
	let bestScore = findBestScore()
	for(let i = 0; i < tournScores.length; i++)
		if(playersScores[i] === bestScore)
			gameInfo.player_lives[i] = 1
}

function findBestScore(){
	let bestScore = 0
	for(let i = 0; i < playersScores.length; i++){
		if(bestScore < playersScores[i]){
			bestScore = playersScores[i]
			gameInfo.winner = gameInfo.nicks[i]
		}
	}
	return bestScore
}

function isTie(){
	let bestScore = findBestScore()
	for(let i = 0; i < playersScores.length; i++)
		if(bestScore < playersScores[i])
			bestScore == playersScores[i]
	let bestScorePlayerCount = 0
	for(let i = 0; i < playersScores.length; i++)
		if(playersScores[i] === bestScore)
			bestScorePlayerCount++
	if(bestScorePlayerCount > 1)
		return true;
	return false
}

function resetLives(){
	for(let i = 0; i < gameInfo.player_lives.length; i++)
		gameInfo.player_lives[i] = gameInfo.default_lives
}

function showScores(){
	document.getElementById("scoreBoard").style.display = "block"
	if(gameInfo.tournaments.game_count <= 0 && isTie() === true){
		gameInfo.tournaments.game_count++
		tieBreak()
	} else {
		resetLives()
	}
	if(gameInfo.tournaments.game_count > 0){
		document.getElementById("btNextRound").style.display = "inline"
		document.getElementById("winner").style.display = "none"
	} else {
		document.getElementById("btNextRound").style.display = "none"
		document.getElementById("winner").style.display = "inline"
		document.getElementById("winner").innerHTML = "<strong>" + gameInfo.winner + " wins!</strong>";
	}
}

function tournament(){
	gameInfo.tournaments.enabled = true
	initElements()
	if(gameInfo.tournaments.game_count > 0 && gameInfo.tournaments.game_count < 10){
		resetLives()
		document.getElementById("gameSettings").style.display = "none"
		resetTourn()
		gameInfo.countDownDone = false
		gameInfo.gameover = false
		gameInfo.tournaments.game_count--
		playGame(gameInfo.player_lives)
	}
	updateScores()
}

export { playersScores, tournament, giveTournPoints, updateScores, showScores}