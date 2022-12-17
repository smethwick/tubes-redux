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