import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Card, Divider, Image, Menu, Sidebar, Tab, Icon, Segment, List, Comment } from "semantic-ui-react";
import { getPropertyComments, setSinglePropertyState } from "../../actions/actions_properties";
import PropertyCardMoreSection from "./PropertyCardMoreSection";
import CommentSection from "./CommentSection";
import PropertyDetailTable from "./PropertyDetailTable";

function SinglePropertySideBar({active_property, right_side_bar_open, dispatch, user_email, active_property_comments, google_image_url}){
    const [ activeIndex, setActiveIndex ] = useState(true);
    const [ activePane, setActivePane ] = useState(0);
    const [ activePropertyLocal, setActivePropertyLocal ] = useState(false)
    useEffect(() => {
        //get comments for this property
        dispatch(getPropertyComments(active_property.ID))
    }, [active_property]);

    useEffect(() => {
        if(active_property){
            setActivePropertyLocal(active_property)
        }
        else {
            setActivePropertyLocal(false)
        }
        setActivePane(0)
        setActiveIndex(true)
    }, [active_property]);

    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index

        setActiveIndex(newIndex)
      }

    const numberFormat = (n, price) => {
        var parts=n.toString().split(".");
        if(price) {return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const panes = [
        {
          menuItem: 'Details',
          render: () => <Tab.Pane attached={false}>
              <PropertyDetailTable active_property={active_property}/>
              <div>
                  <h3 style={{textAlign:'start'}}>Additional Comments</h3>
                  <CommentSection dispatch={dispatch} active_property_comments={active_property_comments} google_image_url={google_image_url} user_email={user_email} active_property={active_property}/>
              </div>
            </Tab.Pane>,
        },
        {
          menuItem: 'Comps',
          render: () => <Tab.Pane attached={false}>Comps</Tab.Pane>,
        },
        {
          menuItem: 'More',
          render: () => <PropertyCardMoreSection active_property_comments={active_property_comments} user_email={user_email} google_image_url={google_image_url} activeIndex={activeIndex}  handleClick={handleClick} propertyInfo={active_property}/>,
        },
      ]
    return (
        <>
            <Sidebar
                id="sidebar-right-property"
                style={{"boxShadow": 'none', 'overflowY': 'scroll'}}
                as={Menu}
                animation='overlay'
                icon='labeled'
                direction="right"
                vertical
                visible={activePropertyLocal && right_side_bar_open}
                width='wide'
            >
                <Menu.Header className="menu-header">
                    <span onClick={()=>{setActivePropertyLocal(false)}}>
                        <Icon name="arrow left" />
                        Back
                    </span>
                </Menu.Header>

                <div className="sidebar-content">
                    <h2>
                        {numberFormat(parseInt(active_property.acres))} acres in {active_property.county} {active_property.url ? <a target="_blank" href={active_property.url}><Icon size="small" color={'blue'}name="external alternate"></Icon></a> : false }
                    </h2>
                    <Image
                        style={{
                            backgroundImage:`url(${active_property.photo_url ? active_property.photo_url : './img/logo-peregrine-black.png'})`,
                            backgroundRepeat:`${active_property.photo_url ? '': "no-repeat"}`,
                            backgroundSize: `${active_property.photo_url ? 'cover': "contain"}`, backgroundPosition:"50% 50%"
                        }}
                        wrapped ui={false}
                    />
                </div>

                <hr />

                <div className="sidebar-content">
                    <Tab menu={{ secondary: true, pointing: true }} activeIndex={activePane} onTabChange={(e, data) => setActivePane(data.activeIndex)} panes={panes} />
                </div>

            </Sidebar>
        </>
    )
}
const mapStateToProps = (state) => ({
    ...state.user,
    ...state.sidebar,
    ...state.properties
});

export default connect(mapStateToProps)(SinglePropertySideBar);
