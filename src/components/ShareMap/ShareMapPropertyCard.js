import React from 'react'
import { connect } from 'react-redux'
import { Card, Image, Label } from 'semantic-ui-react'
import { setSpecificPopupProperty } from '../../actions/actions_share_map';

function ShareMapPropertyCard({property, dispatch}){

    const statusToLayer = {'-2':'Pending', '0':'Sales', '1':'Listings'}

    const numberFormat = (n, price) => {
        var parts=n.toString().split(".");
        if(price) {return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  const openSpecificPopup = () =>{
    dispatch(setSpecificPopupProperty(property))
  }
    return(
        <>
            <Card onClick={openSpecificPopup} className="property-card">
                <span className="price"> {
                  !property.price ? 'No Price' : property.status == 0 ? numberFormat(property.sold/property.acres, true) : numberFormat(property.price/property.acres, true)
                } </span>
                <Image
                    style={{
                        backgroundImage:`url(${property.photo_url ? property.photo_url : 'https://react.semantic-ui.com/images/wireframe/image.png'})`,
                        backgroundSize:"cover",
                    }}
                    wrapped ui={false}
                />
                <Card.Content>
                    <div className="details">
                        <div className="acres">
                            {parseInt(property.acres)} acres
                        </div>
                        <div className="location">
                            <img src='../img/icons/icon-pin-outline.svg' alt="Area" />
                            <p style={{textOverflow:'ellipsis'}}>{property.county} county</p>
                        </div>
                    </div>

                    <div className="tags">
                        { property.source ?
                            <Label className='source'>
                                {property.source.toUpperCase()}
                            </Label>
                        : null }

                        { property.status && statusToLayer[parseInt(property.status).toString()]?
                            <Label className='status'>
                                {statusToLayer[parseInt(property.status).toString()].toUpperCase()}
                            </Label>
                        : null }
                    </div>

                </Card.Content>
            </Card>
        </>
    )
}
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(ShareMapPropertyCard);
