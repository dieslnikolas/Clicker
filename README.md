# Introduction 
- Angular => NodeJS Web App with TypeScript
- Initial setup by this command: ng new app --directory ./ --minimal=true
- It is for learning purposes mainly
- It should be an application for creating db structures, generating code and maintain users, roles, etc.

# Getting Started
I am using several tools to develop this application

1) Visual Studio 2019 Community
2) MS SQL Management Studio 
3) Visual Studio Code
4) SourceTree (git client)

# Build
It is TypeScript web application so it runs using NodeJS server. 

1) Open terminam/command line in the root folder of the application
2) Run "ng serve" to start AngularJS server
3) It will recompile after every change. You don't even need to refresh web page
4) You will need to instal DB using script TODO:

# FAQ
## Errors
1) TypeScript error - path is not relative
*Error* node_modules/typescript/lib/lib.d.ts): path is not relative
*Solution* https://github.com/angular/angular/issues/36777 - solves when I run _ng update_ and then _npm install_ again.

2) SourceTree client - cloning repository 
*Error* cannot authenticate user 
*Solution* https://jira.atlassian.com/browse/SRCTREEWIN-10800?workflowName=SourceTree+Bug+Workflow&stepId=8&_ga=2.244634374.221694306.1590573042-1954354477.1590573042 
           
# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)