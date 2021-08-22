import React, { Component } from 'react';
import { Route } from 'react-router-dom'; 
import AuthService from './auth-service';
import { CALLBACK_LOGIN } from '../config';

class RouteAuthorize extends Component {
	state = {
		authorized: true
	};
 
	componentWillMount() {
		if (this.state.authorized) {
			AuthService.getUser().then((user) => {
				this.setState({ authorized: user.possuiAutorizacao(this.props.roles, this.props.claims) });
			});
		}
	} 

	componentWillUpdate() { 
 
		if(!AuthService.isAuthenticated()) {
			window.location.href = CALLBACK_LOGIN;
			return;
		}
	}

	render() { 
		
		return <Route {...this.props} onEnter={(e) => this.onEnter(e)} />;
	}
}

export default RouteAuthorize;
