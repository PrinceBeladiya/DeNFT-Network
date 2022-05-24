import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import MainTemplateContainer from '../shared/templates/MainTemplate/MainTemplateContainer';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ComposedComponent) => {
    const Auth = ({ sub }) => {

        const [pageAccessible, setPageAccessible] = useState(false);

        useEffect(() => {
            if (sub && sub.length > 0) {
                setPageAccessible(true);
            }
        }, [sub]);

        return (
            <>
                {
                    pageAccessible ?
                        <ComposedComponent />
                        :
                        <MainTemplateContainer>
                            <div className='instruction-label'>
                                <h1>Please login first</h1>
                            </div>
                        </MainTemplateContainer>
                }
            </>

        );
    }


    Auth.propTypes = {
        sub: propTypes.string,
    };

    Auth.defaultProps = {
        sub: ''
    };

    const mapStateToProps = state => ({
        sub: state.landing.uAuth && Object.keys(state.landing.uAuth).length > 0 ? state.landing.uAuth.sub : '',
    });

    const mapDispatchToProps = () => ({
        // getData: data => dispatch(landingActions.getData(data)),
    });

    return connect(mapStateToProps, mapDispatchToProps)(Auth);

}
