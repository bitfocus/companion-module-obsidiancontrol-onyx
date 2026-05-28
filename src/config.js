import { Regex } from '@companion-module/base'

export const configFields = [
	{
		type: 'static-text',
		id: 'info',
		width: 12,
		label: 'Information',
		value:
			'This module allows control of Onyx lighting consoles and PC setups using Telnet. ' +
			'Onyx has two different Telnet servers, one through the lighting software itself ' +
			'and a second through a bundled utility called Onyx Manager. ' +
			'It is recommended to use the built-in Telnet server (default port 23) for most actions ' +
			'and use a second instance of this module with Onyx Manager (default port 2323) if access ' +
			'to Onyx Manager\'s scheduler is required. '
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'ONYX Console IP',
		width: 6,
		regex: Regex.IP,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Port',
		width: 6,
		regex: Regex.PORT,
		default: '23',
	},
	{
		type: 'checkbox',
		id: 'usingManager',
		label: 'Using ONYX Manager',
		default: false,
		disableAutoExpression: true,
	},
	{
		type: 'textinput',
		id: 'polling_interval',
		label: 'Polling Interval (ms)',
		width: 4,
		isVisibleExpression: `$(options:usingManager) == true`,
		regex: Regex.NUMBER,
		default: 5000,
		min: 100,
	},
]
