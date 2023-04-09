
import { useEffect } from 'react';
import { useState } from 'react';
import AmazonParser from './AmazonParser';
import Papa from 'papaparse';
import './App.css';


// https://crm.ilist.gr

const API_URL = 'https://crm.ilist.gr';

function App() {
  const [fig, setFig] = useState({});
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setData(result.data);
      }
    });
  };

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

      <input type="file" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            <th>asinValue</th>
            <th>title</th>
            <th>imageProduct</th>
            <th>priceSymbol</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.asinValue}</td>
              <td className='products_title'>{row.title}</td>
              <td><img className='products_image' src={row.imageProduct} alt="Product" /></td>
              <td className='products_symbol'>{row.priceSymbol}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* <table>
        <thead>
          <tr>
            <th>ASIN</th>
            <th>Title</th>
            <th>Image</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.asinValue}>
              <td>{item.asinValue}</td>
              <td>{item.title}</td>
              <td>
                <img src={item.imageProduct} alt={item.title} />
              </td>
              <td>
                {item.priceSymbol}
                {item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </>
  );
}

export default App;
