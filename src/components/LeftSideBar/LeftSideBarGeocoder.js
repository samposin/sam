import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { setGeolocateClick } from '../../actions/actions_tools'

function LeftSideBarGeocoder({dispatch}){
    const locateUser = () =>{
        dispatch(setGeolocateClick(true))
    }
    return (
        <div id='geocoder-menu'>
            <div style={{width:'90%'}}>
                <p className="menu-section-title">Search Location</p>
                <div id="geocoder"><Button onClick={locateUser} className="locate-btn"><img src='./img/icons/icon-location.svg'></img></Button></div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({});
  
  export default connect(mapStateToProps)(LeftSideBarGeocoder);
  