import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL:"https://realtime-database-30d51-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const messageEl = document.getElementById("message-el")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const publishEl = document.getElementById("publish-el")
const endorsementList = document.getElementById("endorsement-list")

publishEl.addEventListener("click", function() { //push input values into the database
    let messageValue = messageEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value    
    let endorsementFull = {
        "from": fromValue,
        "message": messageValue,
        "to": toValue
    }
    push(endorsementListInDB, endorsementFull)
    clearMessageField()
})

onValue(endorsementListInDB, function(snapshot){
    
    if (snapshot.exists()) {
        let endorsementArray = Object.entries(snapshot.val())
        
        clearEndorsementList()
        
        for (let i = 0; i < endorsementArray.length; i++) {
            let currentEndorsement = endorsementArray[i]
            let currentEndorsementID = endorsementArray[0].key
            let currentEndorsementFrom = endorsementArray[1].from
            let currentEndorsementMessage = endorsementArray[1].message
            let currentEndorsementTo = endorsementArray[1].to
            
            appendMessageToEndorsementList(currentEndorsement)
        }
    } else {
        endorsementList.innerHTML = "No endorsement here yet..."
    }
})

function clearMessageField() {
    messageEl.value = ""
}

function clearEndorsementList() {
    endorsementList.innerHTML = ""
}

function appendMessageToEndorsementList(endorsement) {
    let endorsementID = endorsement[0].key
    let endorsementFrom = endorsement[1].from
    let endorsementMessage = endorsement[1].message
    let endorsementTo = endorsement[1].to
    
    let newEl = document.createElement("li")
    newEl.innerHTML = `<b>From: ${endorsementFrom}</b><br><br>${endorsementMessage}<br><br><b>To: ${endorsementTo}</b>`
    
    endorsementList.append(newEl)
}