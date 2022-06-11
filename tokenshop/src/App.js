import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContractsState from './context/Contracts/ContractsState'

import MyAppBar from './views/AppBar';
import Home from './views/Home';
// import Shop from './views/Shop';

// Styles
import './App.css'

const App = () => {
  return (
    <div className="App">
      <ContractsState>
        <MyAppBar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ContractsState>
  </div>
  )
};

// <ContractsState>
//   <MyAppBar />
//   <Router>
//     <Routes>
//       <Route path="/shop" component={Shop} />
//       <Route exact path="/" component={Home} />
//     </Routes>
//   </Router>
// </ContractsState>

export default App;
