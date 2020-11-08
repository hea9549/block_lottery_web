import {blackColor, hexToRgb, whiteColor} from "../../assets/jss/material-dashboard-react";
import {withStyles} from "@material-ui/core";
import React from 'react';
import CardHeader from "../Card/CardHeader";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import Button from "../CustomButtons/Button";

const eventStyle = {
    cardHeader: {
        padding: "0px",
    }
};


export default withStyles(eventStyle)(function (props) {
    const {eventName, createAt, deadlineTime,remainTime, maxParticipant, currentParticipant, contents, eventUUID,onDetailClick} = props;
    return (
        <div>
            <Card>
                <CardHeader color="primary">
                    {eventName}
                </CardHeader>
                <CardBody>
                    <p style={{
                        lineHeight: '1.6',
                        maxHeight: '4.8em',
                        minHeight: '4.8em',
                        overflow: 'hidden',
                        width: '100%',
                        textOverflow: 'ellipsis',
                        textAlign: 'left', wordWrap: 'break-word',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxAlign: 'vertical'
                    }}>{contents}</p>
                    <div style={{backgroundColor:'blue',width:'100%',height:'1px', marginBottom:'15px'}}/>
                    <div>생성일 : {createAt}</div>
                    <div>마감일 : {deadlineTime}</div>
                    <div>남은시간 : {remainTime}</div>
                    <div style={{textAlign:'center'}}>{currentParticipant}/{maxParticipant}</div>
                    <Button color={"info"} style={{width: "70%",marginLeft:"15%"}} onClick={()=>onDetailClick(eventUUID)}>자세히 보기</Button>
                </CardBody>
            </Card>
        </div>
    )
})
