var tcp = require("../../tcp");
var instance_skel = require("../../instance_skel");
var TelnetSocket = require("../../telnet");

var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// Request id counter
	self.request_id = 0;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.status(self.STATUS_WARNING, "Initializing");
	self.actions(); // export actions

	self.activeCuelists = [];

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
	self.init_feedbacks();
};

instance.prototype.init_tcp = function() {
	var self = this;
	self.buffer = "";

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new TelnetSocket(self.config.host, self.config.port);

		self.socket.on("status_change", function(status, message) {
			self.status(status, message);
		});

		self.socket.on("connect", function() {
			if (self.config.polling_interval > 0) {
				if (self.pollTimer) {
					clearInterval(self.pollTimer);
				}

				self.pollTimer = setInterval(function() {
					self.pollActiveCuelists();
				}, self.config.polling_interval);
			}
		});

		self.socket.on("error", function(err) {
			debug("Network error", err);
			self.log("error", "Network error: " + err.message);
		});

		// if we get any data, display it to stdout
		self.socket.on("data", function(buffer) {
			var indata = buffer.toString("utf8");
			self.buffer += indata;

			var lines = self.buffer.split("\r\n");
			if (lines.indexOf(".") === -1) {
				return;
			}

			lines.forEach(function each(line) {
				switch (line) {
					// Ignore lines that aren't part of the active cuelist list.
					case "200 Ok":
					case "200 ":
					case "":
					case "No Active Qlist in List":
						break;
					case ".":
						self.buffer = "";
					default:
						var id = parseInt(line.substring(0, 5));
						if (!isNaN(id)) {
							self.activeCuelists.push(id);
						}
						break;
				}
			});
			self.checkFeedbacks("cuelist_active");
		});

		self.socket.on("do", function(type, info) {
			// tell remote we WONT do anything we're asked to DO
			if (type == "DO") {
				self.socket.write(new Buffer([255, 252, info]));
			}

			// tell the remote DONT do whatever they WILL offer
			if (type == "WILL") {
				self.socket.write(new Buffer([255, 254, info]));
			}
		});
	}
};

instance.prototype.pollActiveCuelists = function() {
	var self = this;

	self.gettingActiveQL = true;
	self.activeCuelists = [];

	self.socket.write("QLActive\r\n");
};

// Return config fields for web config
instance.prototype.config_fields = function() {
	var self = this;

	return [
		{
			type: "text",
			id: "info",
			width: 12,
			label: "Information",
			value:
				"Control ONYX (formerly Martin M-Series) consoles with Companion! Enable telnet in ONYX Manager"
		},
		{
			type: "textinput",
			id: "host",
			label: "ONYX Console IP",
			width: 6,
			default: "192.168.0.1",
			regex: self.REGEX_IP
		},
		{
			type: "textinput",
			id: "port",
			label: "Port",
			width: 6,
			default: "2323"
		},
		{
			type: "textinput",
			id: "polling_interval",
			label: "Polling Interval (ms)",
			width: 4,
			default: "5000"
		}
	];
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.pollTimer) {
		clearInterval(self.pollTimer);
		delete self.pollTimer;
	}

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	debug("destroy", self.id);
};

instance.prototype.actions = function() {
	var self = this;

	self.setActions({
		clearclear: { label: "Clear Programmer" },
		release_all_overrides: { label: "Release All Overrides" },
		release_all_cl: { label: "Release All Cuelists" },
		release_all_cl_df: { label: "Release All Cuelist Dimmer First" },
		release_all_cl_or_df: {
			label: "Release All Cuelist and Override Dimmer First"
		},
		release_all_cl_or: { label: "Release All Cuelist and Override" },

		command: {
			label: "Run Other Command",
			options: [
				{
					type: "textinput",
					label: "Command",
					id: "command",
					default: ""
				}
			]
		},
		go_list_cue: {
			label: "Go Cuelist",
			options: [
				{
					type: "textinput",
					label: "Cuelist Number",
					id: "cuelist",
					default: ""
				}
			]
		},
		go_schedule: {
			label: "Go Schedule",
			options: [
				{
					type: "textinput",
					label: "Schedule Number",
					id: "schedule",
					default: ""
				}
			]
		},
		pause_cuelist: {
			label: "Pause Cuelist",
			options: [
				{
					type: "textinput",
					label: "Cuelist Number",
					id: "cuelist",
					default: ""
				}
			]
		},
		release_cl: {
			label: "Release Cuelist",
			options: [
				{
					type: "textinput",
					label: "Cuelist Number",
					id: "cuelist",
					default: ""
				}
			]
		},
		go_cue: {
			label: "Go Cue in Cuelist",
			options: [
				{
					type: "textinput",
					label: "Cuelist Number",
					id: "cuelist",
					default: ""
				},
				{
					type: "textinput",
					label: "Cue Number",
					id: "cue",
					default: ""
				}
			]
		}
	});
};

instance.prototype.action = function(action) {
	var self = this;
	var cmd;
	var opt = action.options;

	switch (action.action) {
		case "command":
			cmd = action.options.command;
			break;

		case "clearclear":
			cmd = "CLRCLR";
			break;

		case "go_list_cue":
			cmd = "GQL " + opt.cuelist;
			break;

		case "go_schedule":
			cmd = "GSC " + opt.schedule;
			break;

		case "go_cue":
			cmd = "GTQ " + opt.cuelist + "," + opt.cue;
			break;

		case "release_all_overrides":
			cmd = "RAO";
			break;

		case "release_all_cl":
			cmd = "RAQL";
			break;

		case "release_all_cl_df":
			cmd = "RAQLDF";
			break;

		case "release_all_cl_or_df":
			cmd = "RAQLODF";
			break;

		case "release_all_cl_or":
			cmd = "RAQLO";
			break;

		case "release_cl":
			cmd = "RQL " + opt.cuelist;
			break;
	}

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.write(cmd + "\r\n");
		} else {
			debug("Socket not connected :(");
		}
	}
};

instance.prototype.init_feedbacks = function() {
	var self = this;

	var feedbacks = {};
	feedbacks["cuelist_active"] = {
		label: "Active Cuelist",
		description:
			"If the specified cuelist is active, change colors of the bank",
		options: [
			{
				type: "colorpicker",
				label: "Foreground color",
				id: "fg",
				default: self.rgb(255, 255, 255)
			},
			{
				type: "colorpicker",
				label: "Background color",
				id: "bg",
				default: self.rgb(0, 255, 0)
			},
			{
				type: "textinput",
				label: "Cuelist Number",
				id: "index",
				default: 0,
				regex: self.REGEX_NUMBER
			}
		]
	};

	self.setFeedbackDefinitions(feedbacks);
};

instance.prototype.feedback = function(feedback, bank) {
	var self = this;
	if (feedback.type == "cuelist_active") {
		if (self.activeCuelists.indexOf(parseInt(feedback.options.index)) > -1) {
			return { color: feedback.options.fg, bgcolor: feedback.options.bg };
		}
	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
