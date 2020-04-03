const initialState = {
  tools: [],
  cart: []
}

const reducer = (state = initialState, action) => {
    
    const { payload, type } = action
    let newState
    switch (type) {
      case "ADD_TOOL":
        
        var cart = state.cart
        cart.push(payload.tool)

        newState = {
          tools: state.tools,
          cart: cart
        }

        return Object.assign({}, newState )

      case "SET_TOOLS":
        newState = {
          tools: payload.tools,
          cart: state.cart
        }
        return Object.assign({}, newState )        
      
      default:
        return state;
    }
  };

export default reducer