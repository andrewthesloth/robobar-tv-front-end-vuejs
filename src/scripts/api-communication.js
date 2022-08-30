export async function getDrinkTypesFromApi() {
    return fetch("http://127.0.0.1:5000/DrinkTypes/")
        .then(response => response.json())
        .then(data =>{return data});
}

export async function getCurrentPlcTimeFromApi() {
    return fetch("http://127.0.0.1:5000/PlcCurrentTime/")
        .then(response => response.json())
        .then(data =>{return data});
}

export async function getQueueStateFromApi() {
    return fetch("http://127.0.0.1:5000/QueueState/")
        .then(response => response.json())
        .then(data =>{return data});
}

export async function getDrinkInProgressFromApi(side) {
    return fetch(`http://127.0.0.1:5000/DrinkInProgress/${side}`)
        .then(response => response.json())
        .then(data =>{return data});
}

export async function getPickUpDrinksStateFromApi() {
    return fetch("http://127.0.0.1:5000/PickUpDrinksState/")
        .then(response => response.json())
        .then(data =>{return data});
}
