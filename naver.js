const cheerio = require('cheerio');
const { google } = require('googleapis');
const request = require('sync-request');
const auth = require('./auth');
const {
  SHEET_ID,
  RANGE
} = require('./env/sheet');

const updateCell = (auth, data) => {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'raw',
    resource: {
      values: data,
    },
  }, (err) => {
    if (err) return console.log('The API returned an error: ' + err);
  });
};

const crawl = () => {
  const webtoons = [];
  const genres = [
    'episode',
    'omnibus',
    'story',
    'daily',
    'comic',
    'fantasy',
    'action',
    'drama',
    'pure',
    'sensibility',
    'thrill',
    'historical',
    'sports',
  ];
  genres.map((genre, i) => {
    const url = `https://comic.naver.com/webtoon/genre.nhn?genre=${genre}`;
    const res = request('GET', url);
    const html = res.getBody();
    const $ = cheerio.load(html);
    const list = $(".img_list li");
    list.map((ele, j) => {
      const webtoon = [
        $(j).find('dl dt a').attr('title'),
        $(j).find('dl dd.desc a').text(),
        genre,
        !!($(j).find('.thumb a img.finish').attr('src')),
        $(j).find('.thumb a span.mark_adult_thumb').text() !== '',
        $(j).find('.thumb a img').attr('src'),
      ];
      webtoons.push(webtoon);
    });
  });
  return webtoons;
};

const main = async () => {
  try {
    const client = await auth();
    const webtoons = crawl();
    updateCell(client, webtoons);
  } catch(err) {
    console.log(err);
  }
}

main();