const initialState = {
  cart: []
}

const reducer = (state = initialState, action) => {
  console.log('action', action)
    const { payload, type } = action
    switch (action.type) {
      // case "CRASH_IN_THE_REDUCER":
        // throw new Error("exception123");
      case "ADD_TOOL":
        var cart = state.cart
        cart.push(payload.tool)
        // console.log('CART', cart)
        console.log('STATE', state)
        const newstate = Object.assign({}, { cart: cart } )
        return newstate;
      default:
        return state;
    }
  };

export default reducer