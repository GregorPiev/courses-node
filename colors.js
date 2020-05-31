var colorSet = {
    Reset: "\x1b[0m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
   
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    Black: "\x1b[30m", 
    Cyan: "\x1b[36m",
    White: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
 };
 
 var funcNames = ["info", "log", "warn", "error"];
 var colors = [colorSet.Green, colorSet.Magenta, colorSet.Yellow, colorSet.Red, colorSet.Cyan];
 for (var i = 0; i < funcNames.length; i++) {
    let funcName = funcNames[i];
    let color = colors[i];
    let oldFunc = console[funcName];
    console[funcName] = function () {
        var args = Array.prototype.slice.call(arguments);
        if (args.length) {
            args = [color + args[0]].concat(args.slice(1), colorSet.Reset);
        }
        oldFunc.apply(null, args);
    };
 }
 
 // Test:
 /* console.info("Info is green.");
 console.log("Log is blue.");
 console.warn("Warn is orange.");
 console.error("Error is red.");
 console.info("--------------------");
 console.info("Formatting works as well. The number = %d", 123); */

 module.exports = funcNames;