import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import SearchCard from './SearchCard';
import MySpinner from './MySpinner'

export default function SearchModal(params) {
    const [id, setId] = useState('')
    const [donor, setDonor] = useState(null)
    const [seeker, setSeeker] = useState(null)

    useEffect(()=>{
        async function fetchData(){
            if(id === ''){
                return
            }
            const donor_url = 'http://127.0.0.1:8000/searchdonor'
            const seeker_url = 'http://127.0.0.1:8000/searchseeker'

            try{    
                let donor_response = await axios.post(donor_url, {'ID' : id})
                let seeker_response = await axios.post(seeker_url, {'ID' : id})

                if(donor_response.status == 200){
                    if(Object.keys(donor_response.data).length > 0 && seeker_response.status == 200){
                        setDonor({
                            'Blood Donors' : donor_response.data
                        })
                    }
                    else{
                        setDonor({
                            'Blood Donors' : null
                        })
                    }

                    if(Object.keys(seeker_response.data).length > 0){
                        setSeeker({
                            'Blood Seekers' : seeker_response.data
                        })

                    }
                    else{
                        setSeeker({
                            'Blood Seekers' : null
                        })
                    }
                }
                else{
                    setDonor(-1)
                    setSeeker(-1)
                }

            }
            catch(err){
                console.log(err);
                setDonor(-1)
                setSeeker(-1)
            }
        }
        fetchData();
    },[id])

  return (
    <Modal className="my-modal"
    {...params}>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="d-flex">
            <Form.Control
              type="number"
              placeholder="Search by ID"
              value={id}
              onChange={(e)=>{setDonor(null);setSeeker(null);setId(e.target.value)}}
            />
            <Button variant="outline-light" style={{'marginLeft' : '10px'}}>Search</Button>
          </Form>
          <div>
            {console.log(donor == null && seeker == null && id != '', donor == null && seeker == null && id == '', donor == -1 || seeker == -1)}
            {donor == null && seeker == null && id != '' ? <MySpinner/> : 
             donor == null && seeker == null && id == '' ? <></> :
             donor == -1 || seeker == -1 ? <h3>Error Occured</h3> :
             <>
                <SearchCard title = 'Blood Donors' data={donor}/>
                <SearchCard title = 'Blood Seekers' data={seeker}/>
             </>}
          </div>
        </Modal.Body>
        
      </Modal>
  )
}
