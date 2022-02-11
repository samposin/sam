import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Dropdown, Form, Header, Icon, Modal, Accordion } from "semantic-ui-react";
import { setLayers } from "../../actions/actions_layers";
import { getProperties, setQueryPolygonFeature } from "../../actions/actions_properties";
import { setLeftSidebarState, setRightSidebarState } from "../../actions/actions_sidebar";
import { setBigQueryDrawState, setToolModal } from "../../actions/actions_tools";
import { allCounties } from "../../utils/components/Modals/constants";

function QueryModal({dispatch, tool_modal, query_polygon, properties_list, layers, default_list}){
    const [ county, setCounty ] = useState([])
    const [loading, setLoading] = useState(false)
    const [ activePanel, setActivePanel ] = useState('basic')
    const [ inputs, setInputs ] = useState({
        inputStatus: "Listings",
        priceAcresMin: false,
        priceAcresMax: false,
        acresMin: false,
        acresMax: false,
        priceMin: false,
        priceMax: false,
        inputRating: false,
        inputCreekWF: false,
        inputLakeWF: false,
        inputRiverWF: false,
        inputNoneWF: false,
        inputPPAUsableMin: false,
        inpytPPAUsableMAx: false,
        inputSources: false,
        maxDistance: false,
        inputDistanceCity: false,
        inputDays: false,
        inputNew: false,
        inputList: false,
    })

    const sources = [{key:'Realtor', value:'R', text:'Realtor'}, {key:'MLS', value:'MLS', text:'MLS'}, {key:'LoT', value:'PCC', text:'LoT'}, {key:'Crexi', value:'Crexi', text:'Crexi'}, {key:'Custom', value:'custom', text: 'Custom'}, {key:'RML', value:'RML', text: 'RML'}];
    const cityDistances = [{key:'Austin', value:'Austin', text:'Austin'}, {key:'San Antonio', value:'San Antonio', text:'San Antonio'}, {key:'Houston', value:'Houston', text:'Houston'}, {key:'Dallas', value:'Dallas', text:'Dallas'}, {key:'Fort Worth', value:'Fort Worth', text: 'Fort Worth'}];

    const sendQuery = () =>{
        setLoading(true)
        const reformattedObject = reformatInputs()
        // dispatch(setToolModal(false))
        dispatch(getProperties(
            county,
            reformattedObject.inputStatus,
            reformattedObject.acresMin,
            reformattedObject.acresMax,
            reformattedObject.priceMin,
            reformattedObject.priceMax,
            reformattedObject.priceAcresMin,
            reformattedObject.priceAcresMax,
            reformattedObject.inputRating,
            reformattedObject.inputCreekWF,
            reformattedObject.inputLakeWF,
            reformattedObject.inputRiverWF,
            reformattedObject.inputNoneWF,
            reformattedObject.inputPPAUsableMin,
            reformattedObject.inpytPPAUsableMAx,
            reformattedObject.inputSources,
            reformattedObject.maxDistance,
            reformattedObject.inputDistanceCity,
            reformattedObject.inputDays,
            reformattedObject.inputNew,
            query_polygon,
            setLoading
        ))
    }
    useEffect(() => {
        if(properties_list && loading){
            setLoading(false)
            dispatch(setToolModal(false))
        }
    }, [properties_list]);

    const reformatInputs = () => {
        const inputsClone = JSON.parse(JSON.stringify(inputs))
        const reformattedObject = {}
        for (const key in inputsClone) {
            let value = inputsClone[key]
            if((value && value.includes("$")) || (value && value.includes(","))){
                value = value.replaceAll(',', '');
                value = value.replaceAll('$', '');
                reformattedObject[key] = value
            }
            else {
                reformattedObject[key] = value
            }
        }
        return reformattedObject
    }

    const handleStatusChange = (e, data) =>{
        const inputsClone = JSON.parse(JSON.stringify(inputs))
        inputsClone.inputStatus = data.value
        setInputs(inputsClone)
    }

    const handleCountyChange = (e, {value})=>{
        setCounty(value)
    }
    const drawBoundary = (e)=>{
        e.preventDefault();
        dispatch(setToolModal(false))
        dispatch(setLeftSidebarState(false))
        dispatch(setRightSidebarState(false))
        dispatch(setBigQueryDrawState(true))
    }

    const handleInputChange = (e)=>{
        const id = e.target.id
        const inputsClone = JSON.parse(JSON.stringify(inputs))
        let value =  e.target.value
        let containsDot = '';
        if(value[value.length - 1] === '.'){
            containsDot = '.';
        }
        if(value.includes("$") && value.length > 0){
            value = value.substring(1)
        }
        if(value.includes(',')){
            value = value.replaceAll(',', '');
        }

        // value = parseInt(value)
        if(!isNaN(value) && value.length <= 13){
            if(value.length > 2 && value.length <= 13){
                value = parseFloat(value).toLocaleString('en')
            }
            if(id !== "acresMin" && id !== "acresMax"){
                inputsClone[id] = "$" + value + containsDot
            }
            else {

                inputsClone[id] = value+ containsDot
            }
            setInputs(inputsClone)
        }
    }

    const handleBlur = (e)=>{
        const id = e.target.id
        if(inputs[id] && inputs[id].includes("$") && inputs[id].length < 2){
            const inputsClone = JSON.parse(JSON.stringify(inputs))
            inputsClone[id] = false
            setInputs(inputsClone)
        }
    }

    const handleFocus = (e)=>{
        const id = e.target.id
        if(!inputs[id]){
            const inputsClone = JSON.parse(JSON.stringify(inputs))
            if(id !== "acresMin" && id !== "acresMax"){
                inputsClone[id] = "$"
            }
            setInputs(inputsClone)
        }
    }

    const maxDistanceChange = (e) =>{
        let value = e.target.value
        if(value.includes(',')){
            value = value.replaceAll(',', '');
        }
        let containsDot = ''
        if(value[value.length - 1] === '.'){
            containsDot = '.';
        }
        if(!isNaN(value) && value.length <= 13){

            if(value.length > 2 && value.length <= 13){
                value = parseFloat(value).toLocaleString('en')
            }
            const inputsClone = JSON.parse(JSON.stringify(inputs))
            inputsClone.maxDistance = value + containsDot
            setInputs(inputsClone)
        }
    }

    const minDaysOnMarketChange = (e) =>{
        let value = e.target.value
        if(value.includes(',')){
            value = value.replaceAll(',', '');
        }
        let containsDot = ''
        if(value[value.length - 1] === '.'){
            containsDot = '.';
        }
        if(!isNaN(value) && value.length <= 13){

            if(value.length > 2 && value.length <= 13){
                value = parseFloat(value).toLocaleString('en')
            }
            const inputsClone = JSON.parse(JSON.stringify(inputs))
            inputsClone.inputDays = value+ containsDot
            setInputs(inputsClone)
        }
    }

    const deleteBoundary = ()=>{
        dispatch(setQueryPolygonFeature(false))
    }

    useEffect(() => {
        if(properties_list){
            const layerClone = JSON.parse(JSON.stringify(layers))
            dispatch(setLayers([...layerClone, "Results"]))
        }
    }, [properties_list]);

    const changeCity = (e, data)=>{
        const inputsClone = JSON.parse(JSON.stringify(inputs))
        if(data.value.length === 0){
            inputsClone.inputDistanceCity = false
        }
        else{
            inputsClone.inputDistanceCity = data.value
        }
        setInputs(inputsClone)
    }

    const changeSource = (e, data)=>{
        const inputsClone = JSON.parse(JSON.stringify(inputs))
        if(data.value.length === 0){
            inputsClone.inputSources = false
        }
        else{
            inputsClone.inputSources = data.value
        }
        setInputs(inputsClone)
    }

    const changeNewMarket = (e, data) =>{
        const inputsClone = JSON.parse(JSON.stringify(inputs))
        inputsClone.inputNew = data.value
        setInputs(inputsClone)
    }
    return (
        <Modal
            onClose={() => dispatch(setToolModal(false))}
            open={tool_modal === "query"}
        >
            <Modal.Content image style={{ width : 475 }}>
                <Form >
                    <div className="fields-container">
                        <Accordion>
                            <Accordion.Title active={activePanel === 'basic'} onClick={() => setActivePanel(activePanel === 'basic' ? false : 'basic')}>
                                Basic Info
                                <Icon name={activePanel === 'basic' ? `window minimize outline` : `plus`} />
                            </Accordion.Title>
                              <Accordion.Content active={activePanel === 'basic'}>

                                <Form.Field>
                                    <label>Status</label>
                                    <Dropdown
                                    placeholder='Select'
                                    onChange={handleStatusChange}
                                    value={inputs.inputStatus}
                                    search
                                    selection
                                    options={[{key: 'Listings', value: "Listings", text: "Listings"},{key: 'Pendings', value: "Pendings", text: "Pendings"}, {key: 'Sales', value: "Sales", text: "Sales"}]}
                                    defaultValue="Listings" />
                                </Form.Field>

                                <Form.Field>
                                    <label>County</label>
                                    <Dropdown placeholder='County' onChange={handleCountyChange} value={county? county : []} multiple search selection options={allCounties} />
                                </Form.Field>

                                <label>Price / Acre:</label>

                                <Form.Group>
                                    <Form.Field>
                                        <input placeholder='min' id="priceAcresMin"  onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}  value={inputs.priceAcresMin? inputs.priceAcresMin: ''} />
                                    </Form.Field>
                                    <Icon name="window minimize outline"/>
                                    <Form.Field>
                                        <input placeholder='max' id="priceAcresMax"  onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}  value={inputs.priceAcresMax? inputs.priceAcresMax: ''}/>
                                    </Form.Field>
                                </Form.Group>

                                <label>Acres:</label>

                                <Form.Group>
                                    <Form.Field>
                                        <input placeholder='min'  id="acresMin" onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}  value={inputs.acresMin? inputs.acresMin: ''} />
                                    </Form.Field>
                                    <Icon name="window minimize outline"/>
                                    <Form.Field>
                                        <input placeholder='max' id="acresMax" onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}  value={inputs.acresMax? inputs.acresMax: ''}/>
                                    </Form.Field>
                                </Form.Group>

                                <label>Price</label>

                                <Form.Group>
                                    <Form.Field>
                                        <input placeholder='min' id="priceMin"  onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}  value={inputs.priceMin? inputs.priceMin: ''}/>
                                    </Form.Field>
                                    <Icon name="window minimize outline"/>
                                    <Form.Field>
                                        <input placeholder='max' id="priceMax" onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}  value={inputs.priceMax? inputs.priceMax: ''}/>
                                    </Form.Field>
                                </Form.Group>
                                {
                                    query_polygon?
                                    <>
                                        <Button onClick={drawBoundary} type='button' style={{width:'100%'}} className="atd-button gray">Edit Search Boundary</Button>
                                        <Button onClick={deleteBoundary} type='button' color="red" style={{width:'100%', marginTop:10}} className="atd-button warn">Delete Search Boundary</Button>
                                    </>
                                    :
                                    <Button onClick={drawBoundary} type='button' className="atd-button light">
                                        <img className="tool-icon" src='./img/icons/icon-area.svg' alt="Area" />
                                        Draw Search Boundary
                                    </Button>
                                }
                            </Accordion.Content>
                        </Accordion>

                        <Accordion>
                            <Accordion.Title active={activePanel === 'advanced'} onClick={() => setActivePanel(activePanel === 'advanced' ? false : 'advanced')} style={{ marginTop : 14 }}>
                                Advanced
                                <Icon name={activePanel === 'advanced' ? `window minimize outline` : `plus`} />
                            </Accordion.Title>

                            <Accordion.Content active={activePanel === 'advanced'}>

                            <Form.Field>
                                <label>Source:</label>
                                <Dropdown
                                    multiple
                                    placeholder='All Sources'
                                    onChange={changeSource}
                                    value={inputs.inputSources? inputs.inputSources : sources.map(el => el.value)}
                                    fluid
                                    search
                                    selection
                                    options={sources}
                                />
                            </Form.Field>

                                <Form.Field>
                                    <label>Maximum Distance of:</label>
                                    <input id="maxDistance" onChange={maxDistanceChange} value={inputs.maxDistance? inputs.maxDistance: ''}/>

                                </Form.Field>

                                <Form.Field>
                                    <label>Miles From:</label>
                                    <Dropdown
                                        multiple
                                        placeholder='Select City'
                                        onChange={changeCity}
                                        value={inputs.inputDistanceCity? inputs.inputDistanceCity : []}
                                        fluid
                                        search
                                        selection
                                        options={cityDistances}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Minimum Days On Market:</label>
                                    <input  id="maxDistance" onChange={minDaysOnMarketChange} value={inputs.inputDays? inputs.inputDays: ''} />
                                </Form.Field>
                                <Form.Field>
                                    <label>New on Market in Last:</label>
                                    <Dropdown
                                        placeholder='Select'
                                        onChange={changeNewMarket}
                                        value={inputs.inputNew}
                                        fluid
                                        search
                                        selection
                                        options={[{key: 'None', value: false, text: "None"},{key: 'Day', value: "Day", text: "Day"}, {key: 'Week', value: "Week", text: "Week"}]}
                                    />
                                </Form.Field>
                            </Accordion.Content>
                        </Accordion>
                    </div>

                    <Header>
                        <button onClick={() => dispatch(setToolModal(false))} className="atd-button gray">
                            <Icon name="times circle outline" />
                            Cancel
                        </button>
                        <Button onClick={sendQuery} className="atd-button" type='submit' loading={loading} disabled={loading}>
                            <Icon name="search" />
                            Search
                        </Button>
                    </Header>
                </Form>


        </Modal.Content>
    </Modal>
    )
}

const mapStateToProps = (state) => ({
    tool_modal: state.tools.tool_modal,
    query_polygon: state.properties.query_polygon,
    properties_list: state.properties.properties_list,
    layers: state.layers.layers,
    default_list: state.properties.default_list
});

export default connect(mapStateToProps)(QueryModal);
