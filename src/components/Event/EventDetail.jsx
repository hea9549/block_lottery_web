import {withStyles} from "@material-ui/core";
import React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import Card from "@material-ui/core/Card/Card";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Button from "../CustomButtons/Button";
import CardBody from "../Card/CardBody";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

const eventDetailStyle = {
    paper: {
        padding: "10px",
        width: "100%",

    }, h1: {

        fontFamily: ["Jeju Gothic", "Roboto", "Helvetica", "Arial"],
        fontSize: "25px",
        textAlign: 'center',
        marginTop: "10px"
    }, h3: {
        fontFamily: ["Jeju Gothic", "Roboto", "Helvetica", "Arial"],
        fontSize: "15px",
        margin: '10px',
    },
    contents: {
        padding: '20px',
        margin: '50px 20px 10px 20px'

    },
    table: {
        minWidth: 650,
    },
};

export default withStyles(eventDetailStyle)(function (props) {
    const [open, setOpen] = React.useState(false);

    const {
        classes, eventName, createAt, deadlineTime, maxParticipant, currentParticipant, contents, eventUUID,
        isOpen, isDrawn, onParticipateClick, onDrawClick, remainTime, prizes, style, authParams,
    } = props;
    let inputAuthParams = {};
    authParams.forEach(v => {
        inputAuthParams[v] = "";
    });
    const [participantData, setParticipantData] = React.useState({
        email: '',
        randomEntropy: '',
        inputAuthParams: inputAuthParams
    });

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div style={style}>
            <Paper className={classes.paper}>
                <Typography variant='h1' className={classes.h1}>{eventName}</Typography>
                <Card elevation={5} className={classes.contents} style={{whiteSpace: 'pre-wrap'}}>
                    {contents}
                </Card>
                <GridContainer>
                    <GridItem xs={12} sm={6}>
                        <Typography variant={'h3'} className={classes.h3}>생성일 : {createAt}</Typography>
                    </GridItem>
                    <GridItem xs={12} sm={6}>
                        <Typography variant={'h3'} className={classes.h3}>마감일 : {deadlineTime}</Typography>
                    </GridItem>
                    <GridItem xs={12} sm={6}>
                        <Typography variant={'h3'} className={classes.h3}>참가자수 : {currentParticipant} 명</Typography>
                    </GridItem>
                    <GridItem xs={12} sm={6}>
                        <Typography variant={'h3'} className={classes.h3}>최대 참가자수 : {maxParticipant} 명</Typography>
                    </GridItem>

                    <GridItem xs={12} sm={12}>
                        <Typography variant={'h3'} className={classes.h3}>남은시간 : {remainTime}</Typography>
                    </GridItem>
                </GridContainer>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>상품명</TableCell>
                            <TableCell align="right">상품 설명</TableCell>
                            <TableCell align="right">당첨 인원</TableCell>
                            <TableCell align="right">당첨자</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prizes.map(row => (
                            <TableRow key={row.UUID}>
                                <TableCell component="th" scope="row">
                                    {row.title}
                                </TableCell>
                                <TableCell align="right">{row.memo}</TableCell>
                                <TableCell align="right">{row.winnerNum}</TableCell>
                                <TableCell
                                    align="right">{!row.winners ? '추첨 전' : row.winners.map(winner => winner.UUID).toString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isOpen ?

                    <Button color={"success"} style={{width: "30%", marginLeft: "35%"}}
                            onClick={handleClickOpen}>참가하기</Button> :
                    <Button color={"danger"} style={{width: "30%", marginLeft: "35%"}}
                            disabled={isDrawn}
                            onClick={() => onDrawClick(eventUUID)}>{isDrawn ? "추첨완료" : "추첨하기"}</Button>}
            </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {eventName}에 참여하기위해 다음 정보를 기입해 주세요
                    </DialogContentText>
                    {authParams === null || authParams.length === 0 ?
                        //어스파람없는경우
                        <div>
                            <TextField
                                autoFocus
                                id="email"
                                label="이메일"
                                type="email"
                                value={participantData.email}
                                onChange={event => setParticipantData({...participantData, email: event.target.value})}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                id="randomEntropy"
                                label="사용자 참여 무작위값"
                                type="text"
                                value={participantData.randomEntropy}
                                onChange={event => setParticipantData({...participantData, randomEntropy: event.target.value})}
                                fullWidth
                            />
                        </div>

                        :
                        authParams.map((oneAuthParam, idx) => {
                            return (
                                <TextField
                                    autoFocus
                                    key={idx}
                                    id={"text" + idx}
                                    label={oneAuthParam}
                                    type="text"
                                    onChange={event => {
                                        const data = event.target.value;
                                        setParticipantData({
                                            ...participantData, inputAuthParams: {
                                                ...participantData.inputAuthParams,
                                                [oneAuthParam]: data
                                            }
                                        })
                                    }
                                    }
                                    value={participantData.inputAuthParams[oneAuthParam]}
                                    fullWidth
                                />
                            )
                        })}

                    {/*<TextField*/}
                    {/*id="name"*/}
                    {/*label="Name"*/}
                    {/*type="text"*/}
                    {/*value={participantData.name}*/}
                    {/*onChange={event => setParticipantData({...participantData, name: event.target.value})}*/}
                    {/*fullWidth*/}
                    {/*/>*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                    <Button onClick={() => {
                        setOpen(false);
                        onParticipateClick(eventUUID, participantData);
                    }} color="primary">
                        참여하기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
});
