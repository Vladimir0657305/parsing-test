import { useEffect, useState } from 'react';
import AmazonParser from './AmazonParser';
import McbatxParser from './McbatxParser';
import Papa from 'papaparse';
import './App.css';



// https://crm.ilist.gr
// https://hidemy.name/ru/proxy-list/
// использовать прокси-сервер

const API_URL = 'https://crm.ilist.gr';


function App() {
  const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
  const SEARCH_URL = `https://hidemy.name/ru/proxy-list/`;
  const [fig, setFig] = useState({});
  const [data, setData] = useState([]);
  const [proxyData, setProxyData] = useState('');
  const [error, setError] = useState(null);

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



  
  

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${PROXY_URL}${SEARCH_URL}`);
          const data = await response.text();
          // console.log(data);
          const raw = data.split('tbody>')[1].split('</tbody')[0];
          const arr = raw.split("<td>");
          for (let i = 0; i < arr.length - 2; i += 7) {
            console.log(arr[i + 1].slice(0, -5), arr[i + 2].slice(0, -5));
          }
          setProxyData(raw); // сохраняем "сырой" контент таблицы в состоянии компонента
        } catch (error) {
          setError('Failed to fetch data');
          console.error(error);
        }
      };

      fetchData();
    }, []);

  




  return (
    <>
      <div><pre>{JSON.stringify(fig, null, 2)}</pre></div>
      {/* <AmazonParser/> */}
      <McbatxParser/>

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


      {/* <h1>Пример использования прокси-сервера в React</h1>
      <pre>{proxyData}</pre> */}

    </>
  );
}

export default App;
