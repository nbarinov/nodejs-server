const cluster = require('cluster');
const os = require('os');
const pid = process.pid; // id процесса

if (cluster.isMaster) {
    const cpusCount = os.cpus().length; // количество ядер

    console.log(`CPUs: ${cpusCount}`);
    console.log(`Master started. Pid: ${pid}`);

    // распараллеливаем работу на доступные ядра
    for (let i = 0; i < cpusCount - 1; i++) {
        const worker = cluster.fork();

        // отправялем сообщение серверу
        worker.send('Hello from server!');

        // отслеживаем обращения
        worker.on('message', (message) => {
            console.log(`Message from worker ${worker.process.pid}: ${JSON.stringify(message)}`);
        });
    }

    cluster.on('exit', (worker, code) => {
        console.log(`Worker died! Pid: ${worker.process.pid}. Code: ${code}`);

        // если воркер умирает, и умер он из-за ошибки, 
        // то запускаем новый,
        // потому что появляется свободное ядро
        if (code === 1) {
            cluster.fork();
        }
    });
}

if (cluster.isWorker) {
    require('./worker.js');

    // отслеживаем обращения
    process.on('message', (message) => {
        console.log(`Message from master: ${message}`);
    });

    // отправялем сообщения
    process.send({ text: 'Hello!', pid });
}