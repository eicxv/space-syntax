import React from "react";
import { Path, withLeaflet, LeafletConsumer } from "react-leaflet";
import L from "leaflet";
import "leaflet-editable";
import "leaflet.path.drag";

class DraggableRectangle extends Path {
  createLeafletElement(props) {
    this.registerEventHandler = this.registerEventHandler.bind(this);
    return new L.Rectangle(props.bounds, this.getOptions(props));
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.bounds !== fromProps.bounds) {
      this.leafletElement.setBounds(toProps.bounds);
    }
    this.setStyleIfChanged(fromProps, toProps);
  }

  componentDidMount() {
    super.componentDidMount();
    this.leafletElement.enableEdit();
  }

  registerEventHandler(context) {
    if (this.props.onBoundsChange) {
      context.map.on("editable:vertex:dragend", () =>
        this.props.onBoundsChange(this.leafletElement._bounds)
      );
      context.map.on("editable:dragend", () =>
        this.props.onBoundsChange(this.leafletElement._bounds)
      );
    }
  }

  render() {
    return <LeafletConsumer>{this.registerEventHandler}</LeafletConsumer>;
  }
}

export default withLeaflet(DraggableRectangle);
