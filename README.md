# Backend 
- Minimal REST API NET 7.0

# Frontend
- Electron 
- React
- Typescript 

# Configuration files
- **tsconfig.json** - is the configuration file for TS for the React app 
- **tsconfig.electron.json** - is the configuration file for TS for Electron 
- **package.json** - is the main configuration file for the node project. It contains the list of dependencies, scripts, and other metadata.
- **tslint.json** - is the configuration file for the TSLint tool, which is used to enforce coding standards.
- **.gitignore** - is the configuration file for the git tool, which is used to ignore files and folders from the git repository.
- **backend/.gitignore** - is the configuration file for the .NET 7.0 project. It contains the list of files and folders to ignore from the git repository.

# Folder structure
- .idea - is the folder for the Rider IDE
- backend - contains the backend code createt in NET 7.0
- electron - contains the electron code. It is the main entry point for the app
- public/src - contains the React code

# How to run the app
- Install the dependencies: `npm install`
- Run the app: `npm run start`
- Build the app: `npm run build`
- It should open electron, start dotnet cli restapi and start react app. You can of course run them separately. Or even without electron.