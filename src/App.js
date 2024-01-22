import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import GeoMap from './GeoMap';
import seedrandom from 'seedrandom';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');

  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [missedCountries, setMissedCountries] = useState([]);
  const [initialCountry, setInitialCountry] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [showYouWinModal, setShowYouWinModal] = useState(false);
  const [bordersData, setBordersData] = useState({});
  const [userInputs, setUserInputs] = useState([]);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [error, setError] = useState('');
  const [resetFlag, setResetFlag] = useState(false);
  

  useEffect(() => fetchBordersData(), []);
  const fetchBordersData = () => {
    fetch('/geogame-react/country-borders.json')
      .then(res => res.json())
      .then(data => setBordersData(data))
      .catch(err => console.error('Error loading borders data:', err));
  };

  const handleGiveUp = () => {
    setHasGivenUp(true);
    setShowGiveUpModal(true);
    
    // Optional: Highlight the correct countries immediately
    // If bordersData for the initial country is an array of country names
    const correctCountries = bordersData[initialCountry.properties.name].map(name => name.toLowerCase());

    const missed = correctCountries.filter(country => !userInputs.includes(country));
    setMissedCountries(missed);
  };

  const isValidCountry = (country) => {
    return bordersData[country.properties.name] && bordersData[country.properties.name].length !== 0;
  };

  const startNewGame = () => {
    resetGameState();
    selectRandomCountry();
  };

  const resetGameState = () => {
    setMissedCountries([]);
    setUserInputs([]);
    setShowGiveUpModal(false);
    setHighlightedCountry(null);
    setHighlightedCountries([]);
    setHasGivenUp(false);
    setResetFlag(true);
    setTimeout(() => setResetFlag(false), 100);
  };

  const selectRandomCountry = () => {
    if (Object.keys(bordersData).length > 0) {
      fetch('/geogame-react/custom.geo.json')
        .then(res => res.json())
        .then(data => {
          if (data.features.length > 0) {
            let randomCountry;
            let attempts=0;
            const today = new Date();
            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
            const pseudoRandom = new seedrandom(seed);
            do {
                  const randomIndex = Math.floor(pseudoRandom() * data.features.length)
                  randomCountry = data.features[randomIndex];
                  attempts++;
            } while (!isValidCountry(randomCountry) && attempts<50);
            if (attempts >= 50) {
              alert("Site under maintenance");
              console.error("Failed to find a valid country after 50 attempts"); 
              console.log('last attept random country = : ' +  randomCountry.properties.name);
              // Handle failure to find a valid country (e.g., select a default country or show an error)
            } else {
              setInitialCountry(randomCountry);
            }          }
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
  const handleCloseYouWinModal = () => {
    setShowYouWinModal(false);
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

    if (borderCountries.includes(inputCountry)) {
      console.log("Setting highlighted country:", inputCountry);
      setHighlightedCountries(prevCountries => [...prevCountries, inputCountry]); // Add to highlighted countries
          setUserInputs(prevInputs => {
            const updatedInputs = new Set([...prevInputs, inputCountry]);
            console.log("updatedInputs (i.e. countries the user has already typed):", [...updatedInputs]);
            if (updatedInputs.size === borderCountries.length) {
              // User has input all bordering countries
              setShowYouWinModal(true);
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

const countryNames = Object.keys(bordersData);

  return (
    <div className="App bg-texture">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Country Borders Game!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Can you list the countries that share borders with {initialCountry ? 
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
          <p> The countries bordering {initialCountry ? 
                    ` ${initialCountry.properties.name}` 
                    : ' Loading...'} are: {initialCountry ? 
                    ` ${bordersData[initialCountry.properties.name]}` 
                    : ' Loading...'}</p>
          <p> The countries you guessed were: {userInputs ? 
              ` ${userInputs}` 
              : ' Loading...'}</p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseGiveUpModal}>
            Play Again
          </Button>
        </Modal.Footer>
      </Modal>

       <Modal show={showYouWinModal} onHide={handleCloseYouWinModal}>
        <Modal.Header closeButton>
          <Modal.Title>Well Done!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p> Yay! You Win!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseYouWinModal}>
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
                dataUrl="/geogame-react/custom.geo.json" 
                highlightCountry={highlightedCountry} 
                missedCountries={missedCountries}
                initialCountry={initialCountry} 
                hasGivenUp={hasGivenUp}
                highlightedCountries={highlightedCountries}
                bordersData={bordersData}
                resetGame={resetFlag}
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
            <Button 
                className="btn btn-warning" 
                onClick={handleGiveUp}>
                I Give Up
            </Button>

          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
