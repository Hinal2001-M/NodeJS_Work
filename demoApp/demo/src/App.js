import logo from './logo.svg';
import './App.css';
import React,{Component} from 'react';
import Greet from './component/greet';
import Welcome from './component/welcome';

class App extends Component {
  render(){
  return (
    <div className="App">
      <Greet/>
      <Welcome/>
    </div>
  );
}
}

export default App;








      {/* <h2></h2> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World!!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}