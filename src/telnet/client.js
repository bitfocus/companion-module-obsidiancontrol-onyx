import { InstanceStatus, TelnetHelper } from '@companion-module/base'

// Function to parse incoming data
function parseData(self, buffer) {
    const data = buffer.toString('utf8');
    self.buffer += data;

    const lines = self.buffer.split(/\r?\n/);
    for (const line of lines) {
        if (line === '.') {
            self.buffer = '';
        } else if (!isNaN(parseInt(line))) {
            self.activeCuelists.push(parseInt(line));
        }
    }
    this.log('debug', `Received data: ${data}`);
    this.checkFeedbacks('cuelist_active');
}

// Create new TCP/Telnet socket and attempt to connect
export function createTelnetClient(self) {
    self.socket = new TelnetHelper(self.config.host, self.config.port, { reconnect: true, reconnect_interval: 2000 })
    
    self.socket.on('status_change', (status, message) => {
        self.log('debug', "New status from telnet: " + status + " " + message)
        self.updateStatus(status, message);
    });

    self.socket.on('connect', () => {
        self.log('debug', 'Connected to Onyx console')
        self.updateStatus(InstanceStatus.Ok)
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

