import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiShowAbout } from '../actions/ui';
import ModalWindow from './modal/modalwindow';

import '../../src/styles/form.css';
import '../../src/styles/aboutform.css';

class AboutForm extends Component {

  static propTypes = {
    uiShowAbout: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (<ModalWindow
      open={this.props.open}
      title="Genome Designer"
      closeOnClickOutside
      closeModal={(buttonText) => {
        this.props.uiShowAbout(false);
      }}
      payload={
          <div className="gd-form aboutform">
            <div className="image">
              <img style={{borderRadius: 0}} className="background" src="/images/homepage/tiles.jpg"/>
                <div className="name">
                  <div className="lighter">Autodesk&nbsp;</div>
                  <div>Genetic Constructor</div>
                </div>
            </div>
            <div className="text">
              <div className="heading">
                © 2016 Autodesk, Inc. All rights reserved.
              </div>
              All use of this Service is subject to the terms and conditions of the A360 Terms of Service and Privacy Statement accepted upon access of this Service.
              This service may incorporate or use background Autodesk technology components. For information about these components, click here:
              <a target="_blank" href="http://www.autodesk.com/cloud-platform-components">&nbsp;www.autodesk.com/cloud-platform-components</a>
              <div className="heading">
                Trademarks
              </div>
              Autodesk is a registered trademark or trademark of Autodesk, Inc., and/or its subsidiaries and/or affiliates.
              All other brand names, product names or trademarks belong to their respective holders.
              <div className="heading">
                Third-Party Software Credits and Attributions
              </div>
              Base64@0.2.1 , WTFPL , https://github.com/davidchambers/Base64.js <br/>
              abbrev@1.0.7 , ISC , https://github.com/isaacs/abbrev-js <br/>
              acorn-globals@1.0.9 , MIT , https://github.com/ForbesLindesay/acorn-globals <br/>
              acorn@1.2.2 , MIT , https://github.com/marijnh/acorn <br/>
              acorn@2.7.0 , MIT , https://github.com/ternjs/acorn <br/>
              acorn@3.1.0 , MIT , https://github.com/ternjs/acorn <br/>
              align-text@0.1.4 , MIT , https://github.com/jonschlinkert/align-text <br/>
              amdefine@1.0.0 , BSD-3-Clause AND MIT , https://github.com/jrburke/amdefine <br/>
              ansi-regex@2.0.0 , MIT , https://github.com/sindresorhus/ansi-regex <br/>
              ansi-styles@2.1.0 , MIT , https://github.com/chalk/ansi-styles <br/>
              ansi-styles@2.2.1 , MIT , https://github.com/chalk/ansi-styles <br/>
              ansi-to-html-umd@0.4.2 , MIT , https://github.com/rburns/ansi-to-html  <br/>
              ansi@0.3.0 , UNKNOWN , https://github.com/TooTallNate/ansi.js <br/>
              ansi@0.3.1 , MIT , https://github.com/TooTallNate/ansi.js <br/>
              anymatch@1.3.0 , ISC , https://github.com/es128/anymatch <br/>
              are-we-there-yet@1.0.5 , ISC , https://github.com/iarna/are-we-there-yet <br/>
              are-we-there-yet@1.1.2 , ISC , https://github.com/iarna/are-we-there-yet <br/>
              argparse@0.1.16 , MIT , https://github.com/nodeca/argparse <br/>
              arguments-extended@0.0.3 , MIT , https://github.com/doug-martin/arguments-extended <br/>
              arr-diff@2.0.0 , MIT , https://github.com/jonschlinkert/arr-diff <br/>
              arr-flatten@1.0.1 , MIT , https://github.com/jonschlinkert/arr-flatten <br/>
              array-extended@0.0.11 , MIT , https://github.com/doug-martin/array-extended <br/>
              array-unique@0.2.1 , MIT , https://github.com/jonschlinkert/array-unique <br/>
              arrify@1.0.1 , MIT , https://github.com/sindresorhus/arrify <br/>
              asap@1.0.0 , MIT , <br/>
              asap@2.0.3 , MIT , https://github.com/kriskowal/asap <br/>
              asn1@0.2.3 , MIT , https://github.com/mcavage/node-asn1 <br/>
              assert-plus@0.1.5 , UNKNOWN , https://github.com/mcavage/node-assert-plus <br/>
              assert-plus@0.2.0 , MIT , https://github.com/mcavage/node-assert-plus <br/>
              assert-plus@1.0.0 , MIT , https://github.com/mcavage/node-assert-plus <br/>
              assert@1.3.0 , MIT , https://github.com/defunctzombie/commonjs-assert <br/>
              async-each@1.0.0 , MIT , https://github.com/paulmillr/async-each <br/>
              async@0.2.10 , MIT , https://github.com/caolan/async <br/>
              async@0.9.2 , MIT , https://github.com/caolan/async <br/>
              async@1.5.1 , MIT , https://github.com/caolan/async <br/>
              async@1.5.2 , MIT , https://github.com/caolan/async <br/>
              attr-accept@1.0.3 , MIT , https://github.com/okonet/attr-accept <br/>
              aws-sign2@0.6.0 , Apache-2.0 , https://github.com/mikeal/aws-sign <br/>
              aws4@1.3.2 , MIT , https://github.com/mhart/aws4 <br/>
              babel-runtime@5.8.38 , MIT , https://github.com/babel/babel <br/>
              babel-runtime@6.6.1 , MIT , https://github.com/babel/babel/tree/master/packages/babel-runtime <br/>
              balanced-match@0.4.1 , MIT , https://github.com/juliangruber/balanced-match <br/>
              base62@0.1.1 , MIT* , https://github.com/andrew/base62.js <br/>
              base64-js@0.0.8 , MIT , https://github.com/beatgammit/base64-js <br/>
              big.js@3.1.3 , MIT , https://github.com/MikeMcl/big.js <br/>
              binary-extensions@1.4.0 , MIT , https://github.com/sindresorhus/binary-extensions <br/>
              bl@1.0.0 , MIT , https://github.com/rvagg/bl <br/>
              bl@1.0.3 , MIT , https://github.com/rvagg/bl <br/>
              block-stream@0.0.8 , ISC , https://github.com/isaacs/block-stream <br/>
              boom@2.10.1 , BSD-3-Clause , https://github.com/hapijs/boom <br/>
              bootstrap@3.3.6 , MIT , https://github.com/twbs/bootstrap <br/>
              brace-expansion@1.1.4 , MIT , https://github.com/juliangruber/brace-expansion <br/>
              braces@1.8.4 , MIT , https://github.com/jonschlinkert/braces <br/>
              browserify-zlib@0.1.4 , MIT , https://github.com/devongovett/browserify-zlib <br/>
              buffer@3.6.0 , MIT , https://github.com/feross/buffer <br/>
              camelcase@1.2.1 , MIT , https://github.com/sindresorhus/camelcase <br/>
              caseless@0.11.0 , Apache-2.0 , https://github.com/mikeal/caseless <br/>
              center-align@0.1.3 , MIT , https://github.com/jonschlinkert/center-align <br/>
              chalk@1.1.1 , MIT , https://github.com/chalk/chalk <br/>
              chalk@1.1.3 , MIT , https://github.com/chalk/chalk <br/>
              character-parser@1.2.1 , MIT , https://github.com/ForbesLindesay/character-parser <br/>
              charenc@0.0.1 , BSD* , https://github.com/pvorb/node-charenc <br/>
              chokidar@1.5.0 , MIT , https://github.com/paulmillr/chokidar <br/>
              classnames@2.2.5 , MIT , https://github.com/JedWatson/classnames <br/>
              clean-css@3.4.12 , MIT , https://github.com/jakubpawlowicz/clean-css <br/>
              cliui@2.1.0 , ISC , https://github.com/bcoe/cliui <br/>
              clone@1.0.2 , MIT , https://github.com/pvorb/node-clone <br/>
              combined-stream@1.0.5 , MIT , https://github.com/felixge/node-combined-stream <br/>
              commander@2.6.0 , MIT , https://github.com/tj/commander.js <br/>
              commander@2.8.1 , MIT , https://github.com/tj/commander.js <br/>
              commander@2.9.0 , MIT , https://github.com/tj/commander.js <br/>
              concat-map@0.0.1 , MIT , https://github.com/substack/node-concat-map <br/>
              console-browserify@1.1.0 , MIT , https://github.com/Raynos/console-browserify <br/>
              constantinople@3.0.2 , MIT , https://github.com/ForbesLindesay/constantinople <br/>
              constants-browserify@0.0.1 , MIT , https://github.com/juliangruber/constants-browserify <br/>
              cookie-parser@1.4.1 , MIT , https://github.com/expressjs/cookie-parser <br/>
              cookie-signature@1.0.6 , MIT , https://github.com/visionmedia/node-cookie-signature <br/>
              cookie@0.2.3 , MIT , https://github.com/jshttp/cookie <br/>
              core-js@1.2.6 , MIT , https://github.com/zloirock/core-js <br/>
              core-js@2.4.0 , MIT , https://github.com/zloirock/core-js <br/>
              core-util-is@1.0.2 , MIT , https://github.com/isaacs/core-util-is <br/>
              crypt@0.0.1 , BSD* , https://github.com/pvorb/node-crypt <br/>
              cryptiles@2.0.5 , BSD-3-Clause , https://github.com/hapijs/cryptiles <br/>
              crypto-browserify@3.2.8 , MIT , https://github.com/dominictarr/crypto-browserify <br/>
              css-parse@1.0.4 , UNKNOWN , <br/>
              css-stringify@1.0.5 , UNKNOWN , <br/>
              css@1.0.8 , UNKNOWN , <br/>
              d3@3.5.17 , BSD-3-Clause , https://github.com/mbostock/d3 <br/>
              dashdash@1.11.0 , MIT , https://github.com/trentm/node-dashdash <br/>
              dashdash@1.13.0 , MIT , https://github.com/trentm/node-dashdash <br/>
              date-extended@0.0.6 , MIT , https://github.com/doug-martin/date-extended <br/>
              date-now@0.1.4 , MIT , https://github.com/Colingo/date-now <br/>
              debug@0.7.4 , UNKNOWN , https://github.com/visionmedia/debug <br/>
              debug@2.2.0 , MIT , https://github.com/visionmedia/debug <br/>
              decamelize@1.2.0 , MIT , https://github.com/sindresorhus/decamelize <br/>
              declare.js@0.0.8 , MIT , https://github.com/doug-martin/declare.js <br/>
              deep-equal@1.0.1 , MIT , https://github.com/substack/node-deep-equal <br/>
              deep-extend@0.4.0 , MIT , https://github.com/unclechu/node-deep-extend <br/>
              deep-extend@0.4.1 , MIT , https://github.com/unclechu/node-deep-extend <br/>
              deep-freeze@0.0.1 , public domain , https://github.com/substack/deep-freeze <br/>
              delayed-stream@1.0.0 , MIT , https://github.com/felixge/node-delayed-stream <br/>
              delegates@0.1.0 , MIT , https://github.com/visionmedia/node-delegates <br/>
              delegates@1.0.0 , MIT , https://github.com/visionmedia/node-delegates <br/>
              dom-helpers@2.4.0 , MIT , https://github.com/jquense/dom-helpers <br/>
              domain-browser@1.1.7 , MIT , https://github.com/bevry/domain-browser <br/>
              ecc-jsbn@0.1.1 , MIT , https://github.com/quartzjer/ecc-jsbn <br/>
              emojis-list@2.0.1 , MIT , https://github.com/kikobeats/emojis-list <br/>
              encoding@0.1.12 , MIT , https://github.com/andris9/encoding <br/>
              enhanced-resolve@0.9.1 , MIT , https://github.com/webpack/enhanced-resolve <br/>
              envify@3.4.0 , MIT , https://github.com/hughsk/envify <br/>
              errno@0.1.4 , MIT , https://github.com/rvagg/node-errno <br/>
              escape-string-regexp@1.0.4 , MIT , https://github.com/sindresorhus/escape-string-regexp <br/>
              escape-string-regexp@1.0.5 , MIT , https://github.com/sindresorhus/escape-string-regexp <br/>
              esprima-fb@13001.1001.0-dev-harmony-fb , BSD , https://github.com/facebook/esprima <br/>
              events@1.1.0 , MIT , https://github.com/Gozala/events <br/>
              expand-brackets@0.1.5 , MIT , https://github.com/jonschlinkert/expand-brackets <br/>
              expand-range@1.8.2 , MIT , https://github.com/jonschlinkert/expand-range <br/>
              extend@3.0.0 , MIT , https://github.com/justmoon/node-extend <br/>
              extended@0.0.6 , MIT , https://github.com/doug-martin/extended <br/>
              extender@0.0.10 , MIT , https://github.com/doug-martin/extender <br/>
              extglob@0.3.2 , MIT , https://github.com/jonschlinkert/extglob <br/>
              extsprintf@1.0.2 , MIT* , https://github.com/davepacheco/node-extsprintf <br/>
              fast-csv@1.1.0 , MIT , https://github.com/C2FO/fast-csv <br/>
              fbjs@0.6.1 , BSD-3-Clause , https://github.com/facebook/fbjs <br/>
              filename-regex@2.0.0 , MIT , https://github.com/regexps/filename-regex <br/>
              fill-range@2.2.3 , MIT , https://github.com/jonschlinkert/fill-range <br/>
              for-in@0.1.5 , MIT , https://github.com/jonschlinkert/for-in <br/>
              for-own@0.1.4 , MIT , https://github.com/jonschlinkert/for-own <br/>
              forever-agent@0.6.1 , Apache-2.0 , https://github.com/mikeal/forever-agent <br/>
              form-data@1.0.0-rc3 , MIT , https://github.com/form-data/form-data <br/>
              form-data@1.0.0-rc4 , MIT , https://github.com/form-data/form-data <br/>
              formidable@1.0.17 , MIT* , https://github.com/felixge/node-formidable <br/>
              fs-extra@0.26.7 , MIT , https://github.com/jprichardson/node-fs-extra <br/>
              fsevents@1.0.12 , MIT , https://github.com/strongloop/fsevents <br/>
              fstream-ignore@1.0.3 , ISC , https://github.com/isaacs/fstream-ignore <br/>
              fstream@1.0.8 , ISC , https://github.com/isaacs/fstream <br/>
              gauge@1.2.2 , ISC , https://github.com/iarna/gauge <br/>
              gauge@1.2.7 , ISC , https://github.com/iarna/gauge <br/>
              generate-function@2.0.0 , MIT , https://github.com/mafintosh/generate-function <br/>
              generate-object-property@1.2.0 , MIT , https://github.com/mafintosh/generate-object-property <br/>
              genome-designer@0.5.0 , MIT , https://github.com/autodesk-bionano/genome-designer <br/>
              glob-base@0.3.0 , MIT , https://github.com/jonschlinkert/glob-base <br/>
              glob-parent@2.0.0 , ISC , https://github.com/es128/glob-parent <br/>
              glob@4.5.3 , ISC , https://github.com/isaacs/node-glob <br/>
              glob@6.0.3 , ISC , https://github.com/isaacs/node-glob <br/>
              glob@7.0.3 , ISC , https://github.com/isaacs/node-glob <br/>
              graceful-fs@4.1.2 , ISC , https://github.com/isaacs/node-graceful-fs <br/>
              graceful-fs@4.1.3 , ISC , https://github.com/isaacs/node-graceful-fs <br/>
              graceful-fs@4.1.4 , ISC , https://github.com/isaacs/node-graceful-fs <br/>
              graceful-readlink@1.0.1 , MIT , https://github.com/zhiyelee/graceful-readlink <br/>
              har-validator@2.0.3 , ISC , https://github.com/ahmadnassri/har-validator <br/>
              har-validator@2.0.6 , ISC , https://github.com/ahmadnassri/har-validator <br/>
              has-ansi@2.0.0 , MIT , https://github.com/sindresorhus/has-ansi <br/>
              has-flag@1.0.0 , MIT , https://github.com/sindresorhus/has-flag <br/>
              has-unicode@1.0.1 , ISC , https://github.com/iarna/has-unicode <br/>
              has-unicode@2.0.0 , ISC , https://github.com/iarna/has-unicode <br/>
              hawk@3.1.2 , BSD-3-Clause , https://github.com/hueniverse/hawk <br/>
              hawk@3.1.3 , BSD-3-Clause , https://github.com/hueniverse/hawk <br/>
              history@1.17.0 , MIT , https://github.com/rackt/history <br/>
              history@2.1.1 , MIT , https://github.com/mjackson/history <br/>
              hoek@2.16.3 , BSD-3-Clause , https://github.com/hapijs/hoek <br/>
              hoist-non-react-statics@1.0.6 , BSD , https://github.com/mridgway/hoist-non-react-statics <br/>
              http-browserify@1.7.0 , MIT/X11 , https://github.com/substack/http-browserify <br/>
              http-signature@1.1.0 , MIT , https://github.com/joyent/node-http-signature <br/>
              http-signature@1.1.1 , MIT , https://github.com/joyent/node-http-signature <br/>
              https-browserify@0.0.0 , MIT , https://github.com/substack/https-browserify <br/>
              iconv-lite@0.4.13 , MIT , https://github.com/ashtuchkin/iconv-lite <br/>
              ieee754@1.1.6 , MIT , https://github.com/feross/ieee754 <br/>
              indexof@0.0.1 , UNKNOWN , <br/>
              inflight@1.0.4 , ISC , https://github.com/isaacs/inflight <br/>
              inherits@2.0.1 , ISC , https://github.com/isaacs/inherits <br/>
              ini@1.3.4 , ISC , https://github.com/isaacs/ini <br/>
              interpret@0.6.6 , MIT , https://github.com/tkellen/node-interpret <br/>
              invariant@2.2.1 , BSD-3-Clause , https://github.com/zertosh/invariant <br/>
              ip-regex@1.0.3 , MIT , https://github.com/sindresorhus/ip-regex <br/>
              is-binary-path@1.0.1 , MIT , https://github.com/sindresorhus/is-binary-path <br/>
              is-buffer@1.1.3 , MIT , https://github.com/feross/is-buffer <br/>
              is-dotfile@1.0.2 , MIT , https://github.com/jonschlinkert/is-dotfile <br/>
              is-equal-shallow@0.1.3 , MIT , https://github.com/jonschlinkert/is-equal-shallow <br/>
              is-extendable@0.1.1 , MIT , https://github.com/jonschlinkert/is-extendable <br/>
              is-extended@0.0.10 , MIT , https://github.com/doug-martin/is-extended <br/>
              is-extglob@1.0.0 , MIT , https://github.com/jonschlinkert/is-extglob <br/>
              is-glob@2.0.1 , MIT , https://github.com/jonschlinkert/is-glob <br/>
              is-my-json-valid@2.12.3 , MIT , https://github.com/mafintosh/is-my-json-valid <br/>
              is-my-json-valid@2.13.1 , MIT , https://github.com/mafintosh/is-my-json-valid <br/>
              is-number@2.1.0 , MIT , https://github.com/jonschlinkert/is-number <br/>
              is-posix-bracket@0.1.1 , MIT , https://github.com/jonschlinkert/is-posix-bracket <br/>
              is-primitive@2.0.0 , MIT , https://github.com/jonschlinkert/is-primitive <br/>
              is-promise@1.0.1 , MIT , https://github.com/then/is-promise <br/>
              is-promise@2.1.0 , MIT , https://github.com/then/is-promise <br/>
              is-property@1.0.2 , MIT , https://github.com/mikolalysenko/is-property <br/>
              is-stream@1.1.0 , MIT , https://github.com/sindresorhus/is-stream <br/>
              is-typedarray@1.0.0 , MIT , https://github.com/hughsk/is-typedarray <br/>
              is-utf8@0.2.1 , MIT , https://github.com/wayfind/is-utf8 <br/>
              isarray@0.0.1 , MIT , https://github.com/juliangruber/isarray <br/>
              isarray@1.0.0 , MIT , https://github.com/juliangruber/isarray <br/>
              isobject@2.1.0 , MIT , https://github.com/jonschlinkert/isobject <br/>
              isomorphic-fetch@2.2.1 , MIT , https://github.com/matthew-andrews/isomorphic-fetch <br/>
              isstream@0.1.2 , MIT , https://github.com/rvagg/isstream <br/>
              jade@1.11.0 , MIT , https://github.com/jadejs/jade <br/>
              jodid25519@1.0.2 , MIT , https://github.com/meganz/jodid25519 <br/>
              jquery@2.2.3 , MIT , https://github.com/jquery/jquery <br/>
              js-tokens@1.0.3 , MIT , https://github.com/lydell/js-tokens <br/>
              jsbn@0.1.0 , BSD , https://github.com/andyperlitch/jsbn <br/>
              json-schema@0.2.2 , AFLv2.1,BSD , https://github.com/kriszyp/json-schema <br/>
              json-stringify-safe@5.0.1 , ISC , https://github.com/isaacs/json-stringify-safe <br/>
              json5@0.5.0 , MIT , https://github.com/aseemk/json5 <br/>
              jsonfile@2.3.1 , MIT , https://github.com/jprichardson/node-jsonfile <br/>
              jsonpointer@2.0.0 , MIT , https://github.com/janl/node-jsonpointer <br/>
              jsprim@1.2.2 , MIT , https://github.com/davepacheco/node-jsprim <br/>
              jstransform@10.1.0 , Apache-2.0 , https://github.com/facebook/jstransform <br/>
              jstransformer@0.0.2 , MIT , https://github.com/jstransformers/jstransformer <br/>
              keycode@2.1.1 , MIT , https://github.com/timoxley/keycode <br/>
              kind-of@3.0.3 , MIT , https://github.com/jonschlinkert/kind-of <br/>
              klaw@1.3.0 , MIT , https://github.com/jprichardson/node-klaw <br/>
              lazy-cache@1.0.4 , MIT , https://github.com/jonschlinkert/lazy-cache <br/>
              load-script@1.0.0 , MIT , https://github.com/eldargab/load-script <br/>
              loader-utils@0.2.15 , MIT , https://github.com/webpack/loader-utils <br/>
              lodash-compat@3.10.2 , MIT , https://github.com/lodash/lodash-compat <br/>
              lodash-es@4.12.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash._arraycopy@3.0.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash._arrayeach@3.0.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash._baseassign@3.2.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash._baseclone@3.3.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash._basecopy@3.0.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash._basefor@3.0.3 , MIT , https://github.com/lodash/lodash <br/>
              lodash._basetostring@3.0.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash._bindcallback@3.0.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash._createassigner@3.1.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash._createpadding@3.6.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash._getnative@3.9.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash._isiterateecall@3.0.9 , MIT , https://github.com/lodash/lodash <br/>
              lodash._topath@3.8.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.clonedeep@3.0.2 , MIT , https://github.com/lodash/lodash <br/>
              lodash.debounce@3.1.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.isarguments@3.0.8 , MIT , https://github.com/lodash/lodash <br/>
              lodash.isarray@3.0.4 , MIT , https://github.com/lodash/lodash <br/>
              lodash.isplainobject@3.2.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash.istypedarray@3.0.6 , MIT , https://github.com/lodash/lodash <br/>
              lodash.keys@3.1.2 , MIT , https://github.com/lodash/lodash <br/>
              lodash.keysin@3.0.8 , MIT , https://github.com/lodash/lodash <br/>
              lodash.merge@3.3.2 , MIT , https://github.com/lodash/lodash <br/>
              lodash.pad@3.1.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.pad@4.1.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash.padend@4.2.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash.padleft@3.1.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.padright@3.1.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.padstart@4.2.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash.repeat@3.0.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.repeat@4.0.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash.restparam@3.6.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash.set@3.7.4 , MIT , https://github.com/lodash/lodash <br/>
              lodash.toplainobject@3.0.0 , MIT , https://github.com/lodash/lodash <br/>
              lodash.tostring@4.1.2 , MIT , https://github.com/lodash/lodash <br/>
              lodash@3.10.1 , MIT , https://github.com/lodash/lodash <br/>
              lodash@4.12.0 , MIT , https://github.com/lodash/lodash <br/>
              longest@1.0.1 , MIT , https://github.com/jonschlinkert/longest <br/>
              loose-envify@1.2.0 , MIT , https://github.com/zertosh/loose-envify <br/>
              lru-cache@4.0.1 , ISC , https://github.com/isaacs/node-lru-cache <br/>
              md5@2.1.0 , BSD-3-Clause , https://github.com/pvorb/node-md5 <br/>
              memory-fs@0.2.0 , MIT , https://github.com/webpack/memory-fs <br/>
              memory-fs@0.3.0 , MIT , https://github.com/webpack/memory-fs <br/>
              micromatch@2.3.8 , MIT , https://github.com/jonschlinkert/micromatch <br/>
              mime-db@1.21.0 , MIT , https://github.com/jshttp/mime-db <br/>
              mime-db@1.22.0 , MIT , https://github.com/jshttp/mime-db <br/>
              mime-types@2.1.10 , MIT , https://github.com/jshttp/mime-types <br/>
              mime-types@2.1.9 , MIT , https://github.com/jshttp/mime-types <br/>
              minimatch@2.0.10 , ISC , https://github.com/isaacs/minimatch <br/>
              minimatch@3.0.0 , ISC , https://github.com/isaacs/minimatch <br/>
              minimist@0.0.8 , MIT , https://github.com/substack/minimist <br/>
              minimist@1.2.0 , MIT , https://github.com/substack/minimist <br/>
              mkdirp@0.5.1 , MIT , https://github.com/substack/node-mkdirp <br/>
              mkpath@1.0.0 , MIT , https://github.com/jrajav/mkpath <br/>
              mousetrap@1.5.3 , Apache 2.0 , https://github.com/ccampbell/mousetrap <br/>
              ms@0.7.1 , MIT* , https://github.com/guille/ms.js <br/>
              nan@2.3.3 , MIT , https://github.com/nodejs/nan <br/>
              node-fetch@1.5.2 , MIT , https://github.com/bitinn/node-fetch <br/>
              node-libs-browser@0.5.3 , MIT , https://github.com/webpack/node-libs-browser <br/>
              node-pre-gyp@0.6.19 , BSD , https://github.com/mapbox/node-pre-gyp <br/>
              node-pre-gyp@0.6.25 , BSD , https://github.com/mapbox/node-pre-gyp <br/>
              node-uuid@1.4.7 , MIT , https://github.com/broofa/node-uuid <br/>
              nodegit-promise@4.0.0 , MIT , https://github.com/nodegit/promise <br/>
              nodegit@0.9.0 , MIT , https://github.com/nodegit/nodegit <br/>
              nopt@3.0.6 , ISC , https://github.com/npm/nopt <br/>
              normalize-path@2.0.1 , MIT , https://github.com/jonschlinkert/normalize-path <br/>
              normalize.css@3.0.3 , MIT , https://github.com/necolas/normalize.css <br/>
              normalizr@1.4.1 , MIT , https://github.com/gaearon/normalizr <br/>
              npmlog@2.0.0 , ISC , https://github.com/npm/npmlog <br/>
              npmlog@2.0.3 , ISC , https://github.com/npm/npmlog <br/>
              oauth-sign@0.8.0 , Apache-2.0 , https://github.com/mikeal/oauth-sign <br/>
              oauth-sign@0.8.1 , Apache-2.0 , https://github.com/mikeal/oauth-sign <br/>
              object-assign@4.1.0 , MIT , https://github.com/sindresorhus/object-assign <br/>
              object-extended@0.0.7 , MIT , https://github.com/doug-martin/object-extended <br/>
              object.omit@2.0.0 , MIT , https://github.com/jonschlinkert/object.omit <br/>
              once@1.1.1 , BSD , https://github.com/isaacs/once <br/>
              once@1.3.3 , ISC , https://github.com/isaacs/once <br/>
              optimist@0.3.7 , MIT/X11 , https://github.com/substack/node-optimist <br/>
              optimist@0.6.1 , MIT/X11 , https://github.com/substack/node-optimist <br/>
              os-browserify@0.1.2 , MIT , https://github.com/drewyoung1/os-browserify <br/>
              pako@0.2.8 , MIT , https://github.com/nodeca/pako <br/>
              parse-glob@3.0.4 , MIT , https://github.com/jonschlinkert/parse-glob <br/>
              path-browserify@0.0.0 , MIT , https://github.com/substack/path-browserify <br/>
              path-is-absolute@1.0.0 , MIT , https://github.com/sindresorhus/path-is-absolute <br/>
              pbkdf2-compat@2.0.1 , MIT , https://github.com/dcousens/pbkdf2-compat <br/>
              pinkie-promise@2.0.0 , MIT , https://github.com/floatdrop/pinkie-promise <br/>
              pinkie@2.0.1 , MIT , https://github.com/floatdrop/pinkie <br/>
              pinkie@2.0.4 , MIT , https://github.com/floatdrop/pinkie <br/>
              preserve@0.2.0 , MIT , https://github.com/jonschlinkert/preserve <br/>
              process-nextick-args@1.0.6 , MIT , https://github.com/calvinmetcalf/process-nextick-args <br/>
              process-nextick-args@1.0.7 , MIT , https://github.com/calvinmetcalf/process-nextick-args <br/>
              process@0.11.3 , MIT , https://github.com/shtylman/node-process <br/>
              promise@2.0.0 , MIT , https://github.com/then/promise <br/>
              promise@6.1.0 , MIT , https://github.com/then/promise <br/>
              promise@7.1.1 , MIT , https://github.com/then/promise <br/>
              promised-exec@1.0.1 , MIT , https://github.com/yakimchuk/promised-exec <br/>
              promisify-node@0.3.0 , MIT , https://github.com/nodegit/promisify-node <br/>
              prr@0.0.0 , MIT , https://github.com/rvagg/prr <br/>
              pseudomap@1.0.2 , ISC , https://github.com/isaacs/pseudomap <br/>
              punycode@1.3.2 , MIT , https://github.com/bestiejs/punycode.js <br/>
              punycode@1.4.1 , MIT , https://github.com/bestiejs/punycode.js <br/>
              q@1.4.1 , MIT , https://github.com/kriskowal/q <br/>
              qs@5.2.0 , BSD-3-Clause , https://github.com/hapijs/qs <br/>
              qs@6.0.2 , BSD-3-Clause , https://github.com/ljharb/qs <br/>
              query-string@3.0.3 , MIT , https://github.com/sindresorhus/query-string <br/>
              querystring-es3@0.2.1 , MIT , https://github.com/mike-spainhower/querystring <br/>
              querystring@0.2.0 , MIT , https://github.com/Gozala/querystring <br/>
              random-js@1.0.8 , MIT , https://github.com/ckknight/random-js <br/>
              randomatic@1.1.5 , MIT , https://github.com/jonschlinkert/randomatic <br/>
              rc@1.1.6 , (BSD-2-Clause OR MIT OR Apache-2.0) , https://github.com/dominictarr/rc <br/>
              react-addons-clone-with-props@0.14.8 , BSD-3-Clause , https://github.com/facebook/react <br/>
              react-addons-css-transition-group@0.14.8 , BSD-3-Clause , https://github.com/facebook/react <br/>
              react-addons-test-utils@0.14.2 , BSD-3-Clause , <br/>
              react-bootstrap@0.28.5 , MIT , https://github.com/react-bootstrap/react-bootstrap <br/>
              react-dom@0.14.2 , BSD-3-Clause , https://github.com/facebook/react <br/>
              react-dropzone@3.4.0 , MIT , https://github.com/okonet/react-dropzone <br/>
              react-overlays@0.6.3 , MIT , https://github.com/react-bootstrap/react-overlays <br/>
              react-prop-types@0.2.2 , MIT , https://github.com/react-bootstrap/react-prop-types <br/>
              react-prop-types@0.3.2 , MIT , https://github.com/react-bootstrap/react-prop-types <br/>
              react-redux@3.1.2 , MIT , https://github.com/gaearon/react-redux <br/>
              react-router-redux@4.0.4 , MIT , https://github.com/reactjs/react-router-redux <br/>
              react-router@2.4.0 , MIT , https://github.com/reactjs/react-router <br/>
              react@0.14.8 , BSD-3-Clause , https://github.com/facebook/react <br/>
              read-multiple-files@1.1.1 , MIT , https://github.com/shinnn/read-multiple-files <br/>
              readable-stream@1.1.14 , MIT , https://github.com/isaacs/readable-stream <br/>
              readable-stream@2.0.5 , MIT , https://github.com/nodejs/readable-stream <br/>
              readable-stream@2.0.6 , MIT , https://github.com/nodejs/readable-stream <br/>
              readable-stream@2.1.2 , MIT , https://github.com/nodejs/readable-stream <br/>
              readdirp@2.0.0 , MIT , https://github.com/thlorenz/readdirp <br/>
              redux-logger@2.6.1 , MIT , https://github.com/fcomb/redux-logger <br/>
              redux-thunk@0.1.0 , MIT , https://github.com/gaearon/redux-thunk <br/>
              redux@3.5.2 , MIT , https://github.com/reactjs/redux <br/>
              regex-cache@0.4.3 , MIT , https://github.com/jonschlinkert/regex-cache <br/>
              repeat-element@1.1.2 , MIT , https://github.com/jonschlinkert/repeat-element <br/>
              repeat-string@1.5.4 , MIT , https://github.com/jonschlinkert/repeat-string <br/>
              request@2.67.0 , Apache-2.0 , https://github.com/request/request <br/>
              request@2.69.0 , Apache-2.0 , https://github.com/request/request <br/>
              right-align@0.1.3 , MIT , https://github.com/jonschlinkert/right-align <br/>
              rimraf@2.4.5 , ISC , https://github.com/isaacs/rimraf <br/>
              rimraf@2.5.0 , ISC , https://github.com/isaacs/rimraf <br/>
              rimraf@2.5.2 , ISC , https://github.com/isaacs/rimraf <br/>
              ripemd160@0.2.0 , UNKNOWN , https://github.com/cryptocoinjs/ripemd160 <br/>
              run-parallel@1.1.6 , MIT , https://github.com/feross/run-parallel <br/>
              semver@5.1.0 , ISC , https://github.com/npm/node-semver <br/>
              sha.js@2.2.6 , MIT , https://github.com/dominictarr/sha.js <br/>
              sha1@1.1.1 , BSD-3-Clause , https://github.com/pvorb/node-sha1 <br/>
              sntp@1.0.9 , BSD , https://github.com/hueniverse/sntp <br/>
              source-list-map@0.1.6 , MIT , https://github.com/webpack/source-list-map <br/>
              source-map@0.1.31 , BSD , https://github.com/mozilla/source-map <br/>
              source-map@0.1.43 , BSD , https://github.com/mozilla/source-map <br/>
              source-map@0.4.4 , BSD-3-Clause , https://github.com/mozilla/source-map <br/>
              source-map@0.5.6 , BSD-3-Clause , https://github.com/mozilla/source-map <br/>
              sshpk@1.7.2 , MIT , https://github.com/arekinath/node-sshpk <br/>
              sshpk@1.7.4 , MIT , https://github.com/arekinath/node-sshpk <br/>
              stream-browserify@1.0.0 , MIT , https://github.com/substack/stream-browserify <br/>
              strict-uri-encode@1.1.0 , MIT , https://github.com/kevva/strict-uri-encode <br/>
              string-extended@0.0.8 , MIT , https://github.com/doug-martin/string-extended <br/>
              string_decoder@0.10.31 , MIT , https://github.com/rvagg/string_decoder <br/>
              stringstream@0.0.5 , MIT , https://github.com/mhart/StringStream <br/>
              strip-ansi@3.0.0 , MIT , https://github.com/sindresorhus/strip-ansi <br/>
              strip-ansi@3.0.1 , MIT , https://github.com/chalk/strip-ansi <br/>
              strip-bom@2.0.0 , MIT , https://github.com/sindresorhus/strip-bom <br/>
              strip-json-comments@1.0.4 , MIT , https://github.com/sindresorhus/strip-json-comments <br/>
              supports-color@2.0.0 , MIT , https://github.com/chalk/supports-color <br/>
              supports-color@3.1.2 , MIT , https://github.com/chalk/supports-color <br/>
              symbol-observable@0.2.4 , MIT , https://github.com/blesh/symbol-observable <br/>
              tapable@0.1.10 , MIT , https://github.com/webpack/tapable <br/>
              tar-pack@3.1.2 , BSD , https://github.com/ForbesLindesay/tar-pack <br/>
              tar-pack@3.1.3 , BSD-2-Clause , https://github.com/ForbesLindesay/tar-pack <br/>
              tar@2.2.1 , ISC , https://github.com/isaacs/node-tar <br/>
              through@2.3.8 , MIT , https://github.com/dominictarr/through <br/>
              timers-browserify@1.4.2 , MIT , https://github.com/jryans/timers-browserify <br/>
              tough-cookie@2.2.1 , BSD-3-Clause , https://github.com/SalesforceEng/tough-cookie <br/>
              tough-cookie@2.2.2 , BSD-3-Clause , https://github.com/SalesforceEng/tough-cookie <br/>
              transformers@2.1.0 , MIT , https://github.com/ForbesLindesay/transformers <br/>
              tty-browserify@0.0.0 , MIT , https://github.com/substack/tty-browserify <br/>
              tunnel-agent@0.4.2 , Apache-2.0 , https://github.com/mikeal/tunnel-agent <br/>
              tweetnacl@0.13.2 , CC0-1.0 , https://github.com/dchest/tweetnacl-js <br/>
              tweetnacl@0.14.3 , SEE LICENSE IN COPYING.txt , https://github.com/dchest/tweetnacl-js <br/>
              ua-parser-js@0.7.10 , GPLv2,MIT , https://github.com/faisalman/ua-parser-js <br/>
              uglify-js@2.2.5 , UNKNOWN , https://github.com/mishoo/UglifyJS2 <br/>
              uglify-js@2.6.2 , BSD-2-Clause , https://github.com/mishoo/UglifyJS2 <br/>
              uglify-to-browserify@1.0.2 , MIT , https://github.com/ForbesLindesay/uglify-to-browserify <br/>
              uid-number@0.0.3 , BSD , https://github.com/isaacs/uid-number <br/>
              uid-number@0.0.6 , ISC , https://github.com/isaacs/uid-number <br/>
              uncontrollable@3.2.4 , MIT , https://github.com/jquense/uncontrollable <br/>
              underscore.string@2.4.0 , MIT , https://github.com/epeli/underscore.string <br/>
              underscore@1.7.0 , MIT , https://github.com/jashkenas/underscore <br/>
              url-regex@3.1.1 , MIT , https://github.com/kevva/url-regex <br/>
              url@0.10.3 , MIT , https://github.com/defunctzombie/node-url <br/>
              util-deprecate@1.0.2 , MIT , https://github.com/TooTallNate/util-deprecate <br/>
              util@0.10.3 , MIT , https://github.com/defunctzombie/node-util <br/>
              verror@1.3.6 , MIT* , https://github.com/davepacheco/node-verror <br/>
              vm-browserify@0.0.4 , MIT , https://github.com/substack/vm-browserify <br/>
              void-elements@2.0.1 , MIT , https://github.com/hemanth/void-elements <br/>
              warning@2.1.0 , BSD-2-Clause , https://github.com/r3dm/warning <br/>
              watchpack@0.2.9 , MIT , https://github.com/webpack/watchpack <br/>
              webpack-core@0.6.8 , MIT , https://github.com/webpack/core <br/>
              webpack@1.13.0 , MIT , https://github.com/webpack/webpack <br/>
              whatwg-fetch@0.9.0 , MIT , https://github.com/github/fetch <br/>
              whatwg-fetch@1.0.0 , MIT , https://github.com/github/fetch <br/>
              window-size@0.1.0 , MIT , https://github.com/jonschlinkert/window-size <br/>
              with@4.0.3 , MIT , https://github.com/ForbesLindesay/with <br/>
              wordwrap@0.0.2 , MIT/X11 , https://github.com/substack/node-wordwrap <br/>
              wordwrap@0.0.3 , MIT , https://github.com/substack/node-wordwrap <br/>
              wrappy@1.0.1 , ISC , https://github.com/npm/wrappy <br/>
              xtend@4.0.1 , MIT , https://github.com/Raynos/xtend <br/>
              yallist@2.0.0 , ISC , https://github.com/isaacs/yallist <br/>
              yamljs@0.2.7 , MIT , https://github.com/jeremyfa/yaml.js <br/>
              yargs@3.10.0 , MIT , https://github.com/bcoe/yargs <br/>

              <br/>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
              The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </div>
            <br/>
            <button
              type="submit"
              onClick={() => {
                this.props.uiShowAbout(false);
              }}>Close
            </button>
          </div>}
    />);
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.modals.showAbout,
  };
}

export default connect(mapStateToProps, {
  uiShowAbout,
})(AboutForm);
