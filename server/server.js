const express = require('express');
const app = express();

const translate = require('google-translate-api');

var Promise = require('bluebird');


app.get('/', function (req, res) {

	var wordPromiseArray = [];
	var wordArray = [];

	readFile().then(function(rawText) {
		console.log('raw text is: ' + rawText);


		console.log(rawText.split(" "));





		wordPromiseArray.push(
			indivWord("hi")
				.then(function (word) {
					wordArray.push(word);
					// console.log(word);
					// console.log('hi done');
				})
		);


		wordPromiseArray.push(
			indivWord("bye")
				.then(function (word) {
					wordArray.push(word);
				})
		);

		Promise.all(wordPromiseArray).then(function () {
			console.log('all done!');
			res.send(wordArray);
		});






	});


});

function indivWord(origWord) {

	return new Promise(function (resolve) {

		translateWord(origWord)
			.then(function (response) {
				resolve({
					"orig": origWord,
					"trans": response
				});
			});


	})
}


function translateWord(wordToTrans) {

	return new Promise(function (resolve) {

		translate(wordToTrans, {to: 'iw'})
			.then(function (res) {
				console.log(res.text);
				resolve(res.text);
			});
	})
		.catch(function (err) {
			console.log("err" + err);
		});
}

function readFile() {


	return new Promise(function (resolve) {

		// Make sure we got a filename on the command line.
		if (process.argv.length < 3) {
			console.log('Usage: node ' + process.argv[1] + ' FILENAME');
			process.exit(1);
		}
// Read the file and print its contents.
		var fs = require('fs')
			, filename = process.argv[2];
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) throw err;
			console.log('OK: ' + filename);
			// console.log(data)
			resolve(data);
		});
	})
}

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});