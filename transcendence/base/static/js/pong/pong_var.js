// import * as THREE from "three";

const board = { size: 500, thickness: 10 };

const ball_att = { x: 0, y: 0, dirX: 1, dirY: 1, speedX: 1, speedY: 0 };

let paddle1_att = {
	x: -board.size / 2 + board.thickness * 2,
	y: 0,
	width: board.thickness,
	height: 75,
	light_color: 0x0000ff,
	dead: true
};

let paddle2_att = {
	x: board.size / 2 - board.thickness * 2,
	y: 0,
	width: board.thickness,
	height: 75,
	light_color: 0xff0000,
	dead: true
};

let paddle3_att = {
	x: 0,
	y: board.size / 2 - board.thickness * 2,
	width: 75,
	height: board.thickness,
	light_color: 0xffff00,
	dead: true,
};

let paddle4_att = {
	x: 0,
	y: -board.size / 2 + board.thickness * 2,
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

export {board, ball_att, paddle1_att, paddle2_att, 
	paddle3_att, paddle4_att, control, gameInfo}