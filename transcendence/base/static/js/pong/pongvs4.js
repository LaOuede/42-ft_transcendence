import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {initSceneObjs} from "./pong_scene.js"

import {gameInfo} from "./pong_var.js"
import {tournament, giveTournPoints } from "./tournament.js"

let demoCam = false
let camDemoDirX = 1
let camDemoDirY = 1
let paddle1limit = 2.5
let paddle2limit = 2.5
let paddle3limit = 2.5
let paddle4limit = 2.5

let p1ScoreTag
let p2ScoreTag
let p3ScoreTag
let p4ScoreTag

let p1Info
let p2Info
let p3Info
let p4Info

function initElements() {

	if (document.getElementById("p1Score")) {
		p1ScoreTag = document.getElementById("p1Score")
	}
	if (document.getElementById("p2Score")) {
		p2ScoreTag  = document.getElementById("p2Score") 
	}
	if (document.getElementById("p3Score")) {
		p3ScoreTag  = document.getElementById("p3Score") 
	}
	if (document.getElementById("p4Score")) {
		p4ScoreTag  = document.getElementById("p4Score") 
	}
	if (document.getElementById("playerInfo1")) {
		p1Info = document.getElementById("playerInfo1") 
	}
	if (document.getElementById("playerInfo2")) {
		p2Info = document.getElementById("playerInfo2") 
	}
	if (document.getElementById("playerInfo3")) {
		p3Info = document.getElementById("playerInfo3") 
	}
	if (document.getElementById("playerInfo4")) {
		p4Info= document.getElementById("playerInfo4") 
	}
}

let navHeight = document.querySelector('nav').offsetHeight;
let headerHeight = document.querySelector('header').offsetHeight;
let footerHeight = document.querySelector('footer').offsetHeight;
let canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1
const canvas = document.querySelector("#game");

const renderer = new THREE.WebGLRenderer({ canvas });
	
renderer.shadowMap.enabled = true;// voir ou le mettre

renderer.setSize(window.innerWidth, canvasHeight);
// const scene = new THREE.Scene();

const sceneObjs = initSceneObjs()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / canvasHeight, 0.1, 5000000);
camera.position.set(0, -350, 700);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

function resetGameOverParam(players, lives){
	let paddles = [paddle1, paddle2, paddle3, paddle4]
	let lights = [p1light, p2light, p3light, p4light]
	
	gameInfo.countDownDone = false
	defaultPosition()
	for(let i = 0; i < players.length; i++){
		if(players[i] === true){

		}
	}
}

// function resetGameOverV2(){
// 	initElements()
// 	gameInfo.countDownDone = false
// 	defaultPosition()
// 	if(!scene.children.includes(sceneObjs.paddles[0])) {scene.add(sceneObjs.paddles[0])};
// 	if(!scene.children.includes(paddle2)) {scene.add(paddle2)};
// 	if(scene.children.includes(paddle3)) {scene.remove(paddle3)};
// 	if(scene.children.includes(paddle4)) {scene.remove(paddle4)};
// 	if(scene.children.includes(p3light)) {scene.remove(p3light)};
// 	if(scene.children.includes(p4light)) {scene.remove(p4light)};
// 	p1light.distance = 800
// 	p2light.distance = 800
// 	paddle1limit = 0
// 	paddle2limit = 0
// 	paddle3limit = 0
// 	paddle4limit = 0
// 	gameInfo.p1Lives = gameInfo.lives
// 	gameInfo.p2Lives = gameInfo.lives
// 	gameInfo.p3Lives = 0
// 	gameInfo.p4Lives = 0
// 	p1ScoreTag.textContent = gameInfo.p1Lives
// 	p2ScoreTag.textContent = gameInfo.p2Lives
// 	p3ScoreTag.textContent = gameInfo.p3Lives
// 	p4ScoreTag.textContent = gameInfo.p4Lives
// 	gameInfo.player_count = 2
// 	// gameInfo.gameover = false
// 	camera.position.set(0, -400, 375)
// 	camera.lookAt(0, -75, 0)
// 	orbit.enabled = true
// }

function resetGameOverV4(){
	initElements()
	gameInfo.countDownDone = false
	defaultPosition()
	if(!sceneObjs.scene.children.includes(sceneObjs.paddles[0])) {sceneObjs.scene.add(sceneObjs.paddles[0])};
	if(!sceneObjs.scene.children.includes(sceneObjs.paddles[1])) {sceneObjs.scene.add(sceneObjs.paddles[1])};
	if(!sceneObjs.scene.children.includes(sceneObjs.paddles[2])) {sceneObjs.scene.add(sceneObjs.paddles[2])};
	if(!sceneObjs.scene.children.includes(sceneObjs.paddles[3])) {sceneObjs.scene.add(sceneObjs.paddles[3])};
	if(!sceneObjs.scene.children.includes(sceneObjs.lights[2])) {sceneObjs.scene.add(sceneObjs.lights[2])};
	if(!sceneObjs.scene.children.includes(sceneObjs.lights[3])) {sceneObjs.scene.add(sceneObjs.lights[3])};
	sceneObjs.lights[0].distance = 400
	sceneObjs.lights[1].distance = 400
	paddle1limit = 2.75
	paddle2limit = 2.75
	paddle3limit = 2.75
	paddle4limit = 2.75
	gameInfo.p1Lives = gameInfo.lives
	gameInfo.p2Lives = gameInfo.lives
	gameInfo.p3Lives = gameInfo.lives
	gameInfo.p4Lives = gameInfo.lives
	p1ScoreTag.textContent = gameInfo.p1Lives
	p2ScoreTag.textContent = gameInfo.p2Lives
	p3ScoreTag.textContent = gameInfo.p3Lives
	p4ScoreTag.textContent = gameInfo.p4Lives
	gameInfo.player_count = 4
	// gameInfo.gameover = false
	camera.position.set(0, -400, 375)
	camera.lookAt(0, -75, 0)
	orbit.enabled = true

}

// function resetGameDemo(){
// 	gameInfo.countDownDone = false
// 	defaultPosition()
// 	if(scene.children.includes(paddle1)) {scene.remove(paddle1)};
// 	if(scene.children.includes(paddle2)) {scene.remove(paddle2)};
// 	if(scene.children.includes(paddle3)) {scene.remove(paddle3)};
// 	if(scene.children.includes(paddle4)) {scene.remove(paddle4)};
// 	if(!scene.children.includes(p3light)) {scene.add(p3light)};
// 	if(!scene.children.includes(p4light)) {scene.add(p4light)};

// 	gameInfo.p1Lives = 0
// 	gameInfo.p2Lives = 0
// 	gameInfo.p3Lives = 0
// 	gameInfo.p4Lives = 0
// 	gameInfo.player_count = 0
// 	camera.position.set(0, 0, 750)
// 	camera.lookAt(0, 0, 0)
// 	// orbit.enabled = false
// }

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
	let count = 1;
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
		gameInfo.p1Lives > 0
	) {
	gameInfo.p1Lives--;
	p1ScoreTag.textContent = gameInfo.p1Lives
	if (gameInfo.p1Lives == 0) {
			paddle1limit = 0
			sceneObjs.scene.remove(sceneObjs.paddles[0]);
		gameInfo.player_count--
		giveTournPoints(0)

	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if (
		sceneObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
	gameInfo.p2Lives > 0) {
	gameInfo.p2Lives--;
	p2ScoreTag.textContent = gameInfo.p2Lives
	if (gameInfo.p2Lives == 0) {
		paddle2limit = 0
		sceneObjs.scene.remove(sceneObjs.paddles[1]);
		gameInfo.player_count--
		giveTournPoints(1)

	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if (
		sceneObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness &&
		gameInfo.p3Lives > 0) {
	gameInfo.p3Lives--;
	p3ScoreTag.textContent = gameInfo.p3Lives
	if (gameInfo.p3Lives == 0) {
		paddle3limit = 0
		sceneObjs.scene.remove(sceneObjs.paddles[2]);
		gameInfo.player_count--
		giveTournPoints(2)

	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if (
		sceneObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness &&
	gameInfo.p4Lives > 0
	) {
	gameInfo.p4Lives--;
	p4ScoreTag.textContent = gameInfo.p4Lives
	if (gameInfo.p4Lives == 0) {
		paddle4limit = 0
		sceneObjs.scene.remove(sceneObjs.paddles[3]);
		gameInfo.player_count--
		giveTournPoints(3)
	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if(gameInfo.player_count === 1){
		gameInfo.player_count--;
		let tempPaddle = [gameInfo.p1Lives ,gameInfo.p2Lives, gameInfo.p3Lives, gameInfo.p4Lives]
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
	if (sceneObjs.ball.position.x < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.p1Lives === 0) {
			gameInfo.ball_att.dirX = 1;
	}
	if (sceneObjs.ball.position.x > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.p2Lives === 0) {
			gameInfo.ball_att.dirX = -1;
	}
	if (sceneObjs.ball.position.y < -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness && gameInfo.p4Lives === 0) {
		gameInfo.ball_att.dirY = 1;
	}
	if (sceneObjs.ball.position.y > gameInfo.board_size.size / 2 - gameInfo.board_size.thickness && gameInfo.p3Lives === 0) {
		gameInfo.ball_att.dirY = -1;
	}
}

function paddleColision() {
	const maxlevel = 6
	if (
		gameInfo.p1Lives > 0 &&
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
		gameInfo.p2Lives > 0 &&
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
		gameInfo.p3Lives > 0 &&
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
		gameInfo.p4Lives > 0 &&
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
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * paddle3limit))
		sceneObjs.paddles[0].position.y += paddleSpeed;

	if ( gameInfo.controls.paddle1key[1] === true && sceneObjs.paddles[0].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * paddle4limit))
		sceneObjs.paddles[0].position.y -= paddleSpeed;

	if ( gameInfo.controls.paddle2key[0] === true && sceneObjs.paddles[1].position.y <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * paddle3limit))
		sceneObjs.paddles[1].position.y += paddleSpeed;

	if ( gameInfo.controls.paddle2key[1] === true && sceneObjs.paddles[1].position.y >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * paddle4limit))
		sceneObjs.paddles[1].position.y -= paddleSpeed;

	if ( gameInfo.controls.paddle3key[0] === true && sceneObjs.paddles[2].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * paddle1limit))
		sceneObjs.paddles[2].position.x -= paddleSpeed;

	if ( gameInfo.controls.paddle3key[1] === true && sceneObjs.paddles[2].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * paddle2limit))
		sceneObjs.paddles[2].position.x += paddleSpeed;

	if ( gameInfo.controls.paddle4key[0] === true && sceneObjs.paddles[3].position.x >
		-gameInfo.board_size.size / 2 + gameInfo.board_size.paddleLenght / 2 + (gameInfo.board_size.thickness * paddle1limit))
		sceneObjs.paddles[3].position.x -= paddleSpeed;

	if ( gameInfo.controls.paddle4key[1] === true && sceneObjs.paddles[3].position.x <
		gameInfo.board_size.size / 2 - gameInfo.board_size.paddleLenght / 2 - (gameInfo.board_size.thickness * paddle2limit))
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
		console.log("1")
		lightColorSwitch(3, "#ff55ff")
	}
		
});

document.addEventListener("keydown", (event) => {
	if (event.key === "w") gameInfo.controls.paddle1key[0] = true;
	console.log(gameInfo.controls.paddle1key[0])
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
		camDemoDirX = 1
	else if(camera.position.x > 400)
		camDemoDirX = -1
	if(camera.position.y != 0)
		camera.position.y
	else if(camera.position.y > 210)
		camDemoDirY = -1
	camera.position.x += (0.4 * camDemoDirX)
	// camera.position.y += (0.1 * camDemoDirY)
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
	if(demoCam)
		demoCamPlay()
	// console.log("running")
}

function lightColorSwitch(player, color){
	const lights = [sceneObjs.lights[0], sceneObjs.lights[1], sceneObjs.lights[2], sceneObjs.lights[3]]
	const pInfos = [p1Info, p2Info, p3Info, p4Info]
	lights[player - 1].color.set(color)
	pInfos[player - 1].style.backgroundColor = color + "66"
}

function showPlayerInfoV4(){
	if(p1Info && p2Info && p3Info && p4Info ){
		p1Info.style.display = "block"
		p2Info.style.display = "block"
		p3Info.style.display = "block"
		p4Info.style.display = "block"
	}
}

function showPlayerInfoV2(){
	if(p1Info && p2Info && p3Info && p4Info ){
		p1Info.style.display = "block"
		p2Info.style.display = "block"
		p3Info.style.display = "none"
		p4Info.style.display = "none"
	}
}

function hidePlayerInfo(){
	if(p1Info && p2Info && p3Info && p4Info ){
		p1Info.style.display = "none"
		p2Info.style.display = "none"
		p3Info.style.display = "none"
		p4Info.style.display = "none"
	}
}

function playGameV2(){
	// showPlayerInfoV2()
	// resetGameOverV2()
	// demoCam = false
	// gameInfo.countDownDone = false
	// renderer.setAnimationLoop(animate);
}

function playGameV4(){
	showPlayerInfoV4()
	resetGameOverV4()
	demoCam = false
	gameInfo.countDownDone = false
	renderer.setAnimationLoop(animate);
}

function playDemo(){
	// hidePlayerInfo()
	// demoCam = true
	// resetGameDemo()
	// renderer.setAnimationLoop(animate);

}

function stopGame(){
	demoCam = false
	renderer.setAnimationLoop(null)
}
initSceneObjs()
initElements()

export { playGameV2, playGameV4, stopGame, playDemo }