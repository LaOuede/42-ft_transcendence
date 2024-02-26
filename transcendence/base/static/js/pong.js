import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let vs4 = true;
let board = { width: 350, height: 250, thickness: 10 };
let paddle1_att = {
  x: -board.width / 2 + board.thickness * 2,
  y: 0,
  width: board.thickness,
  height: 75,
  light_color: 0x0000ff,
};
let paddle2_att = {
  x: board.width / 2 - board.thickness * 2,
  y: 0,
  width: board.thickness,
  height: 75,
  light_color: 0xff0000,
};
let control = { w: false, s: false, arrowUp: false, arrowDown: false };
let ball_att = { x: 0, y: 0, dirX: 1, dirY: -1, speedX: 1, speedY: 0 };
let gameInfo = { p1Score: 0, p2Score: 0, gameover: false };
let countDownDone = false;
let view = 0;
let level = 0;

setTimeout(() => {
  const renderer = new THREE.WebGLRenderer();

  renderer.shadowMap.enabled = true;

  const canvas = document.querySelector("#content #root #pong");
  const parentDiv = document.querySelector("#content #root");
  renderer.setSize(1000, 1000);
  canvas.appendChild(renderer.domElement);

  // document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1000 / 1000, 0.1, 10000);
  camera.position.set(0, 0, 500);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();

  // const axesHelper = new THREE.AxesHelper(5)
  // scene.add(axesHelper)

  //plane
  const planeGeometry = new THREE.PlaneGeometry(
    board.width + 2,
    board.height + 2
  );
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

  const ballplight = new THREE.PointLight(0xeeeeee, 200, 1000);
  ballplight.position.set(0, 0, board.thickness);
  scene.add(ballplight);
  const ballplightHelper = new THREE.PointLightHelper(ballplight);
  ballplight.castShadow = true;
  scene.add(ballplightHelper);

  const p2light1 = new THREE.PointLight(paddle2_att.light_color, 200, 1000);
  p2light1.position.set(board.width / 4, 0, 100);
  scene.add(p2light1);
  const p2lightHelper1 = new THREE.PointLightHelper(p2light1);
  p2light1.castShadow = true;
  scene.add(p2lightHelper1);

  const p2light2 = new THREE.PointLight(paddle2_att.light_color, 200, 1000);
  p2light2.position.set(375, -300, -200);
  scene.add(p2light2);
  const p2lightHelper2 = new THREE.PointLightHelper(p2light2);
  p2light2.castShadow = true;
  scene.add(p2lightHelper2);

  const p2light3 = new THREE.PointLight(paddle2_att.light_color, 200, 1000);
  p2light3.position.set(375, 300, -200);
  scene.add(p2light3);
  const p2lightHelper3 = new THREE.PointLightHelper(p2light3);
  p2light3.castShadow = true;
  scene.add(p2lightHelper3);

  const p1light1 = new THREE.PointLight(paddle1_att.light_color, 200, 1000);
  p1light1.position.set(board.width / -4, 0, 100);
  scene.add(p1light1);
  const p1lightHelper1 = new THREE.PointLightHelper(p1light1);
  p1light1.castShadow = true;
  scene.add(p1lightHelper1);

  const p1light2 = new THREE.PointLight(paddle1_att.light_color, 200, 1000);
  p1light2.position.set(-375, -300, -200);
  scene.add(p1light2);
  const p1lightHelper2 = new THREE.PointLightHelper(p1light2);
  p1light2.castShadow = true;
  scene.add(p1lightHelper2);

  const p1light3 = new THREE.PointLight(paddle1_att.light_color, 200, 1000);
  p1light3.position.set(-375, 300, -200);
  scene.add(p1light3);
  const p1lightHelper3 = new THREE.PointLightHelper(p1light3);
  p1light3.castShadow = true;
  scene.add(p1lightHelper3);

  // const textureLoader = new THREE.TextureLoader()

  // BALL
  const sphereGeometry = new THREE.SphereGeometry(board.thickness, 64, 64);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = false;
  sphere.position.set(ball_att.x, ball_att.y, board.thickness);
  scene.add(sphere);

  //RED 0x00FF00
  const side1geometry = new THREE.BoxGeometry(
    board.width + board.thickness * 2,
    board.thickness,
    board.thickness * 2
  );
  const side1material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const side1 = new THREE.Mesh(side1geometry, side1material);
  side1.position.set(
    0,
    -board.height / 2 - board.thickness / 2,
    board.thickness
  );
  side1.receiveShadow = true;
  scene.add(side1);

  //GREEN
  const side2geometry = new THREE.BoxGeometry(
    board.width + board.thickness * 2,
    board.thickness,
    board.thickness * 2
  );
  const side2material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const side2 = new THREE.Mesh(side2geometry, side2material);
  side2.position.set(
    0,
    board.height / 2 + board.thickness / 2,
    board.thickness
  );
  side2.receiveShadow = true;
  scene.add(side2);

  //BLUE
  const side3geometry = new THREE.BoxGeometry(
    board.thickness,
    board.height,
    board.thickness * 2
  );
  const side3material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const side3 = new THREE.Mesh(side3geometry, side3material);
  side3.position.set(board.width / 2 + board.thickness / 2, 0, board.thickness);
  side3.receiveShadow = true;
  scene.add(side3);

  // //PINK
  const side4geometry = new THREE.BoxGeometry(
    board.thickness,
    board.height,
    board.thickness * 2
  );
  const side4material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const side4 = new THREE.Mesh(side4geometry, side4material);
  side4.position.set(
    -board.width / 2 - board.thickness / 2,
    0,
    board.thickness
  );
  side4.receiveShadow = true;

  scene.add(side4);

  //PADDLE1
  const paddle1geometry = new THREE.BoxGeometry(
    board.thickness,
    paddle1_att.height,
    board.thickness
  );
  const paddle1material = new THREE.MeshPhongMaterial({
    color: 0x88aa00,
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
    color: 0x88aa00,
    shininess: 2000,
  });
  const paddle2 = new THREE.Mesh(paddle2geometry, paddle2material);
  paddle2.position.set(paddle2_att.x, 0, board.thickness);
  paddle2.castShadow = true;
  paddle2.receiveShadow = true;
  scene.add(paddle2);

  function initGame() {
    sphere.position.x = 0;
    sphere.position.y = 0;
    paddle1.position.y = 0;
    paddle2.position.y = 0;
    ballplight.position.set(0, 0, board.thickness);
    level = 0;
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
    if (Math.random() <= 0.5) ball_att.dirX = 1;
    else ball_att.dirX = -1;
    if (Math.random() <= 0.5) ball_att.dirY = 1;
    else ball_att.dirY = -1;
  }

  function changeAngle() {
    let rand = Math.random() * level;
    ball_att.speedX = rand + 2;
    ball_att.speedY = level - rand + 2;
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
    if (sphere.position.x < paddle1.position.x - board.thickness) {
      gameInfo.p2Score++;
      // p2ScoreTag.textContent = gameInfo.p2Score
      countDownDone = false;
      if (gameInfo.p2Score === 10) gameInfo.gameover = true;
      initGame();
    }
    if (sphere.position.x > paddle2.position.x + board.thickness) {
      gameInfo.p1Score++;
      // p1ScoreTag.textContent = gameInfo.p1Score
      countDownDone = false;
      if (gameInfo.p1Score === 10) gameInfo.gameover = true;
      initGame();
    }
  }

  function sideRebound() {
    if (sphere.position.y < -board.height / 2 + board.thickness) {
      ball_att.dirY = 1;
    }
    if (sphere.position.y > board.height / 2 - board.thickness) {
      ball_att.dirY = -1;
    }
  }

  function paddleColision() {
    if (
      sphere.position.x - board.thickness <=
        paddle1.position.x + board.thickness / 2 &&
      sphere.position.y <= paddle1.position.y + paddle1_att.height / 2 &&
      sphere.position.y >= paddle1.position.y - paddle1_att.height / 2
    ) {
      changeAngle();
      ball_att.dirX = 1;
      level += 0.25;
    }
    if (
      sphere.position.x + board.thickness >=
        paddle2.position.x - board.thickness / 2 &&
      sphere.position.y <= paddle2.position.y + paddle2_att.height / 2 &&
      sphere.position.y >= paddle2.position.y - paddle2_att.height / 2
    ) {
      changeAngle();
      ball_att.dirX = -1;
      level += 0.25;
    }
  }

  function controlDetection() {
    if (
      control.w === true &&
      paddle1.position.y < board.height / 2 - paddle1_att.height / 2
    )
      paddle1.position.y += 4;
    if (
      control.s === true &&
      paddle1.position.y > -board.height / 2 + paddle1_att.height / 2
    )
      paddle1.position.y -= 4;
    if (
      control.arrowUp === true &&
      paddle2.position.y < board.height / 2 - paddle2_att.height / 2
    )
      paddle2.position.y += 4;
    if (
      control.arrowDown === true &&
      paddle2.position.y > -board.height / 2 + paddle2_att.height / 2
    )
      paddle2.position.y -= 4;
  }

  document.addEventListener("keypress", (event) => {
    if (event.key === "v") changeView();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "w") control.w = true;
    if (event.key === "s") control.s = true;
    if (event.key === "ArrowUp") control.arrowUp = true;
    if (event.key === "ArrowDown") control.arrowDown = true;
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "w") control.w = false;
    if (event.key === "s") control.s = false;
    if (event.key === "ArrowUp") control.arrowUp = false;
    if (event.key === "ArrowDown") control.arrowDown = false;
  });

  function changeView() {
    if (view === 0) {
      camera.position.set(0, 0, board.height * 2);
      camera.lookAt(0, 0, 0);
      view = 1;
    } else {
      camera.position.set(0, -1 * (board.height * 2), 300);
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
}, 1000);
