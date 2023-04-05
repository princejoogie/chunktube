# conslusion.tech

```bash
ffmpeg -i input.mp4 -c copy -map 0 -segment_time 00:05:00 -f segment -reset_timestamps 1 output%03d.mp4
```
