import './App.css';
import TaskCreate from './components/TaskCreate';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <div>
        <ToastContainer/>
        <TaskCreate/>
      </div>
    </>
  )
}

export default App
