(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[0],{"+IrT":function(t,e,i){"use strict";i.d(e,"a",(function(){return h}));var r=i("tJVT"),n=i("PpiC"),s=i("k1fw"),o=i("q1tI"),u=i("wrP+"),a=i("kaPf");class h extends o["Component"]{constructor(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(t),this.undoHistory=void 0,this.undoHistories=new Map,this.isObserverAll=!1,this.configuration=void 0,this.init=()=>{this.undo=this.undo.bind(this),this.undo4target=this.undo4target.bind(this),this.redo=this.redo.bind(this),this.redo4target=this.redo4target.bind(this),this.clear=this.clear.bind(this),this.clear4target=this.clear4target.bind(this),this.jump=this.jump.bind(this),this.jump4target=this.jump4target.bind(this),this.jumpToFuture=this.jumpToFuture.bind(this),this.jumpToFuture4target=this.jumpToFuture4target.bind(this),this.jumpToPast=this.jumpToPast.bind(this),this.jumpToPast4target=this.jumpToPast4target.bind(this),this.noteState=this.noteState.bind(this)},this.originSetState=void 0,this.configuration=Object(s["a"])(Object(s["a"])({},a["c"]),{},{observer:!0},e),this.generateUndoHistory(),this.originSetState=this.setState.bind(this),this.setState=function(t,e){var i,r;this.originSetState(((e,n)=>(i=e,r=t,"function"===typeof t&&(r=t(e,n)),r)),(()=>{this.noteState(r,i),null===e||void 0===e||e()}))},this.init()}generateUndoHistory(){var t=this.configuration,e=t.observer,i=Object(n["a"])(t,["observer"]);!0===e?(this.undoHistory=new u["a"](i),this.isObserverAll=!0):null===e||void 0===e||e.forEach((t=>{this.undoHistories.set(t,new u["a"](i))}))}internalSetState(t,e){t&&"object"===typeof t&&this.originSetState(t,e)}getHistoriesEntry(){var t=this.undoHistories.entries(),e=Array.from(t);return e}historyActionCommon(t,e,i){var n,s;if("function"===typeof e?s=e:"string"===typeof e&&(n=e,s=i),n){var o=this.undoHistories.get(n),u=t(o);return null!==o&&void 0!==o&&o.isActionDataValid(u)&&this.internalSetState({[n]:u},s),u}var a=this.getHistoriesEntry(),h=[],c={};return a.forEach((e=>{var i=Object(r["default"])(e,2),n=i[0],s=i[1],o=t(s);h.push(o),s.isActionDataValid(o)&&(c[n]=o)})),this.internalSetState(c,s),h}noteState(t,e){if(t){var i=this.configuration.observer;this.isObserverAll?this.undoHistory.enqueue(t,e):Object.entries(t).forEach((t=>{var n=Object(r["default"])(t,2),s=n[0],o=n[1],u=e[s];if(i.includes(s)){var a=this.undoHistories.get(s);null===a||void 0===a||a.enqueue(o,u)}}))}}undo4target(t,e){var i=this.historyActionCommon((t=>null===t||void 0===t?void 0:t.undo()),t,e);return i}undo(t){var e,i=null===(e=this.undoHistory)||void 0===e?void 0:e.undo();return this.undoHistory.isActionDataValid(i)&&this.internalSetState(i,t),i}redo4target(t,e){var i=this.historyActionCommon((t=>null===t||void 0===t?void 0:t.redo()),t,e);return i}redo(t){var e,i=null===(e=this.undoHistory)||void 0===e?void 0:e.redo();return this.undoHistory.isActionDataValid(i)&&this.internalSetState(i,t),i}clear4target(t,e){var i=this.historyActionCommon((t=>{var e=null===t||void 0===t?void 0:t.clear();return void 0===e?null===t||void 0===t?void 0:t.state:e}),t,e);return i}clear(t){var e,i=null===(e=this.undoHistory)||void 0===e?void 0:e.clear();return this.undoHistory.isActionDataValid(i)&&this.internalSetState(this.undoHistory.state,t),i}jump4target(t,e,i){var r=this.historyActionCommon((e=>null===e||void 0===e?void 0:e.jump(t)),e,i);return r}jump(t,e){var i,r=null===(i=this.undoHistory)||void 0===i?void 0:i.jump(t);return this.undoHistory.isActionDataValid(r)&&this.internalSetState(r,e),r}jumpToPast4target(t,e,i){var r=this.historyActionCommon((e=>null===e||void 0===e?void 0:e.jumpToPast(t)),e,i);return r}jumpToPast(t,e){var i,r=null===(i=this.undoHistory)||void 0===i?void 0:i.jumpToPast(t);return this.undoHistory.isActionDataValid(r)&&this.internalSetState(r,e),r}jumpToFuture4target(t,e,i){var r=this.historyActionCommon((e=>null===e||void 0===e?void 0:e.jumpToFuture(t)),e,i);return r}jumpToFuture(t,e){var i=this.undoHistory.jumpToFuture(t);return this.undoHistory.isActionDataValid(i)&&this.internalSetState(i,e),i}get history(){return this.isObserverAll?this.undoHistory:this.undoHistories}}},"/7QA":function(t,e,i){"use strict";i.r(e);var r=i("UfWu");for(var n in r)["default"].indexOf(n)<0&&function(t){i.d(e,t,(function(){return r[t]}))}(n)},ClFA:function(t,e){},MoUD:function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var r=i("tJVT"),n=i("q1tI"),s=i("wrP+");function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=Object(n["useState"])(t),o=Object(r["default"])(i,2),u=o[0],a=o[1],h=new s["a"](e),c=Object(n["useCallback"])((t=>{a((e=>{var i;return i="function"===typeof t?t(e):t,h.enqueue(i,e),i}))}),[]),l=t=>{void 0!==t&&h.isActionDataValid(t)&&a(t)},d=Object(n["useCallback"])((()=>{var t=h.undo();return l(t),t}),[]),f=Object(n["useCallback"])((()=>{var t=h.redo();return l(t),t}),[]),p=Object(n["useCallback"])((()=>{var t=h.clear();return l(t||h.state),t}),[]),v=Object(n["useCallback"])((t=>{var e=h.jump(t);return l(e),e}),[]),b=Object(n["useCallback"])((t=>{var e=h.jumpToPast(t);return l(e),e}),[]),g=Object(n["useCallback"])((t=>{var e=h.jumpToFuture(t);return l(e),e}),[]);return Object(n["useEffect"])((()=>{var e="function"===typeof t?t():t;void 0!==e&&h.initState(e)}),[]),[u,c,{undo:d,redo:f,clear:p,jump:v,jumpToFuture:g,jumpToPast:b,history:h}]}},PpiC:function(t,e,i){"use strict";function r(t,e){if(null==t)return{};var i,r,n={},s=Object.keys(t);for(r=0;r<s.length;r++)i=s[r],e.indexOf(i)>=0||(n[i]=t[i]);return n}function n(t,e){if(null==t)return{};var i,n,s=r(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)i=o[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(s[i]=t[i])}return s}i.d(e,"a",(function(){return n}))},UfWu:function(t,e,i){"use strict";i.r(e),i.d(e,"includeFilter",(function(){return a})),i.d(e,"excludeFilter",(function(){return h}));var r=i("kaPf");i.d(e,"ActionTypes",(function(){return r["a"]}));var n=i("ClFA");for(var s in n)["default","Component","useUndo","ActionTypes","includeFilter","excludeFilter"].indexOf(s)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(s);var o=i("+IrT");i.d(e,"Component",(function(){return o["a"]}));var u=i("MoUD");function a(t){return Array.isArray(t)?t:[t]}function h(t){var e=Object.keys(r["a"]),i=Array.isArray(t)?t:[t];return e.filter((t=>!i.includes(t)))}i.d(e,"useUndo",(function(){return u["a"]}))},k1fw:function(t,e,i){"use strict";function r(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function n(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,r)}return i}function s(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?n(Object(i),!0).forEach((function(e){r(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}i.d(e,"a",(function(){return s}))},kaPf:function(t,e,i){"use strict";var r;i.d(e,"a",(function(){return r})),i.d(e,"b",(function(){return n})),i.d(e,"d",(function(){return s})),i.d(e,"c",(function(){return o})),function(t){t["UNDO"]="UNDO",t["REDO"]="REDO",t["JUMP"]="JUMP",t["JUMP_TO_PAST"]="JUMP_TO_PAST",t["JUMP_TO_FUTURE"]="JUMP_TO_FUTURE",t["CLEAR_HISTORY"]="CLEAR_HISTORY",t["ENQUEUE"]="ENQUEUE"}(r||(r={}));var n="__CAN_NOT_DEALING__",s="__DEFAULT_PRESENT_DATA__",o={limit:-1,debug:!1,filter(){return!0}}},"wrP+":function(t,e,i){"use strict";i.d(e,"a",(function(){return a}));var r=i("k1fw"),n=i("PpiC"),s=i("kaPf");class o{constructor(t){this.__DEBUG__=!1,this.displayBuffer={header:[],prev:[],action:[],next:[],msgs:[]},this.colors={prevState:"#9E9E9E",action:"#03A9F4",nextState:"#4CAF50"},this.__DEBUG__=t}initBuffer(){this.displayBuffer={header:[],prev:[],action:[],next:[],msgs:[]}}printBuffer(){var t=this.displayBuffer,e=t.header,i=t.prev,r=t.next,n=t.action,s=t.msgs;console.groupCollapsed(...e),console.log(...i),console.log(...n),console.log(...r),console.log(...s),console.groupEnd()}colorFormat(t,e,i){return["%c".concat(t),"color: ".concat(e,"; font-weight: bold"),i]}start(t,e){this.initBuffer(),this.__DEBUG__&&(this.displayBuffer.header=["%cundo","font-style: italic","action",t.type],this.displayBuffer.action=this.colorFormat("action",this.colors.action,t),this.displayBuffer.prev=this.colorFormat("prev history",this.colors.prevState,e))}end(t){this.__DEBUG__&&(this.displayBuffer.next=this.colorFormat("next history",this.colors.nextState,t),this.printBuffer())}log(){if(this.__DEBUG__){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];this.displayBuffer.msgs=this.displayBuffer.msgs.concat([...e,"\n"])}}}var u=o;class a{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;this.config=void 0,this.future=[],this.past=[],this.present=s["d"],this.debug=void 0,this.initialValue=s["d"],this.commonAction=(t,e,i)=>{if(this.logStart(t),!this.actionCan(t,i))return this.logEnd(),s["b"];var r,o=this.filter(t,(function(){var t=e(...arguments),i=t.returnData,s=Object(n["a"])(t,["returnData"]);return r=i,s}));return this.logEnd(),this.isActionDataValid(o)?r:o},this.config=Object(r["a"])(Object(r["a"])({},s["c"]),t),this.debug=new u(!!this.config.debug),void 0!==e&&this.initState(e)}get state(){return this.present}get history(){return{present:this.present,past:this.past,future:this.future}}isNumber(t){return"number"===typeof t&&!Number.isNaN(t)}logStart(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.debug.start(Object(r["a"])({type:t},e),{past:this.past,present:this.present,future:this.future})}logEnd(){this.debug.end({past:this.past,present:this.present,future:this.future})}isActionDataValid(t){return t!==s["b"]}enqueue(t,e){var i=this.config.limit;this.logStart(s["a"].ENQUEUE),this.debug.log("enqueue the state"),this.debug.log("previous state is: ",e),this.debug.log("target state is: ",t),this.filter(s["a"].ENQUEUE,((r,n,s)=>{var o=t;return~i&&r.length+n.length>=i&&r.shift(),r.push(e),{past:r,future:n,present:o}})),this.logEnd()}filter(t,e){var i=this.config.filter,r=e([...this.past],[...this.future],this.present),n=r.past,o=r.future,u=r.present,a=Array.isArray(i)&&i.includes(t),h="function"===typeof i&&i(t,r,{past:this.past,future:this.future,present:this.present});return a||h||void 0===i?(this.past=n,this.future=o,this.present=u,u):(this.debug.log("the action is not performance because filter"),s["b"])}actionCan(t,e){if("CLEAR_HISTORY"===t)return!0;var i=!1;switch(t){case"JUMP":i=this.isNumber(e)&&0!==e&&e>0?this.future.length>=e:this.past.length>=-1*e;break;case"REDO":i=this.future.length>=1;break;case"UNDO":i=this.past.length>=1;break;case"JUMP_TO_FUTURE":i=this.isNumber(e)&&e>=0&&this.future.length>e;break;case"JUMP_TO_PAST":i=this.isNumber(e)&&e>=0&&this.past.length>e;break}return i||this.debug.log("action fail"),i}initState(t,e){this.initialValue=t,e||(this.present=t)}undo(){return this.commonAction(s["a"].UNDO,this.internalJump.bind(this,-1))}redo(){return this.commonAction(s["a"].REDO,this.internalJump.bind(this,1))}clear(){this.logStart(s["a"].CLEAR_HISTORY);var t=this.filter(s["a"].CLEAR_HISTORY,(()=>({past:[],future:[],present:this.initialValue})));return this.logEnd(),this.isActionDataValid(t)?void 0:s["b"]}jump(t){return this.commonAction(s["a"].JUMP,this.internalJump.bind(this,t),t)}jumpToPast(t){return this.commonAction(s["a"].JUMP_TO_PAST,this.internalJumpToPast.bind(this,t),t)}jumpToFuture(t){return this.commonAction(s["a"].JUMP_TO_FUTURE,this.internalJumpToFuture.bind(this,t),t)}internalJumpToPast(t,e,i,r){var n=e.slice(0,t),s=[...e.slice(t+1),r,...i],o=e[t];return{past:n,future:s,present:o,returnData:o}}internalJumpToFuture(t,e,i,r){var n=[...e,r,...i.slice(0,t)],s=i[t],o=i.slice(t+1);return{past:n,future:o,present:s,returnData:s}}internalJump(t,e,i,r){var n,s,o=0;return t>0?(s=this.internalJumpToFuture,o=t-1):t<0&&(s=this.internalJumpToPast,o=e.length+t),(null===(n=s)||void 0===n?void 0:n(o,e,i,r))||{past:e,future:i,present:r,returnData:r}}}}}]);