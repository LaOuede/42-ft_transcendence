import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {initGraphic} from "./pong_scene.js"

import {board, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att, control, gameInfo} from "./pong_var.js"
import {tournament, giveTournPoints } from "./tournament.js"

let reboundx = true
let reboundy = true
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


const scene = initGraphic()
const ball = scene.getObjectByName("ball")
const ballplight = scene.getObjectByName("ballplight")
const paddle1 = scene.getObjectByName("paddle1")
const paddle2 = scene.getObjectByName("paddle2")
const paddle3 = scene.getObjectByName("paddle3")
const paddle4 = scene.getObjectByName("paddle4")
const p1light = scene.getObjectByName("p1light")
const p2light = scene.getObjectByName("p2light")
const p3light = scene.getObjectByName("p3light")
const p4light = scene.getObjectByName("p4light")

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / canvasHeight, 0.1, 5000000);
camera.position.set(0, -350, 700);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

function resetGameOverParam(players, lives){
	let paddles = [paddle1, paddle2, paddle3, paddle4]
	let paddles_atts = [paddle1_att, paddle2_att, paddle3_att, paddle4_att]
	let lights = [p1light, p2light, p3light, p4light]
	
	gameInfo.countDownDone = false
	defaultPosition()
	for(let i = 0; i < players.length; i++){
		if(players[i] === true){

		}
	}
}

function resetGameOverV2(){
	initElements()
	gameInfo.countDownDone = false
	defaultPosition()
	if(!scene.children.includes(paddle1)) {scene.add(paddle1)};
	if(!scene.children.includes(paddle2)) {scene.add(paddle2)};
	if(scene.children.includes(paddle3)) {scene.remove(paddle3)};
	if(scene.children.includes(paddle4)) {scene.remove(paddle4)};
	if(scene.children.includes(p3light)) {scene.remove(p3light)};
	if(scene.children.includes(p4light)) {scene.remove(p4light)};
	p1light.distance = 800
	p2light.distance = 800
	paddle1limit = 0
	paddle2limit = 0
	paddle3limit = 0
	paddle4limit = 0
	gameInfo.p1Lives = gameInfo.lives
	gameInfo.p2Lives = gameInfo.lives
	gameInfo.p3Lives = 0
	gameInfo.p4Lives = 0
	p1ScoreTag.textContent = gameInfo.p1Lives
	p2ScoreTag.textContent = gameInfo.p2Lives
	p3ScoreTag.textContent = gameInfo.p3Lives
	p4ScoreTag.textContent = gameInfo.p4Lives
	gameInfo.player_count = 2
	// gameInfo.gameover = false
	camera.position.set(0, -400, 375)
	camera.lookAt(0, -75, 0)
	orbit.enabled = true
}

function resetGameOverV4(){
	initElements()
	gameInfo.countDownDone = false
	defaultPosition()
	if(!scene.children.includes(paddle1)) {scene.add(paddle1)};
	if(!scene.children.includes(paddle2)) {scene.add(paddle2)};
	if(!scene.children.includes(paddle3)) {scene.add(paddle3)};
	if(!scene.children.includes(paddle4)) {scene.add(paddle4)};
	if(!scene.children.includes(p3light)) {scene.add(p3light)};
	if(!scene.children.includes(p4light)) {scene.add(p4light)};
	p1light.distance = 400
	p2light.distance = 400
	paddle1limit = 2.5
	paddle2limit = 2.5
	paddle3limit = 2.5
	paddle4limit = 2.5
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

function resetGameDemo(){
	gameInfo.countDownDone = false
	defaultPosition()
	if(scene.children.includes(paddle1)) {scene.remove(paddle1)};
	if(scene.children.includes(paddle2)) {scene.remove(paddle2)};
	if(scene.children.includes(paddle3)) {scene.remove(paddle3)};
	if(scene.children.includes(paddle4)) {scene.remove(paddle4)};
	if(!scene.children.includes(p3light)) {scene.add(p3light)};
	if(!scene.children.includes(p4light)) {scene.add(p4light)};

	gameInfo.p1Lives = 0
	gameInfo.p2Lives = 0
	gameInfo.p3Lives = 0
	gameInfo.p4Lives = 0
	gameInfo.player_count = 0
	camera.position.set(0, 0, 750)
	camera.lookAt(0, 0, 0)
	// orbit.enabled = false
}

function defaultPosition() {
	ball.position.x = 0
	ball.position.y = 0
	paddle1.position.y = 0
	paddle2.position.y = 0
	paddle3.position.x = 0
	paddle4.position.x = 0
	ballplight.position.set(0, 0, board.thickness)
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
	if (Math.random() <= 0.5)ball_att.dirX = 1;
	else ball_att.dirX = -1;
	if (Math.random() <= 0.5) ball_att.dirY = 1;
	else ball_att.dirY = -1;
}

function changeAngle() {
	let rand = Math.random();
	ball_att.speedX = rand * gameInfo.level + 1;
	ball_att.speedY = gameInfo.level - rand + 1;
}

function ballPhysic() {
	moveBall();
	sideRebound();
	paddleColision();
	goalDetection();
}

function moveBall() {
	if (ball_att.dirX > 0) {
	ball.position.x += ball_att.speedX;
	ballplight.position.x = ball.position.x;
	}
	if (ball_att.dirX <= 0) {
	ball.position.x -= ball_att.speedX;
	ballplight.position.x = ball.position.x;
	}
	if (ball_att.dirY > 0) {
	ball.position.y += ball_att.speedY;
	ballplight.position.y = ball.position.y;
	}
	if (ball_att.dirY <= 0) {
	ball.position.y -= ball_att.speedY;
	ballplight.position.y = ball.position.y;
	}
}

function goalDetection() {
	//vs2 et vs4
	if (
	ball.position.x < -board.size / 2 + board.thickness && 
		gameInfo.p1Lives > 0
	) {
	gameInfo.p1Lives--;
	p1ScoreTag.textContent = gameInfo.p1Lives
	if (gameInfo.p1Lives == 0) {
			paddle1limit = 0
		scene.remove(paddle1);
		gameInfo.player_count--
		giveTournPoints(0)

	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if (
	ball.position.x > board.size / 2 - board.thickness &&
	gameInfo.p2Lives > 0) {
	gameInfo.p2Lives--;
	p2ScoreTag.textContent = gameInfo.p2Lives
	if (gameInfo.p2Lives == 0) {
		paddle2limit = 0
		scene.remove(paddle2);
		gameInfo.player_count--
		giveTournPoints(1)

	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if (
	ball.position.y > board.size / 2 - board.thickness &&
		gameInfo.p3Lives > 0) {
	gameInfo.p3Lives--;
	p3ScoreTag.textContent = gameInfo.p3Lives
	if (gameInfo.p3Lives == 0) {
		paddle3limit = 0
		scene.remove(paddle3);
		gameInfo.player_count--
		giveTournPoints(2)

	}
	gameInfo.countDownDone = false
	defaultPosition();
	}
	if (
	ball.position.y < -board.size / 2 + board.thickness &&
	gameInfo.p4Lives > 0
	) {
	gameInfo.p4Lives--;
	p4ScoreTag.textContent = gameInfo.p4Lives
	if (gameInfo.p4Lives == 0) {
		paddle4limit = 0
		scene.remove(paddle4);
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
	if (ball.position.x < -board.size / 2 + board.thickness && gameInfo.p1Lives === 0) {
			ball_att.dirX = 1;
	}
	if (ball.position.x > board.size / 2 - board.thickness && gameInfo.p2Lives === 0) {
			ball_att.dirX = -1;
	}
	if (ball.position.y < -board.size / 2 + board.thickness && gameInfo.p4Lives === 0) {
		ball_att.dirY = 1;
	}
	if (ball.position.y > board.size / 2 - board.thickness && gameInfo.p3Lives === 0) {
		ball_att.dirY = -1;
	}
}

function paddleColision() {
	const maxlevel = 6
	if (
		gameInfo.p1Lives > 0 &&
		ball.position.x - board.thickness <= paddle1.position.x + board.thickness / 2 + 2 &&
		ball.position.x - board.thickness >= paddle1.position.x + board.thickness / 2 - 8 &&
		ball.position.y <= paddle1.position.y + paddle1_att.height / 2 &&
		ball.position.y >= paddle1.position.y - paddle1_att.height / 2
	) {
	if(reboundx === true){
		changeAngle();
		ball_att.dirX = 1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	reboundx = false
	}
	if (
		gameInfo.p2Lives > 0 &&
		ball.position.x + board.thickness >= paddle2.position.x - board.thickness / 2 - 2 &&
		ball.position.x + board.thickness <= paddle2.position.x - board.thickness / 2 + 8 &&
		ball.position.y <= paddle2.position.y + paddle2_att.height / 2 &&
		ball.position.y >= paddle2.position.y - paddle2_att.height / 2
	) {
	if(reboundx === true){
		changeAngle();
		ball_att.dirX = -1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	reboundx = false
	}
	if (
		gameInfo.p3Lives > 0 &&
		ball.position.y + board.thickness >= paddle3.position.y - board.thickness / 2 - 2 &&
		ball.position.y + board.thickness <= paddle3.position.y - board.thickness / 2 + 8 &&
		ball.position.x <= paddle3.position.x + paddle3_att.width / 2 &&
		ball.position.x >= paddle3.position.x - paddle3_att.width / 2
	) {
	if(reboundy === true){
		changeAngle();
		ball_att.dirY = -1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	reboundy = false
	}
	if (
		gameInfo.p4Lives > 0 &&
		ball.position.y - board.thickness <= paddle4.position.y + board.thickness / 2 + 2 &&
		ball.position.y - board.thickness >= paddle4.position.y + board.thickness / 2 - 8 &&
		ball.position.x <= paddle4.position.x + paddle4_att.width / 2 &&
		ball.position.x >= paddle4.position.x - paddle4_att.width / 2
	) {
	if(reboundy === true){
		changeAngle();
		ball_att.dirY = 1;
		if(gameInfo.level < maxlevel)
			gameInfo.level += gameInfo.level_inc;
	}
	
	reboundy = false
	}
	if(ball.position.y <= 10 && ball.position.y >= -10)
		reboundy = true
	if(ball.position.x <= 10 && ball.position.x >= -10)
		reboundx = true


}

function controlDetection() {
	//vs2 et vs4
	const paddleSpeed = 6
	if (
	control.w === true &&
	paddle1.position.y <
		board.size / 2 - paddle1_att.height / 2 - board.thickness * paddle3limit
	)
	paddle1.position.y += paddleSpeed;

	if (
	control.s === true &&
	paddle1.position.y >
		-board.size / 2 + paddle1_att.height / 2 + board.thickness * paddle4limit
	)
	paddle1.position.y -= paddleSpeed;

	if (
	control.h === true &&
	paddle3.position.x <
		board.size / 2 - paddle3_att.width / 2 - board.thickness * paddle2limit
	)
	paddle3.position.x += paddleSpeed;

	if (
	control.g === true &&
	paddle3.position.x >
		-board.size / 2 + paddle3_att.width / 2 + board.thickness * paddle1limit
	)
	paddle3.position.x -= paddleSpeed;

	if (
	control.arrowUp === true &&
	paddle2.position.y <
		board.size / 2 - paddle2_att.height / 2 - board.thickness * paddle3limit
	)
	paddle2.position.y += paddleSpeed;

	if (
	control.arrowDown === true &&
	paddle2.position.y >
		-board.size / 2 + paddle2_att.height / 2 + board.thickness * paddle4limit
	)
	paddle2.position.y -= paddleSpeed;

	if (
	control.num9 === true &&
	paddle4.position.x <
		board.size / 2 - paddle3_att.width / 2 - board.thickness * paddle2limit
	)
	paddle4.position.x += paddleSpeed;

	if (
	control.num8 === true &&
	paddle4.position.x >
		-board.size / 2 + paddle3_att.width / 2 + board.thickness * paddle1limit 
	)
	paddle4.position.x -= paddleSpeed;
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
	if (event.key === "w") control.w = true;
	if (event.key === "s") control.s = true;
	if (event.key === "g") control.g = true;
	if (event.key === "h") control.h = true;
	if (event.key === "ArrowUp") control.arrowUp = true;
	if (event.key === "ArrowDown") control.arrowDown = true;
	if (event.key === "8") control.num8 = true;
	if (event.key === "9") control.num9 = true;
});

document.addEventListener("keyup", (event) => {
	if (event.key === "w") control.w = false;
	if (event.key === "s") control.s = false;
	if (event.key === "g") control.g = false;
	if (event.key === "h") control.h = false;
	if (event.key === "ArrowUp") control.arrowUp = false;
	if (event.key === "ArrowDown") control.arrowDown = false;
	if (event.key === "8") control.num8 = false;
	if (event.key === "9") control.num9 = false;
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
	camera.position.set(0, 0, board.size * 2);
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
	renderer.render(scene, camera);
	if(demoCam)
		demoCamPlay()
	// console.log("running")
}

function lightColorSwitch(player, color){
	const lights = [p1light1, p2light1, p3light1, p4light1]
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
	showPlayerInfoV2()
	resetGameOverV2()
	demoCam = false
	gameInfo.countDownDone = false
	renderer.setAnimationLoop(animate);
}

function playGameV4(){
	showPlayerInfoV4()
	resetGameOverV4()
	demoCam = false
	gameInfo.countDownDone = false
	renderer.setAnimationLoop(animate);
}

function playDemo(){
	hidePlayerInfo()
	demoCam = true
	resetGameDemo()
	renderer.setAnimationLoop(animate);

}

function stopGame(){
	demoCam = false
	renderer.setAnimationLoop(null)
}
initGraphic()
initElements()

export { playGameV2, playGameV4, stopGame, playDemo }