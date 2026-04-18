const startBtn = document.getElementById('startBtn');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');

const config = {
    host: 'identify-ap-southeast-1.acrcloud.com',
    access_key: '9ef404c2c6119a39f4228c27d747bddb',
    access_secret: 'mSz4da3dhnib6Nxg0b3yC10tL6Ch9jtqEIMfNaU0',
    type: 'audio'
};

// 1. 建立實例
const acr = new ACRCloud(config);

// 2. 點擊按鈕後的邏輯
startBtn.onclick = async () => {
    statusDiv.innerText = "狀態：正在啟動麥克風...";
    
    try {
        // 重要：先測試麥克風權限並啟動
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        statusDiv.innerText = "狀態：辨識中...";
        startRecognitionCycle();
    } catch (err) {
        statusDiv.innerText = "錯誤：請允許麥克風權限";
        console.error(err);
    }
};

function startRecognitionCycle() {
    console.log("開始辨識...");
    
    // 使用 SDK 進行辨識 (錄音時間約 4-8 秒)
    acr.identify().then(res => {
        console.log("辨識結果：", res); 
        
        // 檢查回傳狀態碼，0 代表成功
        if (res.status && res.status.code === 0) {
            const music = res.metadata.music[0];
            resultDiv.innerText = `辨識成功：${music.title} - ${music.artists[0].name}`;
            
            // 這裡可以準備下一步：處理音樂的播放位置 (db_offset_ms)
            console.log("目前播放到：" + music.db_offset_ms + "ms");
        } else {
            resultDiv.innerText = "沒聽出歌曲，再試一次...";
        }

        statusDiv.innerText = `狀態：等待下一輪 (10秒後)...`;
        // 設定 10 秒後再次執行
        setTimeout(startRecognitionCycle, 10000);
        
    }).catch(err => {
        console.error("辨識過程出錯：", err);
        statusDiv.innerText = "辨識失敗，正在重試...";
        setTimeout(startRecognitionCycle, 5000); // 失敗的話 5 秒後重試
    });
}
