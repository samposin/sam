import { useEffect } from "react";
import { connect } from "react-redux";
import { Accordion, Button, Checkbox, Label, Segment, Icon, Loader, Dimmer } from "semantic-ui-react";
import { setMapStyle } from "../../actions/actions_layers";

function ChangeBasemap({activeIndex, handleClick, layers, dispatch, mapStyle, map_style_loading}){
    
    const handleToggle = (value) =>{
        if(mapStyle !== value){
            dispatch(setMapStyle(value))
        }
    }
    return (
        <>
        <Accordion className={`visualization-item ${activeIndex.includes(10) ? 'checked' : ''}`}>
            <Accordion.Title
                active={activeIndex.includes(10)}
                index={10}
                 onClick={()=>handleClick(10)}
                // onClick={handleClick}
                style={{display: 'flex', alignItems: 'center'}}
                >
                <label>Change Basemap  {map_style_loading && <Loader active inline size="mini"/>}</label>
                <Label.Group circular style={{display:'flex', alignItems:'center'}}>
                    {/* <Label basic as='a' style={{margin:0, marginRight:10}}>{ownershipsMainIsChecked ? ownerships.length : 0}</Label> */}
                </Label.Group>
                <Icon name="chevron down" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(10)} className="layer-toggle-container">
                <div onClick={() => handleToggle('Default')}    className={`layer-toggle ${mapStyle === 'Default'   ? 'active' : ''}`}>Default</div>
                <div onClick={() => handleToggle('Satellite')}  className={`layer-toggle ${mapStyle === 'Satellite' ? 'active' : ''}`}>Satellite</div>
                <div onClick={() => handleToggle('Streets')}    className={`layer-toggle ${mapStyle === 'Streets'   ? 'active' : ''}`}>Streets</div>
                <div onClick={() => handleToggle('Outdoors')}   className={`layer-toggle ${mapStyle === 'Outdoors'  ? 'active' : ''}`}>Outdoors</div>
                <div onClick={() => handleToggle('OldDefault')} className={`layer-toggle ${mapStyle === 'OldDefault'? 'active' : ''}`}>Old Default</div>
            </Accordion.Content>
        </Accordion>
        </>
    )
}

const mapStateToProps = (state) => ({
    layers: state.layers.layers,
    mapStyle: state.layers.mapStyle,
    map_style_loading: state.layers.map_style_loading
});
  
export default connect(mapStateToProps)(ChangeBasemap);
  
