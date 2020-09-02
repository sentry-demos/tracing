/*global Sentry*/
import React, { Component } from "react";
import "./App.css";
import wrenchImg from "../assets/wrench.png";
import nailsImg from "../assets/nails.png";
import hammerImg from "../assets/hammer.png";
import * as Sentry from '@sentry/react';

import { connect } from 'react-redux'
import { addTool, resetCart, setTools } from '../actions'

const BACKEND = process.env.REACT_APP_BACKEND_LOCAL || process.env.REACT_APP_BACKEND

const monify = n => (n / 100).toFixed(2);
const getUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

class App extends Component {

  constructor(props) {
    super(props);
    console.log('BACKEND is: ', BACKEND);
    this.state = {
      success: false,
      hasError: false
    };
    // generate random email
    this.email =
      Math.random()
        .toString(36)
        .substring(2, 6) + "@yahoo.com";

    this.buyItem = this.buyItem.bind(this);
    this.checkout = this.checkout.bind(this);
    this.resetCart = this.resetCart.bind(this);

    // generate unique sessionId and set as Sentry tag
    this.sessionId = getUniqueId();
    Sentry.configureScope(scope => {
      scope.setTag("session_id", this.sessionId);
    });
  }

  getPlanName() {
    const plans = ["medium-plan", "large-plan", "small-plan", "enterprise"];
    return plans[Math.floor(Math.random() * plans.length)];
  }

  async componentDidMount() {
    const defaultError = window.onerror;
    window.onerror = error => {
      this.setState({ hasError: true, success: false });
      defaultError(error);
    };
    // Add context to error/event
    Sentry.configureScope(scope => {
      scope.setUser({ email: this.email }); // attach user/email context
      scope.setTag("customerType", this.getPlanName()); // custom-tag
    });

    //Will add an XHR Sentry breadcrumb
    // this.performXHRRequest();

    var tools = await this.getTools();
    tools = tools.map(tool => {
      switch(tool.type) {
        case "hammer":
          tool.image = hammerImg
          return tool
        case "wrench":
          tool.image = wrenchImg
          return tool
        case "nails":
          tool.image = nailsImg
          return tool
        default:
          tool.image = nailsImg
          return tool
      }
    })

    // Sentry Transaction, include the tools data as a span
    const transaction = Sentry.getCurrentHub()
      .getScope()
      .getTransaction();

    if (transaction) {
      let span = transaction.startChild({
        data: { toolsData: tools },
        op: "tools received",
        description: "tools were received",
      });
      span.finish();
    }

    this.props.setTools(tools)
  }

  buyItem(item) {

    this.setState({ success: false });

    this.props.addTool(item)


    Sentry.configureScope(scope => {
      scope.setExtra('cart', JSON.stringify(this.props.cart));
    });

    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'User added ' + item.name + ' to cart',
      level: 'info'
    });
  }

  resetCart(event) {
    event.preventDefault();
    this.props.resetCart([])
    this.setState({ hasError: false, success: false });

    Sentry.configureScope(scope => {
      scope.setExtra('cart', '');
    });
    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'User emptied cart',
      level: 'info'
    });
  }

  performXHRRequest(){
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json));
  }

  async performCheckoutOnServer (order) {
    let response = await fetch(`${BACKEND}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "email": this.email
      },
      body: JSON.stringify(order)
    }).catch((err) => { throw Error(err) });

    if (!response.ok) {
      Sentry.captureException(new Error(response.status + " - " + (response.statusText || "INTERNAL SERVER ERROR")))
      this.setState({ hasError: true, success: false });
    }
    
    return { httpResponseData: response.status + " - " + response.statusText }
  }

  async checkout() {
    const order = {
      cart: this.props.cart
    };

    // ----------- Sentry Start Transaction ------------------------
    let transaction = Sentry.startTransaction({ name: "checkout" });
    Sentry.configureScope(scope => scope.setSpan(transaction));
    // -------------------------------------------------------------

    let data = await this.performCheckoutOnServer(order)

    // ----------- Sentry Finish Transaction -----------------------
    const span = transaction.startChild({
      data,
      op: 'task',
      description: `processing shopping cart result`,
    });

    span.finish()
    transaction.finish();
    // -------------------------------------------------------------
  }

  async getTools() {
    const response = await fetch(`${BACKEND}/tools`, {
      method: "GET",
      headers: {
        'email': this.email
      }
    })

    if (!response.ok) {
      throw new Error(response.status + " - " + (response.statusText || response.body));
    }

    return response.json()
  }

  createTable() {
      let table = []
      let tools = this.props.tools

      // Outer loop to create parent
      let number_of_columns = 5
      let number_of_rows = Math.ceil(this.props.tools.length / number_of_columns)

      for (let i = 0; i < number_of_rows; i++) {
        let children = []
        //Inner loop to create children
        for (let j = i * number_of_columns; j < ((i * number_of_columns) + number_of_columns); j++) {
          if(typeof tools[j] === 'undefined'){
             break
          }
          else {
            let tool = tools[j]
            children.push(
              <td className="item" key={tool.id}>
                <div className="thumbnail">
                  <img src={tool.image} alt="" />
                </div>
                <p>{tool.name}</p>
                <div className="button-wrapper">
                  <strong>${monify(tool.price)}</strong>
                  <button onClick={() => this.buyItem(tool)}>Buy!</button>
                </div>
              </td>
            )
          }
        }
        //Create the parent and add the children
        table.push(<tr key={i}>{children}</tr>)
      }
      return table
  }

  render() {
    const total = this.props.cart.reduce((total, item) => total + item.price, 0);
    const cartDisplay = this.props.cart.reduce((c, { id }) => {
      c[id] = c[id] ? c[id] + 1 : 1;
      return c;
    }, {});

    return (
      <div className="App">
        <main>
          <header>
            <h1>Online Hardware Store</h1>
          </header>

          <div className="inventory">
            {this.props.tools.length ? (
              <table>
                <tbody>
                {this.createTable()}
                </tbody>
              </table>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </main>
        <div className="sidebar">
          <header>
            <h4>Hi, {this.email}!</h4>
          </header>
          <div className="cart">
            {this.props.cart.length ? (
              <div>
                {Object.keys(cartDisplay).map(id => {
                  const { name, price } = this.props.tools.find(i => i.id === parseInt(id))
                  const qty = cartDisplay[id];
                  return (
                    <div className="cart-item" key={id}>
                      <div className="cart-item-name">
                        {name} x{qty}
                      </div>
                      <div className="cart-item-price">
                        ${monify(price * qty)}
                      </div>
                    </div>
                  );
                })}
                <hr />
                <div className="cart-item">
                  <div className="cart-item-name">
                    <strong>Total</strong>
                  </div>
                  <div className="cart-item-price">
                    <strong>${monify(total)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              "Your cart is empty"
            )}
          </div>
          {this.state.hasError && (
            <p className="cart-error">Something went wrong</p>
          )}
          {this.state.success && (
            <p className="cart-success">Thank you for your purchase!</p>
          )}
          <button
            onClick={this.checkout}
            disabled={this.props.cart.length === 0}
          >
            Checkout
          </button>{" "}
          {this.props.cart.length > 0 && (
            <button onClick={this.resetCart} className="cart-reset">
              Empty cart
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cart: state.cart,
    tools: state.tools
  }
}

export default connect(
  mapStateToProps,
  { addTool, resetCart, setTools }
)(Sentry.withProfiler(App, { name: "ToolStore"}))
