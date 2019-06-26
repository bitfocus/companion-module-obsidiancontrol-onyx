var instance_skel = require("../../instance_skel");
var telnet = require("telnet-client");

var debug;
var log;

var reconnectTimer;
var pollTimer;

const STATUS_UNKNOWN = null;
const STATUS_OK = 0;
const STATUS_WARNING = 1;
const STATUS_ERROR = 2;

function instance(system, id, config) {
	var self = this;

	// Request id counter
	self.request_id = 0;
	self.login = false;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.status(1, "Initializing");
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

	if (self.tnc !== undefined) {
		self.tnc.destroy();
		delete self.tnc;
		self.login = false;
	}

	if (self.config.host) {
		self.tnc = new telnet();

		self.tnc.connect({
			host: self.config.host,
			port: self.config.port,
			shellPrompt: "",
			timeout: 1500,
			negotiationMandatory: false
		});

		if (reconnectTimer) {
			clearInterval(reconnectTimer);
		}

		self.tnc.on("ready", function(data) {
			self.status(STATUS_OK, "Connected");
			self.login = true;

			if (self.config.polling_interval > 0) {
				pollTimer = setInterval(
					pollActiveCuelists,
					self.config.polling_interval
				);
			}
		});

		self.tnc.on("close", function() {
			self.status(STATUS_ERROR, "Disconnected");
			if (!reconnectTimer) {
				reconnectTimer = setInterval(function() {
					self.init_tcp(), 5000;
				});
			}
		});
	}

	pollActiveCuelists = function() {
		self.gettingActiveQL = true;
		self.activeCuelists = [];
		self.tnc.send("QLActive", { waitfor: ".\r\n" }).then(function(data) {
			var lines = data.split("\r\n");
			lines.forEach(function each(line) {
				switch (line) {
					// Ignore lines that aren't part of the active cuelist list.
					case "200 Ok":
					case "200 ":
					case ".":
					case "":
					case "No Active Qlist in List":
						break;
					default:
						var id = parseInt(line.substring(0, 5));
						self.activeCuelists.push(id);
						break;
				}
			});
			self.checkFeedbacks("cuelist_active");
		});
	};
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

	clearInterval(pollTimer);
	clearInterval(reconnectTimer);
	if (self.tnc !== undefined) {
		self.tnc.destroy();
		delete self.tnc;
	}

	debug("destroy", self.id);
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit("instance_actions", self.id, {
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
		if (self.tnc !== undefined) {
			self.tnc.send(cmd + "\r\n");
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
