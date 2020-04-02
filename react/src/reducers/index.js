const initialState = {
  cart: []
}

const reducer = (state = {}, action) => {
    switch (action.type) {
      // case "CRASH_IN_THE_REDUCER":
        // throw new Error("exception123");
      case "ADD_TOOL":
        return action.str;
      default:
        return state;
    }
  };

export default reducer