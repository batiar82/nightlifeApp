import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from "react-router";
//import { Link } from 'react-router';
class NlForm extends React.Component
{
	constructor(props) {
    super(props);
    console.log(this.props)
	}
	_getInput(){
		console.log("props search "+this.props.search);
		var holder="Please enter a city...";
		var value="";
		if (this.props.search!= undefined && this.props.search!=="")
			holder=this.props.search;
			value=this.props.search;
		
		return (<input type="text" className="form-control" placeholder={holder} ref={(input) => this._city =input}/>);
		
 //(<input type="text" value={this.props.search} ref={(input) => this._city =input}/>);
	}
	/*render(){
		const input=this._getInput();
		return (<form onSubmit={this._handleSubmit.bind(this)}>
					{input}
					<button type="submit">Search</button>
				</form>);
	};*/
	render(){
		const input=this._getInput();
		return (<form onSubmit={this._handleSubmit.bind(this)}>
					<div className="form-row">
						<div className="col-xs-9">
							{input}
						</div>
						<div className="col">
							<button type="submit" className="btn btn-primary">Search</button>
						</div>
					</div>
				</form>);
	};
	_handleSubmit(event){
		event.preventDefault();
		let city =this._city;
		this.props.searchBars(city.value);
		
	}
};
class NlLogin extends React.Component
{
	constructor(props) {
    super(props);

    console.log(this.props)
	}
	render(){
//		return (<div className="btn" id="login-btn" onClick={this._handleLogin.bind(this)}>
	/*	return (<div className="btn" id="login-btn">
					<a href="/auth/github">
						<img src="/public/img/github_32px.png" alt="github logo" />
						<p>LOGIN WITH GITHUB</p>
					</a>
					</div>);/**/
		return (<div class="container">	
			<div className="login">
				<a href="/auth/github">
					<div className="btnLogin" id="login-btn">
						<img src="/public/img/github_32px.png" alt="github logo" />
						<p>LOGIN WITH GITHUB</p>
					</div>
				</a>
			</div>
		</div>);
	};
	_handleLogin(event){
		event.preventDefault();
		console.log("click en login");
		console.log("Props "+JSON.stringify(this.props));
		this.props.handleLogin();
	}
};
class NlBar extends React.Component
{
	constructor(props){
		super();
		this.state={
			isGoing: props.bar.going		
		};
	};
	/*
	render(){
		return (<div className="bar">
				<img src={this.props.bar.imgUrl} alt="Imagen" height="60" width="60"/>
				<p><a href={this.props.bar.url} target="_blank">{this.props.bar.name}</a></p>
				<p>{this.props.bar.comment}</p>
				<button onClick={this._handleGoing.bind(this)}>{this.props.bar.going} going</button>
			</div>);
	}*/
	render(){
		return (<div  className="row list-group-item">
					<div className="media col-sm-3 col-xs-12">
						<figure className="pull-left">
							<img className="media-object img-rounded img-responsive" src={this.props.bar.imgUrl} alt={this.props.bar.name}/>
						</figure>
					</div>
					<div className="col-sm-6  col-xs-12">
                    	<h4 className="list-group-item-heading"><a href={this.props.bar.url} target="_blank"> {this.props.bar.name}</a> </h4>
                    	<p className="list-group-item-text"> {this.props.bar.comment}</p>
            		</div>
                	<div className="col-sm-3  col-xs-12 text-center">
                    	<button type="button" onClick={this._handleGoing.bind(this)} className="btn btn-default btn-lg btn-block"> {this.props.bar.going} Going! </button>
                	</div>
				</div>);
	}
	_handleGoing(event){
	//	event.preventDefault();
		var state=this;
		this.props.handleGoing(state.props.bar.barId);
		
		
	//	this.props.toggleGoing(this.props.bar.id);
	}
}
class NlContainer extends React.Component {
  
	constructor(){
		super();
		this.state={
			showBars: false,
			bars: [],
			showLogin: false,
			lastSearch: ""
		};
		this._getLastSearch();

		
	};
	_getBars(){
		console.log("Largo bars para ver"+this.state.bars.length);
		return this.state.bars.map((bar) => {return (<NlBar bar={bar} key={bar.barId} handleGoing={this._toggleGoing.bind(this)}/>)});
	}
	_searchBars(city){
		var state=this;
		$.getJSON( "/api/getBars/"+city, function( data ) {
  			console.log("El data que llega de bars: "+data);
  			state.setState({bars: data,lastSearch: city});
			});
		}
	
	_toggleGoing(barId){
		var state=this;
		var _bars=this.state.bars;
		var _newBars=_bars.slice();
		console.log("About to togglegoing with "+barId);
		$.getJSON("/api/isAuthenticated", function(data){
			if(data){
				$.post( "/api/setGoing",{barId: barId}, function( data ) {
					console.log("Vuelve "+data.goers);
					_bars.forEach(function(item,index){
					if(item.barId===barId){
						_newBars[index].going=data.goers;
						state.setState({bars: _newBars});
					}
				});
  				}).fail(function() {
    				console.log( "error" );
				});
			}else{
				state.setState({showLogin: true});	
			}
			
			
		});
		
		
	}
	
	_getLastSearch(){
		var _state=this;
		console.log("Llaman a getLastSearch");
		$.get("/api/getLastSearch/",function(data){
			console.log("data "+JSON.stringify(data));
			if(data){
				_state.setState({bars: data.bars});
				_state.setState({lastSearch: data.lastSearch});
			}
			});
	}
	_handLogin(){
		console.log("handleLogin");
		var _state=this;
		$.get("/auth/github",function(data){
			console.log("Vuelve "+JSON.stringify(data));
			_state.setState({showLogin: false});
				
			});
		}
	/*	
	render(){

	if(this.state.showLogin)
		return (<NlLogin handleLogin={this._handLogin.bind(this)}/>);
    const bars=this._getBars();
		return (<div className="container">
			<NlForm searchBars={this._searchBars.bind(this)} search={this.state.lastSearch}/>
				{bars}
		</div>);
  };*/
  render(){

	if(this.state.showLogin)
		return (<NlLogin handleLogin={this._handLogin.bind(this)}/>);
    const bars=this._getBars();
		return (<div>
				<div className="container">
					<div className="row">
						<div className="well">
							<h1 className="text-center">Plans Tonight?</h1>
							<h4 className="text-center">See which bars are hoppin' tonight and RSVP ahead of time!</h4>
							<NlForm searchBars={this._searchBars.bind(this)} search={this.state.lastSearch}/>
						</div>
					</div>
				</div>	
				<div className="container">
					<div className="row">
						<div className="well">
							<div className="list-group">
								{bars}
							</div>
						</div>
					</div>
				</div>
				</div>
			);
  };
};
ReactDOM.render(
	<NlContainer />,
  document.getElementById('root')
);