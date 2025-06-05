// ==UserScript==
// @name         Bilibili Download Pictures
// @name:zh-CN   下载Bilibili动态页面图片
// @version      1.1.1
// @description  Download pictures from bilibili timeline and 720P videos.
// @description:zh-CN 下载“Bilibili动态”时间线页面的图片，也可下载视频（720P单文件）
// @author       OWENDSWANG
// @icon         https://avatars.githubusercontent.com/u/9076865?s=40&v=4
// @license      MIT
// @homepage     https://greasyfork.org/scripts/421885
// @supportURL   https://github.com/owendswang/Download-Pictures-from-Bilibili-Timeline/issues
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*/dynamic*
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/v/topic/detail/?*
// @connect      bilibili.com
// @connect      bilivideo.com
// @connect      bilivideo.cn
// @connect      hdslb.com
// @connect      biliimg.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @namespace https://greasyfork.org/users/738244
// @downloadURL https://update.greasyfork.org/scripts/421885/Bilibili%20Download%20Pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/421885/Bilibili%20Download%20Pictures.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const settingVersion = 2;
    const downloadIcon = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHpSURBVDiNndS7a1RREMfxz9XVrI8UIkjwLxCipYVp9A+wEQsV8dFksLCwUATxAYqNIAhWO4UPsAqCCGqTQkRQULEMgojYCSK+X4nhWty7uCZ3k5gfnObMOd8zM2dmirIs9SozV+IxNmCJZk3jObZGxFSvodVweD024TMm+wDb2Iy1eDsfcCkKHMSdPsB9uFKf/UdNwK4mI+J3kyEzp5r26Z8jTa8v5N5cwEWpCdgYZh/NOtuCzGyrQiwx+B/Awcz8ovrE6Yj42crMcYyoSqRdr/nULd6X+IFfWJaZYy1cwhA24j5u1t4+mAN4D0cwhb21Q89wtSjLUmauxm1sw56IGFtIvJm5H9dxFzsj4lfR23qZeQ0HcDEijs4Du4zD6ETEoe5+0el0zuNnURTnRkdHZeYpnMUt7JrZq5k5oErLdhyPiAuZuQyn8XEJTuBMWZbLISLOqVprB55k5roe2BCe1rDdEXGhNq3CSRxrqX73U68XEXEjM99gHBOZuUVVs4+wAiMR8bjnSolv+NC3UyLiIYZVU+cFJvARwzNg/6gLLDVUfUS8UpXTw3ptjIjXDZzpmlF2p02BdmbOmn8R8V1VTiAzmybUQM0oik6n81WVl/f9wvC3M4o+9kI1bD+08A5r6rVYlapcf/0DW06ifC1dVCUAAAAASUVORK5CYII=\')';

    let notLoaded = true;
    let cardsTotal = 0;
    let skeletonsTotal = 0;

    let downloadQueueCard = document.createElement('div');
    downloadQueueCard.style.position = 'fixed';
    downloadQueueCard.style.bottom = '0.5rem';
    downloadQueueCard.style.left = '0.5rem';
    downloadQueueCard.style.maxHeight = '50vh';
    downloadQueueCard.style.overflowY = 'auto';
    downloadQueueCard.style.overflowX = 'hidden';
    downloadQueueCard.style.zIndex = '10';
    let downloadQueueTitle = document.createElement('div');
    downloadQueueTitle.textContent = '下载队列';
    downloadQueueTitle.style.fontSize = '0.8rem';
    downloadQueueTitle.style.color = 'gray';
    downloadQueueTitle.style.display = 'none';
    downloadQueueCard.appendChild(downloadQueueTitle);
    document.body.appendChild(downloadQueueCard);
    let progressBar = document.createElement('div');
    progressBar.style.height = '1.4rem';
    progressBar.style.width = '17rem';
    // progressBar.style.background = 'linear-gradient(to right, red 100%, transparent 100%)';
    progressBar.style.borderStyle = 'solid';
    progressBar.style.borderWidth = '0.1rem';
    progressBar.style.borderColor = 'grey';
    progressBar.style.borderRadius = '0.5rem';
    progressBar.style.boxSizing = 'content-box';
    progressBar.style.marginTop = '0.5rem';
    progressBar.style.marginRight = '1rem';
    progressBar.style.position = 'relative';
    let progressText = document.createElement('div');
    // progressText.textContent = 'test.test';
    progressText.style.mixBlendMode = 'screen';
    progressText.style.width = '100%';
    progressText.style.textAlign = 'center';
    progressText.style.color = 'orange';
    progressText.style.fontSize = '0.7rem';
    progressText.style.lineHeight = '1.4rem';
    progressText.style.overflow = 'hidden';
    progressBar.appendChild(progressText);
    let progressCloseBtn = document.createElement('button');
    progressCloseBtn.style.border = 'unset';
    progressCloseBtn.style.background = 'unset';
    progressCloseBtn.style.color = 'orange';
    progressCloseBtn.style.position = 'absolute';
    progressCloseBtn.style.right = '0.3rem';
    progressCloseBtn.style.top = '0.2rem';
    progressCloseBtn.style.fontSize = '1rem';
    progressCloseBtn.style.lineHeight = '1rem';
    progressCloseBtn.style.cursor = 'pointer';
    progressCloseBtn.textContent = '×';
    progressCloseBtn.title = '取消';
    progressCloseBtn.onmouseover = function(e){
        this.style.color = 'red';
    }
    progressCloseBtn.onmouseout = function(e){
        this.style.color = 'orange';
    }
    progressBar.appendChild(progressCloseBtn);
    // downloadQueueCard.appendChild(progressBar);

    function sleep(seconds) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    }

    function oXMLHttpRequest(url, type) {
        return new Promise(function(resolve, reject) {
            let oReq = new XMLHttpRequest();
            oReq.open("GET", url);
            oReq.withCredentials = true;
            oReq.responseType = type;
            oReq.onload = (e) => {
                // console.log(e);
                // console.log(oReq.response);
                resolve(oReq.response);
            };
            oReq.onerror = (e) => { console.log(e); alert('请求失败！'); resolve(null); };
            oReq.onabort = (e) => { console.log(e); alert('请求被中断！'); resolve(null); };
            oReq.ontimeout = (e) => { console.log(e); alert('请求超时！'); resolve(null); };
            oReq.send(null);
        });
    }

    /*function saveAs(blob, name) {
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        // console.log(link);
        link.click();
        const timeout = setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.parentNode.removeChild(link);
        }, 1000);
    }*/

    function downloadError(e, url, name, progress) {
        // console.log(e, url);
        /*GM_notification({
            title: 'Download error',
            text: 'Error: ' + e.error + '\nUrl: ' + url,
            silent: true,
            timeout: 3,
        });*/
        progress.style.background = 'red';
        progress.firstChild.textContent = (name.length > 10 ? (name.substring(0,10) + '...') : name) + ' [' + (e.error || 'Unknown') + ']';
        progress.firstChild.style.color = 'yellow';
        progress.firstChild.style.mixBlendMode = 'unset';
        let progressRetryBtn = document.createElement('button');
        progressRetryBtn.style.border = 'unset';
        progressRetryBtn.style.background = 'unset';
        progressRetryBtn.style.color = 'yellow';
        progressRetryBtn.style.position = 'absolute';
        progressRetryBtn.style.right = '1.2rem';
        progressRetryBtn.style.top = '0.05rem';
        progressRetryBtn.style.fontSize = '1rem';
        progressRetryBtn.style.lineHeight = '1rem';
        progressRetryBtn.style.cursor = 'pointer';
        progressRetryBtn.style.letterSpacing = '-0.2rem';
        progressRetryBtn.textContent = '⤤⤦';
        progressRetryBtn.title = '重试';
        progressRetryBtn.onmouseover = function(e){
            this.style.color = 'white';
        }
        progressRetryBtn.onmouseout = function(e){
            this.style.color = 'yellow';
        }
        progressRetryBtn.onclick = function(e) {
            this.parentNode.remove();
            downloadWrapper(url, name);
        }
        progress.insertBefore(progressRetryBtn, progress.lastChild);
        progress.lastChild.title = '关闭';
        progress.lastChild.style.color = 'yellow';
        progress.lastChild.onmouseover = function(e){
            this.style.color = 'white';
        };
        progress.lastChild.onmouseout = function(e){
            this.style.color = 'yellow';
        };
        progress.lastChild.onclick = function(e) {
            this.parentNode.remove();
            if(progress.parent.childElementCount == 1) progress.parent.firstChild.style.display = 'none';
        };
        // setTimeout(() => { progress.remove(); if(downloadQueueCard.childElementCount == 1) downloadQueueTitle.style.display = 'none'; }, 1000);
    }

    function downloadWrapper(url, name) {
        // console.log('downloadWrapper: ', url, name);
        downloadQueueTitle.style.display = 'block';
        let progress = downloadQueueCard.appendChild(progressBar.cloneNode(true));
        progress.firstChild.textContent = (name.length > 10 ? (name.substring(0,10) + '...') : name) + ' [0%]';
        return new Promise(function(resolve, reject) {
            const download = GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'blob',
                headers: {
                    Referer: location.protocol + '//' + location.hostname,
                    Origin: location.protocol + '//' + location.hostname,
                },
                onprogress: (e) => {
                    // e = { int done, finalUrl, bool lengthComputable, int loaded, int position, int readyState, response, str responseHeaders, responseText, responseXML, int status, statusText, int total, int totalSize }
                    const percent = e.done / e.total * 100;
                    progress.style.background = 'linear-gradient(to right, green ' + percent + '%, transparent ' + percent + '%)';
                    progress.firstChild.textContent = (name.length > 10 ? (name.substring(0,10) + '...') : name) + ' [' + percent.toFixed(0) + '%]';
                },
                onload: function({ response }) {
                    // console.log(response);
                    const timeout = setTimeout(() => {
                        progress.remove();
                        if(downloadQueueCard.childElementCount == 1) downloadQueueTitle.style.display = 'none';
                    }, 1000);
                    progress.lastChild.onclick = function(e) {
                        clearTimeout(timeout);
                        this.parentNode.remove();
                        if(downloadQueueCard.childElementCount == 1) downloadQueueTitle.style.display = 'none';
                    };
                    saveAs(response, name);
                    resolve(null);
                },
                onabort: function(e) { console.log(e); resolve(null); },
                onerror: function(e) { downloadError(e, url, name, progress); console.log(e); resolve(null); },
                ontimeout: function(e) { downloadError(e, url, name, progress); console.log(e); resolve(null); },
            });
            progress.lastChild.onclick = function(e) {
                download.abort();
                this.parentNode.remove();
                if(downloadQueueCard.childElementCount == 1) downloadQueueTitle.style.display = 'none';
            };
        });
    }

    /*function getCookie(name) {
        return new Promise(function(resolve, reject) {
            GM_cookie.list({ name: name }, function(cookies, error) {
                if (!error) {
                    // console.log(cookies);
                    resolve(cookies[0].value);
                } else {
                    console.error(error);
                }
            });
        });
    }

    function getAllCookies() {
        return new Promise(function(resolve, reject) {
            GM_cookie.list({}, function(cookies, error) {
                if (!error) {
                    // console.log(cookies);
                    const cookiesStr = cookies.map((ele) => { return ele.name + '=' + ele.value }).join('; ');
                    // console.log(cookiesStr);
                    resolve(cookiesStr);
                } else {
                    console.error(error);
                    resolve(null);
                }
            });
        });
    }

    function download2Blob(url) {
        // console.log('download2Blob: ', url);
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'blob',
                headers: {
                    Referer: location.protocol + '//' + location.hostname,
                    Origin: location.protocol + '//' + location.hostname,
                },
                onload: function({ response }) {
                    // console.log(response);
                    // saveAs(response, name);
                    resolve(response);
                },
                onabort: function(e) { console.log(e); alert('请求被中断！'); resolve(null); },
                onerror: function(e) { console.log(e); alert('请求失败！'); resolve(null); },
                ontimeout: function(e) { console.log(e); alert('下载超时！'); resolve(null); },
            });
        });
    }*/

    function getPicName(nameSetting, originalName, index, data) {
        const card = JSON.parse(data.card.card);
        let setName = nameSetting;
        setName = setName.replace('{original}', originalName.split('.')[0]);
        setName = setName.replace('{ext}', originalName.split('.')[1]);
        const userName = card.user?.name || data.card.desc.user_profile.info.uname;
        const userId = card.user?.uid || data.card.desc.user_profile.info.uid;
        const dynamicId = data.card.desc.dynamic_id || parseInt(data.card.desc.dynamic_id_str, 10);
        const content = card.item?.description || card.title;
        setName = setName.replace('{username}', userName);
        setName = setName.replace('{userid}', userId);
        setName = setName.replace('{dynamicid}', dynamicId);
        setName = setName.replace('{index}', index);
        setName = setName.replace('{content}', content.substring(0, 25));
        let YYYY, MM, DD, HH, mm, ss;
        const postAt = new Date((card.item?.upload_time || data.card.desc.timestamp) * 1000);
        YYYY = postAt.getFullYear().toString();
        MM = (postAt.getMonth() + 1).toString().padStart(2, '0');
        DD = postAt.getDate().toString().padStart(2, '0');
        HH = postAt.getHours().toString().padStart(2, '0');
        mm = postAt.getMinutes().toString().padStart(2, '0');
        ss = postAt.getSeconds().toString().padStart(2, '0');
        setName = setName.replace('{YYYY}', YYYY);
        setName = setName.replace('{MM}', MM);
        setName = setName.replace('{DD}', DD);
        setName = setName.replace('{HH}', HH);
        setName = setName.replace('{mm}', mm);
        setName = setName.replace('{ss}', ss);
        /*if (retweetPostId && GM_getValue('retweetMode', false)) {
            setName = setName.replace('{re.mblogid}', retweetPostId);
            setName = setName.replace('{re.username}', retweetUserName);
            setName = setName.replace('{re.userid}', retweetUserId);
            setName = setName.replace('{re.uid}', retweetPostUid);
            setName = setName.replace('{re.content}', retweetContent.substring(0, 25));
            let reYYYY, reMM, reDD, reHH, remm, ress;
            const retweetPostAt = new Date(retweetPostTime);
            if (retweetPostTime) {
                reYYYY = retweetPostAt.getFullYear().toString();
                reMM = (retweetPostAt.getMonth() + 1).toString().padStart(2, '0');
                reDD = retweetPostAt.getDate().toString().padStart(2, '0');
                reHH = retweetPostAt.getHours().toString().padStart(2, '0');
                remm = retweetPostAt.getMinutes().toString().padStart(2, '0');
                ress = retweetPostAt.getSeconds().toString().padStart(2, '0');
            }
            setName = setName.replace('{re.YYYY}', reYYYY);
            setName = setName.replace('{re.MM}', reMM);
            setName = setName.replace('{re.DD}', reDD);
            setName = setName.replace('{re.HH}', reHH);
            setName = setName.replace('{re.mm}', remm);
            setName = setName.replace('{re.ss}', ress);
        }*/
        return setName.replace(/[<|>|*|"|\/|\\|\||:|?|\n]/g, '_');
    }

    function getVidName(nameSetting, originalName, data) {
        let setName = nameSetting;
        setName = setName.replace('{original}', originalName.split('.')[0]);
        setName = setName.replace('{ext}', originalName.split('.')[1]);
        const bvid = data.bvid;
        const aid = data.aid;
        const cid = data.cid;
        const title = data.title;
        const content = data.desc;
        const userName = data.owner.name;
        const userId = data.owner.mid;
        setName = setName.replace('{bvid}', bvid);
        setName = setName.replace('{aid}', aid);
        setName = setName.replace('{cid}', cid);
        setName = setName.replace('{title}', title);
        setName = setName.replace('{content}', content.substring(0, 25));
        setName = setName.replace('{username}', userName);
        setName = setName.replace('{userid}', userId);
        let YYYY, MM, DD, HH, mm, ss;
        const postAt = new Date(data.ctime * 1000);
        YYYY = postAt.getFullYear().toString();
        MM = (postAt.getMonth() + 1).toString().padStart(2, '0');
        DD = postAt.getDate().toString().padStart(2, '0');
        HH = postAt.getHours().toString().padStart(2, '0');
        mm = postAt.getMinutes().toString().padStart(2, '0');
        ss = postAt.getSeconds().toString().padStart(2, '0');
        setName = setName.replace('{YYYY}', YYYY);
        setName = setName.replace('{MM}', MM);
        setName = setName.replace('{DD}', DD);
        setName = setName.replace('{HH}', HH);
        setName = setName.replace('{mm}', mm);
        setName = setName.replace('{ss}', ss);
        return setName.replace(/[<|>|*|"|\/|\\|\||:|?|\n]/g, '_');
    }

    async function handleImageDynamic(data) {
        const card = JSON.parse(data.card.card);
        const pictures = card.item.pictures;
        // console.log(pictures);
        if (Array.isArray(pictures)) {
            await Promise.all(pictures.map(function(picture, index) {
                // console.log(picture);
                const pictureUrl = picture.img_src;
                const originalName = pictureUrl.split('/')[pictureUrl.split('/').length - 1];
                const pictureName = getPicName(GM_getValue('dlPicName', '{original}.{ext}'), originalName, index + 1, data);
                /*GM_download({
                    url: pictureUrl,
                    name: pictureName,
                    onerror: function(e) { console.log(e); alert('下载失败！'); },
                    ontimeout: function(e) { console.log(e); alert('下载超时！'); },
                });*/
                return downloadWrapper(pictureUrl, pictureName);
            }));
        }
    }

    async function handleArticleDynamic(data) {
        const card = JSON.parse(data.card.card);
        const pictures = card.image_urls;
        // console.log(pictures);
        if (Array.isArray(pictures)) {
            await Promise.all(pictures.map(function(picture, index) {
                // console.log(picture);
                const pictureUrl = picture;
                const originalName = pictureUrl.split('/')[pictureUrl.split('/').length - 1];
                const pictureName = getPicName(GM_getValue('dlPicName', '{original}.{ext}'), originalName, index + 1, data);
                /*GM_download({
                    url: pictureUrl,
                    name: pictureName,
                    onerror: function(e) { console.log(e); alert('下载失败！'); },
                    ontimeout: function(e) { console.log(e); alert('下载超时！'); },
                });*/
                return downloadWrapper(pictureUrl, pictureName);
            }));
        }
    }

    function getVideoInfo(bvid) {
        // console.log('getVideoInfo');
        return oXMLHttpRequest('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid, 'json');
    }

    function getVideoDetail(aid, cid/*, cookies*/) {
        /*return new Promise(function(resolve, reject) {
            // console.log(aid, cid, cookies);
            GM_xmlhttpRequest({
                method: 'GET',
                // 1080p dash --> https://api.bilibili.com/x/player/playurl?avid=1551880723&cid=1473551215&qn=80&fnval=4048
                // 720p mp4 --> https://api.bilibili.com/x/player/playurl?avid=1551880723&cid=1473551215&qn=64
                url: 'https://api.bilibili.com/x/player/wbi/playurl?avid=' + aid.toString() + '&cid=' + cid.toString() + '&fnval=64',
                responseType: 'json',
                anonymous: true,
                cookie: cookies,
                onload: function({ response }) {
                    // console.log(response);
                    resolve(response);
                },
                onabort: function(e) { resolve(null); },
                onerror: function(e) { resolve(null); },
                ontimeout: function(e) { resolve(null); },
            });
        });*/
        return oXMLHttpRequest('https://api.bilibili.com/x/player/wbi/playurl?avid=' + aid.toString() + '&cid=' + cid.toString() + '&fnval=64', 'json');
    }

    async function downloadVideo(data) {
        const vidRes = await getVideoDetail(data.aid, data.cid/*, cookies*/);
        // console.log(vidRes);
        const vidUrl = vidRes.data.durl[0].url;
        // console.log(vidUrl);
        const originalName = vidUrl.split('?')[0].split('/')[vidUrl.split('?')[0].split('/').length - 1];
        const vidName = getVidName(GM_getValue('dlVidName', '{original}.{ext}'), originalName, data);
        // console.log(vidName);
        /*GM_download({
            url: vidUrl,
            name: vidName,
            headers: {
                Referer: 'https://www.bilibili.com',
                Origin: 'https://www.bilibili.com',
            },
            onerror: function(e) { console.log(e); },
            ontimeout: function(e) { console.log(e); },
        });
        const blob = await download2Blob(vidUrl);
        const url = URL.createObjectURL(blob);
        // console.log(url);
        GM_download({
            url: url,
            name: vidName,
            onerror: function(e) { console.log(e); alert('下载失败！'); },
            ontimeout: function(e) { console.log(e); alert('下载超时！'); },
        });
        saveAs(blob, vidName);*/
        await downloadWrapper(vidUrl, vidName);
    }

    async function handleVideoDownload(bvid) {
        const vidInfoRes = await getVideoInfo(bvid);
        // console.log(vidInfoRes);
        await downloadVideo(vidInfoRes.data);
    }

    async function handleVideoDynamic(data) {
        // console.log('handleVideoDynamic');
        // console.log(data);
        // const card = JSON.parse(data.card.card);
        // const aid = card.aid;
        // const cid = card.cid;
        // console.log(aid, cid);
        // const cookies = await getAllCookies();
        // const cookies = 'SESSDATA=' + await getCookie('SESSDATA');
        // console.log(cookies);
        // await downloadVideo(aid, cid);
        const bvid = data.card.desc.bvid;
        await handleVideoDownload(bvid);
    }

    function getDynamicDetail(dynId) {
        /*return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=' + dynId,
                responseType: 'json',
                onload: function({ response }) {
                    // console.log(response);
                    resolve(response);
                },
                onabort: function(e) { resolve(null); },
                onerror: function(e) { resolve(null); },
                ontimeout: function(e) { resolve(null); },
            });
        });*/
        return oXMLHttpRequest('https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=' + dynId, 'json');
        // return oXMLHttpRequest('https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=' + dynId, 'json');
    }

    async function handleDynamicDownload(dynId, downloadButton) {
        if (downloadButton) {
            downloadButton.textContent = '下载中……';
        }
        // console.log('handleDynamicDownload: ' + dynId);
        try {
            const dynRes = await getDynamicDetail(dynId);
            // console.log(dynRes.data);
            const card = JSON.parse(dynRes.data.card.card);
            switch(dynRes.data.card.desc.type) {
                case 1:
                    // 转发
                    break;
                case 2:
                    // 图片
                    // console.log('picture');
                    await handleImageDynamic(dynRes.data);
                    break;
                case 4:
                    // 文字
                    break;
                case 8:
                    // 视频
                    // console.log('video');
                    await handleVideoDynamic(dynRes.data);
                    break;
                case 64:
                    // 专栏
                    await handleArticleDynamic(dynRes.data);
                    break;
                case 256:
                    // 音频
                    break;
                default:
                    break;
            }
            if (downloadButton) {
                downloadButton.textContent = '已完成';
            }
            return true;
        } catch(e) {
            console.error(e);
            if (downloadButton) {
                downloadButton.textContent = '下载';
            }
            if (!listDownloading) alert('无法下载！');
            return false;
        }
    }

    function addOpusDownloadButton(card) {
        if(card.getElementsByClassName('download-button').length == 0) {
            // console.log(card);
            const buttonBar = card.getElementsByClassName('bili-tabs__nav__items')[0];
            let downloadButton = document.createElement('div');
            downloadButton.textContent = '下载';
            downloadButton.classList.add('bili-tabs__nav__item');
            downloadButton.addEventListener('click', async function(event) {
                const dynId = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                // console.log(dynId);
                await handleDynamicDownload(dynId, this);
                /*const content = document.body.querySelector('div.opus-module-content');
                const list = content.querySelectorAll('div.bili-album__preview__picture__img');
                // console.log(list);
                for (const item of list) {
                    let imgUrl = item.style.backgroundImage.split(/"|@/)[1] || item.querySelector('img').src.split('@')[0];
                    if (imgUrl.startsWith('//')) {
                        imgUrl = 'https:' + imgUrl;
                    }
                    const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                    // console.log(imgUrl);
                    // console.log(imgName);
                    GM_download(imgUrl, imgName);
                }
                const topAlbum = document.body.querySelector('div.opus-module-top__album');
                if (topAlbum) {
                    const topAlbumIndicatorList = topAlbum.querySelectorAll('div.horizontal-scroll-album__indicator > div > img');
                    const topAlbumList = topAlbum.querySelectorAll('div.horizontal-scroll-album__pic__img > img');
                    let topList = topAlbumList;
                    if (topAlbumIndicatorList.length > 0) topList = topAlbumIndicatorList;
                    for (const item of topList) {
                        let imgUrl = item.src.split(/@/)[0];
                        if (imgUrl.startsWith('//')) {
                            imgUrl = 'https:' + imgUrl;
                        }
                        const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                        // console.log(imgUrl);
                        // console.log(imgName);
                        GM_download(imgUrl, imgName);
                    }
                }*/
            });
            buttonBar.appendChild(downloadButton);
        }
    }

    function addDownloadButton(card) {
        // console.log('addDownloadButton');
        if(card.getElementsByClassName('download-button').length == 0) {
            if(card.getElementsByClassName('bili-dyn-item__footer').length > 0) {
                card.querySelectorAll('div.bili-dyn-item__footer > div.bili-dyn-item__action').forEach((ele) => { ele.style.marginRight = '48px'; });
                let buttonBar = card.getElementsByClassName('bili-dyn-item__footer')[0];
                let downloadButton = document.createElement('div');
                downloadButton.classList.add('bili-dyn-item__action');
                downloadButton.classList.add('download-button');
                let span = document.createElement('div');
                span.classList.add('bili-dyn-action');
                let icon = document.createElement('i');
                icon.style.width = '20px';
                icon.style.height = '20px';
                icon.style.transform = 'scale(0.8)';
                icon.style.backgroundImage = downloadIcon;
                icon.style.backgroundRepeat = 'no-repeat';
                icon.style.backgroundSize = '100% 100%';
                icon.style.backgroundPosition = 'center';
                let text = document.createElement('span');
                text.textContent = '下载';
                span.appendChild(icon);
                span.appendChild(text);
                downloadButton.appendChild(span);
                buttonBar.appendChild(downloadButton);
                downloadButton = buttonBar.getElementsByClassName('download-button')[0];
                downloadButton.addEventListener('mouseover', function(event) {
                    this.querySelector('i').style.backgroundImage = downloadIcon;
                    // console.log('over');
                });
                downloadButton.addEventListener('mouseout', function(event) {
                    this.querySelector('i').style.backgroundImage = downloadIcon;
                    // console.log('out');
                });
                downloadButton.addEventListener('click', async function(event) {
                    // console.log('click');
                    event.preventDefault();
                    const content = this.closest('div.bili-dyn-item__main');
                    // console.log(content);
                    const opusCard = content.querySelector('[dyn-id]');
                    // console.log(opusCard.getAttribute('dyn-id'));
                    const dynId = opusCard.getAttribute('dyn-id');
                    await handleDynamicDownload(dynId, this.querySelector('span'));
                    /*const list = content.querySelectorAll('div.bili-album__preview__picture,div.preview__picture__img.b-img');
                    // console.log(list);
                    if (list.length > 0) {
                        for (let j = 0; j < list.length; j++) {
                            let imgUrl;
                            if (list[j].querySelector('img')) {
                                imgUrl = list[j].querySelector('img').src.split(/@/)[0];
                            } else {
                                imgUrl = list[j].style.backgroundImage.split(/"|@/)[1];
                            }
                            // console.log(imgUrl);
                            if (imgUrl.startsWith('//')) {
                                imgUrl = 'https:' + imgUrl;
                            }
                            const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                            // console.log(imgName);
                            GM_download(imgUrl, imgName);
                        }
                    }*/
                });
            } else if(GM_getValue('enableVideoDownload', false) && card.getElementsByClassName('bili-tabs__nav__items').length > 0) {
                // console.log('add video dynamic download button');
                const buttonBar = card.getElementsByClassName('bili-tabs__nav__items')[0];
                let downloadButton = document.createElement('div');
                downloadButton.textContent = '下载';
                downloadButton.classList.add('bili-tabs__nav__item');
                downloadButton.addEventListener('click', async function(event) {
                    // console.log('click');
                    event.preventDefault();
                    const content = this.closest('div.card');
                    // console.log(content);
                    const opusCard = content.querySelector('[dyn-id]');
                    // console.log(opusCard.getAttribute('dyn-id'));
                    const dynId = opusCard.getAttribute('dyn-id');
                    await handleDynamicDownload(dynId, this);
                    /*const list = content.querySelectorAll('div.bili-album__preview__picture,div.preview__picture__img.b-img');
                    // console.log(list);
                    if (list.length > 0) {
                        for (let j = 0; j < list.length; j++) {
                            let imgUrl;
                            if (list[j].querySelector('img')) {
                                imgUrl = list[j].querySelector('img').src.split(/@/)[0];
                            } else {
                                imgUrl = list[j].style.backgroundImage.split(/"|@/)[1];
                            }
                            // console.log(imgUrl);
                            if (imgUrl.startsWith('//')) {
                                imgUrl = 'https:' + imgUrl;
                            }
                            const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                            // console.log(imgName);
                            GM_download(imgUrl, imgName);
                        }
                    }*/
                });
                buttonBar.appendChild(downloadButton);
            }
        }
    }

    function addPlayPageDownloadButton(buttonBar) {
        let buttonWrap = document.createElement('div');
        buttonWrap.className = 'toolbar-left-item-wrap';
        let button = document.createElement('div');
        button.className = 'video-toolbar-left-item download-button';
        let icon = document.createElement('i');
        icon.className = 'video-toolbar-item-icon';
        icon.style.width = '36px';
        icon.style.height = '36px';
        icon.style.backgroundImage = downloadIcon;
        icon.style.backgroundRepeat = 'no-repeat';
        icon.style.backgroundSize = '100% 100%';
        icon.style.backgroundPosition = 'center';
        let text = document.createElement('span');
        text.textContent = '下载';
        button.appendChild(icon);
        button.appendChild(text);
        buttonWrap.appendChild(button);
        buttonBar.appendChild(buttonWrap);
        button.addEventListener('click', async function(event) {
            // console.log('click');
            event.preventDefault();
            const bvid = window.location.pathname.match(/BV[a-z|A-Z|0-9]{10}/g)[0];
            // console.log(bvid);
            handleVideoDownload(bvid);
        });
    }

    function handleOpusCard(card) {
        // console.log('handleOpusCard');
         if (card.getElementsByClassName('bili-album').length > 0 || card.getElementsByClassName('horizontal-scroll-album').length > 0 || (GM_getValue('enableVideoDownload', false) && card.getElementsByClassName('bili-dyn-card-video').length > 0)) {
             addOpusDownloadButton(card);
         }
    }

    function handleCard(card) {
        // console.log('handleCard');
        if (card.getElementsByClassName('bili-album').length > 0 || card.getElementsByClassName('bili-dyn-gallery').length > 0) {
            // console.log('add download button');
            card.getElementsByClassName('bili-album__preview__picture__img').forEach((img) => {
                img.addEventListener('click', function(event) {
                    addDownloadButton(card);
                });
            });
            addDownloadButton(card);
        } else if (GM_getValue('enableVideoDownload', false) && card.getElementsByClassName('bili-dyn-card-video').length > 0 && card.getElementsByClassName('bili-dyn-action like disabled').length === 0) {
            addDownloadButton(card);
        }
    }

    function bodyMouseOver(event) {
        // console.log('bodyMouseOver');
        if (notLoaded) {
            // console.log('not loaded');
            if (document.body.querySelector('div.bili-dyn-list')) {
                // console.log('feed');
                const cards = document.body.querySelectorAll('div.bili-dyn-list div.bili-dyn-item');
                // console.log(cards.length);
                if (cards.length > cardsTotal) {
                    // console.log('cards');
                    cardsTotal = cards.length;
                    // console.log(cardsTotal);
                    for (let i = 0; i < cardsTotal; i++) {
                        // console.log('card');
                        handleCard(cards[i])
                        // startIndex += 1;
                    }
                    if (cardsTotal > 0) {
                        notLoaded = false;
                    }
                    // document.body.removeEventListener('mouseover', bodyMouseOver);
                }
            } else if (location.pathname.startsWith('/v/topic/detail') && document.body.querySelector('div.list-view.topic-list__flow-list')) {
                const cards = document.body.querySelectorAll('div.list-view.topic-list__flow-list div.bili-dyn-item');
                // console.log(cards.length);
                if (cards.length > cardsTotal) {
                    // console.log('cards');
                    cardsTotal = cards.length;
                    // console.log(cardsTotal);
                    for (let i = 0; i < cardsTotal; i++) {
                        // console.log('card');
                        handleCard(cards[i])
                        // startIndex += 1;
                    }
                    if (cardsTotal > 0) {
                        notLoaded = false;
                    }
                    document.body.removeEventListener('mouseover', bodyMouseOver);
                }
            } else if(document.body.querySelector('div.bili-dyn-item')) {
                // console.log('found single card');
                const card = document.body.querySelector('div.bili-dyn-item');
                if (card) {
                    handleCard(card);
                    notLoaded = false;
                    // document.body.removeEventListener('mouseover', bodyMouseOver);
                }
            } else if (document.body.querySelector('div.opus-detail')) {
                // console.log('found single opus card');
                const card = document.body.querySelector('div.opus-detail');
                if (card) {
                    handleOpusCard(card);
                    notLoaded = false;
                    // document.body.removeEventListener('mouseover', bodyMouseOver);
                }
            } /* else if (GM_getValue('enableVideoDownload', false) && document.body.querySelector('div.video-toolbar-left-main')) {
                const buttonBar = document.body.querySelector('div.video-toolbar-left-main');
                if (buttonBar) {
                    addPlayPageDownloadButton(buttonBar);
                    notLoaded = false;
                }
            }*/
        }
    }

    if (location.pathname.startsWith('/v/topic/detail')) document.body.addEventListener('mouseover', bodyMouseOver);

    function showModal(event) {
        // console.log(addDlBtnMode);
        let bg = document.createElement('div');
        bg.style.position = 'fixed';
        bg.style.top = 0;
        bg.style.left = 0;
        bg.style.zIndex = 500;
        bg.style.backgroundColor = 'black';
        bg.style.opacity = 0.5;

        let modal = document.createElement('div');
        document.body.appendChild(bg);
        modal.style.position = 'fixed';
        modal.style.width = '25rem';
        modal.style.height = 'auto';
        modal.style.maxHeight = '80vh';
        modal.style.zIndex = 600;
        modal.style.backgroundColor = 'white';
        modal.style.borderStyle = 'solid';
        modal.style.borderWidth = '0.2rem';
        modal.style.borderRadius = '0.5rem';
        modal.style.borderColor = 'black';
        modal.style.overflowX = 'hidden';
        modal.style.overflowY = 'auto';
        modal.style.fontSize = '1rem';

        let titleBar = document.createElement('div');
        titleBar.textContent = '欢迎使用“下载Bilibili动态页面图片”脚本';
        titleBar.style.width = '100%';
        titleBar.style.textAlign = 'center';
        titleBar.style.backgroundColor = 'black';
        titleBar.style.color = 'white';
        titleBar.style.fontSize = '1rem';
        titleBar.style.fontWeight = 'bold';
        titleBar.style.paddingTop = '0.5rem';
        titleBar.style.paddingBottom = '0.5rem';
        titleBar.style.borderTopLeftRadius = '0.3rem';
        titleBar.style.borderTopRightRadius = '0.3rem';
        modal.appendChild(titleBar);

        let question1 = document.createElement('p');
        question1.style.paddingLeft = '2rem';
        question1.style.paddingRight = '2rem';
        question1.style.marginTop = '1rem';
        question1.style.marginBottom = '1rem';
        let labelPicName = document.createElement('label');
        labelPicName.textContent = '下载图片文件名';
        labelPicName.setAttribute('for', 'dlPicName');
        question1.appendChild(labelPicName);
        let inputPicName = document.createElement('input');
        inputPicName.type = 'text';
        inputPicName.id = 'dlPicName';
        inputPicName.name = 'dlPicName';
        inputPicName.style.marginTop = '0.5rem';
        inputPicName.style.width = 'calc(100% - 1rem)';
        inputPicName.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputPicName.style.borderStyle = 'solid';
        inputPicName.style.borderColor = 'gray';
        inputPicName.style.borderWidth = '0.14rem';
        inputPicName.style.borderRadius = '0.2rem';
        inputPicName.defaultValue = GM_getValue('dlPicName', '{original}.{ext}');
        question1.appendChild(inputPicName);
        let PicNameExplain1 = document.createElement('p');
        PicNameExplain1.innerHTML = '{original} - 原文件名\n{username} - UP主名称\n{userid} - UP主ID\n{dynamicid} - 动态id\n{ext} - 文件后缀\n{index} - 图片序号\n{YYYY} {MM} {DD} {HH} {mm} {ss} - 原博发布时\n间的年份、月份、日期、小时、分钟、秒，可\n分开独立使用\n{content} - 动态文字内容（最多前25个字符）';
        PicNameExplain1.style.marginTop = '0.5rem';
        PicNameExplain1.style.marginBottom = '0';
        PicNameExplain1.style.whiteSpace = 'pre';
        PicNameExplain1.style.color = 'gray';
        PicNameExplain1.style.lineHeight = '1.1rem';
        question1.appendChild(PicNameExplain1);
        /*let PicNameExplain2 = document.createElement('p');
        PicNameExplain2.innerHTML = '<b>注意</b>：启用“打包下载”时，需区分多文件名称，\n避免重复而导致打包后只有一个文件，文件命\n名时，必须包含{original}、{index}中至少一个\n标签。';
        PicNameExplain2.style.marginTop = '0.5rem';
        PicNameExplain2.style.whiteSpace = 'pre';
        PicNameExplain2.style.color = 'gray';
        question1.appendChild(PicNameExplain2);*/
        modal.appendChild(question1);

        let question2 = document.createElement('p');
        question2.style.paddingLeft = '2rem';
        question2.style.paddingRight = '2rem';
        question2.style.marginTop = '1rem';
        question2.style.marginBottom = '0';
        let labelVideoDownload = document.createElement('label');
        labelVideoDownload.setAttribute('for', 'enableVideoDownload');
        labelVideoDownload.textContent = '开启视频下载';
        labelVideoDownload.style.display = 'inline-block';
        labelVideoDownload.style.paddingRight = '0.2rem';
        question2.appendChild(labelVideoDownload);
        let inputVideoDownload = document.createElement('input');
        inputVideoDownload.type = 'checkbox';
        inputVideoDownload.id = 'enableVideoDownload';
        inputVideoDownload.name = 'enableVideoDownload';
        inputVideoDownload.checked = GM_getValue('enableVideoDownload', false);
        question2.appendChild(inputVideoDownload);
        let videoDownloadExplain = document.createElement('p');
        videoDownloadExplain.textContent = '目前Bilibili视频单文件下载最高只支持720P MP4格式。';
        videoDownloadExplain.style.marginTop = '0.5rem';
        videoDownloadExplain.style.marginBottom = '0';
        videoDownloadExplain.style.color = 'gray';
        videoDownloadExplain.style.lineHeight = '1.1rem';
        question2.appendChild(videoDownloadExplain);
        let labelVidName = document.createElement('label');
        labelVidName.textContent = '下载视频文件名';
        labelVidName.setAttribute('for', 'dlVidName');
        labelVidName.style.display = 'block';
        labelVidName.style.marginTop = '0.5rem';
        labelVidName.style.color = GM_getValue('enableVideoDownload', false) ? null : 'gray';
        question2.appendChild(labelVidName);
        let inputVidName = document.createElement('input');
        inputVidName.type = 'text';
        inputVidName.id = 'dlVidName';
        inputVidName.name = 'dlVidName';
        inputVidName.style.marginTop = '0.5rem';
        inputVidName.style.width = 'calc(100% - 1rem)';
        inputVidName.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputVidName.style.borderStyle = 'solid';
        inputVidName.style.borderWidth = '0.14rem';
        inputVidName.style.borderRadius = '0.2rem';
        inputVidName.disabled = GM_getValue('enableVideoDownload', false) ? false : true;
        inputVidName.style.borderColor = GM_getValue('enableVideoDownload', false) ? 'gray' : 'lightgray';
        inputVidName.defaultValue = GM_getValue('dlVidName', '{original}.{ext}');
        question2.appendChild(inputVidName);
        let vidNameExplain1 = document.createElement('p');
        vidNameExplain1.innerHTML = '{original} - 原文件名\n{username} - UP主名称\n{userid} - UP主ID\n{bvid} - 视频BVID\n{aid} - 视频AID\n{cid} - 视频CID\n{title} - 视频标题\n{ext} - 文件后缀\n{YYYY} {MM} {DD} {HH} {mm} {ss} - 原博发布时\n间的年份、月份、日期、小时、分钟、秒，可\n分开独立使用\n{content} - 视频简介（最多前25个字符）';
        vidNameExplain1.style.marginTop = '0.5rem';
        vidNameExplain1.style.marginBottom = '0';
        vidNameExplain1.style.whiteSpace = 'pre';
        vidNameExplain1.style.color = 'gray';
        vidNameExplain1.style.lineHeight = '1.1rem';
        question2.appendChild(vidNameExplain1);
        modal.appendChild(question2);

        /*let question3 = document.createElement('p');
        question3.style.paddingLeft = '2rem';
        question3.style.paddingRight = '2rem';
        question3.style.marginTop = '1rem';
        question3.style.marginBottom = '0';
        let labelZipMode = document.createElement('label');
        labelZipMode.setAttribute('for', 'zipMode');
        labelZipMode.textContent = '打包下载';
        labelZipMode.style.display = 'inline-block';
        labelZipMode.style.paddingRight = '0.2rem';
        labelZipMode.style.color = GM_getValue('ariaMode', false) ? 'gray' : null;
        question3.appendChild(labelZipMode);
        let inputZipMode = document.createElement('input');
        inputZipMode.type = 'checkbox';
        inputZipMode.id = 'zipMode';
        inputZipMode.checked = GM_getValue('zipMode', false);
        inputZipMode.disabled = GM_getValue('ariaMode', false);
        question3.appendChild(inputZipMode);
        let labelPackName = document.createElement('label');
        labelPackName.textContent = '打包文件名';
        labelPackName.setAttribute('for', 'packFileName');
        labelPackName.style.display = 'block';
        labelPackName.style.marginTop = '0.5rem';
        labelPackName.style.color = (GM_getValue('zipMode', false) && !GM_getValue('ariaMode', false)) ? null : 'gray';
        // labelPackName.style.display = GM_getValue('zipMode', false) ? 'block' : 'none';
        question3.appendChild(labelPackName);
        let inputPackName = document.createElement('input');
        inputPackName.type = 'text';
        inputPackName.id = 'packFileName';
        inputPackName.name = 'packFileName';
        inputPackName.style.marginTop = '0.5rem';
        inputPackName.style.width = 'calc(100% - 1rem)';
        inputPackName.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputPackName.style.borderStyle = 'solid';
        inputPackName.style.borderColor = (GM_getValue('zipMode', false) && !GM_getValue('ariaMode', false)) ? 'gray' : 'lightgray';
        inputPackName.style.borderWidth = '0.14rem';
        inputPackName.style.borderRadius = '0.2rem';
        inputPackName.defaultValue = GM_getValue('packFileName', '{mblogid}.zip');
        // inputPackName.style.display = GM_getValue('zipMode', false) ? 'block' : 'none';
        inputPackName.disabled = (GM_getValue('zipMode', false) && !GM_getValue('ariaMode', false)) ? false : true;
        question3.appendChild(inputPackName);
        let filePackExplain = document.createElement('p');
        filePackExplain.textContent = '与“下载文件名称”规则相同，但{original}、{ext}、{index}除外';
        filePackExplain.style.marginTop = '0.5rem';
        filePackExplain.style.marginBottom = '0';
        filePackExplain.style.color = 'gray';
        // filePackExplain.style.display = GM_getValue('zipMode', false) ? 'block' : 'none';
        question3.appendChild(filePackExplain);
        modal.appendChild(question3);

        let question4 = document.createElement('p');
        question4.style.paddingLeft = '2rem';
        question4.style.paddingRight = '2rem';
        question4.style.marginTop = '1rem';
        question4.style.marginBottom = '0';
        let labelRetweetMode = document.createElement('label');
        labelRetweetMode.setAttribute('for', 'retweetMode');
        labelRetweetMode.textContent = '单独设置转发微博下载文件名称';
        labelRetweetMode.style.display = 'inline-block';
        labelRetweetMode.style.paddingRight = '0.2rem';
        question4.appendChild(labelRetweetMode);
        let inputRetweetMode = document.createElement('input');
        inputRetweetMode.type = 'checkbox';
        inputRetweetMode.id = 'retweetMode';
        inputRetweetMode.checked = GM_getValue('retweetMode', false);
        question4.appendChild(inputRetweetMode);
        let labelRetweetFileName = document.createElement('label');
        labelRetweetFileName.textContent = '转发微博下载文件名称';
        labelRetweetFileName.setAttribute('for', 'retweetFileName');
        labelRetweetFileName.style.display = 'block';
        labelRetweetFileName.style.marginTop = '0.5rem';
        labelRetweetFileName.style.color = GM_getValue('retweetMode', false) ? null : 'gray';
        // labelPackName.style.display = GM_getValue('retweetMode', false) ? 'block' : 'none';
        question4.appendChild(labelRetweetFileName);
        let inputRetweetFileName = document.createElement('input');
        inputRetweetFileName.type = 'text';
        inputRetweetFileName.id = 'retweetFileName';
        inputRetweetFileName.name = 'retweetFileName';
        inputRetweetFileName.style.marginTop = '0.5rem';
        inputRetweetFileName.style.width = 'calc(100% - 1rem)';
        inputRetweetFileName.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputRetweetFileName.style.borderStyle = 'solid';
        inputRetweetFileName.style.borderColor = 'lightgray';
        inputRetweetFileName.style.borderWidth = '0.14rem';
        inputRetweetFileName.style.borderRadius = '0.2rem';
        inputRetweetFileName.defaultValue = GM_getValue('retweetFileName', '{original}.{ext}');
        // inputRetweetFileName.style.display = GM_getValue('retweetMode', false) ? 'block' : 'none';
        inputRetweetFileName.disabled = GM_getValue('retweetMode', false) ? false : true;
        question4.appendChild(inputRetweetFileName);
        let retweetFileNameExplain = document.createElement('p');
        retweetFileNameExplain.textContent = '除“下载文件名”规则外，额外标签如下：\n{re.mblogid} - 转博mblogid\n{re.username} - 转发博主名称\n{re.userid} - 转发博主ID\n{re.uid} - 转博uid\n{re.content} - 转发博文内容（最多前25个字符）\n{re.YYYY} {re.MM} {re.DD} {re.HH} {re.mm} {re.ss}\n - 原博发布时间的年份、月份、日期、小时、\n分钟、秒，可分开独立使用';
        retweetFileNameExplain.style.marginTop = '0.5rem';
        retweetFileNameExplain.style.whiteSpace = 'pre';
        retweetFileNameExplain.style.marginBottom = '0';
        retweetFileNameExplain.style.color = 'gray';
        // retweetFileNameExplain.style.display = GM_getValue('retweetMode', false) ? 'block' : 'none';
        question4.appendChild(retweetFileNameExplain);
        let labelRetweetPackName = document.createElement('label');
        labelRetweetPackName.textContent = '转发微博打包文件名';
        labelRetweetPackName.setAttribute('for', 'retweetPackFileName');
        labelRetweetPackName.style.display = 'block';
        labelRetweetPackName.style.marginTop = '0.5rem';
        labelRetweetPackName.style.color = (GM_getValue('zipMode', false) && GM_getValue('retweetMode', false) && !GM_getValue('ariaMode', false)) ? null : 'gray';
        // labelRetweetPackName.style.display = GM_getValue('zipMode', false) ? 'block' : 'none';
        question4.appendChild(labelRetweetPackName);
        let inputRetweetPackName = document.createElement('input');
        inputRetweetPackName.type = 'text';
        inputRetweetPackName.id = 'retweetPackFileName';
        inputRetweetPackName.name = 'retweetPackFileName';
        inputRetweetPackName.style.marginTop = '0.5rem';
        inputRetweetPackName.style.width = 'calc(100% - 1rem)';
        inputRetweetPackName.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputRetweetPackName.style.borderStyle = 'solid';
        inputRetweetPackName.style.borderColor = 'lightgray';
        inputRetweetPackName.style.borderWidth = '0.14rem';
        inputRetweetPackName.style.borderRadius = '0.2rem';
        inputRetweetPackName.defaultValue = GM_getValue('retweetPackFileName', '{mblogid}.zip');
        // inputRetweetPackName.style.display = (GM_getValue('zipMode', false) && GM_getValue('retweetMode', false) && !GM_getValue('ariaMode', false)) ? 'block' : 'none';
        inputRetweetPackName.disabled = (GM_getValue('zipMode', false) && GM_getValue('retweetMode', false) && !GM_getValue('ariaMode', false)) ? false : true;
        question4.appendChild(inputRetweetPackName);
        let retweetPackExplain = document.createElement('p');
        retweetPackExplain.textContent = '与“转发微博下载文件名称”规则相同，但{original}、{ext}、{index}除外';
        retweetPackExplain.style.marginTop = '0.5rem';
        retweetPackExplain.style.marginBottom = '0';
        retweetPackExplain.style.color = 'gray';
        // retweetPackExplain.style.display = (GM_getValue('zipMode', false) && GM_getValue('retweetMode', false) && !GM_getValue('ariaMode', false)) ? 'block' : 'none';
        question4.appendChild(retweetPackExplain);
        modal.appendChild(question4);

        let question5 = document.createElement('p');
        question5.style.paddingLeft = '2rem';
        question5.style.paddingRight = '2rem';
        question5.style.marginTop = '1rem';
        question5.style.marginBottom = '0';
        let labelAriaMode = document.createElement('label');
        labelAriaMode.setAttribute('for', 'ariaMode');
        labelAriaMode.textContent = '使用Aria2c远程下载';
        labelAriaMode.style.display = 'inline-block';
        labelAriaMode.style.paddingRight = '0.2rem';
        question5.appendChild(labelAriaMode);
        let inputAriaMode = document.createElement('input');
        inputAriaMode.type = 'checkbox';
        inputAriaMode.id = 'ariaMode';
        inputAriaMode.checked = GM_getValue('ariaMode', false);
        question5.appendChild(inputAriaMode);
        let ariaModeExplain = document.createElement('p');
        ariaModeExplain.textContent = '使用此方式下载，无法使用打包功能，无法在页面右下角显示下载进度和结果。';
        ariaModeExplain.style.marginTop = '0.5rem';
        ariaModeExplain.style.marginBottom = '0';
        ariaModeExplain.style.color = 'gray';
        question5.appendChild(ariaModeExplain);
        let labelAriaRpcUrl = document.createElement('label');
        labelAriaRpcUrl.textContent = 'RPC接口地址';
        labelAriaRpcUrl.setAttribute('for', 'ariaRpcUrl');
        labelAriaRpcUrl.style.display = 'block';
        labelAriaRpcUrl.style.marginTop = '0.5rem';
        labelAriaRpcUrl.style.color = GM_getValue('ariaMode', false) ? null : 'gray';
        question5.appendChild(labelAriaRpcUrl);
        let inputAriaRpcUrl = document.createElement('input');
        inputAriaRpcUrl.type = 'text';
        inputAriaRpcUrl.id = 'ariaRpcUrl';
        inputAriaRpcUrl.name = 'ariaRpcUrl';
        inputAriaRpcUrl.style.marginTop = '0.5rem';
        inputAriaRpcUrl.style.width = 'calc(100% - 1rem)';
        inputAriaRpcUrl.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputAriaRpcUrl.style.borderStyle = 'solid';
        inputAriaRpcUrl.style.borderColor = 'lightgray';
        inputAriaRpcUrl.style.borderWidth = '0.14rem';
        inputAriaRpcUrl.style.borderRadius = '0.2rem';
        inputAriaRpcUrl.defaultValue = GM_getValue('ariaRpcUrl', 'http://localhost:6800/jsonrpc');
        // inputAriaRpcUrl.style.display = GM_getValue('ariaMode', false) ? 'block' : 'none';
        inputAriaRpcUrl.disabled = GM_getValue('ariaMode', false) ? false : true;
        question5.appendChild(inputAriaRpcUrl);
        let inputAriaExplain = document.createElement('p');
        inputAriaExplain.textContent = '如果接口地址不是localhost，需手动将地址添加到XHR白名单。';
        inputAriaExplain.style.marginTop = '0.5rem';
        inputAriaExplain.style.marginBottom = '0';
        inputAriaExplain.style.color = 'gray';
        question5.appendChild(inputAriaExplain);
        modal.appendChild(question5);*/

        let question6 = document.createElement('p');
        question6.style.paddingLeft = '2rem';
        question6.style.paddingRight = '2rem';
        question6.style.marginTop = '1rem';
        question6.style.marginBottom = '0';
        let question6Title = document.createElement('div');
        question6Title.textContent = '瀑布流下载设置选项：';
        question6Title.style.fontWeight = 'bold';
        question6Title.style.lineHeight = '2rem';
        question6.appendChild(question6Title);
        let labelListDownloadSkipReference = document.createElement('label');
        labelListDownloadSkipReference.setAttribute('for', 'listDownloadSkipReference');
        labelListDownloadSkipReference.textContent = '跳过转发';
        labelListDownloadSkipReference.style.display = 'inline-block';
        labelListDownloadSkipReference.style.paddingRight = '0.2rem';
        labelListDownloadSkipReference.style.marginTop = '0.5rem';
        question6.appendChild(labelListDownloadSkipReference);
        let inputListDownloadSkipReference = document.createElement('input');
        inputListDownloadSkipReference.type = 'checkbox';
        inputListDownloadSkipReference.id = 'listDownloadSkipReference';
        inputListDownloadSkipReference.name = 'listDownloadSkipReference';
        inputListDownloadSkipReference.style.marginTop = '0.5rem';
        inputListDownloadSkipReference.checked = GM_getValue('listDownloadSkipReference', true);
        question6.appendChild(inputListDownloadSkipReference);
        question6.appendChild(document.createElement('br'));
        let labelListDownloadSleepGapSeconds = document.createElement('label');
        labelListDownloadSleepGapSeconds.setAttribute('for', 'listDownloadSleepGapSeconds');
        labelListDownloadSleepGapSeconds.textContent = '连续下载的间隔时间（秒）';
        labelListDownloadSleepGapSeconds.style.display = 'inline-block';
        labelListDownloadSleepGapSeconds.style.paddingRight = '0.2rem';
        labelListDownloadSleepGapSeconds.style.marginTop = '0.5rem';
        question6.appendChild(labelListDownloadSleepGapSeconds);
        let inputListDownloadSleepGapSeconds = document.createElement('input');
        inputListDownloadSleepGapSeconds.type = 'number';
        inputListDownloadSleepGapSeconds.id = 'listDownloadSleepGapSeconds';
        inputListDownloadSleepGapSeconds.name = 'listDownloadSleepGapSeconds';
        inputListDownloadSleepGapSeconds.style.marginTop = '0.5rem';
        inputListDownloadSleepGapSeconds.style.width = '3rem';
        inputListDownloadSleepGapSeconds.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputListDownloadSleepGapSeconds.style.borderStyle = 'solid';
        inputListDownloadSleepGapSeconds.style.borderWidth = '0.14rem';
        inputListDownloadSleepGapSeconds.style.borderRadius = '0.2rem';
        inputListDownloadSleepGapSeconds.style.borderColor = 'gray';
        inputListDownloadSleepGapSeconds.defaultValue = GM_getValue('listDownloadSleepGapSeconds', 2);
        question6.appendChild(inputListDownloadSleepGapSeconds);
        let listDownloadSleepGapSecondsExplain = document.createElement('p');
        listDownloadSleepGapSecondsExplain.innerHTML = '此项设置每下载一个动态后等待的秒数，\n避免请求过于频繁而触发API限制。';
        listDownloadSleepGapSecondsExplain.style.marginTop = '0.5rem';
        listDownloadSleepGapSecondsExplain.style.marginBottom = '0';
        listDownloadSleepGapSecondsExplain.style.whiteSpace = 'pre';
        listDownloadSleepGapSecondsExplain.style.color = 'gray';
        listDownloadSleepGapSecondsExplain.style.lineHeight = '1.1rem';
        question6.appendChild(listDownloadSleepGapSecondsExplain);
        let labelListDownloadRetryAttempsLimit = document.createElement('label');
        labelListDownloadRetryAttempsLimit.setAttribute('for', 'listDownloadRetryAttempsLimit');
        labelListDownloadRetryAttempsLimit.textContent = '自动重试次数';
        labelListDownloadRetryAttempsLimit.style.display = 'inline-block';
        labelListDownloadRetryAttempsLimit.style.paddingRight = '0.2rem';
        labelListDownloadRetryAttempsLimit.style.marginTop = '0.5rem';
        question6.appendChild(labelListDownloadRetryAttempsLimit);
        let inputListDownloadRetryAttempsLimit = document.createElement('input');
        inputListDownloadRetryAttempsLimit.type = 'number';
        inputListDownloadRetryAttempsLimit.id = 'listDownloadRetryAttempsLimit';
        inputListDownloadRetryAttempsLimit.name = 'listDownloadRetryAttempsLimit';
        inputListDownloadRetryAttempsLimit.style.marginTop = '0.5rem';
        inputListDownloadRetryAttempsLimit.style.width = '3rem';
        inputListDownloadRetryAttempsLimit.style.padding = '0.1rem 0.2rem 0.1rem 0.2rem';
        inputListDownloadRetryAttempsLimit.style.borderStyle = 'solid';
        inputListDownloadRetryAttempsLimit.style.borderWidth = '0.14rem';
        inputListDownloadRetryAttempsLimit.style.borderRadius = '0.2rem';
        inputListDownloadRetryAttempsLimit.style.borderColor = 'gray';
        inputListDownloadRetryAttempsLimit.defaultValue = GM_getValue('listDownloadRetryAttempsLimit', 3);
        question6.appendChild(inputListDownloadRetryAttempsLimit);
        let listDownloadRetryAttempsLimitExplain = document.createElement('p');
        listDownloadRetryAttempsLimitExplain.innerHTML = '连续的下载可能会触发API请求限制而报错，\n此项设置遇到报错后自动重试的次数。';
        listDownloadRetryAttempsLimitExplain.style.marginTop = '0.5rem';
        listDownloadRetryAttempsLimitExplain.style.marginBottom = '0';
        listDownloadRetryAttempsLimitExplain.style.whiteSpace = 'pre';
        listDownloadRetryAttempsLimitExplain.style.color = 'gray';
        listDownloadRetryAttempsLimitExplain.style.lineHeight = '1.1rem';
        question6.appendChild(listDownloadRetryAttempsLimitExplain);
        modal.appendChild(question6);

        /*inputRetweetMode.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                // labelRetweetFileName.style.display = 'block';
                // inputRetweetFileName.style.display = 'block';
                // retweetFileNameExplain.style.display = 'block';
                inputRetweetFileName.disabled = false;
                labelRetweetFileName.style.color = null;
                inputRetweetFileName.style.borderColor = 'gray';
            } else {
                // labelRetweetFileName.style.display = 'none';
                // inputRetweetFileName.style.display = 'none';
                // retweetFileNameExplain.style.display = 'none';
                inputRetweetFileName.disabled = true;
                labelRetweetFileName.style.color = 'gray';
                inputRetweetFileName.style.borderColor = 'lightgray';
            }
            if (event.currentTarget.checked && inputZipMode.checked && !inputAriaMode.checked) {
                inputRetweetPackName.disabled = false;
                labelRetweetPackName.style.color = null;
                inputRetweetPackName.style.borderColor = 'gray';
            } else {
                inputRetweetPackName.disabled = true;
                labelRetweetPackName.style.color = 'gray';
                inputRetweetPackName.style.borderColor = 'lightgray';
            }
        });

        inputZipMode.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                // labelPackName.style.display = 'block';
                // inputPackName.style.display = 'block';
                // filePackExplain.style.display = 'block';
                inputPackName.disabled = false;
                labelPackName.style.color = null;
                inputPackName.style.borderColor = 'gray';
            } else {
                // labelPackName.style.display = 'none';
                // inputPackName.style.display = 'none';
                // filePackExplain.style.display = 'none';
                inputPackName.disabled = true;
                labelPackName.style.color = 'gray';
                inputPackName.style.borderColor = 'lightgray';
            }
            if (event.currentTarget.checked && inputRetweetMode.checked) {
                inputRetweetPackName.disabled = false;
                labelRetweetPackName.style.color = null;
                inputRetweetPackName.style.borderColor = 'gray';
            } else {
                inputRetweetPackName.disabled = true;
                labelRetweetPackName.style.color = 'gray';
                inputRetweetPackName.style.borderColor = 'lightgray';
            }
        });

        inputAriaMode.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                // labelAriaRpcUrl.style.display = 'block';
                // inputAriaRpcUrl.style.display = 'block';
                inputAriaRpcUrl.disabled = false;
                labelAriaRpcUrl.style.color = null;
                inputAriaRpcUrl.style.borderColor = 'gray';
                inputZipMode.disabled = true;
                labelZipMode.style.color = 'gray';
            } else {
                // labelAriaRpcUrl.style.display = 'none';
                // inputAriaRpcUrl.style.display = 'none';
                inputAriaRpcUrl.disabled = true;
                labelAriaRpcUrl.style.color = 'gray';
                inputAriaRpcUrl.style.borderColor = 'lightgray';
                inputZipMode.disabled = false;
                labelZipMode.style.color = null;
            }
            if (!event.currentTarget.checked && inputZipMode.checked) {
                inputPackName.disabled = false;
                labelPackName.style.color = null;
                inputPackName.style.borderColor = 'gray';
            } else {
                inputPackName.disabled = true;
                labelPackName.style.color = 'gray';
                inputPackName.style.borderColor = 'lightgray';
            }
            if (!event.currentTarget.checked && inputZipMode.checked && inputRetweetMode.checked) {
                inputRetweetPackName.disabled = false;
                labelRetweetPackName.style.color = null;
                inputRetweetPackName.style.borderColor = 'gray';
            } else {
                inputRetweetPackName.disabled = true;
                labelRetweetPackName.style.color = 'gray';
                inputRetweetPackName.style.borderColor = 'lightgray';
            }
        });*/

        inputVideoDownload.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                // labelRetweetFileName.style.display = 'block';
                // inputRetweetFileName.style.display = 'block';
                // retweetFileNameExplain.style.display = 'block';
                inputVidName.disabled = false;
                labelVidName.style.color = null;
                inputVidName.style.borderColor = 'gray';
            } else {
                // labelRetweetFileName.style.display = 'none';
                // inputRetweetFileName.style.display = 'none';
                // retweetFileNameExplain.style.display = 'none';
                inputVidName.disabled = true;
                labelVidName.style.color = 'gray';
                inputVidName.style.borderColor = 'lightgray';
            }
        });

        let okButton = document.createElement('button');
        okButton.textContent = '确定';
        okButton.style.paddingTop = '0.5rem';
        okButton.style.paddingBottom = '0.5rem';
        okButton.style.margin = '2rem';
        okButton.style.backgroundColor = 'darkblue';
        okButton.style.color = 'white';
        okButton.style.fontSize = '1.5rem';
        okButton.style.fontWeight = 'bold';
        okButton.style.width = '21rem';
        okButton.style.borderStyle = 'solid';
        okButton.style.borderRadius = '0.5rem';
        okButton.style.borderColor = 'black';
        okButton.style.borderWidth = '0.2rem';
        okButton.addEventListener('mouseover', function(event) {
            okButton.style.backgroundColor = 'blue';
        });
        okButton.addEventListener('mouseout', function(event) {
            okButton.style.backgroundColor = 'darkblue';
        });
        okButton.addEventListener('mousedown', function(event) {
            okButton.style.backgroundColor = 'darkblue';
        });
        okButton.addEventListener('mouseover', function(event) {
            okButton.style.backgroundColor = 'blue';
        });

        function resizeWindow(event) {
            // console.log('resize');
            bg.style.width = document.documentElement.clientWidth.toString() + 'px';
            bg.style.height = document.documentElement.clientHeight.toString() + 'px';
            modal.style.top = (( document.documentElement.clientHeight - modal.offsetHeight ) / 2).toString() + 'px';
            modal.style.left = (( document.documentElement.clientWidth - modal.offsetWidth ) / 2).toString() + 'px';
        }

        okButton.addEventListener('click', function(event) {
            /*if (document.getElementById('zipMode').checked && !document.getElementById('dlPicName').value.includes('{original}') && !document.getElementById('dlPicName').value.includes('{index}')) {
                alert('启用“打包下载”时，需区分多文件名称，避免重复而导致打包后只有一个文件，文件命名时，必须包含{original}、{index}中至少一个标签。');
                document.getElementById('dlPicName').focus();
                return;
            }*/
            let refreshFlag = false;
            if (document.getElementById('enableVideoDownload').checked !== GM_getValue('enableVideoDownload', false)) {
                refreshFlag = true;
            }
            GM_setValue('dlPicName', document.getElementById('dlPicName').value);
            GM_setValue('enableVideoDownload', document.getElementById('enableVideoDownload').checked);
            GM_setValue('dlVidName', document.getElementById('dlVidName').value);
            // GM_setValue('retweetMode', document.getElementById('retweetMode').checked);
            // GM_setValue('retweetFileName', document.getElementById('retweetFileName').value);
            // GM_setValue('zipMode', document.getElementById('zipMode').checked);
            // GM_setValue('packFileName', document.getElementById('packFileName').value);
            // GM_setValue('retweetPackFileName', document.getElementById('retweetPackFileName').value);
            // GM_setValue('ariaMode', document.getElementById('ariaMode').checked);
            // GM_setValue('ariaRpcUrl', document.getElementById('ariaRpcUrl').value);
            GM_setValue('listDownloadSkipReference', document.getElementById('listDownloadSkipReference').checked);
            const listDownloadRetryAttempsLimitValue = document.getElementById('listDownloadRetryAttempsLimit').value;
            GM_setValue('listDownloadRetryAttempsLimit', isNaN(Math.round(listDownloadRetryAttempsLimitValue)) ? 3 : Math.round(listDownloadRetryAttempsLimitValue));
            const listDownloadSleepGapSecondsValue = document.getElementById('listDownloadSleepGapSeconds').value;
            GM_setValue('listDownloadSleepGapSeconds', isNaN(Math.round(listDownloadSleepGapSecondsValue)) ? 2 : Math.round(listDownloadSleepGapSecondsValue));
            GM_setValue('isSet', settingVersion);
            if (refreshFlag) {
                alert('已' + (document.getElementById('enableVideoDownload').checked ? '开启' : '关闭') + '视频下载功能，将在页面刷新后生效。');
                location.reload();
            }
            window.removeEventListener('resize', resizeWindow);
            document.body.removeChild(modal);
            document.body.removeChild(bg);
        });
        modal.appendChild(okButton);

        document.body.appendChild(modal);
        /*bg.addEventListener('click', function(event) {
            document.body.removeChild(modal);
            document.body.removeChild(bg);
            window.removeEventListener('resize', resizeWindow);
        });*/
        resizeWindow();
        window.addEventListener('resize', resizeWindow);
    }

    if(GM_getValue('isSet', null) !== settingVersion) {
        showModal();
    }

    bodyMouseOver();

    new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            // console.log(mutation);
            if (mutation.type === 'childList') {
                // if (!['svg'].includes(mutation.target.tagName)) console.log(mutation.target);
                /*for (const node of mutation.addedNodes) {
                    // console.log(node.nodeType, node);
                    if (node.nodeType === 1 && Object.keys(mutation.target.getElementsByClassName('video-like')).length > 0) {
                        console.log(mutation.target, node);
                    }
                }*/
                if (mutation.target.tagName === 'DIV' && ['bili-dyn-list__items', 'content'].includes(mutation.target.className)) {
                    // console.log(mutation.addedNodes);
                    for (const node of mutation.addedNodes) {
                        // console.log(node);
                        handleCard(node);
                    }
                } else if (mutation.target.tagName === 'DIV' && mutation.target.parentNode?.className === 'list-view topic-list__flow-list') {
                    // vconsole.log(mutation.addedNodes);
                    for (const node of mutation.addedNodes) {
                        // console.log(node);
                        handleCard(node);
                    }
                } else if (GM_getValue('enableVideoDownload', false) && mutation.target.tagName === 'BODY') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.tagName === 'DIV' && node.classList.contains('lt-row')) {
                            // console.log(mutation);
                            const buttonBar = document.body.querySelector('div.video-toolbar-left-main');
                            if (buttonBar && !buttonBar.querySelector('div.download-button')) {
                                // console.log(mutation);
                                addPlayPageDownloadButton(buttonBar);
                            }
                        }
                    }
                }
            }
        }
    }).observe(document.body, { attributes: false, childList: true, subtree: true });

    function addSettingButton() {
        let settingButton = document.createElement('button');
        settingButton.id = 'settingButton';
        settingButton.textContent = '设置';
        settingButton.style.position = 'fixed';
        settingButton.style.top = '4rem';
        settingButton.style.left = '0rem';
        settingButton.style.fontSize = '0.7rem';
        settingButton.style.backgroundColor = 'gray';
        settingButton.style.color = 'white';
        settingButton.style.borderWidth = '0.2rem';
        settingButton.style.borderStyle = 'solid';
        settingButton.style.borderRadius = '0.5rem';
        settingButton.style.borderColor = 'lightgrey';
        settingButton.style.zIndex = 400;
        settingButton.style.paddingLeft = '1rem';
        settingButton.style.paddingRight = '1rem';
        settingButton.style.paddingTop = '0.2rem';
        settingButton.style.paddingBottom = '0.2rem';
        settingButton.style.lineHeight = '1.2rem';
        settingButton.addEventListener('mouseover', function(event) {
            settingButton.style.backgroundColor = 'darkgray';
            settingButton.style.color = 'black';
        });
        settingButton.addEventListener('mouseout', function(event) {
            settingButton.style.backgroundColor = 'gray';
            settingButton.style.color = 'white';
        });
        settingButton.addEventListener('mousedown', function(event) {
            settingButton.style.backgroundColor = 'gray';
            settingButton.style.color = 'white';
        });
        settingButton.addEventListener('mouseup', function(event) {
            settingButton.style.backgroundColor = 'darkgray';
            settingButton.style.color = 'black';
        });
        settingButton.addEventListener('click', showModal);
        document.body.appendChild(settingButton);
        GM_registerMenuCommand('设置', showModal, "0");
    }

    let listDownloading = false;
    let stopDownloadingList = false;
    let listDownloadingIndex = 0;
    async function downloadList(e) {
        // console.log(this);
        if (!listDownloading && !stopDownloadingList) {
            listDownloading = true;
            listDownloadingIndex = 0;
            this.textContent = '停止下载瀑布流';
            this.disable = true;
            let retryAttempts = 0;
            while(!stopDownloadingList) {
                const selfListDom = document.body.querySelector('div.bili-dyn-list');
                if (selfListDom) {
                    // console.log(selfListDom);
                    const contentDoms = selfListDom.querySelectorAll('div.bili-dyn-item__main');
                    this.textContent = `停止下载瀑布流\n(正在下载第 ${(listDownloadingIndex + 1).toString()} 个动态)`;
                    const contentDom = contentDoms[listDownloadingIndex];
                    if (contentDom) {
                        contentDom.scrollIntoView();
                        // console.log(contentDom);
                        const downloadButton = contentDom.querySelector('div.download-button span');
                        if (downloadButton && (downloadButton.textContent === '下载') && !(GM_getValue('listDownloadSkipReference', true) && contentDom.querySelector('div.reference'))) {
                            const opusCard = contentDom.querySelector('[dyn-id]');
                            // console.log(opusCard);
                            if (opusCard) {
                                const dynId = opusCard.getAttribute('dyn-id');
                                // console.log(dynId);
                                const downloadSuccess = await handleDynamicDownload(dynId, downloadButton);
                                if (downloadSuccess) {
                                    retryAttempts = 0;
                                } else {
                                    if (retryAttempts < GM_getValue('listDownloadRetryAttempsLimit', 3)) {
                                        listDownloadingIndex -= 1;
                                        retryAttempts += 1;
                                    } else if (confirm(`出现错误${e.message}，已重试 ${retryAttempts} 次，还要继续吗？\n（“确定” —— 重试（一般是接口限制了，建议多等一会）；“取消” —— 停止）`)) {
                                        listDownloadingIndex -= 1;
                                    } else {
                                        stopDownloadingList = true;
                                    }
                                }
                                await sleep(GM_getValue('listDownloadSleepGapSeconds', 3));
                            }
                        }
                        listDownloadingIndex += 1;
                    } else {
                        stopDownloadingList = true;
                    }
                } else {
                    stopDownloadingList = true;
                }
            }
            listDownloading = false;
            stopDownloadingList = false;
            retryAttempts = 0;
            this.textContent = '下载当前瀑布流';
            this.disabled = false;
        } else if (listDownloading && !stopDownloadingList) {
            stopDownloadingList = true;
            this.textContent = '正在停止下载瀑布流……';
        }
    }

    function addListDownloadButton() {
        let listDownloadButton = document.createElement('button');
        listDownloadButton.id = 'listDownloadButton';
        listDownloadButton.textContent = '下载当前瀑布流';
        listDownloadButton.style.position = 'fixed';
        listDownloadButton.style.top = '6rem';
        listDownloadButton.style.left = '0rem';
        listDownloadButton.style.fontSize = '0.7rem';
        listDownloadButton.style.backgroundColor = 'gray';
        listDownloadButton.style.color = 'white';
        listDownloadButton.style.borderWidth = '0.2rem';
        listDownloadButton.style.borderStyle = 'solid';
        listDownloadButton.style.borderRadius = '0.5rem';
        listDownloadButton.style.borderColor = 'lightgrey';
        listDownloadButton.style.zIndex = 400;
        listDownloadButton.style.paddingLeft = '1rem';
        listDownloadButton.style.paddingRight = '1rem';
        listDownloadButton.style.paddingTop = '0.2rem';
        listDownloadButton.style.paddingBottom = '0.2rem';
        listDownloadButton.style.textAlign = 'center';
        listDownloadButton.style.whiteSpace = 'pre';
        listDownloadButton.style.lineHeight = '1.2rem';
        listDownloadButton.style.display = 'none';
        listDownloadButton.addEventListener('mouseover', function(event) {
            listDownloadButton.style.backgroundColor = 'darkgray';
            listDownloadButton.style.color = 'black';
        });
        listDownloadButton.addEventListener('mouseout', function(event) {
            listDownloadButton.style.backgroundColor = 'gray';
            listDownloadButton.style.color = 'white';
        });
        listDownloadButton.addEventListener('mousedown', function(event) {
            listDownloadButton.style.backgroundColor = 'gray';
            listDownloadButton.style.color = 'white';
        });
        listDownloadButton.addEventListener('mouseup', function(event) {
            listDownloadButton.style.backgroundColor = 'darkgray';
            listDownloadButton.style.color = 'black';
        });
        listDownloadButton.addEventListener('click', downloadList);
        document.body.appendChild(listDownloadButton);
    }

    function showListDownloadButton() {
        if ((window.location.host === 'space.bilibili.com' && window.location.pathname.match(/^\/\d+\/dynamic$/)) || (window.location.host === 't.bilibili.com')) {
            const listDownloadButton = document.getElementById('listDownloadButton');
            if (listDownloadButton) {
                listDownloadButton.style.display = 'block';
            }
        } else {
            const listDownloadButton = document.getElementById('listDownloadButton');
            if (listDownloadButton) {
                listDownloadButton.style.display = 'none';
            }
        }
    }

    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function() {
        pushState.apply(history, arguments);
        // console.log('Pathname changed:', window.location);
        showListDownloadButton();
    };

    history.replaceState = function() {
        replaceState.apply(history, arguments);
        // console.log('Pathname changed:', window.location);
        showListDownloadButton();
    };

    addSettingButton();
    addListDownloadButton();
    showListDownloadButton();
})();
