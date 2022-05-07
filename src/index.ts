import { QGridLayout, QLabel, QMainWindow, QWidget } from '@nodegui/nodegui';
const WebSocket = require('ws')

var fs = require('fs')
var data = fs.readFileSync("./config.json")

var config = JSON.parse(data);
if (!config) 
	throw new Error("Please create a config.json file")
console.log("config : ", JSON.stringify(config));
const courtName = config.courtName
const wsAddress = config.wsAddress

// const ws = new WebSocket('ws://82.165.96.150:8800');
function connect() {
	console.log("Trying to connect ....")
	const ws = new WebSocket(wsAddress);
	
	ws.on('error', (e: Error) => {
		console.log("An error has ocurred", e)
		setTimeout(() => connect(), 10000)
	})
	ws.on('message', (msg: any) => {
		console.log(`Receiving ${msg}`)
		const matches = JSON.parse(msg);
		console.log(`Matches ${JSON.stringify(matches)}`)
		if (matches[courtName]) {
			updatePlayer1(matches[courtName].player1);
			updatePlayer2(matches[courtName].player2);
		}
	})
	ws.on('close', (e: any) => {
		console.log("Got disconnected")
		setTimeout(() => connect(), 10000)
	})
}
connect()
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
const playerServe = new QLabel();

playerPoints.setInlineStyle("background-color: blue")


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
	playerPoints.setText(player1Obj.point);
	playerServe.setText(player1Obj.server ? "🎾" : "");
}
//updatePlayer1(match.players[0]);

const player2 = new QLabel();
const player2Set1 = new QLabel();
const player2Set2 = new QLabel();
const player2Set3 = new QLabel();
const player2Points = new QLabel();
const player2Serve = new QLabel();
player2Points.setInlineStyle("background-color: blue")

player2.setObjectName("player")

function updatePlayer2(player2Obj: any) {
	player2.setText(player2Obj.name);
	player2Set1.setText(player2Obj.games[0]);
	player2Set2.setText(player2Obj.games[1]);
	player2Set3.setText(player2Obj.games[2]);
	player2Points.setText(player2Obj.point);
	player2Serve.setText(player2Obj.server ? "🎾" : "");
}
//updatePlayer2(match.players[1]);

rootLayout.addWidget(player, 1, 1);
rootLayout.addWidget(playerSet1, 1, 2);
rootLayout.addWidget(playerSet2, 1, 3);
rootLayout.addWidget(playerSet3, 1, 4);
rootLayout.addWidget(playerPoints, 1, 5);
rootLayout.addWidget(playerServe, 1, 6);
rootLayout.addWidget(player2, 2, 1);
rootLayout.addWidget(player2Set1, 2, 2);
rootLayout.addWidget(player2Set2, 2, 3);
rootLayout.addWidget(player2Set3, 2, 4);
rootLayout.addWidget(player2Points, 2, 5);
rootLayout.addWidget(player2Serve, 2, 6);

win.setCentralWidget(view);
win.setStyleSheet(
  `
    #main {
      background-color: black;
      height: '100%';
      justify-content: 'center';
	  border: 1px solid;
    }
    #main * {
		font-size: 16px;
		font-weight: bold;
		padding: 1;
		color: white;
		border: 1px solid black;
    }
  `
);
win.show();

(global as any).win = win;
