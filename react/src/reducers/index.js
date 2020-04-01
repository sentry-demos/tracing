const reducer = (state = "Hello world!", action) => {
    switch (action.type) {
      case "CRASH_IN_THE_REDUCER":
        console.log('****CRASH_IN_THE_REDUCER******')
        throw new Error("exception123");
      case "UPDATE_MY_STATE":
        return action.str;
      default:
        return state;
    }
  };

export default reducer