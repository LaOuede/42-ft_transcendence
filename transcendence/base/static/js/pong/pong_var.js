export function initGameInfo(){
	let gameInfo = {
		winner: "",
		tournaments: {enabled: false, game_count: 1},
		window: {width: 500, height: 500},
		demoCam: {enabled: false, DirX: 1, DirY: 1},
		ball_att: { dirX: 1, dirY: 1, speedX: 1, speedY: 0, reboundx: true, reboundy: true },
		controls: {	enabled: true,
					paddle1key : [false, false],
					paddle2key : [false, false],
					paddle3key : [false, false],
					paddle4key : [false, false]},
		board_size: { size: 500, thickness: 10, paddleLength: 75},
		paddle_limit_list: [2.5, 2.5, 2.5, 2.5],
		default_lives: 1,
		player_lives: [1, 1, 1, 1],
		gameover: true,
		player_count: 4,
		countDownDone: false,
		view: 0,
		level: 3,
		level_inc: 0.5,
		colors: ["", "", "", ""],
		nicks: ["", "", "", ""]
	}
	return gameInfo
}