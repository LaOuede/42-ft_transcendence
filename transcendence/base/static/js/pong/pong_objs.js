import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initPongObjs(gameInfo, tags){
	
	const pongObjs = {
		orbit: undefined,
		renderer: undefined,
		camera: undefined,
		scene: undefined,
		ball: undefined,
		ballplight: undefined,
		paddles: [undefined, undefined, undefined, undefined],
		lights: [undefined, undefined, undefined, undefined],
	}

	//RENDERER
	const canvas = tags.canvas
	pongObjs.renderer = new THREE.WebGLRenderer( { canvas } )
	pongObjs.renderer.shadowMap.enabled = true;
	pongObjs.renderer.setSize(gameInfo.window.width - 20, gameInfo.window.height - 20);

	//CAMERA
	pongObjs.camera = new THREE.PerspectiveCamera(45, (gameInfo.window.width - 20 ) / (gameInfo.window.height - 20), 0.1, 500000);
	pongObjs.camera.position.set(0, -350, 700);

	//ORBIT
	pongObjs.orbit = new OrbitControls(pongObjs.camera, pongObjs.renderer.domElement);
	pongObjs.orbit.enablePan = false
	pongObjs.orbit.update();

	//SCENE
	pongObjs.scene = new THREE.Scene();
	
	//SKY
	const skyGeometry = new THREE.SphereGeometry(100000, 64, 64);
	const texture = new THREE.TextureLoader().load("../static/js/pong/nebuleuse.jpeg");
	const skyMaterial = new THREE.MeshBasicMaterial({ map: texture, side:THREE.BackSide});
	const sky = new THREE.Mesh(skyGeometry, skyMaterial);
	sky.rotateY(Math.PI * -0.5)
	sky.rotateZ(Math.PI)
	pongObjs.scene.add(sky)

	//PLANE
	const planeGeometry = new THREE.BoxGeometry(gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness);
	const planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.set(0 , 0, -gameInfo.board_size.thickness / 2)
	plane.receiveShadow = true;
	pongObjs.scene.add(plane)

	//SIDE1
	const side1geometry = new THREE.BoxGeometry(gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness, gameInfo.board_size.thickness * 2);
	const side1material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side1 = new THREE.Mesh(side1geometry, side1material);
	side1.position.set(0, -gameInfo.board_size.size / 2 - gameInfo.board_size.thickness / 2, gameInfo.board_size.thickness);
	side1.receiveShadow = true;
	pongObjs.scene.add(side1)

	//SIDE2
	const side2geometry = new THREE.BoxGeometry(gameInfo.board_size.size + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness, gameInfo.board_size.thickness * 2);
	const side2material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side2 = new THREE.Mesh(side2geometry, side2material);
	side2.position.set(0, gameInfo.board_size.size / 2 + gameInfo.board_size.thickness / 2, gameInfo.board_size.thickness);
	side2.receiveShadow = true;
	pongObjs.scene.add(side2)

	//SIDE3
	const side3geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.size, gameInfo.board_size.thickness * 2);
	const side3material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side3 = new THREE.Mesh(side3geometry, side3material);
	side3.position.set(gameInfo.board_size.size / 2 + gameInfo.board_size.thickness / 2, 0, gameInfo.board_size.thickness);
	side3.receiveShadow = true;
	pongObjs.scene.add(side3)

	//SIDE4
	const side4geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.size, gameInfo.board_size.thickness * 2);
	const side4material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side4 = new THREE.Mesh(side4geometry, side4material);
	side4.position.set(-gameInfo.board_size.size / 2 - gameInfo.board_size.thickness / 2, 0, gameInfo.board_size.thickness);
	side4.receiveShadow = true;
	pongObjs.scene.add(side4)

	//BALL
	const ballGeometry = new THREE.SphereGeometry(gameInfo.board_size.thickness, 64, 64);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
	pongObjs.ball = new THREE.Mesh(ballGeometry, ballMaterial);
	pongObjs.ball.castShadow = false;
	pongObjs.ball.position.set(gameInfo.ball_att.x, gameInfo.ball_att.y, gameInfo.board_size.thickness);
	pongObjs.scene.add(pongObjs.ball)
	
	//BALL LIGHT
	pongObjs.ballplight = new THREE.PointLight(0xeeeeee, 0.8, 100);
	pongObjs.ballplight.position.set(0, 0, gameInfo.board_size.thickness);
	pongObjs.ballplight.castShadow = true;
	pongObjs.scene.add(pongObjs.ballplight)

	//BACKLIGHTS
	const backLight1 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight1.position.set(500, 500, -200)
	pongObjs.scene.add(backLight1)
	
	const backLight2 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight2.position.set(-500, 500, -200)
	pongObjs.scene.add(backLight2)
	
	const backLight3 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight3.position.set(-500, -500, -200)
	pongObjs.scene.add(backLight3)
	
	const backLight4 = new THREE.PointLight(0x704478, 0.9, 2000)
	backLight4.position.set(500, -500, -200)
	pongObjs.scene.add(backLight4)

	const light_prim_intense = 1.15
	const light_prim_distance = 400

	//PLAYER 1 LIGHT
	pongObjs.lights[0] = new THREE.PointLight(gameInfo.colors[0], light_prim_intense, light_prim_distance);
	pongObjs.lights[0].position.set(gameInfo.board_size.size / -3, 0, 100);

	//PLAYER 2 LIGHT
	pongObjs.lights[1] = new THREE.PointLight(gameInfo.colors[1], light_prim_intense, light_prim_distance);
	pongObjs.lights[1].position.set(gameInfo.board_size.size / 3, 0, 100);

	//PLAYER 3 LIGHT
	pongObjs.lights[2] = new THREE.PointLight(gameInfo.colors[2], light_prim_intense, light_prim_distance);
	pongObjs.lights[2].position.set(0, gameInfo.board_size.size / 3, 100);

	//PLAYER 4 LIGHT
	pongObjs.lights[3] = new THREE.PointLight(gameInfo.colors[3], light_prim_intense, light_prim_distance);
	pongObjs.lights[3].position.set(0, gameInfo.board_size.size / -3, 100);

	//PADDLE1
	const paddle1geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness);
	const paddle1material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000,});
	pongObjs.paddles[0] = new THREE.Mesh(paddle1geometry, paddle1material);
	pongObjs.paddles[0].position.set(-gameInfo.board_size.size / 2 + gameInfo.board_size.thickness * 2, 0, gameInfo.board_size.thickness);
	pongObjs.paddles[0].castShadow = true;
	pongObjs.paddles[0].receiveShadow = true;

	//PADDLE2
	const paddle2geometry = new THREE.BoxGeometry(gameInfo.board_size.thickness, gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness);
	const paddle2material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	pongObjs.paddles[1] = new THREE.Mesh(paddle2geometry, paddle2material);
	pongObjs.paddles[1].position.set(gameInfo.board_size.size / 2 - gameInfo.board_size.thickness * 2, 0, gameInfo.board_size.thickness);
	pongObjs.paddles[1].castShadow = true;
	pongObjs.paddles[1].receiveShadow = true;

	//PADDLE3
	const paddle3geometry = new THREE.BoxGeometry(gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness, gameInfo.board_size.thickness);
	const paddle3material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	pongObjs.paddles[2] = new THREE.Mesh(paddle3geometry, paddle3material);
	pongObjs.paddles[2].position.set(0, gameInfo.board_size.size / 2 - gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness);
	pongObjs.paddles[2].castShadow = true;
	pongObjs.paddles[2].receiveShadow = true;

	//PADDLE4
	const paddle4geometry = new THREE.BoxGeometry(gameInfo.board_size.paddleLenght, gameInfo.board_size.thickness, gameInfo.board_size.thickness);
	const paddle4material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000});
	pongObjs.paddles[3] = new THREE.Mesh(paddle4geometry, paddle4material);
	pongObjs.paddles[3].position.set(0, -gameInfo.board_size.size / 2 + gameInfo.board_size.thickness * 2, gameInfo.board_size.thickness);
	pongObjs.paddles[3].castShadow = true;
	pongObjs.paddles[3].receiveShadow = true;

	return pongObjs
}
