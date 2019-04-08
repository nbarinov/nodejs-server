const http = require('http');
const pid = process.pid; // id процесса

const server = http
    .createServer((res, req) => {
        for (let i = 0; i < 10e7; i++) {}
        req.end('Hello from Node.js\n');
    })
    .listen(8800, () => {
        console.log(`Server started. Pid ${pid}`);
    });

process.on('SIGINT', () => {
    console.log('Signal is SIGINT');

    // убиваем процессы
    server.close(() => {
        process.exit(0);
    })
});

process.on('SIGTERM', () => {
    console.log('Signal is SIGTERM');

    // убиваем процессы
    server.close(() => {
        process.exit(0);
    })
});

process.on('SIGUSR2', () => {
    console.log('Signal is SIGUSR2');

    // убиваем процессы
    server.close(() => {
        process.exit(1);
    })
});