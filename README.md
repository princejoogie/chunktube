# conclusion.tech

It's YouTube.. but text.

https://user-images.githubusercontent.com/47204120/230472750-37b8fbe6-dada-43a5-986a-cb6e3988f993.mp4

## Prerequisites

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - used to download audio
- [ffmpeg](https://github.com/FFmpeg/FFmpeg) - used to split audio into chunks and save them separately
- ffprobe - (comes with ffmpeg) used to get metadata from audio

## How it works

1. `yt-dlp` download the audio and saves it in a temporary directory
  ```bash
  yt-dlp -x --audio-quality 10 --audio-format mp3 --output extracted_audio
  ```

2. `ffmpeg` chops the audio into 5 minute chunks and saving them as well
  ```bash
  ffmpeg -i extracted_audio.mp3 -c copy -map 0 -segment_time 00:05:00 -f segment -reset_timestamps 1 output%03d.mp3
  ```

3. each chunk is then transcribed with [whisper](https://github.com/openai/whisper)
4. each transcription chunk is then summarized with [gpt-3.5](https://platform.openai.com/docs/models)

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
yarn dev

# this mirrors your localhost so clerk can access it
# copy ngrok url to your clerk webhooks
# <ngrok_url>/api/hooks/clerk
# open another terminal and run
ngrok http 3000

```

---

Made with ☕ by Prince Carlo Juguilon
