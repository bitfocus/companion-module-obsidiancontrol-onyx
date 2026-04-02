import { colors } from './utility/colors.js'

export function UpdatePresetDefinitions(self) {
	const presets = {}

	presets['clearProgrammer'] = {
		name: `Clear Programmer`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Clear Prog',
			size: 18,
			color: colors.black,
			bgcolor: colors.red,
		},
		steps: [
			{
				down: [{ actionId: 'clearProgrammer' , options: {} }],
				up: []
			},
		],
	}

	presets['releaseCuelists'] = {
		name: `Rel Cuelists`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Rel Cuelists',
			size: 18,
			color: colors.black,
			bgcolor: colors.red,
		},
		steps: [
			{
				down: [{ actionId: 'releaseCuelists' , options: {} }],
				up: []
			},
		],
	}

	presets['releaseOverides'] = {
		name: `Rel Overides`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Rel Overides',
			size: 18,
			color: colors.black,
			bgcolor: colors.red,
		},
		steps: [
			{
				down: [{ actionId: 'releaseOverides' , options: {} }],
				up: []
			},
		],
	}

	presets['releaseCuelistsDimFirst'] = {
		name: `Rel Cuelists/Dim`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Rel Cuelists/Dim',
			size: 18,
			color: colors.black,
			bgcolor: colors.red,
		},
		steps: [
			{
				down: [{ actionId: 'releaseCuelistsDimFirst' , options: {} }],
				up: []
			},
		],
	}

	presets['releaseAll'] = {
		name: `Rel All`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Rel All',
			size: 18,
			color: colors.black,
			bgcolor: colors.red,
		},
		steps: [
			{
				down: [{ actionId: 'releaseAll' , options: {} }],
				up: []
			},
		],
	}

	self.setPresetDefinitions(presets)
}
