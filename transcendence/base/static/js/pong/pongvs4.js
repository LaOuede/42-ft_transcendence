import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {
  plane,
  ball,
  side1,
  side2,
  side3,
  side4,
  paddle1,
  paddle2,
  paddle3,
  paddle4,
  sky,
} from "./pong_obj.js";
import {
  boardVs4,
  ball_att,
  paddle1_att,
  paddle2_att,
  paddle3_att,
  paddle4_att,
  control,
  gameInfoVs4,
} from "./pong_var.js";
import {
  ballplight,
  ballplightHelper,
  p1light1,
  p1lightHelper1,
  p2light1,
  p2lightHelper1,
  p3light1,
  p3lightHelper1,
  p4light1,
  p4lightHelper1,
  backLight1,
  backLight2,
  backLight3,
  backLight4,
} from "./pong_light.js";
const board = boardVs4;
const gameInfo = gameInfoVs4;
let reboundx = true;
let reboundy = true;
let demoCam = false;
let camDemoDirX = 1;
let camDemoDirY = 1;
let paddle1limit = 2.5;
let paddle2limit = 2.5;
let paddle3limit = 2.5;
let paddle4limit = 2.5;
let demoRunning = false;

const p1ScoreTag = document.getElementById("p1Score");
const p2ScoreTag = document.getElementById("p2Score");
const p3ScoreTag = document.getElementById("p3Score");
const p4ScoreTag = document.getElementById("p4Score");

const p1Info = document.getElementById("playerInfo1");
const p2Info = document.getElementById("playerInfo2");
const p3Info = document.getElementById("playerInfo3");
const p4Info = document.getElementById("playerInfo4");

let navHeight = document.querySelector("nav").offsetHeight;
let masterHeight = document.querySelector(".master").offsetHeight;
let masterWidth = document.querySelector(".master").offsetWidth;
// let headerHeight = document.querySelector('header').offsetHeight;
// let footerHeight = document.querySelector('footer').offsetHeight;
let canvasHeight = masterHeight - navHeight;
const canvas = document.querySelector("#game");

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.shadowMap.enabled = true; // voir ou le mettre

renderer.setSize(masterWidth - 20, canvasHeight);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  (masterWidth - 20) / canvasHeight,
  0.1,
  500000
);
camera.position.set(0, -350, 700);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

function initGraphic() {
  let item_list = [
    paddle1,
    paddle2,
    paddle3,
    paddle4,
    ball,
    plane,
    side1,
    side2,
    side3,
    side4,
    p1light1,
    ballplight,
    p2light1,
    p3light1,
    p4light1,
    sky,
    backLight1,
    backLight2,
    backLight3,
    backLight4,
  ];
  for (let i = 0; i < item_list.length; i++) scene.add(item_list[i]);
}

function initHelpers() {
  let item_list = [
    p1lightHelper1,
    p2lightHelper1,
    p3lightHelper1,
    p4lightHelper1,
    ballplightHelper,
  ];
  for (let i = 0; i < item_list.length; i++) scene.add(item_list[i]);
}

function resetGameOverV2() {
  demoRunning = false;
  gameInfo.countDownDone = false;
  defaultPosition();
  if (!scene.children.includes(paddle1)) {
    scene.add(paddle1);
  }
  if (!scene.children.includes(paddle2)) {
    scene.add(paddle2);
  }
  if (scene.children.includes(paddle3)) {
    scene.remove(paddle3);
  }
  if (scene.children.includes(paddle4)) {
    scene.remove(paddle4);
  }
  if (scene.children.includes(p3light1)) {
    scene.remove(p3light1);
  }
  if (scene.children.includes(p4light1)) {
    scene.remove(p4light1);
  }
  p1light1.distance = 800;
  p2light1.distance = 800;
  paddle1_att.dead = false;
  paddle2_att.dead = false;
  paddle3_att.dead = true;
  paddle4_att.dead = true;
  paddle1limit = 0;
  paddle2limit = 0;
  paddle3limit = 0;
  paddle4limit = 0;
  gameInfo.p1Lives = gameInfo.lives;
  gameInfo.p2Lives = gameInfo.lives;
  gameInfo.p3Lives = gameInfo.lives;
  gameInfo.p4Lives = gameInfo.lives;
  p1ScoreTag.textContent = gameInfo.p1Lives;
  p2ScoreTag.textContent = gameInfo.p2Lives;
  p3ScoreTag.textContent = gameInfo.p3Lives;
  p4ScoreTag.textContent = gameInfo.p4Lives;
  gameInfo.player_count = 2;
  gameInfo.gameover = false;
  camera.position.set(0, -400, 375);
  camera.lookAt(0, -75, 0);
}

function resetGameOverV4() {
  demoRunning = false;
  gameInfo.countDownDone = false;
  defaultPosition();
  if (!scene.children.includes(paddle1)) {
    scene.add(paddle1);
  }
  if (!scene.children.includes(paddle2)) {
    scene.add(paddle2);
  }
  if (!scene.children.includes(paddle3)) {
    scene.add(paddle3);
  }
  if (!scene.children.includes(paddle4)) {
    scene.add(paddle4);
  }
  if (!scene.children.includes(p3light1)) {
    scene.add(p3light1);
  }
  if (!scene.children.includes(p4light1)) {
    scene.add(p4light1);
  }
  p1light1.distance = 400;
  p2light1.distance = 400;
  paddle1limit = 2.5;
  paddle2limit = 2.5;
  paddle3limit = 2.5;
  paddle4limit = 2.5;
  paddle1_att.dead = false;
  paddle2_att.dead = false;
  paddle3_att.dead = false;
  paddle4_att.dead = false;
  gameInfo.p1Lives = gameInfo.lives;
  gameInfo.p2Lives = gameInfo.lives;
  gameInfo.p3Lives = gameInfo.lives;
  gameInfo.p4Lives = gameInfo.lives;
  p1ScoreTag.textContent = gameInfo.p1Lives;
  p2ScoreTag.textContent = gameInfo.p2Lives;
  p3ScoreTag.textContent = gameInfo.p3Lives;
  p4ScoreTag.textContent = gameInfo.p4Lives;
  gameInfo.player_count = 4;
  gameInfo.gameover = false;
  camera.position.set(0, -400, 375);
  camera.lookAt(0, -75, 0);
}

function resetGameDemo() {
  if (demoRunning === false) {
    demoRunning = true;
    gameInfo.countDownDone = false;
    defaultPosition();
    if (scene.children.includes(paddle1)) {
      scene.remove(paddle1);
    }
    if (scene.children.includes(paddle2)) {
      scene.remove(paddle2);
    }
    if (scene.children.includes(paddle3)) {
      scene.remove(paddle3);
    }
    if (scene.children.includes(paddle4)) {
      scene.remove(paddle4);
    }
    if (scene.children.includes(p3light1)) {
      scene.remove(p3light1);
    }
    if (scene.children.includes(p4light1)) {
      scene.remove(p4light1);
    }
    p2light1.color.set("#249DC6");
    p1light1.color.set("#69327A");
    p1light1.distance = 800;
    p2light1.distance = 800;
    paddle1_att.dead = true;
    paddle2_att.dead = true;
    paddle3_att.dead = true;
    paddle4_att.dead = true;
    gameInfo.p1Lives = gameInfo.lives;
    gameInfo.p2Lives = gameInfo.lives;
    gameInfo.p3Lives = gameInfo.lives;
    gameInfo.p4Lives = gameInfo.lives;
    p1ScoreTag.textContent = gameInfo.p1Lives;
    p2ScoreTag.textContent = gameInfo.p2Lives;
    p3ScoreTag.textContent = gameInfo.p3Lives;
    p4ScoreTag.textContent = gameInfo.p4Lives;
    gameInfo.player_count = 0;
    gameInfo.gameover = false;
    camera.position.set(0, 0, 750);
    camera.lookAt(0, 0, 0);
  }
}

function defaultPosition() {
  //vs2 et vs4
  ball.position.x = 0;
  ball.position.y = 0;
  paddle1.position.y = 0;
  paddle2.position.y = 0;
  paddle3.position.x = 0;
  paddle4.position.x = 0;
  ballplight.position.set(0, 0, board.thickness);
  gameInfo.level = 1.5;
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
  //vs2 et vs4
  if (Math.random() <= 0.5) ball_att.dirX = 1;
  else ball_att.dirX = -1;
  if (Math.random() <= 0.5) ball_att.dirY = 1;
  else ball_att.dirY = -1;
}

function changeAngle() {
  //vs2 et vs4
  let rand = Math.random();
  ball_att.speedX = rand * gameInfo.level + 1;
  ball_att.speedY = gameInfo.level - rand + 1;
}

function ballPhysic() {
  //vs2 et vs4
  moveBall();
  sideRebound();
  paddleColision();
  goalDetection();
}

function moveBall() {
  //vs2 et vs4
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
    paddle1_att.dead === false
  ) {
    gameInfo.p1Lives--;
    p1ScoreTag.textContent = gameInfo.p1Lives;
    if (gameInfo.p1Lives == 0) {
      paddle1_att.dead = true;
      paddle1limit = 0;
      scene.remove(paddle1);
      gameInfo.player_count--;
    }
    gameInfo.countDownDone = false;
    defaultPosition();
  }
  if (
    ball.position.x > board.size / 2 - board.thickness &&
    paddle2_att.dead === false
  ) {
    gameInfo.p2Lives--;
    p2ScoreTag.textContent = gameInfo.p2Lives;
    if (gameInfo.p2Lives == 0) {
      paddle2_att.dead = true;
      paddle2limit = 0;
      scene.remove(paddle2);
      gameInfo.player_count--;
    }
    gameInfo.countDownDone = false;
    defaultPosition();
  }
  if (
    ball.position.y > board.size / 2 - board.thickness &&
    paddle3_att.dead === false
  ) {
    gameInfo.p3Lives--;
    p3ScoreTag.textContent = gameInfo.p3Lives;
    if (gameInfo.p3Lives == 0) {
      paddle3_att.dead = true;
      paddle3limit = 0;
      scene.remove(paddle3);
      gameInfo.player_count--;
    }
    gameInfo.countDownDone = false;
    defaultPosition();
  }
  if (
    ball.position.y < -board.size / 2 + board.thickness &&
    paddle4_att.dead === false
  ) {
    gameInfo.p4Lives--;
    p4ScoreTag.textContent = gameInfo.p4Lives;
    if (gameInfo.p4Lives == 0) {
      paddle4_att.dead = true;
      paddle4limit = 0;
      scene.remove(paddle4);
      gameInfo.player_count--;
    }
    gameInfo.countDownDone = false;
    defaultPosition();
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
  const maxlevel = 6;
  if (
    paddle1_att.dead === false &&
    ball.position.x - board.thickness <=
      paddle1.position.x + board.thickness / 2 + 2 &&
    ball.position.x - board.thickness >=
      paddle1.position.x + board.thickness / 2 - 8 &&
    ball.position.y <= paddle1.position.y + paddle1_att.height / 2 &&
    ball.position.y >= paddle1.position.y - paddle1_att.height / 2
  ) {
    if (reboundx === true) {
      changeAngle();
      ball_att.dirX = 1;
      if (gameInfo.level < maxlevel) gameInfo.level += gameInfo.level_inc;
    }
    reboundx = false;
  }
  if (
    paddle2_att.dead === false &&
    ball.position.x + board.thickness >=
      paddle2.position.x - board.thickness / 2 - 2 &&
    ball.position.x + board.thickness <=
      paddle2.position.x - board.thickness / 2 + 8 &&
    ball.position.y <= paddle2.position.y + paddle2_att.height / 2 &&
    ball.position.y >= paddle2.position.y - paddle2_att.height / 2
  ) {
    if (reboundx === true) {
      changeAngle();
      ball_att.dirX = -1;
      if (gameInfo.level < maxlevel) gameInfo.level += gameInfo.level_inc;
    }
    reboundx = false;
  }
  if (
    paddle3_att.dead === false &&
    ball.position.y + board.thickness >=
      paddle3.position.y - board.thickness / 2 - 2 &&
    ball.position.y + board.thickness <=
      paddle3.position.y - board.thickness / 2 + 8 &&
    ball.position.x <= paddle3.position.x + paddle3_att.width / 2 &&
    ball.position.x >= paddle3.position.x - paddle3_att.width / 2
  ) {
    if (reboundy === true) {
      changeAngle();
      ball_att.dirY = -1;
      if (gameInfo.level < maxlevel) gameInfo.level += gameInfo.level_inc;
    }
    reboundy = false;
  }
  if (
    paddle4_att.dead === false &&
    ball.position.y - board.thickness <=
      paddle4.position.y + board.thickness / 2 + 2 &&
    ball.position.y - board.thickness >=
      paddle4.position.y + board.thickness / 2 - 8 &&
    ball.position.x <= paddle4.position.x + paddle4_att.width / 2 &&
    ball.position.x >= paddle4.position.x - paddle4_att.width / 2
  ) {
    if (reboundy === true) {
      changeAngle();
      ball_att.dirY = 1;
      if (gameInfo.level < maxlevel) gameInfo.level += gameInfo.level_inc;
    }

    reboundy = false;
  }
  if (ball.position.y <= 10 && ball.position.y >= -10) reboundy = true;
  if (ball.position.x <= 10 && ball.position.x >= -10) reboundx = true;
}

function controlDetection() {
  //vs2 et vs4
  const paddleSpeed = 6;
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
    stopGame();
  }
  if (event.key === "j") {
    playGameV4();
  }
  if (event.key === "o") {
    playGameV2();
  }
  if (event.key === "l") {
    playDemo();
  }
  if (event.key === "1") {
    lightColorSwitch(3, "#ff55ff");
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

// window.addEventListener("resize", () => {

// 	navHeight = document.querySelector('nav').offsetHeight;
// 	headerHeight = document.querySelector('header').offsetHeight;
// 	footerHeight = document.querySelector('footer').offsetHeight;
// 	canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1

// 	camera.aspect = window.innerWidth / canvasHeight
// 	camera.updateProjectionMatrix()
// 	renderer.setSize(window.innerWidth, canvasHeight)
// });

function changeView() {
  //vs2 et vs4
  if (gameInfo.view === 0) {
    camera.position.set(0, 0, board.size * 2);
    camera.lookAt(0, 0, 0);
    gameInfo.view = 1;
  } else {
    camera.position.set(0, -400, 375);
    camera.lookAt(0, -75, 0);
    gameInfo.view = 0;
  }
}

function demoCamPlay() {
  if (camera.position.x < -400) camDemoDirX = 1;
  else if (camera.position.x > 400) camDemoDirX = -1;
  if (camera.position.y < -210) camDemoDirY = 1;
  else if (camera.position.y > 210) camDemoDirY = -1;
  camera.position.x += 0.4 * camDemoDirX;
  // camera.position.y += (0.1 * camDemoDirY)
  camera.lookAt(0, 0, 0);
}

function camLimiter() {
  if (camera.position.length() > 10000) {
    camera.position.setLength(10000);
  }
  if (camera.position.length() < 200) {
    camera.position.setLength(200);
  }
  camera.updateProjectionMatrix();
}

function animate() {
  //vs2 et vs4
  if (gameInfo.gameover === false && gameInfo.countDownDone === true) {
    controlDetection();
    ballPhysic();
  }
  camLimiter();
  renderer.render(scene, camera);
  if (demoCam) demoCamPlay();
  // console.log("running")
}

function lightColorSwitch(player, color) {
  const lights = [p1light1, p2light1, p3light1, p4light1];
  const pInfos = [p1Info, p2Info, p3Info, p4Info];
  lights[player - 1].color.set(color);
  pInfos[player - 1].style.backgroundColor = color + "66";
}

function showPlayerInfoV4() {
  p1Info.style.display = "block";
  p2Info.style.display = "block";
  p3Info.style.display = "block";
  p4Info.style.display = "block";
}

function showPlayerInfoV2() {
  p1Info.style.display = "block";
  p2Info.style.display = "block";
  p3Info.style.display = "none";
  p4Info.style.display = "none";
}

function hidePlayerInfo() {
  p1Info.style.display = "none";
  p2Info.style.display = "none";
  p3Info.style.display = "none";
  p4Info.style.display = "none";
}

function initGame() {
  initGraphic();
  // initHelpers()
  // resetGameOverV4()
}

function playGameV2() {
  showPlayerInfoV2();
  resetGameOverV2();
  demoCam = false;
  gameInfo.countDownDone = false;
  renderer.setAnimationLoop(animate);
}

function playGameV4() {
  showPlayerInfoV4();
  resetGameOverV4();
  demoCam = false;
  gameInfo.countDownDone = false;
  renderer.setAnimationLoop(animate);
}

function playDemo() {
  hidePlayerInfo();
  demoCam = true;
  resetGameDemo();
  renderer.setAnimationLoop(animate);
}

function stopGame() {
  demoCam = false;
  renderer.setAnimationLoop(null);
}
initGame();

export { playGameV2, playGameV4, stopGame, playDemo };
