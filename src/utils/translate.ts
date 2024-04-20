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

// errorCode	text	错误返回码	一定存在
// query	text	源语言	查询正确时，一定存在
// translation	Array	翻译结果	查询正确时，一定存在
// basic	text	词义	基本词典，查词时才有
// web	Array	词义	网络释义，该结果不一定存在
// l	text	源语言和目标语言	一定存在
// dict	text	词典deeplink	查询语种为支持语言时，存在
// webdict	text	webdeeplink	查询语种为支持语言时，存在
// tSpeakUrl	text	翻译结果发音地址	翻译成功一定存在，需要应用绑定语音合成服务才能正常播放 否则返回110错误码
// speakUrl	text	源语言发音地址	翻译成功一定存在，需要应用绑定语音合成服务才能正常播放 否则返回110错误码
// returnPhrase	Array	单词校验后的结果	主要校验字母大小写、单词前含符号、中文简繁体

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

export async function translate({
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
      // console.log('翻译成功：', response.data);
      return response.data;
    } else {
      console.error('翻译出错，错误码：', response.data.errorCode);
    }
  } catch (error) {
    console.error('翻译出错:', error);
  }
}
