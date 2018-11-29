/*! Built with http://stenciljs.com */
import { h } from '../ionicpwaelements.core.js';

function transitionEnd(el, callback) {
    let unRegTrans;
    const opts = { passive: true };
    function unregister() {
        if (unRegTrans) {
            unRegTrans();
        }
    }
    function onTransitionEnd(ev) {
        if (el === ev.target) {
            unregister();
            callback(ev);
        }
    }
    if (el) {
        el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
        el.addEventListener('transitionend', onTransitionEnd, opts);
        unRegTrans = () => {
            el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
            el.removeEventListener('transitionend', onTransitionEnd, opts);
        };
    }
    return unregister;
}

const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
const DURATION_MIN = 32;
const TRANSITION_END_FALLBACK_PADDING_MS = 400;
const TRANSFORM_PROPS = {
    'translateX': 1,
    'translateY': 1,
    'translateZ': 1,
    'scale': 1,
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'rotate': 1,
    'rotateX': 1,
    'rotateY': 1,
    'rotateZ': 1,
    'skewX': 1,
    'skewY': 1,
    'perspective': 1
};
const raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : (f) => f(Date.now());
class Animator {
    constructor() {
        this._hasDur = false;
        this._hasTweenEffect = false;
        this._isAsync = false;
        this._isReverse = false;
        this._destroyed = false;
        this.hasChildren = false;
        this.isPlaying = false;
        this.hasCompleted = false;
    }
    addElement(el) {
        if (el != null) {
            if (el.length > 0) {
                for (let i = 0; i < el.length; i++) {
                    this._addEl(el[i]);
                }
            }
            else {
                this._addEl(el);
            }
        }
        return this;
    }
    _addEl(el) {
        if (el.nodeType === 1) {
            (this._elements = this._elements || []).push(el);
        }
    }
    add(childAnimation) {
        childAnimation.parent = this;
        this.hasChildren = true;
        (this._childAnimations = this._childAnimations || []).push(childAnimation);
        return this;
    }
    getDuration(opts) {
        if (Animator.animated) {
            if (opts && opts.duration !== undefined) {
                return opts.duration;
            }
            else if (this._duration !== undefined) {
                return this._duration;
            }
            else if (this.parent) {
                return this.parent.getDuration();
            }
        }
        return 0;
    }
    isRoot() {
        return !this.parent;
    }
    duration(milliseconds) {
        this._duration = milliseconds;
        return this;
    }
    getEasing() {
        if (this._isReverse && this._reversedEasingName !== undefined) {
            return this._reversedEasingName;
        }
        return this._easingName !== undefined ? this._easingName : (this.parent && this.parent.getEasing()) || null;
    }
    easing(name) {
        this._easingName = name;
        return this;
    }
    easingReverse(name) {
        this._reversedEasingName = name;
        return this;
    }
    from(prop, val) {
        this._addProp('from', prop, val);
        return this;
    }
    to(prop, val, clearProperyAfterTransition = false) {
        const fx = this._addProp('to', prop, val);
        if (clearProperyAfterTransition) {
            this.afterClearStyles([fx.trans ? 'transform' : prop]);
        }
        return this;
    }
    fromTo(prop, fromVal, toVal, clearProperyAfterTransition) {
        return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
    }
    _getProp(name) {
        if (this._fxProperties) {
            return this._fxProperties.find(prop => prop.effectName === name);
        }
        return undefined;
    }
    _addProp(state, prop, val) {
        let fxProp = this._getProp(prop);
        if (!fxProp) {
            const shouldTrans = (TRANSFORM_PROPS[prop] === 1);
            fxProp = {
                effectName: prop,
                trans: shouldTrans,
                wc: (shouldTrans ? 'transform' : prop)
            };
            (this._fxProperties = this._fxProperties || []).push(fxProp);
        }
        const fxState = {
            val,
            num: 0,
            effectUnit: '',
        };
        fxProp[state] = fxState;
        if (typeof val === 'string' && val.indexOf(' ') < 0) {
            const r = val.match(CSS_VALUE_REGEX);
            if (r) {
                const num = parseFloat(r[1]);
                if (!isNaN(num)) {
                    fxState.num = num;
                }
                fxState.effectUnit = (r[0] !== r[2] ? r[2] : '');
            }
        }
        else if (typeof val === 'number') {
            fxState.num = val;
        }
        return fxProp;
    }
    beforeAddClass(className) {
        (this._beforeAddClasses = this._beforeAddClasses || []).push(className);
        return this;
    }
    beforeRemoveClass(className) {
        (this._beforeRemoveClasses = this._beforeRemoveClasses || []).push(className);
        return this;
    }
    beforeStyles(styles) {
        this._beforeStyles = styles;
        return this;
    }
    beforeClearStyles(propertyNames) {
        this._beforeStyles = this._beforeStyles || {};
        for (const prop of propertyNames) {
            this._beforeStyles[prop] = '';
        }
        return this;
    }
    beforeAddRead(domReadFn) {
        (this._readCallbacks = this._readCallbacks || []).push(domReadFn);
        return this;
    }
    beforeAddWrite(domWriteFn) {
        (this._writeCallbacks = this._writeCallbacks || []).push(domWriteFn);
        return this;
    }
    afterAddClass(className) {
        (this._afterAddClasses = this._afterAddClasses || []).push(className);
        return this;
    }
    afterRemoveClass(className) {
        (this._afterRemoveClasses = this._afterRemoveClasses || []).push(className);
        return this;
    }
    afterStyles(styles) {
        this._afterStyles = styles;
        return this;
    }
    afterClearStyles(propertyNames) {
        this._afterStyles = this._afterStyles || {};
        for (const prop of propertyNames) {
            this._afterStyles[prop] = '';
        }
        return this;
    }
    play(opts) {
        if (this._destroyed) {
            return;
        }
        this._isAsync = this._hasDuration(opts);
        this._clearAsync();
        this._playInit(opts);
        raf(() => {
            raf(() => {
                this._playDomInspect(opts);
            });
        });
    }
    playAsync(opts) {
        return new Promise(resolve => {
            this.onFinish(resolve, { oneTimeCallback: true, clearExistingCallbacks: true });
            this.play(opts);
            return this;
        });
    }
    playSync() {
        if (!this._destroyed) {
            const opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        }
    }
    _playInit(opts) {
        this._hasTweenEffect = false;
        this.isPlaying = true;
        this.hasCompleted = false;
        this._hasDur = (this.getDuration(opts) > DURATION_MIN);
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._playInit(opts);
            }
        }
        if (this._hasDur) {
            this._progress(0);
            this._willChange(true);
        }
    }
    _playDomInspect(opts) {
        this._beforeAnimation();
        const dur = this.getDuration(opts);
        if (this._isAsync) {
            this._asyncEnd(dur, true);
        }
        this._playProgress(opts);
        if (this._isAsync && !this._destroyed) {
            raf(() => {
                this._playToStep(1);
            });
        }
    }
    _playProgress(opts) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._playProgress(opts);
            }
        }
        if (this._hasDur) {
            this._setTrans(this.getDuration(opts), false);
        }
        else {
            this._progress(1);
            this._setAfterStyles();
            this._didFinish(true);
        }
    }
    _playToStep(stepValue) {
        if (!this._destroyed) {
            const children = this._childAnimations;
            if (children) {
                for (const child of children) {
                    child._playToStep(stepValue);
                }
            }
            if (this._hasDur) {
                this._progress(stepValue);
            }
        }
    }
    _asyncEnd(dur, shouldComplete) {
        const self = this;
        function onTransitionEnd() {
            self._clearAsync();
            self._playEnd();
            self._didFinishAll(shouldComplete, true, false);
        }
        function onTransitionFallback() {
            console.debug('Animation onTransitionFallback, CSS onTransitionEnd did not fire!');
            self._timerId = undefined;
            self._clearAsync();
            self._playEnd(shouldComplete ? 1 : 0);
            self._didFinishAll(shouldComplete, true, false);
        }
        self._unregisterTrnsEnd = transitionEnd(self._transEl(), onTransitionEnd);
        self._timerId = setTimeout(onTransitionFallback, (dur + TRANSITION_END_FALLBACK_PADDING_MS));
    }
    _playEnd(stepValue) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._playEnd(stepValue);
            }
        }
        if (this._hasDur) {
            if (stepValue !== undefined) {
                this._setTrans(0, true);
                this._progress(stepValue);
            }
            this._setAfterStyles();
            this._willChange(false);
        }
    }
    _hasDuration(opts) {
        if (this.getDuration(opts) > DURATION_MIN) {
            return true;
        }
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                if (child._hasDuration(opts)) {
                    return true;
                }
            }
        }
        return false;
    }
    _hasDomReads() {
        if (this._readCallbacks && this._readCallbacks.length > 0) {
            return true;
        }
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                if (child._hasDomReads()) {
                    return true;
                }
            }
        }
        return false;
    }
    stop(stepValue = 1) {
        this._clearAsync();
        this._hasDur = true;
        this._playEnd(stepValue);
    }
    _clearAsync() {
        if (this._unregisterTrnsEnd) {
            this._unregisterTrnsEnd();
        }
        if (this._timerId) {
            clearTimeout(this._timerId);
        }
        this._timerId = this._unregisterTrnsEnd = undefined;
    }
    _progress(stepValue) {
        let val;
        const elements = this._elements;
        const effects = this._fxProperties;
        if (!elements || elements.length === 0 || !effects || this._destroyed) {
            return;
        }
        if (this._isReverse) {
            stepValue = 1 - stepValue;
        }
        let i = 0;
        let j = 0;
        let finalTransform = '';
        let fx;
        for (i = 0; i < effects.length; i++) {
            fx = effects[i];
            if (fx.from && fx.to) {
                const fromNum = fx.from.num;
                const toNum = fx.to.num;
                const tweenEffect = (fromNum !== toNum);
                if (tweenEffect) {
                    this._hasTweenEffect = true;
                }
                if (stepValue === 0) {
                    val = fx.from.val;
                }
                else if (stepValue === 1) {
                    val = fx.to.val;
                }
                else if (tweenEffect) {
                    const valNum = (((toNum - fromNum) * stepValue) + fromNum);
                    const unit = fx.to.effectUnit;
                    val = valNum + unit;
                }
                if (val !== null) {
                    const prop = fx.effectName;
                    if (fx.trans) {
                        finalTransform += prop + '(' + val + ') ';
                    }
                    else {
                        for (j = 0; j < elements.length; j++) {
                            elements[j].style.setProperty(prop, val);
                        }
                    }
                }
            }
        }
        if (finalTransform.length > 0) {
            if (!this._isReverse && stepValue !== 1 || this._isReverse && stepValue !== 0) {
                finalTransform += 'translateZ(0px)';
            }
            for (i = 0; i < elements.length; i++) {
                elements[i].style.setProperty('transform', finalTransform);
            }
        }
    }
    _setTrans(dur, forcedLinearEasing) {
        const elements = this._elements;
        if (!elements || elements.length === 0 || !this._fxProperties) {
            return;
        }
        const easing = (forcedLinearEasing ? 'linear' : this.getEasing());
        const durString = dur + 'ms';
        for (const { style } of elements) {
            if (dur > 0) {
                style.transitionDuration = durString;
                if (easing !== null) {
                    style.transitionTimingFunction = easing;
                }
            }
            else {
                style.transitionDuration = '0';
            }
        }
    }
    _beforeAnimation() {
        this._fireBeforeReadFunc();
        this._fireBeforeWriteFunc();
        this._setBeforeStyles();
    }
    _setBeforeStyles() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._setBeforeStyles();
            }
        }
        const elements = this._elements;
        if (!elements || elements.length === 0 || this._isReverse) {
            return;
        }
        const addClasses = this._beforeAddClasses;
        const removeClasses = this._beforeRemoveClasses;
        for (const el of elements) {
            const elementClassList = el.classList;
            if (addClasses) {
                for (const c of addClasses) {
                    elementClassList.add(c);
                }
            }
            if (removeClasses) {
                for (const c of removeClasses) {
                    elementClassList.remove(c);
                }
            }
            if (this._beforeStyles) {
                for (const [key, value] of Object.entries(this._beforeStyles)) {
                    el.style.setProperty(key, value);
                }
            }
        }
    }
    _fireBeforeReadFunc() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._fireBeforeReadFunc();
            }
        }
        const readFunctions = this._readCallbacks;
        if (readFunctions) {
            for (const callback of readFunctions) {
                callback();
            }
        }
    }
    _fireBeforeWriteFunc() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._fireBeforeWriteFunc();
            }
        }
        const writeFunctions = this._writeCallbacks;
        if (writeFunctions) {
            for (const callback of writeFunctions) {
                callback();
            }
        }
    }
    _setAfterStyles() {
        const elements = this._elements;
        if (!elements) {
            return;
        }
        for (const el of elements) {
            const elementClassList = el.classList;
            el.style.transitionDuration = el.style.transitionTimingFunction = '';
            if (this._isReverse) {
                const beforeAddClasses = this._beforeAddClasses;
                if (beforeAddClasses) {
                    for (const c of beforeAddClasses) {
                        elementClassList.remove(c);
                    }
                }
                const beforeRemoveClasses = this._beforeRemoveClasses;
                if (beforeRemoveClasses) {
                    for (const c of beforeRemoveClasses) {
                        elementClassList.add(c);
                    }
                }
                const beforeStyles = this._beforeStyles;
                if (beforeStyles) {
                    for (const propName of Object.keys(beforeStyles)) {
                        el.style.removeProperty(propName);
                    }
                }
            }
            else {
                const afterAddClasses = this._afterAddClasses;
                if (afterAddClasses) {
                    for (const c of afterAddClasses) {
                        elementClassList.add(c);
                    }
                }
                const afterRemoveClasses = this._afterRemoveClasses;
                if (afterRemoveClasses) {
                    for (const c of afterRemoveClasses) {
                        elementClassList.remove(c);
                    }
                }
                const afterStyles = this._afterStyles;
                if (afterStyles) {
                    for (const [key, value] of Object.entries(afterStyles)) {
                        el.style.setProperty(key, value);
                    }
                }
            }
        }
    }
    _willChange(addWillChange) {
        let wc;
        const effects = this._fxProperties;
        let willChange;
        if (addWillChange && effects) {
            wc = [];
            for (const effect of effects) {
                const propWC = effect.wc;
                if (propWC === 'webkitTransform') {
                    wc.push('transform', '-webkit-transform');
                }
                else if (propWC !== undefined) {
                    wc.push(propWC);
                }
            }
            willChange = wc.join(',');
        }
        else {
            willChange = '';
        }
        const elements = this._elements;
        if (elements) {
            for (const el of elements) {
                el.style.setProperty('will-change', willChange);
            }
        }
    }
    progressStart() {
        this._clearAsync();
        this._beforeAnimation();
        this._progressStart();
    }
    _progressStart() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._progressStart();
            }
        }
        this._setTrans(0, true);
        this._willChange(true);
    }
    progressStep(stepValue) {
        stepValue = Math.min(1, Math.max(0, stepValue));
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.progressStep(stepValue);
            }
        }
        this._progress(stepValue);
    }
    progressEnd(shouldComplete, currentStepValue, dur = -1) {
        if (this._isReverse) {
            currentStepValue = 1 - currentStepValue;
        }
        const stepValue = shouldComplete ? 1 : 0;
        const diff = Math.abs(currentStepValue - stepValue);
        if (dur < 0) {
            dur = this._duration || 0;
        }
        else if (diff < 0.05) {
            dur = 0;
        }
        this._isAsync = (dur > 30);
        this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);
        if (this._isAsync) {
            this._asyncEnd(dur, shouldComplete);
            if (!this._destroyed) {
                raf(() => {
                    this._playToStep(stepValue);
                });
            }
        }
    }
    _progressEnd(shouldComplete, stepValue, dur, isAsync) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._progressEnd(shouldComplete, stepValue, dur, isAsync);
            }
        }
        if (!isAsync) {
            this._progress(stepValue);
            this._willChange(false);
            this._setAfterStyles();
            this._didFinish(shouldComplete);
        }
        else {
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = true;
            this._willChange(true);
            this._setTrans(dur, false);
        }
    }
    onFinish(callback, opts) {
        if (opts && opts.clearExistingCallbacks) {
            this._onFinishCallbacks = this._onFinishOneTimeCallbacks = undefined;
        }
        if (opts && opts.oneTimeCallback) {
            this._onFinishOneTimeCallbacks = this._onFinishOneTimeCallbacks || [];
            this._onFinishOneTimeCallbacks.push(callback);
        }
        else {
            this._onFinishCallbacks = this._onFinishCallbacks || [];
            this._onFinishCallbacks.push(callback);
        }
        return this;
    }
    _didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
            }
        }
        if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
            this._didFinish(hasCompleted);
        }
    }
    _didFinish(hasCompleted) {
        this.isPlaying = false;
        this.hasCompleted = hasCompleted;
        if (this._onFinishCallbacks) {
            for (const callback of this._onFinishCallbacks) {
                callback(this);
            }
        }
        if (this._onFinishOneTimeCallbacks) {
            for (const callback of this._onFinishOneTimeCallbacks) {
                callback(this);
            }
            this._onFinishOneTimeCallbacks.length = 0;
        }
    }
    reverse(shouldReverse = true) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.reverse(shouldReverse);
            }
        }
        this._isReverse = !!shouldReverse;
        return this;
    }
    destroy() {
        this._didFinish(false);
        this._destroyed = true;
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.destroy();
            }
        }
        this._clearAsync();
        if (this._elements) {
            this._elements.length = 0;
        }
        if (this._readCallbacks) {
            this._readCallbacks.length = 0;
        }
        if (this._writeCallbacks) {
            this._writeCallbacks.length = 0;
        }
        this.parent = undefined;
        if (this._childAnimations) {
            this._childAnimations.length = 0;
        }
        if (this._onFinishCallbacks) {
            this._onFinishCallbacks.length = 0;
        }
        if (this._onFinishOneTimeCallbacks) {
            this._onFinishOneTimeCallbacks.length = 0;
        }
    }
    _transEl() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                const targetEl = child._transEl();
                if (targetEl) {
                    return targetEl;
                }
            }
        }
        return (this._hasTweenEffect &&
            this._hasDur &&
            this._elements !== undefined &&
            this._elements.length > 0 ?
            this._elements[0] : null);
    }
}
Animator.animated = true;

class AnimationControllerImpl {
    create(animationBuilder, baseEl, opts) {
        Animator.animated = this.config.getBoolean("animated", true);
        if (animationBuilder) {
            return animationBuilder(Animator, baseEl, opts);
        }
        return Promise.resolve(new Animator());
    }
    static get is() { return "ion-animation-controller"; }
    static get properties() {
        return {
            "config": {
                "context": "config"
            },
            "create": {
                "method": true
            }
        };
    }
}

class GestureController {
    constructor(doc) {
        this.doc = doc;
        this.gestureId = 0;
        this.requestedStart = new Map();
        this.disabledGestures = new Map();
        this.disabledScroll = new Set();
    }
    createGesture(config) {
        return new GestureDelegate(this, this.newID(), config.name, config.priority || 0, !!config.disableScroll);
    }
    createBlocker(opts = {}) {
        return new BlockerDelegate(this, this.newID(), opts.disable, !!opts.disableScroll);
    }
    start(gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            this.requestedStart.delete(id);
            return false;
        }
        this.requestedStart.set(id, priority);
        return true;
    }
    capture(gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        const requestedStart = this.requestedStart;
        let maxPriority = -10000;
        requestedStart.forEach(value => {
            maxPriority = Math.max(maxPriority, value);
        });
        if (maxPriority === priority) {
            this.capturedId = id;
            requestedStart.clear();
            const event = new CustomEvent('ionGestureCaptured', { detail: gestureName });
            this.doc.body.dispatchEvent(event);
            return true;
        }
        requestedStart.delete(id);
        return false;
    }
    release(id) {
        this.requestedStart.delete(id);
        if (this.capturedId === id) {
            this.capturedId = undefined;
        }
    }
    disableGesture(gestureName, id) {
        let set = this.disabledGestures.get(gestureName);
        if (set === undefined) {
            set = new Set();
            this.disabledGestures.set(gestureName, set);
        }
        set.add(id);
    }
    enableGesture(gestureName, id) {
        const set = this.disabledGestures.get(gestureName);
        if (set !== undefined) {
            set.delete(id);
        }
    }
    disableScroll(id) {
        this.disabledScroll.add(id);
        if (this.disabledScroll.size === 1) {
            this.doc.body.classList.add(BACKDROP_NO_SCROLL);
        }
    }
    enableScroll(id) {
        this.disabledScroll.delete(id);
        if (this.disabledScroll.size === 0) {
            this.doc.body.classList.remove(BACKDROP_NO_SCROLL);
        }
    }
    canStart(gestureName) {
        if (this.capturedId !== undefined) {
            return false;
        }
        if (this.isDisabled(gestureName)) {
            return false;
        }
        return true;
    }
    isCaptured() {
        return this.capturedId !== undefined;
    }
    isScrollDisabled() {
        return this.disabledScroll.size > 0;
    }
    isDisabled(gestureName) {
        const disabled = this.disabledGestures.get(gestureName);
        if (disabled && disabled.size > 0) {
            return true;
        }
        return false;
    }
    newID() {
        this.gestureId++;
        return this.gestureId;
    }
}
class GestureDelegate {
    constructor(ctrl, id, name, priority, disableScroll) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.disableScroll = disableScroll;
        this.ctrl = ctrl;
    }
    canStart() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.canStart(this.name);
    }
    start() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.start(this.name, this.id, this.priority);
    }
    capture() {
        if (!this.ctrl) {
            return false;
        }
        const captured = this.ctrl.capture(this.name, this.id, this.priority);
        if (captured && this.disableScroll) {
            this.ctrl.disableScroll(this.id);
        }
        return captured;
    }
    release() {
        if (this.ctrl) {
            this.ctrl.release(this.id);
            if (this.disableScroll) {
                this.ctrl.enableScroll(this.id);
            }
        }
    }
    destroy() {
        this.release();
        this.ctrl = undefined;
    }
}
class BlockerDelegate {
    constructor(ctrl, id, disable, disableScroll) {
        this.id = id;
        this.disable = disable;
        this.disableScroll = disableScroll;
        this.ctrl = ctrl;
    }
    block() {
        if (!this.ctrl) {
            return;
        }
        if (this.disable) {
            for (const gesture of this.disable) {
                this.ctrl.disableGesture(gesture, this.id);
            }
        }
        if (this.disableScroll) {
            this.ctrl.disableScroll(this.id);
        }
    }
    unblock() {
        if (!this.ctrl) {
            return;
        }
        if (this.disable) {
            for (const gesture of this.disable) {
                this.ctrl.enableGesture(gesture, this.id);
            }
        }
        if (this.disableScroll) {
            this.ctrl.enableScroll(this.id);
        }
    }
    destroy() {
        this.unblock();
        this.ctrl = undefined;
    }
}
const BACKDROP_NO_SCROLL = 'backdrop-no-scroll';
const GESTURE_CONTROLLER = new GestureController(document);

function now(ev) {
    return ev.timeStamp || Date.now();
}

class Backdrop {
    constructor() {
        this.lastClick = -10000;
        this.blocker = GESTURE_CONTROLLER.createBlocker({
            disableScroll: true
        });
        this.visible = true;
        this.tappable = true;
        this.stopPropagation = true;
    }
    componentDidLoad() {
        if (this.stopPropagation) {
            this.blocker.block();
        }
    }
    componentDidUnload() {
        this.blocker.destroy();
    }
    onTouchStart(ev) {
        this.lastClick = now(ev);
        this.emitTap(ev);
    }
    onMouseDown(ev) {
        if (this.lastClick < now(ev) - 2500) {
            this.emitTap(ev);
        }
    }
    emitTap(ev) {
        if (this.stopPropagation) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        if (this.tappable) {
            this.ionBackdropTap.emit();
        }
    }
    hostData() {
        return {
            tabindex: "-1",
            class: {
                "backdrop-hide": !this.visible,
                "backdrop-no-tappable": !this.tappable,
            }
        };
    }
    static get is() { return "ion-backdrop"; }
    static get encapsulation() { return "shadow"; }
    static get properties() {
        return {
            "doc": {
                "context": "document"
            },
            "stopPropagation": {
                "type": Boolean,
                "attr": "stop-propagation"
            },
            "tappable": {
                "type": Boolean,
                "attr": "tappable"
            },
            "visible": {
                "type": Boolean,
                "attr": "visible"
            }
        };
    }
    static get events() {
        return [{
                "name": "ionBackdropTap",
                "method": "ionBackdropTap",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }];
    }
    static get listeners() {
        return [{
                "name": "touchstart",
                "method": "onTouchStart",
                "capture": true
            }, {
                "name": "click",
                "method": "onMouseDown",
                "capture": true
            }, {
                "name": "mousedown",
                "method": "onMouseDown",
                "capture": true
            }];
    }
    static get style() { return ":host{left:0;right:0;top:0;bottom:0;display:block;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);contain:strict;cursor:pointer;opacity:.01;-ms-touch-action:none;touch-action:none;z-index:2}:host(.backdrop-hide){background:transparent}:host(.backdrop-no-tappable){cursor:auto}:host{background-color:var(--ion-backdrop-color,#000)}"; }
    static get styleMode() { return "ios"; }
}

async function attachComponent(delegate, container, component, cssClasses, componentProps) {
    if (delegate) {
        return delegate.attachViewToDom(container, component, componentProps, cssClasses);
    }
    if (typeof component !== 'string' && !(component instanceof HTMLElement)) {
        throw new Error('framework delegate is missing');
    }
    const el = (typeof component === 'string')
        ? container.ownerDocument.createElement(component)
        : component;
    if (cssClasses) {
        cssClasses.forEach(c => el.classList.add(c));
    }
    if (componentProps) {
        Object.assign(el, componentProps);
    }
    container.appendChild(el);
    if (el.componentOnReady) {
        await el.componentOnReady();
    }
    return el;
}
function detachComponent(delegate, element) {
    if (element) {
        if (delegate) {
            const container = element.parentElement;
            return delegate.removeViewFromDom(container, element);
        }
        element.remove();
    }
    return Promise.resolve();
}

let lastId = 0;
function createOverlay(element, opts) {
    const doc = element.ownerDocument;
    connectListeners(doc);
    Object.assign(element, opts);
    element.classList.add('ion-page-invisible');
    const overlayIndex = lastId++;
    element.overlayIndex = overlayIndex;
    if (!element.hasAttribute('id')) {
        element.id = `ion-overlay-${overlayIndex}`;
    }
    getAppRoot(doc).appendChild(element);
    return element.componentOnReady();
}
function connectListeners(doc) {
    if (lastId === 0) {
        lastId = 1;
        doc.addEventListener('ionBackButton', ev => {
            const lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss) {
                ev.detail.register(100, () => {
                    return lastOverlay.dismiss(undefined, BACKDROP);
                });
            }
        });
        doc.addEventListener('keyup', ev => {
            if (ev.key === 'Escape') {
                const lastOverlay = getOverlay(doc);
                if (lastOverlay && lastOverlay.backdropDismiss) {
                    lastOverlay.dismiss(undefined, BACKDROP);
                }
            }
        });
    }
}
function dismissOverlay(doc, data, role, overlayTag, id) {
    const overlay = getOverlay(doc, overlayTag, id);
    if (!overlay) {
        return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data, role);
}
function getOverlays(doc, overlayTag) {
    const overlays = Array.from(getAppRoot(doc).children).filter(c => c.overlayIndex > 0);
    if (overlayTag === undefined) {
        return overlays;
    }
    overlayTag = overlayTag.toUpperCase();
    return overlays.filter(c => c.tagName === overlayTag);
}
function getOverlay(doc, overlayTag, id) {
    const overlays = getOverlays(doc, overlayTag);
    return (id === undefined)
        ? overlays[overlays.length - 1]
        : overlays.find(o => o.id === id);
}
async function present(overlay, name, iosEnterAnimation, mdEnterAnimation, opts) {
    if (overlay.presented) {
        return;
    }
    overlay.presented = true;
    overlay.willPresent.emit();
    const animationBuilder = (overlay.enterAnimation)
        ? overlay.enterAnimation
        : overlay.config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
    const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    if (completed) {
        overlay.didPresent.emit();
    }
}
async function dismiss(overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) {
    if (!overlay.presented) {
        return false;
    }
    overlay.presented = false;
    try {
        overlay.willDismiss.emit({ data, role });
        const animationBuilder = (overlay.leaveAnimation)
            ? overlay.leaveAnimation
            : overlay.config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
        overlay.didDismiss.emit({ data, role });
    }
    catch (err) {
        console.error(err);
    }
    overlay.el.remove();
    return true;
}
function getAppRoot(doc) {
    return doc.querySelector('ion-app') || doc.body;
}
async function overlayAnimation(overlay, animationBuilder, baseEl, opts) {
    if (overlay.animation) {
        overlay.animation.destroy();
        overlay.animation = undefined;
        return false;
    }
    else {
        baseEl.classList.remove('ion-page-invisible');
        const aniRoot = baseEl.shadowRoot || overlay.el;
        const animation = overlay.animation = await overlay.animationCtrl.create(animationBuilder, aniRoot, opts);
        overlay.animation = animation;
        if (!overlay.animated) {
            animation.duration(0);
        }
        if (overlay.keyboardClose) {
            animation.beforeAddWrite(() => {
                const activeElement = baseEl.ownerDocument.activeElement;
                if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
                    activeElement.blur();
                }
            });
        }
        await animation.playAsync();
        const hasCompleted = animation.hasCompleted;
        animation.destroy();
        overlay.animation = undefined;
        return hasCompleted;
    }
}
function eventMethod(element, eventName) {
    let resolve;
    const promise = new Promise(r => resolve = r);
    onceEvent(element, eventName, (event) => {
        resolve(event.detail);
    });
    return promise;
}
function onceEvent(element, eventName, callback) {
    const handler = (ev) => {
        element.removeEventListener(eventName, handler);
        callback(ev);
    };
    element.addEventListener(eventName, handler);
}
const BACKDROP = 'backdrop';

function createThemedClasses(mode, name) {
    return {
        [name]: true,
        [`${name}-${mode}`]: !!mode
    };
}
function getClassList(classes) {
    if (classes !== undefined) {
        const array = Array.isArray(classes) ? classes : classes.split(' ');
        return array
            .filter(c => c != null)
            .map(c => c.trim())
            .filter(c => c !== '');
    }
    return [];
}
function getClassMap(classes) {
    const map = {};
    getClassList(classes).forEach(c => map[c] = true);
    return map;
}

async function deepReady(el) {
    const element = el;
    if (element) {
        if (element.componentOnReady != null) {
            const stencilEl = await element.componentOnReady();
            if (stencilEl != null) {
                return;
            }
        }
        await Promise.all(Array.from(element.children).map(deepReady));
    }
}

function iosEnterAnimation(AnimationC, baseEl) {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateY', '100%', '0%');
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

function iosLeaveAnimation(AnimationC, baseEl) {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    const wrapperElRect = wrapperEl.getBoundingClientRect();
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateY', '0%', `${window.innerHeight - wrapperElRect.top}px`);
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-out')
        .duration(250)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

function mdEnterAnimation(AnimationC, baseEl) {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation
        .fromTo('opacity', 0.01, 1)
        .fromTo('translateY', '40px', '0px');
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(280)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

function mdLeaveAnimation(AnimationC, baseEl) {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    wrapperAnimation
        .fromTo('opacity', 0.99, 0)
        .fromTo('translateY', '0px', '40px');
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.47,0,0.745,0.715)')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Modal {
    constructor() {
        this.presented = false;
        this.keyboardClose = true;
        this.backdropDismiss = true;
        this.showBackdrop = true;
        this.animated = true;
    }
    componentDidLoad() {
        this.ionModalDidLoad.emit();
    }
    componentDidUnload() {
        this.ionModalDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    onBackdropTap() {
        this.dismiss(undefined, BACKDROP);
    }
    lifecycle(modalEvent) {
        const el = this.usersElement;
        const name = LIFECYCLE_MAP[modalEvent.type];
        if (el && name) {
            const ev = new CustomEvent(name, {
                bubbles: false,
                cancelable: false,
                detail: modalEvent.detail
            });
            el.dispatchEvent(ev);
        }
    }
    async present() {
        if (this.presented) {
            return;
        }
        const container = this.el.querySelector(`.modal-wrapper`);
        if (!container) {
            throw new Error("container is undefined");
        }
        const componentProps = Object.assign({}, this.componentProps, { modal: this.el });
        this.usersElement = await attachComponent(this.delegate, container, this.component, ["ion-page"], componentProps);
        await deepReady(this.usersElement);
        return present(this, "modalEnter", iosEnterAnimation, mdEnterAnimation);
    }
    async dismiss(data, role) {
        const dismissed = await dismiss(this, data, role, "modalLeave", iosLeaveAnimation, mdLeaveAnimation);
        if (dismissed) {
            await detachComponent(this.delegate, this.usersElement);
        }
        return dismissed;
    }
    onDidDismiss() {
        return eventMethod(this.el, "ionModalDidDismiss");
    }
    onWillDismiss() {
        return eventMethod(this.el, "ionModalWillDismiss");
    }
    hostData() {
        return {
            "no-router": true,
            class: Object.assign({}, createThemedClasses(this.mode, "modal"), getClassMap(this.cssClass)),
            style: {
                zIndex: 20000 + this.overlayIndex,
            }
        };
    }
    render() {
        const dialogClasses = createThemedClasses(this.mode, "modal-wrapper");
        return [
            h("ion-backdrop", { visible: this.showBackdrop, tappable: this.backdropDismiss }),
            h("div", { role: "dialog", class: dialogClasses })
        ];
    }
    static get is() { return "ion-modal"; }
    static get properties() {
        return {
            "animated": {
                "type": Boolean,
                "attr": "animated"
            },
            "animationCtrl": {
                "connect": "ion-animation-controller"
            },
            "backdropDismiss": {
                "type": Boolean,
                "attr": "backdrop-dismiss"
            },
            "component": {
                "type": String,
                "attr": "component"
            },
            "componentProps": {
                "type": "Any",
                "attr": "component-props"
            },
            "config": {
                "context": "config"
            },
            "cssClass": {
                "type": String,
                "attr": "css-class"
            },
            "delegate": {
                "type": "Any",
                "attr": "delegate"
            },
            "dismiss": {
                "method": true
            },
            "el": {
                "elementRef": true
            },
            "enterAnimation": {
                "type": "Any",
                "attr": "enter-animation"
            },
            "keyboardClose": {
                "type": Boolean,
                "attr": "keyboard-close"
            },
            "leaveAnimation": {
                "type": "Any",
                "attr": "leave-animation"
            },
            "mode": {
                "type": String,
                "attr": "mode"
            },
            "onDidDismiss": {
                "method": true
            },
            "onWillDismiss": {
                "method": true
            },
            "overlayIndex": {
                "type": Number,
                "attr": "overlay-index"
            },
            "present": {
                "method": true
            },
            "showBackdrop": {
                "type": Boolean,
                "attr": "show-backdrop"
            }
        };
    }
    static get events() {
        return [{
                "name": "ionModalDidLoad",
                "method": "ionModalDidLoad",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }, {
                "name": "ionModalDidUnload",
                "method": "ionModalDidUnload",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }, {
                "name": "ionModalDidPresent",
                "method": "didPresent",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }, {
                "name": "ionModalWillPresent",
                "method": "willPresent",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }, {
                "name": "ionModalWillDismiss",
                "method": "willDismiss",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }, {
                "name": "ionModalDidDismiss",
                "method": "didDismiss",
                "bubbles": true,
                "cancelable": true,
                "composed": true
            }];
    }
    static get listeners() {
        return [{
                "name": "ionDismiss",
                "method": "onDismiss"
            }, {
                "name": "ionBackdropTap",
                "method": "onBackdropTap"
            }, {
                "name": "ionModalDidPresent",
                "method": "lifecycle"
            }, {
                "name": "ionModalWillPresent",
                "method": "lifecycle"
            }, {
                "name": "ionModalWillDismiss",
                "method": "lifecycle"
            }, {
                "name": "ionModalDidDismiss",
                "method": "lifecycle"
            }];
    }
    static get style() { return "ion-modal{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:strict}ion-modal-controller{display:none}\@media not all and (min-width:768px) and (min-height:600px){ion-modal ion-backdrop{display:none}}.modal-wrapper{width:100%;height:100%;contain:strict;z-index:10}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper{width:600px;height:500px}}\@media only screen and (min-width:768px) and (min-height:768px){.modal-wrapper{width:600px;height:600px}}.modal-wrapper-ios{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}\@media only screen and (min-width:768px) and (min-height:600px){.modal-wrapper-ios{border-radius:10px;overflow:hidden}}"; }
    static get styleMode() { return "ios"; }
}
const LIFECYCLE_MAP = {
    "ionModalDidPresent": "ionViewDidEnter",
    "ionModalWillPresent": "ionViewWillEnter",
    "ionModalWillDismiss": "ionViewWillLeave",
    "ionModalDidDismiss": "ionViewDidLeave",
};

class ModalController {
    create(opts) {
        return createOverlay(this.doc.createElement("ion-modal"), opts);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, "ion-modal", id);
    }
    async getTop() {
        return getOverlay(this.doc, "ion-modal");
    }
    static get is() { return "ion-modal-controller"; }
    static get properties() {
        return {
            "create": {
                "method": true
            },
            "dismiss": {
                "method": true
            },
            "doc": {
                "context": "document"
            },
            "getTop": {
                "method": true
            }
        };
    }
}

export { AnimationControllerImpl as IonAnimationController, Backdrop as IonBackdrop, Modal as IonModal, ModalController as IonModalController };
