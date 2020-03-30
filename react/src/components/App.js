/*global Sentry*/
import React, { Component } from "react";
import "./App.css";
import wrenchImg from "../assets/wrench.png";
import nailsImg from "../assets/nails.png";
import hammerImg from "../assets/hammer.jpeg";
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

const BACKEND = process.env.REACT_APP_BACKEND_LOCAL || process.env.REACT_APP_BACKEND

const monify = n => (n / 100).toFixed(2);
const getUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

class App extends Component {

  constructor(props) {
    super(props);
    console.log('BACKEND is: ', BACKEND);
    this.state = {
      cart: [],
      store: []
    };
    // generate random email
    this.email =
      Math.random()
        .toString(36)
        .substring(2, 6) + "@yahoo.com";

    // id, sku, name, img, price type, sku
    // this.store = [] // ???

    // this.store = [
    //   {
    //     id: "wrench",
    //     name: "Wrench",
    //     price: 500,
    //     img: wrenchImg
    //   },
    //   {
    //     id: "nails",
    //     name: "Nails",
    //     price: 25,
    //     img: nailsImg
    //   },
    //   {
    //     id: "hammer",
    //     name: "Hammer",
    //     price: 1000,
    //     img: hammerImg
    //   }
    // ];
    // console.log('before_newtools', this.store)
    this.buyItem = this.buyItem.bind(this);
    this.checkout = this.checkout.bind(this);
    this.resetCart = this.resetCart.bind(this);

    // generate unique sessionId and set as Sentry tag
    this.sessionId = getUniqueId();
    Sentry.configureScope(scope => {
      scope.setTag("session_id", this.sessionId);
    });
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
      scope.setTag("customerType", "medium-plan"); // custom-tag
    });

    //Will add an XHR Sentry breadcrumb
    // this.performXHRRequest();

    var newtools = await this.getTools();
    newtools = newtools.map(tool => {
      tool.image = hammerImg
      return tool
    })

    this.setState({ store: newtools });
  }

  buyItem(item) {

    const cart = [].concat(this.state.cart);
    cart.push(item);

    // UPDATE CART with state...

    this.setState({ cart, success: false });

    Sentry.configureScope(scope => {
      scope.setExtra('cart', JSON.stringify(cart));
    });
    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'User added ' + item.name + ' to cart',
      level: 'info'
    });
  }

  resetCart(event) {
    event.preventDefault();
    this.setState({ cart: [], hasError: false, success: false });

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

  async checkout() {
    const order = {
      email: this.email,
      cart: this.state.cart
    };

    ApmIntegrations.Tracing.startIdleTransaction('checkout',
      {op: 'successOp', transaction: 'successTransaction', sampled: true})

    const response = await fetch(`${BACKEND}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    }).catch((err) => { throw Error(err) });

    if (!response.ok) {
      throw new Error(response.status + " - " + (response.statusText || response.body));
    }

    this.setState({ success: true });
    return response;
  }

  async getTools() {
    const response = await fetch(`${BACKEND}/tools`, {
      method: "GET"
    })
    console.log('response', response)

    if (!response.ok) {
      throw new Error(response.status + " - " + (response.statusText || response.body));
    }

    return response.json()
  }

  render() {
    const total = this.state.cart.reduce((total, item) => total + item.price, 0);
    const cartDisplay = this.state.cart.reduce((c, { id }) => {
      // c[id] = c[id] ? c[id] + 1 : 1;
      c[id] = c[id] ? c[id] : c[id]
      return c;
    }, {});
    console.log('cartDisplay', cartDisplay)

    return (
      <div className="App">
        <main>
          <header>
            <h1>Online Hardware Store</h1>
          </header>

          <div className="inventory">
            {this.state.store.map(item => {
              const { name, id, image, price } = item;
              return (
                <div className="item" key={id}>
                  <div className="thumbnail">
                    <img src={image} alt="" />
                  </div>
                  <p>{name}</p>
                  <div className="button-wrapper">
                    <strong>${monify(price)}</strong>
                    <button onClick={() => this.buyItem(item)}>Buy!</button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        <div className="sidebar">
          <header>
            <h4>Hi, {this.email}!</h4>
          </header>
          <div className="cart">
            {this.state.cart.length ? (
              <div>
                {Object.keys(cartDisplay).map(id => {
                  const { name, price } = this.state.store.find(i => i.id === id);
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
            disabled={this.state.cart.length === 0}
          >
            Checkout
          </button>{" "}
          {this.state.cart.length > 0 && (
            <button onClick={this.resetCart} className="cart-reset">
              Empty cart
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default App;
