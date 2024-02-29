import * as THREE from "three";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {boardVs4, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att} from "./pong_var.js"

const board = boardVs4

//PLANE
const planeGeometry = new THREE.PlaneGeometry(board.size + 2, board.size + 2);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

//BALL
const ballGeometry = new THREE.SphereGeometry(board.thickness, 64, 64);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.castShadow = false;
ball.position.set(ball_att.x, ball_att.y, board.thickness);

//SIDE1
const side1geometry = new THREE.BoxGeometry(
	board.size + board.thickness * 2,
	board.thickness,
	board.thickness * 2
);
const side1material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side1 = new THREE.Mesh(side1geometry, side1material);
side1.position.set(0, -board.size / 2 - board.thickness / 2, board.thickness);
side1.receiveShadow = true;

//SIDE2
const side2geometry = new THREE.BoxGeometry(
	board.size + board.thickness * 2,
	board.thickness,
	board.thickness * 2
);
const side2material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side2 = new THREE.Mesh(side2geometry, side2material);
side2.position.set(0, board.size / 2 + board.thickness / 2, board.thickness);
side2.receiveShadow = true;

//SIDE3
const side3geometry = new THREE.BoxGeometry(
	board.thickness,
	board.size,
	board.thickness * 2
);
const side3material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side3 = new THREE.Mesh(side3geometry, side3material);
side3.position.set(board.size / 2 + board.thickness / 2, 0, board.thickness);
side3.receiveShadow = true;

//SIDE4
const side4geometry = new THREE.BoxGeometry(
	board.thickness,
	board.size,
	board.thickness * 2
);
const side4material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const side4 = new THREE.Mesh(side4geometry, side4material);
side4.position.set(-board.size / 2 - board.thickness / 2, 0, board.thickness);
side4.receiveShadow = true;

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


export {plane, ball, side1, side2, side3, side4,
	paddle1, paddle2, paddle3, paddle4};