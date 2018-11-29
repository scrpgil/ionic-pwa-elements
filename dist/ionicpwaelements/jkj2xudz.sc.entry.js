/*! Built with http://stenciljs.com */
const{h:t}=window.ionicpwaelements,e=/(^-?\d*\.?\d*)(.*)/,s=32,i=400,n={translateX:1,translateY:1,translateZ:1,scale:1,scaleX:1,scaleY:1,scaleZ:1,rotate:1,rotateX:1,rotateY:1,rotateZ:1,skewX:1,skewY:1,perspective:1},o=window.requestAnimationFrame?window.requestAnimationFrame.bind(window):t=>t(Date.now());class r{constructor(){this._hasDur=!1,this._hasTweenEffect=!1,this._isAsync=!1,this._isReverse=!1,this._destroyed=!1,this.hasChildren=!1,this.isPlaying=!1,this.hasCompleted=!1}addElement(t){if(null!=t)if(t.length>0)for(let e=0;e<t.length;e++)this._addEl(t[e]);else this._addEl(t);return this}_addEl(t){1===t.nodeType&&(this._elements=this._elements||[]).push(t)}add(t){return t.parent=this,this.hasChildren=!0,(this._childAnimations=this._childAnimations||[]).push(t),this}getDuration(t){if(r.animated){if(t&&void 0!==t.duration)return t.duration;if(void 0!==this._duration)return this._duration;if(this.parent)return this.parent.getDuration()}return 0}isRoot(){return!this.parent}duration(t){return this._duration=t,this}getEasing(){return this._isReverse&&void 0!==this._reversedEasingName?this._reversedEasingName:void 0!==this._easingName?this._easingName:this.parent&&this.parent.getEasing()||null}easing(t){return this._easingName=t,this}easingReverse(t){return this._reversedEasingName=t,this}from(t,e){return this._addProp("from",t,e),this}to(t,e,s=!1){const i=this._addProp("to",t,e);return s&&this.afterClearStyles([i.trans?"transform":t]),this}fromTo(t,e,s,i){return this.from(t,e).to(t,s,i)}_getProp(t){if(this._fxProperties)return this._fxProperties.find(e=>e.effectName===t)}_addProp(t,s,i){let o=this._getProp(s);if(!o){const t=1===n[s];o={effectName:s,trans:t,wc:t?"transform":s},(this._fxProperties=this._fxProperties||[]).push(o)}const r={val:i,num:0,effectUnit:""};if(o[t]=r,"string"==typeof i&&i.indexOf(" ")<0){const t=i.match(e);if(t){const e=parseFloat(t[1]);isNaN(e)||(r.num=e),r.effectUnit=t[0]!==t[2]?t[2]:""}}else"number"==typeof i&&(r.num=i);return o}beforeAddClass(t){return(this._beforeAddClasses=this._beforeAddClasses||[]).push(t),this}beforeRemoveClass(t){return(this._beforeRemoveClasses=this._beforeRemoveClasses||[]).push(t),this}beforeStyles(t){return this._beforeStyles=t,this}beforeClearStyles(t){this._beforeStyles=this._beforeStyles||{};for(const e of t)this._beforeStyles[e]="";return this}beforeAddRead(t){return(this._readCallbacks=this._readCallbacks||[]).push(t),this}beforeAddWrite(t){return(this._writeCallbacks=this._writeCallbacks||[]).push(t),this}afterAddClass(t){return(this._afterAddClasses=this._afterAddClasses||[]).push(t),this}afterRemoveClass(t){return(this._afterRemoveClasses=this._afterRemoveClasses||[]).push(t),this}afterStyles(t){return this._afterStyles=t,this}afterClearStyles(t){this._afterStyles=this._afterStyles||{};for(const e of t)this._afterStyles[e]="";return this}play(t){this._destroyed||(this._isAsync=this._hasDuration(t),this._clearAsync(),this._playInit(t),o(()=>{o(()=>{this._playDomInspect(t)})}))}playAsync(t){return new Promise(e=>(this.onFinish(e,{oneTimeCallback:!0,clearExistingCallbacks:!0}),this.play(t),this))}playSync(){if(!this._destroyed){const t={duration:0};this._isAsync=!1,this._clearAsync(),this._playInit(t),this._playDomInspect(t)}}_playInit(t){this._hasTweenEffect=!1,this.isPlaying=!0,this.hasCompleted=!1,this._hasDur=this.getDuration(t)>s;const e=this._childAnimations;if(e)for(const s of e)s._playInit(t);this._hasDur&&(this._progress(0),this._willChange(!0))}_playDomInspect(t){this._beforeAnimation();const e=this.getDuration(t);this._isAsync&&this._asyncEnd(e,!0),this._playProgress(t),this._isAsync&&!this._destroyed&&o(()=>{this._playToStep(1)})}_playProgress(t){const e=this._childAnimations;if(e)for(const s of e)s._playProgress(t);this._hasDur?this._setTrans(this.getDuration(t),!1):(this._progress(1),this._setAfterStyles(),this._didFinish(!0))}_playToStep(t){if(!this._destroyed){const e=this._childAnimations;if(e)for(const s of e)s._playToStep(t);this._hasDur&&this._progress(t)}}_asyncEnd(t,e){const s=this;s._unregisterTrnsEnd=function(t,e){let s;const i={passive:!0};function n(){s&&s()}function o(s){t===s.target&&(n(),e(s))}return t&&(t.addEventListener("webkitTransitionEnd",o,i),t.addEventListener("transitionend",o,i),s=(()=>{t.removeEventListener("webkitTransitionEnd",o,i),t.removeEventListener("transitionend",o,i)})),n}(s._transEl(),function(){s._clearAsync(),s._playEnd(),s._didFinishAll(e,!0,!1)}),s._timerId=setTimeout(function(){s._timerId=void 0,s._clearAsync(),s._playEnd(e?1:0),s._didFinishAll(e,!0,!1)},t+i)}_playEnd(t){const e=this._childAnimations;if(e)for(const s of e)s._playEnd(t);this._hasDur&&(void 0!==t&&(this._setTrans(0,!0),this._progress(t)),this._setAfterStyles(),this._willChange(!1))}_hasDuration(t){if(this.getDuration(t)>s)return!0;const e=this._childAnimations;if(e)for(const s of e)if(s._hasDuration(t))return!0;return!1}_hasDomReads(){if(this._readCallbacks&&this._readCallbacks.length>0)return!0;const t=this._childAnimations;if(t)for(const e of t)if(e._hasDomReads())return!0;return!1}stop(t=1){this._clearAsync(),this._hasDur=!0,this._playEnd(t)}_clearAsync(){this._unregisterTrnsEnd&&this._unregisterTrnsEnd(),this._timerId&&clearTimeout(this._timerId),this._timerId=this._unregisterTrnsEnd=void 0}_progress(t){let e;const s=this._elements,i=this._fxProperties;if(!s||0===s.length||!i||this._destroyed)return;this._isReverse&&(t=1-t);let n,o=0,r=0,a="";for(o=0;o<i.length;o++)if((n=i[o]).from&&n.to){const i=n.from.num,o=n.to.num,l=i!==o;if(l&&(this._hasTweenEffect=!0),0===t?e=n.from.val:1===t?e=n.to.val:l&&(e=(o-i)*t+i+n.to.effectUnit),null!==e){const t=n.effectName;if(n.trans)a+=t+"("+e+") ";else for(r=0;r<s.length;r++)s[r].style.setProperty(t,e)}}if(a.length>0)for((!this._isReverse&&1!==t||this._isReverse&&0!==t)&&(a+="translateZ(0px)"),o=0;o<s.length;o++)s[o].style.setProperty("transform",a)}_setTrans(t,e){const s=this._elements;if(!s||0===s.length||!this._fxProperties)return;const i=e?"linear":this.getEasing(),n=t+"ms";for(const{style:e}of s)t>0?(e.transitionDuration=n,null!==i&&(e.transitionTimingFunction=i)):e.transitionDuration="0"}_beforeAnimation(){this._fireBeforeReadFunc(),this._fireBeforeWriteFunc(),this._setBeforeStyles()}_setBeforeStyles(){const t=this._childAnimations;if(t)for(const e of t)e._setBeforeStyles();const e=this._elements;if(!e||0===e.length||this._isReverse)return;const s=this._beforeAddClasses,i=this._beforeRemoveClasses;for(const t of e){const e=t.classList;if(s)for(const t of s)e.add(t);if(i)for(const t of i)e.remove(t);if(this._beforeStyles)for(const[e,s]of Object.entries(this._beforeStyles))t.style.setProperty(e,s)}}_fireBeforeReadFunc(){const t=this._childAnimations;if(t)for(const e of t)e._fireBeforeReadFunc();const e=this._readCallbacks;if(e)for(const t of e)t()}_fireBeforeWriteFunc(){const t=this._childAnimations;if(t)for(const e of t)e._fireBeforeWriteFunc();const e=this._writeCallbacks;if(e)for(const t of e)t()}_setAfterStyles(){const t=this._elements;if(t)for(const e of t){const t=e.classList;if(e.style.transitionDuration=e.style.transitionTimingFunction="",this._isReverse){const s=this._beforeAddClasses;if(s)for(const e of s)t.remove(e);const i=this._beforeRemoveClasses;if(i)for(const e of i)t.add(e);const n=this._beforeStyles;if(n)for(const t of Object.keys(n))e.style.removeProperty(t)}else{const s=this._afterAddClasses;if(s)for(const e of s)t.add(e);const i=this._afterRemoveClasses;if(i)for(const e of i)t.remove(e);const n=this._afterStyles;if(n)for(const[t,s]of Object.entries(n))e.style.setProperty(t,s)}}}_willChange(t){let e;const s=this._fxProperties;let i;if(t&&s){e=[];for(const t of s){const s=t.wc;"webkitTransform"===s?e.push("transform","-webkit-transform"):void 0!==s&&e.push(s)}i=e.join(",")}else i="";const n=this._elements;if(n)for(const t of n)t.style.setProperty("will-change",i)}progressStart(){this._clearAsync(),this._beforeAnimation(),this._progressStart()}_progressStart(){const t=this._childAnimations;if(t)for(const e of t)e._progressStart();this._setTrans(0,!0),this._willChange(!0)}progressStep(t){t=Math.min(1,Math.max(0,t));const e=this._childAnimations;if(e)for(const s of e)s.progressStep(t);this._progress(t)}progressEnd(t,e,s=-1){this._isReverse&&(e=1-e);const i=t?1:0,n=Math.abs(e-i);s<0?s=this._duration||0:n<.05&&(s=0),this._isAsync=s>30,this._progressEnd(t,i,s,this._isAsync),this._isAsync&&(this._asyncEnd(s,t),this._destroyed||o(()=>{this._playToStep(i)}))}_progressEnd(t,e,s,i){const n=this._childAnimations;if(n)for(const o of n)o._progressEnd(t,e,s,i);i?(this.isPlaying=!0,this.hasCompleted=!1,this._hasDur=!0,this._willChange(!0),this._setTrans(s,!1)):(this._progress(e),this._willChange(!1),this._setAfterStyles(),this._didFinish(t))}onFinish(t,e){return e&&e.clearExistingCallbacks&&(this._onFinishCallbacks=this._onFinishOneTimeCallbacks=void 0),e&&e.oneTimeCallback?(this._onFinishOneTimeCallbacks=this._onFinishOneTimeCallbacks||[],this._onFinishOneTimeCallbacks.push(t)):(this._onFinishCallbacks=this._onFinishCallbacks||[],this._onFinishCallbacks.push(t)),this}_didFinishAll(t,e,s){const i=this._childAnimations;if(i)for(const n of i)n._didFinishAll(t,e,s);(e&&this._isAsync||s&&!this._isAsync)&&this._didFinish(t)}_didFinish(t){if(this.isPlaying=!1,this.hasCompleted=t,this._onFinishCallbacks)for(const t of this._onFinishCallbacks)t(this);if(this._onFinishOneTimeCallbacks){for(const t of this._onFinishOneTimeCallbacks)t(this);this._onFinishOneTimeCallbacks.length=0}}reverse(t=!0){const e=this._childAnimations;if(e)for(const s of e)s.reverse(t);return this._isReverse=!!t,this}destroy(){this._didFinish(!1),this._destroyed=!0;const t=this._childAnimations;if(t)for(const e of t)e.destroy();this._clearAsync(),this._elements&&(this._elements.length=0),this._readCallbacks&&(this._readCallbacks.length=0),this._writeCallbacks&&(this._writeCallbacks.length=0),this.parent=void 0,this._childAnimations&&(this._childAnimations.length=0),this._onFinishCallbacks&&(this._onFinishCallbacks.length=0),this._onFinishOneTimeCallbacks&&(this._onFinishOneTimeCallbacks.length=0)}_transEl(){const t=this._childAnimations;if(t)for(const e of t){const t=e._transEl();if(t)return t}return this._hasTweenEffect&&this._hasDur&&void 0!==this._elements&&this._elements.length>0?this._elements[0]:null}}r.animated=!0;class a{create(t,e,s){return r.animated=this.config.getBoolean("animated",!0),t?t(r,e,s):Promise.resolve(new r)}static get is(){return"ion-animation-controller"}static get properties(){return{config:{context:"config"},create:{method:!0}}}}class l{constructor(t,e,s,i,n){this.id=e,this.name=s,this.priority=i,this.disableScroll=n,this.ctrl=t}canStart(){return!!this.ctrl&&this.ctrl.canStart(this.name)}start(){return!!this.ctrl&&this.ctrl.start(this.name,this.id,this.priority)}capture(){if(!this.ctrl)return!1;const t=this.ctrl.capture(this.name,this.id,this.priority);return t&&this.disableScroll&&this.ctrl.disableScroll(this.id),t}release(){this.ctrl&&(this.ctrl.release(this.id),this.disableScroll&&this.ctrl.enableScroll(this.id))}destroy(){this.release(),this.ctrl=void 0}}class d{constructor(t,e,s,i){this.id=e,this.disable=s,this.disableScroll=i,this.ctrl=t}block(){if(this.ctrl){if(this.disable)for(const t of this.disable)this.ctrl.disableGesture(t,this.id);this.disableScroll&&this.ctrl.disableScroll(this.id)}}unblock(){if(this.ctrl){if(this.disable)for(const t of this.disable)this.ctrl.enableGesture(t,this.id);this.disableScroll&&this.ctrl.enableScroll(this.id)}}destroy(){this.unblock(),this.ctrl=void 0}}const c=new class{constructor(t){this.doc=t,this.gestureId=0,this.requestedStart=new Map,this.disabledGestures=new Map,this.disabledScroll=new Set}createGesture(t){return new l(this,this.newID(),t.name,t.priority||0,!!t.disableScroll)}createBlocker(t={}){return new d(this,this.newID(),t.disable,!!t.disableScroll)}start(t,e,s){return this.canStart(t)?(this.requestedStart.set(e,s),!0):(this.requestedStart.delete(e),!1)}capture(t,e,s){if(!this.start(t,e,s))return!1;const i=this.requestedStart;let n=-1e4;if(i.forEach(t=>{n=Math.max(n,t)}),n===s){this.capturedId=e,i.clear();const s=new CustomEvent("ionGestureCaptured",{detail:t});return this.doc.body.dispatchEvent(s),!0}return i.delete(e),!1}release(t){this.requestedStart.delete(t),this.capturedId===t&&(this.capturedId=void 0)}disableGesture(t,e){let s=this.disabledGestures.get(t);void 0===s&&(s=new Set,this.disabledGestures.set(t,s)),s.add(e)}enableGesture(t,e){const s=this.disabledGestures.get(t);void 0!==s&&s.delete(e)}disableScroll(t){this.disabledScroll.add(t),1===this.disabledScroll.size&&this.doc.body.classList.add("backdrop-no-scroll")}enableScroll(t){this.disabledScroll.delete(t),0===this.disabledScroll.size&&this.doc.body.classList.remove("backdrop-no-scroll")}canStart(t){return void 0===this.capturedId&&!this.isDisabled(t)}isCaptured(){return void 0!==this.capturedId}isScrollDisabled(){return this.disabledScroll.size>0}isDisabled(t){const e=this.disabledGestures.get(t);return!!(e&&e.size>0)}newID(){return this.gestureId++,this.gestureId}}(document);function h(t){return t.timeStamp||Date.now()}class m{constructor(){this.lastClick=-1e4,this.blocker=c.createBlocker({disableScroll:!0}),this.visible=!0,this.tappable=!0,this.stopPropagation=!0}componentDidLoad(){this.stopPropagation&&this.blocker.block()}componentDidUnload(){this.blocker.destroy()}onTouchStart(t){this.lastClick=h(t),this.emitTap(t)}onMouseDown(t){this.lastClick<h(t)-2500&&this.emitTap(t)}emitTap(t){this.stopPropagation&&(t.preventDefault(),t.stopPropagation()),this.tappable&&this.ionBackdropTap.emit()}hostData(){return{tabindex:"-1",class:{"backdrop-hide":!this.visible,"backdrop-no-tappable":!this.tappable}}}static get is(){return"ion-backdrop"}static get encapsulation(){return"shadow"}static get properties(){return{doc:{context:"document"},stopPropagation:{type:Boolean,attr:"stop-propagation"},tappable:{type:Boolean,attr:"tappable"},visible:{type:Boolean,attr:"visible"}}}static get events(){return[{name:"ionBackdropTap",method:"ionBackdropTap",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"touchstart",method:"onTouchStart",capture:!0},{name:"click",method:"onMouseDown",capture:!0},{name:"mousedown",method:"onMouseDown",capture:!0}]}static get style(){return".sc-ion-backdrop-md-h{left:0;right:0;top:0;bottom:0;display:block;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);contain:strict;cursor:pointer;opacity:.01;-ms-touch-action:none;touch-action:none;z-index:2}.backdrop-hide.sc-ion-backdrop-md-h{background:transparent}.backdrop-no-tappable.sc-ion-backdrop-md-h{cursor:auto}.sc-ion-backdrop-md-h{background-color:var(--ion-backdrop-color,#000)}"}static get styleMode(){return"md"}}let f=0;function p(t,e,s){const i=function(t,e){const s=Array.from(u(t).children).filter(t=>t.overlayIndex>0);return void 0===e?s:(e=e.toUpperCase(),s.filter(t=>t.tagName===e))}(t,e);return void 0===s?i[i.length-1]:i.find(t=>t.id===s)}function u(t){return t.querySelector("ion-app")||t.body}async function _(t,e,s,i){if(t.animation)return t.animation.destroy(),t.animation=void 0,!1;{s.classList.remove("ion-page-invisible");const n=s.shadowRoot||t.el,o=t.animation=await t.animationCtrl.create(e,n,i);t.animation=o,t.animated||o.duration(0),t.keyboardClose&&o.beforeAddWrite(()=>{const t=s.ownerDocument.activeElement;t&&t.matches("input, ion-input, ion-textarea")&&t.blur()}),await o.playAsync();const r=o.hasCompleted;return o.destroy(),t.animation=void 0,r}}function b(t,e){let s;const i=new Promise(t=>s=t);return function(t,e,i){const n=i=>{t.removeEventListener(e,n),(t=>{s(t.detail)})(i)};t.addEventListener(e,n)}(t,e),i}const y="backdrop";function g(t,e){return{[e]:!0,[`${e}-${t}`]:!!t}}async function v(t){const e=t;if(e){if(null!=e.componentOnReady&&null!=await e.componentOnReady())return;await Promise.all(Array.from(e.children).map(v))}}function w(t,e){const s=new t,i=new t;i.addElement(e.querySelector("ion-backdrop"));const n=new t;return n.addElement(e.querySelector(".modal-wrapper")),n.beforeStyles({opacity:1}).fromTo("translateY","100%","0%"),i.fromTo("opacity",.01,.4),Promise.resolve(s.addElement(e).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(400).beforeAddClass("show-modal").add(i).add(n))}function k(t,e){const s=new t,i=new t;i.addElement(e.querySelector("ion-backdrop"));const n=new t,o=e.querySelector(".modal-wrapper");n.addElement(o);const r=o.getBoundingClientRect();return n.beforeStyles({opacity:1}).fromTo("translateY","0%",`${window.innerHeight-r.top}px`),i.fromTo("opacity",.4,0),Promise.resolve(s.addElement(e).easing("ease-out").duration(250).add(i).add(n))}function D(t,e){const s=new t,i=new t;i.addElement(e.querySelector("ion-backdrop"));const n=new t;return n.addElement(e.querySelector(".modal-wrapper")),n.fromTo("opacity",.01,1).fromTo("translateY","40px","0px"),i.fromTo("opacity",.01,.4),Promise.resolve(s.addElement(e).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(280).beforeAddClass("show-modal").add(i).add(n))}function C(t,e){const s=new t,i=new t;i.addElement(e.querySelector("ion-backdrop"));const n=new t,o=e.querySelector(".modal-wrapper");return n.addElement(o),n.fromTo("opacity",.99,0).fromTo("translateY","0px","40px"),i.fromTo("opacity",.4,0),Promise.resolve(s.addElement(e).easing("cubic-bezier(0.47,0,0.745,0.715)").duration(200).add(i).add(n))}class S{constructor(){this.presented=!1,this.keyboardClose=!0,this.backdropDismiss=!0,this.showBackdrop=!0,this.animated=!0}componentDidLoad(){this.ionModalDidLoad.emit()}componentDidUnload(){this.ionModalDidUnload.emit()}onDismiss(t){t.stopPropagation(),t.preventDefault(),this.dismiss()}onBackdropTap(){this.dismiss(void 0,y)}lifecycle(t){const e=this.usersElement,s=A[t.type];if(e&&s){const i=new CustomEvent(s,{bubbles:!1,cancelable:!1,detail:t.detail});e.dispatchEvent(i)}}async present(){if(this.presented)return;const t=this.el.querySelector(".modal-wrapper");if(!t)throw new Error("container is undefined");const e=Object.assign({},this.componentProps,{modal:this.el});return this.usersElement=await async function(t,e,s,i,n){if(t)return t.attachViewToDom(e,s,n,i);if("string"!=typeof s&&!(s instanceof HTMLElement))throw new Error("framework delegate is missing");const o="string"==typeof s?e.ownerDocument.createElement(s):s;return i&&i.forEach(t=>o.classList.add(t)),n&&Object.assign(o,n),e.appendChild(o),o.componentOnReady&&await o.componentOnReady(),o}(this.delegate,t,this.component,["ion-page"],e),await v(this.usersElement),async function(t,e,s,i,n){if(t.presented)return;t.presented=!0,t.willPresent.emit();const o=t.enterAnimation?t.enterAnimation:t.config.get("modalEnter","ios"===t.mode?s:i);await _(t,o,t.el,void 0)&&t.didPresent.emit()}(this,0,w,D)}async dismiss(t,e){const s=await async function(t,e,s,i,n,o,r){if(!t.presented)return!1;t.presented=!1;try{t.willDismiss.emit({data:e,role:s});const i=t.leaveAnimation?t.leaveAnimation:t.config.get("modalLeave","ios"===t.mode?n:o);await _(t,i,t.el,void 0),t.didDismiss.emit({data:e,role:s})}catch(t){console.error(t)}return t.el.remove(),!0}(this,t,e,0,k,C);return s&&await function(t,e){if(e){if(t)return t.removeViewFromDom(e.parentElement,e);e.remove()}return Promise.resolve()}(this.delegate,this.usersElement),s}onDidDismiss(){return b(this.el,"ionModalDidDismiss")}onWillDismiss(){return b(this.el,"ionModalWillDismiss")}hostData(){return{"no-router":!0,class:Object.assign({},g(this.mode,"modal"),function(t){const e={};return function(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter(t=>null!=t).map(t=>t.trim()).filter(t=>""!==t):[]}(t).forEach(t=>e[t]=!0),e}(this.cssClass)),style:{zIndex:2e4+this.overlayIndex}}}render(){const e=g(this.mode,"modal-wrapper");return[t("ion-backdrop",{visible:this.showBackdrop,tappable:this.backdropDismiss}),t("div",{role:"dialog",class:e})]}static get is(){return"ion-modal"}static get properties(){return{animated:{type:Boolean,attr:"animated"},animationCtrl:{connect:"ion-animation-controller"},backdropDismiss:{type:Boolean,attr:"backdrop-dismiss"},component:{type:String,attr:"component"},componentProps:{type:"Any",attr:"component-props"},config:{context:"config"},cssClass:{type:String,attr:"css-class"},delegate:{type:"Any",attr:"delegate"},dismiss:{method:!0},el:{elementRef:!0},enterAnimation:{type:"Any",attr:"enter-animation"},keyboardClose:{type:Boolean,attr:"keyboard-close"},leaveAnimation:{type:"Any",attr:"leave-animation"},mode:{type:String,attr:"mode"},onDidDismiss:{method:!0},onWillDismiss:{method:!0},overlayIndex:{type:Number,attr:"overlay-index"},present:{method:!0},showBackdrop:{type:Boolean,attr:"show-backdrop"}}}static get events(){return[{name:"ionModalDidLoad",method:"ionModalDidLoad",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidUnload",method:"ionModalDidUnload",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidPresent",method:"didPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalWillPresent",method:"willPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalWillDismiss",method:"willDismiss",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidDismiss",method:"didDismiss",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"ionDismiss",method:"onDismiss"},{name:"ionBackdropTap",method:"onBackdropTap"},{name:"ionModalDidPresent",method:"lifecycle"},{name:"ionModalWillPresent",method:"lifecycle"},{name:"ionModalWillDismiss",method:"lifecycle"},{name:"ionModalDidDismiss",method:"lifecycle"}]}static get style(){return"ion-modal{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:strict}ion-modal-controller{display:none}\@media not all and (min-width:768px) and (min-height:600px){ion-modal ion-backdrop{display:none}}.modal-wrapper{width:100%;height:100%;contain:strict;z-index:10}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper{width:600px;height:500px}}\@media only screen and (min-width:768px) and (min-height:768px){.modal-wrapper{width:600px;height:600px}}.modal-wrapper-md{-webkit-transform:translate3d(0,40px,0);transform:translate3d(0,40px,0);opacity:.01}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper-md{border-radius:2px;-webkit-box-shadow:0 28px 48px rgba(0,0,0,.4);box-shadow:0 28px 48px rgba(0,0,0,.4);overflow:hidden}}"}static get styleMode(){return"md"}}const A={ionModalDidPresent:"ionViewDidEnter",ionModalWillPresent:"ionViewWillEnter",ionModalWillDismiss:"ionViewWillLeave",ionModalDidDismiss:"ionViewDidLeave"};class E{create(t){return function(t,e){const s=t.ownerDocument;!function(t){0===f&&(f=1,t.addEventListener("ionBackButton",e=>{const s=p(t);s&&s.backdropDismiss&&e.detail.register(100,()=>s.dismiss(void 0,y))}),t.addEventListener("keyup",e=>{if("Escape"===e.key){const e=p(t);e&&e.backdropDismiss&&e.dismiss(void 0,y)}}))}(s),Object.assign(t,e),t.classList.add("ion-page-invisible");const i=f++;return t.overlayIndex=i,t.hasAttribute("id")||(t.id=`ion-overlay-${i}`),u(s).appendChild(t),t.componentOnReady()}(this.doc.createElement("ion-modal"),t)}dismiss(t,e,s){return function(t,e,s,i,n){const o=p(t,"ion-modal",n);return o?o.dismiss(e,s):Promise.reject("overlay does not exist")}(this.doc,t,e,0,s)}async getTop(){return p(this.doc,"ion-modal")}static get is(){return"ion-modal-controller"}static get properties(){return{create:{method:!0},dismiss:{method:!0},doc:{context:"document"},getTop:{method:!0}}}}export{a as IonAnimationController,m as IonBackdrop,S as IonModal,E as IonModalController};