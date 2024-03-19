export function initGameInfo(){
	let gameInfo = {
		tournements: false,
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
		colors: ["#9D2406", "#249DC6", "#88AD40", "#F2D811"],
		nicks: ["player1", "player2", "player3", "player4"]
	}
	return gameInfo
}