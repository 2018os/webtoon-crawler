import dotenv from "dotenv";

import { DaumWebtoon } from "../types";

import { DAUM, requestAndJSONParse, save } from "../tools";

dotenv.config();

const crawl = () => {
  const webtoons = [];
  ["free", "pay"].map((value) => {
    const src = `${DAUM}/data/pc/webtoon/list_finished/${value}`;
    const list = requestAndJSONParse(src);
    list.data.map(({ nickname }) => {
      const detailSrc = `http://webtoon.daum.net/data/pc/webtoon/view/${nickname}`;
      const { data } = requestAndJSONParse(detailSrc, {
        headers: {
          cookie: process.env.COOKIE,
        },
      });
      const daumWebtoon: DaumWebtoon = {
        title: data.webtoon.title,
        description: data.webtoon.introduction,
        isAdult: data.webtoon.ageGrade >= 19,
        isPay: data.webtoon.payYn === "Y",
        isFinish: data.webtoon.finishYn === "Y",
        url: data.webtoon.nickname,
        author:
          data.webtoon.cartoon.artists[0].name ==
          data.webtoon.cartoon.artists[1].name
            ? data.webtoon.cartoon.artists[0].name
            : data.webtoon.cartoon.artists
                .map((author) => author.name)
                .join("/"),
        platform: "DAUM",
        thumbnail: data.webtoon.pcHomeImage.url,
        genres: data.webtoon.cartoon.genres
          .map((genre) => genre.name)
          .join("/"),
      };
      console.log(daumWebtoon.title);
      if (daumWebtoon.title && daumWebtoon.author) webtoons.push(daumWebtoon);
    });
  });
  return webtoons;
};

const main = async () => {
  try {
    const webtoons = crawl();
    console.log(webtoons.length);
    save(webtoons, "/Users/seungyeop-kim/csv/daum-finished.csv");
  } catch (err) {
    console.log(err);
  }
};

main();
