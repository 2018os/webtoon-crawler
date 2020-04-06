const cheerio = require('cheerio');
const request = require('request');

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
    const webtoons = [];
    request(url, function(error, response, html){
        if (error) {throw error};
        const $ = cheerio.load(html);
        const list = $(".img_list li");
        list.map((ele, j) => {
            const webtoon = {
                title: $(j).find('dl dt a').attr('title'),
                author: $(j).find('dl dd.desc a').text(),
                genre,
                thumb: $(j).find('.thumb a img').attr('src'),
                finish: !!($(j).find('.thumb a img.finish').attr('src')),
                adult: $(j).find('.thumb a span.mark_adult_thumb').text() !== '',
            }
            console.log(webtoon);
        })
    });
})