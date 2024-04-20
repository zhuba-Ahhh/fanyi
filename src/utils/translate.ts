import axios from 'axios';
import CryptoJS from 'crypto-js';

const appKey = '60e4479f20e0a4d4';
const key = 'UHN5hjnYK5QYWEyQhzBPDsukxnVeLJ6P'; // 注意：暴露appSecret，有被盗用造成损失的风险
const from = 'zh-CHS'; // 'auto'
const to = 'en';
const vocabId = '用户词表ID';

function truncate(q: string): string {
  const len = q.length;
  return len <= 20 ? q : q.substring(0, 10) + len + q.substring(len - 10, len);
}

export default async function translate(query: string): Promise<void> {
  const salt = new Date().getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str1 = `${appKey}${truncate(query)}${salt}${curtime}${key}`;
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

  try {
    const response = await axios.post('/api', {
      q: query,
      appKey: appKey,
      salt: salt,
      from: from,
      to: to,
      sign: sign,
      signType: 'v3',
      curtime: curtime,
      vocabId: vocabId,
    });

    if (response.data.errorCode === '0') {
      console.log('翻译成功：', response.data.translation);
    } else {
      console.error('翻译出错，错误码：', response.data.errorCode);
    }
  } catch (error) {
    console.error('翻译出错:', error);
  }
}

// // 使用示例
// translate('欢迎');
