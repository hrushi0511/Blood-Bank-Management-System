import React from 'react'
import Card from 'react-bootstrap/Card';

export default function SearchCard(params){
  const headingMap = {
        'Blood Donors' : ['ID', 'Date', 'Name', 'Gender', 'Phone No', 'Blood Group', 'Units'],
        'Blood Seekers': ['ID', 'Date','Name', 'Gender', 'Phone No', 'Blood Group', 'Units', 'Status']
  }
  return (
    <Card style={{ width: '60%', margin : '10px' }}>
      <Card.Body>
        <Card.Title>{params.title}</Card.Title>
        {params.data[params.title] != null ?
          <>
          {
            headingMap[params.title].map((title,index)=>{
              return <Card.Text key={index}>{`${title} : ${params.data[params.title][title]}`}</Card.Text>
            })
          }
          </> :
          <Card.Text>{`No ${params.title} Found.`}</Card.Text>}
      </Card.Body>
    </Card>
  )
}
