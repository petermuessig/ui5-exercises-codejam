/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/ValueStateSupport","sap/ui/Device"],function(e,t,a){"use strict";var s=e.ValueState;var i={apiVersion:2};i.render=function(e,t){var i=t.getId(),r=t.getEnabled(),l=t.getDisplayOnly(),c=t.getEditable(),n=r&&!l,d=r&&l,p=t.getAggregation("_label"),o=t.getValueState(),g=s.Error===o,f=s.Warning===o,b=s.Success===o,u=s.Information===o,C=t.getUseEntireWidth(),M=c&&r;e.openStart("div",t);e.class("sapMCb");if(!c){e.class("sapMCbRo")}if(d){e.class("sapMCbDisplayOnly")}if(!r){e.class("sapMCbBgDis")}if(t.getText()){e.class("sapMCbHasLabel")}if(t.getWrapping()){e.class("sapMCbWrapped")}if(M){if(g){e.class("sapMCbErr")}else if(f){e.class("sapMCbWarn")}else if(b){e.class("sapMCbSucc")}else if(u){e.class("sapMCbInfo")}}if(C){e.style("width",t.getWidth())}var y=this.getTooltipText(t);if(y){e.attr("title",y)}if(n){e.attr("tabindex",t.getTabIndex())}e.accessibilityState(t,{role:"checkbox",selected:null,checked:t._getAriaChecked(),describedby:y&&M?i+"-Descr":undefined});if(d){e.attr("aria-readonly",true)}e.openEnd();e.openStart("div",t.getId()+"-CbBg");e.class("sapMCbBg");if(n&&c&&a.system.desktop){e.class("sapMCbHoverable")}if(!t.getActiveHandling()){e.class("sapMCbActiveStateOff")}e.class("sapMCbMark");if(t.getSelected()){e.class("sapMCbMarkChecked")}if(t.getPartiallySelected()){e.class("sapMCbMarkPartiallyChecked")}e.openEnd();e.voidStart("input",t.getId()+"-CB");e.attr("type","CheckBox");if(t.getSelected()){e.attr("checked","checked")}if(t.getName()){e.attr("name",t.getName())}if(!r){e.attr("disabled","disabled")}if(!c){e.attr("readonly","readonly")}e.voidEnd();e.close("div");e.renderControl(p);if(y&&sap.ui.getCore().getConfiguration().getAccessibility()&&M){e.openStart("span",i+"-Descr");e.class("sapUiHidden");e.openEnd();e.text(y);e.close("span")}e.close("div")};i.getTooltipText=function(e){var a=e.getProperty("valueStateText"),s=e.getTooltip_AsString(),i=e.getEnabled(),r=e.getEditable();if(a){return(s?s+" - ":"")+a}else if(r&&i){return t.enrichTooltip(e,s)}return s};return i},true);