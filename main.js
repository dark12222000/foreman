//Requires
var child = require('child_process');
var express = require('express');
var fs = require('fs');
var app = express();

//Globals
var processes = {};
var autoProcesses = JSON.parse(fs.readFileSync('processes.json', 'utf8'));
console.log('autoProcesses: ' + JSON.stringify(autoProcesses));

//callbacks
function restart(stream){
	console.log('Process Died');
}

function handleOut(data){
	console.log(data);
}

function spawn(args){
	if(processes[args.name]){
		processes[args.name].kill();
	}
	var myChild = child.spawn(args.cmd, args.args, args.options);
	myChild.addListener('close', restart);
	myChild.addListener('error', restart);
	myChild.stdout.setEncoding('utf8');
	myChild.stdout.on('data', handleOut);
	myChild.stderr.setEncoding('utf8');
	myChild.stderr.on('data', handleOut);
	processes[args.name] = myChild;
	console.log('Process Created');
}

function isValidKey(name, key){
	console.log('Authenticate '+key+' for '+name);
	if(autoProcesses['keys'].indexOf(key) > -1){
		return true;
	}else if(autoProcesses[name].keys.indexOf(key) > -1){
		return true;
	}else{
		return false;
	}
}

//Init

app.all('/*', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
 	next();
});

app.get('/start/:name', function(req, res){
		if(isValidKey(req.params.name, req.query.key)){
			var newChild = autoProcesses[req.params.name];
			var args = {};
			args.name = req.params.name;
			args.cmd = autoProcesses[req.params.name].cmd;
			spawn(args);
			var response = {};
			response.status = 200;
			response.msg = 'Service Started';
			res.send(200, JSON.stringify(response));
		}else{
			res.send(401);
		}
});

app.get('/send/:name', function(req, res){
	if(isValidKey(req.params.name, req.query.key)){
		if(processes[req.params.name].stdin.writable && req.query.cmd){
			processes[req.params.name].stdin.write(req.query.cmd + "\n", 'utf8');
			console.log(req.query.cmd);
			var response = {};
			response.status = 200;
			response.msg = 'Command Sent';
			res.send(200, JSON.stringify(response));
		}else{
			res.send(500);
		}
	}else{
		res.send(401);
	}
});

for(var autoChild in autoProcesses){
	if(autoProcesses[autoChild].auto == true){
		var args = {};
		args.name = autoChild;
		args.cmd = autoProcesses[autoChild].cmd;
		args.args = autoProcesses[autoChild].args;
		args.options = autoProcesses[autoChild].options;

		spawn(args);
	}
}
//This will check our processes and restart them if needed
// setInterval(function(){

// }, 1000);

app.listen(3000);
console.log('Server started');
