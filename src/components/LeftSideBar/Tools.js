import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Icon } from 'semantic-ui-react'
import { setCurrentTool, setToolModal } from '../../actions/actions_tools'
import ListModal from '../Modals/ListModal'
import { setShowHighlightedLayers } from '../../actions/actions_layers'
import AddModal from '../Modals/AddModal'
import MapModal from '../Modals/MapModal'
import QueryModal from '../Modals/QueryModal'

function Tools({dispatch, current_tool, show_highlighted_layers, tool_modal}){

    const handleButtonClick = (buttonName)=>{
        if(current_tool === buttonName){
            dispatch(setCurrentTool(false))
        }
        else{
            dispatch(setCurrentTool(buttonName))
        }
    }

    const showOnlyHighlightedFeaturesOnMap = () => {
        dispatch(setShowHighlightedLayers(!show_highlighted_layers))
    }
    return(
        <>
            <MapModal/>

            <ListModal/>

            <QueryModal/>

            <AddModal/>

            <div className='menu-section tools'>
                <p className='menu-section-title'>Tools</p>
                <div className='tool-cards'>
                    <div>
                        <Button onClick={() => handleButtonClick("Measure")} secondary={current_tool ==='Measure'}>
                            <img className="tool-icon" src='./img/icons/icon-measure.svg' alt="Measure" />
                        </Button>
                        <p>Measure</p>
                    </div>
                    <div>
                        <Button onClick={() => handleButtonClick("Area")} secondary={current_tool === 'Area'}>
                            <img className="tool-icon" src='./img/icons/icon-area.svg' alt="Area" />
                        </Button>
                        <p>Area</p>
                    </div>
                    <div>
                        <Button onClick={() => {handleButtonClick("Erase");}} secondary={current_tool === 'Erase'}>
                            <img className="tool-icon" src='./img/icons/icon-backspace.svg' alt="Backspace" />
                        </Button>
                        <p>Erase</p>
                    </div>
                    <div>
                        <Button onClick={() => {handleButtonClick("Clear");}}>
                            <img className="tool-icon" src='./img/icons/icon-clear.svg' alt="Clear" />
                        </Button>
                        <p>Clear</p>
                    </div>
                    <div>
                        <Button onClick={() => {handleButtonClick("North");}}>
                            <img className="tool-icon" src='./img/icons/icon-north.svg' alt="North" />
                        </Button>
                        <p>North</p>
                    </div>
                    <div>
                        <Button onClick={showOnlyHighlightedFeaturesOnMap} secondary={show_highlighted_layers}>
                            <img className="tool-icon" src='./img/icons/icon-highlight.svg' alt="Highlight" />
                        </Button>
                        <p>Highlight</p>
                    </div>
                    <div>
                        <Button onClick={()=> handleButtonClick("De-Highlight")} secondary={current_tool === 'De-Highlight'}>
                            <img className="tool-icon" src='./img/icons/de_highlight_icon.svg' alt="De-Highlight" />
                        </Button>
                        <p>Clear Highlight</p>
                    </div>
                    <div>
                        <Button onClick={()=> handleButtonClick("ScreenShot")} secondary={current_tool === 'ScreenShot'}>
                            <img className="tool-icon" src='./img/icons/camera_black.svg' alt="ScreenShot" />
                        </Button>
                        <p>ScreenShot</p>
                    </div>
                    <div>
                        <Button onClick={() => window.open("https://handmatch.land/index.html", "_blank")} secondary={current_tool === 'Match'}>
                            <img className="tool-icon" src='./img/icons/icon-match.svg' alt="Match" />
                        </Button>
                        <p>Match</p>
                    </div>
                    <div>
                        <Button onClick={()=> window.open("https://docs.google.com/forms/d/e/1FAIpQLSdTC7xMJsKriKmCeBuFzJ15ewAc3Kn8bYd3sDTNG0pODdlb5A/viewform", "_blank")} secondary={current_tool === 'Report'}>
                            <img className="tool-icon" src='./img/icons/icon-report.svg' alt="Report" />
                        </Button>
                        <p>Report</p>
                    </div>
                    <div>
                        <Button onClick={()=>dispatch(setToolModal("add"))} secondary={tool_modal === 'add'} >
                            <img className="tool-icon" src='./img/icons/icon-add.svg' alt="Add" />
                        </Button>
                        <p>Add</p>
                    </div>
                    <div>
                        <Button onClick={()=> dispatch(setToolModal("map"))} secondary={tool_modal === 'map'} >
                            <Icon style={{'margin': '0px','color': 'black', filter: tool_modal ==='map' ? 'invert(1)' : 'invert(0.5)'}} name="map"/>
                        </Button>
                        <p>Map</p>
                    </div>
                    <div>
                        <Button onClick={()=>dispatch(setToolModal("list"))} secondary={tool_modal === 'list'} >
                            <img className="tool-icon" src='./img/icons/icon-list.svg' alt="Add" />
                        </Button>
                        <p>List</p>
                    </div>
                    <div>
                        <Button onClick={()=> dispatch(setToolModal("query"))} secondary={tool_modal === 'query'} >
                            <img className="tool-icon" src='./img/icons/icon-filters.svg' alt="Add" />
                        </Button>
                        <p>Query</p>
                    </div>
                </div>
            </div>
        </>
    )
}
const mapStateToProps = (state) => ({
    current_tool: state.tools.current_tool,
    show_highlighted_layers: state.layers.show_highlighted_layers,
    tool_modal: state.tools.tool_modal
});

export default connect(mapStateToProps)(Tools);
