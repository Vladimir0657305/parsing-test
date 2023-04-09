
import { useEffect } from 'react';
import { useState } from 'react';
import AmazonParser from './AmazonParser';


// https://crm.ilist.gr

const API_URL = 'https://crm.ilist.gr';

function App() {
  const [fig, setFig] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("amazon-products.csv");
      const data = await response.text();

      const rows = data.split("\n").map((row) => row.split(","));
      const headers = rows.shift();
      const products = rows.map((row) =>
        headers.reduce(
          (obj, key, i) => ({ ...obj, [key]: row[i] }),
          {}
        )
      );
      setProducts(products);
    }

    fetchData();
  }, []);


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

      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.title}</h2>
          <img src={product.imageProduct} alt={product.title} />
          <p>{product.price}</p>
        </div>
      ))}


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
