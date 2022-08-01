/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","./library","sap/ui/core/Core","sap/ui/thirdparty/jquery"],function(e,t,r,a){"use strict";var s="sap-ui-illustration-pool",o="-Patterns",i="sapIllus",n=sap.ui.require.toUrl("sap/m/themes/base/illustrations/"),l=Object.keys(t.IllustratedMessageType);var u=Object.create(null);u[i]={sPath:n,aSymbols:l,bIsPending:false};var d=[],f=Object.create(null),c=Object.create(null),b=Object.create(null);var m={};m.loadAsset=function(t,r){var a;if(t===""){e.error("ID of the asset can not be blank/empty.");return}if(r){b[r]=t}if(f[t]){e.info("The asset with ID '"+t+"' is either loaded or being loaded.");if(r&&c[t]){m._updateDOMPool()}return}a=t.split("-")[0];if(!u[a]){e.error("The illustration set '"+a+"' is not registered. Please register it before requiring one of its assets.");return}f[t]=true;m._requireSVG(a,t,r)};m.loadRestOfTheAssets=function(e){var t;if(!u[e]){throw new Error("The illustration set '"+e+"' is not registered. Please register it before requiring rest of its assets.")}t=u[e].aSymbols;if(Array.isArray(t)){t.forEach(function(t){m.loadAsset(e+"-Spot-"+t);m.loadAsset(e+"-Dialog-"+t);m.loadAsset(e+"-Scene-"+t)})}};m.registerIllustrationSet=function(t,r){var a=t.setFamily,s=t.setURI;if(u[a]){if(u[a].bIsPending){e.warning("Illustration Set is currently being loaded.")}else{e.warning("Illustration Set already registered.")}return}if(s.substr(s.length-1)!=="/"){s+="/"}u[a]=Object.create(null);u[a].sPath=s;u[a].bIsPending=true;m._loadMetadata(a,s,r)};m._addAssetToDOMPool=function(e,t){m._getDOMPool().insertAdjacentHTML("beforeend",e);if(t){d.push(t)}};m._getDOMPool=function(){var e=document.getElementById(s);if(e===null){e=document.createElement("div");e.id=s;e.ariaHidden=true;r.getStaticAreaRef().appendChild(e);m.loadAsset(i+o)}return e};m._loadMetadata=function(t,r,s){var o=r+"metadata.json";return new Promise(function(r){a.ajax(o,{type:"GET",dataType:"json",success:function(a){e.info("Metadata for illustration set ("+t+") successfully loaded");m._metadataLoaded(t,a,s);r(a)},error:function(a,s){if(s!=="abort"){e.error("Metadata from: "+o+" file path could not be loaded");delete u[t];r()}}})})};m._metadataLoaded=function(e,t,r){var a=t.symbols,s=t.requireCustomPatterns;u[e].aSymbols=a;if(s){m.loadAsset(e+o)}if(r){m.loadRestOfTheAssets(e)}u[e].bIsPending=false};m._removeAssetFromDOMPool=function(e){var t=document.getElementById(s),r;if(t!==null){r=document.getElementById(e);if(r!==null){t.removeChild(r);d.splice(d.indexOf(e),1)}}};m._requireSVG=function(t,r,s){return new Promise(function(i){a.ajax(u[t].sPath+r+".svg",{type:"GET",dataType:"html",success:function(e){if(r.indexOf(o)===-1){c[r]=e;if(s){m._updateDOMPool()}}else{m._addAssetToDOMPool(e)}i(e)},error:function(t,a){if(a!=="abort"){delete f[r];e.error(r+" asset could not be loaded");i()}}})})};m._updateDOMPool=function(){var e=Object.create(null),t=Object.create(null),r,a;for(var s in b){r=b[s];a=d.indexOf(r);if(a===-1){t[r]=true}else{e[r]=true}}for(var o=0;o<d.length;o++){r=d[o];if(!e[r]){m._removeAssetFromDOMPool(r);o--}}for(var i in t){r=c[i];if(r){m._addAssetToDOMPool(r,i)}}};return m},true);