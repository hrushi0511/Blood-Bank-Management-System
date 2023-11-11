import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Modal, Table, Button } from 'react-bootstrap'
import MySpinner from './MySpinner'
export default function ReportModal(params) {
    const [report, setReport] = useState(null)

    useEffect(()=>{
        async function fetchData(){
            const report_url = 'http://127.0.0.1:8000/getreport'
            const donor_url = 'http://127.0.0.1:8000/searchdonor'
            let response = await axios.post(report_url,params.show)
            if(response.status == 200){
                let price = response.data['Price']
                let donors = response.data['Donor ID']
                let donor_details = []
                for(var i = 0; i < donors.length; i++){
                    let donor = donors[i]
                    let donor_id = donor[0]
                    let units = donor[1]
                    let response = await axios.post(donor_url,{'ID' : donor_id})
                    if(response.status == 200){
                        let data = {
                            'Donor ID' : response.data['ID'],
                            'Donor Name' : response.data['Name'],
                            'Units' : units
                        }
                        donor_details.push(data)
                    }
                }
                setReport({
                    'Seeker ID' : params.show['ID'],
                    'Seeker Name' : params.show['Name'],
                    'Date' : params.show['Date'],
                    'Blood Group' : params.show['Blood Group'],
                    'Units' : params.show['Units'],
                    'Price of Each Unit' : price,
                    'Donors' : donor_details,
                    'Total' : price * params.show['Units']
                })
            }
            else{
                setReport(-1);
            }
        }
        fetchData();
    },[])

    let seeker_labels = ['Seeker ID','Seeker Name', 'Date', 'Blood Group', 'Units', 'Price of Each Unit',
    'Donors','Total']
    let donor_labels = ['Donor ID', 'Donor Name', 'Units']


  return (
    <Modal className="my-modal"
    show = {params.show != false}
    onHide = {params.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Report
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{'overflowY' : 'scroll', 'height' : '75vh'}}>
        {   report == -1 ? <h4>An Error Happened</h4> : report == null ? <MySpinner/> :
        seeker_labels.map((title,index)=>{
            return <div key={index}>
                        <h4>{title}</h4>
                        {title != 'Donors' ? <><p>{report[title]}</p> <hr/></> : <>
                            {
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            {
                                                donor_labels.map((title,ind1)=>{
                                                    return <th key={ind1}>{title}</th>
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            report[title].map((donor,ind2)=>{
                                                return <tr key={ind2}>
                                                    {
                                                        donor_labels.map((donor_key,ind3)=>{
                                                            return <td key={ind3}>{donor[donor_key]}</td>
                                                        })
                                                    }
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            }
                            <hr/>
                        </>}
                    </div>
        })
        }
        <Button variant='outline-light' onClick={()=>{params.onHide(false)}}>Close</Button>
        </div>
      </Modal.Body>
      
    </Modal>
  )
}
