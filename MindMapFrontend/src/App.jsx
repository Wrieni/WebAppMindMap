// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './App.css'
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';
// const router = createBrowserRouter([
//   {path: "/", element: <Home/>},
//   {path: "login", element: <Login/>},
//   {path: "register", element: <Register/>},
//   {path: "profile", element: <Profile/>},
//   {path: "*", element: <NotFound/>}
// ]);

// function App() {

//   // useEffect(() => {
//   //   fetch("https://localhost:7204/api/test")
//   //     .then(response => response.text())
//   //     .then(data => console.log(data))
//   //     .catch(error => console.error(error));
//   // }, [])

//   return <RouterProvider router = {router}/>;
// }



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
