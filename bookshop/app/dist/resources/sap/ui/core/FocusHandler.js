/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../base/Object","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/_ready","sap/ui/dom/jquery/control"],function(t,o,e,n){"use strict";var r;var s;var u=t.extend("sap.ui.core.FocusHandler",{constructor:function(){t.apply(this);this.oCurrent=null;this.oLast=null;this.aEventQueue=[];this.oLastFocusedControlInfo=null;this.oPatchingControlFocusInfo=null;this.fnEventHandler=this.onEvent.bind(this);n().then(function(){var t=document.body;t.addEventListener("focus",this.fnEventHandler,true);t.addEventListener("blur",this.fnEventHandler,true);o.debug("FocusHandler setup on Root "+t.type+(t.id?": "+t.id:""),null,"sap.ui.core.FocusHandler")}.bind(this))}});u.prototype.getCurrentFocusedControlId=function(){var t=null;try{var o=e(document.activeElement);if(o.is(":focus")){t=o.control()}}catch(t){}return t&&t.length>0?t[0].getId():null};u.prototype.getControlFocusInfo=function(t){var o;t=t||this.getCurrentFocusedControlId();if(!t){return null}o=l(t);if(o){return{id:t,control:o,info:o.getFocusInfo(),type:o.getMetadata().getName(),focusref:o.getFocusDomRef()}}return null};u.prototype.storePatchingControlFocusInfo=function(t){var o=document.activeElement;if(!o||!t.contains(o)){this.oPatchingControlFocusInfo=null}else{this.oPatchingControlFocusInfo=this.getControlFocusInfo();if(this.oPatchingControlFocusInfo){this.oPatchingControlFocusInfo.patching=true}}};u.prototype.getPatchingControlFocusInfo=function(){return this.oPatchingControlFocusInfo};u.prototype.updateControlFocusInfo=function(t){if(t&&this.oLastFocusedControlInfo&&this.oLastFocusedControlInfo.control===t){var e=t.getId();this.oLastFocusedControlInfo=this.getControlFocusInfo(e);o.debug("Update focus info of control "+e,null,"sap.ui.core.FocusHandler")}};u.prototype.restoreFocus=function(t){var e=t||this.oLastFocusedControlInfo;if(!e){return}var n=l(e.id);var r=e.focusref;if(n&&e.info&&n.getMetadata().getName()==e.type&&(e.patching||n.getFocusDomRef()!=r&&(t||n!==e.control))){o.debug("Apply focus info of control "+e.id,null,"sap.ui.core.FocusHandler");e.control=n;this.oLastFocusedControlInfo=e;delete this.oLastFocusedControlInfo.patching;n.applyFocusInfo(e.info)}else{o.debug("Apply focus info of control "+e.id+" not possible",null,"sap.ui.core.FocusHandler")}};u.prototype.destroy=function(t){var o=t.data.oRootRef;if(o){o.removeEventListener("focus",this.fnEventHandler,true);o.removeEventListener("blur",this.fnEventHandler,true)}};u.prototype.onEvent=function(t){var n=e.event.fix(t);o.debug("Event "+n.type+" reached Focus Handler (target: "+n.target+(n.target?n.target.id:"")+")",null,"sap.ui.core.FocusHandler");var r=n.type=="focus"||n.type=="focusin"?"focus":"blur";this.aEventQueue.push({type:r,controlId:i(n.target)});if(this.aEventQueue.length==1){this.processEvent()}};u.prototype.processEvent=function(){var t=this.aEventQueue[0];if(!t){return}try{if(t.type=="focus"){this.onfocusEvent(t.controlId)}else if(t.type=="blur"){this.onblurEvent(t.controlId)}}finally{this.aEventQueue.shift();if(this.aEventQueue.length>0){this.processEvent()}}};u.prototype.onfocusEvent=function(t){var e=l(t);if(e){this.oLastFocusedControlInfo=this.getControlFocusInfo(t);o.debug("Store focus info of control "+t,null,"sap.ui.core.FocusHandler")}this.oCurrent=t;if(!this.oLast){return}if(this.oLast!=this.oCurrent){a(this.oLast,t)}this.oLast=null};u.prototype.onblurEvent=function(t){if(!this.oCurrent){return}this.oLast=t;this.oCurrent=null;setTimeout(this["checkForLostFocus"].bind(this),0)};u.prototype.checkForLostFocus=function(){if(this.oCurrent==null&&this.oLast!=null){a(this.oLast,null)}this.oLast=null};var i=function(t){var o=e(t).closest("[data-sap-ui]").attr("id");if(o){return o}return null};var a=function(t,o){var n=l(t);if(n){var r=e.Event("sapfocusleave");r.target=n.getDomRef();var u=l(o);r.relatedControlId=u?u.getId():null;r.relatedControlFocusInfo=u?u.getFocusInfo():null;s=s||sap.ui.require("sap/ui/core/Core");if(s){var i=n.getUIArea();var a=null;if(i){a=s.getUIArea(i.getId())}else{var c=s.getStaticAreaRef();if(c.contains(r.target)){a=s.getUIArea(c.id)}}if(a){a._handleEvent(r)}}}};function l(t){var o;if(!r){r=sap.ui.require("sap/ui/core/Element")}if(r){o=r.registry.get(t)}return o||null}return new u});