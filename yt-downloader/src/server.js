import express from 'express';
import fs from 'fs';
import ytdl from 'ytdl-core'

const server = express();
server.use(express.json());

server.get('/download', async (request, response) => {
    const videoUrl = 'https://www.youtube.com/watch?v=DviID8Ni7Ns&ab_channel=MenITrust';
    const videoId = await ytdl.getVideoID(videoUrl)
    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;
    response.header("Content-Disposition", `attachment; filename=${videoDetails.title}.mp4`)
    
    console.log(await ytdl.getInfo(videoUrl, {
        requestCallback: {
            videoDetails
        }
    }))

    ytdl(videoUrl, {
        format: 'mp4',
        quality: 137,
    }).pipe(response);
})

server.listen(3333);