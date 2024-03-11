// import * as THREE from "three";

// const sceneObjs = {
// 	scene: initBaseScene(),
// 	ball: scene.getObjectByName("ball"),
// 	ballplight: scene.getObjectByName("ballplight"),
// 	paddle1: scene.getObjectByName("paddle1"),
// 	paddle2: scene.getObjectByName("paddle2"),
// 	paddle3: scene.getObjectByName("paddle3"),
// 	paddle4: scene.getObjectByName("paddle4"),
// 	p1light: scene.getObjectByName("p1light"),
// 	p2light: scene.getObjectByName("p2light"),
// 	p3light: scene.getObjectByName("p3light"),
// 	p4light: scene.getObjectByName("p4light")
// }


const gameInfo = {
	ball_att: { dirX: 1, dirY: 1, speedX: 1, speedY: 0, reboundx: true, reboundy: true },
	controls: {	paddle1key : [false, false],
				paddle2key : [false, false],
				paddle3key : [false, false],
				paddle4key : [false, false]},
	board_size: { size: 500, thickness: 10, paddleLenght: 75},
	lives: 2,
	paddle_limit_list: [2.5, 2.5, 2.5, 2.5],
	default_lives: 2,//test
	player_lives: [0, 0, 0, 0],//test
	p1Lives: 1,
	p2Lives: 1,
	p3Lives: 1,
	p4Lives: 1,
	gameover: true,
	player_count: 4,
	countDownDone: false,
	view: 0,
	level: 3,
	level_inc: 0.5,
	colors: [0x0000ff, 0xff0000, 0xffff00, 0x00ffff]
};

// export function initGameInfo(){
// 	const gameInfo = {
// 		ball_att: {dirX: 1, dirY: 1, speedX: 1, speedY: 0 },
// 		controls: {	paddle1key : [false, false],
// 					paddle2key : [false, false],
// 					paddle3key : [false, false],
// 					paddle4key : [false, false]},
// 		board_size: { size: 500, thickness: 10, paddleLenght: 75},
// 		lives: 2,
// 		paddle_limit_list: [2.5, 2.5, 2.5, 2.5],
// 		default_lives: 2,//test
// 		player_lives: [0, 0, 0, 0],//test
// 		p1Lives: 1,
// 		p2Lives: 1,
// 		p3Lives: 1,
// 		p4Lives: 1,
// 		gameover: true,
// 		player_count: 4,
// 		countDownDone: false,
// 		view: 0,
// 		level: 3,
// 		level_inc: 0.5,
// 		colors: [0x0000ff, 0xff0000, 0xffff00, 0x00ffff]
// 	};
// 	return gameInfo
// }

export {gameInfo}