import { DaumWebtoon } from "../types";

import { DAUM, requestAndJSONParse, save } from "../tools";

const crawl = () => {
  const webtoons = [];
  const weekday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  weekday.map((day) => {
    const src = `${DAUM}/data/pc/webtoon/list_serialized/${day}`;
    const list = requestAndJSONParse(src);
    list.data.map((data) => {
      const webtoon: DaumWebtoon = {
        title: data.title,
        description: data.introduction,
        isAdult: data.ageGrade >= 19,
        isPay: data.payYn === "Y",
        isFinish: data.finishYn === "Y",
        url: data.nickname,
        author:
          data.cartoon.artists[0].name == data.cartoon.artists[1].name
            ? data.cartoon.artists[0].name
            : data.cartoon.artists.map((author) => author.name).join("/"),
        platform: "DAUM",
        thumbnail: data.pcHomeImage.url,
        genres: data.cartoon.genres.map((genre) => genre.name).join("/"),
      };
      console.log(webtoon.title);
      if (webtoon.title && webtoon.author) webtoons.push(webtoon);
    });
  });
  return webtoons;
};

const main = async () => {
  try {
    const webtoons = crawl();
    save(webtoons, "/Users/seungyeop-kim/csv/daum-serialized.csv");
  } catch (err) {
    console.log(err);
  }
};

main();
