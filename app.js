async function fetchLyrics(trackName, artistName) {
  // 透過歌曲資訊搜尋帶有時間戳的歌詞 (LRC)
  const response = await fetch(`https://lrclib.net/api/search?q=${trackName} ${artistName}`);
  const data = await response.json();
  const lrc = data[0].syncedLyrics; // 取得同步歌詞字串
  parseLRC(lrc);
}

function parseLRC(lrcText) {
  // 將 [00:12.34] 歌詞 轉換成物件格式
  const lines = lrcText.split('\n');
  const lyricsData = lines.map(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (match) {
      return {
        time: parseInt(match[1]) * 60 + parseFloat(match[2]),
        text: match[3]
      };
    }
  }).filter(Boolean);
  
  startScrolling(lyricsData);
}
