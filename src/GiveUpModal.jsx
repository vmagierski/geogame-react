const GiveUpModal = ({ showModal, handleCloseModal, initialCountry }) => {


<Modal show={showGiveUpModal} onHide={handleCloseGiveUpModal}>
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
    };
    export default GiveUpModal