import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {plane, ball, side1, side2, side3, side4,
	paddle1, paddle2, paddle3, paddle4, sky} from "./pong_obj.js"
import {boardVs4, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att, control, gameInfoVs4} from "./pong_var.js"
import {ballplight, ballplightHelper, p1light1, p1lightHelper1,
	p2light1, p2lightHelper1, p3light1, p3lightHelper1,
	p4light1, p4lightHelper1} from "./pong_light.js"
const board = boardVs4
const gameInfo = gameInfoVs4

setTimeout(() => {
	
	const p1ScoreTag = document.getElementById("p1Score")
	const p2ScoreTag = document.getElementById("p2Score")
	const p3ScoreTag = document.getElementById("p3Score")
	const p4ScoreTag = document.getElementById("p4Score")
	
	const navHeight = document.querySelector('nav').offsetHeight;
	const headerHeight = document.querySelector('header').offsetHeight;
	const footerHeight = document.querySelector('footer').offsetHeight;
	const canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1
	const canvas = document.querySelector("#game");
	
	const renderer = new THREE.WebGLRenderer({ canvas });
	
renderer.shadowMap.enabled = true;// voir ou le mettre

renderer.setSize(window.innerWidth, canvasHeight);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / canvasHeight, 0.1, 10000);
camera.position.set(0, -350, 700);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

function initGraphic(){
	let item_list = [paddle1, paddle2, paddle3, paddle4, ball,
		plane, side1, side2, side3, side4, p1light1, ballplight, 
		p2light1, p3light1, p4light1, sky]
	for(let i = 0; i < item_list.length; i++)
		scene.add(item_list[i])
}

function initHelpers(){
	let item_list = [p1lightHelper1, 
		p2lightHelper1, p3lightHelper1, p4lightHelper1, ballplightHelper]
	for(let i = 0; i < item_list.length; i++)
		scene.add(item_list[i])
}

function resetGame(){
	initGame()
	if(!scene.children.includes(paddle1)) {scene.add(paddle1)};
	if(!scene.children.includes(paddle2)) {scene.add(paddle2)};
	if(!scene.children.includes(paddle3)) {scene.add(paddle3)};
	if(!scene.children.includes(paddle4)) {scene.add(paddle4)};
	paddle1_att.dead = false
	paddle2_att.dead = false
	paddle3_att.dead = false
	paddle4_att.dead = false
	gameInfo.p1Lives = gameInfo.lives
	gameInfo.p2Lives = gameInfo.lives
	gameInfo.p3Lives = gameInfo.lives
	gameInfo.p4Lives = gameInfo.lives
	p1ScoreTag.textContent = gameInfo.p1Lives
	p2ScoreTag.textContent = gameInfo.p2Lives
	p3ScoreTag.textContent = gameInfo.p3Lives
	p4ScoreTag.textContent = gameInfo.p4Lives
	gameInfo.player_count = 4
	gameInfo.gameover = false
	camera.position.set(0, -400, 375)
	camera.lookAt(0, -75, 0)
}

  function initGame() {
    ball.position.x = 0;
    ball.position.y = 0;
    paddle1.position.y = 0;
    paddle2.position.y = 0;
    paddle3.position.x = 0;
    paddle4.position.x = 0;
    ballplight.position.set(0, 0, board.thickness);
    gameInfo.level = 4;
    randomStartDir();
    changeAngle();
    if (gameInfo.countDownDone === false) countDown();
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
    if (Math.random() <= 0.5) ball_att.dirX = 1;
    else ball_att.dirX = -1;
    if (Math.random() <= 0.5) ball_att.dirY = 1;
    else ball_att.dirY = -1;
  }

  function changeAngle() {
    let rand = Math.random();
    ball_att.speedX = rand * gameInfo.level;
    ball_att.speedY = gameInfo.level - rand;
    /* console.log(rand);
		console.log(ball_att.speedX);
		console.log(ball_att.speedY); */
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
    if (
      ball.position.x < -board.size / 2 + board.thickness &&
      paddle1_att.dead === false
    ) {
      gameInfo.p1Lives--;
      p1ScoreTag.textContent = gameInfo.p1Lives;
      if (gameInfo.p1Lives == 0) {
        paddle1_att.dead = true;
        scene.remove(paddle1);
        gameInfo.player_count--;
      }
      gameInfo.countDownDone = false;
      initGame();
    }
    if (
      ball.position.x > board.size / 2 - board.thickness &&
      paddle2_att.dead === false
    ) {
      gameInfo.p2Lives--;
      p2ScoreTag.textContent = gameInfo.p2Lives;
      if (gameInfo.p2Lives == 0) {
        paddle2_att.dead = true;
        scene.remove(paddle2);
        gameInfo.player_count--;
      }
      gameInfo.countDownDone = false;
      initGame();
    }
    if (
      ball.position.y > board.size / 2 - board.thickness &&
      paddle3_att.dead === false
    ) {
      gameInfo.p3Lives--;
      p3ScoreTag.textContent = gameInfo.p3Lives;
      if (gameInfo.p3Lives == 0) {
        paddle3_att.dead = true;
        scene.remove(paddle3);
        gameInfo.player_count--;
      }
      gameInfo.countDownDone = false;
      initGame();
    }
    if (
      ball.position.y < -board.size / 2 + board.thickness &&
      paddle4_att.dead === false
    ) {
      gameInfo.p4Lives--;
      p4ScoreTag.textContent = gameInfo.p4Lives;
      if (gameInfo.p4Lives == 0) {
        paddle4_att.dead = true;
        scene.remove(paddle4);
        gameInfo.player_count--;
      }
      gameInfo.countDownDone = false;
      initGame();
    }
    if (gameInfo.player_count === 1) gameInfo.gameover = true;
  }

  function sideRebound() {
    if (
      ball.position.y < -board.size / 2 + board.thickness &&
      paddle4_att.dead === true
    ) {
      ball_att.dirY = 1;
    }
    if (
      ball.position.y > board.size / 2 - board.thickness &&
      paddle3_att.dead === true
    ) {
      ball_att.dirY = -1;
    }
    if (
      ball.position.x < -board.size / 2 + board.thickness &&
      paddle1_att.dead === true
    ) {
      ball_att.dirX = 1;
    }
    if (
      ball.position.x > board.size / 2 - board.thickness &&
      paddle2_att.dead === true
    ) {
      ball_att.dirX = -1;
    }
  }

  function paddleColision() {
    if (
      paddle1_att.dead === false &&
      ball.position.x - board.thickness <=
        paddle1.position.x + board.thickness / 2 &&
      ball.position.y <= paddle1.position.y + paddle1_att.height / 2 &&
      ball.position.y >= paddle1.position.y - paddle1_att.height / 2
    ) {
      changeAngle();
      ball_att.dirX = 1;
      gameInfo.level += gameInfo.level_inc;
    }
    if (
      paddle2_att.dead === false &&
      ball.position.x + board.thickness >=
        paddle2.position.x - board.thickness / 2 &&
      ball.position.y <= paddle2.position.y + paddle2_att.height / 2 &&
      ball.position.y >= paddle2.position.y - paddle2_att.height / 2
    ) {
      changeAngle();
      ball_att.dirX = -1;
      gameInfo.level += gameInfo.level_inc;
    }
    if (
      paddle3_att.dead === false &&
      ball.position.y + board.thickness >=
        paddle3.position.y - board.thickness / 2 &&
      ball.position.x <= paddle3.position.x + paddle3_att.width / 2 &&
      ball.position.x >= paddle3.position.x - paddle3_att.width / 2
    ) {
      changeAngle();
      ball_att.dirY = -1;
      gameInfo.level += gameInfo.level_inc;
    }
    if (
      paddle4_att.dead === false &&
      ball.position.y - board.thickness <=
        paddle4.position.y + board.thickness / 2 &&
      ball.position.x <= paddle4.position.x + paddle3_att.width / 2 &&
      ball.position.x >= paddle4.position.x - paddle4_att.width / 2
    ) {
      changeAngle();
      ball_att.dirY = 1;
      gameInfo.level -= gameInfo.level_inc;
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
		if (event.key === "k") {
		// renderer.setAnimationLoop(null);
			}
	if (event.key === "l") {
		resetGame()
	}
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

function animate() {
	if (gameInfo.gameover === false && gameInfo.countDownDone === true) {
	controlDetection();
	ballPhysic();
	}
	renderer.render(scene, camera);
		// console.log("running")
}

function runGame(){
	initGraphic()
	initHelpers()
	resetGame();
// canvas.appendChild(renderer.domElement);
	renderer.setAnimationLoop(animate);
	}
runGame()

}, 500);
