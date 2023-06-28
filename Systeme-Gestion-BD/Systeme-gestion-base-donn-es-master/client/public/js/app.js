const API_BASE_URL = "http://localhost:3000"

const { pathname } = window.location

const urlSearchParams = new URLSearchParams(window.location.search);
const queryString = Object.fromEntries(urlSearchParams.entries());



function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

async function initDatabases(){
    const json = await getDatabases()
    databasesMenuComponent(json)
}

async function createDatabase() {
    const databaseName = document.getElementById('IdDatabaseName')
    const res = await fetch(`${API_BASE_URL}/database/create`, {
        method : 'POST',
        body : JSON.stringify({ databaseName : databaseName.value })
    })
    databaseName.value = ''
    const { error, message } = await res.json()
    if (error) {
        return alert(message)
    }

    const json = await getDatabases()
    databasesMenuComponent(json)
}

async function deleteDatabase(databaseName) {
    const res = await fetch(`${API_BASE_URL}/database/delete?databaseName=${databaseName}`, {
        method : 'DELETE'
    })
    const { error, message } = await res.json()
    if (error) {
        return alert(message)
    }
    const json = await getDatabases()
    databasesMenuComponent(json)
    if (databaseName == queryString.databaseName) {
        location.href = '/'
    }
}

async function getDatabases() {
    try {
        const res = await fetch(`${API_BASE_URL}/databases`, {
            method : 'GET'
        })
        
        const json = await res.json()
    
        return json; 
    } catch (error) {
        location.href='/serverDown'
    }
    
}

async function databasesMenuComponent(json) {
    
    const { data, error, message } = json

    if (error) {
        return alert(message)
    }

    const databasesMenuContainer = document.getElementById('IdDatabasesMenuContainer')
    databasesMenuContainer.innerHTML = ""
    data.forEach(async databaseName => {
        const db = await databaseItemComponent(databaseName) 
        databasesMenuContainer.append(db)
    });
    
}

async function databaseItemComponent(databaseName){
    const newLi = document.createElement('li')
    newLi.innerHTML =   `<div class="flex items-center justify-between ${queryString.databaseName == databaseName ? '' : 'hover:'}bg-gray-500 py-1 px-2">
                            <a href="/database?databaseName=${databaseName}" class="flex space-x-2 items-center w-full ">
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                </svg>
                                <span>
                                    ${databaseName}
                                </span>
                            </a>
                            <button onClick="deleteDatabase('${databaseName}')"
                                class="bg-red-400 p-0.5 rounded hover:bg-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>`
                        if (queryString.databaseName == databaseName) {
                            const res = await fetch(`${API_BASE_URL}/database/tables?databaseName=${databaseName}`, {
                                method : 'GET'
                            })
                            const { data } = await res.json()
                            const tableItem = document.createElement('div')
                            tableItem.classList.add('flex', 'flex-col', 'pl-4', 'my-2', 'space-y-2')
                            data.forEach(table => {
                                const div = document.createElement('div')
                                div.classList.add('pl-4', 'my-2', 'space-y-2')

                                div.innerHTML = `<a href="/table?databaseName=${databaseName}&tableName=${table.name}" class="flex space-x-2 items-center w-full ${table.name == queryString.tableName ? 'font-bold text-blue-600' : ''} ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                                                    </svg>
                                                                            
                                                    <span class=" ">
                                                        ${table.name}
                                                    </span>
                                                </a>`
                                tableItem.append(div)
                            });
                            newLi.innerHTML += tableItem.innerHTML; 
                        }
    return newLi;
}

initDatabases()
