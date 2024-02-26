// player place
// 		3
// 1		2
// 		4
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let vs4 = true;
let board = { size: 500, thickness: 10 };
let paddle1_att = {
x: -board.size / 2 + board.thickness * 2,
y: 0,
width: board.thickness,
height: 75,
light_color: 0x0000ff,
dead: false,
};
let paddle2_att = {
x: board.size / 2 - board.thickness * 2,
y: 0,
width: board.thickness,
height: 75,
light_color: 0xff0000,
dead: false,
};
let paddle3_att = {
x: 0,
y: board.size / 2 - board.thickness * 2,
width: 75,
height: board.thickness,
light_color: 0xff0000,
dead: false,
};
let paddle4_att = {
x: 0,
y: -board.size / 2 + board.thickness * 2,
width: 75,
height: board.thickness,
light_color: 0xff0000,
dead: false,
};
let control = {
w: false,
s: false,
a: false,
d: false,
arrowUp: false,
arrowDown: false,
arrowLeft: false,
arrowRight: false,
};
let ball_att = { x: 0, y: 0, dirX: 1, dirY: -1, speedX: 1, speedY: 0 };
let gameInfo = {
p1Lives: 1,
p2Lives: 1,
p3Lives: 1,
p4Lives: 1,
gameover: false,
player_count: 4,
};
let countDownDone = false;
let view = 0;
let level = 3;
let level_inc = 0.1;

setTimeout(() => {
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

const canvas = document.querySelector("#content #root #pong");
const parentDiv = document.querySelector("#content #root");
renderer.setSize(1000, 1000);
canvas.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1000 / 1000, 0.1, 10000);
camera.position.set(0, -350, 700);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

//plane
const planeGeometry = new THREE.PlaneGeometry(board.size + 2, board.size + 2);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);

// const gridHelper = new THREE.GridHelper(board.width, 20)
// gridHelper.rotation.x = 0.5 * Math.PI
// scene.add(gridHelper)

const ballplight = new THREE.PointLight(0xeeeeee, 0.8, 100);
ballplight.position.set(0, 0, board.thickness);
scene.add(ballplight);
const ballplightHelper = new THREE.PointLightHelper(ballplight);
ballplight.castShadow = true;
scene.add(ballplightHelper);

const p1light1 = new THREE.PointLight(paddle1_att.light_color, 0.8, 10000);
p1light1.position.set(board.size / -4, 0, 100);
scene.add(p1light1);
const p1lightHelper1 = new THREE.PointLightHelper(p1light1);
// p1light1.castShadow = true
scene.add(p1lightHelper1);

const p1light2 = new THREE.PointLight(paddle1_att.light_color, 0.4, 10000);
p1light2.position.set(-375, -375, -200);
scene.add(p1light2);
const p1lightHelper2 = new THREE.PointLightHelper(p1light2);
// p1light2.castShadow = true
scene.add(p1lightHelper2);

const p1light3 = new THREE.PointLight(paddle1_att.light_color, 0.4, 10000);
p1light3.position.set(-375, 375, -200);
scene.add(p1light3);
const p1lightHelper3 = new THREE.PointLightHelper(p1light3);
// p1light3.castShadow = true
scene.add(p1lightHelper3);

const p2light1 = new THREE.PointLight(paddle2_att.light_color, 0.8, 10000);
p2light1.position.set(board.size / 4, 0, 100);
scene.add(p2light1);
const p2lightHelper1 = new THREE.PointLightHelper(p2light1);
// p2light1.castShadow = true
scene.add(p2lightHelper1);

const p2light2 = new THREE.PointLight(paddle2_att.light_color, 0.4, 10000);
p2light2.position.set(375, -375, -200);
scene.add(p2light2);
const p2lightHelper2 = new THREE.PointLightHelper(p2light2);
// p2light2.castShadow = true
scene.add(p2lightHelper2);

const p2light3 = new THREE.PointLight(paddle2_att.light_color, 0.4, 10000);
p2light3.position.set(375, 375, -200);
scene.add(p2light3);
const p2lightHelper3 = new THREE.PointLightHelper(p2light3);
// p2light3.castShadow = true
scene.add(p2lightHelper3);

// const textureLoader = new THREE.TextureLoader()

const sphereGeometry = new THREE.SphereGeometry(board.thickness, 64, 64);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = false;
sphere.position.set(ball_att.x, ball_att.y, board.thickness);
scene.add(sphere);

const side1geometry = new THREE.BoxGeometry(
	board.size + board.thickness * 2,
	board.thickness,
	board.thickness * 2
);
const side1material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side1 = new THREE.Mesh(side1geometry, side1material);
side1.position.set(0, -board.size / 2 - board.thickness / 2, board.thickness);
side1.receiveShadow = true;
scene.add(side1);

const side2geometry = new THREE.BoxGeometry(
	board.size + board.thickness * 2,
	board.thickness,
	board.thickness * 2
);
const side2material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side2 = new THREE.Mesh(side2geometry, side2material);
side2.position.set(0, board.size / 2 + board.thickness / 2, board.thickness);
side2.receiveShadow = true;
scene.add(side2);

const side3geometry = new THREE.BoxGeometry(
	board.thickness,
	board.size,
	board.thickness * 2
);
const side3material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side3 = new THREE.Mesh(side3geometry, side3material);
side3.position.set(board.size / 2 + board.thickness / 2, 0, board.thickness);
side3.receiveShadow = true;
scene.add(side3);

const side4geometry = new THREE.BoxGeometry(
	board.thickness,
	board.size,
	board.thickness * 2
);
const side4material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side4 = new THREE.Mesh(side4geometry, side4material);
side4.position.set(-board.size / 2 - board.thickness / 2, 0, board.thickness);
side4.receiveShadow = true;
scene.add(side4);

//PADDLE1
const paddle1geometry = new THREE.BoxGeometry(
	board.thickness,
	paddle1_att.height,
	board.thickness
);
const paddle1material = new THREE.MeshPhongMaterial({
	color: 0xcccccc,
	shininess: 2000,
});
const paddle1 = new THREE.Mesh(paddle1geometry, paddle1material);
paddle1.position.set(paddle1_att.x, 0, board.thickness);
paddle1.castShadow = true;
paddle1.receiveShadow = true;
scene.add(paddle1);

//PADDLE2
const paddle2geometry = new THREE.BoxGeometry(
	board.thickness,
	paddle2_att.height,
	board.thickness
);
const paddle2material = new THREE.MeshPhongMaterial({
	color: 0xcccccc,
	shininess: 2000,
});
const paddle2 = new THREE.Mesh(paddle2geometry, paddle2material);
paddle2.position.set(paddle2_att.x, 0, board.thickness);
paddle2.castShadow = true;
paddle2.receiveShadow = true;
scene.add(paddle2);

//PADDLE3
const paddle3geometry = new THREE.BoxGeometry(
	paddle3_att.width,
	board.thickness,
	board.thickness
);
const paddle3material = new THREE.MeshPhongMaterial({
	color: 0xcccccc,
	shininess: 2000,
});
const paddle3 = new THREE.Mesh(paddle3geometry, paddle3material);
paddle3.position.set(0, paddle3_att.y, board.thickness);
paddle3.castShadow = true;
paddle3.receiveShadow = true;
scene.add(paddle3);

//PADDLE4
const paddle4geometry = new THREE.BoxGeometry(
	paddle4_att.width,
	board.thickness,
	board.thickness
);
const paddle4material = new THREE.MeshPhongMaterial({
	color: 0xcccccc,
	shininess: 2000,
});
const paddle4 = new THREE.Mesh(paddle4geometry, paddle4material);
paddle4.position.set(0, paddle4_att.y, board.thickness);
paddle4.castShadow = true;
paddle4.receiveShadow = true;
scene.add(paddle4);

function initGame() {
	sphere.position.x = 0;
	sphere.position.y = 0;
	paddle1.position.y = 0;
	paddle2.position.y = 0;
	paddle3.position.x = 0;
	paddle4.position.x = 0;
	ballplight.position.set(0, 0, board.thickness);
	level = 4;
	randomStartDir();
	changeAngle();
	if (countDownDone === false) countDown();
}

function countDown() {
	let count = 1;
	let countdown = setInterval(() => {
	if (count > 0) {
		count--;
	} else {
		countDownDone = true;
		clearInterval(countdown);
	}
	}, 1000);
}

function randomStartDir() {
	if (Math.random() <= 0.5)ball_att.dirX = 1;
	else ball_att.dirX = -1;
	if (Math.random() <= 0.5) ball_att.dirY = 1;
	else ball_att.dirY = -1;
}

function changeAngle() {
	let rand = Math.random();
	ball_att.speedX = rand * level;
	ball_att.speedY = level - rand;
	console.log(rand);
	console.log(ball_att.speedX);
	console.log(ball_att.speedY);
}

function ballPhysic() {
	moveBall();
	sideRebound();
	paddleColision();
	goalDetection();
}

function moveBall() {
	if (ball_att.dirX > 0) {
	sphere.position.x += ball_att.speedX;
	ballplight.position.x = sphere.position.x;
	}
	if (ball_att.dirX <= 0) {
	sphere.position.x -= ball_att.speedX;
	ballplight.position.x = sphere.position.x;
	}
	if (ball_att.dirY > 0) {
	sphere.position.y += ball_att.speedY;
	ballplight.position.y = sphere.position.y;
	}
	if (ball_att.dirY <= 0) {
	sphere.position.y -= ball_att.speedY;
	ballplight.position.y = sphere.position.y;
	}
}

function goalDetection() {
	if (
	sphere.position.x < -board.size / 2 + board.thickness &&
	paddle1_att.dead === false
	) {
	gameInfo.p1Lives--;
	if (gameInfo.p1Lives == 0) {
		paddle1_att.dead = true;
		scene.remove(paddle1);
		gameInfo.player_count--

	}
	// countDownDone = false
	initGame();
	}
	if (
	sphere.position.x > board.size / 2 - board.thickness &&
	paddle2_att.dead === false
	) {
	gameInfo.p2Lives--;
	if (gameInfo.p2Lives == 0) {
		paddle2_att.dead = true;
		scene.remove(paddle2);
		gameInfo.player_count--

	}
	// countDownDone = false
	initGame();
	}
	if (
	sphere.position.y > board.size / 2 - board.thickness &&
	paddle3_att.dead === false
	) {
	gameInfo.p3Lives--;
	if (gameInfo.p3Lives == 0) {
		paddle3_att.dead = true;
		scene.remove(paddle3);
		gameInfo.player_count--

	}
	// countDownDone = false
	initGame();
	}
	if (
	sphere.position.y < -board.size / 2 + board.thickness &&
	paddle4_att.dead === false
	) {
	gameInfo.p4Lives--;
	if (gameInfo.p4Lives == 0) {
		paddle4_att.dead = true;
		scene.remove(paddle4);
		gameInfo.player_count--
	}
	// countDownDone = false
	initGame();
	}
	if(gameInfo.player_count === 1)
		gameInfo.gameover = true
}

function sideRebound() {
	if (
	sphere.position.y < -board.size / 2 + board.thickness &&
	paddle4_att.dead === true
	) {
	ball_att.dirY = 1;
	}
	if (
	sphere.position.y > board.size / 2 - board.thickness &&
	paddle3_att.dead === true
	) {
	ball_att.dirY = -1;
	}
	if (
	sphere.position.x < -board.size / 2 + board.thickness &&
	paddle1_att.dead === true
	) {
	ball_att.dirX = 1;
	}
	if (
	sphere.position.x > board.size / 2 - board.thickness &&
	paddle2_att.dead === true
	) {
	ball_att.dirX = -1;
	}
}

function paddleColision() {
	if (
	paddle1_att.dead === false &&
	sphere.position.x - board.thickness <=
		paddle1.position.x + board.thickness / 2 &&
	sphere.position.y <= paddle1.position.y + paddle1_att.height / 2 &&
	sphere.position.y >= paddle1.position.y - paddle1_att.height / 2
	) {
	changeAngle();
	ball_att.dirX = 1;
	level += level_inc;
	}
	if (
	paddle2_att.dead === false &&
	sphere.position.x + board.thickness >=
	paddle2.position.x - board.thickness / 2 &&
	sphere.position.y <= paddle2.position.y + paddle2_att.height / 2 &&
	sphere.position.y >= paddle2.position.y - paddle2_att.height / 2
	) {
	changeAngle();
	ball_att.dirX = -1;
	level += level_inc;
	}
	if (
		paddle3_att.dead === false &&
		sphere.position.y + board.thickness >=
		paddle3.position.y - board.thickness / 2 &&
		sphere.position.x <= paddle3.position.x + paddle3_att.width / 2 &&
		sphere.position.x >= paddle3.position.x - paddle3_att.width / 2
	) {
	changeAngle();
	ball_att.dirY = -1;
	level += level_inc;
	}
	if (
		paddle4_att.dead === false &&
		sphere.position.y - board.thickness <=
		paddle4.position.y + board.thickness / 2 &&
		sphere.position.x <= paddle4.position.x + paddle3_att.width / 2 &&
		sphere.position.x >= paddle4.position.x - paddle4_att.width / 2
	) {
	changeAngle();
	ball_att.dirY = 1;
	level -= level_inc;
	}
}

function controlDetection() {
	if (
	control.w === true &&
	paddle1.position.y <
		board.size / 2 - paddle1_att.height / 2 - board.thickness * 2.5
	)
	paddle1.position.y += 4;
	if (
	control.s === true &&
	paddle1.position.y >
		-board.size / 2 + paddle1_att.height / 2 + board.thickness * 2.5
	)
	paddle1.position.y -= 4;

	if (
	control.d === true &&
	paddle3.position.x <
		board.size / 2 - paddle3_att.width / 2 - board.thickness * 2.5
	)
	paddle3.position.x += 4;
	if (
	control.a === true &&
	paddle3.position.x >
		-board.size / 2 + paddle3_att.width / 2 + board.thickness * 2.5
	)
	paddle3.position.x -= 4;

	if (
	control.arrowUp === true &&
	paddle2.position.y <
		board.size / 2 - paddle2_att.height / 2 - board.thickness * 2.5
	)
	paddle2.position.y += 4;
	if (
	control.arrowDown === true &&
	paddle2.position.y >
		-board.size / 2 + paddle2_att.height / 2 + board.thickness * 2.5
	)
	paddle2.position.y -= 4;

	if (
	control.arrowRight === true &&
	paddle4.position.x <
		board.size / 2 - paddle3_att.width / 2 - board.thickness * 2.5
	)
	paddle4.position.x += 4;
	if (
	control.arrowLeft === true &&
	paddle4.position.x >
		-board.size / 2 + paddle3_att.width / 2 + board.thickness * 2.5
	)
	paddle4.position.x -= 4;
}

document.addEventListener("keypress", (event) => {
	if (event.key === "v") changeView();
});

document.addEventListener("keydown", (event) => {
	if (event.key === "w") control.w = true;
	if (event.key === "s") control.s = true;
	if (event.key === "g") control.a = true;
	if (event.key === "h") control.d = true;
	if (event.key === "ArrowUp") control.arrowUp = true;
	if (event.key === "ArrowDown") control.arrowDown = true;
	if (event.key === "8") control.arrowLeft = true;
	if (event.key === "9") control.arrowRight = true;
});

document.addEventListener("keyup", (event) => {
	if (event.key === "w") control.w = false;
	if (event.key === "s") control.s = false;
	if (event.key === "g") control.a = false;
	if (event.key === "h") control.d = false;
	if (event.key === "ArrowUp") control.arrowUp = false;
	if (event.key === "ArrowDown") control.arrowDown = false;
	if (event.key === "8") control.arrowLeft = false;
	if (event.key === "9") control.arrowRight = false;
});

function changeView() {
	if (view === 0) {
	camera.position.set(0, 0, board.size * 2);
	camera.lookAt(0, 0, 0);
	view = 1;
	} else {
	camera.position.set(0, -1 * (board.size * 2), 300);
	camera.lookAt(0, 0, 0);
	view = 0;
	}
}

initGame();
function animate() {
	if (gameInfo.gameover === false && countDownDone === true) {
	controlDetection();
	ballPhysic();
	}
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
}, 500);
