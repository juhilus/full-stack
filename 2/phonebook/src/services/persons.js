import axios from 'axios'

const url = '/api/persons'

const getAll = () => {
    return axios
        .get(url)
        .then(response => response.data)
}

const create = (newPerson) => {
    return axios
        .post(url,newPerson)
        .then(response => response.data)
}

const remove = (id) => {
    return axios
        .delete(`${url}/${id}`)
        .then(response => response.data)
}

const update = (id, updatedPers) => {
    return axios
        .put(`${url}/${id}`,updatedPers)
        .then(response => response.data)
}

export default {getAll, create, remove, update}