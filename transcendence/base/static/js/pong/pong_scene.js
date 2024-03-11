import * as THREE from "three";

import {gameInfo} from "./pong_var.js"

export function initSceneObjs(){
	
const sceneObjs = {
		scene: undefined,
		ball: undefined,
		ballplight: undefined,
		paddles: [undefined, undefined, undefined, undefined],
		lights: [undefined, undefined, undefined, undefined],
	}
	
	sceneObjs.scene = new THREE.Scene();
	
	//SKY
	const skyGeometry = new THREE.SphereGeometry(100000, 64, 64);
	const texture = new THREE.TextureLoader().load("../static/js/pong/nebuleuse.jpeg");
	const skyMaterial = new THREE.MeshBasicMaterial({ map: texture, side:THREE.BackSide});
	const sky = new THREE.Mesh(skyGeometry, skyMaterial);
	sky.rotateY(Math.PI * -0.5)
	sky.rotateZ(Math.PI)
	sceneObjs.scene.add(sky)

	//PLANE
	const planeGeometry = new THREE.BoxGeometry(gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness);
	const planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.set(0 , 0, -gameInfo.board_size.thickness / 2)
	plane.receiveShadow = true;
	sceneObjs.scene.add(plane)

	//SIDE1
	const side1geometry = new THREE.BoxGeometry(gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness, gameInfo.board_size.thickness * 2);
	const side1material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side1 = new THREE.Mesh(side1geometry, side1material);
	side1.position.set(0, -gameInfo.board_size.size / 2 - gameInfo.board_size.thickness / 2, gameInfo.board_size.thickness);
	side1.receiveShadow = true;
	sceneObjs.scene.add(side1)

	//SIDE2
	const side2geometry = new THREE.BoxGeometry(gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness, gameInfo.board_size.thickness * 2);
	const side2material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side2 = new THREE.Mesh(side2geometry, side2material);
	side2.position.set(0, gameInfo.board_size.size / 2 + gameInfo.board_size.thickness / 2, gameInfo.board_size.thickness);
	side2.receiveShadow = true;
	sceneObjs.scene.add(side2)

	//SIDE3
	const side3geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.size, gameInfo.board_size.thickness * 2);
	const side3material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side3 = new THREE.Mesh(side3geometry, side3material);
	side3.position.set(gameInfo.board_size.size / 2 + gameInfo.board_size.thickness / 2, 0, gameInfo.board_size.thickness);
	side3.receiveShadow = true;
	sceneObjs.scene.add(side3)

	//SIDE4
	const side4geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.size, gameInfo.board_size.thickness * 2);
	const side4material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side4 = new THREE.Mesh(side4geometry, side4material);
	side4.position.set(-gameInfo.board_size.size / 2 - gameInfo.board_size.thickness / 2, 0, gameInfo.board_size.thickness);
	side4.receiveShadow = true;
	sceneObjs.scene.add(side4)

	//BALL
	const ballGeometry = new THREE.SphereGeometry(gameInfo.board_size.thickness, 64, 64);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
	sceneObjs.ball = new THREE.Mesh(ballGeometry, ballMaterial);
	sceneObjs.ball.castShadow = false;
	sceneObjs.ball.position.set(gameInfo.ball_att.x, gameInfo.ball_att.y, gameInfo.board_size.thickness);
	sceneObjs.scene.add(sceneObjs.ball)
	
	//BALL LIGHT
	sceneObjs.ballplight = new THREE.PointLight(0xeeeeee, 0.8, 100);
	sceneObjs.ballplight.position.set(0, 0, gameInfo.board_size.thickness);
	sceneObjs.ballplight.castShadow = true;
	sceneObjs.scene.add(sceneObjs.ballplight)

	//BACKLIGHTS
	const backLight1 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight1.position.set(500, 500, -200)
	sceneObjs.scene.add(backLight1)
	
	const backLight2 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight2.position.set(-500, 500, -200)
	sceneObjs.scene.add(backLight2)
	
	const backLight3 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight3.position.set(-500, -500, -200)
	sceneObjs.scene.add(backLight3)
	
	const backLight4 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight4.position.set(500, -500, -200)
	sceneObjs.scene.add(backLight4)

	const light_prim_intense = 1.15
	const light_prim_distance = 400

	//PLAYER 1 LIGHT
	sceneObjs.lights[0] = new THREE.PointLight(gameInfo.colors[0], light_prim_intense, light_prim_distance);
	sceneObjs.lights[0].position.set(gameInfo.board_size.size / -3, 0, 100);
	sceneObjs.scene.add(sceneObjs.lights[0])

	//PLAYER 2 LIGHT
	sceneObjs.lights[1] = new THREE.PointLight(gameInfo.colors[1], light_prim_intense, light_prim_distance);
	sceneObjs.lights[1].position.set(gameInfo.board_size.size / 3, 0, 100);
	sceneObjs.scene.add(sceneObjs.lights[1])

	//PLAYER 3 LIGHT
	sceneObjs.lights[2] = new THREE.PointLight(gameInfo.colors[2], light_prim_intense, light_prim_distance);
	sceneObjs.lights[2].position.set(0, gameInfo.board_size.size / 3, 100);
	sceneObjs.scene.add(sceneObjs.lights[2])

	//PLAYER 4 LIGHT
	sceneObjs.lights[3] = new THREE.PointLight(gameInfo.colors[3], light_prim_intense, light_prim_distance);
	sceneObjs.lights[3].position.set(0, gameInfo.board_size.size / -3, 100);
	sceneObjs.scene.add(sceneObjs.lights[3])

	//PADDLE1
	const paddle1geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness);
	const paddle1material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000,});
	sceneObjs.paddles[0] = new THREE.Mesh(paddle1geometry, paddle1material);
	sceneObjs.paddles[0].position.set(-gameInfo.board_size.size / 2 + gameInfo.board_size.thickness * 2, 0, gameInfo.board_size.thickness);
	sceneObjs.paddles[0].castShadow = true;
	sceneObjs.paddles[0].receiveShadow = true;
	sceneObjs.scene.add(sceneObjs.paddles[0])

	//PADDLE2
	const paddle2geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness);
	const paddle2material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	sceneObjs.paddles[1] = new THREE.Mesh(paddle2geometry, paddle2material);
	sceneObjs.paddles[1].position.set(gameInfo.board_size.size / 2 - gameInfo.board_size.thickness * 2, 0, gameInfo.board_size.thickness);
	sceneObjs.paddles[1].castShadow = true;
	sceneObjs.paddles[1].receiveShadow = true;
	sceneObjs.scene.add(sceneObjs.paddles[1])

	//PADDLE3
	const paddle3geometry = new THREE.BoxGeometry(gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness, gameInfo.board_size.thickness);
	const paddle3material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	sceneObjs.paddles[2] = new THREE.Mesh(paddle3geometry, paddle3material);
	sceneObjs.paddles[2].position.set(0, gameInfo.board_size.size / 2 - gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness);
	sceneObjs.paddles[2].castShadow = true;
	sceneObjs.paddles[2].receiveShadow = true;
	sceneObjs.scene.add(sceneObjs.paddles[2])

	//PADDLE4
	const paddle4geometry = new THREE.BoxGeometry(gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness, gameInfo.board_size.thickness);
	const paddle4material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000});
	sceneObjs.paddles[3] = new THREE.Mesh(paddle4geometry, paddle4material);
	sceneObjs.paddles[3].position.set(0, -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness);
	sceneObjs.paddles[3].castShadow = true;
	sceneObjs.paddles[3].receiveShadow = true;
	sceneObjs.scene.add(sceneObjs.paddles[3])

	return sceneObjs
}
