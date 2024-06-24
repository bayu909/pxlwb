const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const random = require('random-name');
const randomize = require('randomatic');
const moment = require('moment');
const readline = require('readline-sync');
// const fs = require('fs');
const request = require('request');
const cheerioAdv = require('cheerio-advanced-selectors');
const { cyan, red, yellow, green } = require('colorette');
const { SocksProxyAgent } = require('socks-proxy-agent');

const downloadProxy = async () => {
    const response = await axios.get('https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/all.txt');
    return response.data.split('\n');
}

const randstr = length =>
    new Promise((resolve, reject) => {
        let text = "";
        let possible =
            "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const functionGetLink = (email, domain) => new Promise((resolve, reject) => {
    fetch(`https://generator.email/${domain}/${email}`, {
            method: "get",
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                cookie: `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(3)}; surl=${domain}%2F${email}`,
                "upgrade-insecure-requests": 1,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
            }
        })
        .then(res => res.text())
        .then(text => {
            let $ = cheerio.load(text);
            let src = $('#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy.plain > p').text();
            let number = src.replace(/\D/g, "");
            resolve(number);
        })        
        .catch(err => reject(err));
});

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': null
};

const getDomains = async (url, maildom, domains) => {
    for (let i = 0; i < maildom; i++) {
        // console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Mengambil domain (${i+1}/` + maildom + `)`);
        // pakai stdout biar bisa update baris yang sama
        process.stdout.write(`[ ${moment().format("HH:mm:ss")} ] ` + `Mengambil domain (${i+1}/` + maildom + `)\r`);
        await new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(body);
                    cheerioAdv.wrap($);
                    const divList = $('div.tt-dataset-typeahead_as3gsdr');
                    const domainElements = divList.find('p');
                    domainElements.each((index, element) => {
                        const domain = $(element).text();
                        if (!domains.includes(domain)) {
                            domains.push(domain);
                        }
                    });
                    resolve();
                } else {
                    reject(error);
                }
            });
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log('\n');
    return domains;
}

const Main = async () => {
    // Fun Welcome Message from the Creator (MONKEY D. LUFFY) Tulis Nama saya di bawah ini
    // dibawah ini adalah welcome message dari saya
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Welcome to Pixelverse Bot`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Pixelverse Bot v1.0.0`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Created by MONKEY D. LUFFY`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Github: https://github.com/bayu909`));
    // console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Support me: https://saweria.co/bayu909`));
    // console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Don't forget to follow my github and support me on saweria`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Thanks for using my bot`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Happy Botting`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Bot dimulai`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Bot akan mengambil ulang proxy setiap 1 jam`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Bot akan mengambil domain list dari situs penyedia domain email sementara`));
    console.log(cyan(`[ ${moment().format("HH:mm:ss")} ] ` + `Bot akan mengambil domain list sebanyak 20x Secara Default (Customable)`));
    // Hitung waktu bot dimulai proxyList akan diambil ulang setiap 1 jam
    let botStartingTime = new Date().getTime();
    let proxyList = await downloadProxy();
    let useProxy = proxyList[0];
    const referralCode = readline.question(`[ ${moment().format("HH:mm:ss")} ] ` + 'Reff Code : ');
    const jumlah = readline.question(`[ ${moment().format("HH:mm:ss")} ] ` + 'Jumlah Reff : ');
    console.log(`[ ${moment().format("HH:mm:ss")} ] Domain List akan diambil dari situs penyedia domain email sementara`)
    const maildom = readline.question(`[ ${moment().format("HH:mm:ss")} ] ` + 'Berapa kali check untuk scrape domain list? (default: 20): ');

    const url = "https://generator.email/";
    // inisiasi variabel domains sebagai array
    let  domains = [];
    // getDomains adalah fungsi untuk mengambil domain dari url
    domains = await getDomains(url, maildom || 20, domains);

    console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Total domain: ${domains.length}`);

    const otpRequestURL = 'https://api.pixelverse.xyz/api/otp/request';
    const otpVerificationURL = 'https://api.pixelverse.xyz/api/auth/otp';
    const referralURL = 'https://api.pixelverse.xyz/api/referrals/set-referer/'+referralCode;

    async function makeRequest(url, payload, proxy) {
        let httpsAgent;
        if (proxy.includes('socks4') || proxy.includes('socks5')) {
            httpsAgent = new SocksProxyAgent(proxy);
        }
        try {
            let response;
            if (proxy.includes('http')) {
                response = await axios.post(url, payload, { headers }, {
                    timeout: 10000,
                    proxy: {
                        protocol: 'http',
                        host: proxy.split('http://')[1].split(':')[0],
                        port: proxy.split('http://')[1].split(':')[1]
                    }
                });
            }else if (proxy.includes('socks4') || proxy.includes('socks5')) {
                const axiosInstance = axios.create({
                    httpAgent: httpsAgent,
                    httpsAgent: httpsAgent,
                    timeout: 10000
                });
                response = await axiosInstance.post(url, payload, { headers });
            }
            // console.log(response.data ? response.data : response)
            return response;
        } catch (error) {
            if (error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error == 'Provided email has blacklisted domain' || error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error == 'ThrottlerException: Too Many Requests'){
                return error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error;
            }else{
                return 'Bad_Proxy';
            }
            // console.log(error)
            // console.error(red('Error:', error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error));
            // throw error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error;
        }

        // try {
        //     const response = await axios.post(url, payload, { headers });
        //     return response.data;
        // } catch (error) {
        //     console.error(red('Error:', error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error));
        //     throw error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error;
        // }
    }

    async function verifikasiReferal (referralURL, referralPayload, headers, proxy) {
        let httpsAgent;
        if (proxy.includes('socks4') || proxy.includes('socks5')) {
            httpsAgent = new SocksProxyAgent(proxy);
        }
        try {
            let response;
            if (proxy.includes('http')) {
                response = await axios.put(referralURL, referralPayload, { headers }, {
                    timeout: 10000,
                    proxy: {
                        protocol: 'http',
                        host: proxy.split('http://')[1].split(':')[0],
                        port: proxy.split('http://')[1].split(':')[1]
                    }
                });
                console.log(response)
            }else if (proxy.includes('socks4') || proxy.includes('socks5')) {
                const axiosInstance = axios.create({
                    httpAgent: httpsAgent,
                    httpsAgent: httpsAgent,
                    timeout: 10000
                });
                response = await axiosInstance.put(referralURL, referralPayload, { headers });
                console.log(axiosInstance)
            }
            // console.log(response)
            return response;
        } catch (error) {
            // console.log(error)
            if (error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error == 'Provided email has blacklisted domain' || error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error == 'ThrottlerException: Too Many Requests'){
                return error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error;
            }else{
                return 'Bad_Proxy';
            }
            // console.log(error)
            // console.error(red('Error:', error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error));
            // throw error.response.data.message ? error.response.data.message : error.response.data ? error.response.data : error.response ? error.response : error;
        }
        // const referralResponse = await axios.put(referralURL, referralPayload, { headers });
    }

        

    async function registerUser(email, domain, otpPayload, referralPayload, successCount, ) {
        // Request OTP dengan try retry 3x mencoba ulang setiap 5 detik
        let retryRequestOTP = 0;
        let otpSuccess = false;
        while (true) {
            let startTimeOTP = new Date().getTime();
            try {
                console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Menggunakan Proxy: ${useProxy}`));
                const askOTP = await makeRequest(otpRequestURL, otpPayload, useProxy);
                // console.log(askOTP)
                console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Mengirimkan permintaan kode OTP...`));
                if (askOTP === 'Bad_Proxy') {
                    console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Proxy yang digunakan bermasalah, menggunakan proxy lain...`));
                    useProxy = proxyList[proxyList.indexOf(useProxy)+1];
                    proxyList.splice(proxyList.indexOf(useProxy), 1);
                    return false;
                };
                otpSuccess = true;
                break;
            } catch (error) {
                if (error === 'Provided email has blacklisted domain') {
                    // Hapus Domain yang diblacklist dari variabel domains
                    domains.splice(domains.indexOf(domain), 1);
                    console.log(`Menghapus Domain ${domain} dari list domain...`)
                    console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Domain telah diblacklist, menggunakan domain lain...`));
                    otpSuccess = false;
                    break;
                }
                if (retryRequestOTP >= 6) {
                    console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Gagal mengirimkan permintaan kode OTP, melewati batas retry...`));
                    otpSuccess = false;
                    break;
                }
                if (new Date().getTime() - startTimeOTP >= 9500 || error == `TypeError: Cannot read properties of undefined (reading 'data')`) {
                    console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Proxy yang digunakan bermasalah, menggunakan proxy lain...`));
                    useProxy = proxyList[proxyList.indexOf(useProxy)+1];
                    proxyList.splice(proxyList.indexOf(useProxy), 1);
                    return false;
                }
                console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Gagal mengirimkan permintaan kode OTP `+ error));
                console.log(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Mencoba Request ulang kode OTP...`));
                retryRequestOTP++;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        if (!otpSuccess) {
            return false;
        };
        try {
            console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Mencoba mendaftar menggunakan email => ${email}`));

            let otp;
            let startTime = new Date().getTime();
            do {
                otp = await functionGetLink(email.split('@')[0], domain);
                // console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Menunggu kode verifikasi...`));
                process.stdout.write(`[ ${moment().format("HH:mm:ss")} ] ` + `Menunggu kode verifikasi... (${new Date().getTime() - startTime}ms)\r`);
            } while (!otp && (new Date().getTime() - startTime) < 5000);
            // Jika kode otp tidak ditemukan dalam 30 detik, lanjutkan ke email berikutnya
            if (!otp) {
                console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Kode verifikasi tidak ditemukan dalam 5 detik, melewati email ini...`));
                useProxy = proxyList[proxyList.indexOf(useProxy)+1];
                proxyList.splice(proxyList.indexOf(useProxy), 1);
                return false;
            }
            console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Kode verifikasi: ${otp}`));
            console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Menggunakan Proxy: ${useProxy}`));
            const accessToken = await makeRequest(otpVerificationURL, { email, otpCode: otp }, useProxy);
            if (accessToken === 'Bad_Proxy') {
                console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Proxy yang digunakan bermasalah, menggunakan proxy lain...`));
                useProxy = proxyList[proxyList.indexOf(useProxy)+1];
                proxyList.splice(proxyList.indexOf(useProxy), 1);
                return false;
            }
            console.log(green(`[ ${moment().format("HH:mm:ss")} ] ` + `Verifikasi kode sukses...`));
            // console.log(accessToken.data)

            headers.Authorization = accessToken.data.tokens.access;
            // console.log(headers)
            console.log(yellow(`[ ${moment().format("HH:mm:ss")} ] ` + `Menggunakan Proxy: ${useProxy}`));
            const referralResponse = await verifikasiReferal(referralURL, referralPayload, { headers }, useProxy);
            if (referralResponse == 'Bad_Proxy') {
                console.error(red(`[ ${moment().format("HH:mm:ss")} ] ` + `Proxy yang digunakan bermasalah, menggunakan proxy lain...`));
                useProxy = proxyList[proxyList.indexOf(useProxy)+1];
                proxyList.splice(proxyList.indexOf(useProxy), 1);
                return false;
            }
            console.log(referralResponse)
            console.log(green(`[ ${moment().format("HH:mm:ss")} ] ` + `Sukses reff ke ${successCount}\n`));
            return true;
        } catch (error) {
            console.error(red('[Error]:', error));
            return false;
        }
    }
    let successCount = 1;
    try {
        while (successCount < jumlah) {
            if (proxyList.length <= 5 || new Date().getTime() - botStartingTime >= 1800000) {
                console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Mengambil ulang proxy list...`);
                proxyList = await downloadProxy();
                useProxy = proxyList[0];
                botStartingTime = new Date().getTime();
            }
            const randomIndex = Math.floor(Math.random() * domains.length);
            const domain = domains[randomIndex];
    
            const name = random.first();
            const lastname = random.last();
            const uname = `${name}${lastname}${randomize('0', 2)}`;
            const email = uname + `@` + domain;
    
            const otpPayload = {
                email: email,
            };
    
            const referralPayload = {
                referralCode: referralCode,
            };
    
            const tryRegister = await registerUser(email, domain, otpPayload, referralPayload, successCount);
            if (tryRegister) {
                successCount++;
            } else {
                // Jika Sisa Domain yang bisa digunakan sudah <= 2 kumpulkan lagi domain baru
                if (domains.length <= 2) {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Domain yang tersisa <= 2, mengambil domain baru...`);
                    domains = await getDomains(url, maildom || 20, domains);
                    console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Total domain: ${domains.length}`);
                }
                // Optionally handle the case where registration fails
                // For example, you might want to break out of the loop or log an error
                // keep continue the loop to the next iteration
                continue;
            }
    
            // await new Promise(resolve => setTimeout(resolve, (Math.random() * 10000) + 10000));
            // Menunggu 10 detik sebelum melakukan request lagi
            // await new Promise(resolve => setTimeout(resolve, 10000));
            // menunggu random 5-10 detik sebelum melakukan request lagi
            await new Promise(resolve => setTimeout(resolve, (Math.random() * 5000) + 5000));
        }
    } catch (error) {
        console.error(red('[Error]:', error));
    }
    process.exit();
}

Main();
