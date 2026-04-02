import { sendCommand } from './telnet/client.js'

export function UpdateActions(self) {
	let actions = {}

	// Cuelist actions
	actions.goCuelist = {
		name: 'Go Cuelist',
		options: [
			{
				id: 'cuelist',
				type: 'textinput',
				useVariables: true,
				label: 'Cuelist Number',
				default: 1,
			},
		],
		callback: async (event) => {
			sendCommand(`GQL ${event.options.cuelist}`, self)
		},
	}

	actions.goToCue = {
		name: 'Go to Cue in Cuelist',
		options: [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				isVisibleExpression: `${self.config.usingManager == true}`,
				label: 'Information',
				value:
					'Point cue recall (i.e. cue 1.8) not supported while connected using ONYX Manager. See the module help for more info.',
			},
			{
				id: 'cuelist',
				type: 'textinput',
				useVariables: true,
				label: 'Cuelist Number',
				default: 1,
			},
			{
				id: 'cue',
				type: 'textinput',
				useVariables: true,
				label: 'Cue Number',
				default: 1,
			},
		],
		callback: async (event) => {
			sendCommand(`GTQ ${event.options.cuelist},${event.options.cue}`, self)
		},
	}

	actions.pauseCuelist = {
		name: 'Pause Cuelist',
		options: [
			{
				id: 'cuelist',
				type: 'textinput',
				useVariables: true,
				label: 'Cuelist Number',
				default: 1,
			},
		],
		callback: async (event) => {
			sendCommand(`PQL ${event.options.cuelist}`, self)
		},
	}

	actions.releaseCuelist = {
		name: 'Release Cuelist',
		options: [
			{
				id: 'cuelist',
				type: 'textinput',
				useVariables: true,
				label: 'Cuelist Number',
				default: 1,
			},
		],
		callback: async (event) => {
			sendCommand(`RQL ${event.options.cuelist}`, self)
		},
	}

	actions.setCuelistLevel = {
		name: 'Set Cuelist Level',
		options: [
			{
				id: 'cuelist',
				type: 'textinput',
				useVariables: true,
				label: 'Cuelist Number',
				default: 1,
			},
			{
				id: 'level',
				type: 'number',
				label: 'Fader Level',
				default: 255,
				min: 0,
				max: 255,
			},
		],
		callback: async (event) => {
			sendCommand(`SQL ${event.options.cuelist},${event.options.level}`, self)
		},
	}

	// Schedule actions
	actions.goSchedule = {
		name: 'Go Schedule (ONYX Manager)',
		options: [
			{
				id: 'schedule',
				type: 'textinput',
				useVariables: true,
				label: 'Schedule Number',
				default: 1,
			},
		],
		callback: async (event) => {
			if (self.config.usingManager) {
				sendCommand(`GSC ${event.options.schedule}`, self)
			} else {
				self.log('warn', 'Module not set up to use ONYX Manager. Please check config.')
			}
		},
	}

	// Programmer actions
	actions.clearProgrammer = {
		name: 'Clear Programmer',
		callback: async () => {
			sendCommand('CLRCLR', self)
		},
	}

	// General release actions
	actions.releaseOverides = {
		name: 'Release All Overides',
		callback: async () => {
			sendCommand('RAO', self)
		},
	}

	actions.releaseCuelists = {
		name: 'Release All Cuelists',
		options: [],
		callback: async (event) => {
			sendCommand('RAQL', self)
		},
	}

	actions.releaseCuelistsDimFirst = {
		name: 'Release All Cuelists Dimmer First',
		options: [],
		callback: async (event) => {
			sendCommand('RAQLDF', self)
		},
	}

	actions.releaseAll = {
		name: 'Release All Cuelists and Overides',
		callback: async () => {
			sendCommand('RAQLO', self)
		},
	}

	self.setActionDefinitions(actions)
}
