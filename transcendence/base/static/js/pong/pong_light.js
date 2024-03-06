import * as THREE from "three";

import {board, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att, control, gameInfo} from "./pong_var.js"

const light_prim_intense = 1.15
const light_prim_distance = 400

const backLight1 = new THREE.PointLight(0x704478, 0.9, 2000)
backLight1.position.set(500, 500, -200)
const backLight2 = new THREE.PointLight(0x704478, 0.9, 2000)
backLight2.position.set(-500, 500, -200)
const backLight3 = new THREE.PointLight(0x704478, 0.9, 2000)
backLight3.position.set(-500, -500, -200)
const backLight4 = new THREE.PointLight(0x704478, 0.9, 2000)
backLight4.position.set(500, -500, -200)

//BALL
const ballplight = new THREE.PointLight(0xeeeeee, 0.8, 100);
ballplight.position.set(0, 0, board.thickness);
const ballplightHelper = new THREE.PointLightHelper(ballplight);
ballplight.castShadow = true;

//PLAYER 1
//LIGHT 1
const p1light = new THREE.PointLight(paddle1_att.light_color, light_prim_intense, light_prim_distance);
p1light.position.set(board.size / -3, 0, 100);
const p1lightHelper1 = new THREE.PointLightHelper(p1light);
// p1light.castShadow = true

//PLAYER 2
//LIGHT 1
const p2light = new THREE.PointLight(paddle2_att.light_color, light_prim_intense, light_prim_distance);
p2light.position.set(board.size / 3, 0, 100);
const p2lightHelper1 = new THREE.PointLightHelper(p2light);
// p2light.castShadow = true

//PLAYER 3
//LIGHT 1
const p3light = new THREE.PointLight(paddle3_att.light_color, light_prim_intense, light_prim_distance);
p3light.position.set(0, board.size / 3, 100);
const p3lightHelper1 = new THREE.PointLightHelper(p3light);
// p3light.castShadow = true

//PLAYER 4
//LIGHT 1
const p4light = new THREE.PointLight(paddle4_att.light_color, light_prim_intense, light_prim_distance);
p4light.position.set(0, board.size / -3, 100);
const p4lightHelper1 = new THREE.PointLightHelper(p4light);
// p4light.castShadow = true

export {ballplight, ballplightHelper, p1light, p1lightHelper1,
	p2light, p2lightHelper1, p3light, p3lightHelper1,
	p4light, p4lightHelper1, backLight1, backLight2, backLight3, backLight4};