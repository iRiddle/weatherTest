import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
const proxy = "https://cors-anywhere.herokuapp.com/"
const url = `https://www.metaweather.com/api/location/search/?query=`

const urlWeather = `https://www.metaweather.com/api/location/`
class ListOfCapitals extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            value: '',
            list: [],
            modal: false,
            location: null,
            title: '',
            weather: []
        }
        this.fetchData = this.fetchData.bind(this);
        this.toggle = this.toggle.bind(this);

    }
    componentDidMount = async () => {
        try {
            this.hydrateStateWithLocalStorage();

            // add event listener to save state to localStorage
            // when user leaves/refreshes the page
            window.addEventListener(
                "beforeunload",
                this.saveStateToLocalStorage.bind(this)
            );
            const response = await fetch(proxy + url)
            const data = await response.json()
            this.setState({ data })
        }
        catch {
            console.log('По указанному маршруту нет данных')
        }
    }

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        // saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    }

    componentDidUpdate = async () => {
        try {
            var path = this.state.value
            const response = await fetch(proxy + url + path)
            const dataUpdated = await response.json()
            this.setState({
                data: dataUpdated
            })
            return
        }
        catch { }
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

    addItem(item) {
        const list = this.state.list
        var trigger = list.every(function (element, index) {
            return element.woeid != item.woeid
        })

        console.log(trigger)

        if (trigger) {
            list.push(item)
            this.setState({
                list: list
            })
        } else {
            alert('уже существует')
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
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

    toggle() {
        this.setState({
            modal: !this.state.modal,
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
                    <div className='col'>
                        <input className="form-control"
                            type="search"
                            placeholder="Найти"
                            aria-label="Search"
                            value={this.props.value}
                            onChange={this.handleChange.bind(this)}
                        >
                        </input>
                    </div>
                </div>
                <div className='row'>
                    {this.state.data.map(item => (
                        <div className='col-4 mt-5' data={item} key={item.woeid}>
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">{item.title} - {item.location_type}</h4>
                                    <div className='row' >
                                        <p>Чтобы узнать погоду на ближайшие 5 дней, нажмите "Погода"</p>
                                        <div className='col'>
                                            <button className="btn btn-primary" onClick={this.addItem.bind(this, item)}>Добавить в избранное</button>
                                        </div>
                                        <div className='col'>
                                            <button type="button" className="btn btn-info" onClick={() => this.fetchData(item)} >Погода</button>
                                        </div>
                                    </div>
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



export default ListOfCapitals