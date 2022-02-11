import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Accordion, Button, Card, Dimmer, List, Loader, Segment, Tab } from "semantic-ui-react";
import { badMatchQuery, deleteListingQuery, updateList } from "../../actions/actions_properties";
import { trainRate, trainType } from "../../utils/shared_constants";
import CommentSection from "./CommentSection";
import EditSingleProperty from "./EditSingleProperty";
import TrainSinglePropertyCard from "./TrainSinglePropertyCard";

function PropertyCardMoreSection({default_list, activeIndex, handleClick, propertyInfo, dispatch, active_property, active_property_comments, user_email, google_image_url}){
    const [selectedListLeft, setSelectedListLeft] = useState(false)
    const [selectedListRight, setSelectedListRight] = useState(false)

    const [leftList, setLeftList] = useState([])
    const [rightList, setRightList] = useState([])

    const changeActiveItemLeft = (e, data)=>{
        setSelectedListLeft(data.value)
    }

    const changeActiveItemRight = (e, data)=>{
        setSelectedListRight(data.value)
    }

    const moveItemToTheLeft = () => {
        if(selectedListRight){

            const leftListClone = JSON.parse(JSON.stringify(leftList))
            if(leftListClone){
                setLeftList([{key: selectedListRight, value: selectedListRight, text: selectedListRight}, ...leftListClone])
            }
            else {
                setLeftList([{key: selectedListRight, value: selectedListRight, text: selectedListRight}])
            }
            //remove from other list
            const rightListClone = JSON.parse(JSON.stringify(rightList))
            const newRightList = rightListClone.filter(list => list.value !== selectedListRight)
            setRightList(newRightList)
            setSelectedListRight(false)

            let defaultListClone = JSON.parse(JSON.stringify(default_list))
            const newList = []
            defaultListClone.forEach(list => {
                if(list.value === selectedListRight && list.data.includes(propertyInfo.ID) ){
                    //update selected data
                    const newData = list.data.filter(id => id !== propertyInfo.ID)
                    list.data = [...newData]
                }
                newList.push(list)
            });
            dispatch(updateList(newList))
        }
    }

    const moveItemToTheRight = () => {
        if(selectedListLeft){

            const rightListClone = JSON.parse(JSON.stringify(rightList))
            if(rightListClone){
                setRightList([...rightListClone, {key: selectedListLeft, value: selectedListLeft, text: selectedListLeft}])
            }
            else {
                setRightList([{key: selectedListLeft, value: selectedListLeft, text: selectedListLeft}])
            }
            //remove from other list
            const leftListClone = JSON.parse(JSON.stringify(leftList))
            const newLeftList = leftListClone.filter(list => list.value !== selectedListLeft)
            setLeftList(newLeftList)
            setSelectedListLeft(false)

            let defaultListClone = JSON.parse(JSON.stringify(default_list))
            const newList = []
            defaultListClone.forEach(list => {
                if(list.value === selectedListLeft && !list.data.includes(propertyInfo.ID) ){
                    //update selected data
                    list.data = [...list.data, propertyInfo.ID]
                }
                newList.push(list)
            });
            dispatch(updateList(newList))
        }
    }

    const deleteListing = () => {
        if(window.confirm("Please confirm that you would like to delete this listing! You will no longer see it in the results.")){
            dispatch(deleteListingQuery(propertyInfo))
        }
    }

    useEffect(() => {
        if(default_list.length > 0 && propertyInfo){
            const leftListClone = JSON.parse(JSON.stringify(leftList))
            const rightListClone = JSON.parse(JSON.stringify(rightList))

            const leftListStart = []
            const rightListStart = []
            let defaultListClone = JSON.parse(JSON.stringify(default_list))
            const newList = []
            defaultListClone = defaultListClone.filter(e => (!trainRate.some(rate => rate.value === e.value) && !trainType.some(type => type.value === e.value)))

            defaultListClone.forEach(list => {
                if(leftListClone.length > 0 || rightListClone.length > 0){
                    leftListClone.forEach(leftList => {
                        if(list.value === leftList.value){
                            if(!list.data.includes(propertyInfo.ID)){
                                leftList.data = list.data
                            }
                        }
                    });
                    rightListClone.forEach(rightList => {
                        if(list.value === rightList.value){
                            if(list.data.includes(propertyInfo.ID)){
                                rightList.data = list.data
                            }
                        }
                    });

                }
                else {
                    if(!list.data.includes(propertyInfo.ID)){
                        leftListStart.push(list)
                    }
                    else {

                        rightListStart.push(list)
                    }
                }
            })
            if(leftListClone.length > 0 || rightListClone.length > 0){
                setLeftList(leftListClone)
                setRightList(rightListClone)
            }
            else {
                setLeftList(leftListStart)
                setRightList(rightListStart)
            }
        }
    }, [default_list]);

    const badMatchClick = () => {
        if(window.confirm("Please confirm that this listing is a bad match! You will no longer see it in the results.")){
            dispatch(badMatchQuery(active_property.ID))
        }
    }

    return(
        <div className="more">
            <Tab.Pane attached={false}>
                <div>
                    <Accordion>
                        <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClick}>
                            <Button className="atd-button">Internal Notes</Button>
                        </Accordion.Title>

                        <Accordion.Content active={activeIndex === 2}>
                            <CommentSection dispatch={dispatch} active_property_comments={active_property_comments} moreSection user_email={user_email} active_property={active_property} google_image_url={google_image_url}/>

                        </Accordion.Content>


                        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
                            <Button className="atd-button">List</Button>
                        </Accordion.Title>

                        <Accordion.Content active={activeIndex === 0}>

                                    <div className="list-wrap">
                                        <Segment>
                                            <List selection divided verticalAlign='middle'>
                                                {
                                                    leftList.map((list, index) => {
                                                            return (
                                                                <List.Item key={index} value={list.value} onClick={changeActiveItemLeft} active={selectedListLeft === list.value}>
                                                                    <List.Content>
                                                                        <List.Header>
                                                                            {list.value}
                                                                            { list.data ? '' : <Loader size='mini' active /> }
                                                                        </List.Header>
                                                                        {/*
                                                                        <List.Header>{list.value}</List.Header>
                                                        <List.Header>{list.data ? '' : <Dimmer active inverted><Loader size='mini' inverted/></Dimmer>}</List.Header>
                                                                        */}
                                                                    </List.Content>
                                                                </List.Item>
                                                            )
                                                    })
                                                }

                                            </List>
                                        </Segment>

                                        <div className="button-container">
                                            <Button icon="chevron right" onClick={moveItemToTheRight}/>
                                            <Button icon="chevron left" onClick={moveItemToTheLeft}/>
                                        </div>

                                        <Segment>
                                            <List selection divided verticalAlign='middle'>
                                                {
                                                    rightList.map((list, index) =>{
                                                            return (
                                                                <List.Item key={index} value={list.value} onClick={changeActiveItemRight} active={selectedListRight === list.value}>
                                                                    <List.Content>
                                                                        <List.Header>
                                                                            {list.value}
                                                                            { list.data ? '' : <Loader size='mini' active /> }
                                                                        </List.Header>
                                                                        {/* <Loader active={true} size='mini' style={{}}/> */}

                                                                    </List.Content>
                                                                </List.Item>
                                                            )
                                                    })
                                                }
                                            </List>
                                        </Segment>
                                    </div>

                            <TrainSinglePropertyCard />
                        </Accordion.Content>

                        <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
                            <Button className="atd-button">Edit</Button>
                        </Accordion.Title>

                        <Accordion.Content active={activeIndex === 1}>
                            {active_property? <EditSingleProperty propertyInfo={propertyInfo}/>: null}
                        </Accordion.Content>
                    </Accordion>

                </div>
            </Tab.Pane>
            {/* <Button style={{width:'100%'}} onClick={badMatchClick} color="black">Bad Match</Button> */}
            <Button onClick={deleteListing} className="atd-button warn">Delete</Button>

        </div>
    )
}

const mapStateToProps = (state) => ({
    default_list: state.properties.default_list,
    active_property: state.properties.active_property,
});

export default connect(mapStateToProps)(PropertyCardMoreSection);
