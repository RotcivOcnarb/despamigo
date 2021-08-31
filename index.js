//O APP QUE RECEBE O ARRAY PRONTO DO DROPBOX E FAZ A APLICAÇÃO DO AWS

const express = require("express");
const app = express();
const path = require("path");
const https = require("https");
const crypto = require ("crypto");
const fs = require('fs');
const dropbox = require("./dropbox_api");

let idList = [];

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/public'));

decrypt((ids) => { 
	idList = ids;
});


app.get("/", (req, res) => {
	res.render("home", {
		"ids": ids,
	});
});

app.get("/updatelist", (req, res) => {
	res.sendStatus(200);
	console.log("receiving update status");
	decrypt((ids) => { 
		idList = ids;
	});
	
});

function decrypt(callback){
	const algorithm = "aes-256-cbc"; 
	let initVector = Buffer.alloc(16);
	let Securitykey = Buffer.alloc(32);

	dropbox.getFile("despamigo/key.bin", (contents) => {
		console.log("key.bin fetched from dropbox");
		var buffer = Buffer.from(contents, 'binary');
		buffer.copy(initVector, 0, 0, 16);
		buffer.copy(Securitykey, 0, 16, 16+32);
		
		dropbox.getFile("despamigo/output.txt", (contents) => {
			console.log("output.txt fetched from dropbox");
			
			const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
			let decryptedData = decipher.update(contents, "hex", "utf-8");
			decryptedData += decipher.final("utf8");
			
			callback(JSON.parse(decryptedData));
		});
	})

	// fs.open(key, 'r', function(status, fd) {
		// if (status) {
			// console.log(status.message);
			// return;
		// }
		// var buffer = Buffer.alloc(16+32);
		// fs.read(fd, buffer, 0, 16+32, 0, function(err, num) {
			// buffer.copy(initVector, 0, 0, 16);
			// buffer.copy(Securitykey, 0, 16, 16+32);

			// fs.readFile(file, 'utf8' , (err, data) => {
				// if (err) {
					// console.error(err);
					// return;
				// }
				// const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
				// let decryptedData = decipher.update(data, "hex", "utf-8");
				// decryptedData += decipher.final("utf8");
				
				// callback(JSON.parse(decryptedData));
			
			// })
		// });
	// });
}

app.listen(1337, () => {
	console.log("server started on port " + 1337);
});