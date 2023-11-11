import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap'
import AddModal from './AddModal'
import MySpinner from './MySpinner'
import { RefereshPage } from './RefreshComponent'
import ReportModal from './ReportModal'

export default function Contents(params) {
    const base_url = 'http://127.0.0.1:8000'
    let url_post_fix = {
        'Blood Donors' : '/getdonors',
        'Blood Seekers': '/getseekers',
        'Blood Inventory' :'/getinventory'
    }
    let headingMap = {
        'Blood Donors' : ['ID', 'Date', 'Name', 'Gender', 'Phone No', 'Blood Group', 'Units'],
        'Blood Seekers': ['ID', 'Date','Name', 'Gender', 'Phone No', 'Blood Group', 'Units', 'Status'],
        'Blood Inventory' :['Blood Group', 'Units']
    }
    let btnMap = {
        'Pending' : 'primary', 
        'Aceepted' : 'success', 
        'Declined' : 'danger'
    }

    const [data, setData] = useState(null)
    const [showAdd, setAdd] = useState(false)
    const [modify, setModify] = useState({})
    const [reportModal, setReportModal] = useState(false)
    const refreshConst = useContext(RefereshPage).refresh

    function toggel_add_model(){
        if(showAdd){
            setModify({})
        }
        setAdd(!showAdd);
    }

    function toggel_report_model(data = false){
        setReportModal(data)
    }


    useEffect(()=>{
        async function fetchData(){
            try {
                let response = await axios.get(base_url + url_post_fix[params.activeKey])
                if(response.status == 200){
                    setData(response.data)
                }
                else if(response.status == 204){
                    setData([])
                }
                else{
                    setData(-1)
                }
            } catch (error) {
                setData(-1)
                console.log(error)
            }
        }
        fetchData();
    },[params.activeKey, refreshConst])
    
    let heading = headingMap[params.activeKey]

  return Array.isArray(data) ? <>
  <div style={{'height' : '75vh', 'margin' : '0px 5px 10px 5px', 'overflowY' : 'scroll', 'padding' : '0px'}}>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                {heading.map((heading, index)=>{
                    return <th key={index}>{heading}</th>
                })}
                </tr>
            </thead>
            {data.length > 0 ?  
                <tbody>
                {
                    data.map((record,index)=>{
                        return <tr key={index} onClick={()=>{
                            if(params.activeKey != 'Blood Inventory'){
                                if(record['Status'] != 'Aceepted'){
                                    setModify(record); 
                                    toggel_add_model()
                                }else{
                                    toggel_report_model(record)
                                }
                                
                                }}}>
                            {
                                heading.map((value,index1)=>{
                                    if(value != 'Status'){
                                        return <td key={index1}>
                                            {record[value]}
                                        </td>
                                    }
                                    else{
                                        return <td key={index1}>
                                            <Button key={index1} disabled variant={btnMap[record[value]]}>
                                                {record[value]}
                                            </Button>
                                            </td>
                                    }
                                })
                            }
                        </tr>
                    })
                }
            </tbody> : <center><h4>No Data Found</h4></center>}
        </Table>
    </div>
    <AddModal show={showAdd} onHide={toggel_add_model} 
    tab={params.activeKey} modify={modify}/>

    {reportModal != false && <ReportModal show={reportModal} onHide={toggel_report_model}/>}

    <Button variant='outline-light' style={{'marginLeft' : '90%'}} 
    disabled={params.activeKey=='Blood Inventory'} onClick={toggel_add_model}>Add Record</Button>
  </> : data === -1 ? <h4>An Error happended</h4> : <MySpinner/>
}
