import { Button } from 'components/Button';
import FaviconSVG from 'assets/favicon.svg';
import translate from './utils/translate';
import { useState } from 'react';

function App() {
  const [str, setStr] = useState("")
  return (
    <>
      <img src={FaviconSVG} className="logo" alt="Vite logo" height={100} width={100} />
      <Button onClick={() => translate('Hello')}>Hello</Button>
      {/* {setStr} */}
    </>
  );
}

export default App;
