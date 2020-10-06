# Introduction 
- Angular application, with NodeJS backend and packed via ElectronJS
- Initial setup by this command: ng new app --directory ./ --minimal=true

# Getting Started

1) You'll have to instal Node and npm to your PC
2) I mainly used VSCode to maintain the application
3) It can comunicate with MSSQL database

# Build

1) Open terminam/command line in the root folder of the application
2) Run "ng serve --open" to start AngularJS server
3) It will recompile after every change (file save). You don't even need to refresh web page
4) For me VSCode with expansion "Debugger for Chrome" worked best

# FAQ
## Errors
1) TypeScript error - path is not relative
*Error* node_modules/typescript/lib/lib.d.ts): path is not relative
*Solution* https://github.com/angular/angular/issues/36777 - solves when I run _ng update_ and then _npm install_ again.

2) SourceTree client - cloning repository 
*Error* cannot authenticate user 
*Solution* https://jira.atlassian.com/browse/SRCTREEWIN-10800?workflowName=SourceTree+Bug+Workflow&stepId=8&_ga=2.244634374.221694306.1590573042-1954354477.1590573042 