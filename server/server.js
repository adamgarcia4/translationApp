const express = require('express');
const app = express();

const translate = require('google-translate-api');

var Promise = require('bluebird');


app.get('/', function (req, res) {

	// Pseudocode
	// 1.  Read text from textfile
	// 2.  Split text file by word
	// 3.  Individually translate words via google translate API
	// 4.  Send back results

	// Holds promises to each translation submission.
	var wordPromiseArray = [];


	readFile().then(function(rawText) {

		// console.log('raw text is: ' + rawText);

		var rawWordArr = rawText.split(" ");
		var wordArray = []; // Prepare final storage of words and their translations

		for(var i=0; i<rawWordArr.length; i++) {

			wordPromiseArray.push(
				indivWord(rawWordArr[i], i)
					.then(function (word) {
						wordArray.push(word);
					})
			);

		}

		// Once all async translations have been completed, sort wordArray (via their index) and return to user
		Promise.all(wordPromiseArray).then(function () {
			console.log('all done!');

			wordArray.sort(function(a, b) {
				return a.index - b.index;
			});

			res.send(wordArray); // Sort async problem?
		});

	});


});

// Returns an object with all information necessary to translate a word
function indivWord(origWord, index) {

	return new Promise(function (resolve) {

		translateWord(origWord)
			.then(function (response) {
				resolve({
					"index": index,
					"orig": origWord,
					"trans": response
				});
			});

	})
}

// Performs actual translation using Google API
function translateWord(wordToTrans) {

	return new Promise(function (resolve) {

		translate(wordToTrans, {to: 'en'}) // See http://bit.ly/2zSddBw for list of languages
			.then(function (res) {
				console.log(res.text);
				resolve(res.text);
			});
	})
		.catch(function (err) {
			console.log("err" + err);
		});
}

// Function call to read from a file
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