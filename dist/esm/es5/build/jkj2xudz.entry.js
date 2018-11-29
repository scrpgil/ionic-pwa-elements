/*! Built with http://stenciljs.com */
import*as tslib_1 from"../polyfills/tslib.js";import{h}from"../ionicpwaelements.core.js";function transitionEnd(t,e){var i,n={passive:!0};function r(){i&&i()}function o(i){t===i.target&&(r(),e(i))}return t&&(t.addEventListener("webkitTransitionEnd",o,n),t.addEventListener("transitionend",o,n),i=function(){t.removeEventListener("webkitTransitionEnd",o,n),t.removeEventListener("transitionend",o,n)}),r}var CSS_VALUE_REGEX=/(^-?\d*\.?\d*)(.*)/,DURATION_MIN=32,TRANSITION_END_FALLBACK_PADDING_MS=400,TRANSFORM_PROPS={translateX:1,translateY:1,translateZ:1,scale:1,scaleX:1,scaleY:1,scaleZ:1,rotate:1,rotateX:1,rotateY:1,rotateZ:1,skewX:1,skewY:1,perspective:1},raf=window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){return t(Date.now())},Animator=function(){function t(){this._hasDur=!1,this._hasTweenEffect=!1,this._isAsync=!1,this._isReverse=!1,this._destroyed=!1,this.hasChildren=!1,this.isPlaying=!1,this.hasCompleted=!1}return t.prototype.addElement=function(t){if(null!=t)if(t.length>0)for(var e=0;e<t.length;e++)this._addEl(t[e]);else this._addEl(t);return this},t.prototype._addEl=function(t){1===t.nodeType&&(this._elements=this._elements||[]).push(t)},t.prototype.add=function(t){return t.parent=this,this.hasChildren=!0,(this._childAnimations=this._childAnimations||[]).push(t),this},t.prototype.getDuration=function(e){if(t.animated){if(e&&void 0!==e.duration)return e.duration;if(void 0!==this._duration)return this._duration;if(this.parent)return this.parent.getDuration()}return 0},t.prototype.isRoot=function(){return!this.parent},t.prototype.duration=function(t){return this._duration=t,this},t.prototype.getEasing=function(){return this._isReverse&&void 0!==this._reversedEasingName?this._reversedEasingName:void 0!==this._easingName?this._easingName:this.parent&&this.parent.getEasing()||null},t.prototype.easing=function(t){return this._easingName=t,this},t.prototype.easingReverse=function(t){return this._reversedEasingName=t,this},t.prototype.from=function(t,e){return this._addProp("from",t,e),this},t.prototype.to=function(t,e,i){void 0===i&&(i=!1);var n=this._addProp("to",t,e);return i&&this.afterClearStyles([n.trans?"transform":t]),this},t.prototype.fromTo=function(t,e,i,n){return this.from(t,e).to(t,i,n)},t.prototype._getProp=function(t){if(this._fxProperties)return this._fxProperties.find(function(e){return e.effectName===t})},t.prototype._addProp=function(t,e,i){var n=this._getProp(e);if(!n){var r=1===TRANSFORM_PROPS[e];n={effectName:e,trans:r,wc:r?"transform":e},(this._fxProperties=this._fxProperties||[]).push(n)}var o={val:i,num:0,effectUnit:""};if(n[t]=o,"string"==typeof i&&i.indexOf(" ")<0){var s=i.match(CSS_VALUE_REGEX);if(s){var a=parseFloat(s[1]);isNaN(a)||(o.num=a),o.effectUnit=s[0]!==s[2]?s[2]:""}}else"number"==typeof i&&(o.num=i);return n},t.prototype.beforeAddClass=function(t){return(this._beforeAddClasses=this._beforeAddClasses||[]).push(t),this},t.prototype.beforeRemoveClass=function(t){return(this._beforeRemoveClasses=this._beforeRemoveClasses||[]).push(t),this},t.prototype.beforeStyles=function(t){return this._beforeStyles=t,this},t.prototype.beforeClearStyles=function(t){this._beforeStyles=this._beforeStyles||{};for(var e=0,i=t;e<i.length;e++)this._beforeStyles[i[e]]="";return this},t.prototype.beforeAddRead=function(t){return(this._readCallbacks=this._readCallbacks||[]).push(t),this},t.prototype.beforeAddWrite=function(t){return(this._writeCallbacks=this._writeCallbacks||[]).push(t),this},t.prototype.afterAddClass=function(t){return(this._afterAddClasses=this._afterAddClasses||[]).push(t),this},t.prototype.afterRemoveClass=function(t){return(this._afterRemoveClasses=this._afterRemoveClasses||[]).push(t),this},t.prototype.afterStyles=function(t){return this._afterStyles=t,this},t.prototype.afterClearStyles=function(t){this._afterStyles=this._afterStyles||{};for(var e=0,i=t;e<i.length;e++)this._afterStyles[i[e]]="";return this},t.prototype.play=function(t){var e=this;this._destroyed||(this._isAsync=this._hasDuration(t),this._clearAsync(),this._playInit(t),raf(function(){raf(function(){e._playDomInspect(t)})}))},t.prototype.playAsync=function(t){var e=this;return new Promise(function(i){return e.onFinish(i,{oneTimeCallback:!0,clearExistingCallbacks:!0}),e.play(t),e})},t.prototype.playSync=function(){if(!this._destroyed){var t={duration:0};this._isAsync=!1,this._clearAsync(),this._playInit(t),this._playDomInspect(t)}},t.prototype._playInit=function(t){this._hasTweenEffect=!1,this.isPlaying=!0,this.hasCompleted=!1,this._hasDur=this.getDuration(t)>DURATION_MIN;var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)n[i]._playInit(t);this._hasDur&&(this._progress(0),this._willChange(!0))},t.prototype._playDomInspect=function(t){var e=this;this._beforeAnimation();var i=this.getDuration(t);this._isAsync&&this._asyncEnd(i,!0),this._playProgress(t),this._isAsync&&!this._destroyed&&raf(function(){e._playToStep(1)})},t.prototype._playProgress=function(t){var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)n[i]._playProgress(t);this._hasDur?this._setTrans(this.getDuration(t),!1):(this._progress(1),this._setAfterStyles(),this._didFinish(!0))},t.prototype._playToStep=function(t){if(!this._destroyed){var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)n[i]._playToStep(t);this._hasDur&&this._progress(t)}},t.prototype._asyncEnd=function(t,e){var i=this;i._unregisterTrnsEnd=transitionEnd(i._transEl(),function(){i._clearAsync(),i._playEnd(),i._didFinishAll(e,!0,!1)}),i._timerId=setTimeout(function(){i._timerId=void 0,i._clearAsync(),i._playEnd(e?1:0),i._didFinishAll(e,!0,!1)},t+TRANSITION_END_FALLBACK_PADDING_MS)},t.prototype._playEnd=function(t){var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)n[i]._playEnd(t);this._hasDur&&(void 0!==t&&(this._setTrans(0,!0),this._progress(t)),this._setAfterStyles(),this._willChange(!1))},t.prototype._hasDuration=function(t){if(this.getDuration(t)>DURATION_MIN)return!0;var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)if(n[i]._hasDuration(t))return!0;return!1},t.prototype._hasDomReads=function(){if(this._readCallbacks&&this._readCallbacks.length>0)return!0;var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++)if(i[e]._hasDomReads())return!0;return!1},t.prototype.stop=function(t){void 0===t&&(t=1),this._clearAsync(),this._hasDur=!0,this._playEnd(t)},t.prototype._clearAsync=function(){this._unregisterTrnsEnd&&this._unregisterTrnsEnd(),this._timerId&&clearTimeout(this._timerId),this._timerId=this._unregisterTrnsEnd=void 0},t.prototype._progress=function(t){var e,i=this._elements,n=this._fxProperties;if(i&&0!==i.length&&n&&!this._destroyed){this._isReverse&&(t=1-t);var r,o=0,s=0,a="";for(o=0;o<n.length;o++)if((r=n[o]).from&&r.to){var l=r.from.num,c=r.to.num,d=l!==c;if(d&&(this._hasTweenEffect=!0),0===t?e=r.from.val:1===t?e=r.to.val:d&&(e=(c-l)*t+l+r.to.effectUnit),null!==e){var h=r.effectName;if(r.trans)a+=h+"("+e+") ";else for(s=0;s<i.length;s++)i[s].style.setProperty(h,e)}}if(a.length>0)for((!this._isReverse&&1!==t||this._isReverse&&0!==t)&&(a+="translateZ(0px)"),o=0;o<i.length;o++)i[o].style.setProperty("transform",a)}},t.prototype._setTrans=function(t,e){var i=this._elements;if(i&&0!==i.length&&this._fxProperties)for(var n=e?"linear":this.getEasing(),r=t+"ms",o=0,s=i;o<s.length;o++){var a=s[o].style;t>0?(a.transitionDuration=r,null!==n&&(a.transitionTimingFunction=n)):a.transitionDuration="0"}},t.prototype._beforeAnimation=function(){this._fireBeforeReadFunc(),this._fireBeforeWriteFunc(),this._setBeforeStyles()},t.prototype._setBeforeStyles=function(){var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++)i[e]._setBeforeStyles();var n=this._elements;if(n&&0!==n.length&&!this._isReverse)for(var r=this._beforeAddClasses,o=this._beforeRemoveClasses,s=0,a=n;s<a.length;s++){var l=a[s],c=l.classList;if(r)for(var d=0,h=r;d<h.length;d++)c.add(h[d]);if(o)for(var u=0,p=o;u<p.length;u++)c.remove(p[u]);if(this._beforeStyles)for(var f=0,m=Object.entries(this._beforeStyles);f<m.length;f++){var y=m[f];l.style.setProperty(y[0],y[1])}}},t.prototype._fireBeforeReadFunc=function(){var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++)i[e]._fireBeforeReadFunc();var n=this._readCallbacks;if(n)for(var r=0,o=n;r<o.length;r++)(0,o[r])()},t.prototype._fireBeforeWriteFunc=function(){var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++)i[e]._fireBeforeWriteFunc();var n=this._writeCallbacks;if(n)for(var r=0,o=n;r<o.length;r++)(0,o[r])()},t.prototype._setAfterStyles=function(){var t=this._elements;if(t)for(var e=0,i=t;e<i.length;e++){var n=i[e],r=n.classList;if(n.style.transitionDuration=n.style.transitionTimingFunction="",this._isReverse){var o=this._beforeAddClasses;if(o)for(var s=0,a=o;s<a.length;s++)r.remove(a[s]);var l=this._beforeRemoveClasses;if(l)for(var c=0,d=l;c<d.length;c++)r.add(d[c]);var h=this._beforeStyles;if(h)for(var u=0,p=Object.keys(h);u<p.length;u++)n.style.removeProperty(p[u])}else{var f=this._afterAddClasses;if(f)for(var m=0,y=f;m<y.length;m++)r.add(y[m]);var _=this._afterRemoveClasses;if(_)for(var v=0,b=_;v<b.length;v++)r.remove(b[v]);var g=this._afterStyles;if(g)for(var A=0,C=Object.entries(g);A<C.length;A++){var w=C[A];n.style.setProperty(w[0],w[1])}}}},t.prototype._willChange=function(t){var e,i,n=this._fxProperties;if(t&&n){e=[];for(var r=0,o=n;r<o.length;r++){var s=o[r].wc;"webkitTransform"===s?e.push("transform","-webkit-transform"):void 0!==s&&e.push(s)}i=e.join(",")}else i="";var a=this._elements;if(a)for(var l=0,c=a;l<c.length;l++)c[l].style.setProperty("will-change",i)},t.prototype.progressStart=function(){this._clearAsync(),this._beforeAnimation(),this._progressStart()},t.prototype._progressStart=function(){var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++)i[e]._progressStart();this._setTrans(0,!0),this._willChange(!0)},t.prototype.progressStep=function(t){t=Math.min(1,Math.max(0,t));var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)n[i].progressStep(t);this._progress(t)},t.prototype.progressEnd=function(t,e,i){var n=this;void 0===i&&(i=-1),this._isReverse&&(e=1-e);var r=t?1:0,o=Math.abs(e-r);i<0?i=this._duration||0:o<.05&&(i=0),this._isAsync=i>30,this._progressEnd(t,r,i,this._isAsync),this._isAsync&&(this._asyncEnd(i,t),this._destroyed||raf(function(){n._playToStep(r)}))},t.prototype._progressEnd=function(t,e,i,n){var r=this._childAnimations;if(r)for(var o=0,s=r;o<s.length;o++)s[o]._progressEnd(t,e,i,n);n?(this.isPlaying=!0,this.hasCompleted=!1,this._hasDur=!0,this._willChange(!0),this._setTrans(i,!1)):(this._progress(e),this._willChange(!1),this._setAfterStyles(),this._didFinish(t))},t.prototype.onFinish=function(t,e){return e&&e.clearExistingCallbacks&&(this._onFinishCallbacks=this._onFinishOneTimeCallbacks=void 0),e&&e.oneTimeCallback?(this._onFinishOneTimeCallbacks=this._onFinishOneTimeCallbacks||[],this._onFinishOneTimeCallbacks.push(t)):(this._onFinishCallbacks=this._onFinishCallbacks||[],this._onFinishCallbacks.push(t)),this},t.prototype._didFinishAll=function(t,e,i){var n=this._childAnimations;if(n)for(var r=0,o=n;r<o.length;r++)o[r]._didFinishAll(t,e,i);(e&&this._isAsync||i&&!this._isAsync)&&this._didFinish(t)},t.prototype._didFinish=function(t){if(this.isPlaying=!1,this.hasCompleted=t,this._onFinishCallbacks)for(var e=0,i=this._onFinishCallbacks;e<i.length;e++)(0,i[e])(this);if(this._onFinishOneTimeCallbacks){for(var n=0,r=this._onFinishOneTimeCallbacks;n<r.length;n++)(0,r[n])(this);this._onFinishOneTimeCallbacks.length=0}},t.prototype.reverse=function(t){void 0===t&&(t=!0);var e=this._childAnimations;if(e)for(var i=0,n=e;i<n.length;i++)n[i].reverse(t);return this._isReverse=!!t,this},t.prototype.destroy=function(){this._didFinish(!1),this._destroyed=!0;var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++)i[e].destroy();this._clearAsync(),this._elements&&(this._elements.length=0),this._readCallbacks&&(this._readCallbacks.length=0),this._writeCallbacks&&(this._writeCallbacks.length=0),this.parent=void 0,this._childAnimations&&(this._childAnimations.length=0),this._onFinishCallbacks&&(this._onFinishCallbacks.length=0),this._onFinishOneTimeCallbacks&&(this._onFinishOneTimeCallbacks.length=0)},t.prototype._transEl=function(){var t=this._childAnimations;if(t)for(var e=0,i=t;e<i.length;e++){var n=i[e]._transEl();if(n)return n}return this._hasTweenEffect&&this._hasDur&&void 0!==this._elements&&this._elements.length>0?this._elements[0]:null},t}();Animator.animated=!0;var AnimationControllerImpl=function(){function t(){}return t.prototype.create=function(t,e,i){return Animator.animated=this.config.getBoolean("animated",!0),t?t(Animator,e,i):Promise.resolve(new Animator)},Object.defineProperty(t,"is",{get:function(){return"ion-animation-controller"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{config:{context:"config"},create:{method:!0}}},enumerable:!0,configurable:!0}),t}(),GestureController=function(){function t(t){this.doc=t,this.gestureId=0,this.requestedStart=new Map,this.disabledGestures=new Map,this.disabledScroll=new Set}return t.prototype.createGesture=function(t){return new GestureDelegate(this,this.newID(),t.name,t.priority||0,!!t.disableScroll)},t.prototype.createBlocker=function(t){return void 0===t&&(t={}),new BlockerDelegate(this,this.newID(),t.disable,!!t.disableScroll)},t.prototype.start=function(t,e,i){return this.canStart(t)?(this.requestedStart.set(e,i),!0):(this.requestedStart.delete(e),!1)},t.prototype.capture=function(t,e,i){if(!this.start(t,e,i))return!1;var n=this.requestedStart,r=-1e4;if(n.forEach(function(t){r=Math.max(r,t)}),r===i){this.capturedId=e,n.clear();var o=new CustomEvent("ionGestureCaptured",{detail:t});return this.doc.body.dispatchEvent(o),!0}return n.delete(e),!1},t.prototype.release=function(t){this.requestedStart.delete(t),this.capturedId===t&&(this.capturedId=void 0)},t.prototype.disableGesture=function(t,e){var i=this.disabledGestures.get(t);void 0===i&&(i=new Set,this.disabledGestures.set(t,i)),i.add(e)},t.prototype.enableGesture=function(t,e){var i=this.disabledGestures.get(t);void 0!==i&&i.delete(e)},t.prototype.disableScroll=function(t){this.disabledScroll.add(t),1===this.disabledScroll.size&&this.doc.body.classList.add(BACKDROP_NO_SCROLL)},t.prototype.enableScroll=function(t){this.disabledScroll.delete(t),0===this.disabledScroll.size&&this.doc.body.classList.remove(BACKDROP_NO_SCROLL)},t.prototype.canStart=function(t){return void 0===this.capturedId&&!this.isDisabled(t)},t.prototype.isCaptured=function(){return void 0!==this.capturedId},t.prototype.isScrollDisabled=function(){return this.disabledScroll.size>0},t.prototype.isDisabled=function(t){var e=this.disabledGestures.get(t);return!!(e&&e.size>0)},t.prototype.newID=function(){return this.gestureId++,this.gestureId},t}(),GestureDelegate=function(){function t(t,e,i,n,r){this.id=e,this.name=i,this.priority=n,this.disableScroll=r,this.ctrl=t}return t.prototype.canStart=function(){return!!this.ctrl&&this.ctrl.canStart(this.name)},t.prototype.start=function(){return!!this.ctrl&&this.ctrl.start(this.name,this.id,this.priority)},t.prototype.capture=function(){if(!this.ctrl)return!1;var t=this.ctrl.capture(this.name,this.id,this.priority);return t&&this.disableScroll&&this.ctrl.disableScroll(this.id),t},t.prototype.release=function(){this.ctrl&&(this.ctrl.release(this.id),this.disableScroll&&this.ctrl.enableScroll(this.id))},t.prototype.destroy=function(){this.release(),this.ctrl=void 0},t}(),BlockerDelegate=function(){function t(t,e,i,n){this.id=e,this.disable=i,this.disableScroll=n,this.ctrl=t}return t.prototype.block=function(){if(this.ctrl){if(this.disable)for(var t=0,e=this.disable;t<e.length;t++)this.ctrl.disableGesture(e[t],this.id);this.disableScroll&&this.ctrl.disableScroll(this.id)}},t.prototype.unblock=function(){if(this.ctrl){if(this.disable)for(var t=0,e=this.disable;t<e.length;t++)this.ctrl.enableGesture(e[t],this.id);this.disableScroll&&this.ctrl.enableScroll(this.id)}},t.prototype.destroy=function(){this.unblock(),this.ctrl=void 0},t}(),BACKDROP_NO_SCROLL="backdrop-no-scroll",GESTURE_CONTROLLER=new GestureController(document);function now(t){return t.timeStamp||Date.now()}var Backdrop=function(){function t(){this.lastClick=-1e4,this.blocker=GESTURE_CONTROLLER.createBlocker({disableScroll:!0}),this.visible=!0,this.tappable=!0,this.stopPropagation=!0}return t.prototype.componentDidLoad=function(){this.stopPropagation&&this.blocker.block()},t.prototype.componentDidUnload=function(){this.blocker.destroy()},t.prototype.onTouchStart=function(t){this.lastClick=now(t),this.emitTap(t)},t.prototype.onMouseDown=function(t){this.lastClick<now(t)-2500&&this.emitTap(t)},t.prototype.emitTap=function(t){this.stopPropagation&&(t.preventDefault(),t.stopPropagation()),this.tappable&&this.ionBackdropTap.emit()},t.prototype.hostData=function(){return{tabindex:"-1",class:{"backdrop-hide":!this.visible,"backdrop-no-tappable":!this.tappable}}},Object.defineProperty(t,"is",{get:function(){return"ion-backdrop"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{doc:{context:"document"},stopPropagation:{type:Boolean,attr:"stop-propagation"},tappable:{type:Boolean,attr:"tappable"},visible:{type:Boolean,attr:"visible"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"ionBackdropTap",method:"ionBackdropTap",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"touchstart",method:"onTouchStart",capture:!0},{name:"click",method:"onMouseDown",capture:!0},{name:"mousedown",method:"onMouseDown",capture:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return":host{left:0;right:0;top:0;bottom:0;display:block;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);contain:strict;cursor:pointer;opacity:.01;-ms-touch-action:none;touch-action:none;z-index:2}:host(.backdrop-hide){background:transparent}:host(.backdrop-no-tappable){cursor:auto}:host{background-color:var(--ion-backdrop-color,#000)}"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"styleMode",{get:function(){return"md"},enumerable:!0,configurable:!0}),t}();function attachComponent(t,e,i,n,r){return tslib_1.__awaiter(this,void 0,void 0,function(){var o;return tslib_1.__generator(this,function(s){switch(s.label){case 0:if(t)return[2,t.attachViewToDom(e,i,r,n)];if("string"!=typeof i&&!(i instanceof HTMLElement))throw new Error("framework delegate is missing");return o="string"==typeof i?e.ownerDocument.createElement(i):i,n&&n.forEach(function(t){return o.classList.add(t)}),r&&Object.assign(o,r),e.appendChild(o),o.componentOnReady?[4,o.componentOnReady()]:[3,2];case 1:s.sent(),s.label=2;case 2:return[2,o]}})})}function detachComponent(t,e){if(e){if(t)return t.removeViewFromDom(e.parentElement,e);e.remove()}return Promise.resolve()}var lastId=0;function createOverlay(t,e){var i=t.ownerDocument;connectListeners(i),Object.assign(t,e),t.classList.add("ion-page-invisible");var n=lastId++;return t.overlayIndex=n,t.hasAttribute("id")||(t.id="ion-overlay-"+n),getAppRoot(i).appendChild(t),t.componentOnReady()}function connectListeners(t){0===lastId&&(lastId=1,t.addEventListener("ionBackButton",function(e){var i=getOverlay(t);i&&i.backdropDismiss&&e.detail.register(100,function(){return i.dismiss(void 0,BACKDROP)})}),t.addEventListener("keyup",function(e){if("Escape"===e.key){var i=getOverlay(t);i&&i.backdropDismiss&&i.dismiss(void 0,BACKDROP)}}))}function dismissOverlay(t,e,i,n,r){var o=getOverlay(t,n,r);return o?o.dismiss(e,i):Promise.reject("overlay does not exist")}function getOverlays(t,e){var i=Array.from(getAppRoot(t).children).filter(function(t){return t.overlayIndex>0});return void 0===e?i:(e=e.toUpperCase(),i.filter(function(t){return t.tagName===e}))}function getOverlay(t,e,i){var n=getOverlays(t,e);return void 0===i?n[n.length-1]:n.find(function(t){return t.id===i})}function present(t,e,i,n,r){return tslib_1.__awaiter(this,void 0,void 0,function(){var o;return tslib_1.__generator(this,function(s){switch(s.label){case 0:return t.presented?[2]:(t.presented=!0,t.willPresent.emit(),o=t.enterAnimation?t.enterAnimation:t.config.get(e,"ios"===t.mode?i:n),[4,overlayAnimation(t,o,t.el,r)]);case 1:return s.sent()&&t.didPresent.emit(),[2]}})})}function dismiss(t,e,i,n,r,o,s){return tslib_1.__awaiter(this,void 0,void 0,function(){var a,l;return tslib_1.__generator(this,function(c){switch(c.label){case 0:if(!t.presented)return[2,!1];t.presented=!1,c.label=1;case 1:return c.trys.push([1,3,,4]),t.willDismiss.emit({data:e,role:i}),a=t.leaveAnimation?t.leaveAnimation:t.config.get(n,"ios"===t.mode?r:o),[4,overlayAnimation(t,a,t.el,s)];case 2:return c.sent(),t.didDismiss.emit({data:e,role:i}),[3,4];case 3:return l=c.sent(),console.error(l),[3,4];case 4:return t.el.remove(),[2,!0]}})})}function getAppRoot(t){return t.querySelector("ion-app")||t.body}function overlayAnimation(t,e,i,n){return tslib_1.__awaiter(this,void 0,void 0,function(){var r,o,s;return tslib_1.__generator(this,function(a){switch(a.label){case 0:return t.animation?(t.animation.destroy(),t.animation=void 0,[2,!1]):[3,1];case 1:return i.classList.remove("ion-page-invisible"),o=t,[4,t.animationCtrl.create(e,i.shadowRoot||t.el,n)];case 2:return r=o.animation=a.sent(),t.animation=r,t.animated||r.duration(0),t.keyboardClose&&r.beforeAddWrite(function(){var t=i.ownerDocument.activeElement;t&&t.matches("input, ion-input, ion-textarea")&&t.blur()}),[4,r.playAsync()];case 3:return a.sent(),s=r.hasCompleted,r.destroy(),t.animation=void 0,[2,s]}})})}function eventMethod(t,e){var i,n=new Promise(function(t){return i=t});return onceEvent(t,e,function(t){i(t.detail)}),n}function onceEvent(t,e,i){var n=function(r){t.removeEventListener(e,n),i(r)};t.addEventListener(e,n)}var BACKDROP="backdrop";function createThemedClasses(t,e){var i;return(i={})[e]=!0,i[e+"-"+t]=!!t,i}function getClassList(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter(function(t){return null!=t}).map(function(t){return t.trim()}).filter(function(t){return""!==t}):[]}function getClassMap(t){var e={};return getClassList(t).forEach(function(t){return e[t]=!0}),e}function deepReady(t){return tslib_1.__awaiter(this,void 0,void 0,function(){var e;return tslib_1.__generator(this,function(i){switch(i.label){case 0:return(e=t)?null==e.componentOnReady?[3,2]:[4,e.componentOnReady()]:[3,4];case 1:if(null!=i.sent())return[2];i.label=2;case 2:return[4,Promise.all(Array.from(e.children).map(deepReady))];case 3:i.sent(),i.label=4;case 4:return[2]}})})}function iosEnterAnimation(t,e){var i=new t,n=new t;n.addElement(e.querySelector("ion-backdrop"));var r=new t;return r.addElement(e.querySelector(".modal-wrapper")),r.beforeStyles({opacity:1}).fromTo("translateY","100%","0%"),n.fromTo("opacity",.01,.4),Promise.resolve(i.addElement(e).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(400).beforeAddClass("show-modal").add(n).add(r))}function iosLeaveAnimation(t,e){var i=new t,n=new t;n.addElement(e.querySelector("ion-backdrop"));var r=new t,o=e.querySelector(".modal-wrapper");r.addElement(o);var s=o.getBoundingClientRect();return r.beforeStyles({opacity:1}).fromTo("translateY","0%",window.innerHeight-s.top+"px"),n.fromTo("opacity",.4,0),Promise.resolve(i.addElement(e).easing("ease-out").duration(250).add(n).add(r))}function mdEnterAnimation(t,e){var i=new t,n=new t;n.addElement(e.querySelector("ion-backdrop"));var r=new t;return r.addElement(e.querySelector(".modal-wrapper")),r.fromTo("opacity",.01,1).fromTo("translateY","40px","0px"),n.fromTo("opacity",.01,.4),Promise.resolve(i.addElement(e).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(280).beforeAddClass("show-modal").add(n).add(r))}function mdLeaveAnimation(t,e){var i=new t,n=new t;n.addElement(e.querySelector("ion-backdrop"));var r=new t,o=e.querySelector(".modal-wrapper");return r.addElement(o),r.fromTo("opacity",.99,0).fromTo("translateY","0px","40px"),n.fromTo("opacity",.4,0),Promise.resolve(i.addElement(e).easing("cubic-bezier(0.47,0,0.745,0.715)").duration(200).add(n).add(r))}var Modal=function(){function t(){this.presented=!1,this.keyboardClose=!0,this.backdropDismiss=!0,this.showBackdrop=!0,this.animated=!0}return t.prototype.componentDidLoad=function(){this.ionModalDidLoad.emit()},t.prototype.componentDidUnload=function(){this.ionModalDidUnload.emit()},t.prototype.onDismiss=function(t){t.stopPropagation(),t.preventDefault(),this.dismiss()},t.prototype.onBackdropTap=function(){this.dismiss(void 0,BACKDROP)},t.prototype.lifecycle=function(t){var e=this.usersElement,i=LIFECYCLE_MAP[t.type];if(e&&i){var n=new CustomEvent(i,{bubbles:!1,cancelable:!1,detail:t.detail});e.dispatchEvent(n)}},t.prototype.present=function(){return tslib_1.__awaiter(this,void 0,void 0,function(){var t,e,i;return tslib_1.__generator(this,function(n){switch(n.label){case 0:if(this.presented)return[2];if(!(t=this.el.querySelector(".modal-wrapper")))throw new Error("container is undefined");return e=Object.assign({},this.componentProps,{modal:this.el}),i=this,[4,attachComponent(this.delegate,t,this.component,["ion-page"],e)];case 1:return i.usersElement=n.sent(),[4,deepReady(this.usersElement)];case 2:return n.sent(),[2,present(this,"modalEnter",iosEnterAnimation,mdEnterAnimation)]}})})},t.prototype.dismiss=function(t,e){return tslib_1.__awaiter(this,void 0,void 0,function(){var i;return tslib_1.__generator(this,function(n){switch(n.label){case 0:return[4,dismiss(this,t,e,"modalLeave",iosLeaveAnimation,mdLeaveAnimation)];case 1:return(i=n.sent())?[4,detachComponent(this.delegate,this.usersElement)]:[3,3];case 2:n.sent(),n.label=3;case 3:return[2,i]}})})},t.prototype.onDidDismiss=function(){return eventMethod(this.el,"ionModalDidDismiss")},t.prototype.onWillDismiss=function(){return eventMethod(this.el,"ionModalWillDismiss")},t.prototype.hostData=function(){return{"no-router":!0,class:Object.assign({},createThemedClasses(this.mode,"modal"),getClassMap(this.cssClass)),style:{zIndex:2e4+this.overlayIndex}}},t.prototype.render=function(){var t=createThemedClasses(this.mode,"modal-wrapper");return[h("ion-backdrop",{visible:this.showBackdrop,tappable:this.backdropDismiss}),h("div",{role:"dialog",class:t})]},Object.defineProperty(t,"is",{get:function(){return"ion-modal"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{animated:{type:Boolean,attr:"animated"},animationCtrl:{connect:"ion-animation-controller"},backdropDismiss:{type:Boolean,attr:"backdrop-dismiss"},component:{type:String,attr:"component"},componentProps:{type:"Any",attr:"component-props"},config:{context:"config"},cssClass:{type:String,attr:"css-class"},delegate:{type:"Any",attr:"delegate"},dismiss:{method:!0},el:{elementRef:!0},enterAnimation:{type:"Any",attr:"enter-animation"},keyboardClose:{type:Boolean,attr:"keyboard-close"},leaveAnimation:{type:"Any",attr:"leave-animation"},mode:{type:String,attr:"mode"},onDidDismiss:{method:!0},onWillDismiss:{method:!0},overlayIndex:{type:Number,attr:"overlay-index"},present:{method:!0},showBackdrop:{type:Boolean,attr:"show-backdrop"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"ionModalDidLoad",method:"ionModalDidLoad",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidUnload",method:"ionModalDidUnload",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidPresent",method:"didPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalWillPresent",method:"willPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalWillDismiss",method:"willDismiss",bubbles:!0,cancelable:!0,composed:!0},{name:"ionModalDidDismiss",method:"didDismiss",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"ionDismiss",method:"onDismiss"},{name:"ionBackdropTap",method:"onBackdropTap"},{name:"ionModalDidPresent",method:"lifecycle"},{name:"ionModalWillPresent",method:"lifecycle"},{name:"ionModalWillDismiss",method:"lifecycle"},{name:"ionModalDidDismiss",method:"lifecycle"}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"ion-modal{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:strict}ion-modal-controller{display:none}\@media not all and (min-width:768px) and (min-height:600px){ion-modal ion-backdrop{display:none}}.modal-wrapper{width:100%;height:100%;contain:strict;z-index:10}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper{width:600px;height:500px}}\@media only screen and (min-width:768px) and (min-height:768px){.modal-wrapper{width:600px;height:600px}}.modal-wrapper-md{-webkit-transform:translate3d(0,40px,0);transform:translate3d(0,40px,0);opacity:.01}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper-md{border-radius:2px;-webkit-box-shadow:0 28px 48px rgba(0,0,0,.4);box-shadow:0 28px 48px rgba(0,0,0,.4);overflow:hidden}}"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"styleMode",{get:function(){return"md"},enumerable:!0,configurable:!0}),t}(),LIFECYCLE_MAP={ionModalDidPresent:"ionViewDidEnter",ionModalWillPresent:"ionViewWillEnter",ionModalWillDismiss:"ionViewWillLeave",ionModalDidDismiss:"ionViewDidLeave"},ModalController=function(){function t(){}return t.prototype.create=function(t){return createOverlay(this.doc.createElement("ion-modal"),t)},t.prototype.dismiss=function(t,e,i){return dismissOverlay(this.doc,t,e,"ion-modal",i)},t.prototype.getTop=function(){return tslib_1.__awaiter(this,void 0,void 0,function(){return tslib_1.__generator(this,function(t){return[2,getOverlay(this.doc,"ion-modal")]})})},Object.defineProperty(t,"is",{get:function(){return"ion-modal-controller"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{create:{method:!0},dismiss:{method:!0},doc:{context:"document"},getTop:{method:!0}}},enumerable:!0,configurable:!0}),t}();export{AnimationControllerImpl as IonAnimationController,Backdrop as IonBackdrop,Modal as IonModal,ModalController as IonModalController};