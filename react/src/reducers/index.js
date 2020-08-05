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

// "when all activities are done" SPA
// specificy an idle timeout, to extend this...
// based on heuristics.
// 1 Browser metrics/resoureces
// 2 HXR's
// 3 Components

// load projects but navigate to a new URL....then sdk stops plageload TX, w/ tx status cancelled
// when navigation occurs, start a new transactions.
// user going to newTab cancels transaction
// ^ all these are configurable - "great defaults that worked really work at Senttry forus, and our customers so far"
// try to never lose the info (context/scope)

// maxTransaction exceeded so gets set as Status/time exceeded.

// 1
// Trends - what will happen in your tx's over long periods of time.

// 1-Month - angular integreation, support for react-router, @sentry/tracing
// 3-month - Tracing in React Native, PHP
// Q4 Sessions in JS. spec by end of Q3. Transactions+Sessions+Releases/Session+Errors
// 6m good story about sampling. tail-sampling. relay.