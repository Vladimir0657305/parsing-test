import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
// import { CSVReader, CSVDownloader } from 'react-papaparse';
// headers: {
//     'X-Requested-With': 'XMLHttpRequest'
// }

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


    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Функция парсинга сайта
        for (let paginator = 0; paginator < lastPage; paginator++) {
            parseSite(paginator);
        }
    };

    const parseSite = async (paginator) => {
        // const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // Прокси-сервер для обхода CORS
        const PROXY_URL = 'https://api.codetabs.com/v1/proxy?quest='; // Прокси-сервер для обхода CORS
        const SEARCH_URL = `https://www.bloomberg.com/feeds/bbiz/sitemap_profiles_company_${paginator}.xml`; // URL страницы со списком клиентов
        let csvContent = 'data:text/csv;charset=utf-8,'; // Содержимое CSV-файла

        try {
            // Загрузка страницы со списком клиентов

            // let response = '';
            const delayTime = Math.floor(Math.random() * 3001) + 2000;
            await delay(delayTime);
            // setTimeout(async () => {
            const response = await fetch(`${PROXY_URL}${SEARCH_URL}`);
            const html = await response.text();
            // console.log(html);
            // }, delayTime);


            // Парсинг страницы
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const locElements = doc.querySelectorAll('loc');
            console.log(locElements);

            // Обход списка клиентов
            let ind = 0;
            // while (ind < locElements.length - 1) {
            while (ind < 3) {
                let link = locElements[ind].textContent.trim() ?? '';
                console.log(link);
                // }
                // locElements.forEach(async (item) => {
                //     let link = item.textContent.trim() ?? '';


                // Загрузка страницы клиента
                const delayTime2 = Math.floor(Math.random() * 3001) + 2000;
                await delay(delayTime2);
                // setTimeout(async () => {
                let response = await fetch(`${PROXY_URL}${link}`);
                console.log(response);
                let html2 = await response.text();
                console.log(html2);
                // }, delayTime2);

                // const response = await fetch(`${PROXY_URL}${link}`);
                // const html = await response.text();
                let clientDoc = parser.parseFromString(html2, 'text/html');

                // Получение заголовка клиента
                let title = clientDoc.querySelector('h1.companyName__0081a26a89')?.textContent.trim() ?? '';
                console.log(title);

                // Добавление информации о ссылке на клиента и заголовке в CSV-файл
                const row = `${link},${title}\n`;
                csvContent += row;
                ind++;
            };

            // Запись CSV-файла
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'clients.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
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
