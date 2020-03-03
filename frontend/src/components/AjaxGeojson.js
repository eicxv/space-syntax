import React from "react";

class AjaxGeojson extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      error: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.request !== prevProps.request) {
      this.load();
    }
  }

  load = () => {
    if (!this.props.request) return;

    fetch(this.props.request)
      .then(res => {
        return res.json();
      })
      .then(
        this.props.success,
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  render() {
    return null;
  }
}

export default AjaxGeojson;
