import { useEffect, useRef } from 'react';
import './App.css';
import { useState } from 'react';
//import { ml5 } from 'ml5';
import useInterval from '@use-it/interval';
import { Watch } from 'react-loader-spinner';
import Chart from './components/Chart';
import Alunos from './components/Alunos';

let classifier;

let ml5: any;

function App() {
  const videoRef = useRef();
  const [start, setStart] = useState(false);
  const [result, setResult] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ml5 = require('ml5')
  }, []);

  useEffect(() => {
    classifier = ml5.imageClassifier("../public/model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setLoaded(true);
        });
    });
  }, []);

  useInterval(() => {
    if (classifier && start) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        setResult(results);
        // console.log(results)
      });
    }
  }, 500);

  const toggle = () => {
    setStart(!start);
    setResult([]);
  }

  return (
    <div className="container">
      <Watch
        //type="Watch"
        color="#00BFFF"
        height={200}
        width={200}
        visible={!loaded}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}
      />
      <div className="upper">
        <div className="capture">
          <video
            ref={videoRef}
            style={{ transform: "scale(-1, 1)" }}
            width="300"
            height="150"
          />
          {loaded && (
            <button onClick={() => toggle()}>
              {start ? "Stop" : "Start"}
            </button>
          )}
        </div>
        {result.length > 0 && (
          <div>
            <Chart data={result[0]} />
          </div>
        )}
      </div>
      {result.length > 0 && (
        <div className="results">
          <Alunos data={result} />
        </div>
      )}
    </div>
  );
}

export default App;
