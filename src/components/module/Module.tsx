import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ModuleData from "./ModuleData";
import AddIcon from '@mui/icons-material/Add';

export default function Module() {
    return (
        <>
            {/*Buttons*/}
            <Box sx={{display: 'flex', flexGrow: 1, justifyContent: 'flex-start', gap: 1}}>
                    <Button size="small" variant="contained" disableRipple={true} fullWidth={true}>Module A</Button>
                    <Button size="small" variant="contained" disableRipple={true} fullWidth={true}>Module B</Button>
                    <Button size="small" variant="contained" disableRipple={true} fullWidth={true}>Module C</Button>
                    <Button size="small" variant="contained" disableRipple={true} fullWidth={true}>Module D</Button>
                    <Button size="small" variant="outlined" color="warning" fullWidth={true} startIcon={<AddIcon />}>Add module</Button>
            </Box>

            {/*Table*/}
            <ModuleData/>
        </>
    )
}