import { InstanceStatus, TelnetHelper } from '@companion-module/base'

// Function to send Telnet command to Onyx console
export async function sendCommand(cmd, self) {
	try {
		self.socket.send(cmd + '\r\n')
		self.log('info', `Command sent: ${cmd}`)
	} catch (err) {
		self.log('error', `Error when sending command ${cmd}: ${err}`)
	}
}

function getActiveCuelists(self) {
	self.activeCuelists = []
	if (self.socket && self.socket.isConnected) {
		sendCommand('QLActive', self)
	}
}

// Function to parse incoming data
function parseData(self, buffer) {
	const data = buffer.toString('utf8')
	self.buffer += data

	const lines = self.buffer.split(/\r?\n/)
	for (const line of lines) {
		if (line === '.') {
			self.buffer = ''
		} else if (!isNaN(parseInt(line))) {
			self.activeCuelists.push(parseInt(line))
			self.checkFeedbacks('ActiveCuelist') // Update feedbacks after active cuelist data received
		}
	}
	self.log('debug', `Received data: ${data}`)
	self.checkFeedbacks('cuelist_active')
}

// Create new TCP/Telnet socket and attempt to connect
export function createTelnetClient(self) {
	self.socket = new TelnetHelper(self.config.host, self.config.port, { reconnect: true, reconnect_interval: 2000 })

	self.socket.on('status_change', (status, message) => {
		self.log('debug', 'New status from telnet: ' + status + ' ' + message)
		self.updateStatus(status, message)
	})

	self.socket.on('connect', () => {
		self.log('debug', 'Connected to Onyx console')
		self.updateStatus(InstanceStatus.Ok)

		// Start polling for active cuelists, only if using ONYX Manager
		if (self.config.usingManager) {
			if (self.pollTimer) {
				clearInterval(self.pollTimer)
			}

			self.log('debug', `Polling interval: ${self.config.polling_interval}`)
			self.pollTimer = setInterval(() => {
				getActiveCuelists(self)
			}, self.config.polling_interval)
		}
	})

	self.socket.on('error', (err) => {
		self.log('error', 'Error with connection to console: ' + err.message)
		self.updateStatus(InstanceStatus.UnknownError, err.message)
		// reconnection logic
	})

	self.socket.on('close', (hadError) => {
		if (hadError) {
			self.log('error', 'Socket closed due to an error.')
		} else {
			self.log('error', 'Socket closed.')
		}
	})

	self.socket.on('data', (buffer) => {
		parseData(self, buffer)
	})
}
