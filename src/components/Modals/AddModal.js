import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Dropdown, Form, Header, Input, Modal, Icon } from "semantic-ui-react";
import { addProperty, setPropertyToAddFeature, setSubmitPropertyLoadingState } from "../../actions/actions_properties";
import { setLeftSidebarState, setRightSidebarState } from "../../actions/actions_sidebar";
import { setAddPropertyDrawModeState, setToolModal } from "../../actions/actions_tools";
import { propertyStatus } from "../../utils/shared_constants";
import * as turf from '@turf/turf'
import { allCounties } from "../../utils/components/Modals/constants";

function AddModal({tool_modal, dispatch, add_property_polygon, submit_properties_loading}){
    const formatNumber =(number)=>{
        return new Intl.NumberFormat().format(number)
    }

    const [startDate, setStartDate] = useState(new Date());
    const [selectedCounty, setSelectedCounty] = useState("Anderson")
    const [selectedStatus, setSelectedStatus] = useState(1)
    const [drawnPolyAcres, setDrawnPolyAcres] = useState(false)
    const [acres, setAcres] = useState(false)
    const [price, setPrice] = useState(false)
    const [sold, setSold] = useState(false)
    const [url, setUrl] = useState(false)
    const [submitClicked, setSubmitClicked] = useState(false)

    const acresInputOnChange = (e) => {
        const data = e.target;

        let text = data.value
        let acresInputClone = JSON.parse(JSON.stringify(acres))
        let containsDot = ''
        if(text[text.length - 1] === '.'){
            containsDot = '.';
        }
        if(text.includes(',')){
            text = text.replaceAll(',', '');
        }
        if(!isNaN(text) && text.length <= 13){
            if(text.length > 2 && text.length <= 13){
                text = parseFloat(text).toLocaleString('en')
            }
            acresInputClone = text + containsDot
            setAcres(acresInputClone)
        }
    }

    const priceInputOnChange = (e) => {
        const data = e.target.value
        let text = data
        let pricesInputClone = JSON.parse(JSON.stringify(price))
        let containsDot = ''
        if(text[text.length - 1] === '.'){
            containsDot = '.';
        }
        if(text.includes("$") && text.length > 0){
            text = text.substring(1)
        }
        if(text.includes(',')){
            text = text.replaceAll(',', '');
        }
        if(!isNaN(text) && text.length <= 13){
            if(text.length > 2 && text.length <= 13){
                text = parseFloat(text).toLocaleString('en')
            }
            else {
                pricesInputClone = text
            }

            pricesInputClone = "$" + text + containsDot
            setPrice(pricesInputClone)
        }
    }
    const priceInputOnBlur = (e) =>{
        const text = e.target.value
        if(text === "$"){
            setPrice(false)
        }
    }


    const priceInputOnFocus = (e) =>{
        if(!price){
            setPrice('$')
        }
    }

    const submitProperty = () =>{
        const formattedAcres = acres ? parseInt(acres.replaceAll(',', '')) : ''
        const formattedPrice = price? parseInt(price.replaceAll(',', '').replaceAll("$", '')) : ''
        const formattedSold = sold? parseInt(sold.replaceAll(',', '').replaceAll("$", '')) : ''
        let centroid = false
        if(add_property_polygon){
            const polygon = turf.polygon(add_property_polygon.geometry.coordinates);
            centroid = turf.centroid(polygon);
            setSubmitClicked(true)
            dispatch(setSubmitPropertyLoadingState(true))
            dispatch(addProperty(selectedCounty, selectedStatus, formattedAcres, selectedStatus === -1 || selectedStatus === 1 ? formattedPrice: null, url, add_property_polygon, centroid, selectedStatus === -2 || selectedStatus === 0 ? formattedSold : null, selectedStatus === -2 || selectedStatus === 0 ? startDate : null))
        }
    }

    const drawPolygon = () => {
        dispatch(setAddPropertyDrawModeState(true))
        dispatch(setToolModal(false))
        dispatch(setLeftSidebarState(false))
        dispatch(setRightSidebarState(false))
    }

    const deletePolygon = () => {
        dispatch(setPropertyToAddFeature(false))
    }

    useEffect(() => {
        if(add_property_polygon){
            const coords = add_property_polygon.geometry.coordinates
            var polygon = turf.polygon(coords);
            var area = turf.area(polygon);
            var finalOutcome = area * 0.00024710538146717
            setDrawnPolyAcres(finalOutcome.toFixed(2))

        }
        else {
            setDrawnPolyAcres(false)
        }
    }, [add_property_polygon]);

    useEffect(() => {
        if(submitClicked && !submit_properties_loading){
            setSubmitClicked(false)
            setStartDate(new Date())
            setSelectedCounty("Anderson")
            setSelectedStatus(1)
            setDrawnPolyAcres(false)
            setAcres(false)
            setPrice(false)
            setSold(false)
            setUrl(false)
            dispatch(setPropertyToAddFeature(false))


        }
    }, [submit_properties_loading]);

    const formatPrice = (e, original)=>{
        let convertToNumber = e.target.value
        if(convertToNumber.includes("No Data")){
            convertToNumber = e.target.value[e.target.value.length - 1]
        }
        if(convertToNumber === "$"){
            convertToNumber = false
        }
        if(convertToNumber){
            if(e.target.value.includes("$")){
                convertToNumber = convertToNumber.replaceAll('$', '')
            }

            if(e.target.value.includes(",")){
                convertToNumber = convertToNumber.replaceAll(',', '')
            }
            if(!isNaN(convertToNumber) && convertToNumber.length <= 13){
                return "$" + formatNumber(convertToNumber)
            }
            return original
        }
        else {
            return ""
        }
    }

    return(
        <Modal
            onClose={() => dispatch(setToolModal(false))}
            open={tool_modal === "add"}
        >
            <Modal.Content style={{ width : 475 }}>
                <Form>
                    <div className="fields-container">
                        <h3>Add Property</h3>

                        <Form.Field>
                            <label>County:</label>
                            <Dropdown placeholder='Select a county' search selection value={selectedCounty} onChange={(e, data) => setSelectedCounty(data.value)}  options={allCounties}  />
                        </Form.Field>

                        <Form.Field>
                            <label>Status:</label>
                            <Dropdown placeholder='Select a status' search selection value={selectedStatus} onChange={(e, data) => setSelectedStatus(data.value)} options={propertyStatus} />
                        </Form.Field>

                        <Form.Group>
                            <Form.Field>
                                <label>Acres:</label>
                                <input placeholder='Acres' value={acres? acres: ''} onChange={acresInputOnChange}/>
                                {drawnPolyAcres ? <p className="msg">Draw Polygon is <strong>{parseFloat(drawnPolyAcres).toLocaleString('en')}</strong> acres.</p>: false}
                            </Form.Field>

                            {
                                selectedStatus === 0?
                                <>
                                    <Form.Field>
                                        <label>Sold Price:</label>
                                        <input placeholder='Sold' value={sold? sold: ''} onChange={(e) => setSold(formatPrice(e, sold))}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Close Date:</label>
                                        <input type="date" selected={startDate} onChange={(date) => setStartDate(date.target.value)} />
                                    </Form.Field>
                                </>
                                :
                                selectedStatus == 1?
                                <>
                                    <Form.Field>
                                        <label>Price:</label>
                                        <input placeholder='Price' value={price? price: ''} onBlur={priceInputOnBlur} onFocus={priceInputOnFocus} onChange={priceInputOnChange} />
                                    </Form.Field>
                                </>
                                :
                                <>
                                    <Form.Field>
                                        <label>List Price:</label>
                                        <input placeholder='Price' value={price? price: ''} onBlur={priceInputOnBlur} onFocus={priceInputOnFocus} onChange={priceInputOnChange} />
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Sale Price:</label>
                                        <input placeholder='Sold' value={sold? sold: ''} onChange={(e) => setSold(formatPrice(e, sold))}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Close Date:</label>
                                        <input type="date" selected={startDate} onChange={(date) => setStartDate(date.target.value)} />
                                    </Form.Field>
                                </>
                            }
                        </ Form.Group>


                        <Form.Field>
                            <label>URL:</label>
                            <input placeholder='URL' value={url? url: ''} onChange={(e) => setUrl(e.target.value)} />
                        </Form.Field>

                        {
                            add_property_polygon?
                            <>
                                <Form.Field>
                                    <Button onClick={drawPolygon} className="atd-button gray">Edit Polygon</Button>
                                </Form.Field>
                                <Form.Field>
                                    <Button onClick={deletePolygon} color="red" className="atd-button warn">Erase Polygon</Button>
                                </Form.Field>
                            </>

                            :
                                <Form.Field>
                                    <Button onClick={drawPolygon} style={{width:'100%'}} className="atd-button light">
                                        <img className="tool-icon" src='./img/icons/icon-area.svg' alt="Area" />
                                        Draw Polygon
                                    </Button>
                                </Form.Field>
                        }
                    </div>



                </Form>
                <Header>
                    <button onClick={() => dispatch(setToolModal(false))} className="atd-button gray">
                        <Icon name="times circle outline" />
                        Cancel
                    </button>
                    <Button className="atd-button" onClick={submitProperty} disabled={submit_properties_loading} loading={submit_properties_loading}>
                        <Icon name="plus circle" />
                        Submit
                    </Button>
                </Header>

            </Modal.Content>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    tool_modal: state.tools.tool_modal,
    add_property_polygon: state.properties.add_property_polygon,
    submit_properties_loading: state.properties.submit_properties_loading
});

export default connect(mapStateToProps)(AddModal);
