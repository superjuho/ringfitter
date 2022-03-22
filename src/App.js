
import './App.css';
import Nav from './components/Nav'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import HandView from './views/HandView';
import RingView from './views/RingView';


const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Nav></Nav>
      <Routes>
        <Route path="/" exact element={<HandView/>}/>
        <Route path="/AR" exact element={<RingView/>}/>
      </Routes>
    </Router>
  )
}

export default App;
