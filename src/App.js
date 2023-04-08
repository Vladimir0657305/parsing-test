
import { useEffect } from 'react';
import { useState } from 'react';
import AmazonParser from './AmazonParser';
import './App.css';

// https://crm.ilist.gr

const API_URL = 'https://crm.ilist.gr';
function App() {
  const [fig, setFig] = useState({});

  useEffect(() => {
    fetch('/api/properties')
      .then(response => response.json())
      .then(data => setFig(data))
      .catch(error => {
        console.warn(error);
        alert('error');
      });
  }, []);



  return (
    <>
      <div><pre>{JSON.stringify(fig, null, 2)}</pre></div>
      <AmazonParser/>
    </>
  );
}

export default App;
