import axios from "axios";

const BASEURL = 'https://api.quickthink.online/api/'

export default axios.create({
    baseURL: BASEURL,
    headers: {
        "Content-Type": "application/json",
    }
})

