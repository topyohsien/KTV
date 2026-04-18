const startBtn = document.getElementById('startBtn');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');

// 這些資訊填入你剛才在 ACRCloud 申請到的 Key
const config = {
    host: 'identify-ap-southeast-1.acrcloud.com',
    access_key: '9ef404c2c6119a39f4228c27d747bddb',
    access_secret: 'mSz4da3dhnib6Nxg0b3yC10tL6Ch9jtqEIMfNaU0',
    type: 'audio'
};

// 實例化 ACRCloud 辨識器
const acr = new ACRCloud(config);

startBtn.onclick = () => {
    statusDiv.innerText = "狀態：辨識中...";
    startRecognitionCycle();
};

function startRecognitionCycle() {
    // 使用 SDK 進行辨識
    acr.identify().then(res => {
        console.log(res); // 在控制台查看完整結果
        const metadata = res.metadata;

        if (metadata && metadata.music && metadata.music.length > 0) {
            const music = metadata.music[0];
            resultDiv.innerText = `辨識成功：${music.title} - ${music.artists[0].name}`;
            statusDiv.innerText = `狀態：等待下一個 10 秒...`;
        } else {
            resultDiv.innerText = "聽不清楚，再試一次...";
        }

        // 每隔 10 秒循環一次
        setTimeout(startRecognitionCycle, 10000);
        
    }).catch(err => {
        console.error(err);
        statusDiv.innerText = "錯誤：" + err;
    });
}
