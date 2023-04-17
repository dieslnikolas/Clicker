import {ThemeProvider} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import createTheme from "@mui/material/styles/createTheme";
import * as React from "react";
import GlobalCommands from "./globalcommand/GlobalCommands";
import MenuBar from "./menu/MenuBar";
import Module from "./module/Module";
import Terminal from "./terminal/Terminal";

export default function Layout() {

    // Theme
    const darkTheme = createTheme({
        // palette: {
        //     mode: 'dark',
        // },
    });

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <ThemeProvider theme={darkTheme}>
                {/*Search Everywhere*/}
                <Box sx={{flexGrow: 1}}> <MenuBar/> </Box>
                {/*Global commands*/}
                <Box sx={{flexGrow: 1}}> <GlobalCommands/> </Box>
                {/*Table*/}
                <Box sx={{flexGrow: 1}}> <Module/> </Box>
                {/*Terminal*/}
                <Box sx={{flexGrow: 1}}> <Terminal/> </Box>
            </ThemeProvider>
        </Box>
    )
}