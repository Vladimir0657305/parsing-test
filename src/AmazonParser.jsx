import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { CSVReader, CSVDownloader } from 'react-papaparse';


function AmazonParser() {
    let paginator = undefined;
    let products = [];
    const [searchTerm, setSearchTerm] = useState('');
    const valueToRemove = 'http://localhost:3000';
    let hrefValuesArray = [];

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const SEARCH_URL = `https://www.amazon.com/s?k=`;
    const NEXT_URL = `https://www.amazon.com`;


    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        let index = 0;
        // for (let index = 0; index < 4; index++) {
        while (index < 4) {
            if (paginator === undefined) {
                let response = await axios.get(`${PROXY_URL}${SEARCH_URL}${searchTerm}`);
                console.log(response);
                products = parseProducts(response.data);
                console.log('1111=', products);
                // downloadCsv(products);
                index++;
            }
            else {
                const delayTime = Math.floor(Math.random() * 3001) + 2000;
                setTimeout(() => {
                    nextSearch(index);
                    
                }, delayTime);
                index++;
            }
            console.log('hrefValuesArray=', hrefValuesArray);
        }
    };

    const nextSearch = async (index) => {
        let t = `${PROXY_URL}${NEXT_URL}${paginator}`;
        console.log('000000000=', index, t);
        let response = await axios.get(`${PROXY_URL}${NEXT_URL}${paginator}`);
        products = parseProducts(response.data);
        console.log('2222=', products);
        downloadCsv(products);
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const parseProducts = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // console.log(doc);


        let link = doc.querySelector('li.a-last > a');
        console.log('LINK=', link);
        let temp = link?.href.replace(valueToRemove, '');
        paginator = temp;
        console.log('paginator=', paginator);

        // let links = doc.querySelectorAll('div.s-pagination-container');
        // hrefValuesArray = Array.from(links).map(link => link.getAttribute('href'));
        // console.log('33333=', links);



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
