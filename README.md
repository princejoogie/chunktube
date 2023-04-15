# ChunkTube

It's YouTube.. but text.

https://user-images.githubusercontent.com/47204120/230472750-37b8fbe6-dada-43a5-986a-cb6e3988f993.mp4

## Usage

```bash
# install dependencies
yarn install

# copy and modify `.env`
cp .env.example .env

# (OPTIONAL) if you want to run database locally with docker
# open another terminal and run
docker compose up database

# start web and server
# open another terminal and run
yarn with-env yarn dev

# this mirrors your localhost so clerk can access it
# copy ngrok url to your clerk webhooks
# <ngrok_url>/api/hooks/clerk
# open another terminal and run
ngrok http 3000

```

---

Made with ☕ by Prince Carlo Juguilon
