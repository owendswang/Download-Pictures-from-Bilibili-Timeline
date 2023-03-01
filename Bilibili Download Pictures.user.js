// ==UserScript==
// @name         Bilibili Download Pictures
// @name:zh-CN   下载Bilibili动态页面图片
// @version      0.7.1
// @description  Download pictures from bilibili timeline
// @description:zh-CN 下载“Bilibili动态”时间线页面的图片
// @author       OWENDSWANG
// @icon         https://avatars.githubusercontent.com/u/9076865?s=40&v=4
// @license      MIT
// @homepage     https://greasyfork.org/scripts/421885
// @supportURL   https://github.com/owendswang/Download-Pictures-from-Bilibili-Timeline
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*/dynamic*
// @match        https://www.bilibili.com/opus/*
// @grant        GM_download
// @namespace https://greasyfork.org/users/738244
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let notLoaded = true;
    let cardsTotal = 0;
    let skeletonsTotal = 0;
    function mostViewedItemMouseClick(event) {
        notLoaded = true;
        cardsTotal = 0;
        let feed = document.querySelector('div.bili-dyn-list');
        if (feed) {
            // console.log('feed');
            feed.addEventListener('mouseover', feedMouseOver);
        }
    }
    function addOpusDownloadButton(card) {
        if(card.getElementsByClassName('download-button').length == 0) {
            console.log(card);
            const buttonBar = card.getElementsByClassName('bili-tabs__nav__items')[0];
            let downloadButton = document.createElement('div');
            downloadButton.textContent = '下载';
            downloadButton.classList.add('bili-tabs__nav__item');
            downloadButton.addEventListener('click', function(event) {
                const content = document.body.querySelector('div.opus-module-content');
                const list = content.querySelectorAll('div.bili-album__preview__picture__img');
                if (list.length > 0) {
                    for (let j = 0; j < list.length; j++) {
                        let imgUrl = list[j].style.backgroundImage.split(/"|@/)[1];
                        if (imgUrl.startsWith('//')) {
                            imgUrl = 'https:' + imgUrl;
                        }
                        const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                        // console.log(imgUrl);
                        // console.log(imgName);
                        GM_download(imgUrl, imgName);
                    }
                }
            });
            buttonBar.appendChild(downloadButton);
        }
    }
    function addDownloadButton(card) {
        if(card.getElementsByClassName('download-button').length == 0) {
            let buttonBar = card.getElementsByClassName('bili-dyn-item__footer')[0];
            let downloadButton = document.createElement('div');
            downloadButton.classList.add('bili-dyn-item__action');
            downloadButton.classList.add('download-button');
            let span = document.createElement('div');
            span.classList.add('bili-dyn-action');
            let icon = document.createElement('i');
            icon.classList.add('bili-dyn-action__icon');
            icon.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHpSURBVDiNndS7a1RREMfxz9XVrI8UIkjwLxCipYVp9A+wEQsV8dFksLCwUATxAYqNIAhWO4UPsAqCCGqTQkRQULEMgojYCSK+X4nhWty7uCZ3k5gfnObMOd8zM2dmirIs9SozV+IxNmCJZk3jObZGxFSvodVweD024TMm+wDb2Iy1eDsfcCkKHMSdPsB9uFKf/UdNwK4mI+J3kyEzp5r26Z8jTa8v5N5cwEWpCdgYZh/NOtuCzGyrQiwx+B/Awcz8ovrE6Yj42crMcYyoSqRdr/nULd6X+IFfWJaZYy1cwhA24j5u1t4+mAN4D0cwhb21Q89wtSjLUmauxm1sw56IGFtIvJm5H9dxFzsj4lfR23qZeQ0HcDEijs4Du4zD6ETEoe5+0el0zuNnURTnRkdHZeYpnMUt7JrZq5k5oErLdhyPiAuZuQyn8XEJTuBMWZbLISLOqVprB55k5roe2BCe1rDdEXGhNq3CSRxrqX73U68XEXEjM99gHBOZuUVVs4+wAiMR8bjnSolv+NC3UyLiIYZVU+cFJvARwzNg/6gLLDVUfUS8UpXTw3ptjIjXDZzpmlF2p02BdmbOmn8R8V1VTiAzmybUQM0oik6n81WVl/f9wvC3M4o+9kI1bD+08A5r6rVYlapcf/0DW06ifC1dVCUAAAAASUVORK5CYII=\')';
            let text = document.createElement('span');
            if (navigator.language == 'zh-CN') {
                text.textContent = '下载';
            } else {
                text.textContent = 'Download';
            }
            span.appendChild(icon);
            span.appendChild(text);
            downloadButton.appendChild(span);
            buttonBar.appendChild(downloadButton);
            downloadButton = buttonBar.getElementsByClassName('download-button')[0];
            downloadButton.addEventListener('mouseover', function(event) {
                this.querySelector('i').style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAH4SURBVDiNnZQxTBVBEIa/kSM8iSQaG2Jp5QYsLaTBzsbOQoy4oaG3s7PQ2BgLExtjodxqI7ExQQspiMFIQ4zVLQkhxE4w5qEC8t7zZSx2nx6wB8ifTDM7+93O3MyIqlKWON8LzAFngCOk1QY+AsNqTat8kCWCTwFngR9AswJYA84BJ4Ev+wG7AAHGgKkK4HXgSYzdphSwo6Za8zt1IM63Un6orhGprx/k3l7AQykFTKZZoV2xGYA4XyOkqEDffwD7xPmfhJ/YVmu2MnF+GhgitEgt2n7qNO8i8AtoAN3i/GQGPAD6gUFgBngZX/tuD+Ab4AbQAq7FB80DT0VVEeePAa+AC8BVtWbyIPmK8xbIgdfAZbWmgar+NfJigrxQ8uJ+2Z8y8uJhjH1U9mfi/F1g63Hj/R0dHx8T55eA2+L8aeDKzlkV53tiWS4BN9Wae+J8N3ALWBPyQgnD3qvWNOOlUeAZ8Am4qNasRn8/8JYw6yNqzYvoPw7UgZWM8He/l1+h1jwX5z8D00Ahzp8n9OwH4CgwpNbMla8AG0C9clLUmllggLB1FoACWAMGdsC2qQNUEl2v1iwR2mk22qBas5zgtCNDO9tGgJo4v2v/qTWbhHYKgc6nNlRPZIiQF+uEunyrSoN/kyEV50JYtvUM+AqciHZYKaHW638AymHVXI56hi8AAAAASUVORK5CYII=\')';
                // console.log('over');
            });
            downloadButton.addEventListener('mouseout', function(event) {
                this.querySelector('i').style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHpSURBVDiNndS7a1RREMfxz9XVrI8UIkjwLxCipYVp9A+wEQsV8dFksLCwUATxAYqNIAhWO4UPsAqCCGqTQkRQULEMgojYCSK+X4nhWty7uCZ3k5gfnObMOd8zM2dmirIs9SozV+IxNmCJZk3jObZGxFSvodVweD024TMm+wDb2Iy1eDsfcCkKHMSdPsB9uFKf/UdNwK4mI+J3kyEzp5r26Z8jTa8v5N5cwEWpCdgYZh/NOtuCzGyrQiwx+B/Awcz8ovrE6Yj42crMcYyoSqRdr/nULd6X+IFfWJaZYy1cwhA24j5u1t4+mAN4D0cwhb21Q89wtSjLUmauxm1sw56IGFtIvJm5H9dxFzsj4lfR23qZeQ0HcDEijs4Du4zD6ETEoe5+0el0zuNnURTnRkdHZeYpnMUt7JrZq5k5oErLdhyPiAuZuQyn8XEJTuBMWZbLISLOqVprB55k5roe2BCe1rDdEXGhNq3CSRxrqX73U68XEXEjM99gHBOZuUVVs4+wAiMR8bjnSolv+NC3UyLiIYZVU+cFJvARwzNg/6gLLDVUfUS8UpXTw3ptjIjXDZzpmlF2p02BdmbOmn8R8V1VTiAzmybUQM0oik6n81WVl/f9wvC3M4o+9kI1bD+08A5r6rVYlapcf/0DW06ifC1dVCUAAAAASUVORK5CYII=\')';
                // console.log('out');
            });
            downloadButton.addEventListener('click', function(event) {
                // console.log('click');
                event.preventDefault();
                const content = this.closest('div.bili-dyn-item__main');
                const list = content.querySelectorAll('div.bili-album__preview__picture__img img');
                // console.log(list);
                if (list.length > 0) {
                    for (let j = 0; j < list.length; j++) {
                        // let imgUrl = list[j].style.backgroundImage.split(/"|@/)[1];
                        let imgUrl = list[j].src.split(/@/)[0];
                        console.log(imgUrl);
                        if (imgUrl.startsWith('//')) {
                            imgUrl = 'https:' + imgUrl;
                        }
                        const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                        // console.log(imgName);
                        GM_download(imgUrl, imgName);
                    }
                }
            });
        }
    }
    function oldHandleCard(card) {
        if (card.getElementsByClassName('imagesbox').length > 0 && card.getElementsByClassName('download-button').length == 0) {
            console.log('added download button');
            let buttonBar = card.getElementsByClassName('button-bar')[0];
            let buttons = buttonBar.getElementsByClassName('single-button');
            buttons[buttons.length - 1].classList.remove('p-rel');
            let downloadButton = document.createElement('div');
            downloadButton.classList.add('single-button', 'c-pointer', 'p-rel', 'download-button');
            downloadButton.style.display = 'inline-block';
            downloadButton.style.lineHeight = '48px';
            downloadButton.style.width = '92px';
            downloadButton.style.fontSize = '12px';
            let span = document.createElement('span');
            span.classList.add('text-bar');
            let icon = document.createElement('i');
            icon.style.background = 'center/contain no-repeat';
            icon.style.backgroundSize = '15px';
            icon.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHpSURBVDiNndS7a1RREMfxz9XVrI8UIkjwLxCipYVp9A+wEQsV8dFksLCwUATxAYqNIAhWO4UPsAqCCGqTQkRQULEMgojYCSK+X4nhWty7uCZ3k5gfnObMOd8zM2dmirIs9SozV+IxNmCJZk3jObZGxFSvodVweD024TMm+wDb2Iy1eDsfcCkKHMSdPsB9uFKf/UdNwK4mI+J3kyEzp5r26Z8jTa8v5N5cwEWpCdgYZh/NOtuCzGyrQiwx+B/Awcz8ovrE6Yj42crMcYyoSqRdr/nULd6X+IFfWJaZYy1cwhA24j5u1t4+mAN4D0cwhb21Q89wtSjLUmauxm1sw56IGFtIvJm5H9dxFzsj4lfR23qZeQ0HcDEijs4Du4zD6ETEoe5+0el0zuNnURTnRkdHZeYpnMUt7JrZq5k5oErLdhyPiAuZuQyn8XEJTuBMWZbLISLOqVprB55k5roe2BCe1rDdEXGhNq3CSRxrqX73U68XEXEjM99gHBOZuUVVs4+wAiMR8bjnSolv+NC3UyLiIYZVU+cFJvARwzNg/6gLLDVUfUS8UpXTw3ptjIjXDZzpmlF2p02BdmbOmn8R8V1VTiAzmybUQM0oik6n81WVl/f9wvC3M4o+9kI1bD+08A5r6rVYlapcf/0DW06ifC1dVCUAAAAASUVORK5CYII=\')';
            icon.style.width = '20px';
            icon.style.height = '20px';
            icon.style.display = 'inline-block';
            icon.style.verticalAlign = 'text-top';
            icon.style.margin = '0';
            icon.style.padding = '0';
            icon.style.marginRight = '4px';
            icon.style.marginTop = '-2px';
            let text = document.createElement('span');
            text.classList.add('text-offset');
            if (navigator.language == 'zh-CN') {
                text.textContent = '下载';
            } else {
                text.textContent = 'Download';
            }
            span.appendChild(icon);
            span.appendChild(text);
            downloadButton.appendChild(span);
            buttonBar.appendChild(downloadButton);
            downloadButton = buttonBar.getElementsByClassName('download-button')[0];
            downloadButton.addEventListener('mouseover', function(event) {
                this.querySelector('span.text-bar').style.color = '#00a1d6';
                this.querySelector('i').style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAH4SURBVDiNnZQxTBVBEIa/kSM8iSQaG2Jp5QYsLaTBzsbOQoy4oaG3s7PQ2BgLExtjodxqI7ExQQspiMFIQ4zVLQkhxE4w5qEC8t7zZSx2nx6wB8ifTDM7+93O3MyIqlKWON8LzAFngCOk1QY+AsNqTat8kCWCTwFngR9AswJYA84BJ4Ev+wG7AAHGgKkK4HXgSYzdphSwo6Za8zt1IM63Un6orhGprx/k3l7AQykFTKZZoV2xGYA4XyOkqEDffwD7xPmfhJ/YVmu2MnF+GhgitEgt2n7qNO8i8AtoAN3i/GQGPAD6gUFgBngZX/tuD+Ab4AbQAq7FB80DT0VVEeePAa+AC8BVtWbyIPmK8xbIgdfAZbWmgar+NfJigrxQ8uJ+2Z8y8uJhjH1U9mfi/F1g63Hj/R0dHx8T55eA2+L8aeDKzlkV53tiWS4BN9Wae+J8N3ALWBPyQgnD3qvWNOOlUeAZ8Am4qNasRn8/8JYw6yNqzYvoPw7UgZWM8He/l1+h1jwX5z8D00Ahzp8n9OwH4CgwpNbMla8AG0C9clLUmllggLB1FoACWAMGdsC2qQNUEl2v1iwR2mk22qBas5zgtCNDO9tGgJo4v2v/qTWbhHYKgc6nNlRPZIiQF+uEunyrSoN/kyEV50JYtvUM+AqciHZYKaHW638AymHVXI56hi8AAAAASUVORK5CYII=\')';
                // console.log('over');
            });
            downloadButton.addEventListener('mouseout', function(event) {
                this.querySelector('span.text-bar').style.color = null;
                this.querySelector('i').style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHpSURBVDiNndS7a1RREMfxz9XVrI8UIkjwLxCipYVp9A+wEQsV8dFksLCwUATxAYqNIAhWO4UPsAqCCGqTQkRQULEMgojYCSK+X4nhWty7uCZ3k5gfnObMOd8zM2dmirIs9SozV+IxNmCJZk3jObZGxFSvodVweD024TMm+wDb2Iy1eDsfcCkKHMSdPsB9uFKf/UdNwK4mI+J3kyEzp5r26Z8jTa8v5N5cwEWpCdgYZh/NOtuCzGyrQiwx+B/Awcz8ovrE6Yj42crMcYyoSqRdr/nULd6X+IFfWJaZYy1cwhA24j5u1t4+mAN4D0cwhb21Q89wtSjLUmauxm1sw56IGFtIvJm5H9dxFzsj4lfR23qZeQ0HcDEijs4Du4zD6ETEoe5+0el0zuNnURTnRkdHZeYpnMUt7JrZq5k5oErLdhyPiAuZuQyn8XEJTuBMWZbLISLOqVprB55k5roe2BCe1rDdEXGhNq3CSRxrqX73U68XEXEjM99gHBOZuUVVs4+wAiMR8bjnSolv+NC3UyLiIYZVU+cFJvARwzNg/6gLLDVUfUS8UpXTw3ptjIjXDZzpmlF2p02BdmbOmn8R8V1VTiAzmybUQM0oik6n81WVl/f9wvC3M4o+9kI1bD+08A5r6rVYlapcf/0DW06ifC1dVCUAAAAASUVORK5CYII=\')';
                // console.log('out');
            });
            downloadButton.addEventListener('click', function(event) {
                // console.log('click');
                const content = this.closest('div.main-content');
                let list = content.querySelectorAll('div.img-content');
                if (list.length > 0) {
                    for (let j = 0; j < list.length; j++) {
                        let imgUrl = list[j].style.backgroundImage.split(/"|@/)[1];
                        if (imgUrl.startsWith('//')) {
                            imgUrl = 'https:' + imgUrl;
                        }
                        const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                        // console.log(imgUrl);
                        // console.log(imgName);
                        GM_download(imgUrl, imgName);
                    }
                } else {
                    list = content.querySelectorAll('li > img');
                    if (list.length > 0) {
                        for (let k = 0; k < list.length; k++) {
                            let imgUrl = list[k].src.split('@')[0];
                            if (imgUrl.startsWith('//')) {
                                imgUrl = 'https:' + imgUrl;
                            }
                            const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                            GM_download(imgUrl, imgName);
                        }
                    } else {
                        const singleImg = content.querySelector('div.boost-img-container > img');
                        let imgUrl = singleImg.src.split('@')[0];
                        const imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                        GM_download(imgUrl, imgName);
                    }
                }
            });
        }
    }
    function handleOpusCard(card) {
         if (card.getElementsByClassName('bili-album').length > 0) {
             addOpusDownloadButton(card);
         }
    }
    function handleCard(card) {
        if (card.getElementsByClassName('bili-album').length > 0) {
            // console.log('add download button');
            card.getElementsByClassName('bili-album__preview__picture__img').forEach((img) => {
                img.addEventListener('click', function(event) {
                 addDownloadButton(card);
                });
            });
            addDownloadButton(card);
        }
    }
    function oldFeedMouseOver(event) {
        const cards = this.querySelectorAll('div.card');
        const skeletonCards = this.querySelectorAll('div.card > div.skeleton');
        // console.log(skeletonCards.length);
        if (notLoaded || skeletonCards.length != skeletonsTotal || cards.length > cardsTotal) {
            // console.log('cards');
            cardsTotal = cards.length;
            // console.log(cardsTotal);
            skeletonsTotal = skeletonCards.length;
            for (let i = 0; i < cardsTotal; i++) {
                // console.log('card');
                oldHandleCard(cards[i])
                // startIndex += 1;
            }
            if (cardsTotal > 0) {
                notLoaded = false;
            }
            document.body.removeEventListener('mouseover', bodyMouseOver);
        }
    }
    function feedMouseOver(event) {
        const cards = this.querySelectorAll('div.bili-dyn-item');
        // console.log(cards.length);
        if (notLoaded || cards.length > cardsTotal) {
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
    }
    function bodyMouseOver(event) {
        if (notLoaded) {
            // console.log('body');
            const mostViewedItems = document.querySelectorAll('div.bili-dyn-up-list__item');
            // console.log(mostViewedItems.length);
            for (let l = 0; l < mostViewedItems.length; l++) {
                mostViewedItems[l].addEventListener('click', mostViewedItemMouseClick);
            }
            let feed = document.querySelector('div.bili-dyn-list');
            if (feed) {
                // console.log('feed');
                feed.addEventListener('mouseover', feedMouseOver);
            } else if(document.querySelector('div.bili-dyn-item')) {
                const card = document.querySelector('div.bili-dyn-item');
                if (card) {
                    handleCard(card);
                    notLoaded = false;
                    document.body.removeEventListener('mouseover', bodyMouseOver);
                }
            } else if (document.querySelector('div.opus-detail')) {
                const card = document.querySelector('div.opus-detail');
                if (card) {
                    handleOpusCard(card);
                    notLoaded = false;
                    document.body.removeEventListener('mouseover', bodyMouseOver);
                }
            } else if(document.querySelector('div.feed-card')) {
                feed = document.querySelector('div.feed-card');
                feed.addEventListener('mouseover', oldFeedMouseOver);
            }
        }
    }
    document.body.addEventListener('mouseover', bodyMouseOver);
})();
