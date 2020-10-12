# `@Yoki/logger`
Logging utility, with timestamp and memory usage along with useful methods for logging, warning, and erroring.

`constructor(options?: LoggerOptions): Logger`
    - Constructor for the Logger utility

`Logger#warn(value: string)`
    - Yellow coloring WARNING type text

`Logger#log(value: string)`
    - Green coloring LOG type text

`Logger#error(value: string)`
    - Red coloring ERROR type text