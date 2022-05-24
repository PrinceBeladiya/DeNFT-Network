import React from 'react';
import PropTypes from 'prop-types';

import MainTemplate from './MainTemplate';
import * as landingActions from '../../../modules/landing/redux/actions';
import { uauth } from '../../../config';
import { connect } from 'react-redux';

class MainTemplateContainer extends React.Component {

  async componentDidMount() {
    const { setAccount } = this.props;
    await uauth
    .user()
    .then(setUser => setAccount(setUser))
    .catch(() => {})
  }

  render() {
    const {
      children, className, childrenContainerClassName,
      hideHeader, hideFooter,
    } = this.props;
    return (
      <MainTemplate
        className={className}
        childrenContainerClassName={childrenContainerClassName}
        hideHeader={hideHeader}
        hideFooter={hideFooter}
      >
        {children}
      </MainTemplate>
    )
  }
}

MainTemplateContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  className: PropTypes.string,
  childrenContainerClassName: PropTypes.string,
  hideFooter: false,  
};

MainTemplateContainer.defaultProps = {
  children: <div />,
  className: '',
  childrenContainerClassName: '',
  hideFooter: false,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  setAccount: account => dispatch(landingActions.setAccount(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainTemplateContainer);
