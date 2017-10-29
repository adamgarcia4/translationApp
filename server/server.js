const express = require('express');
const app = express();

const translate = require('google-translate-api');

var Promise = require('bluebird');


app.get('/', function (req, res) {

	readFile();

	var test = [];

	test.push(indivWord("hi"));
	test.push(indivWord("bye"));

	res.send(test);
});

function indivWord(origWord) {

	translateWord(origWord);

	return {
		"orig": origWord,
		"trans": "testtalsdkfja;l"
	}
}


function translateWord(wordToTrans) {

	translate(wordToTrans, {to: 'iw'})
		.then(function (res) {
			console.log(res.text);
			return res.text;
		})
		.catch(function(err) {
			console.log("err" + err);
		});
}

function readFile() {
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
		console.log(data)
	});
}

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});