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
    const {
        classes, eventName, createAt, deadlineTime, maxParticipant, currentParticipant, contents, eventUUID,
        prizes, style, authParams, participants, blockInfo,drawTx
    } = props;
    let inputAuthParams = {};
    authParams.forEach(v => {
        inputAuthParams[v] = "";
    });

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
            </Paper>
            <Paper className={classes.paper} style={{marginTop: "10px"}}>
                <Typography variant='h1' className={classes.h1}>참가자 Entropy 정보</Typography>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>참가자 Tx</TableCell>
                            <TableCell align="right">이메일</TableCell>
                            <TableCell align="right">랜덤 엔트로피</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participants.map(row => (
                            <TableRow key={row.UUID}>
                                <TableCell component="th" scope="row">{row.participateTx.ID}</TableCell>
                                <TableCell align="right">{row.UUID}</TableCell>
                                <TableCell align="right">{row.randomEntropy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Paper className={classes.paper} style={{marginTop: "10px"}}>
                <Typography variant='h1' className={classes.h1}>사용된 블록 정보</Typography>
                <Typography variant={'h3'} className={classes.h3}>블록 타입 : {blockInfo.blockType}</Typography>
                <Typography variant={'h3'} className={classes.h3}>블록 해쉬 : {blockInfo.hash}</Typography>
                <Typography variant={'h3'} className={classes.h3}>블록 생성시간
                    : {timestampToString(blockInfo.timestamp)}</Typography>
                <Typography variant={'h3'} className={classes.h3}>블록 높이 : {blockInfo.height}</Typography>
                <Typography variant={'h3'} className={classes.h3}> <a href={"https://api.blockcypher.com/v1/btc/main/blocks/"+blockInfo.height} target="_blank">정보확인</a></Typography>
            </Paper>

            <Paper className={classes.paper} style={{marginTop: "10px"}}>
                <Typography variant='h1' className={classes.h1}>랜덤 정보</Typography>
                <Typography variant={'h3'} className={classes.h3}>블록 해쉬값과 사용자 entropy를 합친 결과입니다</Typography>
                <Typography variant={'h3'} className={classes.h3}>랜덤 시드 : {blockInfo.hash}_{participants.map(p=>p.randomEntropy).join('_')}</Typography>
                <Typography variant={'h3'} className={classes.h3}>랜덤 알고리즘 : Fisher-Yate Shuffle</Typography>
                <Typography variant={'h3'} className={classes.h3}>추첨 Tx : {drawTx.ID}</Typography>
            </Paper>
        </div>
    );

    function timestampToString(timestamp) {
        let d = new Date(timestamp * 1000);
        return d.toLocaleDateString() + d.toLocaleTimeString()
    }
});
