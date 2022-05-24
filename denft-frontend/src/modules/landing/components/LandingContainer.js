import React, { Component } from 'react';
import { connect } from 'react-redux';

import Landing from './Landing';
import * as landingActions from '../redux/actions';

class LandingContainer extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <Landing />
    );
  }
}

LandingContainer.propTypes = {
};

LandingContainer.defaultProps = {
};

const mapStateToProps = state => ({
  data: state.landing.data,
});

const mapDispatchToProps = dispatch => ({
  getData: data => dispatch(landingActions.getData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
