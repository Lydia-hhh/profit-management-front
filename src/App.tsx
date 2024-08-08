import React, { Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
import DiagramAll from './components/layouts/DiagramAll';
import DiagramProfit from './components/layouts/DiagramProfit';
import PieChart from './components/layouts/PieChart';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home = React.lazy(() => import("./components/pages/Home"));
const Login = React.lazy(() => import('./components/pages/Login'));
const Item=React.lazy(()=>import('./components/pages/Item'));
const Test=React.lazy(()=>import('./components/pages/Test'));
const Portfolio=React.lazy(()=>import('./components/pages/Portfolio'));
const SearchItem=React.lazy(()=>import('./components/pages/SearchItem'));
function App() {
  return (
    <Router>
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/login' Component={Login} />
          <Route path='/item' Component={Item}/>
          <Route path='/test' Component={Test}/>
          <Route path='/portfolio' Component={Portfolio}></Route>
          <Route path='/search' Component={SearchItem}></Route>
        </Routes>
      </Suspense>

    </Router>
  );
}

export default App;
