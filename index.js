const { exec } = require('child_process');
const path = require('path');
const express = require('express');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const app = express();

ffmpeg.setFfmpegPath(ffmpegStatic);

function getFfmpeg(cam, camPath) {
// Run FFmpeg
ffmpeg()
  .input(cam)
  .outputOptions('-c:v', 'libx264')
  .outputOptions('-vf', 'scale=1280:720')
  .outputOptions('-b:a', '1k')
  .outputOptions('-ac', '1')
  .outputOptions('-crf', '21')
  .outputOptions('-preset', 'veryfast')
  .outputOptions('-segment_wrap', '1')
  .outputOptions('-hls_list_size', '1')
  .outputOptions('-tune', 'zerolatency')
  .outputOptions('-f', 'hls')
  .outputOptions('-hls_time', '30')
  .outputOptions('-maxrate', '1M')
  .outputOptions('-bufsize', '100k')
  .outputOptions('-r', '10')
  .outputOptions('-movflags', '+faststart')
  .outputOptions('-start_number', '1')
  .outputOptions('-hls_allow_cache', '0')
  .outputOptions('-fflags', 'nobuffer')
  .outputOptions('-threads', '1')
  .outputOptions('-loglevel', 'warning')
  .outputOptions('-hls_flags', 'delete_segments')
  .saveToFile(`./hls/${camPath}/stream.m3u8`)
    return `ffmpeg -i ${cam}                      `
    // return `ffmpeg -i ${cam} -c:v libx264 -vf scale=1280:720 -b:a 1k -ac 1 -c:v libx264 -crf 21 -preset veryfast -flags -global_header -segment_wrap 1 -hls_list_size 1 -tune zerolatency -f hls -hls_time 30 -maxrate 1M -bufsize 100k -r 10 -movflags +faststart -start_number 1 -hls_allow_cache 0 -fflags nobuffer -threads 1 -loglevel warning -y -hls_flags delete_segments ./hls/${camPath}/stream.m3u8`
  }
function startFfmpeg(param) {
  const cams = [
    {id: 'cam-1', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-2', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-3', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-4', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-5', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-6', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-7', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
    {id: 'cam-8', address: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',},
  ]
  let indexCam = cams.indexOf(cams.filter(val => val.id === param)[0])
  const command = getFfmpeg(cams[indexCam].address, cams[indexCam].id)
  console.log('param', param)
  // exec(command, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.error(`stderr: ${stderr}`);
  // });
}
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/cam-1', express.static(__dirname + `/hls/cam-1/`) );
app.use('/cam-2', express.static(__dirname + `/hls/cam-2/`) );
app.use('/cam-3', express.static(__dirname + `/hls/cam-3/`) );
app.use('/cam-4', express.static(__dirname + `/hls/cam-4/`) );
app.use('/cam-5', express.static(__dirname + `/hls/cam-5/`) );
app.use('/cam-6', express.static(__dirname + `/hls/cam-6/`) );
app.use('/cam-7', express.static(__dirname + `/hls/cam-7/`) );
app.use('/cam-8', express.static(__dirname + `/hls/cam-8/`) );

function getHeaders() {
  return {
    headers: {
      'Content-Type': 'application/x-mpegURL'
    }
  }
}

function createFolders(params) {
  var dir = './hls';

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  var camDirs = ['./hls/cam-1','./hls/cam-2','./hls/cam-3','./hls/cam-4','./hls/cam-5','./hls/cam-6','./hls/cam-7','./hls/cam-8',];
  camDirs.forEach(folder => {
    if (!fs.existsSync(folder)){
      fs.mkdirSync(folder);
    }
  })

}
function getPath(cam) {
  createFolders()
  startFfmpeg(cam)
  return path.resolve(`hls/${cam}/stream.m3u8`)
}
app.get('/cam-1', (req, res) => {
  res.sendFile(getPath('cam-1'), getHeaders());
});
app.get('/cam-2', (req, res) => {
  res.sendFile(getPath('cam-2'), getHeaders());
});
app.get('/cam-3', (req, res) => {
  res.sendFile(getPath('cam-3'), getHeaders());
});
app.get('/cam-4', (req, res) => {
  res.sendFile(getPath('cam-4'), getHeaders());
});
app.get('/cam-5', (req, res) => {
  res.sendFile(getPath('cam-5'), getHeaders());
});
app.get('/cam-6', (req, res) => {
  res.sendFile(getPath('cam-6'), getHeaders());
});
app.get('/cam-7', (req, res) => {
  res.sendFile(getPath('cam-7'), getHeaders());
});
app.get('/cam-8', (req, res) => {
  res.sendFile(getPath('cam-8'), getHeaders());
});
app.listen(20803, () => {
console.log('HLS server is running on port 20803');
});
// create a folder named 'public' in the same directory as your Node.js script and place the 'stream.m3u8' file in it.