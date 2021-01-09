import { MobileNaverWebtoon, NaverWebtoon } from "../types";

import { NAVER, requestAndLoad, save } from "../tools";

const crawl = () => {
  const webtoons = [];
  const genres = [
    "DAILY",
    "COMIC",
    "FANTASY",
    "ACTION",
    "DRAMA",
    "PURE",
    "SENSIBILITY",
    "THRILL",
    "HISTORICAL",
    "SPORTS",
  ];

  const weekday = [
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
    // "23"
  ];

  // mobile list finish
  genres.map((genre) => {
    const src = `https://m.${NAVER}/finish.nhn?sort=HIT&genre=${genre}`;
    const $ = requestAndLoad(src);
    let totalPage = Number($(".paging_type2 em .total").text());
    if (!totalPage) {
      totalPage = 1;
    }
    for (let page = 1; page <= Number(totalPage); page++) {
      const src = `https://m.${NAVER}/finish.nhn?sort=HIT&genre=${genre}&page=${page}`;
      const $ = requestAndLoad(src);
      const list = $(".list_finish li");
      list.map((ele, j) => {
        const webtoon: MobileNaverWebtoon = {
          platform: "NAVER",
          title: $(j).find(".info .title").text(),
          author: $(j).find(".info .author").text(),
          thumbnail: $(j).find(".thumbnail img").attr("src"),
          isFinish: true,
          isPay: !!$(j).find(".thumbnail .area_badge .cookie").text(),
          isAdult: !!$(j).find(".thumbnail .area_badge .adult").text(),
          url: $(j).find("a").attr("href"),
        };
        if (webtoon.title && webtoon.author) webtoons.push(webtoon);
      });
    }
  });

  // mobile list not finish
  weekday.map((day) => {
    const src = `https://m.${NAVER}/weekday.nhn?week=${day}`;
    const $ = requestAndLoad(src);
    const list = $(".list_toon li");
    list.map((ele, j) => {
      const webtoon: MobileNaverWebtoon = {
        platform: "NAVER",
        title: $(j).find(".info .title").text(),
        author: $(j).find(".info .author").text(),
        thumbnail: $(j).find(".thumbnail img").attr("src"),
        isFinish: false,
        isPay: !!$(j).find(".thumbnail .area_badge .cookie").text(),
        isAdult: !!$(j).find(".thumbnail .area_badge .adult").text(),
        url: $(j).find("a").attr("href"),
      };
      if (webtoon.title && webtoon.author) webtoons.push(webtoon);
    });
  });

  // pc detail
  if (webtoons.length > 0) {
    const completeWebtoons: NaverWebtoon[] = webtoons.map(
      (webtoon: MobileNaverWebtoon, i) => {
        const src = `https://comic.naver.com${webtoon.url}`;
        const $ = requestAndLoad(src);
        $(".detail p").first().find("br").replaceWith(" ");
        $.html();
        const genres = $(".detail .detail_info .genre")
          .text()
          .replace(",", "/");
        const completeWebtoon = {
          ...webtoon,
          description: $(".detail p").first().text(),
          genres,
        };
        return completeWebtoon;
      }
    );
    return completeWebtoons;
  }
};

const main = async () => {
  try {
    const webtoons = crawl();
    save(webtoons, "/Users/seungyeop-kim/csv/naver.csv");
  } catch (err) {
    console.log(err);
  }
};

main();
