import {createChunk} from "@/utils/cutFile";

onmessage = async (e) => {
    const {start, end, file, CHUNK_SIZE} = e.data;
    const proms = [];
    for(let i = start; i < end; i++) {
        proms.push(createChunk(file, i, CHUNK_SIZE));
    }
    const result = await Promise.all(proms);
    postMessage(result);
}