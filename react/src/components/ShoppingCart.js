/*global Sentry*/
import React, { Component } from "react";
import "./App.css";

import * as Sentry from '@sentry/react';

import { connect } from 'react-redux'
import { resetCart } from '../actions'

const BACKEND = process.env.REACT_APP_BACKEND_LOCAL || process.env.REACT_APP_BACKEND

const monify = n => (n / 100).toFixed(2);

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        console.log('BACKEND is: ', BACKEND);
        this.state = {
          success: false,
          hasError: false
        };

        this.email =
          Math.random()
            .toString(36)
            .substring(2, 6) + "@yahoo.com";
    
        this.checkout = this.checkout.bind(this);
        this.resetCart = this.resetCart.bind(this);
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

      render() {
        const total = this.props.cart.reduce((total, item) => total + item.price, 0);
        const cartDisplay = this.props.cart.reduce((c, { id }) => {
          c[id] = c[id] ? c[id] + 1 : 1;
          return c;
        }, {});
    
        return (
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
        )
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
    { resetCart }
)(Sentry.withProfiler(ShoppingCart, { name: "ShoppingCart"}))
  