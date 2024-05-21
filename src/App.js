// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import EditorPage from './pages/editorPage';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
      <div>
        <Toaster position='top-center' toastOptions={
          {
            success: {
              duration: 3000,
              theme: {
                primary: 'blue',
                secondary: 'black',
              },
            },
            style: {
              background: '#1a1d2a',
              color: '#fff',
            },
          }
        }
        
        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/api/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
