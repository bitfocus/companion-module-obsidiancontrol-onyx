var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var TelnetSocket = require("telnet-stream").TelnetSocket;
var debug;
var log;


function instance(system, id, config) {
	var self = this;

	// Request id counter
	self.request_id = 0;
	self.login = false;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.status(1,'Initializing');
	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
	self.init_tcp();
};


instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;
	var receivebuffer = '';

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
		self.login = false;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			debug("Connected");
			self.login = false;
		});

		self.telnet = new TelnetSocket(self.socket.socket);

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		// if we get any data, display it to stdout
		self.telnet.on("data", function(buffer) {
			var indata = buffer.toString("utf8");
			// self.incomingData(indata);
		});

		// tell remote we WONT do anything we're asked to DO
		self.telnet.on("do", function(option) {
			return self.telnet.writeWont(option);
		});

		// tell the remote DONT do whatever they WILL offer
		self.telnet.on("will", function(option) {
			return self.telnet.writeDont(option);
		});

	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'Control ONYX (formerly Martin M-Series) consoels with Companion! Enable telnet in ONYX Manager'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'ONYX Console IP',
			width: 6,
			default: '192.168.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 6,
			default: '2323',
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {

    'clearclear':               {label:'Clear Programmer',},
    'release_all_overrides':    {label:'Release All Overrides',},
    'release_all_cl':           {label:'Release All Cuelists',},
    'release_all_cl_df':        {label:'Release All Cuelist Dimmer First',},
    'release_all_cl_or_df':     {label:'Release All Cuelist and Override Dimmer First',},
    'release_all_cl_or':        {label:'Release All Cuelist and Override',},

		'command': {
			label:'Run Other Command',
			options: [
				{
					 type: 'textinput',
					 label: 'Command',
					 id: 'command',
					 default: '',
				}
			]
		},
    'go_list_cue': {
			label:'Go Cuelist',
			options: [
				{
					 type: 'textinput',
					 label: 'Cuelist Number',
					 id: 'cuelist',
					 default: '',
				}
			]
		},
    'go_schedule': {
      label:'Go Schedule',
      options: [
        {
           type: 'textinput',
           label: 'Schedule Number',
           id: 'schedule',
           default: '',
        }
      ]
    },
    'pause_cuelist': {
      label:'Pause Cuelist',
      options: [
        {
           type: 'textinput',
           label: 'Cuelist Number',
           id: 'cuelist',
           default: '',
        }
      ]
    },
    'release_cl': {
      label:'Release Cuelist',
      options: [
        {
           type: 'textinput',
           label: 'Cuelist Number',
           id: 'cuelist',
           default: '',
        }
      ]
    },
    'go_cue': {
      label:'Go Cue in Cuelist',
      options: [
        {
           type: 'textinput',
           label: 'Cuelist Number',
           id: 'cuelist',
           default: '',
        },
        {
           type: 'textinput',
           label: 'Cue Number',
           id: 'cue',
           default: '',
        }
      ]
    },


	});
}

instance.prototype.action = function(action) {
	var self = this;
	console.log("Sending some action", action);
  var cmd
  var opt = action.options

	switch (action.action) {

		case 'command':
			cmd = action.options.command;
			break;

    case 'clearclear':
      cmd = 'CLRCLR';
      break;

		case 'go_list_cue':
			cmd = 'GQL ' + opt.cuelist;
		  break;

    case 'go_schedule':
			cmd = 'GSC ' + opt.schedule;
			break;

    case 'go_cue':
			cmd = 'GTQ ' + opt.cuelist + ',' + opt.cue;
			break;

    case 'release_all_overrides':
      cmd = 'RAO';
      break;

		case 'release_all_cl':
			cmd = 'RAQL'
		  break;

    case 'release_all_cl_df':
			cmd = 'RAQLDF';
			break;

    case 'release_all_cl_or_df':
			cmd = 'RAQLODF';
			break;

    case 'release_all_cl_or':
			cmd = 'RAQLO';
			break;

    case 'release_cl':
      cmd = 'RQL ' + opt.cuelist;
      break;

	};

	if (cmd !== undefined) {

		if (self.socket !== undefined && self.socket.connected) {
			self.telnet.write(cmd+"\r\n");
		} else {
			debug('Socket not connected :(');
		}

	}
};

instance.module_info = {
	label: 'ONYX',
	id: 'obsidiancontrol-onyx',
	version: '1.0.0'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
