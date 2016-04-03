# 微博Chrome扩展插件

## 如何使用？
首先，该扩展仅可用于chrome浏览器或者内核为chromium（双核浏览器的极速模式）。
使用该chrome扩展有三种方法：

第一种（目前处于beta版，推荐使用）：
  1. 下载插件并解压，下载地址：https://codeload.github.com/1993hzh/weibo.ext/zip/master
  2. 依次打开：浏览器设置——工具——管理扩展——加载已解压的扩展程序——选择步骤1中的文件夹路径——确定
  3. 保证扩展是启用状态，浏览器右上角会有一个黑色小图标，点击小图标可以对该扩展进行一些设置

第二种：
  1. 下载插件并解压，下载地址：https://codeload.github.com/1993hzh/weibo.ext/zip/master
  2. 依次打开：浏览器设置——工具——管理扩展——打包扩展程序
  3. 将打包好的程序拖进浏览器并确定
  4. 保证扩展是启用状态，浏览器右上角会有一个黑色小图标，点击小图标可以对该扩展进行一些设置

第三种（目前不可用）：
  1. 到chrome extension store下载安装

## 可以做什么？
### 新消息提醒
该功能可以在扩展选项页面（点击浏览器右上角黑色小图标）进行设置，自定义提醒的消息类型、检查时间间隔，当然也可以关闭该功能。启用该功能之后，一旦检查到有新的对应的消息类型就会有chrome通知框在桌面右下角弹出。

### 屏蔽用户
目前新浪微博取消了非会员用户屏蔽用户的权限，启用该功能可以让非会员也可以正常屏蔽用户，被屏蔽的用户可以在选项页面移除。

### 自定义css
这个功能可以做很多有意思的事情，主要实现方法是通过向content script注入style标签。
目前我在css/weibo.css里面写了一点demo，可以做到
1. 缩小新版微博的图片大小
2. 屏蔽广告
你需要把css/weibo.css里面的内容拷贝到选项页面中的diy css并保存，再次刷新微博就能看到效果

### 关注指定用户
新浪微博很热情地对用户的微博进行了一部分筛选，过滤掉了部分好友的部分微博，启用该功能可以通过主动发送请求获取关注用户的最新状态更新。

嗯，说了这么多实际上这部分功能还没做。因为频繁发送ajax请求有可能被系统判定成robot 

//这其实是我偷懒的借口，毕竟感觉这个功能好像并不是很有需要


# Chrome extension for weibo.com

## How to use this extension?
First, you must make sure you have a chrome browser, chromium engine is also ok.

Then, you can clone this project to you local environment:
```
git clone https://github.com/1993hzh/weibo.ext
```

Next, open the extension in browser, click `load unpacked extension`, choose the directory where you cloned repo.

You will see a button at the upper right corner in your browser.

Enjoy it!! Remember to create issues for any problem.

## What the extension can do?
### New messages notification
You can choose what to notify you and set the check time in Options Page, of course you can disable this feature at you own.

### Block targeted person that you dislike even if you are not a weibo VIP
You can click the block button for target person and it will not show any message indicates that you cannot do this since you are not weibo VIP.
You can remove the blocked person in Options Page, or disable this feature for any reason.

### DIY css
You can write any css in the Options Page, that means you can do whatever you want include hiding all ads by yourself.

### Focus on target person
//To be decided
