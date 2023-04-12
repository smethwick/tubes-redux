# "i sure hope someone asked for this!"

tubes redux is the world's first good irc client, with a strong focus on not
confusing the hell out of people who haven't used irc before.

## you're gonna have to wait a little bit

tubes is, uhhh.... "functional" at the moment. it only really works with the
soju irc bouncer (and theoretically other bouncers that support the
[soju.im/bouncer-networks](https://git.sr.ht/~emersion/soju/tree/master/item/doc/ext/bouncer-networks.md)
extension) (support for local connections is implemented but i think i've broken
it several times while trying to get soju working. i've been afraid to test it
for a few months now.)

### things that work

- [x] connecting to networks
- [x] using sasl (only plain for now)
- [x] talking in channels
- [x] joining and leaving channels
- [x] seeing other people's messages
- [x] browsing existing channels
- [x] viewing chat logs using chathistory (kinda broken at the moment, oh well)
- [x] looking at the message of the day
- [x] a thing that keeps track of unread messages

### things that don't work

- [ ] direct messages
- [ ] adding a new network while connected to a soju instance
- [ ] deleting networks
- [ ] editing existing networks while on soju
- [ ] settings
- [ ] viewing the server buffer (workaround: check the debug log in devtools)
- [ ] disconnecting from networks while on soju
- [ ] / commands
- [ ] getting a ding when someone mentions your nick
- [ ] whois
- [ ] ignoring users
- [ ] most other things

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
work, but will probably be at least a little bit broken (please let me know
about any bugs you come across!).

there's a manual in the app situated in "help!" > manual, which you might want
to check out for cool guides and tips.

### bonus tip: put it on your taskbar

if you're using a chromium-based browser (chrome, edge, vivaldi, brave (ugh),
chromium), you can install tubes as a "progressive web app" or pwa. this gives
it its own window, a nicer looking titlebar, an item in your start menu, and
basic offline support. it's like an electron app that doesn't use upwards of
300MB of RAM per instance.

if i've done it properly, chrome should flash up a thing in your address bar
asking you if you want to install it as a pwa. if not, go to the 3-dot menu in
the top right, then go to more tools > create shortcut (or apps > install this
site as an app on edge).

i think firefox is planning on supporting these at some point. we'll see how
that goes.

## help out

file an issue or open a pull request!! i'll have more in depth information here
"at some point"

## thanks

my undying gratitude goes to the maintainers of the
[Modern IRC Client Protocol](https://modern.ircdocs.horse/) spec, without which
i would be completely fucked.

also many thanks to the people on libera.chat & tilde.chat who answered my silly
questions about irc's innards.
