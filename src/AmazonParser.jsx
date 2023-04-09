import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function AmazonParser() {
    const [searchTerm, setSearchTerm] = useState('');


    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const SEARCH_URL = `https://www.amazon.com/s?k=`;

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.get(`${PROXY_URL}${SEARCH_URL}${searchTerm}`);
        const products = parseProducts(response.data);
        downloadCsv(products);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // const handleSearchSubmit = async (event) => {
    //     event.preventDefault();
    //     const response = await axios.get(`https://www.amazon.com/s?k=${searchTerm}`);
    //     console.log(response);
    //     const products = parseProducts(response.data);
    //     downloadCsv(products);
    // };

    const downloadCsv = (products) => {
        const csv = Papa.unparse(products);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        downloadLink.setAttribute('download', 'amazon-products.csv');
        downloadLink.click();
    };

    const parseProducts = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const products = [];

        doc.querySelectorAll('div[data-component-type="s-search-result"]').forEach((item) => {
            let price = 0;
            console.log(item);
            const asinValue = item.dataset.asin;
            const title = item.querySelector('h2')?.textContent.trim() ?? '';
            const priceSymbol = item.querySelector('span.a-price-symbol')?.textContent.trim() ?? '';
            const priceWhole = item.querySelector('span.a-price-whole')?.textContent.trim() ?? '';
            const priceFraction = item.querySelector('span.a-price-fraction')?.textContent.trim() ?? '';
            // const price = parseFloat(`${priceWhole}.${priceFraction}`).toFixed(2);
            if (priceWhole && priceFraction) {
                price = parseFloat(`${priceWhole}.${priceFraction}`).toFixed(2);
            }
            products.push({ asinValue, title, priceSymbol, price });
        });
        // s-pagination-strip

        return products;
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
