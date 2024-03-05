import { playGameV2, playGameV4, stopGame, playDemo} from "../pong/pongvs4.js"

const btStartTourn = document.querySelector("#startTourn")
const inputTournLength = document.querySelector("#tournLength")


const playersScores = [0, 2, 5, 4]
console.log(btStartTourn)
console.log(inputTournLength)

function resetTourn(){
	playersScores.forEach((i) => {
		i = 0
	})
	// for(let i = 0; i < playersScores.length; i++){
	// 	playersScores[i] = 0
	// }
}

btStartTourn.addEventListener("click", () => {

	resetTourn()
	console.log("clack")
	console.log(inputTournLength.value)
	if(inputTournLength.value > 0){
		inputTournLength.value--
		playGameV4()
	}
	else{
		//fin du tournois
		resetTourn()
	}
})

export { playersScores }