import axios from axios;

import { API_MESSAGE,getAccessToken,SERVICE_URLS } from "./config";

const getType = (value, body) => {
    console.log(`Value ---> ${value}`)
    console.log(`body ---> ${body}`)
    if(value.params){
        return {params:body}
    }else if(value.query){
        if(typeof body=== 'object'){
            return {query:body.id}
        }
        return {query:body}
    }
    return {}
}

