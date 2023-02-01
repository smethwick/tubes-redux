# tubes redux - "an irc client"

tubes redux is a lot like tubes, the main difference being that this time i remembered
to make the api good.

## build it

you'll need: 
- a computer
- an operating system that can run node.js
- a copy of [node.js](https://nodejs.org/) installed on your computer
- an internet connection
- git

```bash
git clone https://tildegit.org/leah/tubes-redux.git
cd tubes-redux
npm install
```

### build for production

```bash
npm run build
# put the contents of `build` on a web server somewhere (github pages works quite well).
```

### build for development

```bash
npm run dev
# navigate to the port it shows in the output
```

### run the tests

```bash
# unit tests
npm run test:unit

# if you want a fancy ui for lookin at them
npm run test:unit -- --ui --open

# at some point we'll have slightly fancier tests, which you can run like this.
npm run tests
```

## use it

there's a manual in the app (LEAH NOTE: no there isn't. add one at some point) situated
in "help!" > manual, check it out for cool guides and tips.

### bonus tip: put it on your taskbar

if you're using a chromium-based browser (chrome, edge, vivaldi, brave (ugh), chromium),
you can install tubes as a "progressive web app" or pwa. this gives it its own window,
a nicer looking titlebar, an item in your start menu, and basic offline support. it's
like an electron app that doesn't use upwards of 300MB of RAM per instance.

if i've done it properly, chrome should flash up a thing in your address bar asking you
if you want to install it as a pwa. if not, go to the 3-dot menu in the top right,
then go to more tools > create shortcut (or apps > install this site as an app on edge). 

i think firefox is planning on supporting these at some point but – knowing mozilla –
firefox will probably stop existing before that happens.

## help out

i've set up a mailing list on [sourcehut](https://lists.sr.ht/~leah/tubes-redux).
i don't like sourcehut *that* much but they do host a very respectable mailing list service.

you can send things to it by throwing an email in the general direction of 
[~leah/tubes-redux@lists.sr.ht](mailto:~leah/tubes-redux@lists.sr.ht). you can also use
[git-send-email](https://git-send-email.io/) for sending code over