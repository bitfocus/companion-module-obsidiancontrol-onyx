export function UpdateActions(self) {
    async function sendCommand (cmd) {
        try {
            self.socket.send(cmd + '\r\n')
            self.log('info', 'Command sent: ${cmd}')
        } catch (err) {
            self.log('error', 'Error when sending command ${cmd}: ${err}')
        }
    }

    let actions = {}

    // Cuelist actions
    actions.goCuelist = {
        name: 'Go Cuelist',
        options: [
            {
                id: 'cuelist',
                type: 'number',
                label: 'Cuelist Number',
                default: 1,
            }
        ],
        callback: async (event) => {
            sendCommand(`GQL ${event.options.cuelist}`)
        }
    }

    actions.goToCue = {
        name: 'Go to Cue in Cuelist',
        options: [
            {
                id: 'cuelist',
                type: 'number',
                label: 'Cuelist Number',
                default: 1,
            },
            {
                id: 'cue',
                type: 'textinput',
                label: 'Cue Number',
                default: 1,
            }
        ],
        callback: async (event) => {
            sendCommand(`GTQ ${event.options.cuelist},${event.options.cue}`)
        }
    }

    actions.pauseCuelist = {
        name: 'Pause Cuelist',
        options: [
            {
                id: 'cuelist',
                type: 'number',
                label: 'Cuelist Number',
                default: 1,
            }
        ],
        callback: async (event) => {
            sendCommand(`PQL ${event.options.cuelist}`)
        }
    }

    actions.releaseCuelist = {
        name: 'Release Cuelist',
        options: [
            {
                id: 'cuelist',
                type: 'number',
                label: 'Cuelist Number',
                default: 1,
            }
        ],
        callback: async (event) => {
            sendCommand(`RQL ${event.options.cuelist}`)
        }
    }

    actions.setCuelistLevel = {
        name: 'Set Cuelist Level',
        options: [
            {
                id: 'cuelist',
                type: 'number',
                label: 'Cuelist Number',
                default: 1,
            },
            {
                id: 'level',
                type: 'number',
                label: 'Fader Level',
                default: 255,
                min: 0,
                max: 255
            }
        ],
        callback: async (event) => {
            sendCommand(`SQL ${event.options.cuelist},${event.options.level}`)
        }
    }

    // Schedule actions
    actions.goSchedule = {
        name: 'Go Schedule',
        options: [
            {
                id: 'schedule',
                type: 'number',
                label: 'Schedule Number',
                default: 1,
            }
        ],
        callback: async (event) => {
            sendCommand(`GSC ${event.options.schedule}`)
        }
    }

    // Programmer actions
    actions.clearProgrammer = {
        name: 'Clear Programmer',
        callback: async() => {
            sendCommand('CLRCLR')
        }
    }

    // General release actions
    actions.releaseOverides = {
        name: 'Release All Overides',
        callback: async() => {
            sendCommand('RAO')
        }
    }

    actions.releaseCuelists = {
        name: 'Release All Cuelists',
        options: [
            {
                id: 'dimFirst',
                type: 'checkbox',
                label: 'Release Dimmer First'
            }
        ],
        callback: async (event) => {
            let cmd = event.options.dimFirst ? 'RAQLDF' : 'RAQL'
            sendCommand(cmd)
        }
    }

    actions.releaseAll = {
        name: 'Release All Cuelists and Overides',
        callback: async() => {
            sendCommand('RAQLO')
        }
    }

    self.setActionDefinitions({actions})
}