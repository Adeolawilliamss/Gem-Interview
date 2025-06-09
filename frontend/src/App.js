import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Login from './components/login';
import { AlertProvider } from './context/AlertContext';
import Alert from './context/Alert/Alert';
import Signup from './components/signup';
import Home from './components/home';

function App() {
  return (
    <AlertProvider>
      <Alert />
      <Layout>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Layout>
    </AlertProvider>
  );
}

export default App;
