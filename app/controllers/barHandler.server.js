'use strict';

var Users = require('../models/users.js');
var Bar = require('../models/bars.js');
var Goer = require('../models/goers.js');
var request = require('request');
var rp = require('request-promise');

require('dotenv').load();
const YELP_KEY=process.env.YELP_KEY;
function ClickHandler () {

	this.testBars = function (req, res) {
		var city="nuñez";
		var options = {
			encoding: null,
			url: encodeURI("https://api.yelp.com/v3/businesses/search?location=" + city),
			headers: {
    		'Authorization': YELP_KEY
			}/*,
			json: true*/
			//resolveWithFullResponse: true
		};
		/*rp(options).then(function(body){
			console.log(JSON.stringify(body));
			var bars= body.businesses.map(function(business){
				return processBar(business);
			});
			res.json(bars);
		}).catch(function (err){
			console.log("Error getting bars for: "+JSON.stringify(options)+"error "+err);
		});*/
		request(options,function(error,response,body){
			if (!error && response.statusCode == 200) {
    		var info = JSON.parse(body);
    		res.json(info);
			}else{
			res.json(JSON.parse(error));
			console.log("Hay error "+response.statusCode);
			}
		});
	}
		this.getBars = function (req, res) {
		if (!req.params.city) { 
           res.status(500); 
           res.send({"Error": "Looks like you are not filling the city to search."}); 
           console.log("Looks like you are not filling the city to search."); 
    	}
    	var options = {
			url: encodeURI("https://api.yelp.com/v3/businesses/search?location=" + req.params.city),
			headers: {
    		'Authorization': YELP_KEY
			},
			json: true
			//resolveWithFullResponse: true
		};
		var bars;
		rp(options).then(function(body){
			//console.log(JSON.stringify(body));
			bars= body.businesses.map(function(business){
				return processBar(business);
			});
			return bars;
		}).catch(function (err){
			console.log("Error getting bars for: "+JSON.stringify(options)+"error "+err);
		}).then(function(_bars){
			var promises=[];
			_bars.forEach(function(bar){
				//console.log("El bar "+bar.barId);
			//	promises.push(addComment(bar).then(addGoers(bar)));
				promises.push(addComment(bar).then(sleeper(500)).then(addGoers(bar)));
				
			});
			Promise.all(promises).then(function(bars){
				console.log("Largo bars: "+bars.length);
				req.session.lastSearch={"bars":bars,"lastSearch":req.params.city}
			//	console.log(bars);
				res.json(bars);
			});
		}).catch(function (err){
			console.log("Error segundo then: "+err);
		});
	};	
	function processBar(body){
		var bar=new Bar();
        bar.barId=body.id;
        bar.name=body.name;
        bar.imgUrl=body.image_url.replace("o.jpg","348s.jpg");
        bar.url=body.url;
        return bar;
	}
	function addComment(bar){
		return new Promise(function(resolve,reject){
			var options = {
				url: encodeURI("https://api.yelp.com/v3/businesses/"+bar.barId+"/reviews"),
				headers: {'Authorization': YELP_KEY},
				json: true
			};
			rp(options).then(function(body){
				//console.log("addComent "+JSON.stringify(body.reviews[0],null,2));
				if(body.reviews.length>0)
              		bar.comment=body.reviews[0].text;
              	else
              		console.log("Bar en promise: "+bar.barId);
              	resolve(bar);	
			})
    		.catch(function (err) {
		        console.log("Error getting comments for bar "+bar.barId+" Desc: "+err);
		        bar.comment="There are no comments for this business";	
		        resolve(bar);
		        // API call failed...
		 });
			
		});
		
	}
	function addGoers(bar){
		return new Promise(function(resolve,reject){
			Goer.findOne({"barId": bar.barId},function(err,result){
            	if(err){
              		console.log("Error cargango los goers "+err);
              		return reject(err);
              	}
              	if(result)
              		bar.going=result.goers.length;
              	else
              		bar.going=0;
              	resolve(bar);
				});
	});
	}
	function sleeper(ms) {
		console.log("Sleeep "+ms);
		return function(x) {
    		return new Promise(resolve => setTimeout(() => resolve(x), ms));
		};
	}
	function handleError(error){
		console.log("Error: "+error);
	}
	
	this.setGoing = function (req, res) {
		var _barId=req.body.barId;
		var _usrId=req.user.github.id;
		//var _usrId="batiar";
		
		console.log("Ïmplementar setGoing "+_barId);
		Goer.findOne({'barId':_barId},function(err,result){
			if (err) console.log("Error en setGoing "+err);
			if(!result){
				//no esta el bar en la base, agregarlo
				var goer=new Goer();
				goer.barId=_barId;
				goer.goers=[_usrId];
				goer.save(function (err){
					if (err)console.log("Error creando el goer "+err);
				res.json({"goers":1});
				});
			}else{
				//Encontre el bar en la base, tengo que buscar si mi user esta y agregarlo o sacarlo
				console.log("Encontre el id del bar "+_barId);
				var index=result.goers.indexOf(_usrId);
				if(index===-1){
					//mi usuario no esta, agregarlo
					console.log("Mi usuario no esta, lo agrego");
					result.goers.push(_usrId);
				}
				else{
					console.log("Mi usuario esta, lo saco");
					result.goers.splice(index,1);
				}
				result.save(function(err){
					if(err)console.log("Error salvando");
				});
				res.json({"goers":result.goers.length});
			}
			
		});
	//	res.json({"isGoing":1});

	};
	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};
	

}

module.exports = ClickHandler;
