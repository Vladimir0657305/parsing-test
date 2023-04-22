import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
// import { CSVReader, CSVDownloader } from 'react-papaparse';


function Bloomberg_profiles_company() {
    let paginator = 0;
    let products = [];
    const lastPage = 1;
    const [searchTerm, setSearchTerm] = useState('');
    const valueToRemove = 'http://localhost:3000';
    let hrefValuesArray = [];

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const SEARCH_URL = `https://www.bloomberg.com/feeds/bbiz/sitemap_profiles_company_${paginator}.xml`;
    const NEXT_URL = `https://www.amazon.com`;


    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchData = async (url) => {
        const response = await axios.get(url);
        return response.data;
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };


    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        let index = 0;
        while (index < lastPage) {
            const delayTime = Math.floor(Math.random() * 3001) + 2000;
            await delay(delayTime);
            let response = await fetchData(`${PROXY_URL}${SEARCH_URL}`);
            products = parseProducts(response);
            index++;
            paginator++;
        }
        downloadCsv(products);
    };



    const parseProducts = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        doc.querySelectorAll('loc ').forEach(async (item) => {
            let link = item.textContent.trim() ?? '';
            products.push(link);
            console.log('LINK=', link);
            const delayTime = Math.floor(Math.random() * 3001) + 2000;
            await delay(delayTime);
            await nextSearch(link);

        });

        return products;
    };


    const nextSearch = async (link) => {
        let t = `${PROXY_URL}${link}`;
        console.log('000000000=', t);
        const response = await fetchData(`${PROXY_URL}${link}`);
        products = parsePage(response);
        console.log('2222=', products);

    };

    const parsePage = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // h1.companyName__0081a26a89
        const title = doc.querySelector('h1.companyName__0081a26a89')?.textContent.trim() ?? '';
        console.log(title);
        products.push(title);
        return products;
    }

    const downloadCsv = (products) => {
        const csv = Papa.unparse(products);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        downloadLink.setAttribute('download', 'Bloomberg_profiles_company.csv');
        downloadLink.click();
    };


    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
                <button type="submit">Start Bloomberg_profiles_company</button>
            </form>
        </div>
    );
}

export default Bloomberg_profiles_company;
