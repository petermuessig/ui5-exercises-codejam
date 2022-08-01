/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={};var t="";var r;var a={_oCache:new Map,_iCacheLimit:10,get:function(e){var t=this._oCache.get(e);if(t){return t}var r={hourCycle:"h23",hour:"2-digit",minute:"2-digit",second:"2-digit",fractionalSecondDigits:3,day:"2-digit",month:"2-digit",year:"numeric",timeZone:e,timeZoneName:"short",era:"narrow"};var a=new Intl.DateTimeFormat("en-US",r);if(this._oCache.size===this._iCacheLimit){this._oCache=new Map}this._oCache.set(e,a);return a}};e.isValidTimezone=function(e){if(!e){return false}if(Intl.supportedValuesOf){try{r=r||Intl.supportedValuesOf("timeZone");if(r.includes(e)){return true}}catch(e){r=[]}}try{a.get(e);return true}catch(e){return false}};e.convertToTimezone=function(t,r){var a=this._getParts(t,r);return e._getDateFromParts(a)};e._getParts=function(e,t){var r=a.get(t);var n=r.formatToParts(new Date(e.getTime()));var i=Object.create(null);for(var o in n){var s=n[o];if(s.type!=="literal"){i[s.type]=s.value}}return i};e._getDateFromParts=function(e){var t=new Date(0);var r=parseInt(e.year);if(e.era==="B"){r=r*-1+1}t.setUTCFullYear(r,parseInt(e.month)-1,parseInt(e.day));t.setUTCHours(parseInt(e.hour),parseInt(e.minute),parseInt(e.second),parseInt(e.fractionalSecond||0));return t};e.calculateOffset=function(e,t){var r=this.convertToTimezone(e,t);var a=e.getTime()-r.getTime();var n=new Date(e.getTime()+a);var i=this.convertToTimezone(n,t);return(n.getTime()-i.getTime())/1e3};e.getLocalTimezone=function(){if(t){return t}t=(new Intl.DateTimeFormat).resolvedOptions().timeZone;return t};return e});