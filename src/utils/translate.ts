import axios from 'axios';
import CryptoJS from 'crypto-js';
import qs from 'qs'; // 用于序列化表单数据

export interface translateParameter {
  query: string;
  from: string;
  to: string;
  key: string;
  appKey: string;
  vocabId: string;
}

export interface translateRetrunValue {
  returnPhrase: string[];
  query: string;
  errorCode: string;
  l: string;
  tSpeakUrl: string;
  web: Web[];
  requestId: string;
  translation: string[];
  mTerminalDict: MTerminalDict;
  dict: Dict;
  webdict: Webdict;
  basic: Basic;
  isWord: boolean;
  speakUrl: string;
}

export interface Web {
  value: string[];
  key: string;
}

export interface MTerminalDict {
  url: string;
}

export interface Dict {
  url: string;
}

export interface Webdict {
  url: string;
}

export interface Basic {
  exam_type: string[];
  'us-phonetic': string;
  phonetic: string;
  'uk-phonetic': string;
  wfs: Wf[];
  'uk-speech': string;
  explains: string[];
  'us-speech': string;
}

export interface Wf {
  wf: Wf2;
}

export interface Wf2 {
  name: string;
  value: string;
}

export default async function translate({
  query = '你好世界',
  from = 'auto',
  to = 'en',
  key = 'UHN5hjnYK5QYWEyQhzBPDsukxnVeLJ6P',
  appKey = '60e4479f20e0a4d4',
  vocabId = '用户词表ID',
}: Partial<translateParameter>): Promise<translateRetrunValue | void> {
  const truncate = (q: string): string => {
    const len = q.length;
    return len <= 20 ? q : q.substring(0, 10) + len + q.substring(len - 10, len);
  };

  const salt = new Date().getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str1 = `${appKey}${truncate(query)}${salt}${curtime}${key}`;
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

  const formData = {
    q: query,
    appKey,
    salt,
    from,
    to,
    sign,
    signType: 'v3',
    curtime,
    vocabId,
  };

  try {
    const response = await axios.post('/api', qs.stringify(formData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 设置请求头
      },
    });

    if (response.data.errorCode === '0') {
      console.log('翻译成功：', response.data);
      return response.data;
    } else {
      console.error('翻译出错，错误码：', response.data.errorCode);
    }
  } catch (error) {
    console.error('翻译出错:', error);
  }
}
