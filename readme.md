__DISCLAIMER__
_This is under development. Stuff will change. Nothing is set in stone yet. There are bugs, there will be bugs, and some of these bugs may be massive terrible bugs. Deal._

# About
Foreman is a process control wrapper for minecraft. It exposes a REST api with JSON (using CORS). Foreman will launch and monitor Minecraft, and allow you to remotely start/stop/restart as well as issue commands.  Foreman is independent of Minecraft versions, and thus will work fine with Bukkit or other modded versions. 

# Install
Foreman runs via __Nodejs__. You will probably want __Forever__ as well, which can be installed with _npm install foreman -g_ (You will probably need to do this as root or with sudo).  Otherwise, simply unpack the program somewhere, configure processes.json, and fire off the app with _forever start main.js_.

# Configure
Foreman pulls almost all of it's information from the included json file, processes.json.  Each possible server is specified in here, as are access keys.  Access Keys may either be in the top level, and act as universal keys (and work with each service) or may be specified within a service.

The basic block for a service looks like

	"minecraft": {
		"cmd":"java", 
		"auto":true,
		"args": [
			"-Xmx1024M",
			"-Xms1024M",
			"-jar",
			"minecraft_server.jar"
			],
		"options":{
			"cwd":"/var/minecraft/"
		},
		"keys":[
			"testKey"
		]
	}

The block starts with our service name, in this case, just _minecraft_.
Then, we start with our command that we use to execute minecraft. In this case, we're just going to call java directly.

_auto_ specifies whether or not to initiative this service as soon as Foreman starts. In this case, it's set to true, so this minecraft will start as soon as our service does.

Our args is an array which will be fed into our program.  In this case, we're specifying the maximum memory, the minimum memory, and then feeding in our jar.

Our options are options sent to the shell. Usually, we just need to feed in our cwd (Current Working Directory, the place where we are executing this script). We may also want to feed in some path variables.

Then, we specify our key for this service.

Our complete processes.json looks like:

	{
		"keys":[
			"MyInsecureKeyofInsecurity"
		],
		"minecraft": {
			"cmd":"java", 
			"auto":true,
			"args": [
				"-Xmx1024M",
				"-Xms1024M",
				"-jar",
				"minecraft_server.jar"
				],
			"options":{
				"cwd":"/var/minecraft/"
			},
			"keys":[
				"testKey"
			]
		}
	}

This is mostly the same as before, except we've made sure to set a global key as well as wrapped our config as an object (as we should per JSON spec).

# API

__The api is in development. It will change. Get over it.__

Our service will run on Port 3000 by default. (Eventually, this will be configurable).

There are two exposed points currently:

/start/:name

This starts the service. If it's already running, it'll be restarted. (This will probably change).  The parameter key is __required__.

/send/:name

This sends a command to the service (a newline will be added).  The parameter key is __required__.  The parameter cmd is also __required__.

