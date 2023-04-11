import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { CSVReader, CSVDownloader } from 'react-papaparse';


function AmazonParser() {
    let paginator = '';
    let products = [];
    const [searchTerm, setSearchTerm] = useState('');


    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const SEARCH_URL = `https://www.amazon.com/s?k=`;
    const NEXT_URL = `https://www.amazon.com`;


    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        if (paginator) {
            let response = await axios.get(`${PROXY_URL}${SEARCH_URL}${searchTerm}`);
            products = parseProducts(response.data);
            // downloadCsv(products);
        } else if (paginator ) {
            const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
            setTimeout(() => {
                let response = axios.get(`${PROXY_URL}${NEXT_URL}${paginator}`);
                products = parseProducts(response.data);
                // downloadCsv(products);
            }, delayTime);
        } else {
            downloadCsv(products);
        }

        // console.log(products);

    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const parseProducts = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // console.log(doc);
        const products = [];

        paginator = doc.querySelector('li.a-last > a');
        console.log('paginator=', paginator?.href);

        doc.querySelectorAll('div[data-component-type="s-search-result"]').forEach((item) => {
            // console.log(item);
            const asinValue = item.dataset.asin;
            const title = item.querySelector('h2')?.textContent.trim() ?? '';
            const priceSymbol = item.querySelector('span.a-price-symbol')?.textContent.trim() ?? '';
            const priceWhole = item.querySelector('span.a-price-whole')?.textContent.trim() ?? '';
            const priceFraction = item.querySelector('span.a-price-fraction')?.textContent.trim() ?? '';
            const imageProductNew = item.querySelector('img.s-image')?.src.trim() ?? '';
            const imageProduct = imageProductNew.replace(/._.*(?=\.jpg)/, '') + ".jpg";
            // img.s-image
            // const price = parseFloat(`${priceWhole}.${priceFraction}`).toFixed(2);
            // if (priceWhole && priceFraction) {
            // price = parseFloat(`${priceWhole}.${priceFraction}`).toFixed(2);
            // }
            const price = priceWhole && priceFraction ? `${priceWhole}${priceFraction}` : "0";

            products.push({ asinValue, title, imageProduct, priceSymbol, price });
        });

        return products;
    };

    // setSearchTerm(paginator);

    const downloadCsv = (products) => {
        const csv = Papa.unparse(products);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        downloadLink.setAttribute('download', 'amazon-products.csv');
        downloadLink.click();
    };


    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
                <button type="submit">Parse Products</button>
            </form>
        </div>
    );
}

export default AmazonParser;
