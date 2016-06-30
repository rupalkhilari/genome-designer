[![Docker Repository on Quay](https://quay.io/repository/autodesk_bionano/genomedesigner_genome-designer/status "Docker Repository on Quay")](https://quay.io/repository/autodesk_bionano/genomedesigner_genome-designer)
# egf-collaboration

### installation

`npm install`

`npm run start`

Please check `package.json` to ensure you have valid versions of globally installed software packages (e.g. node, npm, webpack).

### user authentication
User authentication depends on the Bio/Nano User Platform project, which is currently not open source. As a result user
authentication is NOT enabled by default when running this application locally. Authentication routes and a user object
is provided but is mocked in middleware and routes provided in this project by default.

After setting up the user auth platform locally, authentication can be enabled by setting the `BIO_NANO_AUTH`
environment variable to `1` or by using the `auth-test` npm target.

```
npm run auth
```

Running this command will attempt to access `git.autodesk.com`. [gotcha][]

#### manual user authentication setup
If you want to use/test user authentication locally, do the following:

1) clone the Bio/Nano User Platform repo locally.

```
git clone https://git.autodesk.com/bionano/bio-user-platform.git ~/src/bio-user-platform
cd ~/src/bio-user-platform
git checkout genome-designer
```

2) Install Docker (Don't use brew, go [here](https://docs.docker.com/engine/installation/mac/).)
3) Install Bio/Nano User Platform dependencies

```
cd ~/src/bio-user-platform
npm install
```

4) Start the Authentication Service locally. Choose method:
    1) Docker storage and Docker node
    2) Docker storage + local node (easier debugging)

```
# Method i
# cd ~/src/bio-user-platform
eval "$(docker-machine env default)"
docker-compose up
```

```
# Method ii
# in one terminal:
cd ~/src/bio-user-platform
bash /Applications/Docker/Docker\ Quickstart\ Terminal.app/Contents/Resources/Scripts/start.sh
eval "$(docker-machine env default)"
npm run storage
#
#in another terminal:
cd ~/src/bio-user-platform
npm start
```

5) Start the Genome Designer Application

If you've chosen `method ii` above, you start the Genome Designer normally with `npm run auth`

If you've chosen `method i` above, you need to tell the Genome Designer application to look for the Auth Service on
your docker host.

```
API_END_POINT="http://$(docker-machine ip default):8080/api" npm run auth
```

#### user authentication tests

Currently authentication tests in `test/server/auth/REST.spec.js` require access to an Authentication Server.

#### npm install from git.autodesk.com authentication fails [gotcha] ####

Currently npm won't prompt for username and password when attempting to install a package from a private GitHub
repository. So, if you haven't saved credentials for `git.autodesk.com` into your git credential cache, running
`npm run auth` or `npm run auth-test` will fail when it tries to pull the authentication package from `git.autodesk.com`.
The easiest way to save git credentials is to clone a repository. Instructions for setting up credential caching
can be found [here](https://help.github.com/articles/caching-your-github-password-in-git/).
FYI: After installing you will still need to set your credentials...try something like: 'git clone https://git.autodesk.com/bionano/bio-user-platform.git temp' to force git prompt you for them

### License

Copyright 2015 Autodesk Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

### Third-Party Software Credits and Attributions

Base64@0.2.1 , WTFPL , https://github.com/davidchambers/Base64.js
abbrev@1.0.7 , ISC , https://github.com/isaacs/abbrev-js
acorn-globals@1.0.9 , MIT , https://github.com/ForbesLindesay/acorn-globals
acorn@1.2.2 , MIT , https://github.com/marijnh/acorn
acorn@2.7.0 , MIT , https://github.com/ternjs/acorn
acorn@3.1.0 , MIT , https://github.com/ternjs/acorn
align-text@0.1.4 , MIT , https://github.com/jonschlinkert/align-text
amdefine@1.0.0 , BSD-3-Clause AND MIT , https://github.com/jrburke/amdefine
ansi-regex@2.0.0 , MIT , https://github.com/sindresorhus/ansi-regex
ansi-styles@2.1.0 , MIT , https://github.com/chalk/ansi-styles
ansi-styles@2.2.1 , MIT , https://github.com/chalk/ansi-styles
ansi-to-html-umd@0.4.2 , MIT , https://github.com/rburns/ansi-to-html
ansi@0.3.0 , UNKNOWN , https://github.com/TooTallNate/ansi.js
ansi@0.3.1 , MIT , https://github.com/TooTallNate/ansi.js
anymatch@1.3.0 , ISC , https://github.com/es128/anymatch
are-we-there-yet@1.0.5 , ISC , https://github.com/iarna/are-we-there-yet
are-we-there-yet@1.1.2 , ISC , https://github.com/iarna/are-we-there-yet
argparse@0.1.16 , MIT , https://github.com/nodeca/argparse
arguments-extended@0.0.3 , MIT , https://github.com/doug-martin/arguments-extended
arr-diff@2.0.0 , MIT , https://github.com/jonschlinkert/arr-diff
arr-flatten@1.0.1 , MIT , https://github.com/jonschlinkert/arr-flatten
array-extended@0.0.11 , MIT , https://github.com/doug-martin/array-extended
array-unique@0.2.1 , MIT , https://github.com/jonschlinkert/array-unique
arrify@1.0.1 , MIT , https://github.com/sindresorhus/arrify
asap@1.0.0 , MIT ,
asap@2.0.3 , MIT , https://github.com/kriskowal/asap
asn1@0.2.3 , MIT , https://github.com/mcavage/node-asn1
assert-plus@0.1.5 , UNKNOWN , https://github.com/mcavage/node-assert-plus
assert-plus@0.2.0 , MIT , https://github.com/mcavage/node-assert-plus
assert-plus@1.0.0 , MIT , https://github.com/mcavage/node-assert-plus
assert@1.3.0 , MIT , https://github.com/defunctzombie/commonjs-assert
async-each@1.0.0 , MIT , https://github.com/paulmillr/async-each
async@0.2.10 , MIT , https://github.com/caolan/async
async@0.9.2 , MIT , https://github.com/caolan/async
async@1.5.1 , MIT , https://github.com/caolan/async
async@1.5.2 , MIT , https://github.com/caolan/async
attr-accept@1.0.3 , MIT , https://github.com/okonet/attr-accept
aws-sign2@0.6.0 , Apache-2.0 , https://github.com/mikeal/aws-sign
aws4@1.3.2 , MIT , https://github.com/mhart/aws4
babel-runtime@5.8.38 , MIT , https://github.com/babel/babel
babel-runtime@6.6.1 , MIT , https://github.com/babel/babel/tree/master/packages/babel-runtime
balanced-match@0.4.1 , MIT , https://github.com/juliangruber/balanced-match
base62@0.1.1 , MIT* , https://github.com/andrew/base62.js
base64-js@0.0.8 , MIT , https://github.com/beatgammit/base64-js
big.js@3.1.3 , MIT , https://github.com/MikeMcl/big.js
binary-extensions@1.4.0 , MIT , https://github.com/sindresorhus/binary-extensions
bl@1.0.0 , MIT , https://github.com/rvagg/bl
bl@1.0.3 , MIT , https://github.com/rvagg/bl
block-stream@0.0.8 , ISC , https://github.com/isaacs/block-stream
boom@2.10.1 , BSD-3-Clause , https://github.com/hapijs/boom
bootstrap@3.3.6 , MIT , https://github.com/twbs/bootstrap
brace-expansion@1.1.4 , MIT , https://github.com/juliangruber/brace-expansion
braces@1.8.4 , MIT , https://github.com/jonschlinkert/braces
browserify-zlib@0.1.4 , MIT , https://github.com/devongovett/browserify-zlib
buffer@3.6.0 , MIT , https://github.com/feross/buffer
camelcase@1.2.1 , MIT , https://github.com/sindresorhus/camelcase
caseless@0.11.0 , Apache-2.0 , https://github.com/mikeal/caseless
center-align@0.1.3 , MIT , https://github.com/jonschlinkert/center-align
chalk@1.1.1 , MIT , https://github.com/chalk/chalk
chalk@1.1.3 , MIT , https://github.com/chalk/chalk
character-parser@1.2.1 , MIT , https://github.com/ForbesLindesay/character-parser
charenc@0.0.1 , BSD* , https://github.com/pvorb/node-charenc
chokidar@1.5.0 , MIT , https://github.com/paulmillr/chokidar
classnames@2.2.5 , MIT , https://github.com/JedWatson/classnames
clean-css@3.4.12 , MIT , https://github.com/jakubpawlowicz/clean-css
cliui@2.1.0 , ISC , https://github.com/bcoe/cliui
clone@1.0.2 , MIT , https://github.com/pvorb/node-clone
combined-stream@1.0.5 , MIT , https://github.com/felixge/node-combined-stream
commander@2.6.0 , MIT , https://github.com/tj/commander.js
commander@2.8.1 , MIT , https://github.com/tj/commander.js
commander@2.9.0 , MIT , https://github.com/tj/commander.js
concat-map@0.0.1 , MIT , https://github.com/substack/node-concat-map
console-browserify@1.1.0 , MIT , https://github.com/Raynos/console-browserify
constantinople@3.0.2 , MIT , https://github.com/ForbesLindesay/constantinople
constants-browserify@0.0.1 , MIT , https://github.com/juliangruber/constants-browserify
cookie-parser@1.4.1 , MIT , https://github.com/expressjs/cookie-parser
cookie-signature@1.0.6 , MIT , https://github.com/visionmedia/node-cookie-signature
cookie@0.2.3 , MIT , https://github.com/jshttp/cookie
core-js@1.2.6 , MIT , https://github.com/zloirock/core-js
core-js@2.4.0 , MIT , https://github.com/zloirock/core-js
core-util-is@1.0.2 , MIT , https://github.com/isaacs/core-util-is
crypt@0.0.1 , BSD* , https://github.com/pvorb/node-crypt
cryptiles@2.0.5 , BSD-3-Clause , https://github.com/hapijs/cryptiles
crypto-browserify@3.2.8 , MIT , https://github.com/dominictarr/crypto-browserify
css-parse@1.0.4 , UNKNOWN ,
css-stringify@1.0.5 , UNKNOWN ,
css@1.0.8 , UNKNOWN ,
d3@3.5.17 , BSD-3-Clause , https://github.com/mbostock/d3
dashdash@1.11.0 , MIT , https://github.com/trentm/node-dashdash
dashdash@1.13.0 , MIT , https://github.com/trentm/node-dashdash
date-extended@0.0.6 , MIT , https://github.com/doug-martin/date-extended
date-now@0.1.4 , MIT , https://github.com/Colingo/date-now
debug@0.7.4 , UNKNOWN , https://github.com/visionmedia/debug
debug@2.2.0 , MIT , https://github.com/visionmedia/debug
decamelize@1.2.0 , MIT , https://github.com/sindresorhus/decamelize
declare.js@0.0.8 , MIT , https://github.com/doug-martin/declare.js
deep-equal@1.0.1 , MIT , https://github.com/substack/node-deep-equal
deep-extend@0.4.0 , MIT , https://github.com/unclechu/node-deep-extend
deep-extend@0.4.1 , MIT , https://github.com/unclechu/node-deep-extend
deep-freeze@0.0.1 , public domain , https://github.com/substack/deep-freeze
delayed-stream@1.0.0 , MIT , https://github.com/felixge/node-delayed-stream
delegates@0.1.0 , MIT , https://github.com/visionmedia/node-delegates
delegates@1.0.0 , MIT , https://github.com/visionmedia/node-delegates
dom-helpers@2.4.0 , MIT , https://github.com/jquense/dom-helpers
domain-browser@1.1.7 , MIT , https://github.com/bevry/domain-browser
ecc-jsbn@0.1.1 , MIT , https://github.com/quartzjer/ecc-jsbn
emojis-list@2.0.1 , MIT , https://github.com/kikobeats/emojis-list
encoding@0.1.12 , MIT , https://github.com/andris9/encoding
enhanced-resolve@0.9.1 , MIT , https://github.com/webpack/enhanced-resolve
envify@3.4.0 , MIT , https://github.com/hughsk/envify
errno@0.1.4 , MIT , https://github.com/rvagg/node-errno
escape-string-regexp@1.0.4 , MIT , https://github.com/sindresorhus/escape-string-regexp
escape-string-regexp@1.0.5 , MIT , https://github.com/sindresorhus/escape-string-regexp
esprima-fb@13001.1001.0-dev-harmony-fb , BSD , https://github.com/facebook/esprima
events@1.1.0 , MIT , https://github.com/Gozala/events
expand-brackets@0.1.5 , MIT , https://github.com/jonschlinkert/expand-brackets
expand-range@1.8.2 , MIT , https://github.com/jonschlinkert/expand-range
extend@3.0.0 , MIT , https://github.com/justmoon/node-extend
extended@0.0.6 , MIT , https://github.com/doug-martin/extended
extender@0.0.10 , MIT , https://github.com/doug-martin/extender
extglob@0.3.2 , MIT , https://github.com/jonschlinkert/extglob
extsprintf@1.0.2 , MIT* , https://github.com/davepacheco/node-extsprintf
fast-csv@1.1.0 , MIT , https://github.com/C2FO/fast-csv
fbjs@0.6.1 , BSD-3-Clause , https://github.com/facebook/fbjs
filename-regex@2.0.0 , MIT , https://github.com/regexps/filename-regex
fill-range@2.2.3 , MIT , https://github.com/jonschlinkert/fill-range
for-in@0.1.5 , MIT , https://github.com/jonschlinkert/for-in
for-own@0.1.4 , MIT , https://github.com/jonschlinkert/for-own
forever-agent@0.6.1 , Apache-2.0 , https://github.com/mikeal/forever-agent
form-data@1.0.0-rc3 , MIT , https://github.com/form-data/form-data
form-data@1.0.0-rc4 , MIT , https://github.com/form-data/form-data
formidable@1.0.17 , MIT* , https://github.com/felixge/node-formidable
fs-extra@0.26.7 , MIT , https://github.com/jprichardson/node-fs-extra
fsevents@1.0.12 , MIT , https://github.com/strongloop/fsevents
fstream-ignore@1.0.3 , ISC , https://github.com/isaacs/fstream-ignore
fstream@1.0.8 , ISC , https://github.com/isaacs/fstream
gauge@1.2.2 , ISC , https://github.com/iarna/gauge
gauge@1.2.7 , ISC , https://github.com/iarna/gauge
generate-function@2.0.0 , MIT , https://github.com/mafintosh/generate-function
generate-object-property@1.2.0 , MIT , https://github.com/mafintosh/generate-object-property
genome-designer@0.5.0 , MIT , https://github.com/autodesk-bionano/genome-designer
glob-base@0.3.0 , MIT , https://github.com/jonschlinkert/glob-base
glob-parent@2.0.0 , ISC , https://github.com/es128/glob-parent
glob@4.5.3 , ISC , https://github.com/isaacs/node-glob
glob@6.0.3 , ISC , https://github.com/isaacs/node-glob
glob@7.0.3 , ISC , https://github.com/isaacs/node-glob
graceful-fs@4.1.2 , ISC , https://github.com/isaacs/node-graceful-fs
graceful-fs@4.1.3 , ISC , https://github.com/isaacs/node-graceful-fs
graceful-fs@4.1.4 , ISC , https://github.com/isaacs/node-graceful-fs
graceful-readlink@1.0.1 , MIT , https://github.com/zhiyelee/graceful-readlink
har-validator@2.0.3 , ISC , https://github.com/ahmadnassri/har-validator
har-validator@2.0.6 , ISC , https://github.com/ahmadnassri/har-validator
has-ansi@2.0.0 , MIT , https://github.com/sindresorhus/has-ansi
has-flag@1.0.0 , MIT , https://github.com/sindresorhus/has-flag
has-unicode@1.0.1 , ISC , https://github.com/iarna/has-unicode
has-unicode@2.0.0 , ISC , https://github.com/iarna/has-unicode
hawk@3.1.2 , BSD-3-Clause , https://github.com/hueniverse/hawk
hawk@3.1.3 , BSD-3-Clause , https://github.com/hueniverse/hawk
history@1.17.0 , MIT , https://github.com/rackt/history
history@2.1.1 , MIT , https://github.com/mjackson/history
hoek@2.16.3 , BSD-3-Clause , https://github.com/hapijs/hoek
hoist-non-react-statics@1.0.6 , BSD , https://github.com/mridgway/hoist-non-react-statics
http-browserify@1.7.0 , MIT/X11 , https://github.com/substack/http-browserify
http-signature@1.1.0 , MIT , https://github.com/joyent/node-http-signature
http-signature@1.1.1 , MIT , https://github.com/joyent/node-http-signature
https-browserify@0.0.0 , MIT , https://github.com/substack/https-browserify
iconv-lite@0.4.13 , MIT , https://github.com/ashtuchkin/iconv-lite
ieee754@1.1.6 , MIT , https://github.com/feross/ieee754
indexof@0.0.1 , UNKNOWN ,
inflight@1.0.4 , ISC , https://github.com/isaacs/inflight
inherits@2.0.1 , ISC , https://github.com/isaacs/inherits
ini@1.3.4 , ISC , https://github.com/isaacs/ini
interpret@0.6.6 , MIT , https://github.com/tkellen/node-interpret
invariant@2.2.1 , BSD-3-Clause , https://github.com/zertosh/invariant
ip-regex@1.0.3 , MIT , https://github.com/sindresorhus/ip-regex
is-binary-path@1.0.1 , MIT , https://github.com/sindresorhus/is-binary-path
is-buffer@1.1.3 , MIT , https://github.com/feross/is-buffer
is-dotfile@1.0.2 , MIT , https://github.com/jonschlinkert/is-dotfile
is-equal-shallow@0.1.3 , MIT , https://github.com/jonschlinkert/is-equal-shallow
is-extendable@0.1.1 , MIT , https://github.com/jonschlinkert/is-extendable
is-extended@0.0.10 , MIT , https://github.com/doug-martin/is-extended
is-extglob@1.0.0 , MIT , https://github.com/jonschlinkert/is-extglob
is-glob@2.0.1 , MIT , https://github.com/jonschlinkert/is-glob
is-my-json-valid@2.12.3 , MIT , https://github.com/mafintosh/is-my-json-valid
is-my-json-valid@2.13.1 , MIT , https://github.com/mafintosh/is-my-json-valid
is-number@2.1.0 , MIT , https://github.com/jonschlinkert/is-number
is-posix-bracket@0.1.1 , MIT , https://github.com/jonschlinkert/is-posix-bracket
is-primitive@2.0.0 , MIT , https://github.com/jonschlinkert/is-primitive
is-promise@1.0.1 , MIT , https://github.com/then/is-promise
is-promise@2.1.0 , MIT , https://github.com/then/is-promise
is-property@1.0.2 , MIT , https://github.com/mikolalysenko/is-property
is-stream@1.1.0 , MIT , https://github.com/sindresorhus/is-stream
is-typedarray@1.0.0 , MIT , https://github.com/hughsk/is-typedarray
is-utf8@0.2.1 , MIT , https://github.com/wayfind/is-utf8
isarray@0.0.1 , MIT , https://github.com/juliangruber/isarray
isarray@1.0.0 , MIT , https://github.com/juliangruber/isarray
isobject@2.1.0 , MIT , https://github.com/jonschlinkert/isobject
isomorphic-fetch@2.2.1 , MIT , https://github.com/matthew-andrews/isomorphic-fetch
isstream@0.1.2 , MIT , https://github.com/rvagg/isstream
jade@1.11.0 , MIT , https://github.com/jadejs/jade
jodid25519@1.0.2 , MIT , https://github.com/meganz/jodid25519
jquery@2.2.3 , MIT , https://github.com/jquery/jquery
js-tokens@1.0.3 , MIT , https://github.com/lydell/js-tokens
jsbn@0.1.0 , BSD , https://github.com/andyperlitch/jsbn
json-schema@0.2.2 , AFLv2.1,BSD , https://github.com/kriszyp/json-schema
json-stringify-safe@5.0.1 , ISC , https://github.com/isaacs/json-stringify-safe
json5@0.5.0 , MIT , https://github.com/aseemk/json5
jsonfile@2.3.1 , MIT , https://github.com/jprichardson/node-jsonfile
jsonpointer@2.0.0 , MIT , https://github.com/janl/node-jsonpointer
jsprim@1.2.2 , MIT , https://github.com/davepacheco/node-jsprim
jstransform@10.1.0 , Apache-2.0 , https://github.com/facebook/jstransform
jstransformer@0.0.2 , MIT , https://github.com/jstransformers/jstransformer
keycode@2.1.1 , MIT , https://github.com/timoxley/keycode
kind-of@3.0.3 , MIT , https://github.com/jonschlinkert/kind-of
klaw@1.3.0 , MIT , https://github.com/jprichardson/node-klaw
lazy-cache@1.0.4 , MIT , https://github.com/jonschlinkert/lazy-cache
load-script@1.0.0 , MIT , https://github.com/eldargab/load-script
loader-utils@0.2.15 , MIT , https://github.com/webpack/loader-utils
lodash-compat@3.10.2 , MIT , https://github.com/lodash/lodash-compat
lodash-es@4.12.0 , MIT , https://github.com/lodash/lodash
lodash._arraycopy@3.0.0 , MIT , https://github.com/lodash/lodash
lodash._arrayeach@3.0.0 , MIT , https://github.com/lodash/lodash
lodash._baseassign@3.2.0 , MIT , https://github.com/lodash/lodash
lodash._baseclone@3.3.0 , MIT , https://github.com/lodash/lodash
lodash._basecopy@3.0.1 , MIT , https://github.com/lodash/lodash
lodash._basefor@3.0.3 , MIT , https://github.com/lodash/lodash
lodash._basetostring@3.0.1 , MIT , https://github.com/lodash/lodash
lodash._bindcallback@3.0.1 , MIT , https://github.com/lodash/lodash
lodash._createassigner@3.1.1 , MIT , https://github.com/lodash/lodash
lodash._createpadding@3.6.1 , MIT , https://github.com/lodash/lodash
lodash._getnative@3.9.1 , MIT , https://github.com/lodash/lodash
lodash._isiterateecall@3.0.9 , MIT , https://github.com/lodash/lodash
lodash._topath@3.8.1 , MIT , https://github.com/lodash/lodash
lodash.clonedeep@3.0.2 , MIT , https://github.com/lodash/lodash
lodash.debounce@3.1.1 , MIT , https://github.com/lodash/lodash
lodash.isarguments@3.0.8 , MIT , https://github.com/lodash/lodash
lodash.isarray@3.0.4 , MIT , https://github.com/lodash/lodash
lodash.isplainobject@3.2.0 , MIT , https://github.com/lodash/lodash
lodash.istypedarray@3.0.6 , MIT , https://github.com/lodash/lodash
lodash.keys@3.1.2 , MIT , https://github.com/lodash/lodash
lodash.keysin@3.0.8 , MIT , https://github.com/lodash/lodash
lodash.merge@3.3.2 , MIT , https://github.com/lodash/lodash
lodash.pad@3.1.1 , MIT , https://github.com/lodash/lodash
lodash.pad@4.1.0 , MIT , https://github.com/lodash/lodash
lodash.padend@4.2.0 , MIT , https://github.com/lodash/lodash
lodash.padleft@3.1.1 , MIT , https://github.com/lodash/lodash
lodash.padright@3.1.1 , MIT , https://github.com/lodash/lodash
lodash.padstart@4.2.0 , MIT , https://github.com/lodash/lodash
lodash.repeat@3.0.1 , MIT , https://github.com/lodash/lodash
lodash.repeat@4.0.0 , MIT , https://github.com/lodash/lodash
lodash.restparam@3.6.1 , MIT , https://github.com/lodash/lodash
lodash.set@3.7.4 , MIT , https://github.com/lodash/lodash
lodash.toplainobject@3.0.0 , MIT , https://github.com/lodash/lodash
lodash.tostring@4.1.2 , MIT , https://github.com/lodash/lodash
lodash@3.10.1 , MIT , https://github.com/lodash/lodash
lodash@4.12.0 , MIT , https://github.com/lodash/lodash
longest@1.0.1 , MIT , https://github.com/jonschlinkert/longest
loose-envify@1.2.0 , MIT , https://github.com/zertosh/loose-envify
lru-cache@4.0.1 , ISC , https://github.com/isaacs/node-lru-cache
md5@2.1.0 , BSD-3-Clause , https://github.com/pvorb/node-md5
memory-fs@0.2.0 , MIT , https://github.com/webpack/memory-fs
memory-fs@0.3.0 , MIT , https://github.com/webpack/memory-fs
micromatch@2.3.8 , MIT , https://github.com/jonschlinkert/micromatch
mime-db@1.21.0 , MIT , https://github.com/jshttp/mime-db
mime-db@1.22.0 , MIT , https://github.com/jshttp/mime-db
mime-types@2.1.10 , MIT , https://github.com/jshttp/mime-types
mime-types@2.1.9 , MIT , https://github.com/jshttp/mime-types
minimatch@2.0.10 , ISC , https://github.com/isaacs/minimatch
minimatch@3.0.0 , ISC , https://github.com/isaacs/minimatch
minimist@0.0.8 , MIT , https://github.com/substack/minimist
minimist@1.2.0 , MIT , https://github.com/substack/minimist
mkdirp@0.5.1 , MIT , https://github.com/substack/node-mkdirp
mkpath@1.0.0 , MIT , https://github.com/jrajav/mkpath
mousetrap@1.5.3 , Apache 2.0 , https://github.com/ccampbell/mousetrap
ms@0.7.1 , MIT* , https://github.com/guille/ms.js
nan@2.3.3 , MIT , https://github.com/nodejs/nan
node-fetch@1.5.2 , MIT , https://github.com/bitinn/node-fetch
node-libs-browser@0.5.3 , MIT , https://github.com/webpack/node-libs-browser
node-pre-gyp@0.6.19 , BSD , https://github.com/mapbox/node-pre-gyp
node-pre-gyp@0.6.25 , BSD , https://github.com/mapbox/node-pre-gyp
node-uuid@1.4.7 , MIT , https://github.com/broofa/node-uuid
nodegit-promise@4.0.0 , MIT , https://github.com/nodegit/promise
nodegit@0.9.0 , MIT , https://github.com/nodegit/nodegit
nopt@3.0.6 , ISC , https://github.com/npm/nopt
normalize-path@2.0.1 , MIT , https://github.com/jonschlinkert/normalize-path
normalize.css@3.0.3 , MIT , https://github.com/necolas/normalize.css
normalizr@1.4.1 , MIT , https://github.com/gaearon/normalizr
npmlog@2.0.0 , ISC , https://github.com/npm/npmlog
npmlog@2.0.3 , ISC , https://github.com/npm/npmlog
oauth-sign@0.8.0 , Apache-2.0 , https://github.com/mikeal/oauth-sign
oauth-sign@0.8.1 , Apache-2.0 , https://github.com/mikeal/oauth-sign
object-assign@4.1.0 , MIT , https://github.com/sindresorhus/object-assign
object-extended@0.0.7 , MIT , https://github.com/doug-martin/object-extended
object.omit@2.0.0 , MIT , https://github.com/jonschlinkert/object.omit
once@1.1.1 , BSD , https://github.com/isaacs/once
once@1.3.3 , ISC , https://github.com/isaacs/once
optimist@0.3.7 , MIT/X11 , https://github.com/substack/node-optimist
optimist@0.6.1 , MIT/X11 , https://github.com/substack/node-optimist
os-browserify@0.1.2 , MIT , https://github.com/drewyoung1/os-browserify
pako@0.2.8 , MIT , https://github.com/nodeca/pako
parse-glob@3.0.4 , MIT , https://github.com/jonschlinkert/parse-glob
path-browserify@0.0.0 , MIT , https://github.com/substack/path-browserify
path-is-absolute@1.0.0 , MIT , https://github.com/sindresorhus/path-is-absolute
pbkdf2-compat@2.0.1 , MIT , https://github.com/dcousens/pbkdf2-compat
pinkie-promise@2.0.0 , MIT , https://github.com/floatdrop/pinkie-promise
pinkie@2.0.1 , MIT , https://github.com/floatdrop/pinkie
pinkie@2.0.4 , MIT , https://github.com/floatdrop/pinkie
preserve@0.2.0 , MIT , https://github.com/jonschlinkert/preserve
process-nextick-args@1.0.6 , MIT , https://github.com/calvinmetcalf/process-nextick-args
process-nextick-args@1.0.7 , MIT , https://github.com/calvinmetcalf/process-nextick-args
process@0.11.3 , MIT , https://github.com/shtylman/node-process
promise@2.0.0 , MIT , https://github.com/then/promise
promise@6.1.0 , MIT , https://github.com/then/promise
promise@7.1.1 , MIT , https://github.com/then/promise
promised-exec@1.0.1 , MIT , https://github.com/yakimchuk/promised-exec
promisify-node@0.3.0 , MIT , https://github.com/nodegit/promisify-node
prr@0.0.0 , MIT , https://github.com/rvagg/prr
pseudomap@1.0.2 , ISC , https://github.com/isaacs/pseudomap
punycode@1.3.2 , MIT , https://github.com/bestiejs/punycode.js
punycode@1.4.1 , MIT , https://github.com/bestiejs/punycode.js
q@1.4.1 , MIT , https://github.com/kriskowal/q
qs@5.2.0 , BSD-3-Clause , https://github.com/hapijs/qs
qs@6.0.2 , BSD-3-Clause , https://github.com/ljharb/qs
query-string@3.0.3 , MIT , https://github.com/sindresorhus/query-string
querystring-es3@0.2.1 , MIT , https://github.com/mike-spainhower/querystring
querystring@0.2.0 , MIT , https://github.com/Gozala/querystring
random-js@1.0.8 , MIT , https://github.com/ckknight/random-js
randomatic@1.1.5 , MIT , https://github.com/jonschlinkert/randomatic
rc@1.1.6 , (BSD-2-Clause OR MIT OR Apache-2.0) , https://github.com/dominictarr/rc
react-addons-clone-with-props@0.14.8 , BSD-3-Clause , https://github.com/facebook/react
react-addons-css-transition-group@0.14.8 , BSD-3-Clause , https://github.com/facebook/react
react-addons-test-utils@0.14.2 , BSD-3-Clause ,
react-bootstrap@0.28.5 , MIT , https://github.com/react-bootstrap/react-bootstrap
react-dom@0.14.2 , BSD-3-Clause , https://github.com/facebook/react
react-dropzone@3.4.0 , MIT , https://github.com/okonet/react-dropzone
react-overlays@0.6.3 , MIT , https://github.com/react-bootstrap/react-overlays
react-prop-types@0.2.2 , MIT , https://github.com/react-bootstrap/react-prop-types
react-prop-types@0.3.2 , MIT , https://github.com/react-bootstrap/react-prop-types
react-redux@3.1.2 , MIT , https://github.com/gaearon/react-redux
react-router-redux@4.0.4 , MIT , https://github.com/reactjs/react-router-redux
react-router@2.4.0 , MIT , https://github.com/reactjs/react-router
react@0.14.8 , BSD-3-Clause , https://github.com/facebook/react
read-multiple-files@1.1.1 , MIT , https://github.com/shinnn/read-multiple-files
readable-stream@1.1.14 , MIT , https://github.com/isaacs/readable-stream
readable-stream@2.0.5 , MIT , https://github.com/nodejs/readable-stream
readable-stream@2.0.6 , MIT , https://github.com/nodejs/readable-stream
readable-stream@2.1.2 , MIT , https://github.com/nodejs/readable-stream
readdirp@2.0.0 , MIT , https://github.com/thlorenz/readdirp
redux-logger@2.6.1 , MIT , https://github.com/fcomb/redux-logger
redux-thunk@0.1.0 , MIT , https://github.com/gaearon/redux-thunk
redux@3.5.2 , MIT , https://github.com/reactjs/redux
regex-cache@0.4.3 , MIT , https://github.com/jonschlinkert/regex-cache
repeat-element@1.1.2 , MIT , https://github.com/jonschlinkert/repeat-element
repeat-string@1.5.4 , MIT , https://github.com/jonschlinkert/repeat-string
request@2.67.0 , Apache-2.0 , https://github.com/request/request
request@2.69.0 , Apache-2.0 , https://github.com/request/request
right-align@0.1.3 , MIT , https://github.com/jonschlinkert/right-align
rimraf@2.4.5 , ISC , https://github.com/isaacs/rimraf
rimraf@2.5.0 , ISC , https://github.com/isaacs/rimraf
rimraf@2.5.2 , ISC , https://github.com/isaacs/rimraf
ripemd160@0.2.0 , UNKNOWN , https://github.com/cryptocoinjs/ripemd160
run-parallel@1.1.6 , MIT , https://github.com/feross/run-parallel
semver@5.1.0 , ISC , https://github.com/npm/node-semver
sha.js@2.2.6 , MIT , https://github.com/dominictarr/sha.js
sha1@1.1.1 , BSD-3-Clause , https://github.com/pvorb/node-sha1
sntp@1.0.9 , BSD , https://github.com/hueniverse/sntp
source-list-map@0.1.6 , MIT , https://github.com/webpack/source-list-map
source-map@0.1.31 , BSD , https://github.com/mozilla/source-map
source-map@0.1.43 , BSD , https://github.com/mozilla/source-map
source-map@0.4.4 , BSD-3-Clause , https://github.com/mozilla/source-map
source-map@0.5.6 , BSD-3-Clause , https://github.com/mozilla/source-map
sshpk@1.7.2 , MIT , https://github.com/arekinath/node-sshpk
sshpk@1.7.4 , MIT , https://github.com/arekinath/node-sshpk
stream-browserify@1.0.0 , MIT , https://github.com/substack/stream-browserify
strict-uri-encode@1.1.0 , MIT , https://github.com/kevva/strict-uri-encode
string-extended@0.0.8 , MIT , https://github.com/doug-martin/string-extended
string_decoder@0.10.31 , MIT , https://github.com/rvagg/string_decoder
stringstream@0.0.5 , MIT , https://github.com/mhart/StringStream
strip-ansi@3.0.0 , MIT , https://github.com/sindresorhus/strip-ansi
strip-ansi@3.0.1 , MIT , https://github.com/chalk/strip-ansi
strip-bom@2.0.0 , MIT , https://github.com/sindresorhus/strip-bom
strip-json-comments@1.0.4 , MIT , https://github.com/sindresorhus/strip-json-comments
supports-color@2.0.0 , MIT , https://github.com/chalk/supports-color
supports-color@3.1.2 , MIT , https://github.com/chalk/supports-color
symbol-observable@0.2.4 , MIT , https://github.com/blesh/symbol-observable
tapable@0.1.10 , MIT , https://github.com/webpack/tapable
tar-pack@3.1.2 , BSD , https://github.com/ForbesLindesay/tar-pack
tar-pack@3.1.3 , BSD-2-Clause , https://github.com/ForbesLindesay/tar-pack
tar@2.2.1 , ISC , https://github.com/isaacs/node-tar
through@2.3.8 , MIT , https://github.com/dominictarr/through
timers-browserify@1.4.2 , MIT , https://github.com/jryans/timers-browserify
tough-cookie@2.2.1 , BSD-3-Clause , https://github.com/SalesforceEng/tough-cookie
tough-cookie@2.2.2 , BSD-3-Clause , https://github.com/SalesforceEng/tough-cookie
transformers@2.1.0 , MIT , https://github.com/ForbesLindesay/transformers
tty-browserify@0.0.0 , MIT , https://github.com/substack/tty-browserify
tunnel-agent@0.4.2 , Apache-2.0 , https://github.com/mikeal/tunnel-agent
tweetnacl@0.13.2 , CC0-1.0 , https://github.com/dchest/tweetnacl-js
tweetnacl@0.14.3 , SEE LICENSE IN COPYING.txt , https://github.com/dchest/tweetnacl-js
ua-parser-js@0.7.10 , GPLv2,MIT , https://github.com/faisalman/ua-parser-js
uglify-js@2.2.5 , UNKNOWN , https://github.com/mishoo/UglifyJS2
uglify-js@2.6.2 , BSD-2-Clause , https://github.com/mishoo/UglifyJS2
uglify-to-browserify@1.0.2 , MIT , https://github.com/ForbesLindesay/uglify-to-browserify
uid-number@0.0.3 , BSD , https://github.com/isaacs/uid-number
uid-number@0.0.6 , ISC , https://github.com/isaacs/uid-number
uncontrollable@3.2.4 , MIT , https://github.com/jquense/uncontrollable
underscore.string@2.4.0 , MIT , https://github.com/epeli/underscore.string
underscore@1.7.0 , MIT , https://github.com/jashkenas/underscore
url-regex@3.1.1 , MIT , https://github.com/kevva/url-regex
url@0.10.3 , MIT , https://github.com/defunctzombie/node-url
util-deprecate@1.0.2 , MIT , https://github.com/TooTallNate/util-deprecate
util@0.10.3 , MIT , https://github.com/defunctzombie/node-util
verror@1.3.6 , MIT* , https://github.com/davepacheco/node-verror
vm-browserify@0.0.4 , MIT , https://github.com/substack/vm-browserify
void-elements@2.0.1 , MIT , https://github.com/hemanth/void-elements
warning@2.1.0 , BSD-2-Clause , https://github.com/r3dm/warning
watchpack@0.2.9 , MIT , https://github.com/webpack/watchpack
webpack-core@0.6.8 , MIT , https://github.com/webpack/core
webpack@1.13.0 , MIT , https://github.com/webpack/webpack
whatwg-fetch@0.9.0 , MIT , https://github.com/github/fetch
whatwg-fetch@1.0.0 , MIT , https://github.com/github/fetch
window-size@0.1.0 , MIT , https://github.com/jonschlinkert/window-size
with@4.0.3 , MIT , https://github.com/ForbesLindesay/with
wordwrap@0.0.2 , MIT/X11 , https://github.com/substack/node-wordwrap
wordwrap@0.0.3 , MIT , https://github.com/substack/node-wordwrap
wrappy@1.0.1 , ISC , https://github.com/npm/wrappy
xtend@4.0.1 , MIT , https://github.com/Raynos/xtend
yallist@2.0.0 , ISC , https://github.com/isaacs/yallist
yamljs@0.2.7 , MIT , https://github.com/jeremyfa/yaml.js
yargs@3.10.0 , MIT , https://github.com/bcoe/yargs
