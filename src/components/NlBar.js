import React from 'react';
import $ from 'jquery';
export default class NlBar extends React.Component
{
	constructor(props){
		super();
		this.state={
			isGoing: props.bar.going		
		};
	};
	render(){
		return (<div className="bar">
				<img src={this.props.bar.imgUrl} alt="Imagen" height="60" width="60"/>
				<p><a href={this.props.bar.url} target="_blank">{this.props.bar.name}</a></p>
				<p>{this.props.bar.comment}</p>
				<button onClick={this._handleGoing.bind(this)}>{this.state.isGoing} going</button>
			</div>);
	}
	_handleGoing(event){
		event.preventDefault();
		var newState = {isGoing: 3};
		var state=this;
		$.post( "/api/setGoing",{barId: state.props.bar.barId}, function( data ) {
			console.log("Vuelve "+data);
  			state.setState({isGoing: data.isGoing});
		}).fail(function() {
    	console.log( "error" );
			state.setState({isGoing: newState.isGoing});	
  });
		
	//	this.props.toggleGoing(this.props.bar.id);
	}
}