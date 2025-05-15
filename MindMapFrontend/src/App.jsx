import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
const router = createBrowserRouter([
  {path: "/", element: <Home/>},
  {path: "login", element: <Login/>},
  {path: "register", element: <Register/>},
  {path: "profile", element: <Profile/>}
]);

function App() {

  // useEffect(() => {
  //   fetch("https://localhost:7204/api/test")
  //     .then(response => response.text())
  //     .then(data => console.log(data))
  //     .catch(error => console.error(error));
  // }, [])

  return <RouterProvider router = {router}/>;
}



export default App
