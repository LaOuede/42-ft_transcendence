import * as THREE from "three";

import {board, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att, control, gameInfo} from "./pong_var.js"

export function initGraphic(){
	const scene = new THREE.Scene();
	
	//SKY
	const skyGeometry = new THREE.SphereGeometry(100000, 64, 64);
	const texture = new THREE.TextureLoader().load("../static/js/pong/nebuleuse.jpeg");
	const skyMaterial = new THREE.MeshBasicMaterial({ map: texture, side:THREE.BackSide});
	const sky = new THREE.Mesh(skyGeometry, skyMaterial);
	sky.rotateY(Math.PI * -0.5)
	sky.rotateZ(Math.PI)
	scene.add(sky)

	//PLANE
	const planeGeometry = new THREE.BoxGeometry(board.size + board.thickness * 2, board.size + board.thickness * 2, board.thickness);
	const planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.set(0 , 0, -board.thickness / 2)
	plane.receiveShadow = true;
	scene.add(plane)

	//SIDE1
	const side1geometry = new THREE.BoxGeometry(board.size + board.thickness * 2, board.thickness, board.thickness * 2);
	const side1material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side1 = new THREE.Mesh(side1geometry, side1material);
	side1.position.set(0, -board.size / 2 - board.thickness / 2, board.thickness);
	side1.receiveShadow = true;
	scene.add(side1)

	//SIDE2
	const side2geometry = new THREE.BoxGeometry(board.size + board.thickness * 2, board.thickness, board.thickness * 2);
	const side2material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side2 = new THREE.Mesh(side2geometry, side2material);
	side2.position.set(0, board.size / 2 + board.thickness / 2, board.thickness);
	side2.receiveShadow = true;
	scene.add(side2)

	//SIDE3
	const side3geometry = new THREE.BoxGeometry(board.thickness, board.size, board.thickness * 2);
	const side3material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side3 = new THREE.Mesh(side3geometry, side3material);
	side3.position.set(board.size / 2 + board.thickness / 2, 0, board.thickness);
	side3.receiveShadow = true;
	scene.add(side3)

	//SIDE4
	const side4geometry = new THREE.BoxGeometry(board.thickness, board.size, board.thickness * 2);
	const side4material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side4 = new THREE.Mesh(side4geometry, side4material);
	side4.position.set(-board.size / 2 - board.thickness / 2, 0, board.thickness);
	side4.receiveShadow = true;
	scene.add(side4)

	//BALL
	const ballGeometry = new THREE.SphereGeometry(board.thickness, 64, 64);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
	const ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.castShadow = false;
	ball.position.set(ball_att.x, ball_att.y, board.thickness);
	ball.name = "ball"
	scene.add(ball)
	
	//BALL LIGHT
	const ballplight = new THREE.PointLight(0xeeeeee, 0.8, 100);
	ballplight.position.set(0, 0, board.thickness);
	ballplight.castShadow = true;
	ballplight.name = "ballplight"
	scene.add(ballplight)

	//BACKLIGHTS
	const backLight1 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight1.position.set(500, 500, -200)
	scene.add(backLight1)
	
	const backLight2 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight2.position.set(-500, 500, -200)
	scene.add(backLight2)
	
	const backLight3 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight3.position.set(-500, -500, -200)
	scene.add(backLight3)
	
	const backLight4 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight4.position.set(500, -500, -200)
	scene.add(backLight4)

	const light_prim_intense = 1.15
	const light_prim_distance = 400

	//PLAYER 1
	//LIGHT 1
	const p1light = new THREE.PointLight(paddle1_att.light_color, light_prim_intense, light_prim_distance);
	p1light.position.set(board.size / -3, 0, 100);
	p1light.name = "p1light"
	scene.add(p1light)

	//PLAYER 2
	//LIGHT 1
	const p2light = new THREE.PointLight(paddle2_att.light_color, light_prim_intense, light_prim_distance);
	p2light.position.set(board.size / 3, 0, 100);
	p2light.name = "p2light"
	scene.add(p2light)

	//PLAYER 3
	//LIGHT 1
	const p3light = new THREE.PointLight(paddle3_att.light_color, light_prim_intense, light_prim_distance);
	p3light.position.set(0, board.size / 3, 100);
	p3light.name = "p3light"

	scene.add(p3light)

	//PLAYER 4
	//LIGHT 1
	const p4light = new THREE.PointLight(paddle4_att.light_color, light_prim_intense, light_prim_distance);
	p4light.position.set(0, board.size / -3, 100);
	p4light.name = "p4light"
	scene.add(p4light)

	//PADDLE1
	const paddle1geometry = new THREE.BoxGeometry(board.thickness, paddle1_att.height, board.thickness);
	const paddle1material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000,});
	const paddle1 = new THREE.Mesh(paddle1geometry, paddle1material);
	paddle1.position.set(paddle1_att.x, 0, board.thickness);
	paddle1.castShadow = true;
	paddle1.receiveShadow = true;
	paddle1.name = "paddle1"
	scene.add(paddle1)

	//PADDLE2
	const paddle2geometry = new THREE.BoxGeometry(board.thickness, paddle2_att.height, board.thickness);
	const paddle2material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	const paddle2 = new THREE.Mesh(paddle2geometry, paddle2material);
	paddle2.position.set(paddle2_att.x, 0, board.thickness);
	paddle2.castShadow = true;
	paddle2.receiveShadow = true;
	paddle2.name = "paddle2"
	scene.add(paddle2)

	//PADDLE3
	const paddle3geometry = new THREE.BoxGeometry( paddle3_att.width, board.thickness, board.thickness);
	const paddle3material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	const paddle3 = new THREE.Mesh(paddle3geometry, paddle3material);
	paddle3.position.set(0, paddle3_att.y, board.thickness);
	paddle3.castShadow = true;
	paddle3.receiveShadow = true;
	paddle3.name = "paddle3"
	scene.add(paddle3)

	//PADDLE4
	const paddle4geometry = new THREE.BoxGeometry(paddle4_att.width, board.thickness, board.thickness);
	const paddle4material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000});
	const paddle4 = new THREE.Mesh(paddle4geometry, paddle4material);
	paddle4.position.set(0, paddle4_att.y, board.thickness);
	paddle4.castShadow = true;
	paddle4.receiveShadow = true;
	paddle4.name = "paddle4"
	scene.add(paddle4)

	return scene
}