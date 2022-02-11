import React from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Menu, Sidebar } from 'semantic-ui-react'
import { setLeftSidebarState } from '../actions/actions_sidebar'
import LeftSideBarGeocoder from './LeftSideBar/LeftSideBarGeocoder'
import LeftSideBarHeader from './LeftSideBar/LeftSideBarHeader'
import Tools from './LeftSideBar/Tools'
import Visualizations from './LeftSideBar/Visualizations'
import '../styles/LeftSideBar.scss'

function LeftSideBar({ dispatch, bigQueryUser, auth2Loaded, googleUser, google_image_url,left_side_bar_open, draw, map, draw_for_big_query_mode, draw_add_property_mode, draw_edit_property_mode }){

    return(
        <>
            <div>
                <Sidebar
                    as={Menu}
                    animation='push'
                    icon='labeled'
                    vertical
                    visible={left_side_bar_open}
                    width='wide'
                    id="sidebar-left"
                >
                    <LeftSideBarHeader image={google_image_url}/>

                    <div style={{'height': 'calc(100% - 100px - 63px)', 'overflowY': 'scroll'}}>
                        <Visualizations/>
                        <Tools/>
                    </div>
                    
                    <LeftSideBarGeocoder/>

                    <Button id="button-close" className="left" onClick={() => !draw_for_big_query_mode && !draw_add_property_mode && !draw_edit_property_mode? dispatch(setLeftSidebarState(!left_side_bar_open)): null}><Icon name={left_side_bar_open? 'chevron left' : 'chevron right'} /></Button>
                </Sidebar>
            </div>
        </>
    )
}
const mapStateToProps = (state) => ({
    ...state.user,
    ...state.sidebar,
    draw_for_big_query_mode: state.tools.draw_for_big_query_mode,
    draw_add_property_mode: state.tools.draw_add_property_mode,
    draw_edit_property_mode: state.tools.draw_edit_property_mode
});

export default connect(mapStateToProps)(LeftSideBar);
