import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:9091"
});

localStorage.getItem('token') &&  (instance.defaults.headers.common['Authorization']
    = `Bearer ${localStorage.getItem('token')}`);


export default instance;