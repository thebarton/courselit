import React from "react";
import PropTypes from "prop-types";
import Header from "./Header.js";
import { connect } from "react-redux";
import { LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";
import { MEDIA_BACKEND } from "../config/constants.js";
import { formulateMediaUrl } from "../lib/utils.js";
import { siteInfoProps } from "../types.js";
import Footer from "./Footer.js";

const useStyles = makeStyles({
  showProgressBar: props => ({
    visibility: props.networkAction ? "visible" : "hidden"
  }),
  mainContent: {
    minHeight: "90vh"
  }
});

const MasterLayout = props => {
  const classes = useStyles(props);
  return (
    <>
      <Head>
        <title>
          {props.title} | {props.siteInfo.title}
        </title>
        {props.siteInfo.logopath && (
          <link
            rel="icon"
            href={formulateMediaUrl(
              MEDIA_BACKEND,
              props.siteInfo.logopath,
              true
            )}
          />
        )}
      </Head>
      <CssBaseline />
      <Header />
      <LinearProgress className={classes.showProgressBar} />
      <div className={classes.mainContent}>{props.children}</div>
      <Footer />
    </>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.object,
  networkAction: PropTypes.bool,
  siteInfo: siteInfoProps.isRequired,
  title: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  networkAction: state.networkAction,
  siteInfo: state.siteinfo
});

export default connect(mapStateToProps)(MasterLayout);