/*! Built with http://stenciljs.com */
const{h:e}=window.ionicpwaelements,o=500,t="cubic-bezier(0.36,0.66,0.04,1)",n="opacity",r="transform",l="translateX",d="0%",a=.8;function c(e){return e.shadowRoot||e}function s(e,s,i){const m="rtl"===document.dir,f=m?"-99.5%":"99.5%",u=m?"33%":"-33%",b=i.enteringEl,y=i.leavingEl,S=new e;if(S.addElement(b).duration(i.duration||o).easing(i.easing||t).beforeRemoveClass("ion-page-invisible"),y&&s){const o=new e;o.addElement(s).beforeAddClass("show-decor").afterRemoveClass("show-decor"),S.add(o)}const T="back"===i.direction,w=b.querySelector(":scope > ion-content"),E=b.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *"),p=b.querySelector(":scope > ion-header > ion-toolbar"),q=new e;if(w||p||0!==E.length?(q.addElement(w),q.addElement(E)):q.addElement(b.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")),S.add(q),T?q.beforeClearStyles([n]).fromTo(l,u,d,!0).fromTo(n,a,1,!0):q.beforeClearStyles([n]).fromTo(l,f,d,!0),p){const o=new e;o.addElement(p),S.add(o);const t=new e;t.addElement(p.querySelector("ion-title"));const r=new e;r.addElement(p.querySelectorAll("ion-buttons,[menuToggle]"));const a=new e;a.addElement(c(p).querySelector(".toolbar-background"));const s=new e,i=p.querySelector("ion-back-button");if(s.addElement(i),o.add(t).add(r).add(a).add(s),t.fromTo(n,.01,1,!0),r.fromTo(n,.01,1,!0),T)t.fromTo(l,u,d,!0),s.fromTo(n,.01,1,!0);else if(t.fromTo(l,f,d,!0),a.beforeClearStyles([n]).fromTo(n,.01,1,!0),s.fromTo(n,.01,1,!0),i){const t=new e;t.addElement(c(i).querySelector(".button-text")).fromTo(l,m?"-100px":"100px","0px"),o.add(t)}}if(y){const o=new e;o.addElement(y.querySelector(":scope > ion-content")),o.addElement(y.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *")),S.add(o),T?o.beforeClearStyles([n]).fromTo(l,d,m?"-100%":"100%"):o.fromTo(l,d,u,!0).fromTo(n,1,a,!0);const t=y.querySelector(":scope > ion-header > ion-toolbar");if(t){const o=new e;o.addElement(t);const a=new e;a.addElement(t.querySelector("ion-title"));const s=new e;s.addElement(t.querySelectorAll("ion-buttons,[menuToggle]"));const i=new e;i.addElement(c(t).querySelector(".toolbar-background"));const f=new e,b=t.querySelector("ion-back-button");if(f.addElement(b),o.add(a).add(s).add(f).add(i),S.add(o),f.fromTo(n,.99,0,!0),a.fromTo(n,.99,0,!0),s.fromTo(n,.99,0,!0),T){if(a.fromTo(l,d,m?"-100%":"100%"),i.beforeClearStyles([n]).fromTo(n,1,.01,!0),b){const t=new e;t.addElement(c(b).querySelector(".button-text")),t.fromTo(l,d,(m?-124:124)+"px"),o.add(t)}}else a.fromTo(l,d,u).afterClearStyles([r]),f.afterClearStyles([n]),a.afterClearStyles([n]),s.afterClearStyles([n])}}return Promise.resolve(S)}export{c as shadow,s as iosTransitionAnimation};