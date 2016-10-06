# Philly Wechat

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/wechaty/wechaty)

![image](https://cloud.githubusercontent.com/assets/3538629/19137472/b0855adc-8ba6-11e6-90e6-69c571be3bab.png)

Wechat Channel for AI Chatbot at [Philly Chatbot](https://github.com/snaplingo-org/chatbot-mvp).

Service built on top of [wechaty](https://github.com/wechaty/wechaty) and [Parse Server](https://parseplatform.github.io/#server)


## Installation
Depend on Node.js and other tools.

### Ubuntu Server
Run with headless browser.

```
apt-get update -q && apt-get install -qy \\
     chromium-browser \\
     xvfb \\
     libpango1.0-0 \\ 
     fonts-liberation \\
     libappindicator1 \\
     libdbusmenu-glib4 
     libdbusmenu-gtk4 \\ 
     libindicator7 \\
     indicator-application

wget -c https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
nohup Xvfb :0 -ac -screen 0 1024x768x24 &
export DISPLAY=0:0
node app.js
```

### start

```
cp config/environment/development.sample.js config/environment/development.js
npm install
npm start
```

> note, copy config/environment/production.sample.js to config/environment/production.js by NODE_ENV.


## Troubleshooting

[Can not launching app - WebDriverError: un known error: cannot find Chrome binary ](https://github.com/wechaty/wechaty/issues/36#issuecomment-251859156)

