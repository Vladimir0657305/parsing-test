import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';


function McbatxParser() {
    let paginator = 2;
    let link = '';
    let products = [];
    let lastPage = 1;
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
                console.log('PRODUCTS 111 =', products);
                index++;
            } else {
                // await nextSearch();
                const delayTime = Math.floor(Math.random() * 3001) + 2000;
                await delay(delayTime);
                let t = `${PROXY_URL}${NEXT_URL}${paginator}`;
                console.log('000000000=', delayTime, t);
                const response = await fetchData(`${PROXY_URL}${NEXT_URL}${paginator}`);
                products = parseProducts(response);
                console.log('PRODUCTS 222 =', products);
                paginator++;
                index++;
            }
        }
        downloadCsv(products);
    };

    const nextSearch = async () => {


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
            pageSearch(link);
            console.log(nameMan, '===>', link);
            // products.push({ nameMan });
        });
        return products;
    };

    const pageSearch = async (link) => {
        const delayTime = Math.floor(Math.random() * 3001) + 1000;
        console.log('pageSearch=>', delayTime, `${PROXY_URL}${PAGE_URL}${link}`);
        await delay(delayTime);
        const response = await fetchData(`${PROXY_URL}${PAGE_URL}${link}`);
        products = parsePage(response);

    };

    const parsePage = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const title = doc.querySelector('div.info-mother h4.name')?.textContent.trim() ?? '';
        // const address = doc.querySelector('div.info-mother p.addres')?.innerHTML.trim() ?? '';
        const addressElement = doc.querySelector('div.info-mother p.address');
        const address = addressElement.textContent.trim() ?? '';
        // console.log('address=', address);
        const website = doc.querySelector('div.info-mother p.website a')?.href;
        const email = doc.querySelector('div.info-mother .email > a')?.href.replace('mailto:', '') ?? '';
        // console.log('email=', email)
        const phone = doc.querySelector('div.info-mother p.phone > a')?.textContent.trim() ?? '';
        const firm = doc.querySelector('div.info-mother p.firm')?.textContent.trim() ?? '';
        console.log(title, address, email, phone, firm);
        products.push({ title, address, website, email, phone, firm });
        console.log(products);
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
                <button type="submit">Start</button>
            </form>
        </div>
    );
}

export default McbatxParser;
