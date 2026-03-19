import { colors } from "./utility/colors.js"

// Generate array of objects for Companion 2.0 API preset creation
function generatePresetArray(id, num) {
    let tmp = []
    for (let i = 1; i <= num; i++) {
        tmp[i - 1] = {
            name: id + ' ' + i,
            value: i,
        }
    }
    return tmp
}

export function UpdatePresetDefinitions (self) {

    const presets = {
        goCuelist: {
            name: 'Go Cuelist X',
            type: 'simple',
            style: {
                text: `Go Cuelist $(local:cuelist)`,
                size: 14,
                bgcolor: colors.black,
                color: colors.white,
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'goCuelist',
                            options: {
                                cuelist: { isExpression: true, value: `$(local:cuelist)` },
                            },
                        },
                    ],
                    up: [],
                },
            ],
            localVariables: [
                { variableType: 'simple', variableName: 'cuelist', startupValue: 1 },
            ],
            feedbacks: [],
        }
    }

    const structure = [
        {
            id: 'goCuelist',
            name: 'Go Cuelist',
            definitions: [
                {
                    id: 'a',
                    presetId: 'goCuelist',
                    type: 'template',
                    templateVariableName: 'cuelist',
                    templateValues: generatePresetArray('goCuelist', 10)
                },
            ],
        },
    ]

    self.setPresetDefinitions(structure, presets)
}