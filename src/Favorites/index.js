import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
const proxy = "https://cors-anywhere.herokuapp.com/"
const urlWeather = `https://www.metaweather.com/api/location/`
class Favorites extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            modal: false,
            location: null,
            title: '',
            weather: []
        }
        this.toggle = this.toggle.bind(this);
        this.fetchData = this.fetchData.bind(this);

    }

    componentDidMount = async () => {
        this.hydrateStateWithLocalStorage();

        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
        this.saveStateToLocalStorage();
    }

    hydrateStateWithLocalStorage() {
        for (let key in this.state) {
            if (localStorage.hasOwnProperty(key)) {
                let value = localStorage.getItem(key);

                try {
                    value = JSON.parse(value);
                    this.setState({ [key]: value });
                } catch (e) {
                    this.setState({ [key]: value });
                }
            }
        }
    }
    saveStateToLocalStorage() {
        for (let key in this.state) {
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }

    updateInput(key, value) {
        this.setState({ [key]: value });
    }

    deleteItem(ser) {
        const list = [...this.state.list];
        const updatedList = list.filter(item => item !== ser);
        this.setState({ list: updatedList });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    async fetchData(data) {
        const response = await fetch(proxy + urlWeather + data.woeid)
        const weatherJson = await response.json()
        await this.setState({
            modal: !this.state.modal,
            title: data.title,
            location: data.woeid,
            weather: weatherJson.consolidated_weather
        });
    }

    render() {
        var d = new Date();
        var curr_date = d.getDate().length > 1 ? d.getDate() : '0' + d.getDate();
        var curr_month = d.getMonth() + 1;
        var curr_year = d.getFullYear();
        var fulldata = curr_year + "-" + curr_month + "-" + curr_date

        var tomorrow = new Date();
        var dayTomorrow = tomorrow.getDate() + 1
        var changetom = dayTomorrow.length > 1 ? dayTomorrow : '0' + dayTomorrow
        var monthTomorrow = tomorrow.getMonth() + 1;
        var yearTomorrow = tomorrow.getFullYear();
        var tommorrowFull = yearTomorrow + '-' + monthTomorrow + '-' + changetom
        return (
            <div align='center'>
                <div className='row'>
                    {this.state.list.map(item => (
                        <div className='col-4 mt-5' list={item} key={item.woeid}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p>Чтобы узнать погоду на ближайшие 5 дней, нажмите "Погода"</p>                                    
                                    <button href="#" className="btn btn-danger" onClick={this.deleteItem.bind(this, item)}>Удалить</button>
                                    <button type="button" className="btn btn-info" onClick={() => this.fetchData(item)} >Погода</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Modal size='lg' isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Погода в {this.state.title}</ModalHeader>
                    <div className='row'>
                        {this.state.weather.map((item) => (
                            <ModalBody key={item.id}>
                                <div className='row'>
                                    <div className='col'>
                                        {<span>{item.applicable_date === fulldata ? 'Сегодня' : item.applicable_date === tommorrowFull ? 'Завтра' : item.applicable_date}</span>}

                                        <div>
                                            <img width='40' height='40' src={`https://www.metaweather.com/static/img/weather/${item.weather_state_abbr}.svg`}></img>
                                        </div>
                                        <span>
                                            {item.weather_state_name}
                                        </span>
                                        <div>
                                            Max: {Math.round(item.max_temp)}
                                            <span>&#176; C</span>
                                        </div>
                                        <div>

                                            Min: {Math.round(item.min_temp)}
                                            <span>&#176; C</span>
                                        </div>
                                        <div>
                                            {Math.round(item.wind_speed)}mph
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        ))}
                    </div>
                    <ModalFooter>
                        <button className="btn btn-primary" color="primary" onClick={this.toggle}>ОК</button>
                    </ModalFooter>
                </Modal>
            </div>

        )
    }
}



export default Favorites

