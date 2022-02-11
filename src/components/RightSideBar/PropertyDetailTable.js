import { useEffect } from "react";
import { Table } from "semantic-ui-react";
import { sourceReplace } from "../../utils/shared_constants";

export default function PropertyDetailTable({active_property}){
    const formatNumber =(number, decimalPoint)=>{
        const fixedNum = number && number !== NaN && decimalPoint? number.toFixed(decimalPoint) : Math.round(number)
        return new Intl.NumberFormat().format(fixedNum)
    }

    return(
        <Table singleLine>
            {active_property && <Table.Body>
            <Table.Row>
                <Table.Cell>Source</Table.Cell>
                <Table.Cell>{active_property.source ? sourceReplace[active_property.source].toUpperCase():'NO SOURCE'}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>{active_property.status==0 ? 'Sold ':''}Price</Table.Cell>
                <Table.Cell>{!active_property.price ? 'No Price' : '$'+(active_property.status == 0 ? formatNumber(active_property.sold, 0) : formatNumber(active_property.price, 0))}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>{active_property.status==0 ? 'Sold ':''}Price / Acre</Table.Cell>
                <Table.Cell>{!active_property.price ? 'No Price' : '$'+(active_property.status == 0 ? formatNumber(active_property.sold/active_property.acres, 0) : formatNumber(active_property.price/active_property.acres, 0))}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>{active_property.status==0 ? 'Sold ':''}Price / Sq Ft</Table.Cell>
                <Table.Cell>{!active_property.price ? 'No Price' : '$'+(active_property.status == 0 ? formatNumber(active_property.sold/(active_property.acres * 43560.04), 2) : formatNumber(active_property.price/(active_property.acres * 43560.04), 2))}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>City</Table.Cell>
                <Table.Cell>{active_property.city ? active_property.city : <img style={{height: '15px'}} src='./img/icons/icon-x.svg' alt="Area" />}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>County</Table.Cell>
                <Table.Cell>{active_property.county}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Acres</Table.Cell>
                <Table.Cell>{formatNumber(Math.round(active_property.acres))}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>% Usable</Table.Cell>
                <Table.Cell>{Math.round(active_property.net_acres/active_property.acres*100) + '%'}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>% Frontage</Table.Cell>
                <Table.Cell>{Math.round(active_property.road_gis/active_property.perimeter*100) + '%'}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Live Water</Table.Cell>
                <Table.Cell>{parseFloat(active_property.creek)+parseFloat(active_property.lake)+parseFloat(active_property.river) > 0 ? <img style={{height: '12px'}} src='./img/icons/icon-check.svg' alt="Area" />: <img style={{height: '12px'}} src='./img/icons/icon-x.svg' alt="Area" />}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Improvements</Table.Cell>
                <Table.Cell>{active_property.beds > 0 || active_property.improvval/active_property.price > 0.15 ? <img style={{height: '12px'}} src='./img/icons/icon-check.svg' alt="Area" />: <img style={{height: '12px'}} src='./img/icons/icon-x.svg' alt="Area" />}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Days on Market</Table.Cell>
                <Table.Cell>{active_property.days ? <p>{parseInt(active_property.days)}</p>: <img style={{height: '12px'}} src='./img/icons/icon-x.svg' alt="Area" />}</Table.Cell>
            </Table.Row>
            </Table.Body>}
        </Table>
    )
}
