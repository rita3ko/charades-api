const Router = require('./router')

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})


async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }
  

function parseGameId(url) {
    url = new URL(url)
    const regex = /\/games\/(.*)\//gm
    gameId = regex.exec(url.pathname)
    if (gameId !== null) {
        gameId = gameId[1]
    }
    return gameId
}

async function getGame(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
        status: 200
    }
    let body

    gameId = parseGameId(request.url)
    let game = await GAMES.get(gameId)
    if(game == null) {
        body = "No such game exists"
        init.status = 400
    }
    else {
        body = JSON.stringify(game)
    }

    return new Response(body, init)
}

function generateGameId() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

async function createGame() {
    const init = {
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        status: 200,
        statusText: 'ok'
    }

    let gameId = generateGameId()
    console.log(gameId)
    await GAMES.put(gameId, "")
    let body = {
        'id': gameId
    }
    return new Response(JSON.stringify(body), init)
}

async function addPhrase(request) {
    const init = {
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200
    }
    let gameId = parseGameId(request.url)
    let phrase = await request.text()
    phrase = phrase.split('=')[1]
    let phraseHash = await digestMessage(phrase)
    let phraseKey = gameId + '-' + phraseHash
    let phraseValue = {
        'used': false,
        'phrase': phrase
    }
    console.log(phrase)
    console.log(phraseValue)
    phraseValue = JSON.stringify(phraseValue)
    let result = await PHRASES.put(phraseKey, phraseValue)
    return new Response('noiiiice!', init)
}

async function getPhrase(request) {
    const init = {
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200
    }
    // Get the game ID
    let gameId = parseGameId(request.url)

    // Get all possible phrases for the game
    let phrases = await PHRASES.list({"prefix": `${gameId}-`})
    phrases = phrases.keys
    console.log(phrases)
    let numKeys = phrases.length
    if(numKeys == 0) {
        return new Response("Brainstorm and add some phrases to the game to get started! 💭", init)
    }

    let phrase = {
        'used': true,
        'phrase': ""
    }
    let phraseKey
    while(phrase.used && phrases.length >= 1) {
        let random = Math.floor(Math.random() * (phrases.length - 1))
        phraseKey = phrases[random]
        phrase = await PHRASES.get(phraseKey.name)
        phrase = JSON.parse(phrase)
        phrases.splice(random, 1)
    }
    let body = ""
    // If we ran out, warn to put more keys in
    if (phrases.length = 1 && phrase.used) {
        body = "You've run out of phrases! Please add more"
    }
    else {
        body = phrase.phrase
        phrase.used = true
        await PHRASES.put(phraseKey.name, JSON.stringify(phrase))
    }
    return new Response(body, init)
}



async function handleRequest(request) {
    const r = new Router()
    // Replace with the approriate paths and handlers
    r.post('.*/games', () => createGame())
    r.get('.*/games/.*/phrase', (request) => getPhrase(request))
    r.get('/games/.*', (request) =>  getGame(request))
    r.post('.*/games/.*/phrase', (request) => addPhrase(request))

    r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
