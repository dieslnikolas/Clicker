import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React, {useState} from 'react';
import Terminal, {ColorMode, TerminalOutput, TerminalInput} from 'react-terminal-ui';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';

export default function Terminaml() {
    const [lineData, setLineData] = useState([
        <TerminalOutput>Welcome to the React Terminal UI Demo!&#128075;</TerminalOutput>,
        <TerminalOutput></TerminalOutput>,
        <TerminalOutput>The following example commands are provided:</TerminalOutput>,
        <TerminalOutput>'clear' will clear the terminal.</TerminalOutput>,
    ]);

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    function onInput(input: string) {
        let ld = [...lineData];
        ld.push(<TerminalInput>{input}</TerminalInput>);
        
        // Clear command
        if (input.toLocaleLowerCase().trim() === 'clear') {
            ld = [];
        }
        // Unrecoginized command
        else if (input) {
            ld.push(<TerminalOutput>Unrecognized command</TerminalOutput>);
        }
        setLineData(ld);
    }

    return (

        // Terminal has 100% width by default so it should usually be wrapped in a container div
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} square={true} color="secondary">
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Terminal
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <Terminal name='Output'
                        // colorMode={ColorMode.Light}
                              onInput={onInput}
                              startingInputValue=""
                              prompt="$">
                        {lineData}
                    </Terminal>

                    <TerminalOutput></TerminalOutput>
                </Typography>
            </AccordionDetails>
        </Accordion>
    )
}