import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Dropdown, Form, Header, Input, Modal } from "semantic-ui-react";
import { getDefaultList, loadInList, updateList } from "../../actions/actions_properties";
import { setToolModal } from "../../actions/actions_tools";
import { trainRate, trainType } from "../../utils/shared_constants";

function ListModal({dispatch, tool_modal, default_list, properties_list}){
    const [selectedList, setSelectedList ] = useState(false)
    const [newListName, setNewListName ] = useState(false)
    const [loadingList, setLoadingList ] = useState(false)
    const [loadingCreateNewList, setLoadingCreateNewList ] = useState(false)
    const [loadingDelete, setLoadingDelete ] = useState(false)

    useEffect(()=>{
        dispatch(getDefaultList())
    },[])

    const loadList = ()=>{
        if(selectedList){
            const listInfo = default_list.find(list => list.value === selectedList);
            if (listInfo.data.length == 0){
                window.alert('This list is empty.');
                setLoadingList(false)

            }
            else {
                setLoadingList(true)
                dispatch(loadInList(listInfo, setLoadingList))
            }
        }
        else {
            window.alert("please select a list.")
            setLoadingList(false)

        }
    }
    useEffect(() => {
        if(properties_list && loadingList){
            setLoadingList(false)
            dispatch(setToolModal(false))
        }
    }, [properties_list]);

    useEffect(() => {
        if(default_list && loadingCreateNewList){
            setLoadingCreateNewList(false)
            setSelectedList(newListName)
            setNewListName(false)
        }
        else if(default_list && loadingDelete){
            setLoadingDelete(false)
        }
    }, [default_list]);


    const deleteList = ()=>{
        if (window.confirm("Press OK to delete the following list: " + selectedList)){
            // let updateFunction = function(){
            //     let listName = $('#listsSelector :selected').text();
                if (selectedList === 'Favorite'){
                    alert('This list may not be deleted.');

                }
                else{

                    const defaultListClone = JSON.parse(JSON.stringify(default_list))
                    if(defaultListClone){
                        const newList = []
                        defaultListClone.forEach(list => {
                            if(list.value !== selectedList){
                                newList.push(list)
                            }
                        });
                        setLoadingDelete(true)
                        dispatch(updateList(newList))
                    }
                    else{
                        setLoadingDelete(false)

                        alert('Try again later.')
                    }
                }
        }
    }
    const createNewList = () =>{
        setLoadingCreateNewList(true)
        if(newListName){
            const defaultListClone = JSON.parse(JSON.stringify(default_list))
            if(defaultListClone){
                let listExists = false;
                defaultListClone.forEach(list => {
                    if(list.value === newListName){
                        listExists = true;
                    }
                })
                if(!listExists){
                    defaultListClone.push({value: newListName, key: newListName, text: newListName, data: []})
                    dispatch(updateList(defaultListClone))
                }
                else {
                    alert('List already exists.')
                    setLoadingCreateNewList(false)

                }
            }
            else{
                setLoadingCreateNewList(false)
                alert('Try again later. theres seems to be no lists.')
            }
        }
    }

    return (
        <Modal  
            onClose={() => dispatch(setToolModal(false))}
            open={tool_modal === "list"}
            onOpen={()=>dispatch(getDefaultList())} 
            className="map-list-modal"
        >
            <button type="button" className="popup-icon" onClick={() => dispatch(setToolModal(false))}>
                <img src="../img/icons/red/x-red.svg" />
            </button>
            <h3>List</h3>
            <Modal.Content image>
                <Modal.Description>
                    <Form className="list-form">
                        <div className="left-panel">
                            <Header textAlign="center">Load List</Header>

                            <Form.Field>
                                <Dropdown placeholder='Select a List' onOpen={()=>dispatch(getDefaultList())} defaultValue={selectedList} onChange={(e, data) => setSelectedList(data.value)} options={default_list ? default_list.filter(e => (!trainRate.some(rate => rate.value === e.value) && !trainType.some(type => type.value === e.value))) : []} search selection />
                            </Form.Field>

                            <Form.Field>
                                <Button onClick={loadList} loading={loadingList} disabled={loadingList} className="atd-button"> Load List</Button>
                            </Form.Field>

                            <Form.Field>
                                <Button onClick={deleteList} loading={loadingDelete} disabled={loadingDelete} className="atd-button warn">Delete List</Button>
                            </Form.Field>

                        </div>

                        <div className="right-panel">
                            <Header textAlign="center">Create List</Header>
                            
                            <Form.Field>
                                <Input placeholder='New List Name' value={newListName? newListName :''} onChange={(e)=> setNewListName(e.target.value)}/>
                            </Form.Field>
                            <Form.Field>
                                <Button onClick={createNewList} loading={loadingCreateNewList} disabled={loadingCreateNewList} className="atd-button">Create New List</Button>
                            </Form.Field>

                        </div>


                    </Form>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}


const mapStateToProps = (state) => ({
    tool_modal: state.tools.tool_modal,
    default_list: state.properties.default_list,
    properties_list: state.properties.properties_list,
});

export default connect(mapStateToProps)(ListModal);
