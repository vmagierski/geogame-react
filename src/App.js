import React, { useState, useEffect, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import GeoMap from './GeoMap';
import seedrandom from 'seedrandom';
import StartModal from './Components/StartModal';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');

  const [countriesData, setCountriesData] = useState(null);

  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [missedCountries, setMissedCountries] = useState([]);
  const [buttonText, setButtonText] = useState("Share Results");
  const [initialCountry, setInitialCountry] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [shareResults, setShareResults] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [showYouWinModal, setShowYouWinModal] = useState(false);
  const [bordersData, setBordersData] = useState({});
  const [userInputs, setUserInputs] = useState([]);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [error, setError] = useState('');
  const [resetFlag, setResetFlag] = useState(false);

  const [selected, setSelected] = useState([]);
  const typeaheadRef = useRef(null); // Create a reference

  

  useEffect(() => fetchBordersData(), []);
  const fetchBordersData = () => {
    fetch('/geogame-react/all_border_data.json')
      .then(res => res.json())
      .then(data => setBordersData(data))
      .catch(err => console.error('Error loading borders data:', err));
  };

  const handleGiveUp = () => {
    setHasGivenUp(true);
    setShowGiveUpModal(true);
    
    // Optional: Highlight the correct countries immediately
    // If bordersData for the initial country is an array of country names
    const correctCountries = bordersData[initialCountry.properties.ADMIN];
    const missed = correctCountries.filter(country => !userInputs.includes(country));
    setMissedCountries(missed);
  };

  const isValidCountry = (country) => {
    console.log('checking if valid country2: ')
    console.log('contry.properties.NAME' + JSON.stringify(country.properties.ADMIN))
    return bordersData[country.properties.ADMIN] && bordersData[country.properties.ADMIN].length !== 0;
  };

  const startNewGame = () => {
    resetGameState();
    selectPseudoRandomCountry();
   // selectRandomCountryNoValidCheck();
//    setInitialCountry();
  };

  const resetGameState = () => {
    setMissedCountries([]);
    setUserInputs([]);
    setError('');
    setShowGiveUpModal(false);
    setHighlightedCountry(null);
    setHighlightedCountries([]);
    setHasGivenUp(false);
    setHasWon(false);
    setResetFlag(true);
    setShareResults(false);// better way of this?
    setTimeout(() => setResetFlag(false), 100); // might not need this?
  };

  const selectRandomCountryNoValidCheck= () => {
    if (Object.keys(bordersData).length > 0) {
      fetch('/geogame-react/COUNTRIESJSON.json.geojson')
       .then(res => res.json())
       .then(data => {
       if (data.features.length > 0) {
        let randomCountry;
        const randomIndex = Math.floor(Math.random() * data.features.length)
        randomCountry = data.features[randomIndex];
        setInitialCountry(randomCountry);
    
    }})
    .catch(err => console.error(err));
    }
  };

  const selectPseudoRandomCountry = () => {
    if (Object.keys(bordersData).length > 0) {
      if (countriesData){
        if (countriesData.features.length > 0) {
            let randomCountry;
            let attempts=0;
            const today = new Date();
            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
            const pseudoRandom = new seedrandom(seed);
            do {
                  const randomIndex = Math.floor(pseudoRandom() * countriesData.features.length)
                  randomCountry = countriesData.features[randomIndex];
                  attempts++;
            } while (!isValidCountry(randomCountry) && attempts<50);
            if (attempts >= 50) {
              alert("Site under maintenance");
              console.error("Failed to find a valid country after 50 attempts"); 
              console.log('last attept random country = : ' +  randomCountry.properties.NAME);
              // Handle failure to find a valid country (e.g., select a default country or show an error)
            } else {
              console.log('found valid country: ' + JSON.stringify(randomCountry.properties.NAME))
              setInitialCountry(randomCountry);
            }
        }
      }
    }
  };

  // const selectPseudoRandomCountry = () => {
  //   if (Object.keys(bordersData).length > 0) {
  //     fetch('/geogame-react/COUNTRIESJSON.json.geojson')
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.features.length > 0) {
  //           let randomCountry;
  //           let attempts=0;
  //           const today = new Date();
  //           const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  //           const pseudoRandom = new seedrandom(seed);
  //           do {
  //                 const randomIndex = Math.floor(pseudoRandom() * data.features.length)
  //                 randomCountry = data.features[randomIndex];
  //                 attempts++;
  //           } while (!isValidCountry(randomCountry) && attempts<50);
  //           if (attempts >= 50) {
  //             alert("Site under maintenance");
  //             console.error("Failed to find a valid country after 50 attempts"); 
  //             console.log('last attept random country = : ' +  randomCountry.properties.NAME);
  //             // Handle failure to find a valid country (e.g., select a default country or show an error)
  //           } else {
  //             console.log('found valid country: ' + JSON.stringify(randomCountry.properties.NAME))
  //             setInitialCountry(randomCountry);
  //           }          }
  //       })
  //       .catch(err => console.error(err));
  //   }
  // };

  useEffect(() => startNewGame(), [bordersData, countriesData]);


  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleCloseGiveUpModal = () => {
    setShowGiveUpModal(false);
  }
  const handleCloseYouWinModal = () => {
    setShowYouWinModal(false);
  }

  const handlePlayAgain = () => {
    setShowGiveUpModal(false);
    setButtonText("Share Results");
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

  const handleNewChange = (event) => {
    console.log(event.selected);
  }



const handleKeyPress = (event) => {
  if (event.key === 'Enter' ) {
    
    // always upper case the first letter of the user's input, so that if
    // a user types "poland" and hits "Enter", "Poland" will be submitted
    // which is how the coutnry name is stored in the data currently
    let inputCountry = ""; 
    if (selected.length > 0){
      inputCountry = selected[0]
    } else if (event.target){
      const rawinput = event.target.value;
      inputCountry = rawinput.substring(0,1).toUpperCase() + rawinput.substring(1);
    }

    if (initialCountry && bordersData[initialCountry.properties.ADMIN]) {
      const borderCountries = bordersData[initialCountry.properties.ADMIN];
      // console.log("Input Country:", inputCountry);

    if (borderCountries.includes(inputCountry)) {
      // console.log("Setting highlighted country:", inputCountry);
      setHighlightedCountries(prevCountries => [...prevCountries, inputCountry]); // Add to highlighted countries
          setUserInputs(prevInputs => {
            const updatedInputs = new Set([...prevInputs, inputCountry]);
            // console.log("updatedInputs (i.e. countries the user has already typed):", [...updatedInputs]);
            if (updatedInputs.size === borderCountries.length) {
              // User has input all bordering countries
              setShowYouWinModal(true);
              setHasWon(true);
            }
            return [...updatedInputs];
          });
          setError('');
        } else {
          // console.log("Error: Country does not border.");
           setError('This country does not border the initially selected country.');
       }
    } else {
      console.log("Error: Initial country data still loading.");
      setError('Initial country data is still loading...');
    }
    setInputValue('');
    if (typeaheadRef.current) {
        typeaheadRef.current.clear();
    }
    setSelected('');
  }
};

const countryNames = Object.keys(bordersData);

const handleShare = () => {
  //✅❌
  // ToDo also need to clean this to not have to recompute, since we do it elsewhere in the code
  const correctCountries = bordersData[initialCountry.properties.ADMIN];
  const missed = correctCountries.filter(country => !userInputs.includes(country));
  const score = "✅".repeat(userInputs.length) + "❌".repeat(missed.length)
  console.log(score);
  navigator.clipboard.writeText(score + '\nhttps://vmagierski.github.io/geogame-react/');
  setShareResults(true);
  setButtonText("Copied To Clipboard");
}
  //todo so lazy, should be doing component rendering here
  return (
    <div className="App bg-texture">
    <div className="row justify-content-center mt-4">

     <StartModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        initialCountry={initialCountry}
      />

      <Modal show={showGiveUpModal} onHide={handleCloseGiveUpModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>:(</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center my-4"> The countries bordering {initialCountry ? 
                    ` ${initialCountry.properties.ADMIN}` 
                    : ' Loading...'} are: {initialCountry ? 
                    ` ${bordersData[initialCountry.properties.ADMIN]}` 
                    : ' Loading...'}</p>
          <p className="text-center my-4"> The countries you guessed were: {userInputs ? 
              ` ${userInputs}` 
              : ' Loading...'}</p>
              <p className="text-center my-4"> The countries you missed were: {missedCountries ? 
              ` ${missedCountries}` 
              : ' Loading...'}</p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePlayAgain}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={handleShare}> {buttonText} </Button>
        </Modal.Footer>
      </Modal>

       <Modal show={showYouWinModal} onHide={handleCloseYouWinModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Well Done!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p> Yay! You Win!</p> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePlayAgain}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={handleShare}> Share Results </Button>

        </Modal.Footer>
      </Modal>
    </div> 
      <div className="container">

      <h1 className="text-center my-4">The Bordering Countries Quiz</h1>
      <h4> Which countries border {initialCountry ? initialCountry.properties.ADMIN : ' Loading'} ?</h4>

        <div className="row justify-content-center">
          <div className="col-lg-8">
              <GeoMap 
                countriesData={countriesData}
                setCountriesData={setCountriesData}
                dataUrl="/geogame-react/COUNTRIESJSON.json.geojson" 
                highlightCountry={highlightedCountry} 
                missedCountries={missedCountries}
                initialCountry={initialCountry} 
                hasGivenUp={hasGivenUp}
                hasWon={hasWon}
                highlightedCountries={highlightedCountries}
                bordersData={bordersData}
                resetGame={resetFlag}
              />
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-md-6">

             <Typeahead 
              id="user-input-field"
              className={`form-control mb-4 ${error ? 'is-invalid' : ''}`}
              onChange={setSelected}
              flip={true}
              options={countryNames}
              disabled={hasGivenUp||hasWon}
              onKeyDown={handleKeyPress}
              placeholder="Type in a country..."
              selected={selected}
              maxResults={4}
              minLength={1}
              ref={typeaheadRef}
            />
            {error && <div className="invalid-feedback">{error}</div>}


          </div>

      <div className="row justify-content-center mb-3">
        <div className="col-md-3 d-grid gap-3">
          <Button variant="primary" onClick={handleSubmit} className="btn-block">Submit</Button>
          <Button variant="warning" onClick={handleGiveUp} className="btn-block">I Give Up</Button>
        </div>
      </div>

        </div>
      </div>
    </div>
  );
}

export default App;
