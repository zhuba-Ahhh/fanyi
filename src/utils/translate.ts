import axios from 'axios';
import CryptoJS from 'crypto-js';

function truncate(q: string): string {
  const len = q.length;
  return len <= 20 ? q : q.substring(0, 10) + len + q.substring(len - 10, len);
}

export interface translateParams {
  query: string;
  from: string;
  to: string;
  key: string;
  appKey: string;
  vocabId: string;
}

export default async function translate({
  query = '你好世界',
  from = 'auto',
  to = 'en',
  key = 'UHN5hjnYK5QYWEyQhzBPDsukxnVeLJ6P',
  appKey = '60e4479f20e0a4d4',
  vocabId = '用户词表ID',
}: Partial<translateParams>): Promise<Record<string, any> | void> {
  const salt = new Date().getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str1 = `${appKey}${truncate(query)}${salt}${curtime}${key}`;
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

  try {
    const response = await axios.post('/api', {
      q: query,
      appKey,
      salt,
      from,
      to,
      sign,
      signType: 'v3',
      curtime,
      vocabId,
    });

    if (response.data.errorCode === '0') {
      console.log('翻译成功：', response.data);
      return response.data;
    } else {
      console.error('翻译出错，错误码：', response.data.errorCode);
      return void 0;
    }
  } catch (error) {
    console.error('翻译出错:', error);
  }
}
