

import React, { Component } from "react";


class ToolStore extends Component {

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
        return (        
        <div className="App">
        <main>
          <header>
            <h1>Online Hardware Store</h1>
          </header>

          /* <div className="inventory">
            {this.props.tools.length ? (
              <table>
                <tbody>
                {this.createTable()}
                </tbody>
              </table>
            ) : (
              <div>Loading...</div>
            )}
          </div>  */
        </main>
        <ShoppingCart/>
      </div>
    );}
  }

export default ToolStore;


