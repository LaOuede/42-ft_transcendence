// import * as THREE from "three";

const board = { size: 500, thickness: 10 };

const ball_att = { x: 0, y: 0, dirX: 1, dirY: 1, speedX: 1, speedY: 0 };

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
	paddleLenght: 75,
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
	level_inc: 0.5,
	colors: [0x0000ff, 0xff0000, 0xffff00, 0x00ffff]
};

export {board, ball_att, control, gameInfo}