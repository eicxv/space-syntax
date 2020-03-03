const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_NETWORK_TYPE":
      if (action.payload === null) {
        return state;
      } else {
        return {
          ...state,
          settings: {
            ...state.settings,
            networkType: action.payload
          }
        };
      }
    case "SET_ANALYSIS_TYPE":
      if (action.payload === null) {
        return state;
      } else {
        return {
          ...state,
          settings: {
            ...state.settings,
            analysisType: action.payload
          }
        };
      }
    case "SET_BOUNDS":
      return {
        ...state,
        settings: {
          ...state.settings,
          bounds: action.payload
        }
      };
    case "SET_ACTIVE_SETTINGS":
      return {
        ...state,
        activeSettings: state.settings
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      };
    default:
      throw new Error("Invalid action type");
  }
};

export default Reducer;
