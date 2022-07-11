var exec = require('child_process').exec;
var os = require('os');

function puts(error, stdout, stderr) { console.log(stdout) }

// Run command depending on the OS
if (os.type() === 'Linux') 
   exec("npm run installdeps:other", puts); 
else if (os.type() === 'Darwin') 
   exec("npm run installdeps:other", puts); 
else if (os.type() === 'Windows_NT') 
   exec("npm run installdeps:windows", puts);
else
   throw new Error("Unsupported OS found: " + os.type());