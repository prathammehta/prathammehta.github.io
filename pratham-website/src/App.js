import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p className="App-para">Hi there,</p>
          <p className="App-para">I'm Pratham Mehta. Nice to meet you.</p>
          <p className="App-para">I make amazing apps.</p>
          <p className="App-para">Got an idea you'd like to see turned into an app?</p>
          <p><a className="App-anchor" href="mailto:me@prath.am">Let me know!</a></p>
        </header>
      </div>
    );
  }
}

export default App;
