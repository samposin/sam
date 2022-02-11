import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Card, Divider, Dropdown, Table } from "semantic-ui-react";
import { updateActiveProperty } from "../../actions/actions_properties";
import { setLeftSidebarState } from "../../actions/actions_sidebar";
import { setCurrentSelectedValue, setDeleteEditPropertyPoly, setEditPropertyPolyMode, setNewEditPropertyPoly, setResetEditPropertyPoly } from "../../actions/actions_tools";
import { propertyStatus } from "../../utils/shared_constants";

function EditSingleProperty({active_property, dispatch, new_edit_property_poly}){
    const formatNumber =(number)=>{
        return new Intl.NumberFormat().format(number)
    }
    const [listingPrice, setListingPrice] = useState(false);
    const [soldPrice, setSoldPrice] = useState(false);
    const [soldDate, setSoldDate] = useState(false);
    const [acres, setAcres] = useState(false);
    const [propertyStat, setPropertyStat] = useState(false);
    const [dataChanged, setDataChanged] = useState(false);
    const [editPolygon, setEditPolygon] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        //default values
        const listingPriceDefault = `${active_property.price? ("$" + formatNumber(active_property.price)): 'No Data'}`
        const soldPriceDefault = `${active_property.sold? ('$' + formatNumber(active_property.sold)): "No Data"}`
        const soldDateDefault = `${active_property.date_sold? active_property.date_sold.substring(0, 10): "No Data"}`
        const acresDefault = `${active_property.acres ? (formatNumber(active_property.acres)) : 'No Data'}`
        const propertyStatDefault = active_property.status ? active_property.status : '-19'

        if(listingPrice === listingPriceDefault && !new_edit_property_poly && soldPrice === soldPriceDefault &&  soldDate === soldDateDefault && acres === acresDefault && propertyStat.toString() === propertyStatDefault){
            setDataChanged(false)
        }
        else {
            setDataChanged(true)
        }

    }, [listingPrice, soldPrice, soldDate, acres, propertyStat, new_edit_property_poly]);

    useEffect(() => {
       resetChanges()
    }, [active_property]);

    const onEditPolygon = (currentlyEditing) =>{
    //   console.log('edit press', currentlyEditing)
        if(currentlyEditing){
            setEditPolygon(false)
            dispatch(setLeftSidebarState(true))
            dispatch(setEditPropertyPolyMode(false))
            dispatch(setCurrentSelectedValue(false))


        }
        else {
            setEditPolygon(true)
            dispatch(setLeftSidebarState(false))
            // console.log('set property mode true')
            dispatch(setEditPropertyPolyMode(true))
            // dispatch(setTp)
        }
    }

    const deletePolygon = () =>{
        dispatch(setDeleteEditPropertyPoly(true))
    }
    const resetPolygon = () =>{
        dispatch(setResetEditPropertyPoly(true))
    }
    const formatPrice = (e, original)=>{
        let convertToNumber = e.target.value
        if(convertToNumber.includes("No Data")){
            convertToNumber = e.target.value[e.target.value.length - 1]
        }
        let containsDot = ''
        if(convertToNumber[convertToNumber.length - 1] === '.'){
            containsDot = '.';
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
                return "$" + formatNumber(convertToNumber) + containsDot
            }
            return original
        }
        else {
            return "No Data"
        }
    }

    const formatAcres = (e) =>{
        let convertToNumber = e.target.value
        if(convertToNumber.includes("No Data")){
            convertToNumber = e.target.value[e.target.value.length - 1]
        }
        let containsDot = ''
        if(convertToNumber[convertToNumber.length - 1] === '.'){
            containsDot = '.';
        }
        if(convertToNumber){
            if(e.target.value.includes(",")){
                convertToNumber = convertToNumber.replaceAll(',', '')
            }
            if(!isNaN(convertToNumber) && convertToNumber.length <= 13){
                return  formatNumber(convertToNumber ) + containsDot
            }
            return acres
        }
        else {
            return "No Data"
        }
    }

    const resetChanges = () =>{
         //default values
         const listingPriceDefault = `${active_property.price? ("$" + formatNumber(active_property.price)): 'No Data'}`
         const soldPriceDefault = `${active_property.sold? ('$' + formatNumber(active_property.sold)): "No Data"}`
         const soldDateDefault = `${active_property.date_sold? active_property.date_sold.substring(0, 10): "No Data"}`
         const acresDefault = `${active_property.acres ? (formatNumber(active_property.acres)) : 'No Data'}`
         const propertyStatDefault = active_property.status? active_property.status: '-19'
         setListingPrice(listingPriceDefault)
         setSoldPrice(soldPriceDefault)
         setSoldDate(soldDateDefault)
         setAcres(acresDefault)
         setPropertyStat(propertyStatDefault)
         dispatch(setNewEditPropertyPoly(false))
    }

    const submit = () =>{
        if (window.confirm("Please confirm that you would like to edit this listing")){
            setEditPolygon(false)
            dispatch(setLeftSidebarState(true))
            dispatch(setEditPropertyPolyMode(false))
            dispatch(setCurrentSelectedValue(false))
            setLoadingSubmit(true)
            dispatch(updateActiveProperty(listingPrice, soldPrice, soldDate, acres, new_edit_property_poly, propertyStat, active_property,setLoadingSubmit))
        }
        else {
        }
    }
    return(
         <div className="edit">

            <Table singleLine selectable>
                <Table.Body>
                <Table.Row>
                    <Table.Cell>Listing Price</Table.Cell>
                    <Table.Cell>
                        <input value={listingPrice} onChange={e => setListingPrice(formatPrice(e, listingPrice))} style={{width:"130px", border:'none', padding:'5px', fontWeight: 600}} placeholder='Price' />
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Sold Price</Table.Cell>
                    <Table.Cell>
                        <input value={soldPrice} onChange={e => setSoldPrice(formatPrice(e, soldPrice))} style={{width:"130px", border:'none', padding:'5px', fontWeight: 600}} placeholder='Sold Price' />
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Sold Date</Table.Cell>
                    <Table.Cell>
                        <input type='date' value={soldDate} onChange={e => setSoldDate(e.target.value? e.target.value :"No Data")} style={{width:"130px", border:'none', padding:'5px', fontWeight: 600}} placeholder='Sold Date' />
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Acres</Table.Cell>
                    <Table.Cell>
                        <input value={acres} onChange={e => setAcres(formatAcres(e))} style={{width:"130px", border:'none', padding:'5px', fontWeight: 600}} placeholder='Acres' />
                    </Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>

            <Dropdown placeholder='Status' style={{width: '100%', margin:'0px'}} search value={parseInt(propertyStat)} onChange={(e, data)=> setPropertyStat(data.value)} selection options={propertyStatus} />
            <Button style={{marginTop: '15px'}}  className="atd-button light" onClick={() => onEditPolygon(editPolygon)} active={editPolygon}>{editPolygon? "Exit Edit Polygon" : 'Edit Polygon'}</Button>

            {editPolygon ? <Button style={{marginTop: '15px'}} className="atd-button warn" onClick={resetPolygon}>Reset Polygon</Button>:null}
            {editPolygon ? <Button style={{marginTop: '15px'}} className="atd-button warn" onClick={deletePolygon} color="black">Delete Polygon</Button> : null}

            <Button className="atd-button" style={{marginTop: 15}} loading={loadingSubmit} onClick={submit} disabled={!dataChanged || loadingSubmit}>Submit Edited Data</Button>
            {
                dataChanged ? <a style={{ display : 'inline-block', marginTop : 15, cursor : 'pointer' }} onClick={resetChanges}>Reset Changes</a> :null
            }

            <Divider/>

        </div>
    )
}

const mapStateToProps = (state) => ({
    default_list: state.properties.default_list,
    active_property: state.properties.active_property,
    new_edit_property_poly: state.tools.new_edit_property_poly
});

export default connect(mapStateToProps)(EditSingleProperty);
