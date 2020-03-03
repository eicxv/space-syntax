import React from "react";

//material ui
import {
  Typography,
  Paper,
  Button,
  ButtonGroup,
  IconButton,
  Divider,
  Tooltip
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";

//icons
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

//custom components
import { Context } from "../Store";

const styles = theme => ({
  controls: {
    position: "relative",
    padding: "12px",
    margin: 0,
    zIndex: 1100,
    display: "flex",
    flexDirection: "column",
    transition: "all 200ms ease"
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 208,
    transition: "all 400ms ease",
    [theme.breakpoints.up("md")]: {
      margin: "16px"
    }
  },
  containerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1100
  },
  toggleButton: {
    position: "absolute",
    zIndex: 1050,
    left: "100%",
    top: "12px",
    transition: "all 200ms ease",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    [theme.breakpoints.up("md")]: {
      left: "calc(100% - 50px)"
    }
  },
  controlsClosed: {
    transform: "translateX(-100%)",
    [theme.breakpoints.up("md")]: {
      transform: "translateX(0%)"
    }
  },
  divider: {
    margin: "8px"
  },
  verticalButtonGroup: {
    display: "flex",
    flexDirection: "column"
    // margin: "0 auto"
  },
  grouped: {
    "&:first-child": {
      marginLeft: -1,
      borderTopRightRadius: 4,
      borderBottomLeftRadius: 0
    },
    "&:not(:first-child)": {
      borderRadius: 0
    },
    "&:not(:last-child)": {
      borderRightColor: "rgba(0, 0, 0, 0.23)",
      borderLeftColor: "rgba(0, 0, 0, 0.23)"
    },
    "&:last-child": {
      borderRightColor: "rgba(0, 0, 0, 0.23)",
      borderLeftColor: "rgba(0, 0, 0, 0.23)",
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4
    }
  }
});

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      controlsOpen: true
    };
  }
  static contextType = Context;

  toggleOpen = () => {
    this.setState(state => ({
      controlsOpen: !state.controlsOpen
    }));
  };

  updateNetworkType = (event, value) => {
    this.dispatch({ type: "SET_NETWORK_TYPE", payload: value });
  };

  updateAnalysisType = (event, value) => {
    this.dispatch({ type: "SET_ANALYSIS_TYPE", payload: value });
  };

  render() {
    [this.store, this.dispatch] = this.context;
    return (
      <div className={this.props.classes.containerWrapper}>
        <div
          className={`${this.props.classes.container} ${
            this.state.controlsOpen ? "" : this.props.classes.controlsClosed
          }`}
        >
          <Paper elevation={1} className={this.props.classes.toggleButton}>
            <IconButton size="medium" onClick={this.toggleOpen}>
              {this.state.controlsOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </IconButton>
          </Paper>
          <Paper elevation={3} className={this.props.classes.controls}>
            <Typography variant="subtitle2" gutterBottom>
              Select Area
            </Typography>
            {!this.props.selectAreaActive ? (
              <Button variant="outlined" onClick={this.props.startSelectArea}>
                Select Area
              </Button>
            ) : null}
            <ButtonGroup
              style={!this.props.selectAreaActive ? { display: "none" } : null}
            >
              <Button color="primary" onClick={this.props.confirmSelectArea}>
                Confirm
              </Button>
              <Button onClick={this.props.cancelSelectArea}>Cancel</Button>
            </ButtonGroup>
            <Divider className={this.props.classes.divider} />
            <Typography variant="subtitle2" gutterBottom>
              Network Type
            </Typography>
            <ToggleButtonGroup
              value={this.store.settings.networkType}
              exclusive={true}
              onChange={this.updateNetworkType}
              aria-label="road network type"
              size="small"
              className={this.props.classes.verticalButtonGroup}
              classes={{ grouped: this.props.classes.grouped }}
            >
              <Tooltip title="Select pedestrian road network">
                <ToggleButton
                  value="walk"
                  selected={this.store.settings.networkType === "walk"}
                  aria-label="pedestrian road network"
                >
                  <DirectionsWalkIcon />
                  <Typography variant="body2">Pedestrian</Typography>
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Select bike road network">
                <ToggleButton
                  value="bike"
                  selected={this.store.settings.networkType === "bike"}
                  aria-label="bike road network"
                >
                  <DirectionsBikeIcon />
                  <Typography variant="body2">Bike</Typography>
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Select car road network">
                <ToggleButton
                  value="drive"
                  selected={this.store.settings.networkType === "drive"}
                  aria-label="car road network"
                >
                  <DirectionsCarIcon />
                  <Typography variant="body2">Car</Typography>
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            <Divider className={this.props.classes.divider} />
            <Typography variant="subtitle2" gutterBottom>
              Analysis Type
            </Typography>
            <ToggleButtonGroup
              value={this.store.settings.analysisType}
              exclusive={true}
              onChange={this.updateAnalysisType}
              aria-label="network analysis type"
              size="small"
              className={this.props.classes.verticalButtonGroup}
              classes={{ grouped: this.props.classes.grouped }}
            >
              <Tooltip title="Select integration analysis">
                <ToggleButton
                  value="integration"
                  selected={this.store.settings.analysisType === "integration"}
                  aria-label="integration analysis"
                >
                  <Typography>Integration</Typography>
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Select betweenness analysis">
                <ToggleButton
                  value="betweenness"
                  selected={this.store.settings.analysisType === "betweenness"}
                  aria-label="betweenness analysis"
                >
                  <Typography>Betweenness</Typography>
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Select choice analysis">
                <ToggleButton
                  value="choice"
                  selected={this.store.settings.analysisType === "choice"}
                  aria-label="choice analysis"
                  disabled
                >
                  <Typography>Choice</Typography>
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            <Divider className={this.props.classes.divider} />
            <Button
              variant={this.props.settingsChanged ? "contained" : "outlined"}
              color="primary"
              disabled={
                this.store.settings.bounds === null ||
                this.props.selectAreaActive
              }
              size="large"
              onClick={this.props.getAnalysis}
            >
              Get Analysis
            </Button>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Controls);
