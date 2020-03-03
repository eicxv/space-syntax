import React from "react";
import "./App.css";

//material ui
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

//custom components
import Store from "./Store";
import Main from "./Main";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#708A72"
    },
    secondary: {
      main: "#BF593A"
    }
  }
});

class App extends React.Component {
  render() {
    return (
      <Store>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </Store>
    );
  }
}

export default App;
