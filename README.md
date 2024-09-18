# Charades API

This is a simple API for managing a game of Charades using Cloudflare Workers and Hono.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your Cloudflare account:
   - Ensure you have a Cloudflare account and have set up Wrangler CLI.
   - Run `wrangler login` if you haven't already authenticated.

3. Create KV namespaces:
   ```
   wrangler kv:namespace create GAMES
   wrangler kv:namespace create PHRASES
   ```
   Add the returned namespace IDs to your `wrangler.toml` file.

## Development

To run the development server:
```
npm run dev
```

This will start a local server, typically at `http://127.0.0.1:8787`.

## Testing

Run the test suite:
```
npm test
```


## Deployment

To deploy to Cloudflare Workers:

```
npm run deploy
```


## API Endpoints

- `POST /games`: Create a new game
- `GET /games/:gameId`: Get game information
- `POST /games/:gameId/phrase`: Add a new phrase to the game
- `GET /games/:gameId/phrase`: Get a random unused phrase from the game

## Example Usage

Create a new game:

curl -X POST https://your-worker.your-subdomain.workers.dev/games


Add a phrase to a game:

```
curl -X POST https://your-worker.your-subdomain.workers.dev/games/[GAME_ID]/phrase -d "A new phrase"
```


Get a random phrase:
```
curl https://your-worker.your-subdomain.workers.dev/games/[GAME_ID]/phrase
```


## Notes

- Phrases are stored without the "phrase=" prefix. If sent with this prefix, it will be automatically stripped.
- The API uses Cloudflare KV for storage. Ensure your Worker has the necessary KV bindings.

