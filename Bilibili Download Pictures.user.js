// ==UserScript==
// @name         Bilibili Download Pictures
// @version      0.2
// @description  Download pictures from bilibili timeline
// @author       OWENDSWANG
// @match        https://t.bilibili.com/*
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var notLoaded = true;
    var cardsTotal = 0;
    var startIndex = 0;
    document.body.addEventListener('mouseover', function(event) {
        if (notLoaded) {
            // console.log('body');
            // console.log(document.querySelectorAll('div.feed-card').length);
            var feed = document.querySelector('div.feed-card');
            if (feed) {
                // console.log('feed');
                feed.addEventListener('mouseover', function(event) {
                    var cards = feed.querySelectorAll('div.card');
                    // console.log(cards.length);
                    // console.log(cardsTotal);
                    if (notLoaded || cards.length > cardsTotal) {
                        // console.log('cards');
                        cardsTotal = cards.length - feed.querySelectorAll('div.card > div.skeleton').length;
                        // console.log(cardsTotal);
                        for (var i = startIndex; i < cardsTotal; i++) {
                            // console.log('card-bg-red');
                            // cards[i].style.backgroundColor = 'red';
                            if (cards[i].getElementsByClassName('imagesbox').length > 0) {
                                // console.log('added download button');
                                var buttonBar = cards[i].getElementsByClassName('button-bar')[0];
                                var buttons = buttonBar.getElementsByClassName('single-button');
                                buttons[buttons.length - 1].classList.remove('p-rel');
                                var downloadButton = document.createElement('div');
                                downloadButton.classList.add('single-button', 'c-pointer', 'p-rel', 'download-button');
                                downloadButton.style.display = 'inline-block';
                                downloadButton.style.lineHeight = '48px';
                                downloadButton.style.width = '92px';
                                downloadButton.style.fontSize = '12px';
                                var span = document.createElement('span');
                                span.classList.add('text-bar');
                                var icon = document.createElement('i');
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
                                var text = document.createElement('span');
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
                                    var content = this.closest('div.main-content');
                                    var list = content.querySelectorAll('div.img-content');
                                    if (list.length > 0) {
                                        for (var j = 0; j < list.length; j++) {
                                            var imgUrl = list[j].style.backgroundImage.split(/"|@/)[1];
                                            if (imgUrl.startsWith('//')) {
                                                imgUrl = 'https:' + imgUrl;
                                            }
                                            var imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                                            // console.log(imgUrl);
                                            // console.log(imgName);
                                            GM_download(imgUrl, imgName);
                                        }
                                    } else {
                                        list = content.querySelectorAll('li > img');
                                        if (list.length > 0) {
                                            for (var k = 0; k < list.length; k++) {
                                                imgUrl = list[k].src.split('@')[0];
                                                if (imgUrl.startsWith('//')) {
                                                    imgUrl = 'https:' + imgUrl;
                                                }
                                                imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                                                GM_download(imgUrl, imgName);
                                            }
                                        } else {
                                            var singleImg = content.querySelector('div.boost-img-container > img');
                                            imgUrl = singleImg.src.split('@')[0];
                                            imgName = imgUrl.split('/')[imgUrl.split('/').length - 1];
                                            GM_download(imgUrl, imgName);
                                        }
                                    }
                                });
                            }
                            startIndex += 1;
                        }
                        notLoaded = false;
                    }
                });
            }
        }
    });
})();
