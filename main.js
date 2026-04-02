import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { configFields } from './src/config.js'
import { upgradeScripts } from './src/upgrades.js'
import { createTelnetClient } from './src/telnet/client.js'
import { UpdateActions } from './src/actions.js'
import { UpdateVariableDefinitions } from './src/variables.js'
// import { UpdatePresetDefinitions } from './src/presets.js'
import { UpdateFeedbacks } from './src/feedbacks.js'

class ModuleInstance extends InstanceBase {
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
		// this.updatePresetDefinitions()
	}

	// When module gets deleted or deactivated
	async destroy() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.log('debug', 'Onyx module instance destroyed.')
	}

	async configUpdated(config) {
		// Delete Telnet client if it already exists (i.e. wasn't deleted by destroy function)
		if (this.socket) {
			this.socket.destroy()
			this.socket = null
		}

		this.config = config
		this.updateActions() // export actions
		this.setVariableValues({
			usingManager: this.config.usingManager,
		})

		// Create Telnet client
		if (this.config.host) {
			createTelnetClient(this)
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

	// updatePresetDefinitions() {
	// 	UpdatePresetDefinitions(this)
	// }
}

runEntrypoint(ModuleInstance, upgradeScripts)
