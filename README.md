# conslusion.tech

## prerequisites

- yt-dlp
- ffmpeg

```bash
ffmpeg -i extracted_audio.mp3 -c copy -map 0 -segment_time 00:05:00 -f segment -reset_timestamps 1 output%03d.mp3
yt-dlp -x --audio-quality 10 --audio-format mp3 --output extracted_audio
```

"packageManager": "pnpm@8.1.0"
