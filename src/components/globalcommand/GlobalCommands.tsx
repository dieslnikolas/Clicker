import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import AddIcon from '@mui/icons-material/Add';

export default function GlobalCommands() {
    return (
            <Box sx={{display: 'flex', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'flex-start', gap: 2}}>
                <Button>New</Button>
                <Button>Save</Button>
                <Button>Save as</Button>
                <Button>Metadata</Button>
                <Button variant="outlined" color="warning" startIcon={<AddIcon />}>Add</Button>
            </Box>
    );
}