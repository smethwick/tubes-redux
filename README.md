# "i sure hope someone asked for this!"

tubes redux is the world's first good irc client, with a strong focus on not
confusing the hell out of people who haven't used irc before.

## you're gonna have to wait a little bit
tubes is still pretty early on in development. i still have about 10000
irc thing to implement, plus ircv3 support!! i would not recommend using tubes
in its current state if you're not completely insane.

## build it

you'll need: 
- a computer
- [node.js](https://nodejs.org/)
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

tubes is regularly tested on firefox and google chrome. other browsers might
work, but will probably be at least a little bit broken (please let me know about
any bugs you come across!).

there's a manual in the app situated in "help!" > manual, which you might want to 
check out for cool guides and tips.

### bonus tip: put it on your taskbar

if you're using a chromium-based browser (chrome, edge, vivaldi, brave (ugh), chromium),
you can install tubes as a "progressive web app" or pwa. this gives it its own window,
a nicer looking titlebar, an item in your start menu, and basic offline support. it's
like an electron app that doesn't use upwards of 300MB of RAM per instance.

if i've done it properly, chrome should flash up a thing in your address bar asking you
if you want to install it as a pwa. if not, go to the 3-dot menu in the top right,
then go to more tools > create shortcut (or apps > install this site as an app on edge). 

i think firefox is planning on supporting these at some point but – knowing mozilla –
firefox will probably stop existing before that happens (JOKE THAT WAS A JOKE).

## help out

file an issue or open a pull request!! i'll have more in depth information here
"at some point"