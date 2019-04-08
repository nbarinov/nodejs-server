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

        worker.on('exit', () => {
            console.log(`Worker died! Pid: ${worker.process.pid}`);
        });
    }
}

if (cluster.isWorker) {
    require('./worker.js');
}