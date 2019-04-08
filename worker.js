const http = require('http');
const pid = process.pid; // id процесса

http
    .createServer((res, req) => {
        for (let i = 0; i < 10e7; i++) {}
        req.end('Hello from Node.js\n');
    })
    .listen(8800, () => {
        console.log(`Server started. Pid ${pid}`);
    });