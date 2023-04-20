import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
// import { CSVReader, CSVDownloader } from 'react-papaparse';


function McbatxParser() {
    let paginator = 2;
    let link = '';
    let products = [];
    let lastPage = 3;
    const [searchTerm, setSearchTerm] = useState('');
    const valueToRemove = 'http://localhost:3000';
    let hrefValuesArray = [];

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const SEARCH_URL = `https://mcbatx.com/directory/`;
    const NEXT_URL = `https://mcbatx.com/directory/page/`;
    const PAGE_URL = `https://mcbatx.com`;


    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchData = async (url) => {
        const response = await axios.get(url);
        return response.data;
    };


    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        let index = 0;
        while (index < lastPage) {
            if (paginator === undefined) {
                let response = await fetchData(`${PROXY_URL}${SEARCH_URL}`);
                products = parseProducts(response);
                // console.log(products);
                index++;
            } else {
                const delayTime = Math.floor(Math.random() * 3001) + 2000;
                await delay(delayTime);
                await nextSearch();
                index++;
            }
        }
        downloadCsv(products);
    };

    const nextSearch = async () => {
        let t = `${PROXY_URL}${NEXT_URL}${paginator}`;
        console.log('000000000=', t);
        const response = await fetchData(`${PROXY_URL}${NEXT_URL}${paginator}`);
        products = parseProducts(response);
        // console.log('2222=', products);
        paginator++;
    };

    const pageSearch = async () => {
        const delayTime = Math.floor(Math.random() * 3001) + 1000;
        await delay(delayTime);
        const response = await fetchData(`${PROXY_URL}${PAGE_URL}${link}`);
        products = parsePage(response);
        // console.log('2222=', products);

    };


    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const parseProducts = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('div.member-info h4 > a').forEach((item) => {
            link = item.href.replace(valueToRemove, '');
            const nameMan = item.innerHTML;

            pageSearch();
            console.log(nameMan, link);
            // products.push({ nameMan });
        });

        return products;
    };

    const parsePage = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        doc.querySelectorAll('div.info-mother').forEach((item) => {
            const title = item.querySelector('h4.name')?.textContent.trim() ?? '';
            console.log(title);
            const address = item.querySelector('.addres')?.textContent.trim() ?? '';
            const email = item.querySelector('.email > a')?.href ?? '';
            const firm = item.querySelector('.firm > a')?.textContent.trim() ?? '';

            products.push({ title, address, email, firm });
        });

        return products;
    };

    const downloadCsv = (products) => {
        const csv = Papa.unparse(products);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        downloadLink.setAttribute('download', 'mcbatx-contacts.csv');
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

export default McbatxParser;