const initialState = {
  cart: [],
  tools: []
}

const reducer = (state = initialState, action) => {
    
    const { payload, type } = action

    switch (type) {
      case "ADD_TOOL":
        
        var cart = state.cart
        cart.push(payload.tool)

        const newstate = Object.assign({}, { cart: cart })
        return newstate;

      case "SET_TOOLS":
        return Object.assign({}, { tools: payload.tools, cart: state.cart })        
      
      default:
        return state;
    }
  };

export default reducer