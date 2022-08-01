/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/core/Core","sap/ui/core/IconPool","sap/m/Dialog","sap/m/Button","sap/m/Bar","sap/m/Title","sap/m/Toolbar","sap/m/ToggleButton","sap/m/ValueStateHeader"],function(t,e,n,r,o,i,u,s,a,g){"use strict";var l=t.TitleAlignment;return function(){this.getPickerTitle=function(){return this.getPopover().getCustomHeader().getContentMiddle()[0]};this.getOkButton=function(){var t=this.getPopover(),e=t&&t.getBeginButton();return e||null};this.getCancelButton=function(){var t=this.getPopover(),e=t&&t.getCustomHeader()&&t.getCustomHeader().getContentRight&&t.getCustomHeader().getContentRight()[0];return e||null};this.getFilterSelectedButton=function(){var t=this.getPopover(),e=t&&t.getSubHeader()&&t.getSubHeader().getContent()[1];return e||null};this.getShowMoreButton=function(){return this.getPopover().getEndButton()};this.setShowMoreButton=function(t){this.getPopover().setEndButton(t);return this};this.removeShowMoreButton=function(){this.getPopover().destroyAggregation("endButton");return this};this.setOkPressHandler=function(t){var e=this.getOkButton();e&&e.attachPress(t);return e};this.setCancelPressHandler=function(t){var e=this.getCancelButton();e&&e.attachPress(t);return e};this.setShowSelectedPressHandler=function(t){var e=this.getFilterSelectedButton();e&&e.attachPress(t);return e};this.createPopover=function(s,a,g){var h=e.getLibraryResourceBundle("sap.m"),p=this,d=g&&new g(s.getId()+"-popup-input",{width:"100%",showValueStateMessage:false});return new r(s.getId()+"-popup",{beginButton:new o(s.getId()+"-popup-closeButton",{text:h.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON")}),stretch:true,titleAlignment:l.Auto,customHeader:new i(s.getId()+"-popup-header",{titleAlignment:l.Auto,contentMiddle:new u,contentRight:new o({icon:n.getIconURI("decline")})}),subHeader:c(a,d),horizontalScrolling:false,initialFocus:d,beforeOpen:function(){p._updatePickerHeaderTitle()},afterClose:function(){s.focus();t.closeKeyboard()}})};this.getInput=function(){var t=this.getPopover(),e=t&&t.getSubHeader(),n=e&&e.getContent();return n&&n.filter(function(t){return t.isA("sap.m.InputBase")})[0]};this._updatePickerHeaderTitle=function(){var t=e.getLibraryResourceBundle("sap.m"),n=this.getPickerTitle(),r,o;if(!n){return}o=this._getInputLabels();if(o.length){r=o[0];if(r&&typeof r.getText==="function"){n.setText(r.getText())}}else{n.setText(t.getText("COMBOBOX_PICKER_TITLE"))}return n};this._getInputLabels=function(){return this._fnInputLabels()};function c(t,e){var n=[e];if(t.showSelectedButton){n.push(h())}return new s({content:n})}function h(){var t=n.getIconURI("multiselect-all");var r=e.getLibraryResourceBundle("sap.m").getText("SHOW_SELECTED_BUTTON");return new a({icon:t,tooltip:r})}this._getValueStateHeader=function(){var t=this.getPopover();if(!t.getContent().length||t.getContent().length&&!t.getContent()[0].isA("sap.m.ValueStateHeader")){this._createValueStateHeader()}return t.getContent()[0]};this._createValueStateHeader=function(){var t=new g;var e=this.getPopover();e.insertContent(t,0);t.setPopup(e)}}});