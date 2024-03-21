import {initPongObjs} from "./pong_objs.js"

import {initGameInfo} from "./pong_var.js"
import {tournament, giveTournPoints, updateScores, showScores } from "./tournament.js"

let gameInfo = initGameInfo()
let tags = initElements(gameInfo)
const pongObjs = initPongObjs(gameInfo, tags)


function initElements(gameInfo) {
	const tags = {
		canvas: undefined,
		scores: [undefined, undefined, undefined, undefined],
		cards: [undefined, undefined, undefined, undefined],
		names: [undefined, undefined, undefined, undefined],
	}
	if (document.getElementById("p1Score"))
		tags.scores[0] = document.getElementById("p1Score")
	if (document.getElementById("p2Score"))
		tags.scores[1]  = document.getElementById("p2Score") 
	if (document.getElementById("p3Score"))
		tags.scores[2]  = document.getElementById("p3Score") 
	if (document.getElementById("p4Score"))
		tags.scores[3]  = document.getElementById("p4Score") 
	if (document.getElementById("playerInfo1"))
		tags.cards[0] = document.getElementById("playerInfo1")
	if (document.getElementById("playerInfo2"))
		tags.cards[1] = document.getElementById("playerInfo2") 
	if (document.getElementById("playerInfo3"))
		tags.cards[2] = document.getElementById("playerInfo3") 
	if (document.getElementById("playerInfo4"))
		tags.cards[3] = document.getElementById("playerInfo4") 
	if (document.getElementById("playerInfo4"))
		tags.names[0] = document.getElementById("player1name") 
	if (document.getElementById("playerInfo4"))
		tags.names[1] = document.getElementById("player2name") 
	if (document.getElementById("playerInfo4"))
		tags.names[2] = document.getElementById("player3name") 
	if (document.getElementById("playerInfo4"))
		tags.names[3] = document.getElementById("player4name") 
	gameInfo.window.width = document.querySelector('.master').offsetWidth
	gameInfo.window.height = document.querySelector('.master').offsetHeight - document.querySelector('nav').offsetHeight
  
	tags.canvas = document.querySelector("#game")
	return tags
}

function countPlayers(){
	gameInfo.player_count = 0
	for(let i = 0; i < 4; i++){
		if(gameInfo.player_lives[i] > 0){
				gameInfo.player_count++
		}
	}
}

function setDistanceLight(){
	switch (gameInfo.player_count) {
		case 2:
			return 800
		case 3:
			return 600
		case 4:
			return 400
		default:
			return 10
	}
}

function resetGameOver(){
	tags = initElements(gameInfo)
	defaultPosition()
	countPlayers()
	for(let i = 0; i < 4; i++){
		if(gameInfo.player_lives[i] > 0){
			if(!pongObjs.scene.children.includes(pongObjs.paddles[i]))
				pongObjs.scene.add(pongObjs.paddles[i])
			if(!pongObjs.scene.children.includes(pongObjs.lights[i]))
				pongObjs.scene.add(pongObjs.lights[i])
			pongObjs.lights[i].color.set(gameInfo.colors[i])
			pongObjs.lights[i].distance = setDistanceLight()
			gameInfo.paddle_limit_list[i] = 2.75
			if(tags.cards[i]){
				tags.cards[i].style.display = "block"
				tags.cards[i].style.border = gameInfo.colors[i] + " solid 5px"
				tags.cards[i].style.color = gameInfo.colors[i]
				tags.cards[i].style.boxShadow = gameInfo.colors[i] + " 0px 0px 20px"
				if(gameInfo.nicks[i] == "")
					gameInfo.nicks[i] = "Player " + (i + 1)
				tags.names[i].textContent = gameInfo.nicks[i]
				tags.scores[i].textContent = gameInfo.player_lives[i]
			}
		} else {
			pongObjs.scene.remove(pongObjs.paddles[i])
			pongObjs.scene.remove(pongObjs.lights[i])
			gameInfo.paddle_limit_list[i] = 0
			if(tags.cards[i])
				tags.cards[i].style.display = "none"
		}
	}
	changeView()
}

function resetGameDemo(){
	gameInfo.countDownDone = false
	gameInfo.gameover = false
	defaultPosition()
	if(pongObjs.scene.children.includes(pongObjs.paddles[0])) {pongObjs.scene.remove(pongObjs.paddles[0])};
	if(pongObjs.scene.children.includes(pongObjs.paddles[1])) {pongObjs.scene.remove(pongObjs.paddles[1])};
	if(pongObjs.scene.children.includes(pongObjs.paddles[2])) {pongObjs.scene.remove(pongObjs.paddles[2])};
	if(pongObjs.scene.children.includes(pongObjs.paddles[3])) {pongObjs.scene.remove(pongObjs.paddles[3])};
	if(!pongObjs.scene.children.includes(pongObjs.lights[0])) {pongObjs.scene.add(pongObjs.lights[0])};
	if(!pongObjs.scene.children.includes(pongObjs.lights[1])) {pongObjs.scene.add(pongObjs.lights[1])};
	if(pongObjs.scene.children.includes(pongObjs.lights[2])) {pongObjs.scene.remove(pongObjs.lights[2])};
	if(pongObjs.scene.children.includes(pongObjs.lights[3])) {pongObjs.scene.remove(pongObjs.lights[3])};
	pongObjs.lights[0].distance = 800
	pongObjs.lights[1].distance = 800
	pongObjs.lights[0].color.set("#69327A")
	pongObjs.lights[1].color.set("#249DC6")
	gameInfo.player_lives[0] = 0
	gameInfo.player_lives[1] = 0
	gameInfo.player_lives[2] = 0
	gameInfo.player_lives[3] = 0
	gameInfo.player_count = 0
	gameInfo.nicks = ["", "", "", ""]
	pongObjs.camera.position.set(0, 0, 750)
	pongObjs.camera.lookAt(0, 0, 0)
}

function defaultPosition() {
	pongObjs.ball.position.x = 0
	pongObjs.ball.position.y = 0
	pongObjs.paddles[0].position.y = 0
	pongObjs.paddles[1].position.y = 0
	pongObjs.paddles[2].position.x = 0
	pongObjs.paddles[3].position.x = 0
	pongObjs.ballplight.position.set(0, 0, gameInfo.board_size.thickness)
	gameInfo.level = 1.5
	randomStartDir()
	changeAngle()
	if (gameInfo.countDownDone === false) countDown()
}

function countDown() {
	let count = 3;
	let countdown = setInterval(() => {
	if (count > 0) {
		count--;
	} else {
		gameInfo.countDownDone = true;
		clearInterval(countdown);
	}
	}, 500);
}

function randomStartDir() {
	if (Math.random() <= 0.5)gameInfo.ball_att.dirX = 1;
	else gameInfo.ball_att.dirX = -1;
	if (Math.random() <= 0.5) gameInfo.ball_att.dirY = 1;
	else gameInfo.ball_att.dirY = -1;
}

function changeAngle() {
	let rand = Math.random();
	gameInfo.ball_att.speedX = rand * gameInfo.level + 1;
	gameInfo.ball_att.speedY = gameInfo.level - rand + 1;
}

function ballPhysic() {
	moveBall();
	sideRebound();
	paddleColision();
	goalDetection();
}

function moveBall() {
	if (gameInfo.ball_att.dirX > 0) {
		pongObjs.ball.position.x += gameInfo.ball_att.speedX;
		pongObjs.ballplight.position.x = pongObjs.ball.position.x;
	}
	if (gameInfo.ball_att.dirX <= 0) {
		pongObjs.ball.position.x -= gameInfo.ball_att.speedX;
		pongObjs.ballplight.position.x = pongObjs.ball.position.x;
	}
	if (gameInfo.ball_att.dirY > 0) {
		pongObjs.ball.position.y += gameInfo.ball_att.speedY;
		pongObjs.ballplight.position.y = pongObjs.ball.position.y;
	}
	if (gameInfo.ball_att.dirY <= 0) {
		pongObjs.ball.position.y -= gameInfo.ball_att.speedY;
		pongObjs.ballplight.position.y = pongObjs.ball.position.y;
	}
}

function goalDetection() {
	if (
		pongObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && 
		gameInfo.player_lives[0] > 0
	) {
		gameInfo.player_lives[0]--;
		tags.scores[0].textContent = gameInfo.player_lives[0]
		if (gameInfo.player_lives[0] === 0) {
			gameInfo.paddle_limit_list[0] = 0
				pongObjs.scene.remove(pongObjs.paddles[0]);
			gameInfo.player_count--
			if(gameInfo.tournaments.enabled)
				giveTournPoints(0)
		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if (
		pongObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.player_lives[1] > 0) {
			gameInfo.player_lives[1]--;
			tags.scores[1].textContent = gameInfo.player_lives[1]
		if (gameInfo.player_lives[1] === 0) {
			gameInfo.paddle_limit_list[1] = 0
			pongObjs.scene.remove(pongObjs.paddles[1]);
			gameInfo.player_count--
			if(gameInfo.tournaments.enabled)
				giveTournPoints(1)

		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if (
		pongObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.player_lives[2] > 0) {
			gameInfo.player_lives[2]--;
			tags.scores[2].textContent = gameInfo.player_lives[2]
		if (gameInfo.player_lives[2] === 0) {
			gameInfo.paddle_limit_list[2] = 0
			pongObjs.scene.remove(pongObjs.paddles[2]);
			gameInfo.player_count--
			if(gameInfo.tournaments.enabled)
				giveTournPoints(2)

		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if (
		pongObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness &&
		gameInfo.player_lives[3] > 0
	) {
		gameInfo.player_lives[3]--;
		tags.scores[3].textContent = gameInfo.player_lives[3]
		if (gameInfo.player_lives[3] === 0) {
			gameInfo.paddle_limit_list[3] = 0
			pongObjs.scene.remove(pongObjs.paddles[3]);
			gameInfo.player_count--
			if(gameInfo.tournaments.enabled)
				giveTournPoints(3)
		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if(gameInfo.player_count === 1){
		gameInfo.gameover = true
		gameInfo.player_count--;
		for(let i = 0; i < gameInfo.player_lives.length; i++){
			if(gameInfo.player_lives[i] > 0){
				if(gameInfo.tournaments.enabled){
					giveTournPoints(i)
					updateScores()
				} else {
					gameInfo.winner = gameInfo.nicks[i]
					document.getElementById("scoreBoard").style.display = "block"
					document.getElementById("winner").textContent = gameInfo.nicks[i]
				}
				
			}
		}
		if(gameInfo.tournaments.enabled)
			showScores()
	}
}

function sideRebound() {
	if (pongObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.player_lives[0] === 0)
		gameInfo.ball_att.dirX = 1;
	if (pongObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.player_lives[1] === 0)
		gameInfo.ball_att.dirX = -1;
	if (pongObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.player_lives[2] === 0)
		gameInfo.ball_att.dirY = -1;
	if (pongObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.player_lives[3] === 0)
		gameInfo.ball_att.dirY = 1;
}

function paddleColision() {
	const maxlevel = 6
	if (
		gameInfo.player_lives[0] > 0 &&
		pongObjs.ball.position.x - gameInfo.board_size.thickness <= pongObjs.paddles[0].position.x + gameInfo.board_size.thickness / 2 + 2 &&
		pongObjs.ball.position.x - gameInfo.board_size.thickness >= pongObjs.paddles[0].position.x + gameInfo.board_size.thickness / 2 - 8 &&
		pongObjs.ball.position.y <= pongObjs.paddles[0].position.y + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.y >= pongObjs.paddles[0].position.y - gameInfo.board_size.paddleLength / 2
	) {
		if(gameInfo.ball_att.reboundx === true){
			changeAngle();
			gameInfo.ball_att.dirX = 1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
			else if (gameInfo.level >= maxlevel && gameInfo.level < 10)
				gameInfo.level += gameInfo.level_inc / 5;
			gameInfo.ball_att.reboundx = false
		}
	}

	if (
		gameInfo.player_lives[1] > 0 &&
		pongObjs.ball.position.x + gameInfo.board_size.thickness >= pongObjs.paddles[1].position.x - gameInfo.board_size.thickness / 2 - 2 &&
		pongObjs.ball.position.x + gameInfo.board_size.thickness <= pongObjs.paddles[1].position.x - gameInfo.board_size.thickness / 2 + 8 &&
		pongObjs.ball.position.y <= pongObjs.paddles[1].position.y + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.y >= pongObjs.paddles[1].position.y - gameInfo.board_size.paddleLength / 2
	) {
		if(gameInfo.ball_att.reboundx === true){
			changeAngle();
			gameInfo.ball_att.dirX = -1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
			else if (gameInfo.level >= maxlevel && gameInfo.level < 10)
				gameInfo.level += gameInfo.level_inc / 5;
			gameInfo.ball_att.reboundx = false
		}
	}
	
	if (
		gameInfo.player_lives[2] > 0 &&
		pongObjs.ball.position.y + gameInfo.board_size.thickness >= pongObjs.paddles[2].position.y - gameInfo.board_size.thickness / 2 - 2 &&
		pongObjs.ball.position.y + gameInfo.board_size.thickness <= pongObjs.paddles[2].position.y - gameInfo.board_size.thickness / 2 + 8 &&
		pongObjs.ball.position.x <= pongObjs.paddles[2].position.x + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.x >= pongObjs.paddles[2].position.x - gameInfo.board_size.paddleLength / 2
	) {
		if(gameInfo.ball_att.reboundy === true){
			changeAngle();
			gameInfo.ball_att.dirY = -1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
			else if (gameInfo.level >= maxlevel && gameInfo.level < 10)
				gameInfo.level += gameInfo.level_inc / 5;
			gameInfo.ball_att.reboundy = false
		}
	}

	if (
		gameInfo.player_lives[3] > 0 &&
		pongObjs.ball.position.y - gameInfo.board_size.thickness <= pongObjs.paddles[3].position.y + gameInfo.board_size.thickness / 2 + 2 &&
		pongObjs.ball.position.y - gameInfo.board_size.thickness >= pongObjs.paddles[3].position.y + gameInfo.board_size.thickness / 2 - 8 &&
		pongObjs.ball.position.x <= pongObjs.paddles[3].position.x + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.x >= pongObjs.paddles[3].position.x - gameInfo.board_size.paddleLength / 2
	) {
		if(gameInfo.ball_att.reboundy === true){
			changeAngle();
			gameInfo.ball_att.dirY = 1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
			else if (gameInfo.level >= maxlevel && gameInfo.level < 10)
				gameInfo.level += gameInfo.level_inc / 5;
			gameInfo.ball_att.reboundy = false
		}
	
	}

	if(pongObjs.ball.position.y <= 10 && pongObjs.ball.position.y >= -10)
		gameInfo.ball_att.reboundy = true
	if(pongObjs.ball.position.x <= 10 && pongObjs.ball.position.x >= -10)
		gameInfo.ball_att.reboundx = true

}

function controlDetection() {
	const paddleSpeed = 6
	if ( gameInfo.controls.paddle1key[0] === true && pongObjs.paddles[0].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]))
		pongObjs.paddles[0].position.y += paddleSpeed;

	if ( gameInfo.controls.paddle1key[1] === true && pongObjs.paddles[0].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]))
		pongObjs.paddles[0].position.y -= paddleSpeed;

	if ( gameInfo.controls.paddle2key[0] === true && pongObjs.paddles[1].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]))
		pongObjs.paddles[1].position.y += paddleSpeed;

	if ( gameInfo.controls.paddle2key[1] === true && pongObjs.paddles[1].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]))
		pongObjs.paddles[1].position.y -= paddleSpeed;

	if ( gameInfo.controls.paddle3key[0] === true && pongObjs.paddles[2].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]))
		pongObjs.paddles[2].position.x -= paddleSpeed;

	if ( gameInfo.controls.paddle3key[1] === true && pongObjs.paddles[2].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]))
		pongObjs.paddles[2].position.x += paddleSpeed;

	if ( gameInfo.controls.paddle4key[0] === true && pongObjs.paddles[3].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]))
		pongObjs.paddles[3].position.x -= paddleSpeed;

	if ( gameInfo.controls.paddle4key[1] === true && pongObjs.paddles[3].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]))
		pongObjs.paddles[3].position.x += paddleSpeed;

}

document.addEventListener("keydown", (event) => {
	if(gameInfo.controls.enabled){
		if (event.key === "w") gameInfo.controls.paddle1key[0] = true;
		if (event.key === "s") gameInfo.controls.paddle1key[1] = true;
		if (event.key === "ArrowUp") gameInfo.controls.paddle2key[0] = true;
		if (event.key === "ArrowDown") gameInfo.controls.paddle2key[1] = true;
		if (event.key === "g") gameInfo.controls.paddle3key[0] = true;
		if (event.key === "h") gameInfo.controls.paddle3key[1] = true;
		if (event.key === "8") gameInfo.controls.paddle4key[0] = true;
		if (event.key === "9") gameInfo.controls.paddle4key[1] = true;
	}
});

document.addEventListener("keyup", (event) => {
	if (event.key === "w") gameInfo.controls.paddle1key[0] = false;
	if (event.key === "s") gameInfo.controls.paddle1key[1] = false;
	if (event.key === "ArrowUp") gameInfo.controls.paddle2key[0] = false;
	if (event.key === "ArrowDown") gameInfo.controls.paddle2key[1] = false;
	if (event.key === "g") gameInfo.controls.paddle3key[0] = false;
	if (event.key === "h") gameInfo.controls.paddle3key[1] = false;
	if (event.key === "8") gameInfo.controls.paddle4key[0] = false;
	if (event.key === "9") gameInfo.controls.paddle4key[1] = false;
});

window.addEventListener("resize", () => {

	const navHeight = document.querySelector('nav').offsetHeight;
	const masterHeight = document.querySelector('.master').offsetHeight;
	const masterWidth = document.querySelector('.master').offsetWidth;
	const canvasHeight = masterHeight - navHeight;

	pongObjs.renderer.setSize((masterWidth - 20), canvasHeight - 40)
	pongObjs.camera.aspect = (masterWidth - 20) / (canvasHeight - 40)
	pongObjs.camera.updateProjectionMatrix()
});

function changeView() {
	
	if (gameInfo.view == 0) {
		pongObjs.camera.position.set(0, 0, 700);
		pongObjs.camera.lookAt(0, 0, 0);
		pongObjs.camera.updateProjectionMatrix()
	} else {
		pongObjs.camera.position.set(0, -400, 375)
		pongObjs.camera.lookAt(0, -75, 0)
		pongObjs.camera.updateProjectionMatrix()

	}
}

function demoCamPlay(){
	if(pongObjs.camera.position.x < -400)
		gameInfo.demoCam.DirX = 1
	else if(pongObjs.camera.position.x > 400)
		gameInfo.demoCam.DirX = -1
	if(pongObjs.camera.position.y != 0)
		pongObjs.camera.position.y
	else if(pongObjs.camera.position.y > 210)
	gameInfo.demoCam.DirY = -1
	pongObjs.camera.position.x += (0.4 * gameInfo.demoCam.DirX)
	// pongObjs.camera.position.y += (0.1 * gameInfo.demoCam.DirY)
	pongObjs.camera.lookAt(0, 0, 0)
}

function camLimiter(){
	if(pongObjs.camera.position.length() > 10000){pongObjs.camera.position.setLength(10000);}
	if(pongObjs.camera.position.length() < 200){pongObjs.camera.position.setLength(200);}
	pongObjs.camera.updateProjectionMatrix();
}

function animate() {
	if (gameInfo.gameover === false && gameInfo.countDownDone === true) {
		controlDetection();
		ballPhysic();
	}
	camLimiter()
	pongObjs.renderer.render(pongObjs.scene, pongObjs.camera);
	if(gameInfo.demoCam.enabled === true)
		demoCamPlay()
	// console.log("running")
}

function playGame(startLives){	
	gameInfo.controls.enabled = true
	gameInfo.player_lives = startLives
	gameInfo.countDownDone = false
	gameInfo.gameover = false
	gameInfo.demoCam.enabled = false
	changeView()
	resetGameOver()
	pongObjs.renderer.setAnimationLoop(animate);
}

function playDemo(){
	if(gameInfo.demoCam.enabled === false){
		gameInfo.controls.enabled = false
		gameInfo.demoCam.enabled = true
		gameInfo.player_lives = [0, 0, 0, 0]
		resetGameDemo()
		pongObjs.renderer.setAnimationLoop(animate);
		gameInfo.tournaments.enabled = false
	}
}

function selectColor(color){

	switch (color) {
		case 'red':
			return "#9D2406"
		case 'blue':
			return "#249DC6"
		case 'green':
			return "#88AD40"
		case 'yellow':
			return "#F2D811"
		case 'orange':
			return "#E68A2B"
		case 'purple':
			return "#69327A"
	}
}

function getUserParam(){

	gameInfo.colors[0] = selectColor(document.querySelector('#p1colorSelect option:checked').value)
	gameInfo.colors[1] = selectColor(document.querySelector('#p2colorSelect option:checked').value)
	if(document.querySelector('#p3colorSelect')){
		gameInfo.colors[2] = selectColor(document.querySelector('#p3colorSelect option:checked').value)
		gameInfo.colors[3] = selectColor(document.querySelector('#p4colorSelect option:checked').value)
	}
	gameInfo.nicks[0] = document.querySelector('#player1nick').value;
	gameInfo.nicks[1] = document.querySelector('#player2nick').value;
	if(document.querySelector('#player3nick')){
		gameInfo.nicks[2] = document.querySelector('#player3nick').value;
		gameInfo.nicks[3] = document.querySelector('#player4nick').value;
	}
}

function getGameParam(){
	const basesize = 75
	gameInfo.board_size.paddleLength = document.querySelector('input[name="paddlesSize"]:checked').value;
	pongObjs.paddles[0].scale.y = gameInfo.board_size.paddleLength / basesize
	pongObjs.paddles[1].scale.y = gameInfo.board_size.paddleLength / basesize
	pongObjs.paddles[2].scale.x = gameInfo.board_size.paddleLength / basesize
	pongObjs.paddles[3].scale.x = gameInfo.board_size.paddleLength / basesize
	gameInfo.view = document.querySelector('input[name="view"]:checked').value
	gameInfo.default_lives = document.querySelector('input[name="defaultLives"]').value
	if(document.querySelector('input[name="tournLength"]'))
		gameInfo.tournaments.game_count = document.querySelector('input[name="tournLength"]').value
}

function resetLives(nb){
	for(let i = 0; i < nb; i++)
		gameInfo.player_lives[i] = gameInfo.default_lives
}

document.addEventListener("DOMContentLoaded", function (e) {
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btFight") {
			getUserParam()
		}
	})
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btPlayVs2") {
			getGameParam()
			resetLives(2)
			gameInfo.tournaments.enabled = false
			if(gameInfo.default_lives > 0){
				document.getElementById("gameSettings").style.display = "none"
				playGame(gameInfo.player_lives)
			}
		}
	})
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btPlayRumble") {
			e.preventDefault();
			getGameParam()
			resetLives(4)
			gameInfo.tournaments.enabled = false
			if(gameInfo.default_lives > 0){
				document.getElementById("gameSettings").style.display = "none"
				playGame(gameInfo.player_lives)
			}
		}
	})
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btPlayTourn") {
			e.preventDefault();
			getGameParam()
			tournament()
		}
	})
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btNextRound") {
			e.preventDefault();
			gameInfo.gameover = false
			gameInfo.tournaments.game_count--
			playGame(gameInfo.player_lives)
			document.getElementById("scoreBoard").style.display = "none"
		}
	})
})

export { gameInfo, playDemo, playGame }