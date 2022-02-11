import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { Button, Icon, Menu, Sidebar } from 'semantic-ui-react'
import { setRightSidebarState } from '../actions/actions_sidebar'
import PropertyCard from './RightSideBar/PropertyCard';
import SinglePropertySideBar from './RightSideBar/SinglePropertySideBar';
import '../styles/RightSideBar.scss'

function RightSideBar({dispatch, right_side_bar_open, properties_list, active_property, draw_for_big_query_mode, draw_add_property_mode}){
    useEffect(()=>{
        if(properties_list){
            dispatch(setRightSidebarState(true))
        }
    }, [properties_list])

    return(
        <>
            <Sidebar
                id="sidebar-right"
                style={{'overflowY' : 'scroll !important'}}
                as={Menu}
                animation='overlay'
                icon='labeled'
                direction="right"
                vertical
                visible={right_side_bar_open}
                width='wide'
            >
                <SinglePropertySideBar/>
                <Button id="button-close" className="right" onClick={()=> !draw_for_big_query_mode && !draw_add_property_mode? dispatch(setRightSidebarState(!right_side_bar_open)) : null }><Icon name={right_side_bar_open? 'chevron right':'chevron left'} /></Button>

                <div style={{width:'100%', height:"100%", overflowY:'scroll'}}>
                    {
                    properties_list?  properties_list.map((property, index) => (
                            <PropertyCard key={index} property={property}/>
                        )): <h3 style={{fontSize: 'larger', fontWeight: 700, color: 'darkgray', textAlign: 'center', marginTop: 10}}>Run a valid query to view results.</h3>
                    }

                </div>
            </Sidebar>
        </>
    )
}
const mapStateToProps = (state) => ({
    ...state.user,
    ...state.sidebar,
    ...state.properties,
    draw_for_big_query_mode: state.tools.draw_for_big_query_mode,
    draw_add_property_mode: state.tools.draw_add_property_mode,
});

export default connect(mapStateToProps)(RightSideBar);
