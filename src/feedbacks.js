import { colors } from './utility/colors.js'

export async function UpdateFeedbacks(self) {
	self.setFeedbackDefinitions({
		ActiveCuelist: {
			name: 'Active Cuelist',
			type: 'boolean',
			defaultStyle: {
				bgcolor: colors.red,
				color: colors.black,
			},
			options: [
				{
					id: 'cuelist',
					type: 'number',
					label: 'Cuelist',
					default: 1,
					min: 1,
				},
			],
			callback: (feedback) => {
				return self.activeCuelists.indexOf(parseInt(feedback.options.cuelist)) > -1 ? true : false
			},
		},
	})
}
