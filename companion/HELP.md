# ONYX Lighting Control

This module allows control of Onyx lighting consoles and PC setups using Telnet. Onyx has two different Telnet servers, one through the lighting software itself and a second through a bundled utility called Onyx Manager. It is recommended to use the built-in Telnet server (default port 23) for most actions and use a second instance of this module with Onyx Manager (default port 2323) if access to Onyx Manager's scheduler is required.

### Available Commands

- Specific cuelist playback commands: go, pause/back, and release
- Activating a specific cue in a specific cuelist
- Setting the level of a cuelist's playback fader
- Clearing the contents of the programmer
- General release commands: release all cuelists, release all cuelists dimmer first, release all overrides, and release all cuelists and overrides
- Activating a scheduled event (requires ONYX Manager)

### Getting Started

To enable Telnet in Onyx, go to [Menu]>Network-Remote>Telnet, activate the TCP protocol, and activate the network interface commands will be received on.

For Onyx Manager, go to Setup>Net Remote and check the enabled box under Telnet Remote Server. In the module config, check the box for Using Onyx Manager and choose the polling interval to refresh data.

More information regarding Onyx and Telnet can be found on the [Onyx support site](https://support.obsidiancontrol.com/Content/Onyx_Manual/Networking/Telnet.htm).