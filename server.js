// How to build a web server

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


const logEvents = require('./logEvents');


const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }; // taken directly from the docs



// intialize object

const myEmitter = new MyEmitter();
myEmitter.on("log", (msg, filename) => logEvents(msg, filename));

const PORT = process.env.Port || 4000




const serveFile = async(filepath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filepath, 
            !contentType.includes("image") ? 'utf8' :
            ""
            );
        !contentType.includes("image") ? "utf8" : ""


        const data = contentType === "application/json"
        ? JSON.parse(rawData) : rawData
        response.writeHead(
            filepath.includes("404.html") ? 404 : 200,
            {'content-type': contentType} 
            );
        response.end(
            contentType === "application/json"
            ? JSON.stringify(data) : data
        );
    }catch (err) {
        console.error(err);
        myEmitter.emit("log", `${err.name} : ${err.message}, "errLog.txt"`)

        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit("log", `${req.url}\t${req.method}, "reqLog.txt"`);

    // Setting the content-type
    const extension = path.extname(req.url);
    let contentType;
    
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javaScript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default: contentType = 'text/html';
    }

    // Setting the filepath
    let filepath = contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : path.join(__dirname, req.url);

    // make .html extension not required in browser
    if (!extension && req.url.slice(-1) !== '/') filepath += '.html'
    const fileExists = fs.existsSync(filepath)
    if (fileExists) {
        // server the file
        serveFile(filepath, contentType, res)
    } else {
        //404
        //301 redirect
        //to get 404, 301 we need to use switch statement which is in the bottom

        console.log(path.parse(filepath));
        switch (path.parse(filepath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end()
                break;
            default:
                // serve the 404 response we serve a 404 response by the code below
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
    }
});


server.listen(PORT, () => console.log(`server running on port ${PORT}`))

// add listener for the log event
// myEmitter.on('log', msg => {
//     logEvents(msg)
// })

// setTimeout(() => {
//     myEmitter.emit('log', 'Log event emitted!');
// }, 5000);