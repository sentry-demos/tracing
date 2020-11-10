/*global Sentry*/
import React, { Component } from "react";
import ShoppingCart from './ShoppingCart';
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

  performXHRRequest(){
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json));
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
        <ShoppingCart/>
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
