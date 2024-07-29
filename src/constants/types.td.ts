// import type { SelectProps } from 'antd';
// const options: SelectProps['options'] = [];

export interface UserPointsDataType {
  id: number;
  username: string;
  day: string;
  created_at: string;
  streak: number;
  totalPoints: number;
  hash: string;
  network: string;
}

export interface NetworkType {
  chainId: string;
  chainName: string;
  logo?: string;
}

export interface StatusType {
  value: string;
  label: string;
}

export interface PlatformType {
  value: string;
  label: string;
}

export interface TokenType {
  value: string;
  label: string;
}

export interface LanguagesType {
  value: string;
  label: string;
}
