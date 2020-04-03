const initialState = {
  cart: [],
  tools: []
}

const reducer = (state = initialState, action) => {
    
    const { payload, type } = action
    let newState
    switch (type) {
      case "ADD_TOOL":
        var cart = state.cart
        cart.push(payload.tool)

        newState = {
          cart: cart,
          tools: state.tools
        }
        return Object.assign({}, newState )

      case "SET_TOOLS":
        newState = {
          cart: state.cart,
          tools: payload.tools,
        }
        return Object.assign({}, newState )        
      
      default:
        return state;
    }
  };

export default reducer