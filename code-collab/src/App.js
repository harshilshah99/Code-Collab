import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Editorpage from './components/Editorpage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster position='top-right'></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/editor/:roomId" element={<Editorpage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
