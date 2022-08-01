/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/support/Plugin","sap/ui/core/util/serializer/ViewSerializer","sap/ui/core/util/File","sap/ui/thirdparty/jszip","sap/ui/base/DataType","sap/ui/core/Component","sap/ui/core/Element","sap/ui/core/ElementMetadata","sap/ui/core/UIArea","sap/ui/core/mvc/View","sap/ui/core/mvc/XMLView","sap/ui/core/tmpl/Template","sap/ui/model/Binding","sap/ui/model/CompositeBinding","sap/base/util/each","sap/base/util/isEmptyObject","sap/base/util/ObjectPath","sap/ui/thirdparty/jquery","sap/ui/events/KeyCodes","sap/ui/dom/jquery/selectText","sap/ui/dom/jquery/cursorPos","sap/ui/core/mvc/Controller"],function(t,e,o,n,r,i,a,s,p,l,d,c,u,g,h,f,v,S,b){"use strict";var m=t.extend("sap.ui.core.support.plugins.ControlTree",{constructor:function(e){t.apply(this,["sapUiSupportControlTree","Control Tree",e]);this._oStub=e;if(this.runsAsToolPlugin()){this._aEventIds=["sapUiSupportSelectorSelect",this.getId()+"ReceiveControlTree",this.getId()+"ReceiveControlTreeExport",this.getId()+"ReceiveControlTreeExportError",this.getId()+"TriggerRequestProperties",this.getId()+"ReceiveProperties",this.getId()+"ReceiveBindingInfos",this.getId()+"ReceiveMethods",this.getId()+"ReceivePropertiesMethods"];this._breakpointId="sapUiSupportBreakpoint";this._tab={properties:"Properties",bindinginfos:"BindingInfos",breakpoints:"Breakpoints",exports:"Export"};this._currentTab=this._tab.properties}else{this._aEventIds=[this.getId()+"RequestControlTree",this.getId()+"RequestControlTreeSerialize",this.getId()+"RequestProperties",this.getId()+"RequestBindingInfos",this.getId()+"ChangeProperty",this.getId()+"RefreshBinding"];var o=this;sap.ui.getCore().registerPlugin({startPlugin:function(t){o.oCore=t},stopPlugin:function(){o.oCore=undefined}})}}});m.prototype.init=function(e){t.prototype.init.apply(this,arguments);if(this.runsAsToolPlugin()){C.call(this,e)}else{y.call(this,e)}};function C(t){S(document).on("click","li img.sapUiControlTreeIcon",this._onIconClick.bind(this)).on("click","li.sapUiControlTreeElement div",this._onNodeClick.bind(this)).on("click","li.sapUiControlTreeLink div",this._onControlTreeLinkClick.bind(this)).on("click","#sapUiSupportControlTabProperties",this._onPropertiesTab.bind(this)).on("click","#sapUiSupportControlTabBindingInfos",this._onBindingInfosTab.bind(this)).on("click","#sapUiSupportControlTabBreakpoints",this._onMethodsTab.bind(this)).on("click","#sapUiSupportControlTabExport",this._onExportTab.bind(this)).on("change","[data-sap-ui-name]",this._onPropertyChange.bind(this)).on("change","[data-sap-ui-method]",this._onPropertyBreakpointChange.bind(this)).on("keyup",'.sapUiSupportControlMethods input[type="text"]',this._autoComplete.bind(this)).on("blur",'.sapUiSupportControlMethods input[type="text"]',this._updateSelectOptions.bind(this)).on("change",".sapUiSupportControlMethods select",this._selectOptionsChanged.bind(this)).on("click","#sapUiSupportControlAddBreakPoint",this._onAddBreakpointClicked.bind(this)).on("click","#sapUiSupportControlExportToXml",this._onExportToXmlClicked.bind(this)).on("click","#sapUiSupportControlExportToHtml",this._onExportToHtmlClicked.bind(this)).on("click","#sapUiSupportControlActiveBreakpoints img.remove-breakpoint",this._onRemoveBreakpointClicked.bind(this)).on("click","#sapUiSupportControlPropertiesArea a.control-tree",this._onNavToControl.bind(this)).on("click","#sapUiSupportControlPropertiesArea img.sapUiSupportRefreshBinding",this._onRefreshBinding.bind(this));this.renderContentAreas()}m.prototype.exit=function(e){t.prototype.exit.apply(this,arguments);if(this.runsAsToolPlugin()){S(document).off("click","li img.sapUiControlTreeIcon").off("click","li div").off("click","li.sapUiControlTreeLink").off("click","#sapUiSupportControlTabProperties").off("click","#sapUiSupportControlTabBindings").off("click","#sapUiSupportControlTabBreakpoints").off("click","#sapUiSupportControlTabExport").off("change","[data-sap-ui-name]").off("change","[data-sap-ui-method]").off("keyup",'.sapUiSupportControlMethods input[type="text"]').off("blur",".sapUiSupportControlMethods select").off("change",".sapUiSupportControlMethods select").off("click","#sapUiSupportControlAddBreakPoint").off("click","#sapUiSupportControlExportToXml").off("click","#sapUiSupportControlExportToHtml").off("click","#sapUiSupportControlActiveBreakpoints img.remove-breakpoint").off("click","#sapUiSupportControlPropertiesArea a.control-tree").off("click","#sapUiSupportControlPropertiesArea img.sapUiSupportRefreshBinding")}};function E(t){if(t==null){return""}t=String(t);return t.slice(1+t.lastIndexOf("."))}m.prototype.renderContentAreas=function(){var t=sap.ui.getCore().createRenderManager();t.openStart("div").class("sapUiSupportControlTreeTitle").openEnd().text("You can find a control in this tree by clicking it in the application UI while pressing the Ctrl+Alt+Shift keys.").close("div");t.openStart("div","sapUiSupportControlTreeArea").openEnd();t.openStart("ul").class("sapUiSupportControlTreeList").openEnd().close("ul");t.close("div");t.openStart("div","sapUiSupportControlTabs").class("sapUiSupportControlTabsHidden").openEnd();t.openStart("button","sapUiSupportControlTabProperties").class("sapUiSupportBtn").class("sapUiSupportTab").class("sapUiSupportTabLeft").openEnd().text("Properties").close("button");t.openStart("button","sapUiSupportControlTabBindingInfos").class("sapUiSupportBtn").class("sapUiSupportTab").openEnd().text("Binding Infos").close("button");t.openStart("button","sapUiSupportControlTabBreakpoints").class("sapUiSupportBtn").class("sapUiSupportTab").openEnd().text("Breakpoints").close("button");t.openStart("button","sapUiSupportControlTabExport").class("sapUiSupportBtn").class("sapUiSupportTab").class("sapUiSupportTabRight").openEnd().text("Export").close("button");t.close("div");t.openStart("div","sapUiSupportControlPropertiesArea").openEnd().close("div");t.flush(this.dom());t.destroy()};m.prototype.renderControlTree=function(t){var e=sap.ui.getCore().createRenderManager();function o(t,n){var r=n.aggregation.length>0||n.association.length>0;e.openStart("li","sap-debug-controltree-"+n.id).class("sapUiControlTreeElement").openEnd();var i=r?"minus":"space";e.voidStart("img").class("sapUiControlTreeIcon").attr("src","../../debug/images/"+i+".gif").voidEnd();if(n.isAssociation){e.voidStart("img").attr("title","Association").class("sapUiControlTreeIcon").attr("src","../../debug/images/link.gif").voidEnd()}var a=E(n.type);e.openStart("div").openEnd();e.openStart("span").class("name").attr("title",n.type).openEnd().text(a+" - "+n.id).close("span");e.openStart("span").class("sapUiSupportControlTreeBreakpointCount").class("sapUiSupportItemHidden").attr("title","Number of active breakpoints / methods").openEnd().close("span");e.close("div");if(n.aggregation.length>0){e.openStart("ul").openEnd();h(n.aggregation,o);e.close("ul")}if(n.association.length>0){e.openStart("ul").openEnd();h(n.association,function(t,n){if(n.isAssociationLink){var r=E(n.type);e.openStart("li").attr("data-sap-ui-controlid",n.id).class("sapUiControlTreeLink").openEnd();e.voidStart("img").class("sapUiControlTreeIcon").attr("align","middle").attr("src","../../debug/images/space.gif").voidEnd();e.voidStart("img").class("sapUiControlTreeIcon").attr("align","middle").attr("src","../../debug/images/link.gif").voidEnd();e.openStart("div").openEnd();e.openStart("span").attr("title","Association '"+n.name+"' to '"+n.id+"' with type '"+n.type).openEnd();e.text(r+" - "+n.id+" ("+n.name+")");e.close("span");e.close("div");e.close("li")}else{o(0,n)}});e.close("ul")}e.close("li")}h(t,o);e.flush(this.dom("#sapUiSupportControlTreeArea > ul.sapUiSupportControlTreeList"));e.destroy()};m.prototype.renderPropertiesTab=function(t,e){var o=sap.ui.getCore().createRenderManager();o.openStart("ul").class("sapUiSupportControlTreeList").attr("data-sap-ui-controlid",e).openEnd();h(t,function(t,e){o.openStart("li").openEnd();o.openStart("span").openEnd().openStart("label").class("sapUiSupportLabel").openEnd().text("BaseType").close("label").text(" ").openStart("code").openEnd().text(e.control).close("code").close("span");if(e.properties.length>0||e.aggregations.length>0){o.openStart("div").class("get").attr("title","Activate debugger for get-method").openEnd().text("G").close("div");o.openStart("div").class("set").attr("title","Activate debugger for set-method").openEnd().text("S").close("div");o.openStart("div").class("sapUiSupportControlProperties").openEnd();o.openStart("table").openEnd();o.openStart("colgroup").openEnd();o.voidStart("col").attr("width","50%").voidEnd();o.voidStart("col").attr("width","50%").voidEnd();o.close("colgroup");h(e.properties,function(t,e){o.openStart("tr").openEnd();o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text(e.name);if(e.isBound){o.voidStart("img").attr("title","Value is bound (see Binding Infos)").attr("src","../../debug/images/link.gif").voidEnd()}o.close("label");o.close("td");o.openStart("td").openEnd();if(e.type==="boolean"){o.voidStart("input").attr("type","checkbox");o.attr("data-sap-ui-name",e.name);if(e.value==true){o.attr("checked","checked")}o.voidEnd()}else if(e.enumValues){o.openStart("div").openEnd();o.openStart("select");o.attr("data-sap-ui-name",e.name).openEnd();h(e.enumValues,function(t,n){o.openStart("option");if(t===e.value){o.attr("selected","selected")}o.openEnd();o.text(t);o.close("option")});o.close("select");o.close("div")}else{o.openStart("div").openEnd();o.voidStart("input").attr("type","text");o.attr("data-sap-ui-name",e.name);if(e.value){o.attr("value",e.value)}o.voidEnd();o.close("div")}o.close("td");o.openStart("td").openEnd();o.voidStart("input").attr("type","checkbox").attr("data-sap-ui-method",e._sGetter).attr("title","Activate debugger for '"+e._sGetter+"'");if(e.bp_sGetter){o.attr("checked","checked")}o.voidEnd();o.close("td");o.openStart("td").openEnd();o.voidStart("input").attr("type","checkbox").attr("data-sap-ui-method",e._sMutator).attr("title","Activate debugger for '"+e._sMutator+"'");if(e.bp_sMutator){o.attr("checked","checked")}o.voidEnd();o.close("td");o.close("tr")});h(e.aggregations,function(t,e){o.openStart("tr").openEnd();o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text(e.name).close("label");o.close("td");o.openStart("td").openEnd();o.text(e.value);o.close("td");o.openStart("td").openEnd();o.voidStart("input").attr("type","checkbox").attr("data-sap-ui-method",e._sGetter).attr("title","Activate debugger for '"+e._sGetter+"'");if(e.bp_sGetter){o.attr("checked","checked")}o.voidEnd();o.close("td");o.openStart("td").openEnd();o.voidStart("input").attr("type","checkbox").attr("data-sap-ui-method",e._sMutator).attr("title","Activate debugger for '"+e._sMutator+"'");if(e.bp_sMutator){o.attr("checked","checked")}o.voidEnd();o.close("td");o.close("tr")});o.close("table").close("div")}o.close("li")});o.close("ul");o.flush(this.dom("#sapUiSupportControlPropertiesArea"));o.destroy();this.dom("#sapUiSupportControlTabs").classList.remove("sapUiSupportControlTabsHidden");this.selectTab(this._tab.properties)};m.prototype.renderBindingsTab=function(t,e){var o=sap.ui.getCore().createRenderManager();if(t.contexts.length>0){o.openStart("h2").openEnd().text("Contexts").close("h2");o.openStart("ul").class("sapUiSupportControlTreeList").attr("data-sap-ui-controlid",e).openEnd();h(t.contexts,function(t,e){o.openStart("li").openEnd();o.openStart("span").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Model Name: "+e.modelName).close("label");o.close("span");o.openStart("div").class("sapUiSupportControlProperties").openEnd();o.openStart("table").openEnd().openStart("colgroup").openEnd().voidStart("col").attr("width","15%").voidEnd().voidStart("col").attr("width","35%").voidEnd().voidStart("col").attr("width","50%").voidEnd().close("colgroup");o.openStart("tbody").openEnd();o.openStart("tr").openEnd();o.openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Path").close("label");o.close("td");o.openStart("td").openEnd();o.openStart("div").openEnd();o.openStart("span");if(e.invalidPath){o.class("sapUiSupportModelPathInvalid")}else if(e.unverifiedPath){o.class("sapUiSupportModelPathUnverified")}o.openEnd().text(e.path);if(e.invalidPath){o.text(" (invalid)")}else if(e.unverifiedPath){o.text(" (unverified)")}o.close("span");o.close("div");o.close("td");o.close("tr");if(e.location){o.openStart("tr").openEnd();o.openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Inherited from").close("label");o.close("td");o.openStart("td").openEnd();o.openStart("div").openEnd();o.openStart("a").class("control-tree").class("sapUiSupportLink").attr("title",e.location.name).attr("data-sap-ui-control-id",e.location.id).attr("href","#").openEnd().text(E(e.location.name)).text(" ("+e.location.id+")").close("a").close("div");o.close("td");o.close("tr")}o.close("tbody").close("table").close("div").close("li")});o.close("ul")}if(t.bindings.length>0){o.openStart("h2").openEnd().text("Bindings").close("h2");o.openStart("ul").class("sapUiSupportControlTreeList").attr("data-sap-ui-controlid",e).openEnd();h(t.bindings,function(t,e){o.openStart("li").attr("data-sap-ui-binding-name",e.name).openEnd();o.openStart("span").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text(e.name).close("label");o.voidStart("img").class("sapUiSupportRefreshBinding").attr("title","Refresh Binding").attr("src","../../debug/images/refresh.gif").voidEnd();o.close("span");h(e.bindings,function(t,n){o.openStart("div").class("sapUiSupportControlProperties").openEnd();o.openStart("table").openEnd().openStart("colgroup").openEnd().voidStart("col").attr("width","15%").voidEnd().voidStart("col").attr("width","35%").voidEnd().voidStart("col").attr("width","50%").voidEnd().close("colgroup");o.openStart("tbody").openEnd();o.openStart("tr").openEnd();o.openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Path").close("label");o.close("td");o.openStart("td").openEnd();o.openStart("div").openEnd().openStart("span");if(n.invalidPath){o.class("sapUiSupportModelPathInvalid")}else if(n.unverifiedPath){o.class("sapUiSupportModelPathUnverified")}o.openEnd().text(n.path);if(n.invalidPath){o.text(" (invalid)")}else if(n.unverifiedPath){o.text(" (unverified)")}o.close("span").close("div");o.close("td");o.close("tr");o.openStart("tr").openEnd();o.openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Absolute Path").close("label");o.close("td");o.openStart("td").openEnd();if(typeof n.absolutePath!=="undefined"){o.openStart("div").openEnd().text(n.absolutePath).close("div")}else{o.openStart("div").openEnd().text("No binding").close("div")}o.close("td");o.close("tr");o.openStart("tr").openEnd();o.openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Relative").close("label");o.close("td");o.openStart("td").openEnd();if(typeof n.isRelative!=="undefined"){o.openStart("div").openEnd().text(n.isRelative).close("div")}else{o.openStart("div").openEnd().text("No binding").close("div")}o.close("td");o.close("tr");o.openStart("tr").openEnd();o.openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Binding Type").close("label");o.close("td");o.openStart("td").openEnd();if(!e.type){o.openStart("div").openEnd().text("No binding").close("div")}else{o.openStart("div").attr("title",e.type).openEnd().text(E(e.type)).close("div")}o.close("td");o.close("tr");if(n.mode){o.openStart("tr").openEnd().openStart("td").attr("colspan","2").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Binding Mode").close("label");o.close("td");o.openStart("td").openEnd();o.openStart("div").openEnd().text(e.mode).close("div");o.close("td").close("tr")}o.openStart("tr").openEnd();o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Model").close("label");o.close("td");o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Name").close("label");o.close("td");o.openStart("td").openEnd();if(n.model&&n.model.name){o.openStart("div").openEnd().text(n.model.name).close("div")}else{o.openStart("div").openEnd().text("No binding").close("div")}o.close("td");o.close("tr");o.openStart("tr").openEnd();o.openStart("td").openEnd().close("td");o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Type").close("label");o.close("td");o.openStart("td").openEnd();if(n.model&&n.model.type){o.openStart("div").openEnd().openStart("span").attr("title",n.model.type).openEnd().text(E(n.model.type)).close("span").close("div")}else{o.openStart("div").openEnd().openStart("span").openEnd().text("No binding").close("span").close("div")}o.close("td");o.close("tr");o.openStart("tr").openEnd();o.openStart("td").openEnd().close("td");o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Default Binding Mode").close("label");o.close("td");o.openStart("td").openEnd();if(n.model&&n.model.bindingMode){o.openStart("div").openEnd().openStart("span").openEnd().text(n.model.bindingMode).close("span").close("div")}else{o.openStart("div").openEnd().openStart("span").openEnd().text("No binding").close("span").close("div")}o.close("td");o.close("tr");o.openStart("tr").openEnd();o.openStart("td").openEnd().close("td");o.openStart("td").openEnd();o.openStart("label").class("sapUiSupportLabel").openEnd().text("Location").close("label");o.close("td");o.openStart("td").openEnd();if(n.model&&n.model.location&&n.model.location.type){if(n.model.location.type==="control"){o.openStart("div").openEnd();o.openStart("a").class("control-tree").class("sapUiSupportLink").attr("title",n.model.location.name).attr("data-sap-ui-control-id",n.model.location.id).attr("href","#").openEnd().text(E(n.model.location.name)).text(" ("+n.model.location.id+")").close("a");o.close("div")}else{o.openStart("div").openEnd().openStart("span").attr("title","sap.ui.getCore()").openEnd().text("Core").close("span").close("div")}}else{o.openStart("div").openEnd().openStart("span").openEnd().text("No binding").close("span").close("div")}o.close("td");o.close("tr");o.close("tbody").close("table").close("div")});o.close("li")});o.close("ul")}o.flush(this.dom("#sapUiSupportControlPropertiesArea"));o.destroy()};m.prototype.renderBreakpointsTab=function(t,e){var o=sap.ui.getCore().createRenderManager();o.openStart("div").class("sapUiSupportControlMethods").attr("data-sap-ui-controlid",e).openEnd();o.openStart("select","sapUiSupportControlMethodsSelect").class("sapUiSupportAutocomplete").class("sapUiSupportSelect").openEnd();o.openStart("option").openEnd().close("option");h(t,function(t,e){if(!e.active){o.openStart("option").openEnd().text("oValue.name").close("option")}});o.close("select");o.voidStart("input").class("sapUiSupportControlBreakpointInput").class("sapUiSupportAutocomplete").attr("type","text").voidEnd();o.openStart("button","sapUiSupportControlAddBreakPoint").class("sapUiSupportRoundedButton").openEnd().text("Add breakpoint").close("button");o.voidStart("hr").class("no-border").voidEnd();o.openStart("ul","sapUiSupportControlActiveBreakpoints").class("sapUiSupportList").class("sapUiSupportBreakpointList").openEnd();h(t,function(t,e){if(!e.active){return}o.openStart("li").openEnd().openStart("span").openEnd().text(e.name).close("span").voidStart("img").class("remove-breakpoint").attr("src","../../debug/images/delete.gif").voidEnd().close("li")});o.close("ul").close("div");o.flush(this.dom("#sapUiSupportControlPropertiesArea"));o.destroy();this.selectTab(this._tab.breakpoints);this.dom(".sapUiSupportControlBreakpointInput").focus()};m.prototype.renderExportTab=function(){var t=sap.ui.getCore().createRenderManager();t.openStart("button","sapUiSupportControlExportToXml").class("sapUiSupportRoundedButton").class("sapUiSupportExportButton").openEnd().text("Export To XML").close("button");t.voidStart("br").voidEnd();t.voidStart("br").voidEnd();t.openStart("button","sapUiSupportControlExportToHtml").class("sapUiSupportRoundedButton").class("sapUiSupportExportButton").openEnd().text("Export To HTML").close("button");t.flush(this.dom("#sapUiSupportControlPropertiesArea"));t.destroy();this.selectTab(this._tab.exports)};m.prototype.requestProperties=function(t){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:t,callback:this.getId()+"ReceivePropertiesMethods"})};m.prototype.updateBreakpointCount=function(t,e){var o=S("#sap-debug-controltree-"+t+" > div span.sapUiSupportControlTreeBreakpointCount");if(e.active>0){o.text(e.active+" / "+e.all).toggleClass("sapUiSupportItemHidden",false)}else{o.text("").toggleClass("sapUiSupportItemHidden",true)}};m.prototype.onsapUiSupportControlTreeTriggerRequestProperties=function(t){this.requestProperties(t.getParameter("controlId"))};m.prototype.onsapUiSupportControlTreeReceivePropertiesMethods=function(t){var e=t.getParameter("controlId");this._oStub.sendEvent(this.getId()+"RequestProperties",{id:e,breakpointMethods:t.getParameter("methods")});this.updateBreakpointCount(e,JSON.parse(t.getParameter("breakpointCount")))};m.prototype.onsapUiSupportControlTreeReceiveControlTree=function(t){this.renderControlTree(JSON.parse(t.getParameter("controlTree")))};m.prototype.onsapUiSupportControlTreeReceiveControlTreeExportError=function(t){var e=t.getParameter("errorMessage");this._drawAlert(e)};m.prototype._drawAlert=function(t){alert("ERROR: The selected element cannot not be exported.\nPlease choose an other one.\n\nReason:\n"+t)};m.prototype.onsapUiSupportControlTreeReceiveControlTreeExport=function(t){var e;var r=JSON.parse(t.getParameter("serializedViews"));var i=t.getParameter("sType");if(!f(r)){e=new n;for(var a in r){var s=r[a];e.file(a.replace(/\./g,"/")+".view."+i.toLowerCase(),s)}}if(e){var p=e.generate({type:"blob"});o.save(p,i.toUpperCase()+"Export","zip","application/zip")}};m.prototype.onsapUiSupportSelectorSelect=function(t){this.selectControl(t.getParameter("id"))};m.prototype.onsapUiSupportControlTreeReceiveProperties=function(t){this.renderPropertiesTab(JSON.parse(t.getParameter("properties")),t.getParameter("id"))};m.prototype.onsapUiSupportControlTreeReceiveBindingInfos=function(t){this.renderBindingsTab(JSON.parse(t.getParameter("bindinginfos")),t.getParameter("id"))};m.prototype.onsapUiSupportControlTreeReceiveMethods=function(t){var e=t.getParameter("controlId");this.renderBreakpointsTab(JSON.parse(t.getParameter("methods")),e);this.updateBreakpointCount(e,JSON.parse(t.getParameter("breakpointCount")))};m.prototype._onNodeClick=function(t){var e=S(t.target);var o=e.closest("li");if(o.hasClass("sapUiControlTreeElement")){S(".sapUiControlTreeElement > div").removeClass("sapUiSupportControlTreeSelected");o.children("div").addClass("sapUiSupportControlTreeSelected");this._oStub.sendEvent("sapUiSupportSelectorHighlight",{id:o.attr("id").substring("sap-debug-controltree-".length)});var n=o.attr("id").substring("sap-debug-controltree-".length);if(e.hasClass("sapUiSupportControlTreeBreakpointCount")){this._currentTab=this._tab.breakpoints}this.onAfterControlSelected(n)}t.stopPropagation()};m.prototype._onIconClick=function(t){var e=S(t.target);if(e.parent().attr("data-sap-ui-collapsed")){e.attr("src",e.attr("src").replace("plus","minus")).parent().removeAttr("data-sap-ui-collapsed");e.siblings("ul").toggleClass("sapUiSupportItemHidden",false)}else{e.attr("src",e.attr("src").replace("minus","plus")).parent().attr("data-sap-ui-collapsed","true");e.siblings("ul").toggleClass("sapUiSupportItemHidden",true)}if(t.stopPropagation){t.stopPropagation()}};m.prototype._onControlTreeLinkClick=function(t){this.selectControl(S(t.target).closest("li").attr("data-sap-ui-controlid"))};m.prototype._onPropertiesTab=function(t){if(this.selectTab(this._tab.properties)){this.requestProperties(this.getSelectedControlId())}};m.prototype._onBindingInfosTab=function(t){if(this.selectTab(this._tab.bindinginfos)){this._oStub.sendEvent(this.getId()+"RequestBindingInfos",{id:this.getSelectedControlId()})}};m.prototype._onMethodsTab=function(t){if(this.selectTab(this._tab.breakpoints)){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:this.getSelectedControlId(),callback:this.getId()+"ReceiveMethods"})}};m.prototype._onExportTab=function(t){if(this.selectTab(this._tab.exports)){this.renderExportTab()}};m.prototype._autoComplete=function(t){if(t.keyCode==b.ENTER){this._updateSelectOptions(t);this._onAddBreakpointClicked()}if(t.keyCode>=b.ARROW_LEFT&&t.keyCode<=b.ARROW_DOWN){return}var e=S(t.target),o=e.prev("select"),n=e.val();if(n==""){return}var r=o.find("option").map(function(){return S(this).val()}).get();var i;for(var a=0;a<r.length;a++){i=r[a];if(i.toUpperCase().indexOf(n.toUpperCase())==0){var s=e.cursorPos();if(t.keyCode==b.BACKSPACE){s--}e.val(i);e.selectText(s,i.length);break}}return};m.prototype._updateSelectOptions=function(t){var e=t.target;if(e.tagName=="INPUT"){var o=e.value;e=e.previousSibling;var n=e.options;for(var r=0;r<n.length;r++){var i=n[r].value||n[r].text;if(i.toUpperCase()==o.toUpperCase()){e.selectedIndex=r;break}}}var a=e.selectedIndex;var s=e.options[a].value||e.options[a].text;if(e.nextSibling&&e.nextSibling.tagName=="INPUT"){e.nextSibling.value=s}};m.prototype._onAddBreakpointClicked=function(t){var e=this.dom("#sapUiSupportControlMethodsSelect");this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:e.closest("[data-sap-ui-controlid]").dataset.sapUiControlid,methodName:e.value,active:true,callback:this.getId()+"ReceiveMethods"})};m.prototype._onExportToXmlClicked=function(t){this._startSerializing("XML")};m.prototype._onExportToHtmlClicked=function(t){this._startSerializing("HTML")};m.prototype._startSerializing=function(t){var e=this.getSelectedControlId();if(e){this._oStub.sendEvent(this.getId()+"RequestControlTreeSerialize",{controlID:e,sType:t})}else{this._drawAlert("Nothing to export. Please select an item in the control tree.")}};m.prototype._onRemoveBreakpointClicked=function(t){var e=S(t.target);this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:e.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:e.siblings("span").text(),active:false,callback:this.getId()+"ReceiveMethods"})};m.prototype._selectOptionsChanged=function(t){var e=t.target;var o=e.nextSibling;o.value=e.options[e.selectedIndex].value};m.prototype._onPropertyChange=function(t){var e=t.target;var o=S(e);var n=o.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid");var r=o.val();if(o.attr("type")==="checkbox"){r=""+o.is(":checked")}this._oStub.sendEvent(this.getId()+"ChangeProperty",{id:n,name:o.attr("data-sap-ui-name"),value:r})};m.prototype._onPropertyBreakpointChange=function(t){var e=S(t.target);this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:e.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:e.attr("data-sap-ui-method"),active:e.is(":checked"),callback:this.getId()+"TriggerRequestProperties"})};m.prototype._onNavToControl=function(t){var e=S(t.target);var o=e.attr("data-sap-ui-control-id");if(o!==this.getSelectedControlId()){this.selectControl(o)}};m.prototype._onRefreshBinding=function(t){var e=S(t.target);var o=e.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid");var n=e.closest("[data-sap-ui-binding-name]").attr("data-sap-ui-binding-name");this._oStub.sendEvent(this.getId()+"RefreshBinding",{id:o,name:n})};m.prototype.selectTab=function(t){var e=this.dom("#sapUiSupportControlTab"+t);if(e.classList.contains("active")){return false}this.$().find("#sapUiSupportControlTabs button").removeClass("active");e.classList.add("active");this._currentTab=t;return true};m.prototype.getSelectedControlId=function(){var t=this.$().find(".sapUiSupportControlTreeSelected");if(t.length===0){return undefined}else{return t.parent().attr("id").substring("sap-debug-controltree-".length)}};m.prototype.selectControl=function(t){if(!t){return}S(".sapUiControlTreeElement > div").removeClass("sapUiSupportControlTreeSelected");var e=this;S(document.getElementById("sap-debug-controltree-"+t)).parents("[data-sap-ui-collapsed]").each(function(t,o){e._onIconClick({target:S(o).find("img:first").get(0)})});var o=S(document.getElementById("sap-debug-controltree-"+t)).children("div").addClass("sapUiSupportControlTreeSelected").position();var n=this.$().find("#sapUiSupportControlTreeArea").scrollTop();this.$().find("#sapUiSupportControlTreeArea").scrollTop(n+o.top);this.onAfterControlSelected(t)};m.prototype.onAfterControlSelected=function(t){if(this._currentTab==this._tab.properties){this.requestProperties(t)}else if(this._currentTab==this._tab.breakpoints){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:t,callback:this.getId()+"ReceiveMethods"})}else if(this._currentTab==this._tab.bindinginfos){this._oStub.sendEvent(this.getId()+"RequestBindingInfos",{id:this.getSelectedControlId()})}};function y(t){this.onsapUiSupportControlTreeRequestControlTree()}m.prototype.onsapUiSupportControlTreeRequestControlTree=function(t){this._oStub.sendEvent(this.getId()+"ReceiveControlTree",{controlTree:JSON.stringify(this.getControlTree())})};m.prototype.onsapUiSupportControlTreeRequestControlTreeSerialize=function(t){var o=this.oCore.byId(t.getParameter("controlID"));var n=t.getParameter("sType");var r;var i;var a=n+"ViewExported";d.create({definition:document}).then(function(s){s.setViewName(a);s._controllerName=n+"ViewController";try{if(o){if(o instanceof l){r=new e(o,window,"sap.m")}else{s.addContent(o.clone());r=new e(s,window,"sap.m")}i=n&&n!=="XML"?r.serializeToHTML():r.serializeToXML()}else{var p=this.oCore.getUIArea(t.getParameter("controlID"));var d=p.getContent();for(var c=0;c<d.length;c++){s.addContent(d[c])}r=new e(s,window,"sap.m");i=n&&n!=="XML"?r.serializeToHTML():r.serializeToXML();for(var c=0;c<d.length;c++){p.addContent(d[c])}}if(r){this._oStub.sendEvent(this.getId()+"ReceiveControlTreeExport",{serializedViews:JSON.stringify(i),sType:n})}}catch(t){this._oStub.sendEvent(this.getId()+"ReceiveControlTreeExportError",{errorMessage:t.message})}}.bind(this))};m.prototype.onsapUiSupportControlTreeRequestProperties=function(t){var e=JSON.parse(t.getParameter("breakpointMethods"));var o=this.getControlProperties(t.getParameter("id"),e);this._oStub.sendEvent(this.getId()+"ReceiveProperties",{id:t.getParameter("id"),properties:JSON.stringify(o)})};m.prototype.onsapUiSupportControlTreeChangeProperty=function(t){var e=t.getParameter("id");var o=this.oCore.byId(e);if(o){var n=t.getParameter("name");var i=t.getParameter("value");var a=o.getMetadata().getProperty(n);if(a&&a.type){var s=r.getType(a.type);if(s instanceof r){var p=s.parseValue(i);if(s.isValid(p)&&p!=="(null)"){o[a._sMutator](p)}}else if(s){if(s[i]){o[a._sMutator](i)}}}}};m.prototype.onsapUiSupportControlTreeRequestBindingInfos=function(t){var e=t.getParameter("id");this._oStub.sendEvent(this.getId()+"ReceiveBindingInfos",{id:e,bindinginfos:JSON.stringify(this.getControlBindingInfos(e))})};m.prototype.onsapUiSupportControlTreeRefreshBinding=function(t){var e=t.getParameter("id");var o=t.getParameter("name");this.refreshBinding(e,o);this._oStub.sendEvent(this.getId()+"ReceiveBindingInfos",{id:e,bindinginfos:JSON.stringify(this.getControlBindingInfos(e))})};m.prototype.getControlTree=function(){var t=this.oCore,e=[],o={};function n(t){var e={id:t.getId(),type:"",aggregation:[],association:[]};o[e.id]=e.id;if(t instanceof p){e.library="sap.ui.core";e.type="sap.ui.core.UIArea";h(t.getContent(),function(t,o){var r=n(o);e.aggregation.push(r)})}else{e.library=t.getMetadata().getLibraryName();e.type=t.getMetadata().getName();if(t.mAggregations){for(var r in t.mAggregations){var i=t.mAggregations[r];if(i){var s=Array.isArray(i)?i:[i];h(s,function(t,o){if(o instanceof a){var r=n(o);e.aggregation.push(r)}})}}}if(t.mAssociations){var l=t.getMetadata().getAllAssociations();for(var d in t.mAssociations){var c=t.mAssociations[d];var u=l[d]?l[d].type:null;if(c&&u){var g=Array.isArray(c)?c:[c];h(g,function(t,o){e.association.push({id:o,type:u,name:d,isAssociationLink:true})})}}}}return e}h(t.mUIAreas,function(t,o){var r=n(o);e.push(r)});function r(e,a){for(var s=0;s<a.association.length;s++){var p=a.association[s];if(!o[p.id]){var l=v.get(p.type||"");if(!(typeof l==="function")){continue}var d=l.getMetadata().getStereotype(),u=null;switch(d){case"element":case"control":u=t.byId(p.id);break;case"component":u=i.get(p.id);break;case"template":u=c.byId(p.id);break;default:break}if(!u){continue}a.association[s]=n(u);a.association[s].isAssociation=true;r(0,a.association[s])}}h(a.aggregation,r)}h(e,r);return e};m.prototype.getControlProperties=function(t,e){var o=/^((boolean|string|int|float)(\[\])?)$/;var n=[];var i=this.oCore.byId(t);if(!i&&this.oCore.getUIArea(t)){n.push({control:"sap.ui.core.UIArea",properties:[],aggregations:[]})}else if(i){var a=i.getMetadata();while(a instanceof s){var p={control:a.getName(),properties:[],aggregations:[]};var l=a.getProperties();h(l,function(t,o){var n={};h(o,function(t,i){if(t.substring(0,1)!=="_"||(t=="_sGetter"||t=="_sMutator")){n[t]=i}if(t=="_sGetter"||t=="_sMutator"){n["bp"+t]=e.filter(function(t){return t.name===i&&t.active}).length===1}var a=r.getType(o.type);if(a&&a.isEnumType()){n["enumValues"]=a.getEnumValues()}});n.value=i.getProperty(t);n.isBound=!!i.mBindingInfos[t];p.properties.push(n)});var d=a.getAggregations();h(d,function(t,n){if(n.altTypes&&n.altTypes[0]&&o.test(n.altTypes[0])&&typeof i.getAggregation(t)!=="object"){var r={};h(n,function(t,o){if(t.substring(0,1)!=="_"||(t=="_sGetter"||t=="_sMutator")){r[t]=o}if(t=="_sGetter"||t=="_sMutator"){r["bp"+t]=e.filter(function(t){return t.name===o&&t.active}).length===1}});r.value=i.getAggregation(t);p.aggregations.push(r)}});n.push(p);a=a.getParent()}}return n};m.prototype.getControlBindingInfos=function(t){var e={bindings:[],contexts:[]};var o=this.oCore.byId(t);if(!o){return e}var n=o.mBindingInfos;var r=this;for(var i in n){if(n.hasOwnProperty(i)){var a=n[i];var s=[];var p,l=[];if(Array.isArray(a.parts)){p=a.parts}else{p=[a]}if(a.binding instanceof g){l=a.binding.getBindings()}else if(a.binding instanceof u){l=[a.binding]}h(p,function(t,e){var n={};n.invalidPath=true;n.path=e.path;n.mode=e.mode;n.model={name:e.model};if(l.length>t&&l[t]){var i=l[t],a=i.getModel(),p=i.getPath(),d;if(a){d=a.resolve(p,i.getContext());if(a.isA("sap.ui.model.odata.v4.ODataModel")){n.unverifiedPath=true;n.invalidPath=false}else{if(a.getProperty(d)!==undefined&&a.getProperty(d)!==null){n.invalidPath=false}else if(a.getProperty(p)!==undefined&&a.getProperty(p)!==null){n.invalidPath=false;d=p}}}n.absolutePath=typeof d==="undefined"?"Unresolvable":d;n.isRelative=i.isRelative();n.model=r.getBindingModelInfo(i,o)}s.push(n)});e.bindings.push({name:i,type:a.binding?a.binding.getMetadata().getName():undefined,bindings:s})}}function d(t,e){var o={modelName:e==="undefined"?"none (default)":e,path:t.getPath()};if(t.getModel().isA("sap.ui.model.odata.v4.ODataModel")){o.unverifiedPath=true}else{if(!t.getObject()==null){o.invalidPath=true}}return o}var c=o.oBindingContexts;for(var f in c){if(c.hasOwnProperty(f)){e.contexts.push(d(c[f],f))}}var c=o.oPropagatedProperties.oBindingContexts;for(var f in c){if(c.hasOwnProperty(f)&&!o.oBindingContexts[f]){var v=d(c[f],f);var S=o;do{if(S.oBindingContexts[f]==c[f]){v.location={id:S.getId(),name:S.getMetadata().getName()};break}}while(S=S.getParent());e.contexts.push(v)}}return e};m.prototype.getBindingModelInfo=function(t,e){var o={};var n=t.getModel();function r(t){for(var e in t){if(t.hasOwnProperty(e)){if(t[e]===n){return e}}}return null}o.name=r(e.oModels)||r(e.oPropagatedProperties.oModels);if(o.name){var i=e;do{if(i.oModels[o.name]===n){o.location={type:"control",id:i.getId(),name:i.getMetadata().getName()};break}}while(i=i.getParent());if(!o.location){var a=null;if(o.name==="undefined"){a=this.oCore.getModel()}else{a=this.oCore.getModel(o.name)}if(a){o.location={type:"core"}}}}o.type=n.getMetadata().getName();o.bindingMode=n.getDefaultBindingMode();o.name=o.name==="undefined"?"none (default)":o.name;return o};m.prototype.refreshBinding=function(t,e){var o=this.oCore.byId(t);var n=o.mBindingInfos[e];if(!o||!n){return}var r=n.binding;if(!r){return}if(r instanceof g){var i=r.getBindings();for(var a=0;a<i.length;a++){i[a].refresh()}}else{r.refresh()}};return m});