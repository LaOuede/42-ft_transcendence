import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {boardVs4, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att, control, gameInfoVs4} from "./pong_var.js"

const board = boardVs4
const light_prim_intense = 1.1
const light_prim_distance = 400

//BALL
const ballplight = new THREE.PointLight(0xeeeeee, 0.8, 100);
ballplight.position.set(0, 0, board.thickness);
const ballplightHelper = new THREE.PointLightHelper(ballplight);
ballplight.castShadow = true;

//PLAYER 1
//LIGHT 1
const p1light1 = new THREE.PointLight(paddle1_att.light_color, light_prim_intense, light_prim_distance);
p1light1.position.set(board.size / -4, 0, 100);
const p1lightHelper1 = new THREE.PointLightHelper(p1light1);
// p1light1.castShadow = true

//PLAYER 1
//LIGHT 2
// const p1light2 = new THREE.PointLight(paddle1_att.light_color, light_prim_intense, light_prim_distance * 2);
// p1light2.position.set(-board.size, 0, -150);
// const p1lightHelper2 = new THREE.PointLightHelper(p1light2);
// // p1light2.castShadow = true

//PLAYER 2
//LIGHT 1
const p2light1 = new THREE.PointLight(paddle2_att.light_color, light_prim_intense, light_prim_distance);
p2light1.position.set(board.size / 4, 0, 100);
const p2lightHelper1 = new THREE.PointLightHelper(p2light1);
// p2light1.castShadow = true

//PLAYER 2
//LIGHT 2
// const p2light2 = new THREE.PointLight(paddle2_att.light_color, 0.4, 10000);
// p2light2.position.set(375, -375, -200);
// const p2lightHelper2 = new THREE.PointLightHelper(p2light2);
// // p2light2.castShadow = true

//PLAYER 3
//LIGHT 1
const p3light1 = new THREE.PointLight(paddle3_att.light_color, light_prim_intense, light_prim_distance);
p3light1.position.set(0, board.size / 4, 100);
const p3lightHelper1 = new THREE.PointLightHelper(p3light1);
// p3light1.castShadow = true

//PLAYER 3
//LIGHT 2
// const p3light2 = new THREE.PointLight(paddle3_att.light_color, 0.4, 10000);
// p3light2.position.set(375, -375, -200);
// const p3lightHelper2 = new THREE.PointLightHelper(p3light2);
// // p3light2.castShadow = true

//PLAYER 4
//LIGHT 1
const p4light1 = new THREE.PointLight(paddle4_att.light_color, light_prim_intense, light_prim_distance);
p4light1.position.set(0, board.size / -4, 100);
const p4lightHelper1 = new THREE.PointLightHelper(p4light1);
// p4light1.castShadow = true

//PLAYER 4
//LIGHT 2
// const p4light2 = new THREE.PointLight(paddle4_att.light_color, 0.4, 10000);
// p4light2.position.set(375, -375, -200);
// const p4lightHelper2 = new THREE.PointLightHelper(p4light2);
// // p4light2.castShadow = true

export {ballplight, ballplightHelper, p1light1, p1lightHelper1,
	p2light1, p2lightHelper1, p3light1, p3lightHelper1,
	p4light1, p4lightHelper1};