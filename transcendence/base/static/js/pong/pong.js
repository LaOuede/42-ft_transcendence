import {initPongObjs} from "./pong_objs.js"

import {initGameInfo} from "./pong_var.js"
import {tournament, giveTournPoints, updateScores, showScores } from "./tournament.js"

let gameInfo = initGameInfo()
let tags = initElements(gameInfo)
const pongObjs = initPongObjs(gameInfo, tags)
let controls = {
	p1up: "w",
	p1down: "s",
	p1pw: "q",
	p2up: "ArrowUp",
	p2down: "ArrowDown",
	p2pw: "ArrowRight",
	p3left: "h",
	p3right: "j",
	p3pw: "g",
	p4left: "7",
	p4right: "8",
	p4pw: "9",
}

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

function resetUI(i){
	if(tags.cards[i]){
		tags.cards[i].style.display = "block"
		tags.cards[i].style.border = gameInfo.colors[i] + " solid 5px"
		tags.cards[i].style.color = gameInfo.colors[i]
		tags.cards[i].style.boxShadow = gameInfo.colors[i] + " 0px 0px 20px"
		if(gameInfo.nicks[i] == "" )
			if(i > 0)
				gameInfo.nicks[i] = "Player " + (i + 1)
			else
				gameInfo.nicks[i] = tags.names[i].textContent
		tags.names[i].textContent = gameInfo.nicks[i]
		tags.scores[i].textContent = gameInfo.player_lives[i]
	}
}

function showObjs(i){
	if(!pongObjs.scene.children.includes(pongObjs.paddles[i]))
		pongObjs.scene.add(pongObjs.paddles[i])
	if(!pongObjs.scene.children.includes(pongObjs.lights[i]))
		pongObjs.scene.add(pongObjs.lights[i])
	if(!pongObjs.scene.children.includes(pongObjs.teleports[i]) && gameInfo.power_enabled == 1)
		pongObjs.scene.add(pongObjs.teleports[i])
	pongObjs.lights[i].color.set(gameInfo.colors[i])
	pongObjs.lights[i].distance = setDistanceLight()
	gameInfo.paddle_limit_list[i] = 2.75
}

function hideObjs(i){
	pongObjs.scene.remove(pongObjs.paddles[i])
	pongObjs.scene.remove(pongObjs.lights[i])
	gameInfo.paddle_limit_list[i] = 0
	if(tags.cards[i])
		tags.cards[i].style.display = "none"
}

function resetGameOver(){
	tags = initElements(gameInfo)
	defaultPosition()
	countPlayers()
	for(let i = 0; i < 4; i++){
		if(gameInfo.player_lives[i] > 0){
			showObjs(i)
			resetUI(i)
		} else
			hideObjs(i)
	}
	changeView()
}

function resetDemoObjs(){
	for(let i = 0; i < 4; i++){
		if(pongObjs.scene.children.includes(pongObjs.paddles[i]))
			pongObjs.scene.remove(pongObjs.paddles[i])
		if(pongObjs.scene.children.includes(pongObjs.teleports[i]))
			pongObjs.scene.remove(pongObjs.teleports[i])
		if(i < 2){
			if(!pongObjs.scene.children.includes(pongObjs.lights[i]))
				pongObjs.scene.add(pongObjs.lights[i])
			pongObjs.lights[i].distance = 800

		} else {
			if(pongObjs.scene.children.includes(pongObjs.lights[i]))
				pongObjs.scene.remove(pongObjs.lights[i])
		}
		gameInfo.player_lives[i] = 0
	}
	pongObjs.lights[0].color.set("#69327A")
	pongObjs.lights[1].color.set("#249DC6")
	pongObjs.camera.position.set(0, 0, 750)
	pongObjs.camera.lookAt(0, 0, 0)
}

function resetDemoGameInfo(){
	gameInfo.countDownDone = false
	gameInfo.gameover = false
	gameInfo.player_count = 0
	gameInfo.nicks = ["", "", "", ""]
}

function resetGameDemo(){
	defaultPosition()
	resetDemoObjs()
	resetDemoGameInfo();
}

function resetDefaultGameInfo(){
	gameInfo.level = 1.5
	gameInfo.player_power = [0, 0, 0, 0]
	gameInfo.player_rebound = [0, 0, 0, 0]
	gameInfo.controls.paddle1key[2] = false
	gameInfo.controls.paddle2key[2] = false
	gameInfo.controls.paddle3key[2] = false
	gameInfo.controls.paddle4key[2] = false
}

function resetDefaultObjs(){
	pongObjs.ballplight.position.set(0, 0, gameInfo.board_size.thickness)
	pongObjs.ball.position.set(0, 0, gameInfo.board_size.thickness)
	for(let i = 0; i < 4; i++){
		if(i < 2)
			pongObjs.paddles[i].position.y = 0
		else
			pongObjs.paddles[i].position.x = 0
		pongObjs.teleports[i].position.x = pongObjs.paddles[i].position.x
		pongObjs.teleports[i].position.y = pongObjs.paddles[i].position.y
		pongObjs.teleports[i].material.color.set(0x9D2406)
	}
}

function defaultPosition() {
	resetDefaultObjs()
	resetDefaultGameInfo()
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
	gameInfo.ball_att.speedY = gameInfo.level - (rand * gameInfo.level) + 1;
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

function removePaddle(playerNumber){
	gameInfo.paddle_limit_list[playerNumber] = 0
	pongObjs.scene.remove(pongObjs.paddles[playerNumber]);
	pongObjs.scene.remove(pongObjs.teleports[playerNumber]);
	gameInfo.player_count--
}

function setGoal(playerNumber){
	gameInfo.player_lives[playerNumber]--;
	tags.scores[playerNumber].textContent = gameInfo.player_lives[playerNumber]
	if (gameInfo.player_lives[playerNumber] === 0) {
		removePaddle(playerNumber)
		if(gameInfo.tournaments.enabled)
			giveTournPoints(playerNumber)
	}
	gameInfo.countDownDone = false
	defaultPosition();
}

function endOfRound(){
	gameInfo.gameover = true
	gameInfo.player_count--
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

function goalDetection() {
	if (pongObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && 
		gameInfo.player_lives[0] > 0)
		setGoal(0)
	if (pongObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.player_lives[1] > 0)
		setGoal(1)
	if (pongObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.player_lives[2] > 0)
		setGoal(2)
	if (pongObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness &&
		gameInfo.player_lives[3] > 0)
		setGoal(3)
	if(gameInfo.player_count === 1)
		endOfRound()
}

function sideRebound() {
	if (pongObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.player_lives[0] === 0)
		gameInfo.ball_att.dirX = 1
	if (pongObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.player_lives[1] === 0)
		gameInfo.ball_att.dirX = -1
	if (pongObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.player_lives[2] === 0)
		gameInfo.ball_att.dirY = -1
	if (pongObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.player_lives[3] === 0)
		gameInfo.ball_att.dirY = 1
}

function ballSpeedUp(){
	if(gameInfo.level < gameInfo.max_level)
		gameInfo.level += gameInfo.level_inc;
	else if (gameInfo.level >= gameInfo.max_level && gameInfo.level < 10)
		gameInfo.level += gameInfo.level_inc / 4;
}

function countRebound(playerNumber){
	if(gameInfo.player_power[playerNumber] === 0)
		gameInfo.player_rebound[playerNumber]++
	if(gameInfo.player_rebound[playerNumber] === 3){
		gameInfo.player_rebound[playerNumber] = 0
		gameInfo.player_power[playerNumber] = 1
		pongObjs.teleports[playerNumber].material.color.set(0x88AD40)
	}
}

function unlockReboundFlags(){
	if(pongObjs.ball.position.y <= 10 && pongObjs.ball.position.y >= -10)
		gameInfo.ball_att.reboundy = true
	if(pongObjs.ball.position.x <= 10 && pongObjs.ball.position.x >= -10)
		gameInfo.ball_att.reboundx = true
}

function isInPaddle1HitBox(){
	if(pongObjs.ball.position.x - gameInfo.board_size.thickness <= pongObjs.paddles[0].position.x + gameInfo.board_size.thickness / 2 + 2 &&
		pongObjs.ball.position.x - gameInfo.board_size.thickness >= pongObjs.paddles[0].position.x + gameInfo.board_size.thickness / 2 - 8 &&
		pongObjs.ball.position.y <= pongObjs.paddles[0].position.y + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.y >= pongObjs.paddles[0].position.y - gameInfo.board_size.paddleLength / 2)
		return true
	return false
}

function isInPaddle2HitBox(){
	if(pongObjs.ball.position.x + gameInfo.board_size.thickness >= pongObjs.paddles[1].position.x - gameInfo.board_size.thickness / 2 - 2 &&
		pongObjs.ball.position.x + gameInfo.board_size.thickness <= pongObjs.paddles[1].position.x - gameInfo.board_size.thickness / 2 + 8 &&
		pongObjs.ball.position.y <= pongObjs.paddles[1].position.y + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.y >= pongObjs.paddles[1].position.y - gameInfo.board_size.paddleLength / 2)
		return true
	return false
}

function isInPaddle3HitBox(){
	if(pongObjs.ball.position.y + gameInfo.board_size.thickness >= pongObjs.paddles[2].position.y - gameInfo.board_size.thickness / 2 - 2 &&
		pongObjs.ball.position.y + gameInfo.board_size.thickness <= pongObjs.paddles[2].position.y - gameInfo.board_size.thickness / 2 + 8 &&
		pongObjs.ball.position.x <= pongObjs.paddles[2].position.x + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.x >= pongObjs.paddles[2].position.x - gameInfo.board_size.paddleLength / 2)
		return true
	return false
}

function isInPaddle4HitBox(){
	if(pongObjs.ball.position.y - gameInfo.board_size.thickness <= pongObjs.paddles[3].position.y + gameInfo.board_size.thickness / 2 + 2 &&
		pongObjs.ball.position.y - gameInfo.board_size.thickness >= pongObjs.paddles[3].position.y + gameInfo.board_size.thickness / 2 - 8 &&
		pongObjs.ball.position.x <= pongObjs.paddles[3].position.x + gameInfo.board_size.paddleLength / 2 &&
		pongObjs.ball.position.x >= pongObjs.paddles[3].position.x - gameInfo.board_size.paddleLength / 2)
		return true
	return false
}

function paddleColision() {
	if (gameInfo.player_lives[0] > 0 && isInPaddle1HitBox()) {
		if(gameInfo.ball_att.reboundx === true){
			changeAngle();
			gameInfo.ball_att.dirX = 1;
			ballSpeedUp()
			gameInfo.ball_att.reboundx = false
			countRebound(0)
			if(gameInfo.controls.paddle1key[2] === true){
				gameInfo.controls.paddle1key[2] = false;
				gameInfo.player_power[0]--
				pongObjs.teleports[0].material.color.set(0x9D2406)
			}
		}
	}

	if (gameInfo.player_lives[1] > 0 && isInPaddle2HitBox()) {
		if(gameInfo.ball_att.reboundx === true){
			changeAngle();
			gameInfo.ball_att.dirX = -1;
			ballSpeedUp()
			gameInfo.ball_att.reboundx = false
			countRebound(1)
			if(gameInfo.controls.paddle2key[2] === true){
				gameInfo.controls.paddle2key[2] = false;
				gameInfo.player_power[1]--

				pongObjs.teleports[1].material.color.set(0x9D2406)
			}

		}
	}
	
	if (gameInfo.player_lives[2] > 0 && isInPaddle3HitBox()) {
		if(gameInfo.ball_att.reboundy === true){
			changeAngle();
			gameInfo.ball_att.dirY = -1;
			ballSpeedUp()
			gameInfo.ball_att.reboundy = false
			countRebound(2)
			if(gameInfo.controls.paddle3key[2] === true){
				gameInfo.controls.paddle3key[2] = false;
				gameInfo.player_power[2]--
				pongObjs.teleports[2].material.color.set(0x9D2406)
			}
		}
	}

	if (gameInfo.player_lives[3] > 0 && isInPaddle4HitBox()) {
		if(gameInfo.ball_att.reboundy === true){
			changeAngle();
			gameInfo.ball_att.dirY = 1;
			ballSpeedUp()
			gameInfo.ball_att.reboundy = false
			countRebound(3)
			if(gameInfo.controls.paddle4key[2] === true){
				gameInfo.controls.paddle4key[2] = false;
				gameInfo.player_power[3]--
				pongObjs.teleports[3].material.color.set(0x9D2406)
			}
		}
	}
	unlockReboundFlags()
}

function controlDetection() {
	paddle1controls()
	paddle2controls()
	paddle3controls()
	paddle4controls()
	teleportFollowPaddles()
}

function paddle1controls(){
	if ( gameInfo.controls.paddle1key[0] === true && pongObjs.paddles[0].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]))
		pongObjs.paddles[0].position.y += gameInfo.controls.speed;
		
	if ( gameInfo.controls.paddle1key[1] === true && pongObjs.paddles[0].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]))
		pongObjs.paddles[0].position.y -= gameInfo.controls.speed;
		pladdle1PowerUp()
}

function pladdle1PowerUp(){
	if ( gameInfo.controls.paddle1key[2] === true  && gameInfo.power_enabled == 1){
		if(pongObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2])){
			pongObjs.paddles[0].position.y = gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]);
		}
		else if(pongObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3])){
			pongObjs.paddles[0].position.y = -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]);
		}
		else
			pongObjs.paddles[0].position.y = pongObjs.ball.position.y;
		pongObjs.teleports[0].material.color.set(0xF2D811)
	}
}

function paddle2controls(){
	if ( gameInfo.controls.paddle2key[0] === true && pongObjs.paddles[1].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]))
		pongObjs.paddles[1].position.y += gameInfo.controls.speed;

	if ( gameInfo.controls.paddle2key[1] === true && pongObjs.paddles[1].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]))
		pongObjs.paddles[1].position.y -= gameInfo.controls.speed;
		pladdle2PowerUp()
}

function pladdle2PowerUp(){
	if ( gameInfo.controls.paddle2key[2] === true  && gameInfo.power_enabled == 1){
		if(pongObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2])){
			pongObjs.paddles[1].position.y = gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]);
		}
		else if(pongObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3])){
			pongObjs.paddles[1].position.y = -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]);
		}
		else
			pongObjs.paddles[1].position.y = pongObjs.ball.position.y;
		pongObjs.teleports[1].material.color.set(0xF2D811)
	}
}

function paddle3controls(){
	if ( gameInfo.controls.paddle3key[0] === true && pongObjs.paddles[2].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]))
		pongObjs.paddles[2].position.x -= gameInfo.controls.speed;

	if ( gameInfo.controls.paddle3key[1] === true && pongObjs.paddles[2].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]))
		pongObjs.paddles[2].position.x += gameInfo.controls.speed;
	pladdle3PowerUp()
}

function pladdle3PowerUp(){
	if ( gameInfo.controls.paddle3key[2] === true && gameInfo.power_enabled == 1){
		if(pongObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1])){
			pongObjs.paddles[2].position.x = gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]);
		}
		else if(pongObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0])){
			pongObjs.paddles[2].position.x = -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]);
		}
		else
			pongObjs.paddles[2].position.x = pongObjs.ball.position.x;
		pongObjs.teleports[2].material.color.set(0xF2D811)
	}
}

function paddle4controls(){
	if ( gameInfo.controls.paddle4key[0] === true && pongObjs.paddles[3].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]))
		pongObjs.paddles[3].position.x -= gameInfo.controls.speed;

	if ( gameInfo.controls.paddle4key[1] === true && pongObjs.paddles[3].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]))
		pongObjs.paddles[3].position.x += gameInfo.controls.speed;
	pladdle4PowerUp()
}

function pladdle4PowerUp(){
	if ( gameInfo.controls.paddle4key[2] === true && gameInfo.power_enabled == 1){
		if(pongObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1])){
			pongObjs.paddles[3].position.x = gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLength / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]);
		}
		else if(pongObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0])){
			pongObjs.paddles[3].position.x = -gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLength / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]);
		}
		else
			pongObjs.paddles[3].position.x = pongObjs.ball.position.x;
		pongObjs.teleports[3].material.color.set(0xF2D811)
	}
}

function teleportFollowPaddles(){
	for(let i = 0; i < 4; i++){
		pongObjs.teleports[i].position.x = pongObjs.paddles[i].position.x
		pongObjs.teleports[i].position.y = pongObjs.paddles[i].position.y
	}
}

document.addEventListener("keydown", (event) => {
	if(gameInfo.controls.enabled){
		if (event.key === controls.p1up || event.key === controls.p1up.toUpperCase()) gameInfo.controls.paddle1key[0] = true;
		if (event.key === controls.p1down || event.key === controls.p1down.toUpperCase()) gameInfo.controls.paddle1key[1] = true;
		if (event.key === controls.p1pw || event.key === controls.p1pw.toUpperCase()) if(gameInfo.player_power[0] > 0)  gameInfo.controls.paddle1key[2] = true;
		if (event.key === controls.p2up || event.key === controls.p2up.toUpperCase()) gameInfo.controls.paddle2key[0] = true;
		if (event.key === controls.p2down || event.key === controls.p2down.toUpperCase()) gameInfo.controls.paddle2key[1] = true;
		if (event.key === controls.p2pw || event.key === controls.p2pw.toUpperCase())  if(gameInfo.player_power[1] > 0) gameInfo.controls.paddle2key[2] = true;
		if (event.key === controls.p3left || event.key === controls.p3left.toUpperCase()) gameInfo.controls.paddle3key[0] = true;
		if (event.key === controls.p3right || event.key === controls.p3right.toUpperCase()) gameInfo.controls.paddle3key[1] = true;
		if (event.key === controls.p3pw || event.key === controls.p3pw.toUpperCase()) if(gameInfo.player_power[2] > 0)  gameInfo.controls.paddle3key[2] = true;
		if (event.key === controls.p4left || event.key === controls.p4left.toUpperCase()) gameInfo.controls.paddle4key[0] = true;
		if (event.key === controls.p4right || event.key === controls.p4right.toUpperCase()) gameInfo.controls.paddle4key[1] = true;
		if (event.key === controls.p4pw || event.key === controls.p4pw.toUpperCase()) if(gameInfo.player_power[3] > 0) gameInfo.controls.paddle4key[2] = true;
	}
});

document.addEventListener("keyup", (event) => {
	if (event.key === controls.p1up || event.key === controls.p1up.toUpperCase()) gameInfo.controls.paddle1key[0] = false;
	if (event.key === controls.p1down || event.key === controls.p1down.toUpperCase()) gameInfo.controls.paddle1key[1] = false;
	if (event.key === controls.p2up || event.key === controls.p2up.toUpperCase()) gameInfo.controls.paddle2key[0] = false;
	if (event.key === controls.p2down || event.key === controls.p2down.toUpperCase()) gameInfo.controls.paddle2key[1] = false;
	if (event.key === controls.p3left || event.key === controls.p3left.toUpperCase()) gameInfo.controls.paddle3key[0] = false;
	if (event.key === controls.p3right || event.key === controls.p3right.toUpperCase()) gameInfo.controls.paddle3key[1] = false;
	if (event.key === controls.p4left || event.key === controls.p4left.toUpperCase()) gameInfo.controls.paddle4key[0] = false;
	if (event.key === controls.p4right || event.key === controls.p4right.toUpperCase()) gameInfo.controls.paddle4key[1] = false;
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
	gameInfo.gameIsSet = true
}

function getGameParam(){
	const basesize = 75
	gameInfo.board_size.paddleLength = document.querySelector('#defaultPaddle').value;
	pongObjs.paddles[0].scale.y = gameInfo.board_size.paddleLength / basesize
	pongObjs.paddles[1].scale.y = gameInfo.board_size.paddleLength / basesize
	pongObjs.paddles[2].scale.x = gameInfo.board_size.paddleLength / basesize
	pongObjs.paddles[3].scale.x = gameInfo.board_size.paddleLength / basesize
	gameInfo.view = document.querySelector('#defaultView').value;
	gameInfo.default_lives = document.querySelector('#defaultLives').value;
	gameInfo.power_enabled = document.querySelector('#defaultPowerUp').value;
	if(document.querySelector('#defaultGames'))
		gameInfo.tournaments.game_count = document.querySelector('#defaultGames').value;
		/* console.log(gameInfo.tournaments.game_count) */
}

function resetLives(nb){
	for(let i = 0; i < nb; i++)
		gameInfo.player_lives[i] = gameInfo.default_lives
}

document.addEventListener("DOMContentLoaded", function (e) {
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btFight") {
			e.preventDefault();
			getUserParam()
		}
	})
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "btPlayVs2") {
			e.preventDefault();
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
	document.addEventListener("change", function (e) {
		if (e.target && e.target.id === "p1colorSelect") {
			e.preventDefault();
			document.querySelector(".player1-grid-item").style.backgroundColor = selectColor(e.target.value) + "66"
			document.querySelector(".player1-grid-item").style.border = "5px solid " + selectColor(e.target.value)
		}
	})
	document.addEventListener("change", function (e) {
		if (e.target && e.target.id === "p2colorSelect") {
			e.preventDefault();
			document.querySelector(".player2-grid-item").style.backgroundColor = selectColor(e.target.value) + "66"
			document.querySelector(".player2-grid-item").style.border = "5px solid " + selectColor(e.target.value)
		}
	})
	document.addEventListener("change", function (e) {
		if (e.target && e.target.id === "p3colorSelect") {
			e.preventDefault();
			document.querySelector(".player3-grid-item").style.backgroundColor = selectColor(e.target.value) + "66"
			document.querySelector(".player3-grid-item").style.border = "5px solid " + selectColor(e.target.value)
		}
	})
	document.addEventListener("change", function (e) {
		if (e.target && e.target.id === "p4colorSelect") {
			e.preventDefault();
			document.querySelector(".player4-grid-item").style.backgroundColor = selectColor(e.target.value) + "66"
			document.querySelector(".player4-grid-item").style.border = "5px solid " + selectColor(e.target.value)
		}
	})
})

export { gameInfo, playDemo, playGame }