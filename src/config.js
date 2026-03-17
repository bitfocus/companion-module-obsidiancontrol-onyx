import { Regex } from "@companion-module/base";

export const configFields = [
    {
        type: "text",
        id: "info",
        width: 12,
        label: "Information",
        value:
            "Control ONYX consoles with Companion! Enable telnet in ONYX Manager"
    },
    {
        type: "textinput",
        id: "host",
        label: "ONYX Console IP",
        width: 6,
        regex: Regex.IP
    },
    {
        type: "textinput",
        id: "port",
        label: "Port",
        width: 6,
        regex: Regex.PORT,
        default: "2323"
    },
    {
        type: "number",
        id: "polling_interval",
        label: "Polling Interval (ms)",
        width: 4,
        regex: Regex.NUMBER,
        default: "5000",
        min: 100,
    }
]