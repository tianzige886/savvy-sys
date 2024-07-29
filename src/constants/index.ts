import {
  NetworkType,
  PlatformType,
  TokenType,
  StatusType,
  LanguagesType,
} from "./types.td";

export const LOCALSTORAGE_TOKEN = "balance_sys_token";
export const LOCALSTORAGE_USER = "balance_sys_user";

export const Networks: NetworkType[] = [
  { chainId: "1", chainName: "testnet1", logo: "" },
  { chainId: "2", chainName: "testnet2", logo: "" },
  { chainId: "3", chainName: "testnet3", logo: "" },
];

export const Platforms: PlatformType[] = [
  { label: "ios", value: "ios" },
  { label: "android", value: "android" },
];

export const Languages: LanguagesType[] = [
  { label: "zh", value: "zh" },
  { label: "en", value: "en" },
];

export const Status: PlatformType[] = [
  { label: "status1", value: "1" },
  { label: "status2", value: "2" },
];

export const Tokens: TokenType[] = [
  { label: "token1", value: "1" },
  { label: "token2", value: "2" },
];
