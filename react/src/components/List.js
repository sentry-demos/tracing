import React, { Component } from "react";
import { connect } from 'react-redux';
import * as Sentry from '@sentry/react';
// import { Button } from 'react-bootstrap'


function notAFunctionError() {
  var someArray = [{ func: function () {}}];
  someArray[1].func();
}

function uriError() {
  decodeURIComponent('%');
}

function syntaxError() {
  eval('foo bar');
}

function rangeError() {
  throw new RangeError('Parameter must be between 1 and 100');
}


class List extends Component {
    render() {
      return (
        <div>
          <h2>Error Buttons</h2>
          <button variant="primary" onClick={notAFunctionError}>Not A Function</button>
          <button variant="primary" onClick={uriError}>URI Error</button>
          <button variant="primary" onClick={syntaxError}>Syntax Error</button>
          <button variant="primary" onClick={rangeError}>Range Error</button>
        </div>
      );
    }
  }

  export default connect(
    null,
  )(Sentry.withProfiler(List, { name: "List"}))
