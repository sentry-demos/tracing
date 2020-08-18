const initialState = {
  cart: [],
  tools: []
}

const newState = (cart, tools) => {
  return {
    cart,
    tools
  }
}

const reducer = (state = initialState, action) => {
    
    const { payload, type } = action

    switch (type) {
      case "ADD_TOOL":
        var cart = state.cart.concat(payload.tool)
        return Object.assign({}, newState(cart, state.tools))

      case "RESET_CART":
        return Object.assign({}, newState([], state.tools))

      case "SET_TOOLS":
        return Object.assign({}, newState(state.cart, payload.tools))        
      
      default:
        return state;
    }
  };

export default reducer

