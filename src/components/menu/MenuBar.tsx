import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import MenuSearch from "./MenuSearch";
import MenuUser from "./MenuUser";

export default function MenuBar() {
    return (
        <>
            <Box sx={{justifyContent: 'center'}}>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{flexGrow: 1}}> [PROJECT NAME] </Box>
                        <Box sx={{flexGrow: 1}}> <MenuSearch/> </Box>
                        <Box sx={{flexGrow: 1}}/>
                        <Box> <MenuUser/> </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}
