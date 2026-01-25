**中文介绍：[README.zh.md](README.zh.md)**

# Download Pictures and Videos from Bilibili Timeline
A Tampermonkey script to download pictures from Bilibili timeline. Also able to download videos from timeline and play page.
It could download Bilibili DASH video/audio streams in highest quality available and merges them into a single MP4 file **entirely in the browser** using ffmpeg.wasm.
The filenames could be modified as you like in the settings pannel.
Able to download from timeline one by one automatically.

## Download:
- Go to [Greasy Fork](https://greasyfork.org/zh-CN/scripts/421885).

Or
- Go to [Release Page](https://github.com/owendswang/Download-Pictures-from-Bilibili-Timeline/releases).

## Platform:
(Only listed those versions I tested. You could try it on other platforms by yourself.)
- **Tampermonkey** (tested on v5.1.0)
- Firefox (tested on v115.9.1esr 64-bit)
- Windows 7 SP1, Windows 11 23H2 (which I tested on)

## Installation:
Install from [Greasy Fork](https://greasyfork.org/zh-CN/scripts/421885).

Or Install manually:
1. Download the newest release ZIP file (from [here](https://github.com/owendswang/Download-Pictures-from-Bilibili-Timeline/releases)).
2. Open Tampermonkey. -> Switch to 'Utilities' tab. -> 'Zip' -> 'Import': Browse -> Choose the ZIP file -> 'Install'.

## Usage:
- If opened for the first time, the 'Settings Panel' would show up. Change the settings as you like or leave it there as default. Press 'OK' to save your settings.  
  (If the 'Enable video download' setting changed, the page would reload to make it effective.)  
![Screenshot](res/1.PNG?raw=true)
- The button to call out the settings panel and the button to auto download current timeline arge at the top-left corner on the webpage.  
![Screenshot](res/2.PNG?raw=true)
- It's better to uncheck this settings of the web browser. Otherwise, it would keep popping up for saving location.  
![Screenshot](res/7.png?raw=true)

## Screenshot:
![Screenshot](res/4.png?raw=true)  
![Screenshot](res/3.png?raw=true)  
![Screenshot](res/5.PNG?raw=true)  
![Screenshot](res/6.png?raw=true)  

## Special Thanks:
[SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

## Third-Party Licenses
This project uses the following third-party libraries:

### ffmpeg.wasm
- Package: [@ffmpeg/ffmpeg](https://www.jsdelivr.com/package/npm/@ffmpeg/ffmpeg)
- License: MIT
- Repository: [ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)

### FFmpeg WebAssembly Core
- Package: [@ffmpeg/core](https://www.jsdelivr.com/package/npm/@ffmpeg/core)
- License: GPL-2.0-or-later
- Description: WebAssembly build of the FFmpeg multimedia framework
- Original Project: [https://ffmpeg.org/](https://ffmpeg.org/)

The ffmpeg.wasm JavaScript wrapper is licensed under the MIT License.
The FFmpeg WebAssembly core is derived from the FFmpeg C codebase and
remains licensed under GPL-2.0-or-later, according to the upstream project.

This userscript does **not modify** FFmpeg or its WebAssembly binaries;
it only loads and invokes the upstream builds in the browser.

## License
This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
