import SparkMD5 from "spark-md5";
const CHUNK_SIZE = 1024 * 1024 * 2;
const THREAD_NUM = navigator.hardwareConcurrency || 4;

export const createChunk = async (file: File, index: number, chunkSize: number) => {
    return new Promise((resolve, reject) => {
        const start = index * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        const blob = file.slice(start, end);
        fileReader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            spark.append(arrayBuffer);
            const hash = spark.end();
            resolve({
                start,
                end,
                index,
                hash,
                blob,
            });
        };
        fileReader.readAsArrayBuffer(blob);
    });
}
export const cutFile = async (file: File) => {
    return new Promise((resolve, reject) => {
        const numChunks = Math.ceil(file.size / CHUNK_SIZE);
        const threadChunkCount = Math.ceil(numChunks / THREAD_NUM);
        const result = [];
        let finishCount = 0;
        console.log('numChunks', numChunks);
        for(let i = 0; i < THREAD_NUM; i++) {
            const worker = new Worker(new URL('/createChunkWorker.ts', import.meta.url), {
                type: 'module',
            })
            const start = i * threadChunkCount;
            const end = Math.min((i + 1) * threadChunkCount, numChunks);
            worker.postMessage({
                start,
                end,
                file,
                CHUNK_SIZE,
            });
            worker.onmessage = (e) => {
                for(let i = start; i < end; i++) {
                    result[i] = e.data[i-start];
                }
                worker.terminate();
                finishCount++;
                if(finishCount === THREAD_NUM) {
                    resolve(result);
                }
            }
        }
    })
}