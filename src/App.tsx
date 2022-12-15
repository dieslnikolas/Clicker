import React from 'react';
import logo from './logo.svg';
import './App.css';

const ipcRenderer = (window as any).isInElectronRenderer
    ? (window as any).nodeRequire("electron").ipcRenderer
    : (window as any).ipcRendererStub;
function App() {

  function getOnClick() {
      if (ipcRenderer) {
        ipcRenderer.on("apiDetails", ({}, argString: string) => {
          const arg: { port: number, signingKey: string } = JSON.parse(argString);
          // setApiPort(arg.port); // setting apiPort causes useMemo'd appGlobalClient to be re-evaluated
          // setApiSigningKey(arg.signingKey);
        });
        ipcRenderer.send("getApiDetails");
      }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={getOnClick}>
          Activate Lasers
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
