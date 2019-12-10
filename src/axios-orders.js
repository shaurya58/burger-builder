import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://react-my-burger-8469f.firebaseio.com/'
});

export default instance;