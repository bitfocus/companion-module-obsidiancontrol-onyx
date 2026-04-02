import { Regex } from '@companion-module/base'

export const configFields = [
	{
		type: 'static-text',
		id: 'info',
		width: 12,
		label: 'Information',
		value:
			'This module allows control of Onyx lighting consoles and PC setups using Telnet. Onyx has two different Telnet server setups, one through the lighting software itself and a second through a bundled utility called Onyx Manager. The Telnet capabilities of each are slightly different, and this module offers the capabilities of both, although you will need to enable both servers (on seperate ports) to make full use of this module.',
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
		default: '2323',
	},
	{
		type: 'checkbox',
		id: 'usingManager',
		label: 'Check if using ONYX Manager',
		disableAutoExpression: true,
	},
	{
		type: 'number',
		id: 'polling_interval',
		label: 'Polling Interval (ms)',
		width: 4,
		regex: Regex.NUMBER,
		default: 5000,
		min: 100,
	},
]
