import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS
app.use('*', cors())

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

function generateGameId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 5 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

app.post('/games/', async (c) => {
    console.log("POST /games route hit")
    const gameId = generateGameId()
    console.log(gameId)
    await c.env.GAMES.put(gameId, "")
    return c.json({ 'id': gameId })
})

app.get('/games/:gameId/phrase', async (c) => {
    const gameId = c.req.param('gameId')
    const phrases = await c.env.PHRASES.list({ "prefix": `${gameId}-` });
    const keys = phrases.keys;
    console.log(keys);
    if (keys.length === 0) {
        return c.text("Brainstorm and add some phrases to the game to get started! 💭");
    }

    let phrase = {
        'used': true,
        'phrase': ""
    };
    let phraseKey;
    while (phrase.used && keys.length >= 1) {
        const random = Math.floor(Math.random() * keys.length);
        phraseKey = keys[random].name;
        phrase = JSON.parse(await c.env.PHRASES.get(phraseKey));
        keys.splice(random, 1);
    }
    let body = "";
    if (keys.length === 0 && phrase.used) {
        body = "You've run out of phrases! Please add more";
    } else {
        body = phrase.phrase;  // This is now just the phrase text
        phrase.used = true;
        await c.env.PHRASES.put(phraseKey, JSON.stringify(phrase));
    }
    return c.text(body);  // Return just the text, not an object
})

app.get('/games/:gameId', async (c) => {
    const gameId = c.req.param('gameId')
    const game = await c.env.GAMES.get(gameId)
    if (game == null) {
        return c.text("No such game exists", 400)
    }
    return c.json(game)
})

app.post('/games/:gameId/phrase', async (c) => {
    const gameId = c.req.param('gameId')
    let phrase = await c.req.text()
    
    // Strip 'phrase=' prefix if it exists
    phrase = phrase.startsWith('phrase=') ? phrase.slice(7) : phrase
    
    console.log("Received phrase:", phrase)
    const phraseHash = await digestMessage(phrase)
    const phraseKey = gameId + '-' + phraseHash
    const phraseValue = JSON.stringify({
        'used': false,
        'phrase': phrase
    })
    console.log("Storing phrase value:", phraseValue)
    await c.env.PHRASES.put(phraseKey, phraseValue)
    return c.text('noiiiice!')
})

app.get('/', (c) => c.text('Hello worker!'))

app.all('*', (c) => {
    console.log("Catch-all route hit:", c.req.method, c.req.url)
    return c.text("Route not found", 404)
})

console.log("Routes registered:", app.routes)

export default app
