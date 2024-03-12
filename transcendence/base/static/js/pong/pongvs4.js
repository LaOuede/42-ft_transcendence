import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {initSceneObjs} from "./pong_scene.js"

import {gameInfo} from "./pong_var.js"
import {tournament, giveTournPoints } from "./tournament.js"

function initElements() {
	const tags = {
		scores: [undefined, undefined, undefined, undefined],
		cards: [undefined, undefined, undefined, undefined],
	}
	const tags_name = ["p1Score", "p2Score", "p3Score", "p4Score",
		"playerInfo1", "playerInfo2", "playerInfo3", "playerInfo4"]
	if (document.getElementById("p1Score")) {
		tags.scores[0] = document.getElementById("p1Score")
	}
	if (document.getElementById("p2Score")) {
		tags.scores[1]  = document.getElementById("p2Score") 
	}
	if (document.getElementById("p3Score")) {
		tags.scores[2]  = document.getElementById("p3Score") 
	}
	if (document.getElementById("p4Score")) {
		tags.scores[3]  = document.getElementById("p4Score") 
	}
	if (document.getElementById("playerInfo1")) {
		tags.cards[0] = document.getElementById("playerInfo1")
	}
	if (document.getElementById("playerInfo2")) {
		tags.cards[1] = document.getElementById("playerInfo2") 
	}
	if (document.getElementById("playerInfo3")) {
		tags.cards[2] = document.getElementById("playerInfo3") 
	}
	if (document.getElementById("playerInfo4")) {
		tags.cards[3] = document.getElementById("playerInfo4") 
	}
	console.log(tags)
	console.log(document.getElementById("playerInfo4"))
	return tags
}
let navHeight = document.querySelector('nav').offsetHeight;
let headerHeight = document.querySelector('header').offsetHeight;
let footerHeight = document.querySelector('footer').offsetHeight;
let canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1
const canvas = document.querySelector("#game");

const renderer = new THREE.WebGLRenderer({ canvas });
	
renderer.shadowMap.enabled = true;// voir ou le mettre

renderer.setSize(window.innerWidth, canvasHeight);

const sceneObjs = initSceneObjs()
let tags = initElements()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / canvasHeight, 0.1, 5000000);
camera.position.set(0, -350, 700);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

function demoLights(){
	if(!sceneObjs.scene.add(sceneObjs.lights[0])){
		sceneObjs.scene.add(sceneObjs.lights[0])
		sceneObjs.lights[0].distance = 800
	}
	if(!sceneObjs.scene.add(sceneObjs.lights[1])){
		sceneObjs.scene.add(sceneObjs.lights[1])
		sceneObjs.lights[1].distance = 800

	}

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
	tags = initElements()
	gameInfo.countDownDone = false
	defaultPosition()
	countPlayers()
	for(let i = 0; i < 4; i++){
		if(gameInfo.player_lives[i] > 0){
			if(!sceneObjs.scene.add(sceneObjs.paddles[i]))
				sceneObjs.scene.add(sceneObjs.paddles[i])
			if(!sceneObjs.scene.add(sceneObjs.lights[i]))
				sceneObjs.scene.add(sceneObjs.lights[i])
			sceneObjs.lights[i].distance = setDistanceLight()
			gameInfo.paddle_limit_list[i] = 2.75
			tags.cards[i].style.display = "block"
			tags.scores[i].textContent = gameInfo.player_lives[i]
		} else {
			sceneObjs.scene.remove(sceneObjs.paddles[i])
			sceneObjs.scene.remove(sceneObjs.lights[i])
			gameInfo.paddle_limit_list[i] = 0
			tags.cards[i].style.display = "none"
		}
	}
	
	// gameInfo.gameover = false
	camera.position.set(0, -400, 375)
	camera.lookAt(0, -75, 0)
	orbit.enabled = true

}

function resetGameDemo(){
	gameInfo.countDownDone = false
	defaultPosition()
	if(sceneObjs.scene.children.includes(sceneObjs.paddles[0])) {sceneObjs.scene.remove(sceneObjs.paddles[0])};
	if(sceneObjs.scene.children.includes(sceneObjs.paddles[1])) {sceneObjs.scene.remove(sceneObjs.paddles[1])};
	if(sceneObjs.scene.children.includes(sceneObjs.paddles[2])) {sceneObjs.scene.remove(sceneObjs.paddles[2])};
	if(sceneObjs.scene.children.includes(sceneObjs.paddles[3])) {sceneObjs.scene.remove(sceneObjs.paddles[3])};
	if(sceneObjs.scene.children.includes(sceneObjs.lights[2])) {sceneObjs.scene.remove(sceneObjs.lights[2])};
	if(sceneObjs.scene.children.includes(sceneObjs.lights[3])) {sceneObjs.scene.remove(sceneObjs.lights[3])};
	sceneObjs.lights[0].distance = 800
	sceneObjs.lights[1].distance = 800
	gameInfo.player_lives[0] = 0
	gameInfo.player_lives[1] = 0
	gameInfo.player_lives[2] = 0
	gameInfo.player_lives[3] = 0
	gameInfo.player_count = 0
	camera.position.set(0, 0, 750)
	camera.lookAt(0, 0, 0)
	// orbit.enabled = false
}

function defaultPosition() {
	sceneObjs.ball.position.x = 0
	sceneObjs.ball.position.y = 0
	sceneObjs.paddles[0].position.y = 0
	sceneObjs.paddles[1].position.y = 0
	sceneObjs.paddles[2].position.x = 0
	sceneObjs.paddles[3].position.x = 0
	sceneObjs.ballplight.position.set(0, 0, gameInfo.board_size.thickness)
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
		sceneObjs.ball.position.x += gameInfo.ball_att.speedX;
		sceneObjs.ballplight.position.x = sceneObjs.ball.position.x;
	}
	if (gameInfo.ball_att.dirX <= 0) {
		sceneObjs.ball.position.x -= gameInfo.ball_att.speedX;
		sceneObjs.ballplight.position.x = sceneObjs.ball.position.x;
	}
	if (gameInfo.ball_att.dirY > 0) {
		sceneObjs.ball.position.y += gameInfo.ball_att.speedY;
		sceneObjs.ballplight.position.y = sceneObjs.ball.position.y;
	}
	if (gameInfo.ball_att.dirY <= 0) {
		sceneObjs.ball.position.y -= gameInfo.ball_att.speedY;
		sceneObjs.ballplight.position.y = sceneObjs.ball.position.y;
	}
}

function goalDetection() {
	//vs2 et vs4
	if (
		sceneObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && 
		gameInfo.player_lives[0] > 0
	) {
		gameInfo.player_lives[0]--;
		tags.scores[0].textContent = gameInfo.player_lives[0]
		if (gameInfo.player_lives[0] === 0) {
			gameInfo.paddle_limit_list[0] = 0
				sceneObjs.scene.remove(sceneObjs.paddles[0]);
			gameInfo.player_count--
			giveTournPoints(0)

		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if (
		sceneObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.player_lives[1] > 0) {
			gameInfo.player_lives[1]--;
			tags.scores[1].textContent = gameInfo.player_lives[1]
		if (gameInfo.player_lives[1] === 0) {
			gameInfo.paddle_limit_list[1] = 0
			sceneObjs.scene.remove(sceneObjs.paddles[1]);
			gameInfo.player_count--
			giveTournPoints(1)

		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if (
		sceneObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.player_lives[2] > 0) {
			gameInfo.player_lives[2]--;
			tags.scores[2].textContent = gameInfo.player_lives[2]
		if (gameInfo.player_lives[2] === 0) {
			gameInfo.paddle_limit_list[2] = 0
			sceneObjs.scene.remove(sceneObjs.paddles[2]);
			gameInfo.player_count--
			giveTournPoints(2)

		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if (
		sceneObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness &&
		gameInfo.player_lives[3] > 0
	) {
		gameInfo.player_lives[3]--;
		tags.scores[3].textContent = gameInfo.player_lives[3]
		if (gameInfo.player_lives[3] === 0) {
			gameInfo.paddle_limit_list[3] = 0
			sceneObjs.scene.remove(sceneObjs.paddles[3]);
			gameInfo.player_count--
			giveTournPoints(3)
		}
		gameInfo.countDownDone = false
		defaultPosition();
	}
	if(gameInfo.player_count === 1){
		gameInfo.player_count--;
		let tempPaddle = [gameInfo.player_lives[0], gameInfo.player_lives[1], gameInfo.player_lives[2], gameInfo.player_lives[3]]
		for(let i = 0; i < tempPaddle.length; i++){
			if(tempPaddle[i] > 0){
				giveTournPoints(i)
			}
		}
		gameInfo.gameover = true
		tournament()
	}
}
  
function sideRebound() {
	if (sceneObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.player_lives[0] === 0) {
		gameInfo.ball_att.dirX = 1;
	}
	if (sceneObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.player_lives[1] === 0) {
		gameInfo.ball_att.dirX = -1;
	}
	if (sceneObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.player_lives[2] === 0) {
		gameInfo.ball_att.dirY = 1;
	}
	if (sceneObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.player_lives[3] === 0) {
		gameInfo.ball_att.dirY = -1;
	}
}

function paddleColision() {
	const maxlevel = 6
	if (
		gameInfo.player_lives[0] > 0 &&
		sceneObjs.ball.position.x - gameInfo.board_size.thickness <= sceneObjs.paddles[0].position.x + gameInfo.board_size.thickness / 2 + 2 &&
		sceneObjs.ball.position.x - gameInfo.board_size.thickness >= sceneObjs.paddles[0].position.x + gameInfo.board_size.thickness / 2 - 8 &&
		sceneObjs.ball.position.y <= sceneObjs.paddles[0].position.y + gameInfo.board_size.paddleLenght / 2 &&
		sceneObjs.ball.position.y >= sceneObjs.paddles[0].position.y - gameInfo.board_size.paddleLenght / 2
	) {
	if(gameInfo.ball_att.reboundx === true){
		changeAngle();
		gameInfo.ball_att.dirX = 1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	gameInfo.ball_att.reboundx = false
	}
	if (
		gameInfo.player_lives[1] > 0 &&
		sceneObjs.ball.position.x + gameInfo.board_size.thickness >= sceneObjs.paddles[1].position.x - gameInfo.board_size.thickness / 2 - 2 &&
		sceneObjs.ball.position.x + gameInfo.board_size.thickness <= sceneObjs.paddles[1].position.x - gameInfo.board_size.thickness / 2 + 8 &&
		sceneObjs.ball.position.y <= sceneObjs.paddles[1].position.y + gameInfo.board_size.paddleLenght / 2 &&
		sceneObjs.ball.position.y >= sceneObjs.paddles[1].position.y - gameInfo.board_size.paddleLenght / 2
	) {
	if(gameInfo.ball_att.reboundx === true){
		changeAngle();
		gameInfo.ball_att.dirX = -1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	gameInfo.ball_att.reboundx = false
	}
	if (
		gameInfo.player_lives[2] > 0 &&
		sceneObjs.ball.position.y + gameInfo.board_size.thickness >= sceneObjs.paddles[2].position.y - gameInfo.board_size.thickness / 2 - 2 &&
		sceneObjs.ball.position.y + gameInfo.board_size.thickness <= sceneObjs.paddles[2].position.y - gameInfo.board_size.thickness / 2 + 8 &&
		sceneObjs.ball.position.x <= sceneObjs.paddles[2].position.x + gameInfo.board_size.paddleLenght / 2 &&
		sceneObjs.ball.position.x >= sceneObjs.paddles[2].position.x - gameInfo.board_size.paddleLenght / 2
	) {
	if(gameInfo.ball_att.reboundy === true){
		changeAngle();
		gameInfo.ball_att.dirY = -1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	gameInfo.ball_att.reboundy = false
	}
	if (
		gameInfo.player_lives[3] > 0 &&
		sceneObjs.ball.position.y - gameInfo.board_size.thickness <= sceneObjs.paddles[3].position.y + gameInfo.board_size.thickness / 2 + 2 &&
		sceneObjs.ball.position.y - gameInfo.board_size.thickness >= sceneObjs.paddles[3].position.y + gameInfo.board_size.thickness / 2 - 8 &&
		sceneObjs.ball.position.x <= sceneObjs.paddles[3].position.x + gameInfo.board_size.paddleLenght / 2 &&
		sceneObjs.ball.position.x >= sceneObjs.paddles[3].position.x - gameInfo.board_size.paddleLenght / 2
	) {
	if(gameInfo.ball_att.reboundy === true){
		changeAngle();
		gameInfo.ball_att.dirY = 1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	
	gameInfo.ball_att.reboundy = false
	}
	if(sceneObjs.ball.position.y <= 10 && sceneObjs.ball.position.y >= -10)
		gameInfo.ball_att.reboundy = true
	if(sceneObjs.ball.position.x <= 10 && sceneObjs.ball.position.x >= -10)
		gameInfo.ball_att.reboundx = true
}

function controlDetection() {
	//vs2 et vs4
	const paddleSpeed = 6
	if ( gameInfo.controls.paddle1key[0] === true && sceneObjs.paddles[0].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]))
		sceneObjs.paddles[0].position.y += paddleSpeed;

	if ( gameInfo.controls.paddle1key[1] === true && sceneObjs.paddles[0].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]))
		sceneObjs.paddles[0].position.y -= paddleSpeed;

	if ( gameInfo.controls.paddle2key[0] === true && sceneObjs.paddles[1].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[2]))
		sceneObjs.paddles[1].position.y += paddleSpeed;

	if ( gameInfo.controls.paddle2key[1] === true && sceneObjs.paddles[1].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[3]))
		sceneObjs.paddles[1].position.y -= paddleSpeed;

	if ( gameInfo.controls.paddle3key[0] === true && sceneObjs.paddles[2].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]))
		sceneObjs.paddles[2].position.x -= paddleSpeed;

	if ( gameInfo.controls.paddle3key[1] === true && sceneObjs.paddles[2].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]))
		sceneObjs.paddles[2].position.x += paddleSpeed;

	if ( gameInfo.controls.paddle4key[0] === true && sceneObjs.paddles[3].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[0]))
		sceneObjs.paddles[3].position.x -= paddleSpeed;

	if ( gameInfo.controls.paddle4key[1] === true && sceneObjs.paddles[3].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * gameInfo.paddle_limit_list[1]))
		sceneObjs.paddles[3].position.x += paddleSpeed;

}

document.addEventListener("keypress", (event) => {
	if (event.key === "v") changeView();
	if (event.key === "k") {
		stopGame()
	}
	if (event.key === "m") {
		renderer.setAnimationLoop(animate);

	}
	if (event.key === "j") {
		playGameV4()
	}
	if (event.key === "o") {
		playGameV2()
	}
	if (event.key === "l") {
		playDemo()
	}
	if(event.key === "1"){
		lightColorSwitch(3, "#ff55ff")
	}
		
});

document.addEventListener("keydown", (event) => {
	if (event.key === "w") gameInfo.controls.paddle1key[0] = true;
	if (event.key === "s") gameInfo.controls.paddle1key[1] = true;
	if (event.key === "ArrowUp") gameInfo.controls.paddle2key[0] = true;
	if (event.key === "ArrowDown") gameInfo.controls.paddle2key[1] = true;
	if (event.key === "g") gameInfo.controls.paddle3key[0] = true;
	if (event.key === "h") gameInfo.controls.paddle3key[1] = true;
	if (event.key === "8") gameInfo.controls.paddle4key[0] = true;
	if (event.key === "9") gameInfo.controls.paddle4key[1] = true;
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

	navHeight = document.querySelector('nav').offsetHeight;
	headerHeight = document.querySelector('header').offsetHeight;
	footerHeight = document.querySelector('footer').offsetHeight;
	canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1
	
	camera.aspect = window.innerWidth / canvasHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, canvasHeight)
});

function changeView() {
	//vs2 et vs4
	if (gameInfo.view === 0) {
	camera.position.set(0, 0, gameInfo.board_size.size * 2);
	camera.lookAt(0, 0, 0);
	gameInfo.view = 1;
	} else {
	camera.position.set(0, -400, 375)
	camera.lookAt(0, -75, 0)
	gameInfo.view = 0;
	}
}

function demoCamPlay(){
	if(camera.position.x < -400)
		gameInfo.demoCam.DirX = 1
	else if(camera.position.x > 400)
		gameInfo.demoCam.DirX = -1
	if(camera.position.y != 0)
		camera.position.y
	else if(camera.position.y > 210)
	gameInfo.demoCam.DirY = -1
	camera.position.x += (0.4 * gameInfo.demoCam.DirX)
	// camera.position.y += (0.1 * gameInfo.demoCam.DirY)
	camera.lookAt(0, 0, 0)
}

function camLimiter(){
	if(camera.position.length() > 10000){camera.position.setLength(10000);}
	if(camera.position.length() < 200){camera.position.setLength(200);}
	camera.updateProjectionMatrix();
}

function animate() {
	//vs2 et vs4
	if (gameInfo.gameover === false && gameInfo.countDownDone === true) {
		controlDetection();
		ballPhysic();
	}
	camLimiter()
	renderer.render(sceneObjs.scene, camera);
	if(gameInfo.demoCam.enabled === true)
		demoCamPlay()
	// console.log("running")
}

function lightColorSwitch(player, color){
	const lights = [sceneObjs.lights[0], sceneObjs.lights[1], sceneObjs.lights[2], sceneObjs.lights[3]]
	const pInfos = [p1Info, p2Info, p3Info, p4Info]
	lights[player - 1].color.set(color)
	pInfos[player - 1].style.backgroundColor = color + "66"
}


function playGameV2(){
	gameInfo.gameover = false
	gameInfo.player_lives = [4, 4, 0, 0]
	resetGameOver()
	gameInfo.demoCam.enabled = false
	gameInfo.countDownDone = false
	renderer.setAnimationLoop(animate);
}

function playGameV4(){
	gameInfo.gameover = false
	gameInfo.player_lives = [4, 4, 4, 4]
	resetGameOver()
	gameInfo.demoCam.enabled = false
	gameInfo.countDownDone = false
	renderer.setAnimationLoop(animate);
}

function playDemo(){
	if(gameInfo.demoCam.enabled === false){
		gameInfo.demoCam.enabled = true
		gameInfo.player_lives = [0, 0, 0, 0]
		resetGameDemo()
		demoLights()
		renderer.setAnimationLoop(animate);
	}
}

function stopGame(){
	gameInfo.demoCam.enabled = false
	renderer.setAnimationLoop(null)
}
initSceneObjs()
initElements()

export { playGameV2, playGameV4, stopGame, playDemo }