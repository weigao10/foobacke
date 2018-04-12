import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
// import AnyComponent from './components/filename.jsx'
import Search from './Search.jsx'
import Results from './Results.jsx'

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      cities: [],
      haveWeatherData: false
    }    
    this.getCities = this.getCities.bind(this);
  }

  componentDidMount() {
    this.getCities({});
  }

  componentDidUpdate() {
    this.getWeather();
  }
  
  // getCities will return the cities that match the query string
  getCities(state) {    
    console.log('Sending GET request to /cities', state)
    axios.get('/cities', {
      params: state
    })
      .then( (results) => {
        console.log('Received results from GET/cities: ', results);
        this.setState({
          cities: results.data
        })      
      }) 
      .catch( (error) => {
        console.log('Error in response to GET /cities: ', error);
      })
  }

  getWeather() {
    var cities = this.state.cities;

    var cityIDs = [];
    for (var city of cities) {
      cityIDs.push(city.yahoo_weather_id);
    }
    
    var options = {
      method: 'GET',
      url: '/weather',
      params: {
        cityIDs: cityIDs
      }
    }

    axios(options).then(weatherData => {
      console.log(weatherData)
    }).catch(err => {
      console.log(err);
    });
  }

  render () {
  	return (
      <div className="app">
        <header className="navbar"><h1>City Finder</h1></header>         
        <div className="main columns">
          <div className="column is-one-quarter"><Search getCities={this.getCities}/></div>
          <div className="column is-three-quarters"><Results cities={this.state.cities}/></div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));