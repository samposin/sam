import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Card, Dropdown } from "semantic-ui-react";
import { updateList } from "../../actions/actions_properties";
import { trainRate, trainType } from "../../utils/shared_constants";

function TrainSinglePropertyCard({active_property, dispatch, new_edit_property_poly, default_list}){
    const [selectedRating, setSelectedRating] = useState(false)
    const [selectedType, setSelectedType] = useState(false)
    const [reset, setReset] = useState(true)
    const [changesMode, setChangesMode] = useState(false);
    const [loading, setLoading ] = useState(false)
   
    useEffect(() => {
        if(default_list || reset && default_list){
            setReset(false)
            setLoading(false)
            const defaultListTypes = default_list.filter(list => trainType.some(e => e.value === list.value))
            const defaultListRatings = default_list.filter(list => trainRate.some(e => e.value === list.value))

            const selectedTypeDefault = []
            
            defaultListTypes.forEach(e => {
                if(e.data.includes(active_property.ID)){
                    selectedTypeDefault.push(e.value)
                }
            })
            const selectedRatingDefault = defaultListRatings.find(e => e.data.includes(active_property.ID))

            setSelectedRating(selectedRatingDefault? selectedRatingDefault.value : false)
            setSelectedType(selectedTypeDefault)
        }
    }, [default_list, reset]);

    useEffect(() => {
        if(default_list){
            const defaultListTypes = default_list.filter(list => trainType.some(e => e.value === list.value))
            const defaultListRatings = default_list.filter(list => trainRate.some(e => e.value === list.value))

            const selectedTypeDefault = []
            
            defaultListTypes.forEach(e => {
                if(e.data.includes(active_property.ID)){
                    selectedTypeDefault.push(e.value)
                }
            })
            let selectedRatingDefault = defaultListRatings.find(e => e.data.includes(active_property.ID))
            selectedRatingDefault =  selectedRatingDefault ? selectedRatingDefault.value : false
            if(JSON.stringify(selectedTypeDefault) === JSON.stringify(selectedType) && selectedRatingDefault.value === selectedRating){
                setChangesMode(false)
            }
            else {
                setChangesMode(true)
            }
        }
    }, [selectedType, selectedRating]);


    const handleTypeChange = (e , data) =>{
        setSelectedType(data.value)
    }
    const handleRatingChange = (e , data) =>{
        setSelectedRating(data.value)
    }

    const submitChanges = ()=>{
        //update data accordingly
        const defaultClone = JSON.parse(JSON.stringify(default_list))
        defaultClone.forEach(list =>{
            if(trainType.some(e => e.value === list.value)){
                if(selectedType.some(e => e === list.value)){
                    //add property id to list data if not already
                    if(!list.data.includes(active_property.ID)){
                        list.data.push(active_property.ID)
                    }
                }
                else {
                    //remove property id if its there
                    if(list.data.includes(active_property.ID)){
                        list.data = list.data.filter(e => e !== active_property.ID)
                    }
                }
            }

            if(trainRate.some(e => e.value === list.value)){
                if(list.value === selectedRating){
                    //make sure property id is added to data
                    if(!list.data.includes(active_property.ID)){
                        list.data.push(active_property.ID)
                    }
                }
                else {
                    //make sure property id is not in the data
                    if(list.data.includes(active_property.ID)){
                        list.data = list.data.filter(e => e !== active_property.ID)
                    }
                }
            }
        })
        dispatch(updateList(defaultClone))
        setLoading(true)
    }

    const resetTypes =()=>{
        setReset(true)
    }
    return(
        <Card className="train">
             <Card.Content>
                <label>Type</label>
                <Dropdown multiple placeholder='Status' value={selectedType} onChange={handleTypeChange} style={{width: '100%', margin:'0px'}} search /*value={parseInt(propertyStat)} onChange={(e, data)=> setPropertyStat(data.value)} */selection options={trainType} />

                <label>Rating</label>
                <Dropdown placeholder='Rating' value={selectedRating} onChange={handleRatingChange} style={{width: '100%', margin:'0px'}} search /*value={parseInt(propertyStat)} onChange={(e, data)=> setPropertyStat(data.value)} */selection options={trainRate} />
                <div style={{marginTop:'10px'}}>
                    <a onClick={resetTypes}>Reset Changes</a>
                    <Button style={{marginTop: '15px', width:'100%'}} onClick={submitChanges} disabled={!changesMode || loading} loading={loading} className="atd-button" /*onClick={submit} disabled={!dataChanged}*/>Train</Button>

                </div>
             </Card.Content>

        </Card>
    )
}

const mapStateToProps = (state) => ({
    default_list: state.properties.default_list,
    active_property: state.properties.active_property,
    new_edit_property_poly: state.tools.new_edit_property_poly,
});

export default connect(mapStateToProps)(TrainSinglePropertyCard);
