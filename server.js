// how to build a web server 

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');  //inport event medule

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};    //take directly from the docs

const PORT = process.env.PORT || 4500;

//initialize object
const myEmitter = new MyEmitter();

const serveFile = async(filepath, contentType, response) => {
    try {
        const data = await fsPromises.readFile(filepath, 'utf8');
        response.writeHead(200, {'Content-Type': contentType});
        response.end(data);
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.end();
    };
};

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    
    //setting the content-type
    const extension = path.extname(req.url);
    let contentType;
    switch (extension) {
        case ".css":
            contentType = 'text/css';
            break;
        case ".js":
            contentType = 'text/javascript';
            break;
    case ".json":
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

    //setting the filepath
    let filepath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            :contentType === 'text/html' && req.url.slice(-1) === '/'
            ?path.join(__dirname, 'views', req.url, 'index.html')
            :path.join(__dirname, req.url);

    //make .html extension not required in browser
    if (!extension && req.url.slice(-1) !== '/') filepath += '.html'
    const fileExists = fs.existsSync(filepath);
    if (fileExists) {
        //server the file
    } else {
        switch(path.parse(filepath)) {
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case ' www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                // serveFile(path.join(__dirname)
                
        } 
    }

});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));




















// const logEvents = require('./logEvents');

// const EventEmitter = require('events');

// class MyEmitter extends EventEmitter {}; // taken directly from the docs

// // initialize object

// const myEmitter = new MyEmitter();

// // add listener for the log event
// myEmitter.on('log', msg => {
//     logEvents(msg)
// })

// // we are using the setTimeout method to see the difference between two events clearly. We can also not use the setTimeout method

// setTimeout(() => {
//     myEmitter.emit('log', 'Log event emitted!');
// }, 2000);