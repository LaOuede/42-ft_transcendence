import { playGameV2, playGameV4, stopGame, playDemo} from "../pong/pongvs4.js"
import { gameInfo } from "../pong/pong_var.js"

const btStartTourn = document.querySelector("#startTourn")
const inputTournLength = document.querySelector("#tournLength")


const playersScores = [0, 0, 0, 0]
let game_count = inputTournLength.value

const p1TournScore = document.getElementById("p1TournScore")
const p2TournScore = document.getElementById("p2TournScore")
const p3TournScore = document.getElementById("p3TournScore")
const p4TournScore = document.getElementById("p4TournScore")
const tournScores = [document.getElementById("p1TournScore"),
	document.getElementById("p2TournScore"),
	document.getElementById("p3TournScore"),
	document.getElementById("p4TournScore")]

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
	
btStartTourn.addEventListener("click", () => {
	game_count = inputTournLength.value
	resetTourn()
	gameInfo.gameover = true
	tournament()
})

export { playersScores, game_count, tournament, giveTournPoints}