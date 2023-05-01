import { useState, useEffect } from 'react'
import './App.css'
import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import { BeatLoader } from 'react-spinners';

function App() {

  const [quest, setQuest] = useState('');
  const [passage, setPassage] = useState('');
  const [model, setModel] = useState<qna.QuestionAndAnswer | null>(null);
  const [answer, setAnswer] = useState('');

  //Model Loading function
  const loadModel = async () => {
    await tf.setBackend('webgl'); //backend for tensorflow
    const model = await qna.load();
    setModel(model);
    console.log(" Model loaded successfully");
  }

  useEffect(() => {
    loadModel();
  }, [])

  async function provideAnswer() {
    if (model === null) return;
    const result = await model.findAnswers(quest, passage);
    setAnswer(result[0]?.text);
    console.log(result);
  }

  return (
    <div className='main'>
      <div className='header'>
        <h1>B.E.R.T</h1>
        <p>Trial Implementation of BERT in React</p>
      </div>

      {model === null ? <div className='notWorking'><p>Please be patient , while model is loading</p><BeatLoader color={'#ffe3c2'} loading={true} /></div> :
        <div className='working'>
          <div className='question'>
            <textarea placeholder='Provide your passage...' value={passage} onChange={(e) => setPassage(e.target.value)} />
            <input type='text' placeholder='Enter your question?' value={quest} onChange={(e) => setQuest(e.target.value)} />
            <button onClick={provideAnswer}>Submit</button>
          </div>
          <div className='answer'>
            <p>{answer}</p>
          </div>
        </div>}
    </div>
  )
}

export default App
