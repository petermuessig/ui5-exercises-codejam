/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/Core","./library","sap/ui/core/Control","sap/m/ToggleButton","sap/ui/core/InvisibleText","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/OverflowToolbarLayoutData","sap/m/OverflowToolbarAssociativePopover","sap/m/OverflowToolbarAssociativePopoverControls","sap/ui/core/ResizeHandler","sap/ui/core/IconPool","sap/ui/core/theming/Parameters","sap/ui/dom/units/Rem","sap/ui/Device","./OverflowToolbarRenderer","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Focusable"],function(t,o,e,i,n,r,s,l,a,h,f,u,d,p,_,C,v,c,g){"use strict";var y=e.PlacementType;var b=e.ButtonType;var O=t.aria.HasPopup;var T=e.OverflowToolbarPriority;var m=s.extend("sap.m.OverflowToolbar",{metadata:{properties:{asyncMode:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{_overflowButton:{type:"sap.m.ToggleButton",multiple:false,visibility:"hidden"},_popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"}},designtime:"sap/m/designtime/OverflowToolbar.designtime"}});m.ARIA_ROLE_DESCRIPTION="OVERFLOW_TOOLBAR_ROLE_DESCRIPTION";m.CONTENT_SIZE_TOLERANCE=1;m.prototype._callToolbarMethod=function(t,o){return s.prototype[t].apply(this,o)};m.prototype.init=function(){this._callToolbarMethod("init",arguments);this._iPreviousToolbarWidth=null;this._bOverflowButtonNeeded=false;this._bListenForControlPropertyChanges=false;this._bListenForInvalidationEvents=false;this._bControlsInfoCached=false;this._bSkipOptimization=false;this._aControlSizes={};this._iFrameRequest=null;this._iOverflowToolbarButtonSize=0;this._oOverflowToolbarButtonClone=null;this._iToolbarOnlyContentSize=0;this._aMovableControls=[];this._aToolbarOnlyControls=[];this._aPopoverOnlyControls=[];this._aAllCollections=[this._aMovableControls,this._aToolbarOnlyControls,this._aPopoverOnlyControls];this.addStyleClass("sapMOTB");this._sAriaRoleDescription=o.getLibraryResourceBundle("sap.m").getText(m.ARIA_ROLE_DESCRIPTION);this._fnMediaChangeRef=this._fnMediaChange.bind(this);C.media.attachHandler(this._fnMediaChangeRef)};m.prototype.exit=function(){var t=this.getAggregation("_popover");if(t){t.destroy()}if(this._oOverflowToolbarButtonClone){this._oOverflowToolbarButtonClone.destroy()}if(this._iFrameRequest){window.cancelAnimationFrame(this._iFrameRequest);this._iFrameRequest=null}C.media.detachHandler(this._fnMediaChangeRef)};m.prototype.setAsyncMode=function(t){return this.setProperty("asyncMode",t,true)};m.prototype.onAfterRendering=function(){this._bInvalidatedAndNotRendered=false;if(this._bContentVisibilityChanged){this._bControlsInfoCached=false;this._bContentVisibilityChanged=false}if(this.getAsyncMode()){this._doLayoutAsync().then(this._applyFocus.bind(this))}else{this._doLayout();this._applyFocus()}};m.prototype.onsapfocusleave=function(){this._resetChildControlFocusInfo()};m.prototype.setWidth=function(t){this.setProperty("width",t);this._bResized=true;return this};m.prototype._doLayout=function(){var t;if(!o.isThemeApplied()){c.debug("OverflowToolbar: theme not applied yet, skipping calculations",this);return}this._recalculateOverflowButtonSize();t=this.$().is(":visible")?this.$().width():0;this._bListenForControlPropertyChanges=false;this._bListenForInvalidationEvents=false;this._deregisterToolbarResize();if(t>0){if(!this._isControlsInfoCached()||this._bNeedUpdateOnControlsCachedSizes&&this._bResized){this._cacheControlsInfo()}if(this._iPreviousToolbarWidth!==t){this._iPreviousToolbarWidth=t;this._setControlsOverflowAndShrinking(t);this.fireEvent("_controlWidthChanged")}}this._registerToolbarResize();this._bListenForControlPropertyChanges=true;this._bListenForInvalidationEvents=true;this._bResized=false};m.prototype._doLayoutAsync=function(){return new Promise(function(t,o){this._iFrameRequest=window.requestAnimationFrame(function(){this._doLayout();t()}.bind(this))}.bind(this))};m.prototype._applyFocus=function(){var t,e=this.$().lastFocusableDomRef();if(this.sFocusedChildControlId){t=o.byId(this.sFocusedChildControlId)}if(t&&t.getDomRef()){t.focus()}else if(this._bControlWasFocused){this._getOverflowButton().focus();this._bControlWasFocused=false;this._bOverflowButtonWasFocused=true}else if(this._bOverflowButtonWasFocused&&!this._getOverflowButtonNeeded()){e&&e.focus();this._bOverflowButtonWasFocused=false}};m.prototype._preserveChildControlFocusInfo=function(){var t=o.getCurrentFocusedControlId();if(this._getControlsIds().indexOf(t)!==-1){this._bControlWasFocused=true;this.sFocusedChildControlId=t}else if(t===this._getOverflowButton().getId()){this._bOverflowButtonWasFocused=true;this.sFocusedChildControlId=""}};m.prototype._resetChildControlFocusInfo=function(){this._bControlWasFocused=false;this._bOverflowButtonWasFocused=false;this.sFocusedChildControlId=""};m.prototype._registerToolbarResize=function(){if(s.isRelativeWidth(this.getWidth())){var t=this._handleResize.bind(this);this._sResizeListenerId=u.register(this,t)}};m.prototype._deregisterToolbarResize=function(){if(this._sResizeListenerId){u.deregister(this._sResizeListenerId);this._sResizeListenerId=""}};m.prototype._handleResize=function(){this._bResized=true;if(this._bInvalidatedAndNotRendered){return}this._callDoLayout()};m.prototype._fnMediaChange=function(){this._bControlsInfoCached=false;this._iPreviousToolbarWidth=null;this._callDoLayout()};m.prototype._callDoLayout=function(){if(this.getAsyncMode()){this._doLayoutAsync()}else{this._doLayout()}};m.prototype._cacheControlsInfo=function(){var t,o,e=parseInt(this.$().css("padding-right"))||0,i=parseInt(this.$().css("padding-left"))||0,n=this._getOverflowButtonSize(),r=this._iToolbarOnlyContentSize;this._iOldContentSize=this._iContentSize;this._iContentSize=0;this._iToolbarOnlyContentSize=0;this._bNeedUpdateOnControlsCachedSizes=false;this.getContent().forEach(this._updateControlsCachedSizes,this);if(r!==this._iToolbarOnlyContentSize){this.fireEvent("_minWidthChange",{minWidth:this._iToolbarOnlyContentSize>0?this._iToolbarOnlyContentSize+n:0})}if(C.system.phone){this._iContentSize-=1}if(this._aPopoverOnlyControls.length){t=this._aPopoverOnlyControls.filter(function(t){return t.getVisible()});o=t.length>0;if(o){this._iContentSize+=n}}this._bControlsInfoCached=true;if(this._iOldContentSize!==this._iContentSize){this.fireEvent("_contentSizeChange",{contentSize:this._iContentSize+e+i+1})}};m.prototype._updateControlsCachedSizes=function(t){var o,e,i;o=this._getControlPriority(t);e=this._calculateControlSize(t);this._aControlSizes[t.getId()]=e;i=s.getOrigWidth(t.getId());if(i&&s.isRelativeWidth(i)){this._bNeedUpdateOnControlsCachedSizes=true}if(o!==T.AlwaysOverflow){this._iContentSize+=e}if(o===T.NeverOverflow){this._iToolbarOnlyContentSize+=e}};m.prototype._calculateControlSize=function(t){return this._getOptimalControlWidth(t,this._aControlSizes[t.getId()])};m.prototype._isControlsInfoCached=function(){return this._bControlsInfoCached};m.prototype._flushButtonsToPopover=function(){this._aButtonsToMoveToPopover.forEach(this._moveButtonToPopover,this)};m.prototype._invalidateIfHashChanged=function(t){if(typeof t==="undefined"||this._getPopover()._getContentIdsHash()!==t){this._preserveChildControlFocusInfo();this.invalidate()}};m.prototype._addOverflowButton=function(){if(!this._getOverflowButtonNeeded()){this._iCurrentContentSize+=this._getOverflowButtonSize();this._setOverflowButtonNeeded(true)}};m.prototype._aggregateMovableControls=function(){var t={},o=[],e,i,n,r,s;this._aMovableControls.forEach(function(l){e=m._getControlGroup(l);i=m._oPriorityOrder;if(e){n=this._getControlPriority(l);r=this._getControlIndex(l);t[e]=t[e]||[];s=t[e];s.unshift(l);if(!s._priority||i[s._priority]<i[n]){s._priority=n}if(!s._index||s._index<r){s._index=r}}else{o.push(l)}},this);Object.keys(t).forEach(function(e){o.push(t[e])});return o};m.prototype._extractControlsToMoveToOverflow=function(t,o){var e,i;for(e=0;e<t.length;e++){i=t[e];if(i.length){i.forEach(this._addToPopoverArrAndUpdateContentSize,this)}else{this._addToPopoverArrAndUpdateContentSize(i)}if(this._getControlPriority(i)!==T.Disappear){this._addOverflowButton()}if(this._iCurrentContentSize<=o){break}}};m.prototype._addToPopoverArrAndUpdateContentSize=function(t){this._aButtonsToMoveToPopover.unshift(t);this._iCurrentContentSize-=this._aControlSizes[t.getId()]};m.prototype._sortByPriorityAndIndex=function(t,o){var e=m._oPriorityOrder,i=this._getControlPriority(t),n=this._getControlPriority(o),r=e[i]-e[n];if(r!==0){return r}else{return this._getControlIndex(o)-this._getControlIndex(t)}};m.prototype._setControlsOverflowAndShrinking=function(t){var o;this._iCurrentContentSize=this._iContentSize;this._aButtonsToMoveToPopover=[];if(this._bSkipOptimization){this._bSkipOptimization=false}else{o=this._getPopover()._getContentIdsHash()}this._resetToolbar();this._collectPopoverOnlyControls();this._markControlsWithShrinkableLayoutData();if(this._iCurrentContentSize<=t+m.CONTENT_SIZE_TOLERANCE){this._flushButtonsToPopover();this._invalidateIfHashChanged(o);return}this._moveControlsToPopover(t);this._flushButtonsToPopover();if(this._iCurrentContentSize>t){this._checkContents()}this._invalidateIfHashChanged(o)};m.prototype._markControlsWithShrinkableLayoutData=function(){this.getContent().forEach(this._markControlWithShrinkableLayoutData,this)};m.prototype._collectPopoverOnlyControls=function(){var t=this._aPopoverOnlyControls.length,o,e;if(t){for(o=t-1;o>=0;o--){e=this._aPopoverOnlyControls[o];if(e.getVisible()){this._aButtonsToMoveToPopover.unshift(e)}}if(this._aButtonsToMoveToPopover.length>0){this._setOverflowButtonNeeded(true)}}};m.prototype._moveControlsToPopover=function(t){var o=[];if(this._aMovableControls.length){o=this._aggregateMovableControls();o.sort(this._sortByPriorityAndIndex.bind(this));this._extractControlsToMoveToOverflow(o,t)}};m.prototype._markControlWithShrinkableLayoutData=function(t){var o,e,i,n;t.removeStyleClass(s.shrinkClass);o=s.getOrigWidth(t.getId());if(!s.isRelativeWidth(o)){return}e=t.getLayoutData();i=e&&e.isA("sap.m.ToolbarLayoutData")&&e.getShrinkable();n=t.isA("sap.m.Breadcrumbs");if(i||n){t.addStyleClass(s.shrinkClass)}};m.prototype._resetToolbar=function(){this._getPopover().close();this._getPopover()._getAllContent().forEach(this._restoreButtonInToolbar,this);this._setOverflowButtonNeeded(false);this.getContent().forEach(this._removeShrinkingClass)};m.prototype._removeShrinkingClass=function(t){t.removeStyleClass(s.shrinkClass)};m.prototype._moveButtonToPopover=function(t){this._getPopover().addAssociatedContent(t)};m.prototype._restoreButtonInToolbar=function(t){if(typeof t==="object"){t=t.getId()}this._getPopover().removeAssociatedContent(t)};m.prototype._resetAndInvalidateToolbar=function(t){if(this._bIsBeingDestroyed){return}this._resetToolbar();this._bControlsInfoCached=false;this._iPreviousToolbarWidth=null;if(t){this._bSkipOptimization=true}if(this.$().length){this._preserveChildControlFocusInfo();this.invalidate()}};m.prototype.invalidate=function(){this._bInvalidatedAndNotRendered=true;i.prototype.invalidate.apply(this,arguments)};m.prototype._getVisibleContent=function(){var t=this.getContent(),o=this._getPopover()._getAllContent();return t.filter(function(t){return o.indexOf(t)===-1})};m.prototype._getVisibleAndNonOverflowContent=function(){return this._getVisibleContent().filter(function(t){return t.getVisible()})};m.prototype._getToggleButton=function(t){return new n({ariaHasPopup:O.Menu,id:this.getId()+t,icon:d.getIconURI("overflow"),press:this._overflowButtonPressed.bind(this),ariaLabelledBy:r.getStaticId("sap.ui.core","Icon.overflow"),type:b.Transparent})};m.prototype._getOverflowButton=function(){var t;if(!this.getAggregation("_overflowButton")){t=this._getToggleButton("-overflowButton");this.setAggregation("_overflowButton",t,true)}return this.getAggregation("_overflowButton")};m.prototype._getOverflowButtonClone=function(){if(!this._oOverflowToolbarButtonClone){this._oOverflowToolbarButtonClone=this._getToggleButton("-overflowButtonClone").addStyleClass("sapMTBHiddenElement")}this._oOverflowToolbarButtonClone._getTooltip=function(){return""};this._oOverflowToolbarButtonClone.removeAllAssociation("ariaLabelledBy");return this._oOverflowToolbarButtonClone};m.prototype._overflowButtonPressed=function(t){var o=this._getPopover(),e=this._getBestPopoverPlacement();if(o.getPlacement()!==e){o.setPlacement(e)}if(o.isOpen()){o.close()}else{o.openBy(t.getSource())}};m.prototype._getPopover=function(){var t;if(!this.getAggregation("_popover")){t=new h(this.getId()+"-popover",{showHeader:false,showArrow:false,modal:false,horizontalScrolling:C.system.phone?false:true,contentWidth:C.system.phone?"100%":"auto",offsetY:this._detireminePopoverVerticalOffset(),ariaLabelledBy:r.getStaticId("sap.m","INPUT_AVALIABLE_VALUES")});t._adaptPositionParams=function(){h.prototype._adaptPositionParams.call(this);this._myPositions=["end top","begin center","end bottom","end center"];this._atPositions=["end bottom","end center","end top","begin center"]};if(C.system.phone){t.attachBeforeOpen(this._shiftPopupShadow,this)}t.attachAfterClose(this._popOverClosedHandler,this);this.setAggregation("_popover",t,true)}return this.getAggregation("_popover")};m.prototype._shiftPopupShadow=function(){var t=this._getPopover(),o=t.getCurrentPosition();if(o===y.Bottom){t.addStyleClass("sapMOTAPopoverNoShadowTop");t.removeStyleClass("sapMOTAPopoverNoShadowBottom")}else if(o===y.Top){t.addStyleClass("sapMOTAPopoverNoShadowBottom");t.removeStyleClass("sapMOTAPopoverNoShadowTop")}};m.prototype._popOverClosedHandler=function(){this._getOverflowButton().setPressed(false);if(g(document.activeElement).control(0)){return}this._getOverflowButton().focus()};m.prototype._getOverflowButtonNeeded=function(){return this._bOverflowButtonNeeded};m.prototype._setOverflowButtonNeeded=function(t){if(this._bOverflowButtonNeeded!==t){this._bOverflowButtonNeeded=t}return this};m.prototype._updateContentInfoInControlsCollections=function(){this.getContent().forEach(function(t){if(t){this._removeContentFromControlsCollections(t);this._moveControlInSuitableCollection(t,this._getControlPriority(t))}},this)};m.prototype._moveControlInSuitableCollection=function(t,o){var e=o!==T.NeverOverflow,i=o===T.AlwaysOverflow;if(f.supportsControl(t)&&i){this._aPopoverOnlyControls.push(t)}else{if(f.supportsControl(t)&&e&&t.getVisible()){this._aMovableControls.push(t)}else{this._aToolbarOnlyControls.push(t)}}};m.prototype._removeContentFromControlsCollections=function(t){var o,e,i;for(o=0;o<this._aAllCollections.length;o++){e=this._aAllCollections[o];i=e.indexOf(t);if(i!==-1){e.splice(i,1)}}};m.prototype._clearAllControlsCollections=function(){this._aMovableControls=[];this._aToolbarOnlyControls=[];this._aPopoverOnlyControls=[];this._aAllCollections=[this._aMovableControls,this._aToolbarOnlyControls,this._aPopoverOnlyControls]};m.prototype.onLayoutDataChange=function(t){this._resetAndInvalidateToolbar(true);t&&this._updateContentInfoInControlsCollections()};m.prototype.addContent=function(t){this._registerControlListener(t);this._resetAndInvalidateToolbar(false);if(t){this._moveControlInSuitableCollection(t,this._getControlPriority(t))}this._informNewFlexibleContentAdded(t);return this._callToolbarMethod("addContent",arguments)};m.prototype.insertContent=function(t,o){this._registerControlListener(t);this._resetAndInvalidateToolbar(false);if(t){this._moveControlInSuitableCollection(t,this._getControlPriority(t))}this._informNewFlexibleContentAdded(t);return this._callToolbarMethod("insertContent",arguments)};m.prototype.removeContent=function(){var t=this._callToolbarMethod("removeContent",arguments);if(t){this._getPopover().removeAssociatedContent(t.getId())}this._resetAndInvalidateToolbar(false);this._deregisterControlListener(t);this._removeContentFromControlsCollections(t);return t};m.prototype.removeAllContent=function(){var t=this._callToolbarMethod("removeAllContent",arguments);t.forEach(this._deregisterControlListener,this);t.forEach(this._removeContentFromControlsCollections,this);this._resetAndInvalidateToolbar(false);this._clearAllControlsCollections();return t};m.prototype.destroyContent=function(){this._resetAndInvalidateToolbar(false);setTimeout(function(){this._resetAndInvalidateToolbar(false)}.bind(this),0);this._clearAllControlsCollections();return this._callToolbarMethod("destroyContent",arguments)};m.prototype._informNewFlexibleContentAdded=function(t){if(t&&t.isA("sap.m.IOverflowToolbarFlexibleContent")){this.fireEvent("_contentSizeChange",{contentSize:null})}};m.prototype._registerControlListener=function(t){var o;if(t){t.attachEvent("_change",this._onContentPropertyChangedOverflowToolbar,this);if(t.getMetadata().getInterfaces().indexOf("sap.m.IOverflowToolbarContent")>-1){o=t.getOverflowToolbarConfig().invalidationEvents;if(o&&Array.isArray(o)){o.forEach(function(o){t.attachEvent(o,this._onInvalidationEventFired,this)},this)}}}};m.prototype._deregisterControlListener=function(t){var o;if(t){t.detachEvent("_change",this._onContentPropertyChangedOverflowToolbar,this);if(t.getMetadata().getInterfaces().indexOf("sap.m.IOverflowToolbarContent")>-1){o=t.getOverflowToolbarConfig().invalidationEvents;if(o&&Array.isArray(o)){o.forEach(function(o){t.detachEvent(o,this._onInvalidationEventFired,this)},this)}}}};m.prototype._onContentPropertyChangedOverflowToolbar=function(t){var o=t.getSource(),e,i;this._updateContentInfoInControlsCollections();if(!this._bListenForControlPropertyChanges){return}e=f.getControlConfig(o);i=t.getParameter("name");if(i!=="visible"&&!o.getVisible()){return}if(typeof e!=="undefined"&&e.noInvalidationProps.indexOf(i)!==-1){return}if(i==="visible"){this._bContentVisibilityChanged=true}if(o.isA("sap.m.IOverflowToolbarFlexibleContent")&&o.getVisible()){this.fireEvent("_contentSizeChange",{contentSize:null})}this._resetAndInvalidateToolbar(true)};m.prototype._onInvalidationEventFired=function(t){var o=t.getSource();if(!this._bListenForInvalidationEvents){return}if(o.isA("sap.m.IOverflowToolbarFlexibleContent")){this.fireEvent("_contentSizeChange",{contentSize:null})}this._resetAndInvalidateToolbar(true)};m.prototype._getOverflowButtonSize=function(){return this._iOverflowToolbarButtonSize};m.prototype._getBestPopoverPlacement=function(){var t=this.getHTMLTag();if(t==="Footer"){return y.Top}else if(t==="Header"){return y.Bottom}return y.Vertical};m.prototype._getControlsIds=function(){return this.getContent().map(function(t){return t.getId()})};m.prototype._getControlIndex=function(t){return t.length?t._index:this.indexOfContent(t)};m.prototype._getOptimalControlWidth=function(t,o){var e,i=t.getLayoutData(),n=i&&i.isA("sap.m.ToolbarLayoutData"),r=t.getVisible(),s=t.isA("sap.m.Breadcrumbs"),l=false,a,h;if(s){l=true}else if(n){l=i.getShrinkable()}a=l?this._getMinWidthOfShrinkableControl(t):0;if(t.isA("sap.m.ToolbarSpacer")){h=parseInt(t.$().css("width"));a=t.getWidth()&&h?h:0;e=m._getOptimalWidthOfShrinkableControl(t,a)}else if(l&&a>0&&r){e=m._getOptimalWidthOfShrinkableControl(t,a)}else{e=r?m._getControlWidth(t):0}if(e===null){e=typeof o!=="undefined"?o:0}return e};m.prototype._getMinWidthOfShrinkableControl=function(t){var o=t.$().css("min-width"),e=parseInt(o),i=s.isRelativeWidth(o);if(i){return e*this.$().width()/100}else{return e}};m.prototype._getControlPriority=function(t){var o,e,i,n;if(t.length){return t._priority}o=t.getMetadata().getInterfaces().indexOf("sap.m.IOverflowToolbarContent")>-1;n=o&&t.getOverflowToolbarConfig().getCustomImportance;if(o&&typeof n==="function"){return n()}e=t.getLayoutData&&t.getLayoutData();if(e&&e instanceof a){if(e.getMoveToOverflow()===false){return T.NeverOverflow}if(e.getStayInOverflow()===true){return T.AlwaysOverflow}i=e.getPriority();if(i===T.Never){return T.NeverOverflow}if(i===T.Always){return T.AlwaysOverflow}return i}return T.High};m._getControlMargins=function(t){return t.$().outerWidth(true)-t.$().outerWidth()};m._getOptimalWidthOfShrinkableControl=function(t,o){return o+m._getControlMargins(t)};m._getControlWidth=function(t){var o=t&&t.getDomRef();if(o&&t.$().is(":visible")){return Math.round(o.getBoundingClientRect().width+m._getControlMargins(t))}return null};m.prototype.getAccessibilityInfo=function(){var t=[],o=this._getVisibleAndNonOverflowContent();if(o.length>0){t=t.concat(o)}if(this._getOverflowButtonNeeded()){t.push(this._getOverflowButton())}return{children:t}};m._getControlGroup=function(t){var o=t.getLayoutData();if(o instanceof a){return o.getGroup()}};m._oPriorityOrder=function(){var t={};t[T.Disappear]=1;t[T.Low]=2;t["Medium"]=3;t[T.High]=4;return t}();m.prototype._detireminePopoverVerticalOffset=function(){return this.$().parents().hasClass("sapUiSizeCompact")?2:3};m.prototype._recalculateOverflowButtonSize=function(){var t=this._getOverflowButtonClone().$(),o;if(!this._getOverflowButtonSize()&&t.width()>0){o=t.outerWidth(true);this._iOverflowToolbarButtonSize=o?o:0}};m.prototype.onThemeChanged=function(){this._resetAndInvalidateToolbar();this._iOverflowToolbarButtonSize=0;this._recalculateOverflowButtonSize();for(var t in this._aControlSizes){if(this._aControlSizes.hasOwnProperty(t)){this._aControlSizes[t]=0}}};m.prototype.closeOverflow=function(){this._getPopover().close()};return m});