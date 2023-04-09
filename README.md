# conclusion.tech

under 🚧

https://user-images.githubusercontent.com/47204120/230472750-37b8fbe6-dada-43a5-986a-cb6e3988f993.mp4

## prerequisites

- yt-dlp
- ffmpeg, ffprobe

```bash
# this downloads the audio in mp3 format
yt-dlp -x --audio-quality 10 --audio-format mp3 --output extracted_audio

# this is what chops the audio into 5 min chunks
ffmpeg -i extracted_audio.mp3 -c copy -map 0 -segment_time 00:05:00 -f segment -reset_timestamps 1 output%03d.mp3
```

```bash
# building the server docker image
docker build -t conclusion-server -f ./Dockerfile.server .
docker run -p 4000:4000 -e DATABASE_URL=your_database_url -e OPENAI_API_KEY=your_api_key conclusion-server
```

---

Made with ☕ by Prince Carlo Juguilon
