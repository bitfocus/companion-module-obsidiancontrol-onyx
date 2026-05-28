export const upgradeScripts = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	function updateIDs (context, props) {
		const result = {
		updatedConfig: null,
		updatedSecrets: null,
		updatedActions: [],
		updatedFeedbacks: [],
		}

		for (const action of props.actions) {
			// Update action IDs
			switch(action.actionId) {
				case 'release_all_overrides':
					action.actionId = 'releaseOverrides'
					result.updatedActions.push(action)
					break
				case 'release_all_cl':
					action.actionId = 'releaseCuelists'
					result.updatedActions.push(action)
					break
				case 'release_all_cl_df':
					action.actionId = 'releaseCuelistsDimFirst'
					result.updatedActions.push(action)
					break
				case 'release_all_cl_or':
					action.actionId = 'releaseAll'
					result.updatedActions.push(action)
					break
				case 'clearclear':
					action.actionId = 'clearProgrammer'
					result.updatedActions.push(action)
					break
				case 'go_list_cue':
					action.actionId = 'goCuelist'
					result.updatedActions.push(action)
					break
				case 'pause_cuelist':
					action.actionId = 'pauseCuelist'
					result.updatedActions.push(action)
					break
				case 'release_cl':
					action.actionId = 'releaseCuelist'
					result.updatedActions.push(action)
					break
				case 'go_cue':
					action.actionId = 'goToCue'
					result.updatedActions.push(action)
					break
				case 'go_schedule':
					action.actionId = 'goSchedule'
					result.updatedActions.push(action)
					break
				default:
					break
			}
		}

		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId = 'cuelist_active') {
				feedback.feedbackId = 'ActiveCuelist'
				result.updatedFeedbacks.push(feedback)
			}
		}

		return result
	},
]
