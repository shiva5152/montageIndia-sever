import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { handleReduceVideos, handleVideoWithWaterMark, getTranscodeProgress } from "../../utils/resizeVideo";
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from 'ffmpeg-static'

// '[0:a][1:a]amix=inputs=2:duration=first[output]'
// .complexFilter([
//     { filter: 'aformat', options: { channel_layouts: 'stereo' }, inputs: '0:a', outputs: 'main' },
//     { filter: 'atrim', options: { start: 0, end: 1 }, inputs: '1:a', outputs: 'trim' },
//     { filter: 'adelay', options: { delays: '9000|9000' }, inputs: 'trim', outputs: 'wm' },
//     { filter: 'amix', options: { inputs: 2 }, inputs: ['main', 'wm'], outputs: 'mix' }
// ])
// second closest
// .complexFilter([
//     { filter: 'amovie', options: { filename: watermarkAudio, loop: 0 }, outputs: 'beep' },
//     { filter: 'asetpts', options: { expr: 'N/SR/TB' }, inputs: 'beep', outputs: 'pts' },
//     { filter: 'amix', options: { inputs: 2, duration: 'shortest' }, inputs: ['0:a', 'pts'], outputs: 'mix' },
//     { filter: 'volume', options: { volume: 2 }, inputs: 'mix', outputs: 'volume' }
// ])
ffmpeg.setFfmpegPath(ffmpegStatic as string);
function addAudioWatermark(mainAudio: string, watermarkAudio: string, output: string, callback: any) {

    ffmpeg()
        .input(mainAudio)
        .input(watermarkAudio)
        .complexFilter([
            { filter: 'amovie', options: { filename: watermarkAudio, loop: 0 }, outputs: 'beep' },
            { filter: 'asetpts', options: { expr: 'N/SR/TB' }, inputs: 'beep', outputs: 'pts' },
            { filter: 'amix', options: { inputs: 2, duration: 'shortest' }, inputs: ['0:a', 'pts'], outputs: 'mix' },
            { filter: 'volume', options: { volume: 1 }, inputs: 'mix', outputs: 'volume' }
        ])



        .outputOptions('-map', '[volume]')
        .save(output)

        .on('error', function (err) {
            console.log('An error occurred: ' + err.message)
        })
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', function () {
            console.log('Processing finished!');
        });





    // ffmpeg()
    //     .input(originalAudioPath)
    //     .input(watermarkAudioPath)
    //     .audioCodec('aac')
    //     .complexFilter([
    //         "[0:a]aformat=channel_layouts=stereo,aresample=async=1000 [main]; [1:a]atrim=0:1,adelay=9000|9000 [wm]; [main][wm]amix=inputs=2"
    //     ])
    //     .saveToFile(outputAudioPath)
    //     .on('end', () => {
    //         console.log('Watermark added successfully');
    //         callback(null)
    //     })
    //     .on('error', (err: any) => {
    //         console.error('Error here adding watermark:', err);
    //         callback(err)
    //     })
    //     .run();

}



export const reduceAudio = catchAsyncError(async (req, res, next) => {
    const originalAudioPath = 'audio/main.mp3'
    const watermarkAudioPath = 'audio/watermark.wav';
    const outputAudioPath = 'output/watermarked-audio.mp3';

    addAudioWatermark(originalAudioPath, watermarkAudioPath, outputAudioPath, (err: any) => {
        if (!err) {
            console.log('Watermark added successfully');
        } else {
            console.error('Error adding watermark:', err)
        }
    });


    res.json({ msg: "uploaded successfully" })
})

