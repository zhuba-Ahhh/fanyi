import { useCallback, useState } from 'react';
import { Button, Input, Select, Tooltip } from 'antd';
import { translate, uuid, Web, Basic } from '../utils';

export const YouDao = () => {
  const [query, setQuery] = useState('Hello World');
  const [to, setTo] = useState('en');
  const [translations, setTranslations] = useState<string[]>([]);
  const [webs, setWebs] = useState<Web[]>([]);
  const [basics, setBasic] = useState<Basic>();
  const onClick = useCallback(() => {
    translate({ query, to })
      .then((res) => {
        if (res && res.errorCode === '0') {
          setTranslations(res?.translation || []);
          setWebs(res?.web || []);
          setBasic(res?.basic);
        }
      })
      .catch((error) => {
        console.error('翻译出错:', error);
      });
  }, [query, to]);

  const translationRender = useCallback(
    () => (
      <div className="flex flex-col items-start justify-center mt-4">
        {translations.map((translation, index) => (
          <div key={translation + uuid(index)} className="text-left">
            {translation}
          </div>
        ))}
      </div>
    ),
    [translations]
  );

  const webRender = useCallback(
    () => (
      <div className="flex flex-col items-start justify-center">
        {webs.map((web, index) => (
          <div key={web.key + uuid(index)} className="text-left mt-2">
            {web.key}：{web.value.join('、')}
          </div>
        ))}
      </div>
    ),
    [webs]
  );

  const explainsRender = useCallback(
    () => <div className="text-center mt-4">{basics?.explains.join('、')}</div>,
    [basics]
  );

  return (
    <>
      <div className="flex items-center justify-center w-full max-w-800 mx-auto space-x-6 pt-1/3">
        <Input
          className="flex-grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: '600px' }}
        />
        <Tooltip title={'目标语言'}>
          <Select
            defaultValue={'en'}
            title={'目标语言'}
            style={{ width: 120 }}
            onChange={setTo}
            options={[
              { value: 'zh-CHS', label: '简体中文' },
              { value: 'zh-CHT', label: '繁体中文' },
              { value: 'en', label: '英文' },
            ]}
          />
        </Tooltip>
        <Button onClick={onClick} type="primary">
          translate
        </Button>
      </div>
      {translationRender()}
      {explainsRender()}
      {webRender()}
    </>
  );
};
