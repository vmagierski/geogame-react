import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import GeoMap from './GeoMap';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [initialCountry, setInitialCountry] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [bordersData, setBordersData] = useState({});
  const [userInputs, setUserInputs] = useState([]);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => fetchBordersData(), []);
  const fetchBordersData = () => {
    fetch('/country-borders.json')
      .then(res => res.json())
      .then(data => setBordersData(data))
      .catch(err => console.error('Error loading borders data:', err));
  };

  const handleGiveUp = () => {
    if (initialCountry && isValidCountry(initialCountry)) {
      setHasGivenUp(true);
      setShowGiveUpModal(true);
    }
  };

  const isValidCountry = (country) => {
    return bordersData[country.properties.name] && bordersData[country.properties.name].length !== 0;
  };

  const startNewGame = () => {
    resetGameState();
    selectRandomCountry();
  };

  const resetGameState = () => {
    setUserInputs([]);
    setShowGiveUpModal(false);
    setHighlightedCountry([]);
    setHasGivenUp(false);
  };

  const selectRandomCountry = () => {
    if (Object.keys(bordersData).length > 0) {
      fetch('/custom.geo.json')
        .then(res => res.json())
        .then(data => {
          if (data.features.length > 0) {
            let randomCountry;
            do {
              randomCountry = data.features[Math.floor(Math.random() * data.features.length)];
            } while (!isValidCountry(randomCountry));
            setInitialCountry(randomCountry);
          }
        })
        .catch(err => console.error(err));
    }
  };

  useEffect(() => startNewGame(), [bordersData]);


  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleCloseGiveUpModal = () => {
    setShowGiveUpModal(false);
    startNewGame();

  }
  const handleSubmit = () => {
    handleKeyPress({ key: 'Enter' });
  };
  const handleInputChange = (event) => {
    setError(''); // Clear error on input change
    setInputValue(event.target.value);
  };

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    const inputCountry = inputValue.trim().toLowerCase();

    if (initialCountry && bordersData[initialCountry.properties.name]) {
      const borderCountries = bordersData[initialCountry.properties.name].map(country => country.toLowerCase());
      console.log("Input Country:", inputCountry);
      console.log("Border Countries:", borderCountries);

      if (borderCountries.includes(inputCountry)) {
        console.log("Setting highlighted country:", inputCountry);
        setHighlightedCountry(inputCountry);
          setUserInputs(prevInputs => {
            const updatedInputs = new Set([...prevInputs, inputCountry]);
            console.log("updatedInputs (i.e. countries the user has already typed):", [...updatedInputs]);
            if (updatedInputs.size === borderCountries.length) {
              // User has input all bordering countries
              alert("Congratulations! You've identified all bordering countries!");
            }
            return [...updatedInputs];
          });
          setError('');
        } else {
          console.log("Error: Country does not border.");
         setError('This country does not border the initially selected country.');
       }
    } else {
      console.log("Error: Initial country data still loading.");
      setError('Initial country data is still loading...');
    }
    setInputValue('');
  }
};


console.log(initialCountry ? "initial random country =  : " + initialCountry.properties.name : "");
const countryNames = Object.keys(bordersData);
console.log(initialCountry ? "answers  : " + bordersData[initialCountry.properties.name] : "");

  return (
    <div className="App bg-texture">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to the Geography Game!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Hello, player! Let's play. What countries (clockwise) share borders with {initialCountry ? 
                    ` ${initialCountry.properties.name}?` 
                    : ' Loading...'}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Start Playing
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showGiveUpModal} onHide={handleCloseGiveUpModal}>
        <Modal.Header closeButton>
          <Modal.Title>you tried</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p> The countries you missed were: {initialCountry ? 
                    ` ${bordersData[initialCountry.properties.name]}` 
                    : ' Loading...'}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseGiveUpModal}>
            Play Again
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 className="text-center my-4">The Bordering Countries Quiz</h1>
      <h4> Which countries border {initialCountry ? initialCountry.properties.name : ' Loading'} ?</h4>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
              <GeoMap 
                dataUrl="/custom.geo.json" 
                highlightCountry={highlightedCountry} 
                initialCountry={initialCountry} 
                hasGivenUp={hasGivenUp}
                bordersData={bordersData}
              />
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <input
              list="countries"
              type="text"
              className={`form-control mb-4 ${error ? 'is-invalid' : ''}`}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type in a country..."
            />
        {error && <div className="invalid-feedback">{error}</div>}
            <datalist id="countries">
              {countryNames.map((name, index) => (
                <option key={index} value={name} />
              ))}
            </datalist>
            <Button variant="primary" onClick={handleSubmit} className="mt-2">Submit</Button>

          </div>
           <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <button className="btn btn-warning" onClick={handleGiveUp}>I Give Up</button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;