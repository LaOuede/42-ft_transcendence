import { playGameV2, playGameV4, stopGame, playDemo} from "../pong/pongvs4.js"
import { gameInfo } from "../pong/pong_var.js"

let btStartTourn = document.querySelector("#startTourn")
let inputTournLength = document.querySelector("#tournLength")


const playersScores = [0, 0, 0, 0]
let game_count

let p1TournScore
let p2TournScore
let p3TournScore
let p4TournScore
let tournScores = [p1TournScore,
	p2TournScore,
	p3TournScore,
	p4TournScore]

function initElements() {
	console.log(document.getElementById("p1TournScore"))
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
	if (document.getElementById("startTourn")) {
		btStartTourn = document.getElementById("startTourn") 
	}
	if (document.getElementById("tournLength")) {
		inputTournLength = document.getElementById("tournLength") 
	}
	// tournScores.textContent = 4235345
	// console.log(p1TournScore.textContent)
}
	
function resetTourn(){
	for(let i = 0; i < playersScores.length; i++){
		playersScores[i] = 0
	}
}

function updateScores(){
	for(let i = 0; i < tournScores.length; i++){
		tournScores[i].textContent = playersScores[i]
		console.log(tournScores[i].textContent)
		console.log(playersScores[i])
	}
}

function giveTournPoints(player){
	const tournPoint = [10, 5, 2, 0]
	playersScores[player] += tournPoint[gameInfo.player_count]
	for(let i = 0; i < playersScores.length; i++)
		console.log(playersScores)
}

function tieCheck(){
	let best_score = 0
	let winner = -1
	for(let i = 0; i < playersScores.length; i++){
		if(best_score < playersScores[i]){
			best_score = playersScores[i]
			winner = i
		}
	}
}

function tournament(){
	initElements()
	if(btStartTourn){
		btStartTourn.addEventListener("click", function (e) {
			game_count = inputTournLength.value
			resetTourn()
			gameInfo.gameover = true
			tournament()
		})
	}
	console.log(game_count)
	if(game_count > 0){
		gameInfo.gameover = false
		console.log(game_count)
		game_count--
		playGameV4()
		updateScores()
	}
	else{
		updateScores()
		//fin du tournois
	}
}
	
// btStartTourn.addEventListener("click", () => {
// 	game_count = inputTournLength.value
// 	resetTourn()
// 	gameInfo.gameover = true
// 	tournament()
// })

document.addEventListener("DOMContentLoaded", function (e) {
	if(btStartTourn){
		btStartTourn.addEventListener("click", function (e) {
			game_count = inputTournLength.value
			resetTourn()
			gameInfo.gameover = true
			tournament()
			console.log("SALUT")
		});
	}
});

export { playersScores, game_count, tournament, giveTournPoints}