//O APP QUE RECEBE O ARRAY PRONTO DO DROPBOX E FAZ A APLICAÇÃO DO AWS

const express = require("express");
const path = require( "path");
const crypto = require( "crypto");
const dropbox = require( "./dropbox_api.js");
const cors = require("cors");

const app = express();

let idList = [];

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/public'));
app.use(cors())

decrypt((ids) => { 
	idList = ids;
});

function findFromId(id){
	for(var i = 0; i < idList.length; i++){
		if(idList[i].id == id){
			return i;
		}
	}
	return -1;
}


app.get("/", (req, res) => {
	res.render("home");
});

app.get("/quemtirei", (req, res) => {
	if(req.query["id"]){
		
		var id = req.query["id"];
		var index = findFromId(id);
		if(index != -1){
			res.send({
				"me": idList[index].name,
				"other": idList[(index+1) % idList.length].name
			});
		}
		else{
			res.send("id supplied was not found");
		}
	}
	else{
		res.send("no id supplied");
	}
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
}

app.listen(1337, () => {
	console.log("server started on port " + 1337);
});