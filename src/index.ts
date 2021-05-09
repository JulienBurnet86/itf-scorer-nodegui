import { QGridLayout, QLabel, QMainWindow, QWidget } from '@nodegui/nodegui';
const WebSocket = require('ws')

const ws = new WebSocket('ws://82.165.96.150:8800');

ws.on('message', (msg: any) => {
	Object.assign(match, JSON.parse(msg));
	console.log(match);
	updatePlayer1(match.players[0]);
	updatePlayer2(match.players[1]);
});

const match = {
	players: [
		{
			name: "",
			games: [0, 0, 0],
			points: 0
		}
		, {
			name: "",
			games: [0, 0, 0],
			points: 0
		}]
}

ws.on('connect', (msg: any) => {
	Object.assign(match, JSON.parse(msg));
	updatePlayer1(match.players[0]);
	updatePlayer2(match.players[1]);
})

const win = new QMainWindow();
win.removeStatusBar();
// win.setWindowTitle("Hello World");

const view = new QWidget();
view.setObjectName("main");
const rootLayout = new QGridLayout();
view.setLayout(rootLayout);

const player = new QLabel();
const playerSet1 = new QLabel();
const playerSet2 = new QLabel();
const playerSet3 = new QLabel();
const playerPoints = new QLabel();

const scores = ["0", "15", "30", "40", "AD"]

function getFormattedPoint(p: any) {
	var point
	if (!p.tiebreak) {
		point = scores[p.points]
	} else {
		point = p.points;
	}
	return point
}

function updatePlayer1(player1Obj: any) {
	player.setText(player1Obj.name);
	player.setObjectName("player")
	playerSet1.setText(player1Obj.games[0]);
	playerSet2.setText(player1Obj.games[1]);
	playerSet3.setText(player1Obj.games[2]);
	playerPoints.setText(getFormattedPoint(player1Obj));
}
updatePlayer1(match.players[0]);

const player2 = new QLabel();
const player2Set1 = new QLabel();
const player2Set2 = new QLabel();
const player2Set3 = new QLabel();
const player2Points = new QLabel();

player2.setObjectName("player")

function updatePlayer2(player2Obj: any) {
	player2.setText(player2Obj.name);
	player2Set1.setText(player2Obj.games[0]);
	player2Set2.setText(player2Obj.games[1]);
	player2Set3.setText(player2Obj.games[2]);
	player2Points.setText(getFormattedPoint(player2Obj));
}
updatePlayer2(match.players[1]);

rootLayout.addWidget(player, 1, 1);
rootLayout.addWidget(playerSet1, 1, 2);
rootLayout.addWidget(playerSet2, 1, 3);
rootLayout.addWidget(playerSet3, 1, 4);
rootLayout.addWidget(playerPoints, 1, 5);
rootLayout.addWidget(player2, 2, 1);
rootLayout.addWidget(player2Set1, 2, 2);
rootLayout.addWidget(player2Set2, 2, 3);
rootLayout.addWidget(player2Set3, 2, 4);
rootLayout.addWidget(player2Points, 2, 5);

win.setCentralWidget(view);
win.setStyleSheet(
  `
    #main {
      background-color: green;
      height: '100%';
      justify-content: 'center';
	  border: 1px solid;
    }
    #main * {
		font-size: 16px;
		font-weight: bold;
		padding: 1;
		color: white;
    }
  `
);
win.show();

(global as any).win = win;
