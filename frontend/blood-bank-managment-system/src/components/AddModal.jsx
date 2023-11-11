import React from 'react'
import { Modal } from 'react-bootstrap'
import NewRecordForm from './NewRecordForm'

function AddModal(params){
  return (
    <Modal className="my-modal"
    {...params}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {(Object.keys(params.modify)).length != 0 ? `Modify ${params.tab}`:`Add ${params.tab}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NewRecordForm tab={params.tab}
        hideModal={params.onHide}
        modify={params.modify}/>
      </Modal.Body>
      
    </Modal>
  )
}

export default AddModal