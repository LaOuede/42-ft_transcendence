import * as THREE from "three";

function launch(){

	const board = { size: 500, thickness: 10 };

	const ball_att = { x: 0, y: 0, dirX: 1, dirY: 1, speedX: 1, speedY: 0 };

	let paddle1_att = {
		width: board.thickness,
		height: 75,
		light_color: 0x0000ff,
		dead: true
	};

	let paddle2_att = {
		width: board.thickness,
		height: 75,
		light_color: 0xff0000,
		dead: true
	};

	let paddle3_att = {
		width: 75,
		height: board.thickness,
		light_color: 0xffff00,
		dead: true,
	};

	let paddle4_att = {
		width: 75,
		height: board.thickness,
		light_color: 0x00ffff,
		dead: true,
	};

	let control = {
		w: false,
		s: false,
		g: false,
		h: false,
		arrowUp: false,
		arrowDown: false,
		num8: false,
		num9: false,
	};

	const gameInfo = {
		lives: 2,
		p1Lives: 1,
		p2Lives: 1,
		p3Lives: 1,
		p4Lives: 1,
		gameover: true,
		player_count: 4,
		countDownDone: false,
		view: 0,
		level: 3,
		level_inc: 0.5
	};
	
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

	//PLAYER 2
	//LIGHT 1
	const p2light = new THREE.PointLight(paddle2_att.light_color, light_prim_intense, light_prim_distance);
	p2light.position.set(board.size / 3, 0, 100);

	//PLAYER 3
	//LIGHT 1
	const p3light = new THREE.PointLight(paddle3_att.light_color, light_prim_intense, light_prim_distance);
	p3light.position.set(0, board.size / 3, 100);

	//PLAYER 4
	//LIGHT 1
	const p4light = new THREE.PointLight(paddle4_att.light_color, light_prim_intense, light_prim_distance);
	p4light.position.set(0, board.size / -3, 100);
	const p4lightHelper1 = new THREE.PointLightHelper(p4light);

	//SKY
	const skyGeometry = new THREE.SphereGeometry(100000, 64, 64);
	const texture = new THREE.TextureLoader().load("../static/js/pong/nebuleuse.jpeg");
	const skyMaterial = new THREE.MeshBasicMaterial({ map: texture, side:THREE.BackSide});
	const sky = new THREE.Mesh(skyGeometry, skyMaterial);
	sky.rotateY(Math.PI * -0.5)
	sky.rotateZ(Math.PI)

	//PLANE
	const planeGeometry = new THREE.BoxGeometry(board.size + board.thickness * 2, board.size + board.thickness * 2, board.thickness);
	const planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.set(0 , 0, -board.thickness / 2)
	plane.receiveShadow = true;

	//BALL
	const ballGeometry = new THREE.SphereGeometry(board.thickness, 64, 64);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
	const ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.castShadow = false;
	ball.position.set(ball_att.x, ball_att.y, board.thickness);

	//SIDE1
	const side1geometry = new THREE.BoxGeometry(board.size + board.thickness * 2, board.thickness, board.thickness * 2);
	const side1material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side1 = new THREE.Mesh(side1geometry, side1material);
	side1.position.set(0, -board.size / 2 - board.thickness / 2, board.thickness);
	side1.receiveShadow = true;

	//SIDE2
	const side2geometry = new THREE.BoxGeometry(board.size + board.thickness * 2, board.thickness, board.thickness * 2);
	const side2material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side2 = new THREE.Mesh(side2geometry, side2material);
	side2.position.set(0, board.size / 2 + board.thickness / 2, board.thickness);
	side2.receiveShadow = true;

	//SIDE3
	const side3geometry = new THREE.BoxGeometry(board.thickness, board.size, board.thickness * 2);
	const side3material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side3 = new THREE.Mesh(side3geometry, side3material);
	side3.position.set(board.size / 2 + board.thickness / 2, 0, board.thickness);
	side3.receiveShadow = true;

	//SIDE4
	const side4geometry = new THREE.BoxGeometry(board.thickness, board.size, board.thickness * 2);
	const side4material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	const side4 = new THREE.Mesh(side4geometry, side4material);
	side4.position.set(-board.size / 2 - board.thickness / 2, 0, board.thickness);
	side4.receiveShadow = true;

	//PADDLE1
	const paddle1geometry = new THREE.BoxGeometry(board.thickness, paddle1_att.height, board.thickness);
	const paddle1material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000,});
	const paddle1 = new THREE.Mesh(paddle1geometry, paddle1material);
	paddle1.position.set(board.size / 2 - board.thickness * 2, 0, board.thickness);
	paddle1.castShadow = true;
	paddle1.receiveShadow = true;

	//PADDLE2
	const paddle2geometry = new THREE.BoxGeometry(board.thickness, paddle2_att.height, board.thickness);
	const paddle2material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	const paddle2 = new THREE.Mesh(paddle2geometry, paddle2material);
	paddle2.position.set(board.size / 2 - board.thickness * 2, 0, board.thickness);
	paddle2.castShadow = true;
	paddle2.receiveShadow = true;

	//PADDLE3
	const paddle3geometry = new THREE.BoxGeometry( paddle3_att.width, board.thickness, board.thickness);
	const paddle3material = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 2000 });
	const paddle3 = new THREE.Mesh(paddle3geometry, paddle3material);
	paddle3.position.set(0, board.size / 2 - board.thickness * 2, board.thickness);
	paddle3.castShadow = true;
	paddle3.receiveShadow = true;

	//PADDLE4
	const paddle4geometry = new THREE.BoxGeometry(paddle4_att.width, board.thickness, board.thickness);
	const paddle4material = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 2000});
	const paddle4 = new THREE.Mesh(paddle4geometry, paddle4material);
	paddle4.position.set(0, board.size / 2 - board.thickness * 2, board.thickness);
	paddle4.castShadow = true;
	paddle4.receiveShadow = true;

	let reboundx = true
	let reboundy = true
	let demoCam = false
	let camDemoDirX = 1
	let camDemoDirY = 1
	let paddle1limit = 2.5
	let paddle2limit = 2.5
	let paddle3limit = 2.5
	let paddle4limit = 2.5
		
		const p1ScoreTag = document.getElementById("p1Score")
		const p2ScoreTag = document.getElementById("p2Score")
		const p3ScoreTag = document.getElementById("p3Score")
		const p4ScoreTag = document.getElementById("p4Score")
		
		const p1Info = document.getElementById("playerInfo1")
		const p2Info = document.getElementById("playerInfo2")
		const p3Info = document.getElementById("playerInfo3")
		const p4Info = document.getElementById("playerInfo4")
		
		let navHeight = document.querySelector('nav').offsetHeight;
		let headerHeight = document.querySelector('header').offsetHeight;
		let footerHeight = document.querySelector('footer').offsetHeight;
		let canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1
		const canvas = document.querySelector("#game");
		
		const renderer = new THREE.WebGLRenderer({ canvas });
		
	renderer.shadowMap.enabled = true;// voir ou le mettre

	renderer.setSize(window.innerWidth, canvasHeight);
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / canvasHeight, 0.1, 500000);
	camera.position.set(0, -350, 700);

		const orbit = new OrbitControls(camera, renderer.domElement);
		orbit.update();

	function initGraphic(){
		let item_list = [paddle1, paddle2, paddle3, paddle4, ball,
			plane, side1, side2, side3, side4, p1light, ballplight, 
			p2light, p3light, p4light, sky, backLight1, backLight2, backLight3, backLight4]
		for(let i = 0; i < item_list.length; i++)
			scene.add(item_list[i])
	}

	function initHelpers(){
		let item_list = [p1lightHelper1, 
			p2lightHelper1, p3lightHelper1, p4lightHelper1, ballplightHelper]
		for(let i = 0; i < item_list.length; i++)
			scene.add(item_list[i])
	}

	function resetGameOverParam(players, lives){
		let paddles = [paddle1, paddle2, paddle3, paddle4]
		let paddles_atts = [paddle1_att, paddle2_att, paddle3_att, paddle4_att]
		let lights = [p1light, p2light, p3light, p4light]
		
		gameInfo.countDownDone = false
		defaultPosition()
		for(let i = 0; i < players.length; i++){
			if(players[i] === true){

			}
		}
	}

	function resetGameOverV2(){
		gameInfo.countDownDone = false
		defaultPosition()
		if(!scene.children.includes(paddle1)) {scene.add(paddle1)};
		if(!scene.children.includes(paddle2)) {scene.add(paddle2)};
		if(scene.children.includes(paddle3)) {scene.remove(paddle3)};
		if(scene.children.includes(paddle4)) {scene.remove(paddle4)};
		if(scene.children.includes(p3light)) {scene.remove(p3light)};
		if(scene.children.includes(p4light)) {scene.remove(p4light)};
		p1light.distance = 800
		p2light.distance = 800
		paddle1_att.dead = false
		paddle2_att.dead = false
		paddle3_att.dead = true
		paddle4_att.dead = true
		paddle1limit = 0
		paddle2limit = 0
		paddle3limit = 0
		paddle4limit = 0
		gameInfo.p1Lives = gameInfo.lives
		gameInfo.p2Lives = gameInfo.lives
		gameInfo.p3Lives = gameInfo.lives
		gameInfo.p4Lives = gameInfo.lives
		p1ScoreTag.textContent = gameInfo.p1Lives
		p2ScoreTag.textContent = gameInfo.p2Lives
		p3ScoreTag.textContent = gameInfo.p3Lives
		p4ScoreTag.textContent = gameInfo.p4Lives
		gameInfo.player_count = 2
		// gameInfo.gameover = false
		camera.position.set(0, -400, 375)
		camera.lookAt(0, -75, 0)
	}

	function resetGameOverV4(){
		gameInfo.countDownDone = false
		defaultPosition()
		if(!scene.children.includes(paddle1)) {scene.add(paddle1)};
		if(!scene.children.includes(paddle2)) {scene.add(paddle2)};
		if(!scene.children.includes(paddle3)) {scene.add(paddle3)};
		if(!scene.children.includes(paddle4)) {scene.add(paddle4)};
		if(!scene.children.includes(p3light)) {scene.add(p3light)};
		if(!scene.children.includes(p4light)) {scene.add(p4light)};
		p1light.distance = 400
		p2light.distance = 400
		paddle1limit = 2.5
		paddle2limit = 2.5
		paddle3limit = 2.5
		paddle4limit = 2.5
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
		// gameInfo.gameover = false
		camera.position.set(0, -400, 375)
		camera.lookAt(0, -75, 0)
	}

	function resetGameDemo(){
		gameInfo.countDownDone = false
		defaultPosition()
		if(scene.children.includes(paddle1)) {scene.remove(paddle1)};
		if(scene.children.includes(paddle2)) {scene.remove(paddle2)};
		if(scene.children.includes(paddle3)) {scene.remove(paddle3)};
		if(scene.children.includes(paddle4)) {scene.remove(paddle4)};
		if(!scene.children.includes(p3light)) {scene.add(p3light)};
		if(!scene.children.includes(p4light)) {scene.add(p4light)};
		paddle1_att.dead = true
		paddle2_att.dead = true
		paddle3_att.dead = true
		paddle4_att.dead = true
		gameInfo.p1Lives = gameInfo.lives
		gameInfo.p2Lives = gameInfo.lives
		gameInfo.p3Lives = gameInfo.lives
		gameInfo.p4Lives = gameInfo.lives
		p1ScoreTag.textContent = gameInfo.p1Lives
		p2ScoreTag.textContent = gameInfo.p2Lives
		p3ScoreTag.textContent = gameInfo.p3Lives
		p4ScoreTag.textContent = gameInfo.p4Lives
		gameInfo.player_count = 0
		// gameInfo.gameover = false
		camera.position.set(0, 0, 750)
		camera.lookAt(0, 0, 0)
	}

	function defaultPosition() {
		//vs2 et vs4 
		ball.position.x = 0
		ball.position.y = 0
		paddle1.position.y = 0
		paddle2.position.y = 0
		paddle3.position.x = 0
		paddle4.position.x = 0
		ballplight.position.set(0, 0, board.thickness)
		gameInfo.level = 1.5
		randomStartDir()
		changeAngle()
		if (gameInfo.countDownDone === false) countDown()
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
		if (Math.random() <= 0.5)ball_att.dirX = 1;
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
		p1ScoreTag.textContent = gameInfo.p1Lives
		if (gameInfo.p1Lives == 0) {
			paddle1_att.dead = true;
			paddle1limit = 0
			scene.remove(paddle1);
			gameInfo.player_count--
			giveTournPoints(0)

		}
		gameInfo.countDownDone = false
		defaultPosition();
		}
		if (
		ball.position.x > board.size / 2 - board.thickness &&
		paddle2_att.dead === false
		) {
		gameInfo.p2Lives--;
		p2ScoreTag.textContent = gameInfo.p2Lives
		if (gameInfo.p2Lives == 0) {
			paddle2_att.dead = true;
			paddle2limit = 0
			scene.remove(paddle2);
			gameInfo.player_count--
			giveTournPoints(1)

		}
		gameInfo.countDownDone = false
		defaultPosition();
		}
		if (
		ball.position.y > board.size / 2 - board.thickness &&
		paddle3_att.dead === false
		) {
		gameInfo.p3Lives--;
		p3ScoreTag.textContent = gameInfo.p3Lives
		if (gameInfo.p3Lives == 0) {
			paddle3_att.dead = true;
			paddle3limit = 0
			scene.remove(paddle3);
			gameInfo.player_count--
			giveTournPoints(2)

		}
		gameInfo.countDownDone = false
		defaultPosition();
		}
		if (
		ball.position.y < -board.size / 2 + board.thickness &&
		paddle4_att.dead === false
		) {
		gameInfo.p4Lives--;
		p4ScoreTag.textContent = gameInfo.p4Lives
		if (gameInfo.p4Lives == 0) {
			paddle4_att.dead = true;
			paddle4limit = 0
			scene.remove(paddle4);
			gameInfo.player_count--
			giveTournPoints(3)
		}
		gameInfo.countDownDone = false
		defaultPosition();
		}
		if(gameInfo.player_count === 1){
			gameInfo.player_count--;
			let tempPaddle = [paddle1_att, paddle2_att, paddle3_att, paddle4_att]
			for(let i = 0; i < tempPaddle.length; i++){
				if(tempPaddle[i].dead === false){
					giveTournPoints(i)
				}
				console.log()
			}
			gameInfo.gameover = true
			tournament()
		}
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
		const maxlevel = 6
		if (
			paddle1_att.dead === false &&
			ball.position.x - board.thickness <= paddle1.position.x + board.thickness / 2 + 2 &&
			ball.position.x - board.thickness >= paddle1.position.x + board.thickness / 2 - 8 &&
			ball.position.y <= paddle1.position.y + paddle1_att.height / 2 &&
			ball.position.y >= paddle1.position.y - paddle1_att.height / 2
		) {
		if(reboundx === true){
			changeAngle();
			ball_att.dirX = 1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
		}
		reboundx = false
		}
		if (
			paddle2_att.dead === false &&
			ball.position.x + board.thickness >= paddle2.position.x - board.thickness / 2 - 2 &&
			ball.position.x + board.thickness <= paddle2.position.x - board.thickness / 2 + 8 &&
			ball.position.y <= paddle2.position.y + paddle2_att.height / 2 &&
			ball.position.y >= paddle2.position.y - paddle2_att.height / 2
		) {
		if(reboundx === true){
			changeAngle();
			ball_att.dirX = -1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
		}
		reboundx = false
		}
		if (
			paddle3_att.dead === false &&
			ball.position.y + board.thickness >= paddle3.position.y - board.thickness / 2 - 2 &&
			ball.position.y + board.thickness <= paddle3.position.y - board.thickness / 2 + 8 &&
			ball.position.x <= paddle3.position.x + paddle3_att.width / 2 &&
			ball.position.x >= paddle3.position.x - paddle3_att.width / 2
		) {
		if(reboundy === true){
			changeAngle();
			ball_att.dirY = -1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
		}
		reboundy = false
		}
		if (
			paddle4_att.dead === false &&
			ball.position.y - board.thickness <= paddle4.position.y + board.thickness / 2 + 2 &&
			ball.position.y - board.thickness >= paddle4.position.y + board.thickness / 2 - 8 &&
			ball.position.x <= paddle4.position.x + paddle4_att.width / 2 &&
			ball.position.x >= paddle4.position.x - paddle4_att.width / 2
		) {
		if(reboundy === true){
			changeAngle();
			ball_att.dirY = 1;
			if(gameInfo.level < maxlevel)
				gameInfo.level += gameInfo.level_inc;
		}
		
		reboundy = false
		}
		if(ball.position.y <= 10 && ball.position.y >= -10)
			reboundy = true
		if(ball.position.x <= 10 && ball.position.x >= -10)
			reboundx = true


	}

	function controlDetection() {
		//vs2 et vs4
		const paddleSpeed = 6
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
			stopGame()
		}
		if (event.key === "m") {
			renderer.setAnimationLoop(animate);

		}
		if (event.key === "j") {
			playGameV4()
		}
		if (event.key === "o") {
			playGameV2()
		}
		if (event.key === "l") {
			playDemo()
		}
		if(event.key === "1"){
			console.log("1")
			lightColorSwitch(3, "#ff55ff")
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

	window.addEventListener("resize", () => {

		navHeight = document.querySelector('nav').offsetHeight;
		headerHeight = document.querySelector('header').offsetHeight;
		footerHeight = document.querySelector('footer').offsetHeight;
		canvasHeight = window.innerHeight - navHeight - headerHeight - footerHeight + 1
		
		camera.aspect = window.innerWidth / canvasHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, canvasHeight)
	});

	function changeView() {
		//vs2 et vs4
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

	function demoCamPlay(){
		if(camera.position.x < -400)
			camDemoDirX = 1
		else if(camera.position.x > 400)
			camDemoDirX = -1
		if(camera.position.y < -210)
			camDemoDirY = 1
		else if(camera.position.y > 210)
			camDemoDirY = -1
		camera.position.x += (0.4 * camDemoDirX)
		camera.position.y += (0.1 * camDemoDirY)
		camera.lookAt(0, 0, 0)
	}

	function camLimiter(){
		if(camera.position.length() > 10000){camera.position.setLength(10000);}
		if(camera.position.length() < 200){camera.position.setLength(200);}
		camera.updateProjectionMatrix();
	}

	function animate() {
		//vs2 et vs4
		if (gameInfo.gameover === false && gameInfo.countDownDone === true) {
			controlDetection();
			ballPhysic();
		}
		camLimiter()
		renderer.render(scene, camera);
		if(demoCam)
			demoCamPlay()
		// console.log("running")
	}

	function lightColorSwitch(player, color){
		const lights = [p1light1, p2light1, p3light1, p4light1]
		const pInfos = [p1Info, p2Info, p3Info, p4Info]
		lights[player - 1].color.set(color)
		pInfos[player - 1].style.backgroundColor = color + "66"
	}

	function showPlayerInfoV4(){
		p1Info.style.display = "block"
		p2Info.style.display = "block"
		p3Info.style.display = "block"
		p4Info.style.display = "block"
	}

	function showPlayerInfoV2(){
		p1Info.style.display = "block"
		p2Info.style.display = "block"
		p3Info.style.display = "none"
		p4Info.style.display = "none"
	}

	function hidePlayerInfo(){
		p1Info.style.display = "none"
		p2Info.style.display = "none"
		p3Info.style.display = "none"
		p4Info.style.display = "none"
	}

	function initGame(){
		initGraphic()
		// resetGameOverV4()
	}

	function playGameV2(){
		showPlayerInfoV2()
		resetGameOverV2()
		demoCam = false
		gameInfo.countDownDone = false
		renderer.setAnimationLoop(animate);
	}

	function playGameV4(){
		showPlayerInfoV4()
		resetGameOverV4()
		demoCam = false
		gameInfo.countDownDone = false
		renderer.setAnimationLoop(animate);
	}

	function playDemo(){
		hidePlayerInfo()
		demoCam = true
		resetGameDemo()
		renderer.setAnimationLoop(animate);

	}

	function stopGame(){
		demoCam = false
		renderer.setAnimationLoop(null)
	}
	initGame()
}