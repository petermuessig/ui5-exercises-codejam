/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Context","./ODataParentBinding","./lib/_AggregationCache","./lib/_AggregationHelper","./lib/_Cache","./lib/_GroupLock","./lib/_Helper","./lib/_Parser","sap/base/Log","sap/base/util/uid","sap/ui/base/SyncPromise","sap/ui/model/Binding","sap/ui/model/ChangeReason","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/FilterProcessor","sap/ui/model/FilterType","sap/ui/model/ListBinding","sap/ui/model/Sorter","sap/ui/model/odata/OperationMode"],function(e,t,i,n,r,o,s,a,h,u,d,f,c,l,p,g,C,x,v,y){"use strict";var m="sap.ui.model.odata.v4.ODataListBinding",P={AggregatedDataStateChange:true,change:true,createActivate:true,createCompleted:true,createSent:true,dataReceived:true,dataRequested:true,DataStateChange:true,patchCompleted:true,patchSent:true,refresh:true},E=x.extend("sap.ui.model.odata.v4.ODataListBinding",{constructor:R});function R(i,n,r,o,a,h){x.call(this,i,n);t.call(this);if(n.endsWith("/")){throw new Error("Invalid path: "+n)}h=s.clone(h)||{};this.checkBindingParameters(h,["$$aggregation","$$canonicalPath","$$getKeepAliveContext","$$groupId","$$operationMode","$$ownRequest","$$patchWithoutSideEffects","$$sharedRequest","$$updateGroupId"]);this.iActiveContexts=0;this.aApplicationFilters=s.toArray(a);this.sChangeReason=i.bAutoExpandSelect&&!h.$$aggregation?"AddVirtualContext":undefined;this.iCreatedContexts=0;this.oDiff=undefined;this.aFilters=[];this.sGroupId=h.$$groupId;this.bHasAnalyticalInfo=false;this.oHeaderContext=this.bRelative?null:e.createNewContext(i,this,n);this.sOperationMode=h.$$operationMode||i.sOperationMode;this.mPreviousContextsByPath={};this.aPreviousData=[];this.bRefreshKeptElements=false;this.bSharedRequest=h.$$sharedRequest||i.bSharedRequests;this.aSorters=s.toArray(o);this.sUpdateGroupId=h.$$updateGroupId;if(!this.sOperationMode&&(this.aSorters.length||this.aApplicationFilters.length)){throw new Error("Unsupported operation mode: "+this.sOperationMode)}this.applyParameters(h);if(!this.bRelative||r&&!r.fetchValue){this.createReadGroupLock(this.getGroupId(),true)}this.setContext(r);i.bindingCreated(this)}t(E.prototype);E.prototype.attachCreateActivate=function(e,t){this.attachEvent("createActivate",e,t)};E.prototype.detachCreateActivate=function(e,t){this.detachEvent("createActivate",e,t)};E.prototype.attachCreateCompleted=function(e,t){this.attachEvent("createCompleted",e,t)};E.prototype.detachCreateCompleted=function(e,t){this.detachEvent("createCompleted",e,t)};E.prototype.attachCreateSent=function(e,t){this.attachEvent("createSent",e,t)};E.prototype.detachCreateSent=function(e,t){this.detachEvent("createSent",e,t)};E.prototype._delete=function(t,i,n,r,o){var a,h=false,u=n.iIndex===undefined?s.getRelativePath(n.getPath(),this.oHeaderContext.getPath()):String(n.iIndex),d=false,f=this;return this.deleteFromCache(t,i,u,r,o,function(t,i){var r,o,u,c,l;if(n.isKeepAlive()){n.resetKeepAlive();a=true}if(n.created()){f.destroyCreated(n);h=true}else if(t>=0){for(l=t;l<f.aContexts.length;l+=1){n=f.aContexts[l];if(n){f.mPreviousContextsByPath[n.getPath()]=n}}u=f.getResolvedPath();f.aContexts.splice(t,1);for(l=t;l<f.aContexts.length;l+=1){if(f.aContexts[l]){c=l-f.iCreatedContexts;o=s.getPrivateAnnotation(i[l],"predicate");r=u+(o||"/"+c);n=f.mPreviousContextsByPath[r];if(n){delete f.mPreviousContextsByPath[r];if(n.iIndex===c){n.checkUpdate()}else{n.iIndex=c}}else{n=e.create(f.oModel,f,r,c)}f.aContexts[l]=n}}f.iMaxLength-=1;h=true}else if(f.bLengthFinal){d=true}}).then(function(){var e=f.iMaxLength;if(d){f.iMaxLength=f.fetchValue("$count",undefined,true).getResult()-f.iActiveContexts;h=e!==f.iMaxLength}if(h){f._fireChange({reason:c.Remove})}else if(a){delete f.mPreviousContextsByPath[n.getPath()];n.destroy()}})};E.prototype.adjustPredicate=function(e,i,n){var r=this;function o(e,t){var i=r.aPreviousData.indexOf(e);if(i>=0){r.aPreviousData[i]=t}}if(n){n.adjustPredicate(e,i,o)}else{t.prototype.adjustPredicate.apply(this,arguments);if(this.mCacheQueryOptions){this.fetchCache(this.oContext,true)}this.oHeaderContext.adjustPredicate(e,i);this.aContexts.forEach(function(t){t.adjustPredicate(e,i,o)})}};E.prototype.applyParameters=function(e,t){var i,r=this.mParameters&&this.mParameters.$$aggregation,o=this.mQueryOptions&&this.mQueryOptions.$apply;if("$$getKeepAliveContext"in e&&"$apply"in e){throw new Error("Cannot combine $$getKeepAliveContext and $apply")}if("$$aggregation"in e){if("$apply"in e){throw new Error("Cannot combine $$aggregation and $apply")}i=n.buildApply(e.$$aggregation).$apply}this.mQueryOptions=this.oModel.buildQueryOptions(e,true);this.mParameters=e;if(i){this.mQueryOptions.$apply=i}if(t===""){if(this.mQueryOptions.$apply===o&&(!this.mParameters.$$aggregation||!r||s.deepEqual(this.mParameters.$$aggregation,r))){return}t=this.bHasAnalyticalInfo?c.Change:c.Filter}if(this.isRootBindingSuspended()){this.setResumeChangeReason(t);return}this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(t);if(this.oHeaderContext){this.oHeaderContext.checkUpdate()}};E.prototype.attachEvent=function(e,t,i,n){if(!(e in P)){throw new Error("Unsupported event '"+e+"': v4.ODataListBinding#attachEvent")}return x.prototype.attachEvent.apply(this,arguments)};E.prototype._checkDataStateMessages=function(e,t){if(t){e.setModelMessages(this.oModel.getMessagesByPath(t,true))}};E.prototype.checkKeepAlive=function(e){if(this.isRelative()&&!this.mParameters.$$ownRequest){throw new Error("Missing $$ownRequest at "+this)}if(e===this.oHeaderContext){throw new Error("Unsupported header context "+e)}if(this.mParameters.$$aggregation){throw new Error("Unsupported $$aggregation at "+this)}if(this.bSharedRequest){throw new Error("Unsupported $$sharedRequest at "+this)}};E.prototype.collapse=function(e){var t=this.aContexts,i=this.oCache.collapse(s.getRelativePath(e.getPath(),this.oHeaderContext.getPath())),n=e.getModelIndex(),r,o=this;if(i>0){t.splice(n+1,i).forEach(function(e){o.mPreviousContextsByPath[e.getPath()]=e});for(r=n+1;r<t.length;r+=1){if(t[r]){t[r].iIndex=r}}this.iMaxLength-=i;this._fireChange({reason:c.Change})}};E.prototype.create=function(t,i,n,r){var o,a=this.fetchResourcePath(),h,d=this.getUpdateGroupId(),f,l=this.getResolvedPath(),p="($uid="+u()+")",g=l+p,C,x=this;if(!l){throw new Error("Binding is unresolved: "+this)}this.checkSuspended();n=!!n;if(n&&!(this.bLengthFinal||this.mParameters.$count)){throw new Error("Must know the final length to create at the end. Consider setting $count")}if(this.bFirstCreateAtEnd&&!n){throw new Error("Cannot create at the start after creation at end")}if(r){if(this.isRelative()&&!this.mParameters.$$ownRequest){throw new Error("Missing $$ownRequest at "+this)}d="$inactive."+d}else{this.iActiveContexts+=1}if(this.bFirstCreateAtEnd===undefined){this.bFirstCreateAtEnd=n}f=this.lockGroup(d,true,true,function(){if(!x.aContexts.includes(o)){o.destroy();return}x.destroyCreated(o);return Promise.resolve().then(function(){x._fireChange({reason:c.Remove})})});h=this.createInCache(f,a,l,p,t,this.bFirstCreateAtEnd!==n,function(e){x.oModel.reportError("POST on '"+a+"' failed; will be repeated automatically",m,e);x.fireEvent("createCompleted",{context:o,success:false})},function(){x.fireEvent("createSent",{context:o})}).then(function(e){var n,r;if(!(t&&t["@$ui5.keepTransientPath"])){r=s.getPrivateAnnotation(e,"predicate");if(r){x.adjustPredicate(p,r,o);x.oModel.checkMessages()}}x.fireEvent("createCompleted",{context:o,success:true});n=x.getGroupId();if(i){return o.refreshDependentBindings(o.getPath().slice(1),n,true)}if(x.oModel.isApiGroup(n)){n="$auto"}return x.refreshSingle(o,x.lockGroup(n))},function(e){f.unlock(true);throw e});this.iCreatedContexts+=1;o=e.create(this.oModel,this,g,-this.iCreatedContexts,h,r);o.fetchValue().then(function(e){if(e){s.setPrivateAnnotation(e,"context",o);s.setPrivateAnnotation(e,"firstCreateAtEnd",x.bFirstCreateAtEnd)}});if(this.bFirstCreateAtEnd!==n){this.aContexts.splice(this.iCreatedContexts-1,0,o);for(C=this.iCreatedContexts-1;C>=0;C-=1){this.aContexts[C].iIndex=C-this.iCreatedContexts}}else{this.aContexts.unshift(o)}this._fireChange({reason:c.Add});return o};E.prototype.createContexts=function(t,i){var n=false,r,o,a=i.$count,h,u=this.bLengthFinal,d=this.oModel,f=this.getResolvedPath(),c,l,p=t>this.aContexts.length,g,C=this;function x(){var e=C.iMaxLength+C.iCreatedContexts,t;if(e>=C.aContexts.length){return}for(t=e;t<C.aContexts.length;t+=1){if(C.aContexts[t]){C.aContexts[t].destroy()}}while(e>0&&!C.aContexts[e-1]){e-=1}C.aContexts.length=e;n=true}for(g=0;g<i.length;g+=1){if(this.aContexts[t+g]===undefined&&i[g]){n=true;h=t+g-this.iCreatedContexts;c=s.getPrivateAnnotation(i[g],"predicate");o=f+(c||"/"+h);r=this.mPreviousContextsByPath[o];if(r&&(!r.created()||r.isKeepAlive())){delete this.mPreviousContextsByPath[o];r.iIndex=h;r.checkUpdate()}else{r=e.create(d,this,o,h)}this.aContexts[t+g]=r}}l=Object.keys(this.mPreviousContextsByPath);if(l.length){d.addPrerenderingTask(this.destroyPreviousContexts.bind(this,l))}if(a!==undefined){this.bLengthFinal=true;this.iMaxLength=a-this.iActiveContexts;x()}else{if(!i.length){this.iMaxLength=t-this.iCreatedContexts;x()}else if(this.aContexts.length>this.iMaxLength+this.iCreatedContexts){this.iMaxLength=Infinity}if(!(p&&i.length===0)){this.bLengthFinal=this.aContexts.length===this.iMaxLength+this.iCreatedContexts}}if(this.bLengthFinal!==u){n=true}return n};E.prototype.destroy=function(){if(this.bHasAnalyticalInfo&&this.aContexts===undefined){return}this.aContexts.forEach(function(e){e.destroy()});this.destroyPreviousContexts();if(this.oHeaderContext){this.oHeaderContext.destroy()}this.oModel.bindingDestroyed(this);this.aApplicationFilters=undefined;this.aContexts=undefined;this.oDiff=undefined;this.aFilters=undefined;this.oHeaderContext=undefined;this.mPreviousContextsByPath=undefined;this.aPreviousData=undefined;this.mQueryOptions=undefined;this.aSorters=undefined;t.prototype.destroy.call(this);x.prototype.destroy.call(this)};E.prototype.destroyCreated=function(e){var t=e.getModelIndex(),i;this.iCreatedContexts-=1;if(!e.isInactive()){this.iActiveContexts-=1}for(i=0;i<t;i+=1){this.aContexts[i].iIndex+=1}if(!this.iCreatedContexts){this.bFirstCreateAtEnd=undefined}this.aContexts.splice(t,1);this.destroyLater(e)};E.prototype.destroyLater=function(e){if(this.iCurrentEnd){this.mPreviousContextsByPath[e.getPath()]=e}else{e.destroy()}};E.prototype.destroyPreviousContexts=function(e){var t=this.mPreviousContextsByPath;if(t){(e||Object.keys(t)).forEach(function(i){var n=t[i];if(n){if(e&&n.isKeepAlive()){n.iIndex=undefined}else{if(!n.isTransient()){n.destroy()}delete t[i]}}})}};E.prototype.doCreateCache=function(e,t,n,r,o,a){var h,u,d=this;if(a&&a.getResourcePath()===e&&a.$deepResourcePath===r){h=this.oHeaderContext.getPath();u=Object.keys(this.mPreviousContextsByPath).filter(function(e){return d.mPreviousContextsByPath[e].isKeepAlive()});if(this.iCreatedContexts||u.length){a.reset(u.map(function(e){return s.getRelativePath(e,h)}),o);a.setQueryOptions(t,true);return a}}t=this.inheritQueryOptions(t,n);return this.getCacheAndMoveKeepAliveContexts(e,t)||i.create(this.oModel.oRequestor,e,r,this.mParameters.$$aggregation,t,this.oModel.bAutoExpandSelect,this.bSharedRequest)};E.prototype.doFetchQueryOptions=function(e){var t=this;return this.fetchResolvedQueryOptions(e).then(function(i){return t.fetchFilter(e,i.$filter).then(function(e){return s.mergeQueryOptions(i,t.getOrderby(i.$orderby),e)})})};E.prototype.doReplaceWith=function(t,i,n){var r=t.iIndex,o=t.isKeepAlive(),s,a=t.fnOnBeforeDestroy,h,u=this.oHeaderContext.getPath()+n,d=this.mPreviousContextsByPath[u];if(d){if(d===t){return d}if(d.iIndex!==undefined){throw new Error("Unexpected index: "+d)}d.iIndex=r;delete this.mPreviousContextsByPath[u]}else{d=e.create(this.oModel,this,u,r);s=true}t.iIndex=undefined;if(r===undefined){this.mPreviousContextsByPath[u]=d;this.oCache.addKeptElement(i)}else{this.aContexts[r]=d;this.oCache.doReplaceWith(r,i)}if(o){this.mPreviousContextsByPath[t.getPath()]=t;if(s){if(a){h=(a.$original||a).bind(null,d);h.$original=a}d.setKeepAlive(true,h)}}else{this.destroyLater(t)}this._fireChange({reason:c.Change});return d};E.prototype.doSetProperty=function(){};E.prototype.expand=function(e){var t=false,i=this;this.checkSuspended();return this.oCache.expand(this.lockGroup(),s.getRelativePath(e.getPath(),this.oHeaderContext.getPath()),function(){t=true;i.fireDataRequested()}).then(function(n){var r=i.aContexts,o,s,a;if(n>0){o=e.getModelIndex();for(a=r.length-1;a>o;a-=1){s=r[a];if(s){s.iIndex+=n;r[a+n]=s;delete r[a]}}i.iMaxLength+=n;i._fireChange({reason:c.Change})}if(t){i.fireDataReceived({})}},function(e){if(t){i.fireDataReceived({error:e})}throw e})};E.prototype.fetchContexts=function(e,t,i,n,r,o){var s,a=this;if(this.bFirstCreateAtEnd){e+=this.iCreatedContexts}n=n||this.lockGroup();s=this.fetchData(e,t,i,n,o);if(r){s=Promise.resolve(s)}return s.then(function(t){var i;if(!a.aContexts){i=new Error("Binding already destroyed");i.canceled=true;throw i}return t&&a.createContexts(e,t.value)},function(e){n.unlock(true);throw e})};E.prototype.fetchData=function(e,t,i,n,r){var o=this.oContext,s=this;return this.oCachePromise.then(function(a){if(s.bRelative&&o!==s.oContext){return undefined}if(a){return a.read(e,t,i,n,r).then(function(e){s.assertSameCache(a);return e})}n.unlock();return o.fetchValue(s.sReducedPath).then(function(i){var n;i=i||[];n=i.$count;i=i.slice(e,e+t);i.$count=n;return{value:i}})})};E.prototype.fetchDownloadUrl=function(){var e=this.oModel.mUriParameters;if(!this.isResolved()){throw new Error("Binding is unresolved")}return this.withCache(function(t,i){return t.getDownloadUrl(i,e)})};E.prototype.fetchFilter=function(e,t){var i,r,o,a;function h(e,t,i){var n,r,o,a;function h(e){return o?"tolower("+e+")":e}o=t==="Edm.String"&&e.bCaseSensitive===false;r=h(decodeURIComponent(e.sPath));a=h(s.formatLiteral(e.oValue1,t));switch(e.sOperator){case p.BT:n=r+" ge "+a+" and "+r+" le "+h(s.formatLiteral(e.oValue2,t));break;case p.NB:n=c(r+" lt "+a+" or "+r+" gt "+h(s.formatLiteral(e.oValue2,t)),i);break;case p.EQ:case p.GE:case p.GT:case p.LE:case p.LT:case p.NE:n=r+" "+e.sOperator.toLowerCase()+" "+a;break;case p.Contains:case p.EndsWith:case p.NotContains:case p.NotEndsWith:case p.NotStartsWith:case p.StartsWith:n=e.sOperator.toLowerCase().replace("not","not ")+"("+r+","+a+")";break;default:throw new Error("Unsupported operator: "+e.sOperator)}return n}function u(e,t,i){var n;if(!e){return d.resolve()}if(e.aFilters){return d.all(e.aFilters.map(function(i){return u(i,t,e.bAnd)})).then(function(t){return c(t.join(e.bAnd?" and ":" or "),i&&!e.bAnd)})}n=o.resolve(f(e.sPath,t),a);return o.fetchObject(n).then(function(r){var o,s,a;if(!r){throw new Error("Type cannot be determined, no metadata for path: "+n)}a=e.sOperator;if(a===p.All||a===p.Any){o=e.oCondition;s=e.sVariable;if(a===p.Any&&!o){return e.sPath+"/any()"}t=Object.create(t);t[s]=f(e.sPath,t);return u(o,t).then(function(t){return e.sPath+"/"+e.sOperator.toLowerCase()+"("+s+":"+t+")"})}return h(e,r.$Type,i)})}function f(e,t){var i=e.split("/");i[0]=t[i[0]];return i[0]?i.join("/"):e}function c(e,t){return t?"("+e+")":e}i=g.combineFilters(this.aFilters,this.aApplicationFilters);if(!i){return d.resolve([t])}r=n.splitFilter(i,this.mParameters.$$aggregation);o=this.oModel.getMetaModel();a=o.getMetaContext(this.oModel.resolve(this.sPath,e));return d.all([u(r[0],{},t).then(function(e){return e&&t?e+" and ("+t+")":e||t}),u(r[1],{})])};E.prototype.fetchValue=function(e,t,i){var n=i&&this.oCache!==undefined?d.resolve(this.oCache):this.oCachePromise,r=this;return n.then(function(n){var s,a;if(n){s=i?o.$cached:r.lockGroup();a=r.getRelativePath(e);if(a!==undefined){return n.fetchValue(s,a,undefined,t)}}if(r.oContext){return r.oContext.fetchValue(e,t,i)}})};E.prototype.findContextForCanonicalPath=function(e){var t=Object.values(this.mPreviousContextsByPath).filter(function(e){return e.isKeepAlive()});function i(t){return t.find(function(t){var i;if(t){i=t.fetchCanonicalPath();i.caught();return i.getResult()===e}})}return i(t)||i(this.aContexts)};E.prototype.filter=function(e,t){var i=s.toArray(e);if(this.sOperationMode!==y.Server){throw new Error("Operation mode has to be sap.ui.model.odata.OperationMode.Server")}if(t===C.Control&&s.deepEqual(i,this.aFilters)||s.deepEqual(i,this.aApplicationFilters)){return this}if(this.hasPendingChanges(true)){throw new Error("Cannot filter due to pending changes")}if(t===C.Control){this.aFilters=i}else{this.aApplicationFilters=i}if(this.isRootBindingSuspended()){this.setResumeChangeReason(c.Filter);return this}this.createReadGroupLock(this.getGroupId(),true);this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(c.Filter);if(this.oHeaderContext){this.oHeaderContext.checkUpdate()}return this};E.prototype.fireCreateActivate=function(e){this.iActiveContexts+=1;this.fireEvent("createActivate")};E.prototype.getAllCurrentContexts=function(){var e=[];this.withCache(function(t,i){e=t.getAllElements(i)},"",true);if(this.createContexts(0,e)){this._fireChange({reason:c.Change})}return this.aContexts.filter(function(e){return e}).concat(Object.values(this.mPreviousContextsByPath).filter(function(e){return e.isKeepAlive()}))};E.prototype.getCacheAndMoveKeepAliveContexts=function(e,t){var i,n,r=this;if(!this.mParameters.$$getKeepAliveContext){return undefined}i=this.oModel.releaseKeepAliveBinding("/"+e);if(!i){return undefined}Object.keys(i.mParameters).concat(Object.keys(this.mParameters)).forEach(function(e){if((e[0]!=="$"||e==="$$patchWithoutSideEffects"||e==="$$updateGroupId")&&r.mParameters[e]!==i.mParameters[e]){throw new Error(r+": parameter does not match getKeepAliveContext: "+e)}});this.mLateQueryOptions=s.clone(t);s.aggregateExpandSelect(this.mLateQueryOptions,i.mLateQueryOptions);this.mPreviousContextsByPath=i.mPreviousContextsByPath;Object.values(this.mPreviousContextsByPath).forEach(function(e){e.oBinding=r});n=i.oCache;n.setQueryOptions(t);i.oCache=null;i.oCachePromise=d.resolve(null);i.mPreviousContextsByPath={};i.destroy();return n};E.prototype.getContexts=function(t,i,n,r){var o,s,a=false,u=false,d,f,l=!!this.sChangeReason,p=this.getResolvedPath(),g,C=this;h.debug(this+"#getContexts("+t+", "+i+", "+n+")",undefined,m);this.checkSuspended();t=t||0;if(t!==0&&this.bUseExtendedChangeDetection){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" iStart must be 0 if extended change detection is enabled, but is "+t)}if(this.bUseExtendedChangeDetection){if(n!==undefined){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" iMaximumPrefetchSize must not be set if extended change detection is"+" enabled")}if(r){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" must not use bKeepCurrent if extended change detection is enabled")}}if(n&&r){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" must not use both iMaximumPrefetchSize and bKeepCurrent")}if(!this.isResolved()){this.aPreviousData=[];return[]}o=this.sChangeReason||c.Change;this.sChangeReason=undefined;if(o==="AddVirtualContext"){this.oModel.addPrerenderingTask(function(){var e=C.bUseExtendedChangeDetection;if(C.aContexts===undefined){g.destroy();return}if(!C.isRootBindingSuspended()){C.bUseExtendedChangeDetection=false;C.getContexts(t,i,n);C.bUseExtendedChangeDetection=e}C.oModel.addPrerenderingTask(function(){if(C.aContexts&&!C.isRootBindingSuspended()){C.sChangeReason="RemoveVirtualContext";C._fireChange({detailedReason:"RemoveVirtualContext",reason:c.Change});C.reset(c.Refresh)}g.destroy()})},true);g=e.create(this.oModel,this,p+"/"+e.VIRTUAL,e.VIRTUAL);return[g]}if(o==="RemoveVirtualContext"||this.oContext&&this.oContext.iIndex===e.VIRTUAL){return[]}i=i||this.oModel.iSizeLimit;if(!n||n<0){n=0}d=this.oReadGroupLock;this.oReadGroupLock=undefined;if(!this.oDiff){f=this.fetchContexts(t,i,n,d,l,function(){a=true;C.fireDataRequested()});this.resolveRefreshPromise(f);f.then(function(e){if(C.bUseExtendedChangeDetection){C.oDiff={aDiff:C.getDiff(i),iLength:i}}if(u){if(e||C.oDiff&&C.oDiff.aDiff.length){C._fireChange({reason:o})}else{C.oDiff=undefined}}if(a){C.fireDataReceived({data:{}})}},function(e){if(a){C.fireDataReceived(e.canceled?{data:{}}:{error:e})}throw e}).catch(function(e){C.oModel.reportError("Failed to get contexts for "+C.oModel.sServiceUrl+p.slice(1)+" with start index "+t+" and length "+i,m,e)});u=true}if(!r){this.iCurrentBegin=t;this.iCurrentEnd=t+i}s=this.getContextsInViewOrder(t,i);if(this.bUseExtendedChangeDetection){if(this.oDiff&&i!==this.oDiff.iLength){throw new Error("Extended change detection protocol violation: Expected "+"getContexts(0,"+this.oDiff.iLength+"), but got getContexts(0,"+i+")")}s.dataRequested=!this.oDiff;s.diff=this.oDiff?this.oDiff.aDiff:[]}this.oDiff=undefined;return s};E.prototype.getContextsInViewOrder=function(e,t){var i,n,r;if(this.bFirstCreateAtEnd){i=[];n=Math.min(t,this.getLength()-e);for(r=0;r<n;r+=1){i[r]=this.aContexts[this.getModelIndex(e+r)]}}else{i=this.aContexts.slice(e,e+t)}return i};E.prototype.getCount=function(){var e=this.getHeaderContext();return e?e.getProperty("$count"):undefined};E.prototype.getCurrentContexts=function(){var e,t=Math.min(this.iCurrentEnd,this.iMaxLength+this.iCreatedContexts)-this.iCurrentBegin;e=this.getContextsInViewOrder(this.iCurrentBegin,t);if(t<Infinity){while(e.length<t){e.push(undefined)}}return e};E.prototype.getDependentBindings=function(){var e=this;return this.oModel.getDependentBindings(this).filter(function(t){return t.oContext.isKeepAlive()||!(t.oContext.getPath()in e.mPreviousContextsByPath)})};E.prototype.getDiff=function(e){var t=this.aPreviousData,i=this;this.aPreviousData=this.getContextsInViewOrder(0,e).map(function(e){return i.getContextData(e)});return this.diffData(t,this.aPreviousData)};E.prototype.getDistinctValues=function(e){throw new Error("Unsupported operation: v4.ODataListBinding#getDistinctValues")};E.prototype.getDownloadUrl=s.createGetMethod("fetchDownloadUrl",true);E.prototype.getEntryData=function(e){return JSON.stringify(e.getValue())};E.prototype.getEntryKey=function(e){return e.getPath()};E.prototype.getFilterInfo=function(e){var t=g.combineFilters(this.aFilters,this.aApplicationFilters),i=null,n;if(t){i=t.getAST(e)}if(this.mQueryOptions.$filter){n={expression:this.mQueryOptions.$filter,syntax:"OData "+this.oModel.getODataVersion(),type:"Custom"};if(i){i={left:i,op:"&&",right:n,type:"Logical"}}else{i=n}}return i};E.prototype.getGeneration=function(){return this.oHeaderContext.getGeneration(true)||t.prototype.getGeneration.call(this)};E.prototype.getHeaderContext=function(){return this.isResolved()?this.oHeaderContext:null};E.prototype.getModelIndex=function(e){if(!this.bFirstCreateAtEnd){return e}if(!this.bLengthFinal){return this.aContexts.length-e-1}return e<this.getLength()-this.iCreatedContexts?e+this.iCreatedContexts:this.getLength()-e-1};E.prototype.getKeepAliveContext=function(t,i,n){var r=this.mPreviousContextsByPath[t]||this.aContexts.find(function(e){return e&&e.getPath()===t}),o=this.oModel.getPredicateIndex(t),a=this.getResolvedPath();this.checkSuspended();this.oModel.checkGroupId(n);if(!r){if(!a){throw new Error("Binding is unresolved: "+this)}if(t.slice(0,o)!==a){throw new Error(this+": Not a valid context path: "+t)}r=e.create(this.oModel,this,t);this.mPreviousContextsByPath[t]=r;this.oCachePromise.then(function(e){var i=e.createEmptyElement(t.slice(o));if(n){s.setPrivateAnnotation(i,"groupId",n)}});this.oModel.getMetaModel().requestObject(s.getMetaPath(a)+"/").then(function(e){return r.requestProperty(e.$Key.map(function(e){return typeof e==="object"?Object.values(e)[0]:e}))}).catch(this.oModel.getReporter())}r.setKeepAlive(true,r.fnOnBeforeDestroy,i);return r};E.prototype.getLength=function(){if(this.bLengthFinal){return this.iMaxLength+this.iCreatedContexts}return this.aContexts.length?this.aContexts.length+10:0};E.prototype.getOrderby=function(e){var t=[],i=this;this.aSorters.forEach(function(e){if(e instanceof v){t.push(e.sPath+(e.bDescending?" desc":""))}else{throw new Error("Unsupported sorter: "+e+" - "+i)}});if(e){t.push(e)}return t.join(",")};E.prototype.getQueryOptions=function(e){var t={},i=this;if(e){throw new Error("Unsupported parameter value: bWithSystemQueryOptions: "+e)}Object.keys(this.mQueryOptions).forEach(function(e){if(e[0]!=="$"){t[e]=s.clone(i.mQueryOptions[e])}});return t};E.prototype.getQueryOptionsFromParameters=function(){return this.mQueryOptions};E.prototype.hasPendingChangesForPath=function(e){if(this.oCache===undefined){return this.iActiveContexts>0}return t.prototype.hasPendingChangesForPath.apply(this,arguments)};E.prototype.inheritQueryOptions=function(e,t){var i;if(!Object.keys(this.mParameters).length){i=this.getQueryOptionsForPath("",t);if(e.$orderby&&i.$orderby){e.$orderby+=","+i.$orderby}if(e.$filter&&i.$filter){e.$filter="("+e.$filter+") and ("+i.$filter+")"}e=Object.assign({},i,e);s.aggregateExpandSelect(e,i)}return e};E.prototype.initialize=function(){if(this.isResolved()){if(this.getRootBinding().isSuspended()){this.sResumeChangeReason=this.sChangeReason==="AddVirtualContext"?c.Change:c.Refresh}else if(this.sChangeReason==="AddVirtualContext"){this._fireChange({detailedReason:"AddVirtualContext",reason:c.Change})}else{this.sChangeReason=c.Refresh;this._fireRefresh({reason:c.Refresh})}}};E.prototype.isFirstCreateAtEnd=function(){return this.bFirstCreateAtEnd};E.prototype.isKeepAliveBindingFor=function(e){return this.mParameters.$$getKeepAliveContext&&this.getResolvedPath()===e&&(!this.isRootBindingSuspended()||this.aContexts.length||Object.keys(this.mPreviousContextsByPath).length)};E.prototype.isLengthFinal=function(){return this.bLengthFinal};E.prototype.refreshInternal=function(e,t,i,n){var r=this;function o(i){return i.map(function(i){if(i.bIsBeingDestroyed||i.getContext().isKeepAlive()&&i.hasPendingChanges()){return}return i.refreshInternal(e,t,false,n)})}if(this.isRootBindingSuspended()){this.refreshSuspended(t);this.bRefreshKeptElements=true;return d.all(o(r.getDependentBindings()))}this.createReadGroupLock(t,this.isRoot());return this.oCachePromise.then(function(i){var s=r.iActiveContexts,a=r.iCreatedContexts,h=r.aContexts.slice(0,a),u,f,l=r.oRefreshPromise;if(i&&!l){r.removeCachesAndMessages(e);r.fetchCache(r.oContext,false,true,n?t:undefined);f=r.refreshKeptElements(t);if(r.iCurrentEnd>0){l=r.createRefreshPromise().catch(function(e){if(!n||e.canceled){throw e}return r.fetchResourcePath(r.oContext).then(function(t){var n;if(!r.bRelative||i.getResourcePath()===t){if(r.oCache===i){i.restore(true)}else{i.setActive(true);r.oCache=i;r.oCachePromise=d.resolve(i)}r.iActiveContexts=s;r.iCreatedContexts=a;for(n=0;n<a;n+=1){h[n].iIndex=n-a;delete r.mPreviousContextsByPath[h[n].getPath()]}r.aContexts=h;r._fireChange({reason:c.Change})}throw e})}).finally(function(){if(i.restore){i.restore(false)}})}}u=r.getDependentBindings();r.reset(c.Refresh,n?false:undefined,t);return d.all(o(u).concat(l,f)).then(function(){return r.oHeaderContext.checkUpdateInternal()})})};E.prototype.refreshKeptElements=function(e){var t=this;return this.oCachePromise.then(function(i){return i.refreshKeptElements(t.lockGroup(e),function e(i,n){if(n===undefined){t.mPreviousContextsByPath[t.getResolvedPath()+i].resetKeepAlive()}else{t.destroyCreated(t.aContexts[n])}})}).catch(function(e){t.oModel.reportError("Failed to refresh kept-alive elements",m,e);throw e})};E.prototype.refreshSingle=function(e,t,i){var n=e.getPath(),r=n.slice(1),o=this;if(e===this.oHeaderContext){throw new Error("Unsupported header context: "+e)}return this.withCache(function(a,h,u){var f=false,l=false,p=e.isKeepAlive(),g=s.getRelativePath(n,o.oHeaderContext.getPath()),C=[];function x(e){if(f){o.fireDataReceived(e)}}function v(){f=true;o.fireDataRequested()}function y(t){var i=e.getModelIndex(),r;if(e.created()){o.destroyCreated(e);l=true}else{if(i===undefined){delete o.mPreviousContextsByPath[n]}else{o.aContexts.splice(i,1);o.iMaxLength-=1;for(r=i;r<o.aContexts.length;r+=1){if(o.aContexts[r]){o.aContexts[r].iIndex-=1}}if(t){o.mPreviousContextsByPath[n]=e}}if(!t){l=true;e.destroy()}}if(i!==undefined){o._fireChange({reason:c.Remove})}}C.push((i?a.refreshSingleWithRemove(t,h,e.getModelIndex(),g,p,v,y):a.refreshSingle(t,h,e.getModelIndex(),g,p,v)).then(function(){var n=[];x({data:{}});u.assertSameCache(a);if(!l){n.push(e.checkUpdateInternal());if(i){n.push(e.refreshDependentBindings(r,t.getGroupId()))}}return d.all(n)},function(e){x({error:e});throw e}).catch(function(i){t.unlock(true);o.oModel.reportError("Failed to refresh entity: "+e,m,i);if(!i.canceled){throw i}}));if(!i){C.push(e.refreshDependentBindings(r,t.getGroupId()))}return d.all(C)})};E.prototype.requestContexts=function(e,t,i){var n=this;if(!this.isResolved()){throw new Error("Unresolved binding: "+this.sPath)}this.checkSuspended();this.oModel.checkGroupId(i);e=e||0;t=t||this.oModel.iSizeLimit;return Promise.resolve(this.fetchContexts(e,t,0,this.lockGroup(i,true))).then(function(i){if(i){n._fireChange({reason:c.Change})}return n.getContextsInViewOrder(e,t)},function(i){n.oModel.reportError("Failed to get contexts for "+n.oModel.sServiceUrl+n.getResolvedPath().slice(1)+" with start index "+e+" and length "+t,m,i);throw i})};E.prototype.requestDownloadUrl=s.createRequestMethod("fetchDownloadUrl");E.prototype.requestFilterForMessages=function(e){var t=this.oModel.getMetaModel(),i,n=this.oHeaderContext&&this.oHeaderContext.getPath(),r=this;if(!n){return Promise.resolve(null)}i=s.getMetaPath(n);return t.requestObject(i+"/").then(function(o){var s,a={};r.oModel.getMessagesByPath(n,true).filter(function(t){return!e||e(t)}).forEach(function(e){e.getTargets().forEach(function(e){var t=e.slice(n.length).split("/")[0];if(t&&!t.startsWith("($uid=")){a[t]=true}})});s=Object.keys(a).map(function(e){return E.getFilterForPredicate(e,o,t,i)});if(s.length===0){return null}return s.length===1?s[0]:new l({filters:s})})};E.prototype.requestSideEffects=function(e,t,i){var r,o,s=this.oModel,a={},h,u,f=this.oHeaderContext.getPath().length,c=i&&i!==this.oHeaderContext,l=this;function p(e){return e.catch(function(e){s.reportError("Failed to request side effects",m,e);if(!e.canceled){throw e}})}if(this.mParameters.$$aggregation){if(c){throw new Error("Must not request side effects for a context of a binding with $$aggregation")}if(n.isAffected(this.mParameters.$$aggregation,this.aFilters.concat(this.aApplicationFilters),t)){return this.refreshInternal("",e,false,true)}return d.resolve()}if(t.indexOf("")<0){if(c){r=[i]}else{r=this.getCurrentContexts().filter(function(e){return!e.isTransient()});Object.keys(this.mPreviousContextsByPath).forEach(function(e){var t=l.mPreviousContextsByPath[e];if(t.isKeepAlive()){r.push(t)}})}h=r.map(function(e){return e.getPath().slice(f)});o=h.some(function(e){return e[0]!=="("});if(!o){u=this.oCache?[this.oCache.requestSideEffects(this.lockGroup(e),t,a,h,c)]:[];this.visitSideEffects(e,t,c?i:undefined,a,u);return d.all(u.map(p)).then(function(){return l.refreshDependentListBindingsWithoutCache()})}}if(c){return this.refreshSingle(i,this.lockGroup(e),false)}if(this.iCurrentEnd===0){return d.resolve()}return this.refreshInternal("",e,false,true)};E.prototype.reset=function(e,t,i){var n,r=0,o=this.iCurrentEnd===0,s=i&&i!==this.getUpdateGroupId(),a,h=this;if(t===true){this.iActiveContexts=0;this.iCreatedContexts=0}if(this.aContexts){this.aContexts.slice(this.iCreatedContexts).forEach(function(e){h.mPreviousContextsByPath[e.getPath()]=e});for(a=0;a<this.iCreatedContexts;a+=1){n=this.aContexts[a];if(t===false?s&&n.isTransient()||n.isInactive()!==undefined:n.isTransient()){this.aContexts[r]=n;r+=1}else{this.iActiveContexts-=1;this.mPreviousContextsByPath[n.getPath()]=n}}for(a=0;a<r;a+=1){this.aContexts[a].iIndex=a-r}this.aContexts.length=this.iCreatedContexts=r}else{this.aContexts=[]}if(!this.iCreatedContexts){this.bFirstCreateAtEnd=undefined}this.iCurrentBegin=this.iCurrentEnd=0;this.iMaxLength=Infinity;this.bLengthFinal=false;if(e&&!(o&&e===c.Change)){this.sChangeReason=e;this._fireRefresh({reason:e})}};E.prototype.resetKeepAlive=function(){var e=this.mPreviousContextsByPath;function t(e){if(e.isKeepAlive()){e.resetKeepAlive()}}Object.keys(e).forEach(function(i){t(e[i])});this.aContexts.forEach(t)};E.prototype.restoreCreated=function(){var e=this;this.withCache(function(t,i){t.getCreatedElements(i).forEach(function(t,i){e.aContexts[i]=s.getPrivateAnnotation(t,"context");e.bFirstCreateAtEnd=s.getPrivateAnnotation(t,"firstCreateAtEnd");e.iCreatedContexts+=1;if(!t["@$ui5.context.isInactive"]){e.iActiveContexts+=1}})}).catch(this.oModel.getReporter())};E.prototype.resumeInternal=function(e,t){var i=this.getDependentBindings(),n=this.sResumeChangeReason,r=t||n,o=this;this.sResumeChangeReason=undefined;if(r){this.removeCachesAndMessages("");this.reset();this.fetchCache(this.oContext,!t);if(this.bRefreshKeptElements){this.bRefreshKeptElements=false;o.refreshKeptElements(o.getGroupId())}}i.forEach(function(e){e.resumeInternal(!r,!!n&&!e.oContext.isKeepAlive())});if(this.sChangeReason==="AddVirtualContext"){this._fireChange({detailedReason:"AddVirtualContext",reason:n})}else if(n){this._fireRefresh({reason:n})}this.oHeaderContext.checkUpdate()};E.prototype.setAggregation=function(e){var t;function i(e){return e.some(function(e){return e&&e.isKeepAlive()})}if(this.hasPendingChanges()){throw new Error("Cannot set $$aggregation due to pending changes")}if(i(this.aContexts)||i(Object.values(this.mPreviousContextsByPath))){throw new Error("Cannot set $$aggregation due to a kept-alive context")}t=Object.assign({},this.mParameters);if(e===undefined){delete t.$$aggregation}else{t.$$aggregation=s.clone(e);this.resetKeepAlive()}this.applyParameters(t,"")};E.prototype.setContext=function(t){var i;if(this.oContext!==t){if(this.bRelative){this.checkSuspended(true);this.reset(undefined,true);this.resetKeepAlive();this.fetchCache(t);if(t){this.restoreCreated();i=this.oModel.resolve(this.sPath,t);if(this.oHeaderContext&&this.oHeaderContext.getPath()!==i){this.mPreviousContextsByPath[this.oHeaderContext.getPath()]=this.oHeaderContext;this.oHeaderContext=null}if(!this.oHeaderContext){this.oHeaderContext=e.create(this.oModel,this,i)}if(this.bHasPathReductionToParent&&this.oModel.bAutoExpandSelect&&!this.mParameters.$$aggregation){this.sChangeReason="AddVirtualContext"}if(t.getBinding&&t.getBinding().getRootBinding().isSuspended()){this.oContext=t;this.setResumeChangeReason(c.Context);return}}f.prototype.setContext.call(this,t,{detailedReason:this.sChangeReason})}else{this.oContext=t}}};E.prototype.sort=function(e){var t=s.toArray(e);if(this.sOperationMode!==y.Server){throw new Error("Operation mode has to be sap.ui.model.odata.OperationMode.Server")}if(s.deepEqual(t,this.aSorters)){return this}if(this.hasPendingChanges(true)){throw new Error("Cannot sort due to pending changes")}this.aSorters=t;if(this.isRootBindingSuspended()){this.setResumeChangeReason(c.Sort);return this}this.createReadGroupLock(this.getGroupId(),true);this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(c.Sort);if(this.oHeaderContext){this.oHeaderContext.checkUpdate()}return this};E.prototype.updateAnalyticalInfo=function(e){var t={aggregate:{},group:{},search:this.mParameters.$$aggregation&&this.mParameters.$$aggregation.search},i=false,n=this;e.forEach(function(e){var n={};if("total"in e){if("grouped"in e){throw new Error("Both dimension and measure: "+e.name)}if(e.as){n.name=e.name;t.aggregate[e.as]=n}else{t.aggregate[e.name]=n}if(e.min){n.min=true;i=true}if(e.max){n.max=true;i=true}if(e.with){n.with=e.with}}else if(!("grouped"in e)||e.inResult||e.visible){t.group[e.name]=n}});this.bHasAnalyticalInfo=true;this.setAggregation(t);if(i){return{measureRangePromise:Promise.resolve(this.getRootBindingResumePromise().then(function(){return n.oCachePromise}).then(function(e){return e.getMeasureRangePromise()}))}}};E.getFilterForPredicate=function(e,t,i,n){var r,o=a.parseKeyPredicate(e);if(""in o){o[t.$Key[0]]=o[""];delete o[""]}r=t.$Key.map(function(e){var t,r;if(typeof e==="string"){r=t=e}else{t=Object.keys(e)[0];r=e[t]}return new l(r,p.EQ,s.parseLiteral(decodeURIComponent(o[t]),i.getObject(n+"/"+r+"/$Type"),r))});return r.length===1?r[0]:new l({and:true,filters:r})};return E});