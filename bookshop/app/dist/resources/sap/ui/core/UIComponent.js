/*
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../base/ManagedObject","./Component","sap/ui/core/mvc/ViewType","sap/ui/core/mvc/XMLProcessingMode","./UIComponentMetadata","./mvc/Controller","./mvc/View","sap/base/util/ObjectPath","sap/base/Log","sap/ui/core/Core"],function(t,e,o,n,i,r,s,a,u){"use strict";var p=e.extend("sap.ui.core.UIComponent",{constructor:function(t,o){var n=false;try{if(typeof t!=="string"){o=t;t=undefined}if(o&&o.hasOwnProperty("_routerHashChanger")){this._oRouterHashChanger=o._routerHashChanger;delete o._routerHashChanger}if(o&&o.hasOwnProperty("_propagateTitle")){this._bRoutingPropagateTitle=o._propagateTitle;delete o._propagateTitle}e.apply(this,arguments);n=true}finally{if(!n){this._destroyCreatedInstances()}}},metadata:{abstract:true,rootView:null,publicMethods:["render"],aggregations:{rootControl:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},designtime:"sap/ui/core/designtime/UIComponent.designtime",routing:{}}},i);p._fnOnInstanceInitialized=null;p._fnOnInstanceDestroy=null;p.prototype.init=function(){var e=this;var o={};var n;if(this.getAutoPrefixId()){o.id=function(t){return e.createId(t)}}function i(t){var o=function(){if(typeof p._fnOnInstanceInitialized==="function"){p._fnOnInstanceInitialized(e)}};var n=function(t){e.setAggregation("rootControl",t)};if(t instanceof Promise){e.pRootControlLoaded=e.pRootControlLoaded.then(function(t){n(t);o();return t})}else if(t instanceof s&&t.oAsyncState&&t.oAsyncState.promise){n(t);e.pRootControlLoaded=e.pRootControlLoaded.then(function(t){o();return t})}else{n(t);o()}}function r(t,o){var n;if(t instanceof Promise){n=e.pRootControlLoaded.then(function(t){return t instanceof s?t.getId():undefined})}else if(t instanceof s){n=t.getId()}if(n){if(o.targetParent===undefined){o.targetParent=n}if(e._oTargets){e._oTargets._setRootViewId(n)}}}var a=this._getManifestEntry("/sap.ui5/routing",true)||{},u=a.config||{},c=a.routes;if(this.isA("sap.ui.core.IAsyncContentCreation")){u.async=true}if(c){var g;var d=this._getRouterClassName();if(d){g=f(d)}else{g=sap.ui.require("sap/ui/core/routing/Router")||sap.ui.requireSync("sap/ui/core/routing/Router")}this._oRouter=new g(c,u,this,a.targets,this._oRouterHashChanger);this._oTargets=this._oRouter.getTargets();this._oViews=this._oRouter.getViews()}else if(a.targets){var l=sap.ui.require("sap/ui/core/routing/Views")||sap.ui.requireSync("sap/ui/core/routing/Views");this._oViews=new l({component:this});var h;if(u.targetsClass){h=f(u.targetsClass)}else{h=sap.ui.require("sap/ui/core/routing/Targets")||sap.ui.requireSync("sap/ui/core/routing/Targets")}this._oTargets=new h({targets:a.targets,config:u,views:this._oViews})}this.runAsOwner(function(){t.runWithPreprocessors(function(){n=e.createContent()},o)});if(n instanceof Promise){if(this.isA("sap.ui.core.IAsyncContentCreation")){this.pRootControlLoaded=n}else{throw new Error("Interface 'sap.ui.core.IAsyncContentCreation' must be implemented for component '"+this.getMetadata().getComponentName()+"' when 'createContent' is implemented asynchronously")}}else if(n instanceof s&&n.oAsyncState&&n.oAsyncState.promise){this.pRootControlLoaded=n.loaded()}else{this.pRootControlLoaded=Promise.resolve(n)}r(n,u);i(n)};function f(t){var e;if(typeof t==="string"){e=a.get(t);if(!e){u.error("The specified class for router or targets '"+t+"' is undefined.",this)}}else{e=t}return e}p.prototype.rootControlLoaded=function(){if(!this.pRootControlLoaded){u.error("Mandatory init() not called for UIComponent: '"+this.getManifestObject().getComponentName()+"'. This is likely caused by a missing super call in the component's init implementation.",null,"sap.ui.support",function(){return{type:"missingInitInUIComponent"}})}return this.pRootControlLoaded||Promise.resolve(this.getRootControl())};p.prototype.destroy=function(){if(typeof p._fnOnInstanceDestroy==="function"){p._fnOnInstanceDestroy(this)}this._destroyCreatedInstances();return e.prototype.destroy.apply(this,arguments)};p.prototype._destroyCreatedInstances=function(){if(this._oRouter){this._oRouter.destroy();delete this._oRouter}else{if(this._oTargets){this._oTargets.destroy();this._oTargets=null}if(this._oViews){this._oViews.destroy();this._oViews=null}}};p.getRouterFor=function(t){var o=t;if(o instanceof r){o=o.getView()}if(o instanceof s){var n=e.getOwnerComponentFor(o);if(n){return n.getRouter()}else{return undefined}}};p.prototype.getRouter=function(){return this._oRouter};p.prototype.hasNativeRouter=function(){return this._oRouter===this.getRouter()};p.prototype.getTargets=function(){return this._oTargets};p.prototype.getAutoPrefixId=function(){return!!this.getManifestObject().getEntry("/sap.ui5/autoPrefixId")};p.prototype.byId=function(t){return sap.ui.getCore().byId(this.createId(t))};p.prototype.createId=function(t){if(!this.isPrefixedId(t)){t=this.getId()+"---"+t}return t};p.prototype.getLocalId=function(t){var e=this.getId()+"---";return t&&t.indexOf(e)===0?t.slice(e.length):null};p.prototype.isPrefixedId=function(t){return!!(t&&t.indexOf(this.getId()+"---")===0)};p.prototype.createContent=function(){var t=this._getManifestEntry("/sap.ui5/rootView",true);if(t&&typeof t==="string"){return s._create({viewName:t,type:o.XML})}else if(t&&typeof t==="object"){if(!t.type&&!s._getModuleName(t)){t.type=o.XML}if(t.id){t.id=this.createId(t.id)}if(t.async&&t.type===o.XML){t.processingMode=n.Sequential}if(this.isA("sap.ui.core.IAsyncContentCreation")){return s.create(t)}return s._create(t)}else if(t){throw new Error("Configuration option 'rootView' of component '"+this.getMetadata().getName()+"' is invalid! 'rootView' must be type of string or object!")}return null};p.prototype.getRootControl=function(){return this.getAggregation("rootControl")};p.prototype.render=function(t){var e=this.getRootControl();if(e&&t){t.renderControl(e)}};p.prototype.getUIArea=function(){return this.oContainer?this.oContainer.getUIArea():null};p.prototype.getEventingParent=function(){return this.getUIArea()};p.prototype.setContainer=function(e){this.oContainer=e;if(e){this._applyContextualSettings(e._getContextualSettings())}else{this._oContextualSettings=t._defaultContextualSettings;if(!this._bIsBeingDestroyed){setTimeout(function(){if(!this.oContainer){this._propagateContextualSettings()}}.bind(this),0)}}return this};p.prototype.onBeforeRendering=function(){};p.prototype.onAfterRendering=function(){};p.prototype._getRouterClassName=function(){var t=this._getManifestEntry("/sap.ui5/routing",true)||{},e=t.config||{};return e.routerClass};return p});