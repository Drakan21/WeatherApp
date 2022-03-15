
export default class CurrentLocation {
    constructor() {
        this._name = "Current Location";
        this._lat = null;
        this._lon = null;
        this._unit = "metric";
    }

    getName = () => {
        return this._name;
    }
    setName = (value) => {
      this._name = value;
    }
    getLatitude = () => { 
        return this._lat;
    }
    setLatitude = (value) => {
        this._lat = value;
    }
    getLongitude = () => {
        return this._lon;
    }
    setLongitude = (value) => {
        this._lon = value
    }
    getUnits = () => {
        return this._unit;
    }
    setUnits = (value) => {
        this._unit = value;
    }
    toggleUnits = () => {
        this._unit =  (this._unit === 'metric') ? 'imperial'  : 'metric';
    }
}