import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Dropdown, Form, Header, Input, Modal } from "semantic-ui-react";
import { addNewMap, deleteMapQuery, getDefaultMaps, loadQueryMap, overwriteMapQuery, saveMapSettings } from "../../actions/actions_properties";
import { setToolModal } from "../../actions/actions_tools";
import { additionalLayers, basemapsToShare } from "../../utils/shared_constants";

function MapModal({dispatch, tool_modal, default_maps, layers, highlighted_features_memory, mapStyle, properties_list}){
    const [ activeTab, setActiveTab ] = useState('new');
    const [selectedMap, setSelectedMap ] = useState(false)
    const [newMapName, setNewMapName ] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingMap, setLoadingMap] = useState(false)
    const [loadingMapDelete, setLoadingMapDelete] = useState(false)
    const [loadingOverwrite, setLoadingOverwrite] = useState(false)
    const [basemapsToShareState, setBasemapsToShareState] = useState(['Default']);
    const [layersToShareState, setLayersToShareState] = useState([]);
    const [loadingSaveSettings, setLoadingSaveSettings] = useState(false);

    useEffect(()=>{
        dispatch(getDefaultMaps())
    }, [])

    useEffect(() => {
        if(selectedMap) {
            const mapDetails = default_maps.find(e => e.value === selectedMap)
            if(mapDetails && mapDetails.detail){
                setBasemapsToShareState(mapDetails.detail.baseMaps)
                setLayersToShareState(mapDetails.detail.otherLayers)

            }
            else {
                setBasemapsToShareState(['Default'])
                setLayersToShareState([])
            }
        }
    }, [selectedMap]);

    const loadMap = () => {
        if(selectedMap){
            setLoadingMap(true)
            console.log(highlighted_features_memory)
            dispatch(loadQueryMap(selectedMap, setLoadingMap))
        }
    }
    const createNewMap = () => {
        if(!newMapName){
            alert('Please enter a name for the new map.');
        }
        else if(default_maps.some(e => e.text === newMapName)){
            alert('Please enter a name that does not already exist.');
        }
        else {
            setLoadingSave(true)
            dispatch(addNewMap(newMapName, highlighted_features_memory, default_maps))
        }
    }
    const deleteMap = () =>{
        if (window.confirm("Press OK to delete the map named: " + selectedMap)){
            setLoadingMapDelete(true)
            dispatch(deleteMapQuery(selectedMap, default_maps))
            setSelectedMap(false)
        }
    }
    const getLink = () => {
        if(selectedMap){
            const formattedName = selectedMap.replaceAll(' ', '_');
            let url= `/share/map?name=${formattedName}`
            window.open(url, '_blank').focus();
        }
    }

    const overwriteMap = () =>{
        if(selectedMap){
            setLoadingOverwrite(true)
            dispatch(overwriteMapQuery(selectedMap,highlighted_features_memory, setLoadingOverwrite))
        }
    }

    useEffect(() => {
        if(default_maps && loadingSave){
            setLoadingSave(false)
            setSelectedMap(newMapName)
            setNewMapName(false)
        }
        else if(default_maps && loadingMapDelete){
            setLoadingMapDelete(false)
        }
    }, [default_maps]);

    useEffect(() => {
        if(properties_list && loadingMap){
            dispatch(setToolModal(false))
            setLoadingMap(false)

        }
    }, [properties_list]);

    const saveSettings = () =>{
      if(selectedMap) {
        dispatch(saveMapSettings(selectedMap, basemapsToShareState, layersToShareState, setLoadingSaveSettings))
        setLoadingSaveSettings(true)
      } else {
        window.alert("Please create or load a map before saving.");
      }
    }



    return(
        <Modal
            onClose={() => dispatch(setToolModal(false))}
            open={tool_modal === "map"}
            className="map-list-modal map"
            // onOpen={()=>dispatch(getDefaultMaps())}
        >
            <button type="button" className="popup-icon" onClick={() => dispatch(setToolModal(false))}>
                <img src="../img/icons/red/x-red.svg" />
            </button>

            <h3>Map</h3>
            <Modal.Content image>
                <Modal.Description style={{ display : 'flex' }}>
                    <Form className="map-form">
                        <div className="toggles">
                            <div className={`toggle ${activeTab === 'new'   ? 'active' : ''}`} onClick={() => setActiveTab('new')}>New Map</div>
                            <div className={`toggle ${activeTab === 'share' ? 'active' : ''}`} onClick={() => setActiveTab('share')}>Share Settings</div>
                            <div className={`toggle ${activeTab === 'load'  ? 'active' : ''}`} onClick={() => setActiveTab('load')}>Load Map</div>
                        </div>

                        { activeTab === 'new' ?
                            <div>
                                <Form.Field>
                                    <h6>Enter New Map Name:</h6>
                                    <Input placeholder='Enter Name' onChange={(e, data) => setNewMapName(data.value)} value={newMapName? newMapName : ''} />
                                </Form.Field>
                                <Form.Field>
                                    <Button onClick={createNewMap} loading={loadingSave} disabled={loadingSave} className="atd-button">Save New Map As...</Button>
                                </Form.Field>
                            </div>
                        : false }

                        { activeTab === 'share' ?
                            <div>
                                <Form.Field>
                                    <h6>Select Additional Layers to Share:</h6>
                                    <Dropdown value={layersToShareState} onChange={(e, data) => setLayersToShareState(data.value)} placeholder='Select layers' search multiple selection options={additionalLayers} />
                                </Form.Field>
                                <Form.Field>
                                    <h6>Select Basemaps to Share:</h6>
                                    <Dropdown value={basemapsToShareState} onChange={(e, data) => setBasemapsToShareState(data.value)} placeholder='Select Basemaps' search multiple selection options={basemapsToShare} />
                                </Form.Field>
                                <Form.Field>
                                    <Button onClick={saveSettings} loading={loadingSaveSettings} disabled={loadingSaveSettings} className="atd-button">Save Settings</Button>
                                </Form.Field>
                            </div>
                        : false }

                        { activeTab === 'load' ?
                            <div>
                                <Form.Field>
                                {/* onOpen={()=>dispatch(getDefaultMaps())}  */}
                                    <h6>Map:</h6>
                                    <Dropdown placeholder='Select a Map' value={selectedMap} onChange={(e, data) => setSelectedMap(data.value)} options={default_maps ? default_maps : []} search selection />
                                </Form.Field>

                                <div className="button-container">
                                    <Form.Field>
                                        <Button onClick={loadMap} disabled={loadingMap || !selectedMap} loading={loadingMap} className="atd-button">Load Map</Button>
                                    </Form.Field>

                                    <Form.Field>
                                        <Button onClick={overwriteMap} loading={loadingOverwrite} disabled={loadingOverwrite || !selectedMap} className="atd-button">Overwrite Map</Button>
                                    </Form.Field>

                                    <Form.Field>
                                        <Button onClick={getLink} disabled={!selectedMap} className="atd-button">Get Link</Button>
                                    </Form.Field>

                                    <Form.Field>
                                        <Button onClick={deleteMap} loading={loadingMapDelete} disabled={loadingMapDelete || !selectedMap} className="atd-button warn">Delete Map</Button>
                                    </Form.Field>
                                </div>
                            </div>
                        : false }
                    </Form>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    tool_modal: state.tools.tool_modal,
    default_maps: state.properties.default_maps,
    highlighted_features_memory: state.layers.highlighted_features_memory,
    layers: state.layers.layers,
    properties_list: state.properties.properties_list
});

export default connect(mapStateToProps)(MapModal);
