
import { useEffect } from 'react';
import { useState } from 'react';
import AmazonParser from './AmazonParser';
// import Hidemy from './hidemy';
import Papa from 'papaparse';
import './App.css';



// https://crm.ilist.gr
// https://hidemy.name/ru/proxy-list/

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



  const puppeteer = require('puppeteer');
  const cheerio = require('cheerio');
  const ObjectsToCsv = require('objects-to-csv');
  // const net = require('net');
  // const tls = require('tls');
  // const url = require('url');
  // const assert = require('assert');
  // const { module } = require('module');


  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://hidemy.name/ru/proxy-list/');

    const content = await page.content();
    const $ = cheerio.load(content);

    const raw = $('tbody').html();
    const arr = raw.split('<td>');

    const parsedData = [];

    for (let i = 0; i < arr.length - 2; i += 7) {
      parsedData.push({
        field1: arr[i + 1].slice(0, -5),
        field2: arr[i + 2].slice(0, -5)
      });
    }

    await browser.close();

    const csv = new ObjectsToCsv(parsedData);
    await csv.toDisk('parsed_data.csv');

    console.log('Data has been parsed and saved to CSV file.');
  })();



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


      {/* <Hidemy /> */}
    </>
  );
}

export default App;
