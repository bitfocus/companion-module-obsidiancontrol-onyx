**ONYX Lighting Consoles**

This module allows control of Onyx lighting consoles and PC setups using Telnet. Onyx has two different Telnet server setups, one through the lighting software itself and a second through a bundled utility called Onyx Manager. The Telnet capabilities of each are slightly different, and this module offers the capabilities of both, although you will need to enable both servers (on seperate ports) to make full use of this module.

### Available Commands

- Specific cuelist playback commands: go, pause/back, and release
- Activating a specific cue in a specific cuelist (cannot be done with ONYX Manager)
- Setting the level of a cuelist's playback fader
- Clearing the contents of the programmer
- General release commands: release all cuelists, release all cuelists dimmer first, release all overides, and release all cuelists and overides
- Activating a scheduled event (requires ONYX Manager)

### Getting Started

Follow [these instructions](https://support.obsidiancontrol.com/Content/Onyx_Manual/Networking/Telnet.htm) to enable Telnet in ONYX.

- Enable telnet in ONYX Manager.
- Enter the ONYX Console IP and Port (default of 2323).
- Choose the polling interval to refresh data.