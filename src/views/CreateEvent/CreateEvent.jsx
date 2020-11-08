import React from "react";
import {withStyles} from "@material-ui/core";


import EventListStyle from "assets/jss/material-dashboard-react/views/EventListStyle.jsx";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import CustomInput from "../../components/CustomInput/CustomInput";
import TextField from "@material-ui/core/TextField/TextField";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Button from "../../components/CustomButtons/Button";
import {tryCreateLottery} from "../../action/lottery";
import connect from "react-redux/es/connect/connect";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import uuid from "uuid";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import CheckBox from "@material-ui/core/Checkbox";

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UUID: '',
            eventName: '',
            contents: '',
            deadlineTime: '2017-05-24T00:00',
            viewDeadlineTime: '2020-11-05T00:00',
            maxParticipant: 0,
            drawTypes: ['DRAW_BLOCK_HASH'],
            prizes: [{
                UUID: uuid.v4(),
                title: '',
                memo: '',
                winnerNum: 0
            }],
            targetBlock: {
                blockType: 'BITCOIN',
                hash: '',
                timestamp: 0,
                height: 0,
            },
            eventCreateTx: {
                ID: '',
                submitterId: '',
                submitterAddress: '',
                timestamp: 0
            },
            participants: [
                {
                    eventUUID: '',
                    participantUUID: '',
                    participantInfo: '',
                    participateTx: {
                        ID: '',
                        submitterId: '',
                        submitterAddress: '',
                        timestamp: 0
                    }
                }
            ],
            useOtherAuth: false,
            otherAuthParamStr: '',
            useYoutubeAuth: false,
            youtubeAuthURL: '',
        };
    }

    handleRandomSeedTypeChange = (event) => {
        const value = event.target.value;
        this.setState((state, props) => {
            return {targetBlock: {...state.targetBlock, blockType: value}}
        });
    };

    handleEventNameChange = (event) => {
        const value = event.target.value;
        this.setState(() => {
            return {eventName: value}
        });
    };

    handleDeadlineDateChange = (event) => {
        const value = event.target.value;
        this.setState(() => {
            let d = new Date(value);
            return {
                viewDeadlineTime: value,
                deadlineTime: Math.floor(d.getTime() / 1000),
            }
        })
    };


    render() {
        const {classes, tryCreateLottery, isLoading} = this.props;
        return (
            <div>
                {isLoading ? <CircularProgress
                    style={{position: "absolute", top: "50%", left: "50%", width: "100px", height: "100px", zIndex: 10}}
                    className={classes.progress}/> : <div/>}
                <GridContainer style={{opacity: isLoading ? 0.5 : 1}}>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>새 추첨 이벤트 생성하기</h4>
                                <p className={classes.cardCategoryWhite}>아래 항목을 채워주세요 ( * 표시는 필수 항목 입니다 )</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="추첨이름 *"
                                            value={this.state.eventName}
                                            onChange={this.handleEventNameChange}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <InputLabel className={classes.selectLabel}>추첨 랜덤 생성 방법</InputLabel>
                                        <Select value={this.state.targetBlock.blockType} className={classes.select}
                                                onChange={this.handleRandomSeedTypeChange}>
                                            <MenuItem value={"BITCOIN"}>비트코인
                                                해쉬값 기반</MenuItem>
                                            <MenuItem value={"EOS"}>이오스 해쉬값
                                                기반</MenuItem>
                                        </Select>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            inputType="number"
                                            labelText="최대 참여자 수 ( 0 = 무제한 )"
                                            id="company-disabled"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            onChange={(event) => this.setState({maxParticipant: +event.target.value})}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <InputLabel className={classes.selectLabel}>추첨 마감일</InputLabel>
                                        <TextField
                                            className={classes.select}
                                            type="datetime-local"
                                            value={this.state.viewDeadlineTime}
                                            onChange={this.handleDeadlineDateChange}
                                        />
                                    </GridItem>
                                    <GridItem xs={12}>
                                        <TextField
                                            label="추첨 상세내용"
                                            multiline={true}
                                            value={this.state.contents}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                this.setState({contents: value})
                                            }}
                                            style={{width: "100%", marginTop: "20px"}}
                                            variant="outlined"
                                            rows="10"/>
                                    </GridItem>
                                    <GridItem xs={11} style={{marginTop: "27px"}}>
                                        추첨 항목 *
                                    </GridItem>
                                    <GridItem xs={1}>
                                        <IconButton style={{marginTop: "27px"}} onClick={() => {
                                            this.setState((state, props) => {
                                                return {
                                                    prizes: [
                                                        ...state.prizes,
                                                        {
                                                            UUID: uuid.v4(),
                                                            title: '',
                                                            memo: '',
                                                            winnerNum: 0
                                                        }
                                                    ]
                                                }
                                            })
                                        }}>
                                            <AddIcon color={"primary"}/>
                                        </IconButton>
                                    </GridItem>
                                    {this.state.prizes.map((prize, idx) => {
                                        return <GridItem xs={12} key={prize.UUID}>
                                            <GridContainer>
                                                <GridItem xs={6} style={{marginTop: "-35px"}}>
                                                    <CustomInput
                                                        inputType="text"
                                                        labelText="항목"
                                                        value={prize.title}
                                                        onChange={(event) => {
                                                            let data = {
                                                                prizes: this.state.prizes
                                                            };
                                                            data.prizes[idx].title = event.target.value;
                                                            this.setState(data);
                                                        }}
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                    />
                                                </GridItem>
                                                <GridItem xs={5} style={{marginTop: "-35px"}}>
                                                    <CustomInput
                                                        inputType="number"
                                                        labelText="당첨자 수"
                                                        value={prize.winnerNum}
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        onChange={(event) => {
                                                            let data = {
                                                                prizes: this.state.prizes
                                                            };
                                                            data.prizes[idx].winnerNum = +event.target.value;
                                                            this.setState(data);
                                                        }}
                                                    />
                                                </GridItem>
                                                <GridItem xs={1} style={{marginTop: "5px"}}>
                                                    <IconButton onClick={() => {
                                                        this.setState((state, props) => {
                                                            return {
                                                                prizes: state.prizes.filter(p => p.UUID !== prize.UUID)
                                                            }
                                                        })
                                                    }}>
                                                        <RemoveCircleIcon color={"primary"}/>
                                                    </IconButton>
                                                </GridItem>
                                            </GridContainer>
                                        </GridItem>
                                    })}

                                    <GridItem xs={12} style={{marginTop: "27px"}}>
                                        인증 사용
                                    </GridItem>
                                    <GridItem xs={4}>
                                        <FormControlLabel
                                            style={{paddingTop: "35px"}}
                                            control={
                                                <CheckBox checked={this.state.useOtherAuth}
                                                          onChange={(e) => {
                                                              let data =e.target.checked;
                                                              this.setState({useOtherAuth:data});
                                                              if (data === true && this.state.useYoutubeAuth === true) {
                                                                  this.setState({useYoutubeAuth: false})
                                                              }
                                                          }}/>
                                            }
                                            label="외부 인증 사용"
                                        />
                                    </GridItem>
                                    <GridItem xs={8}>
                                        <CustomInput
                                            labelText="인증에 필요한 목록( , 로 구분 . ex - 인증URL(필수), 이름,휴대폰번호)"
                                            alue={this.state.otherAuthParamStr}
                                            onChange={(e)=>{
                                                const data = e.target.value;
                                                this.setState({otherAuthParamStr:data})
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={4}>
                                        <FormControlLabel
                                            style={{paddingTop: "35px"}}
                                            control={
                                                <CheckBox checked={this.state.useYoutubeAuth}
                                                          onChange={(e) => {
                                                              let data =e.target.checked;
                                                              this.setState({useYoutubeAuth: data});
                                                              if (data === true && this.state.useOtherAuth === true) {
                                                                  this.setState({useOtherAuth: false})
                                                              }
                                                          }}/>
                                            }
                                            label="유튜브 인증 사용"
                                        />
                                    </GridItem>
                                    <GridItem xs={8}>
                                        <CustomInput
                                            labelText="유튜브 링크"
                                            value={this.state.youtubeAuthURL}
                                            onChange={(e)=>{
                                                const data = e.target.value;
                                                this.setState({youtubeAuthURL:data})
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={4}/>
                                    <GridItem xs={4}>
                                        <Button color={"primary"} style={{width: "100%"}}
                                                onClick={() => {
                                                    let createLotteryDto = this.state;
                                                    if (createLotteryDto.useOtherAuth){
                                                        if (createLotteryDto.otherAuthParamStr === ""){
                                                            alert("인증에 사용될 파라미터를 확인해주세요");
                                                            return;
                                                        }
                                                        const authParams = createLotteryDto.otherAuthParamStr.split(",");
                                                        createLotteryDto.authURL = authParams[0];
                                                        createLotteryDto.authParams = authParams.slice(1,authParams.length);
                                                    }
                                                    tryCreateLottery(createLotteryDto)
                                                }}> 추첨 생성 </Button>
                                    </GridItem>
                                    <GridItem xs={4}/>
                                </GridContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        isLoading: state.commonStatus.isLoading
    }
};

const mapDispatchToProps = {
    tryCreateLottery: tryCreateLottery,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(EventListStyle)(CreateEvent));
