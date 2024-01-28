import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const StartModal = ({ showModal, handleCloseModal, initialCountry }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Country Borders Game!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Can you list the countries that share borders with {initialCountry ? `${initialCountry.properties.ADMIN}?` : 'Loading...'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Start Playing
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StartModal;
