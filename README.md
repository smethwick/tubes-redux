# "i sure hope someone asked for this!"

tubes redux is _the_ irc client. it runs in your web
browser, sorry about that.

## you're gonna have to wait a little bit

tubes is, uhhh.... "functional" at the moment. it only really works with the
soju irc bouncer (and theoretically other bouncers that support the
[soju.im/bouncer-networks](https://git.sr.ht/~emersion/soju/tree/master/item/doc/ext/bouncer-networks.md)
extension) (support for local connections over websocket is implemented but i
think i've broken it several times while trying to get soju working. i've been
afraid to test it for a few months now.)

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
- [x] / commands (there aren't many yet)

### things that don't work

- [ ] direct messages
- [ ] adding a new network while connected to a soju instance
- [ ] deleting networks
- [ ] editing existing networks while on soju
- [ ] settings
- [ ] viewing the server buffer (workaround: check the debug log in devtools)
- [ ] disconnecting from networks while on soju
- [ ] getting a ding when someone mentions your nick
- [ ] whois (it exists but its bad)
- [ ] ignoring users
- [ ] most other things

## build it

you'll need:

- a computer
- [node.js](https://nodejs.org/)
- git

```bash
# clone the repo somewhere and cd into it
npm install # or pnpm install. or whatever you use i'm not your mother.
```

### build for production

```bash
npm run build
# put the contents of `build` on a web server somewhere (i use netlify).
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
the top right, then go to more tools > create shortcut (or apps > "install this
site as an app" on edge).

i think firefox is planning on supporting these at some point. we'll see how
that goes.

## help out

[there's a mailing list](https://lists.sr.ht/~leah/tubes-redux) that you can
send patches and such to. i'm really not a fan of the email workflow for this
kinda thing but github[^1] started defaulting me to the "for you" tab whenever i go
to my dashboard so it's what it's.

[^1]: they also have a contract with ICE but that's water under the bridge at
    this point

## thanks

my undying gratitude goes to the maintainers of the [Modern IRC Client
Protocol](https://modern.ircdocs.horse/) spec, without which i would be
completely fucked.

also many thanks to the people on libera.chat & tilde.chat who answered my silly
questions about irc's innards.

thank you to my mother for bringing me a cup of tea while i was writing this
