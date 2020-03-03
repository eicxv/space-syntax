import hoistNonReactStatics from "hoist-non-react-statics";
import React, { createContext, forwardRef, useContext } from "react";

const leafletContext = createContext;

export const useLeaflet = () => useContext(leafletContext);

export const LeafletConsumer = leafletContext.Consumer;
export const LeafletProvider = leafletContext.Provider;

export const withLeaflet = WrappedComponent => {
  const WithLeafletComponent = (props, ref) => (
    <LeafletConsumer>
      {leaflet => <WrappedComponent {...props} leaflet={leaflet} ref={ref} />}
    </LeafletConsumer>
  );

  const name = // flowlint-next-line sketchy-null-string:off
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithLeafletComponent.displayName = `Leaflet(${name})`;

  const LeafletComponent = forwardRef(WithLeafletComponent);
  hoistNonReactStatics(LeafletComponent, WrappedComponent);

  return LeafletComponent;
};
