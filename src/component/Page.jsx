import {
    AppBar,
    Container,
    makeStyles,
    Toolbar,
    Typography,
    Button,
    Select,
    MenuItem,
} from "@material-ui/core";
import useLocalStorage from "hooks/useLocalStorage";
import { useState } from "react";
import kuzzleService from "services/kuzzle/kuzzle.service";
import { actors, steps } from "constants";

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
    ...props
}) => {
    const classes = useStyles();

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
                        Reset to step 1
                    </Button>
                    <Button
                        disabled={stepIndex >= maxStepIndex}
                        onClick={onPlayStep}
                        className={classes.playButton}
                        variant="contained"
                        color="primary"
                    >
                        PLAY STEP
                    </Button>
                    {stepIndex < maxStepIndex &&
                        `Next: ${steps[stepIndex].name}`}
                </span>
                <span>
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
                    <Select
                        value={kuzzleIndex}
                        label="Kuzzle index"
                        onChange={(e) => setKuzzleIndex(e.target.value)}
                    >
                        {new Array(5).fill(0).map((v, index) => (
                            <MenuItem
                                value={`tenant-sdl-geodis${index + 1}`}
                            >
                                tenant-sdl-geodis{index + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </span>
            </Toolbar>
        </AppBar>
        <Container
            maxWidth="xl"
            className={classes.container}
            id="page-container"
            {...props}
        >
            {children}
        </Container>
    </>
);
};

export default Page;
