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
		name: `Release Cuelists`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Release\nCuelists',
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

	presets['releaseOverrides'] = {
		name: `Release Overrides`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Release\nOverrides',
			size: 18,
			color: colors.black,
			bgcolor: colors.red,
		},
		steps: [
			{
				down: [{ actionId: 'releaseOverrides' , options: {} }],
				up: []
			},
		],
	}

	presets['releaseCuelistsDimFirst'] = {
		name: `Release Cuelists/Dim First`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Rel Cue\nDimFir',
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
		name: `Release All`,
		category: 'Clear/Release',
		type: 'button',
		style: {
			text: 'Release\nAll',
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
