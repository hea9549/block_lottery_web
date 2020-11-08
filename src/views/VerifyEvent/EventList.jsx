import React from "react";
import {withStyles} from "@material-ui/core";


import EventListStyle from "assets/jss/material-dashboard-react/views/EventListStyle.jsx";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import EventCard from "../../components/Event/EventCard";
import connect from "react-redux/es/connect/connect";
import {tryVerifyLottery, tryRefreshLotteries} from "../../action/lottery";
import * as queryString from 'query-string';
import {hist} from "../../index";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

class EventList extends React.Component {

    componentDidMount() {
        const {lotteries, tryRefreshLotteries} = this.props;
        let params = queryString.parse(this.props.location.search);
        let startTimestamp = params.startTimestamp ? params.startTimestamp : Math.floor(Date.now() / 1000) - 60 * 60 * 24;
        let endTimestamp = params.endTimestamp ? params.endTimestamp : Math.floor(Date.now() / 1000) + 100;
        if (lotteries.length === 0 || lotteries[0].eventCreateTx.timestamp < Math.floor(Date.now() / 1000) + 60) {
            tryRefreshLotteries(startTimestamp, endTimestamp);
        }
    }

    render() {
        const {lotteries, isLoading, tryVerifyLottery} = this.props;


        function onDetailClick(UUID) {
            hist.push('/main/verify/' + UUID);
        }

        return (
            <div>{isLoading ? <CircularProgress
                style={{position: "absolute", top: "50%", left: "50%", width: "100px", height: "100px", zIndex: 10}}
            /> : <div/>}
                <GridContainer style={{opacity: isLoading ? 0.5 : 1}}>
                    {lotteries.map((lottery, idx) => {
                        console.log(idx % 2 === 0);
                        if (idx % 2 === 0) {
                            return (
                                <GridItem key={idx} sm={12} md={6}>
                                    <GridContainer>
                                        <GridItem sm={false} md={2}/>
                                        <GridItem sm={12} md={10}>
                                            <EventCard eventUUID={lottery.UUID}
                                                       eventName={lottery.eventName}
                                                       createAt={timestampToString(lottery.eventCreateTx.timestamp)}
                                                       deadlineTime={timestampToString(lottery.deadlineTime)}
                                                       maxParticipant={lottery.maxParticipant + "명"}
                                                       currentParticipant={lottery.participants ? lottery.participants.length + "명" : "0명"}
                                                       contents={lottery.contents}
                                                       remainTime={calcRemainTime(lottery.deadlineTime)}
                                                       onDetailClick={onDetailClick}/>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>

                            )
                        } else {
                            return (
                                <GridItem key={idx} sm={12} md={6}>
                                    <GridContainer>
                                        <GridItem sm={12} md={10}>
                                            <EventCard eventUUID={lottery.UUID}
                                                       eventName={lottery.eventName}
                                                       createAt={timestampToString(lottery.eventCreateTx.timestamp)}
                                                       deadlineTime={timestampToString(lottery.deadlineTime)}
                                                       maxParticipant={lottery.maxParticipant + "명"}
                                                       currentParticipant={lottery.participants ? lottery.participants.length + "명" : "0명"}
                                                       contents={lottery.contents}
                                                       remainTime={calcRemainTime(lottery.deadlineTime)}
                                                       onDetailClick={onDetailClick}/>
                                        </GridItem>
                                        <GridItem sm={false} md={2}/>
                                    </GridContainer>
                                </GridItem>)
                        }
                    })}

                </GridContainer>
            </div>
        )
    }
}

function timestampToString(timestamp) {
    let d = new Date(timestamp * 1000);
    return d.toLocaleDateString() + d.toLocaleTimeString()
}

function calcRemainTime(deadlineTime) {
    let diffSeconds = deadlineTime - Math.floor(Date.now() / 1000);
    if (diffSeconds < 0) return "등록 마감";
    let min = Math.floor(diffSeconds / 60 % 60);
    let hour = Math.floor(diffSeconds / 60 / 60 % 60);
    let day = Math.floor(diffSeconds / 60 / 60 / 24);
    let returnStr = '';
    if (day > 0) returnStr += (day.toString() + '일 ');
    if (hour > 0) returnStr += (hour.toString() + '시간 ');
    if (min > 0) returnStr += (min.toString() + '분 ');
    if (returnStr === '') returnStr = '마감 임박';
    return returnStr;
}

const mapStateToProps = (state) => {
    return {
        lotteries: state.lotteryList.lotteries.filter(l=>l.status === "DRAWN"),
        isLoading: state.commonStatus.isLoading,
        tryVerifyLottery: tryVerifyLottery,
    }
};

const mapDispatchToProps = {
    tryRefreshLotteries: tryRefreshLotteries
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(EventListStyle)(EventList));
