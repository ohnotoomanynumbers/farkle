var diceArr = [];
var playerArr;
var hasSelected = false;
var lastTurn = false;
var currentPlayer;
var scores;


function startGame() {
	var number = document.getElementById("amount").value;
	playerArr = []
	listString = ''
	for (i = 0; i < number; i++) {
		playerArr[i] = {}
		playerArr[i].id = i	
		playerArr[i].score = 0
		listString += '<p id=player' + i + '>Player ' + i + ': ' + playerArr[i].score + '</p>'
	}
	currentPlayer = playerArr[0]
	console.log(currentPlayer)
	document.getElementById("game_start").classList.toggle('invisible');
	document.getElementById("player_info").classList.toggle('invisible');
	lastTurn = false;
	document.getElementById("player_info").innerHTML = listString
	updatePlayer()
}

function initializeDice(){
	for(i = 0; i < 6; i++){
		diceArr[i] = {};
		diceArr[i].id = "die" + (i + 1);
		diceArr[i].value = i + 1;
		diceArr[i].clicked = 0;
	}
}

/*Rolling dice values*/
function rollDice(){
	for(let i=0; i < 6; i++){
		if(diceArr[i].clicked === 0){
			diceArr[i].value = Math.floor((Math.random() * 6) + 1);
		}
	}
	updateDiceImg();
	scores = checkScore()
	document.getElementById("score_display").classList.toggle("invisible")
	if (scores === 'Farkle!') {
		document.getElementById("running_score").innerHTML = 0
		bankScore()
		document.getElementById("score_header").innerHTML = "Farkle!"
		document.getElementById("scores_list").innerHTML = ''
		return
	}
	messageUpdate(scores)
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg(){
	let diceImage;
	for(let i = 0; i < 6; i++){
		diceImage = "images/" + diceArr[i].value + ".png";
		document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
	}
}

function diceClick(img){
	let i = img.getAttribute("data-number");

	img.classList.toggle("transparent");
	if(diceArr[i].clicked === 0){
		diceArr[i].clicked = 1;
	}
	else{
		diceArr[i].clicked = 0;
	}
}


function resetDice() {
	for (let i = 0; i < 6; i++) {
		let id = "die" + (i+1)
		let img = document.getElementById(id)
		if (diceArr[i].clicked === 1) {
			diceArr[i].clicked = 0
			img.classList.toggle("transparent")
		}
	}
}


// helper function to get all indices, used for scoring
function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}


function tripScore(n) {
	if (n === 1) {
		return n*1000
	} else {
		return n*100
	}
}


/* check current diceArr for scores, then return an array of scores with associated dice that must be clicked to accept or farkle */
function checkScore() {
	const values = [];
	scores = [];
	// for convenience create an array of available die values at the time checkScore is called with indices matching diceArr
	for (let i = 0; i < 6; i++) {
		if (diceArr[i].clicked === 0) {
			values.push(diceArr[i].value)
		} else {
			values.push(-1)
		}
	}
	// check to see if there are any triples in the values
	for (let i = 0; i < 6; i++) {
		if (values.filter(x => x===i+1).length >= 3) {
			scores.push([getAllIndexes(values, i+1), tripScore(i+1)])
		}
	}
	// then check to see if there are any 1s or 5s in values
	for (let i = 0; i < 6; i++) {
		let score
		if (values[i] === 1) {
			score = 100
			scores.push([i,score]) 
		} else if (values[i] === 5) {
			score = 50
			scores.push([i, score])
		}
	}
	// no scores available is a farkle
	if (scores.length === 0) {
		return 'Farkle!'
	}
	return scores
}


// consolidate all 1 and 5 rolls to have an array of all their indices
function consolidateScores(scores) {
	const newScores = []
	const ones = []
	const fives = []
	for (let i in scores) {
		if (scores[i][1] === 100) {
			ones.push(scores[i][0])
		} else if (scores[i][1] === 50) {
			fives.push(scores[i][0])
		} else {
			newScores.push(scores[i])
		}
	}
	if (ones.length > 0) {
		newScores.push([ones, 100])
	}
	if (fives.length > 0) {
		newScores.push([fives, 50])
	}
	return newScores
}


function messageUpdate(scores) {
	document.getElementById("score_header").innerHTML = "You Scored!"
	scores = consolidateScores(scores)
	let scoresList = ""
	for (let score in scores) {
		scoresList += "<button class=\"game_score\" id=\"game_score" + score + "\" onclick=\"updateRunningScore(this)\">" + scores[score][1] + "</p>"
	}
	document.getElementById("scores_list").innerHTML = scoresList
}



function updateRunningScore(selection) {
	let toAdd = parseInt(selection.innerHTML)
	console.log(toAdd)
	for (let score in scores) {
		if (scores[score][1] === toAdd) {
			var scoreAdd = scores[score]
		}
	}
	if (scoreAdd[1] > 100) {
		selection.innerHTML
		for (i = 0; i < 3; i++) {
			const j = scoreAdd[0][i]
			const img = document.getElementById("die" + (j+1))
			img.classList.toggle("transparent");
			diceArr[j].clicked = 1;	
		}
	} else {
		const j = scoreAdd[0]
		const img = document.getElementById("die" + (j+1))
		img.classList.toggle("transparent")
		diceArr[j].clicked = 1
	}
	running_score = parseInt(document.getElementById("running_score").innerHTML)
	running_score += toAdd
	console.log(running_score)
	document.getElementById("running_score").innerHTML = running_score
	document.getElementById("score_display").classList.toggle("invisible")
}


function bankScore() {
	running_score = parseInt(document.getElementById("running_score").innerHTML)
	total_score = parseInt(document.getElementById("total_score").innerHTML)
	total_score += running_score
	currentPlayer.score = total_score
	document.getElementById("running_score").innerHTML = 0
	endTurn()
}


function updatePlayer() {
	document.getElementById("current_player").innerHTML = "Player " + currentPlayer.id
	document.getElementById("total_score").innerHTML = currentPlayer.score
	for (i = 0; i < playerArr.length; i++) {
		document.getElementById("player" + i).innerHTML = 'Player ' + i + ': ' + playerArr[i].score
	}
}


function endTurn() {
	let scoreArr = []
	for (i = 0; i < playerArr.length; i++) {
		scoreArr.push(playerArr[i].score)
	}
	highScore = Math.max(...scoreArr)
	if (lastTurn && currentPlayer.id === stopPlayer) {
		document.getElementById("game_start").style.visibility = visible;
		document.getElementById("player_info").style.visibility = hidden;
		return
	}
	if (highScore >= 10000) {
		lastTurn = true;
		stopPlayer = currentPlayer.id
	}
	if (currentPlayer.id === playerArr.length - 1) {
		currentPlayer = playerArr[0]
	} else {
		currentPlayer = playerArr[currentPlayer.id + 1]
	}
	resetDice()
	updatePlayer()
}

