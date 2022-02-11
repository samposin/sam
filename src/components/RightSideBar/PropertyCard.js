import React from 'react'
import { connect } from 'react-redux'
import { Card, Image, Label } from 'semantic-ui-react'
import { setSinglePropertyState } from '../../actions/actions_properties'
import { sourceReplace } from "../../utils/shared_constants";

function PropertyCard({property, dispatch}){
    const statusToLayer = {'-2':'Pending', '0':'Sales', '1':'Listings'}

    const numberFormat = (n, price) => {
        var parts=n.toString().split(".");
        if(price) {return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    console.log(property)
    // console.log(property)
    return(
        <>
            <Card onClick={()=> dispatch(setSinglePropertyState(JSON.parse(JSON.stringify(property))))} className="property-card">
                {/* <Image label={{ color: 'green', content: property.status == -2 ? numberFormat(property.price/property.acres, true) : property.ppa_map, ribbon: 'right'}} style={{width:'100%', height:'150px', backgroundImage:`url(${property.photo_url ? property.photo_url : './img/logo-peregrine-black.png'})`, backgroundRepeat:`${property.photo_url ? '': "no-repeat"}`, backgroundSize: `${property.photo_url ? 'cover': "contain"}`, backgroundPosition:"50% 50%"}} wrapped ui={false} /> */}
                <span className="price">
                    {
                      !property.price ? 'No Price' : property.status == 0 ? numberFormat(property.sold/property.acres, true) : numberFormat(property.price/property.acres, true)
                    }
                </span>
                <Image
                    style={{
                        backgroundImage:`url(${property.photo_url ? property.photo_url : './img/logo-peregrine-black.png'})`,
                        backgroundRepeat:`${property.photo_url ? '': "no-repeat"}`,
                        backgroundSize: `${property.photo_url ? 'cover': "contain"}`
                    }}
                    wrapped ui={false}
                >
                </Image>
                <Card.Content>
                    <div className="details">
                        <div className="acres">
                            {numberFormat(parseInt(property.acres))} acres
                        </div>
                        <div className="location">
                            <img src='./img/icons/icon-pin-outline.svg' alt="Area" />
                            <p style={{textOverflow:'ellipsis'}}>{property.county} County</p>
                        </div>
                    </div>

                    <div className="tags">
                        {
                            property.source?
                            <Label className="source">
                                {sourceReplace[property.source].toUpperCase()}
                            </Label> : null
                        }
                         {
                            property.status && statusToLayer[parseInt(property.status).toString()] ?
                            <Label className="status">
                                {statusToLayer && statusToLayer[parseInt(property.status).toString()] && statusToLayer[parseInt(property.status).toString()].toUpperCase()}
                            </Label> : null
                        }
                    </div>
                </Card.Content>
            </Card>
        </>
    )
}
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(PropertyCard);
