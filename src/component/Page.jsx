import {
    AppBar,
    Container,
    makeStyles,
    Toolbar,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
} from "@material-ui/core";
import { actors, steps } from "constants";
import {useTheme} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    container: {
        padding: "0 0 1rem 0",
        // height: 0,
        overflowX: "hidden",
        flex: "1000 1 auto",
        position: "relative",
        overflowY: "auto",
    },
    logo: {
        objectFit: "scale-down",
        maxHeight: "2rem",
        width: "auto",
        marginRight: "1rem",
    },
    toolbar: {
        position: "sticky",
        display: "flex",
        justifyContent: "space-between",
        top: 0,
    },
    bottomNav: {
        flexGrow: 1,
        position: "sticky",
        bottom: 0,
    },
    playButton: {
        marginRight: "1rem",
    },
}));

/**
 *
 * @param {string} path
 * @returns
 */

const Page = ({
    title,
    kuzzleIndex,
    setKuzzleIndex,
    actor,
    onActorChange,
    children,
    stepIndex,
    onPlayStep,
    onResetStep,
    sessions,
    canPlayStep3,
    currentSession,
    startSession,
    ...props
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const maxStepIndex = 3;
    return (
        <>
            <AppBar color="transparent" position="static" square>
                <Toolbar className={classes.toolbar}>
                    <span
                        style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <img
                            src="/logo192.png"
                            className={classes.logo}
                            alt="Logo"
                        />
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                    </span>
                    <span>
                        <Button
                            onClick={onResetStep}
                            className={classes.playButton}
                            variant="outlined"
                            color="secondary"
                        >
                            Start with step 1
                        </Button>
                        {stepIndex !== 0 ? <Button
                            disabled={stepIndex + 1 === 3 && !canPlayStep3}
                            onClick={onPlayStep}
                            className={classes.playButton}
                            variant="contained"
                            color="primary"
                        >
                            PLAY STEP {stepIndex + 1}
                        </Button> : ''}
                        {stepIndex + 1 <= maxStepIndex &&
                            `Next: ${steps[stepIndex + 1].name}`}
                    </span>
                    <span>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="actor-label">Persona</InputLabel>
                            <Select
                                value={actor.id}
                                style={{ marginRight: "1rem" }}
                                label="Kuzzle index"
                                onChange={onActorChange}
                            >
                                {actors.map((v) => (
                                    <MenuItem value={v.id}>{v.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField disabled id="simulation-dataset" label="Simulation Dataset" value={currentSession} />
                            {/* <InputLabel id="simulation-dataset-label">Simulation dataset</InputLabel>
                            <Select
                                value={currentSession}
                                label="Kuzzle index"
                                onChange={(e) => {
                                    startSession(e.target.value)
                                    setKuzzleIndex(`tenant-sdl-${e.target.value}`)
                                }}
                                style={{ minWidth: '10rem' }}
                                fullWidth
                            >
                                {sessions.map((session) => (
                                    <MenuItem
                                        value={session}
                                    >
                                        {session}
                                    </MenuItem>
                                ))}
                            </Select> */}
                        </FormControl>
                    </span>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth="xl"
                className={classes.container}
                id="page-container"
                style={{ overflowY: "auto" }}
                {...props}
            >
                {children}
                <footer style={{color: "gray", position: "fixed", bottom: 0, left: 0, width: "100%"}}>
                    <center style={{ display: "flex", alignItems: "middle", justifyContent: "center"}}>
                        <span style={{paddingTop: "5px", marginRight: "5px"}}>Conceived by</span>
                        <a target="_blank" href="https://geodis.com" style={{marginRight: "1rem"}}><img src="/geodis-mini.png" style={{ width: 73, height: 30}}/></a>
                        <span style={{paddingTop: "5px", marginRight: "5px"}}>Powered by</span>
                        <a target="_blank" href="https://kuzzle.io/"><img src="/kuzzle-mini.png" style={{ width: 73, height: 30}}/></a>
                    </center>
                </footer>
            </Container>
        </>
    );
};

export default Page;
