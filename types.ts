export type Platform = "NAVER" | "DAUM";

export type MobileNaverWebtoon = {
  title: String;
  platform: Platform;
  isFinish: Boolean;
  isAdult: Boolean;
  isPay: Boolean;
  thumbnail: string;
  url: string;
  author: string;
};

export type PcNaverWebtoon = {
  description: String;
  genres: string;
};

export type ListDaumWebtoon = {
  title: String;
  platform: Platform;
  isFinish: Boolean;
  isAdult: Boolean;
  isPay: Boolean;
  url: string;
  author: string;
};

export type DetailDaumWebtoon = {
  thumbnail: string;
  description: String;
  genres: string;
};

export type DaumWebtoon = ListDaumWebtoon & DetailDaumWebtoon;

export type NaverWebtoon = MobileNaverWebtoon & PcNaverWebtoon;
