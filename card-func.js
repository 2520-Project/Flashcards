console.log('Accessing flashcard functions...')
const flashcards = require('./flashcards');
const fs = require('fs');

var add = (id, subject) => {
	var qA = flashcards.makeQA()
	var question = qA[0]
	var answer = qA[1]
	var card = {
		"question":question,
		"answer":answer
		};
	var readJSON = fs.readFileSync('data.json');
	var objectJSON = JSON.parse(readJSON);
	objectJSON[id] = card;
	var newJSON = JSON.stringify(objectJSON, undefined, 2);
	fs.writeFileSync('data.json', newJSON);
};

var remove = (id) => {
	var readJSON = fs.readFileSync('data.json');
	var objectJSON = JSON.parse(readJSON);
	delete objectJSON[id];
	var newJSON = JSON.stringify(objectJSON, undefined, 2);
	fs.writeFileSync('data.json', newJSON);	
};