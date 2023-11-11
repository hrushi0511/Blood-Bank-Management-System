import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { useState } from 'react'
import Contents from './Contents'
import { RefreshComponent } from './RefreshComponent'

export default function MyTabs(params) {
    let mytabs = ['Blood Donors', 'Blood Seekers', 'Blood Inventory']
    const [selectTab, changeTab] = useState(mytabs[0])
  return (
    <>
    <Tabs activeKey={selectTab} onSelect={(k)=>changeTab(k) } 
    id="fill-tab-example" className="mb-3"
    fill>
        {
            mytabs.map((tab,index)=>{
                return <Tab key={tab} eventKey={tab} title={tab}></Tab>
            })
        }
    </Tabs>
    <RefreshComponent>
      <Contents activeKey = {selectTab}/>
    </RefreshComponent>
    </>
  )
}
