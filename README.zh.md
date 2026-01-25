English Version: [README.md](README.md)

# 从“Bilibili动态”页面下载图片和视频
用于从“BiliBili动态”时间线页面上下载图片的Tampermonkey脚本，也可以在时间线和播放页面下载视频。
下载视频时，可下载最高质量的视频和音频分轨，并通过ffmpeg.wasm**完全在浏览器**中合并为单个MP4文件。
可以在设置窗口里自定义下载的文件名。
可以自动连续下载时间线动态中的图片和视频。

## 下载:
- 前往[Greasy Fork](https://greasyfork.org/zh-CN/scripts/421885)。
- 或前往[发布页面](https://github.com/owendswang/Download-Pictures-from-Bilibili-Timeline/releases)。

## 使用平台：
（仅列出了我测试并使用的平台版本。）
- **Tampermonkey** (测试于v5.4.1)
- Firefox (测试于v147.0.1 64-bit)
- Windows 10 22H2，Windows 11 23H2 (我测试用的版本)

## 安装方法:
从[Greasy Fork](https://greasyfork.org/zh-CN/scripts/421885)直接安装。

或手动安装：
1. 下载最新的ZIP包 (从[这里](https://github.com/owendswang/Download-Pictures-from-Bilibili-Timeline/releases)下载).
2. 打开Tampermonkey -> 切换至'实用工具'选项卡. -> 选择'压缩包' -> '导入': 浏览 -> 选择刚下载的ZIP文件 -> 选择'安装'。

## 使用方法：
- 第一次使用本脚本，会自动弹出设置页面，修改或维持默认设置，点击确认保存设置即可。  
  （如果改变了“开启视频下载”功能，会在保存设置时，自动刷新页面。）  
![截图](res/1.PNG?raw=true)
- “设置”按钮和“下载当前瀑布流”按钮在页面左上角。  
![截图](res/2.PNG?raw=true)
- 最好关闭浏览器设置中的这个选项，不然下载多文件时，会不停弹出保存位置窗口。  
![截图](res/7.png?raw=true)

## 页面截图:
![截图](res/4.png?raw=true)  
![截图](res/3.png?raw=true)  
![截图](res/5.PNG?raw=true)  
![截图](res/6.png?raw=true)

## 特别鸣谢：
[SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

## 第三方许可证
本项目使用了以下第三方库：

### ffmpeg.wasm
- 包名：[@ffmpeg/ffmpeg](https://www.jsdelivr.com/package/npm/@ffmpeg/ffmpeg)
- 许可证：MIT
- 仓库：[ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)

### FFmpeg WebAssembly 核心
- 包名：[@ffmpeg/core](https://www.jsdelivr.com/package/npm/@ffmpeg/core)
- 许可证：GPL-2.0-or-later
- 描述：FFmpeg 多媒体框架的 WebAssembly 构建版本
- 原始项目：[https://ffmpeg.org/](https://ffmpeg.org/)

ffmpeg.wasm 的 JavaScript 封装部分采用 MIT 许可证发布。
FFmpeg WebAssembly 核心源自 FFmpeg 的 C 语言代码库，
并根据上游项目的规定继续采用 GPL-2.0-or-later 许可证。

本用户脚本 **未对** FFmpeg 或其 WebAssembly 二进制文件进行任何修改；
仅在浏览器中加载并调用上游提供的构建版本。

## 许可证
本项目采用 MIT 许可证发布。
详情请参阅 [LICENSE](LICENSE) 文件。
