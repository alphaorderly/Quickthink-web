import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import User from './state/User';
import Login from './screen/login/Login';
import Main from './screen/main/Main';
import CallBack from './Callback';
import './App.css';

const App = () => {

  const [user, setUser] = useRecoilState(User);

  return (
    <div>
      <Router>
        <Routes>
          <Route 
            exact
            path='/callback'
            element={
              <CallBack />
            }
          />
          <Route
            exact
            path='/'           
            element={
              user.token.length === 0
              ?
              <Navigate replace to={"/login"} />
              :
              <Navigate replace to={"/main"} />
            }
          />
          <Route
            path='/main/*'
            element={
              user.token.length === 0
              ?
              <Navigate replace to={"/login"} />
              :
              <Main />
            }
          />
          <Route
            path='/login'
            element={
              user.token.length === 0
              ?
              <Login />
              :
              <Navigate replace to={"/main"} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
