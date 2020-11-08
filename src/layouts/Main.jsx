/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import PropTypes from "prop-types";
import {Switch, Route, Redirect} from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Footer from "views/footer/footer"
import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "routes";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import EventDetail from "../views/EventDetail/EventDetailContainer";
import {tryCreateLottery} from "../action/lottery";
import {closeMessage} from "../action/common";
import connect from "react-redux/es/connect/connect";
import VerifyDetailContainer from "views/VerifyEvent/VerifyDetailContainer";

let ps;

const switchRoutes = (
    <Switch>
        <Route path="/main/lottery/:UUID" component={EventDetail}/>
        <Route path="/main/verify/:UUID" component={VerifyDetailContainer}/>
        {routes.map((prop, key) => {
            if (prop.layout === "/main") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            }
            return null;
        })}
        <Redirect from="/main" to="/main/dashboard"/>
    </Switch>
);

class Dashboard extends React.Component {
    state = {
        image: image,
        color: "blue",
        hasImage: true,
        fixedClasses: "dropdown show",
        mobileOpen: false
    };
    mainPanel = React.createRef();

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };


    resizeFunction = () => {
        if (window.innerWidth >= 960) {
            this.setState({mobileOpen: false});
        }
    };

    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(this.mainPanel.current);
        }
        window.addEventListener("resize", this.resizeFunction);
    }

    componentDidUpdate(e) {
        if (e.history.location.pathname !== e.location.pathname) {
            this.mainPanel.current.scrollTop = 0;
            if (this.state.mobileOpen) {
                this.setState({mobileOpen: false});
            }
        }
    }

    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
        }
        window.removeEventListener("resize", this.resizeFunction);
    }

    render() {
        const {classes,closeMessage,msgList, ...rest} = this.props;
        return (
            <div className={classes.wrapper}>
                <Sidebar
                    routes={routes}
                    logoText={"Block Lottery"}
                    logo={logo}
                    image={this.state.image}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color={this.state.color}
                    {...rest}
                />
                <div className={classes.mainPanel} ref={this.mainPanel}>
                    <div className={classes.content}>
                        <div className={classes.container}>{switchRoutes}</div>
                    </div>
                    <Footer
                        msgList={msgList}
                        onClose={closeMessage}
                    />
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
    return {
        msgList: state.commonStatus.msgList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        closeMessage: msg=>dispatch(closeMessage(msg))
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(dashboardStyle)(Dashboard));
