/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/URI","sap/ui/Device","sap/ui/test/_LogCollector","sap/base/Log","sap/ui/thirdparty/jquery","sap/base/util/ObjectPath"],function(e,t,r,n,i,a){"use strict";var s=1280;var o=1024;var u=null,l=null,c=null,h=null,f=null,d=null,p=false,g=false,y=null,w=null,m,v;function H(){u=l[0].contentWindow;L();C()}function b(e,t){if(e){l.css("width",e);c.css("padding-left",e)}else{l.css("width",s);l.addClass("default-scale-x")}if(t){l.css("height",t)}else{l.css("height",o);l.addClass("default-scale-y")}if(!e&&!t){l.addClass("default-scale-both")}}function L(){var e=u.onerror;u.onerror=function(t,r,n,i,a){var s=false;if(e){s=e.apply(this,arguments)}setTimeout(function(){var e=i?"\ncolumn: "+i:"";var s=a&&"\niFrame error: "+(a.stack?a.message+"\n"+a.stack:a)||"";throw new Error("Error in launched application iFrame: "+t+"\nurl: "+r+"\nline: "+n+e+s)},0);return s}}function C(){if(g){return true}if(u&&u.sap&&u.sap.ui&&u.sap.ui.getCore){if(!p){u.sap.ui.getCore().attachInit(I)}p=true}return g}function F(e){u.sap.ui.require(["sap/ui/thirdparty/sinon"],function(t){if(!t){setTimeout(function(){F(e)},50)}else{e()}})}function I(){E();if(t.browser.firefox){F(q)}else{q()}}function P(){d.sap.log.addLogListener(r.getInstance()._oListener);g=true}function E(){d=u.jQuery;O("sap/ui/test");O("sap/ui/qunit");O("sap/ui/thirdparty")}function U(e,t,r){var i=new r,a=new t(i),s=e.setHash,o=e.getHash,l,c=false,h=u.history.go;e.replaceHash=function(e){c=true;var t=this.getHash();l=e;i.fireEvent("hashReplaced",{sHash:e});this.changed.dispatch(e,t)};e.setHash=function(e){c=true;var t=o.call(this);l=e;i.fireEvent("hashSet",{sHash:e});s.apply(this,arguments);if(t===this.getHash()){this.changed.dispatch(t,a.aHistory[a.iHistoryPosition])}};e.getHash=function(){if(l===undefined){return o.apply(this,arguments)}return l};e.changed.add(function(e){if(!c){i.fireEvent("hashSet",{sHash:e});l=e}c=false});i.init();function f(){c=true;var t=a.aHistory[a.iHistoryPosition],r=a.getPreviousHash();l=r;e.changed.dispatch(r,t)}function d(){c=true;var t=a.aHistory[a.iHistoryPosition+1],r=a.aHistory[a.iHistoryPosition];if(t===undefined){n.error("Could not navigate forwards, there is no history entry in the forwards direction",this);return}l=t;e.changed.dispatch(t,r)}u.history.back=f;u.history.forward=d;u.history.go=function(e){if(e===-1){f();return}else if(e===1){d();return}n.error("Using history.go with a number greater than 1 is not supported by OPA5",this);return h.apply(u.history,arguments)}}function q(){u.sap.ui.require(["sap/ui/test/OpaPlugin","sap/ui/test/autowaiter/_autoWaiter","sap/ui/test/_OpaLogger","sap/ui/qunit/QUnitUtils","sap/ui/thirdparty/hasher","sap/ui/core/routing/History","sap/ui/core/routing/HashChanger"],function(e,t,r,n,i,a,s){r.setLevel(m);h=new e;y=t;f=n;if(!v){U(i,a,s)}w=s;P()})}function O(t){var r=sap.ui.require.toUrl(t);var n=new e(r).absoluteTo(document.baseURI).search("").toString();var i=a.get("sap.ui._ui5loader.config",u)||a.get("sap.ui.loader.config",u);if(i){var s={};s[t]=n;i({paths:s})}else if(d&&d.sap&&d.sap.registerResourcePath){d.sap.registerResourcePath(t,n)}else{throw new Error("iFrameLauncher.js: UI5 module system not found.")}}function W(){if(!u){throw new Error("sap.ui.test.launchers.iFrameLauncher: Teardown was called before launch. No iFrame was loaded.")}u.onerror=i.noop;for(var e=0;e<l.length;e++){l[0].src="about:blank";l[0].contentWindow.document.write("");l[0].contentWindow.close()}if(typeof CollectGarbage=="function"){CollectGarbage()}l.remove();c.remove();d=null;h=null;f=null;u=null;g=false;p=false;y=null;w=null}return{launch:function(e){if(u){throw new Error("sap.ui.test.launchers.iFrameLauncher: Launch was called twice without teardown. Only one iFrame may be loaded at a time.")}l=i("#"+e.frameId);if(l.length){c=i(".opaFrameContainer")}else{if(!e.source){n.error("No source was given to launch the IFrame",this)}c=i("<div class='opaFrameContainer'></div>");l=i('<IFrame id="'+e.frameId+'" class="opaFrame" src="'+e.source+'"></IFrame>');c.append(l);i("body").append(c);b(e.width,e.height)}if(l[0].contentDocument&&l[0].contentDocument.readyState==="complete"){H()}else{l.on("load",H)}m=e.opaLogLevel;v=e.disableHistoryOverride;return C()},hasLaunched:function(){C();return g},teardown:function(){W()},getHashChanger:function(){if(!w){return null}return w.getInstance()},getPlugin:function(){return h},getJQuery:function(){return d},getUtils:function(){return f},getWindow:function(){return u},_getAutoWaiter:function(){return y}}},true);