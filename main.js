import { InstanceBase, InstanceStatus } from '@companion-module/base'
import { configFields } from './src/config.js'
import { upgradeScripts } from './src/upgrades.js'
import { createTelnetClient } from "./src/telnet/client.js";

export default class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.activeCuelists = []
	}

	async init(config) {
		// The following runs when the module is opened for the first time or when the config is changed
		this.config = config

		await this.configUpdated(config)

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresetDefinitions()
	}

	// When module gets deleted or deactivated
	async destroy () {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.log('debug', 'Onyx module instance destroyed.')
	}

	async configUpdated(config) {
		if (self.socket) {
			self.socket.destroy()
			self.socket = null
		}

		this.config = config

		// Re-establish Telnet client
		if (self.config.host) {
			createTelnetClient(self)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return configFields
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresetDefinitions() {
		UpdatePresetDefinitions(this)
	}
}

export const UpgradeScripts = upgradeScripts


var instance_skel = require("../../instance_skel");

var debug;

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


instance.prototype.pollActiveCuelists = function() {
	var self = this;

	self.gettingActiveQL = true;
	self.activeCuelists = [];

	self.socket.write("QLActive\r\n");
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

