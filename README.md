# Introduction 
- Angular application, with NodeJS backend and packed via ElectronJS

# Getting Started
- Fork this repository
- Instal Node.JS and NPM to your PC
- Run "npm install" to install missing node_modules
- To run as desktop app in chromium window run "npm run electron"
- To run as web app run "ng serve -o" (-o opens new tab right away)
- For other possible configurations check "package.json" in project root foolder

# Build
1) Open terminal/command line in the root folder of the application
2) Run "npm run electron" to start run application on development machine
3) It will recompile after every change (file save). You don't even need to refresh web page
4) For me VSCode with expansion "Debugger for Chrome" worked best - You can attach VSCode to Chrome procces and debug app directly


# FAQ
1) **An unhandled exception occurred: Cannot find module '@angular-devkit/build-angular/package.json'.**  
**How to fix this?**:  
run "npm install"

2) **blah blah.**  
**How to fix this?**:  
bla blah