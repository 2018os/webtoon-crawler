import { load } from "cheerio";
import ObjectsToCsv from "objects-to-csv";
import request, { Options } from "sync-request";

export const NAVER = "http://comic.naver.com/webtoon";

export const DAUM = "http://webtoon.daum.net";

export const requestAndLoad = (url: string, option?: Options) => {
  const res = request("GET", url, option);
  const html = res.getBody();
  return load(html);
};

export const requestAndJSONParse = (url: string, option?: Options) => {
  const res = request("GET", url, option);
  const result = JSON.parse(res.body.toString());
  return result;
};

export const save = (data: any, path: string) => {
  const csv = new ObjectsToCsv(data);
  csv.toDisk(path);
};
