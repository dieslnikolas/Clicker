import React, { MouseEvent } from 'react';
import logo from './logo.svg';
import './App.css';
const { ipcRenderer } = window.require('electron');
function App() {

    const handleMouseEvent = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (ipcRenderer) {
            console.log(`Calling backend`)
            const result = await ipcRenderer.invoke("getApiDetails");
            console.log("API Details", result);
            // setApiPort(arg.port); // setting apiPort causes useMemo'd appGlobalClient to be re-evaluated
            // setApiSigningKey(arg.signingKey);
        }
    };
    
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <button onClick={handleMouseEvent}>
                    Test API
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
