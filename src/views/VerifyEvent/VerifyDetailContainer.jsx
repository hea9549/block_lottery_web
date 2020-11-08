import React from "react";
import {connect} from "react-redux";
import VerifyDetailPresentation from "../../components/Event/VerifyDetail";
import {tryDrawLottery, tryGetLottery, tryParticipateLottery} from "../../action/lottery";
import Grow from '@material-ui/core/Grow';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

class EventVerifyDetailContainer extends React.Component {


    componentDidMount() {
        const {match, lotteries, tryGetLottery} = this.props;
        const lottery = lotteries.find(event => {
            return event.UUID === match.params.UUID;
        });
        if (lottery === undefined) {
            tryGetLottery(match.params.UUID);
        }
    }

    render() {
        const {classes, isLoading, match, lotteries} = this.props;


        const event = lotteries.find(event => event.UUID === match.params.UUID);
        return <div>
            {isLoading ? <CircularProgress
                style={{position: "absolute", top: "50%", left: "50%", width: "100px", height: "100px", zIndex: 10}}
            /> : <div/>}
            {event ? <Grow in={event !== undefined} timeout={1000}>
                    <VerifyDetailPresentation style={{opacity: isLoading ? 0.5 : 1}}
                                              eventName={event.eventName}
                                              eventUUID={event.UUID}
                                              contents={event.contents}
                                              createAt={timestampToString(event.eventCreateTx.timestamp)}
                                              deadlineTime={timestampToString(event.deadlineTime)}
                                              currentParticipant={event.participants ? event.participants.length : 0}
                                              maxParticipant={event.maxParticipant}
                                              prizes={event.prizes}
                                              isOpen={Math.floor(Date.now() / 1000) < event.deadlineTime}
                                              isDrawn={event.status === "DRAWN"}
                                              authParams={event.authParams}
                                              participants={event.participants}
                                              blockInfo={event.targetBlock}
                                              drawTx={event.drawTx}
                                              remainTime={calcRemainTime(event.deadlineTime)}

                    />
                </Grow>
                : <br/>
            }

        </div>
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
        lotteries: state.lotteryList.lotteries,
        isLoading: state.commonStatus.isLoading
    }
};

const mapDispatchToProps = {
    tryParticipateLottery: tryParticipateLottery,
    tryGetLottery: tryGetLottery,
    tryDrawLottery: tryDrawLottery,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventVerifyDetailContainer);
