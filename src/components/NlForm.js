import React from 'react';
export default class NlForm extends React.Component
{
	render(){
		return (<form onSubmit={this._handleSubmit.bind(this)}><input placeholder="Enter your city" ref={(input) => this._city =input}/><button type="submit">Search</button></form>);
	};
	_handleSubmit(event){
		event.preventDefault();
		let city =this._city;
		this.props.searchBars(city.value);
		
	}
};