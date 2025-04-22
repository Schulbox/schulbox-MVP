import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration
} from "/build/_shared/chunk-Y4EOPFD3.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  createHotContext
} from "/build/_shared/chunk-FJUA326G.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:~/lib/supabase.server
var require_supabase = __commonJS({
  "empty-module:~/lib/supabase.server"(exports, module) {
    module.exports = {};
  }
});

// app/root.tsx
var import_node = __toESM(require_node(), 1);
var import_supabase = __toESM(require_supabase(), 1);

// app/components/Header.tsx
var import_react13 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/env.js
var i = Object.defineProperty;
var d = (t5, e, n3) => e in t5 ? i(t5, e, { enumerable: true, configurable: true, writable: true, value: n3 }) : t5[e] = n3;
var r = (t5, e, n3) => (d(t5, typeof e != "symbol" ? e + "" : e, n3), n3);
var o = class {
  constructor() {
    r(this, "current", this.detect());
    r(this, "handoffState", "pending");
    r(this, "currentId", 0);
  }
  set(e) {
    this.current !== e && (this.handoffState = "pending", this.currentId = 0, this.current = e);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
};
var s = new o();

// node_modules/@headlessui/react/dist/hooks/use-disposables.js
var import_react = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/micro-task.js
function t(e) {
  typeof queueMicrotask == "function" ? queueMicrotask(e) : Promise.resolve().then(e).catch((o5) => setTimeout(() => {
    throw o5;
  }));
}

// node_modules/@headlessui/react/dist/utils/disposables.js
function o2() {
  let n3 = [], r5 = { addEventListener(e, t5, s5, a2) {
    return e.addEventListener(t5, s5, a2), r5.add(() => e.removeEventListener(t5, s5, a2));
  }, requestAnimationFrame(...e) {
    let t5 = requestAnimationFrame(...e);
    return r5.add(() => cancelAnimationFrame(t5));
  }, nextFrame(...e) {
    return r5.requestAnimationFrame(() => r5.requestAnimationFrame(...e));
  }, setTimeout(...e) {
    let t5 = setTimeout(...e);
    return r5.add(() => clearTimeout(t5));
  }, microTask(...e) {
    let t5 = { current: true };
    return t(() => {
      t5.current && e[0]();
    }), r5.add(() => {
      t5.current = false;
    });
  }, style(e, t5, s5) {
    let a2 = e.style.getPropertyValue(t5);
    return Object.assign(e.style, { [t5]: s5 }), this.add(() => {
      Object.assign(e.style, { [t5]: a2 });
    });
  }, group(e) {
    let t5 = o2();
    return e(t5), this.add(() => t5.dispose());
  }, add(e) {
    return n3.includes(e) || n3.push(e), () => {
      let t5 = n3.indexOf(e);
      if (t5 >= 0)
        for (let s5 of n3.splice(t5, 1))
          s5();
    };
  }, dispose() {
    for (let e of n3.splice(0))
      e();
  } };
  return r5;
}

// node_modules/@headlessui/react/dist/hooks/use-disposables.js
function p() {
  let [e] = (0, import_react.useState)(o2);
  return (0, import_react.useEffect)(() => () => e.dispose(), [e]), e;
}

// node_modules/@headlessui/react/dist/hooks/use-event.js
var import_react4 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-latest-value.js
var import_react3 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js
var import_react2 = __toESM(require_react(), 1);
var n = (e, t5) => {
  s.isServer ? (0, import_react2.useEffect)(e, t5) : (0, import_react2.useLayoutEffect)(e, t5);
};

// node_modules/@headlessui/react/dist/hooks/use-latest-value.js
function s3(e) {
  let r5 = (0, import_react3.useRef)(e);
  return n(() => {
    r5.current = e;
  }, [e]), r5;
}

// node_modules/@headlessui/react/dist/hooks/use-event.js
var o4 = function(t5) {
  let e = s3(t5);
  return import_react4.default.useCallback((...r5) => e.current(...r5), [e]);
};

// node_modules/@headlessui/react/dist/utils/render.js
var import_react5 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/class-names.js
function t3(...r5) {
  return Array.from(new Set(r5.flatMap((n3) => typeof n3 == "string" ? n3.split(" ") : []))).filter(Boolean).join(" ");
}

// node_modules/@headlessui/react/dist/utils/match.js
function u(r5, n3, ...a2) {
  if (r5 in n3) {
    let e = n3[r5];
    return typeof e == "function" ? e(...a2) : e;
  }
  let t5 = new Error(`Tried to handle "${r5}" but there is no handler defined. Only defined handlers are: ${Object.keys(n3).map((e) => `"${e}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t5, u), t5;
}

// node_modules/@headlessui/react/dist/utils/render.js
var O = ((a2) => (a2[a2.None = 0] = "None", a2[a2.RenderStrategy = 1] = "RenderStrategy", a2[a2.Static = 2] = "Static", a2))(O || {});
var A = ((e) => (e[e.Unmount = 0] = "Unmount", e[e.Hidden = 1] = "Hidden", e))(A || {});
function L() {
  let n3 = U();
  return (0, import_react5.useCallback)((r5) => C({ mergeRefs: n3, ...r5 }), [n3]);
}
function C({ ourProps: n3, theirProps: r5, slot: e, defaultTag: a2, features: s5, visible: t5 = true, name: l4, mergeRefs: i4 }) {
  i4 = i4 != null ? i4 : $;
  let o5 = P(r5, n3);
  if (t5)
    return F(o5, e, a2, l4, i4);
  let y2 = s5 != null ? s5 : 0;
  if (y2 & 2) {
    let { static: f3 = false, ...u4 } = o5;
    if (f3)
      return F(u4, e, a2, l4, i4);
  }
  if (y2 & 1) {
    let { unmount: f3 = true, ...u4 } = o5;
    return u(f3 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return F({ ...u4, hidden: true, style: { display: "none" } }, e, a2, l4, i4);
    } });
  }
  return F(o5, e, a2, l4, i4);
}
function F(n3, r5 = {}, e, a2, s5) {
  let { as: t5 = e, children: l4, refName: i4 = "ref", ...o5 } = h(n3, ["unmount", "static"]), y2 = n3.ref !== void 0 ? { [i4]: n3.ref } : {}, f3 = typeof l4 == "function" ? l4(r5) : l4;
  "className" in o5 && o5.className && typeof o5.className == "function" && (o5.className = o5.className(r5)), o5["aria-labelledby"] && o5["aria-labelledby"] === o5.id && (o5["aria-labelledby"] = void 0);
  let u4 = {};
  if (r5) {
    let d3 = false, p2 = [];
    for (let [c6, T2] of Object.entries(r5))
      typeof T2 == "boolean" && (d3 = true), T2 === true && p2.push(c6.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`));
    if (d3) {
      u4["data-headlessui-state"] = p2.join(" ");
      for (let c6 of p2)
        u4[`data-${c6}`] = "";
    }
  }
  if (t5 === import_react5.Fragment && (Object.keys(m(o5)).length > 0 || Object.keys(m(u4)).length > 0))
    if (!(0, import_react5.isValidElement)(f3) || Array.isArray(f3) && f3.length > 1) {
      if (Object.keys(m(o5)).length > 0)
        throw new Error(['Passing props on "Fragment"!', "", `The current component <${a2} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(m(o5)).concat(Object.keys(m(u4))).map((d3) => `  - ${d3}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((d3) => `  - ${d3}`).join(`
`)].join(`
`));
    } else {
      let d3 = f3.props, p2 = d3 == null ? void 0 : d3.className, c6 = typeof p2 == "function" ? (...R2) => t3(p2(...R2), o5.className) : t3(p2, o5.className), T2 = c6 ? { className: c6 } : {}, g = P(f3.props, m(h(o5, ["ref"])));
      for (let R2 in u4)
        R2 in g && delete u4[R2];
      return (0, import_react5.cloneElement)(f3, Object.assign({}, g, u4, y2, { ref: s5(H(f3), y2.ref) }, T2));
    }
  return (0, import_react5.createElement)(t5, Object.assign({}, h(o5, ["ref"]), t5 !== import_react5.Fragment && y2, t5 !== import_react5.Fragment && u4), f3);
}
function U() {
  let n3 = (0, import_react5.useRef)([]), r5 = (0, import_react5.useCallback)((e) => {
    for (let a2 of n3.current)
      a2 != null && (typeof a2 == "function" ? a2(e) : a2.current = e);
  }, []);
  return (...e) => {
    if (!e.every((a2) => a2 == null))
      return n3.current = e, r5;
  };
}
function $(...n3) {
  return n3.every((r5) => r5 == null) ? void 0 : (r5) => {
    for (let e of n3)
      e != null && (typeof e == "function" ? e(r5) : e.current = r5);
  };
}
function P(...n3) {
  var a2;
  if (n3.length === 0)
    return {};
  if (n3.length === 1)
    return n3[0];
  let r5 = {}, e = {};
  for (let s5 of n3)
    for (let t5 in s5)
      t5.startsWith("on") && typeof s5[t5] == "function" ? ((a2 = e[t5]) != null || (e[t5] = []), e[t5].push(s5[t5])) : r5[t5] = s5[t5];
  if (r5.disabled || r5["aria-disabled"])
    for (let s5 in e)
      /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s5) && (e[s5] = [(t5) => {
        var l4;
        return (l4 = t5 == null ? void 0 : t5.preventDefault) == null ? void 0 : l4.call(t5);
      }]);
  for (let s5 in e)
    Object.assign(r5, { [s5](t5, ...l4) {
      let i4 = e[s5];
      for (let o5 of i4) {
        if ((t5 instanceof Event || (t5 == null ? void 0 : t5.nativeEvent) instanceof Event) && t5.defaultPrevented)
          return;
        o5(t5, ...l4);
      }
    } });
  return r5;
}
function K(n3) {
  var r5;
  return Object.assign((0, import_react5.forwardRef)(n3), { displayName: (r5 = n3.displayName) != null ? r5 : n3.name });
}
function m(n3) {
  let r5 = Object.assign({}, n3);
  for (let e in r5)
    r5[e] === void 0 && delete r5[e];
  return r5;
}
function h(n3, r5 = []) {
  let e = Object.assign({}, n3);
  for (let a2 of r5)
    a2 in e && delete e[a2];
  return e;
}
function H(n3) {
  return import_react5.default.version.split(".")[0] >= "19" ? n3.props.ref : n3.ref;
}

// node_modules/@headlessui/react/dist/hooks/use-sync-refs.js
var import_react6 = __toESM(require_react(), 1);
var u2 = Symbol();
function y(...t5) {
  let n3 = (0, import_react6.useRef)(t5);
  (0, import_react6.useEffect)(() => {
    n3.current = t5;
  }, [t5]);
  let c6 = o4((e) => {
    for (let o5 of n3.current)
      o5 != null && (typeof o5 == "function" ? o5(e) : o5.current = e);
  });
  return t5.every((e) => e == null || (e == null ? void 0 : e[u2])) ? void 0 : c6;
}

// node_modules/@headlessui/react/dist/hooks/use-transition.js
var import_react8 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-flags.js
var import_react7 = __toESM(require_react(), 1);
function c2(u4 = 0) {
  let [t5, l4] = (0, import_react7.useState)(u4), g = (0, import_react7.useCallback)((e) => l4(e), [t5]), s5 = (0, import_react7.useCallback)((e) => l4((a2) => a2 | e), [t5]), m2 = (0, import_react7.useCallback)((e) => (t5 & e) === e, [t5]), n3 = (0, import_react7.useCallback)((e) => l4((a2) => a2 & ~e), [l4]), F2 = (0, import_react7.useCallback)((e) => l4((a2) => a2 ^ e), [l4]);
  return { flags: t5, setFlag: g, addFlag: s5, hasFlag: m2, removeFlag: n3, toggleFlag: F2 };
}

// node_modules/@headlessui/react/dist/hooks/use-transition.js
var T;
var b3;
typeof process != "undefined" && typeof globalThis != "undefined" && typeof Element != "undefined" && ((T = process == null ? void 0 : process.env) == null ? void 0 : T["NODE_ENV"]) === "test" && typeof ((b3 = Element == null ? void 0 : Element.prototype) == null ? void 0 : b3.getAnimations) == "undefined" && (Element.prototype.getAnimations = function() {
  return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.", "Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.", "", "Example usage:", "```js", "import { mockAnimationsApi } from 'jsdom-testing-mocks'", "mockAnimationsApi()", "```"].join(`
`)), [];
});
var L2 = ((r5) => (r5[r5.None = 0] = "None", r5[r5.Closed = 1] = "Closed", r5[r5.Enter = 2] = "Enter", r5[r5.Leave = 4] = "Leave", r5))(L2 || {});
function R(t5) {
  let n3 = {};
  for (let e in t5)
    t5[e] === true && (n3[`data-${e}`] = "");
  return n3;
}
function x2(t5, n3, e, i4) {
  let [r5, o5] = (0, import_react8.useState)(e), { hasFlag: s5, addFlag: a2, removeFlag: l4 } = c2(t5 && r5 ? 3 : 0), u4 = (0, import_react8.useRef)(false), f3 = (0, import_react8.useRef)(false), E2 = p();
  return n(() => {
    var d3;
    if (t5) {
      if (e && o5(true), !n3) {
        e && a2(3);
        return;
      }
      return (d3 = i4 == null ? void 0 : i4.start) == null || d3.call(i4, e), C2(n3, { inFlight: u4, prepare() {
        f3.current ? f3.current = false : f3.current = u4.current, u4.current = true, !f3.current && (e ? (a2(3), l4(4)) : (a2(4), l4(2)));
      }, run() {
        f3.current ? e ? (l4(3), a2(4)) : (l4(4), a2(3)) : e ? l4(1) : a2(1);
      }, done() {
        var p2;
        f3.current && typeof n3.getAnimations == "function" && n3.getAnimations().length > 0 || (u4.current = false, l4(7), e || o5(false), (p2 = i4 == null ? void 0 : i4.end) == null || p2.call(i4, e));
      } });
    }
  }, [t5, e, n3, E2]), t5 ? [r5, { closed: s5(1), enter: s5(2), leave: s5(4), transition: s5(2) || s5(4) }] : [e, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }];
}
function C2(t5, { prepare: n3, run: e, done: i4, inFlight: r5 }) {
  let o5 = o2();
  return j2(t5, { prepare: n3, inFlight: r5 }), o5.nextFrame(() => {
    e(), o5.requestAnimationFrame(() => {
      o5.add(M(t5, i4));
    });
  }), o5.dispose;
}
function M(t5, n3) {
  var o5, s5;
  let e = o2();
  if (!t5)
    return e.dispose;
  let i4 = false;
  e.add(() => {
    i4 = true;
  });
  let r5 = (s5 = (o5 = t5.getAnimations) == null ? void 0 : o5.call(t5).filter((a2) => a2 instanceof CSSTransition)) != null ? s5 : [];
  return r5.length === 0 ? (n3(), e.dispose) : (Promise.allSettled(r5.map((a2) => a2.finished)).then(() => {
    i4 || n3();
  }), e.dispose);
}
function j2(t5, { inFlight: n3, prepare: e }) {
  if (n3 != null && n3.current) {
    e();
    return;
  }
  let i4 = t5.style.transition;
  t5.style.transition = "none", e(), t5.offsetHeight, t5.style.transition = i4;
}

// node_modules/@headlessui/react/dist/internal/open-closed.js
var import_react9 = __toESM(require_react(), 1);
var n2 = (0, import_react9.createContext)(null);
n2.displayName = "OpenClosedContext";
var i3 = ((e) => (e[e.Open = 1] = "Open", e[e.Closed = 2] = "Closed", e[e.Closing = 4] = "Closing", e[e.Opening = 8] = "Opening", e))(i3 || {});
function u3() {
  return (0, import_react9.useContext)(n2);
}
function c4({ value: o5, children: t5 }) {
  return import_react9.default.createElement(n2.Provider, { value: o5 }, t5);
}

// node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js
var t4 = __toESM(require_react(), 1);
function s4() {
  let r5 = typeof document == "undefined";
  return "useSyncExternalStore" in t4 ? ((o5) => o5.useSyncExternalStore)(t4)(() => () => {
  }, () => false, () => !r5) : false;
}
function l3() {
  let r5 = s4(), [e, n3] = t4.useState(s.isHandoffComplete);
  return e && s.isHandoffComplete === false && n3(false), t4.useEffect(() => {
    e !== true && n3(true);
  }, [e]), t4.useEffect(() => s.handoff(), []), r5 ? false : e;
}

// node_modules/@headlessui/react/dist/hooks/use-is-mounted.js
var import_react10 = __toESM(require_react(), 1);
function f2() {
  let e = (0, import_react10.useRef)(false);
  return n(() => (e.current = true, () => {
    e.current = false;
  }), []), e;
}

// node_modules/@headlessui/react/dist/components/transition/transition.js
var import_react11 = __toESM(require_react(), 1);
"use client";
function ue(e) {
  var t5;
  return !!(e.enter || e.enterFrom || e.enterTo || e.leave || e.leaveFrom || e.leaveTo) || ((t5 = e.as) != null ? t5 : de) !== import_react11.Fragment || import_react11.default.Children.count(e.children) === 1;
}
var w2 = (0, import_react11.createContext)(null);
w2.displayName = "TransitionContext";
var _e = ((n3) => (n3.Visible = "visible", n3.Hidden = "hidden", n3))(_e || {});
function De() {
  let e = (0, import_react11.useContext)(w2);
  if (e === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
function He() {
  let e = (0, import_react11.useContext)(M2);
  if (e === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
var M2 = (0, import_react11.createContext)(null);
M2.displayName = "NestingContext";
function U2(e) {
  return "children" in e ? U2(e.children) : e.current.filter(({ el: t5 }) => t5.current !== null).filter(({ state: t5 }) => t5 === "visible").length > 0;
}
function Te(e, t5) {
  let n3 = s3(e), l4 = (0, import_react11.useRef)([]), S3 = f2(), R2 = p(), d3 = o4((o5, i4 = A.Hidden) => {
    let a2 = l4.current.findIndex(({ el: s5 }) => s5 === o5);
    a2 !== -1 && (u(i4, { [A.Unmount]() {
      l4.current.splice(a2, 1);
    }, [A.Hidden]() {
      l4.current[a2].state = "hidden";
    } }), R2.microTask(() => {
      var s5;
      !U2(l4) && S3.current && ((s5 = n3.current) == null || s5.call(n3));
    }));
  }), y2 = o4((o5) => {
    let i4 = l4.current.find(({ el: a2 }) => a2 === o5);
    return i4 ? i4.state !== "visible" && (i4.state = "visible") : l4.current.push({ el: o5, state: "visible" }), () => d3(o5, A.Unmount);
  }), C3 = (0, import_react11.useRef)([]), p2 = (0, import_react11.useRef)(Promise.resolve()), h2 = (0, import_react11.useRef)({ enter: [], leave: [] }), g = o4((o5, i4, a2) => {
    C3.current.splice(0), t5 && (t5.chains.current[i4] = t5.chains.current[i4].filter(([s5]) => s5 !== o5)), t5 == null || t5.chains.current[i4].push([o5, new Promise((s5) => {
      C3.current.push(s5);
    })]), t5 == null || t5.chains.current[i4].push([o5, new Promise((s5) => {
      Promise.all(h2.current[i4].map(([r5, f3]) => f3)).then(() => s5());
    })]), i4 === "enter" ? p2.current = p2.current.then(() => t5 == null ? void 0 : t5.wait.current).then(() => a2(i4)) : a2(i4);
  }), v2 = o4((o5, i4, a2) => {
    Promise.all(h2.current[i4].splice(0).map(([s5, r5]) => r5)).then(() => {
      var s5;
      (s5 = C3.current.shift()) == null || s5();
    }).then(() => a2(i4));
  });
  return (0, import_react11.useMemo)(() => ({ children: l4, register: y2, unregister: d3, onStart: g, onStop: v2, wait: p2, chains: h2 }), [y2, d3, l4, g, v2, h2, p2]);
}
var de = import_react11.Fragment;
var fe = O.RenderStrategy;
function Ae(e, t5) {
  var ee, te;
  let { transition: n3 = true, beforeEnter: l4, afterEnter: S3, beforeLeave: R2, afterLeave: d3, enter: y2, enterFrom: C3, enterTo: p2, entered: h2, leave: g, leaveFrom: v2, leaveTo: o5, ...i4 } = e, [a2, s5] = (0, import_react11.useState)(null), r5 = (0, import_react11.useRef)(null), f3 = ue(e), j3 = y(...f3 ? [r5, t5, s5] : t5 === null ? [] : [t5]), H2 = (ee = i4.unmount) == null || ee ? A.Unmount : A.Hidden, { show: u4, appear: z, initial: K2 } = De(), [m2, G] = (0, import_react11.useState)(u4 ? "visible" : "hidden"), Q = He(), { register: A2, unregister: I } = Q;
  n(() => A2(r5), [A2, r5]), n(() => {
    if (H2 === A.Hidden && r5.current) {
      if (u4 && m2 !== "visible") {
        G("visible");
        return;
      }
      return u(m2, { ["hidden"]: () => I(r5), ["visible"]: () => A2(r5) });
    }
  }, [m2, r5, A2, I, u4, H2]);
  let B = l3();
  n(() => {
    if (f3 && B && m2 === "visible" && r5.current === null)
      throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [r5, m2, B, f3]);
  let ce = K2 && !z, Y = z && u4 && K2, W = (0, import_react11.useRef)(false), L3 = Te(() => {
    W.current || (G("hidden"), I(r5));
  }, Q), Z = o4((k2) => {
    W.current = true;
    let F2 = k2 ? "enter" : "leave";
    L3.onStart(r5, F2, (_) => {
      _ === "enter" ? l4 == null || l4() : _ === "leave" && (R2 == null || R2());
    });
  }), $2 = o4((k2) => {
    let F2 = k2 ? "enter" : "leave";
    W.current = false, L3.onStop(r5, F2, (_) => {
      _ === "enter" ? S3 == null || S3() : _ === "leave" && (d3 == null || d3());
    }), F2 === "leave" && !U2(L3) && (G("hidden"), I(r5));
  });
  (0, import_react11.useEffect)(() => {
    f3 && n3 || (Z(u4), $2(u4));
  }, [u4, f3, n3]);
  let pe = (() => !(!n3 || !f3 || !B || ce))(), [, T2] = x2(pe, a2, u4, { start: Z, end: $2 }), Ce = m({ ref: j3, className: ((te = t3(i4.className, Y && y2, Y && C3, T2.enter && y2, T2.enter && T2.closed && C3, T2.enter && !T2.closed && p2, T2.leave && g, T2.leave && !T2.closed && v2, T2.leave && T2.closed && o5, !T2.transition && u4 && h2)) == null ? void 0 : te.trim()) || void 0, ...R(T2) }), N = 0;
  m2 === "visible" && (N |= i3.Open), m2 === "hidden" && (N |= i3.Closed), u4 && m2 === "hidden" && (N |= i3.Opening), !u4 && m2 === "visible" && (N |= i3.Closing);
  let he = L();
  return import_react11.default.createElement(M2.Provider, { value: L3 }, import_react11.default.createElement(c4, { value: N }, he({ ourProps: Ce, theirProps: i4, defaultTag: de, features: fe, visible: m2 === "visible", name: "Transition.Child" })));
}
function Ie(e, t5) {
  let { show: n3, appear: l4 = false, unmount: S3 = true, ...R2 } = e, d3 = (0, import_react11.useRef)(null), y2 = ue(e), C3 = y(...y2 ? [d3, t5] : t5 === null ? [] : [t5]);
  l3();
  let p2 = u3();
  if (n3 === void 0 && p2 !== null && (n3 = (p2 & i3.Open) === i3.Open), n3 === void 0)
    throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [h2, g] = (0, import_react11.useState)(n3 ? "visible" : "hidden"), v2 = Te(() => {
    n3 || g("hidden");
  }), [o5, i4] = (0, import_react11.useState)(true), a2 = (0, import_react11.useRef)([n3]);
  n(() => {
    o5 !== false && a2.current[a2.current.length - 1] !== n3 && (a2.current.push(n3), i4(false));
  }, [a2, n3]);
  let s5 = (0, import_react11.useMemo)(() => ({ show: n3, appear: l4, initial: o5 }), [n3, l4, o5]);
  n(() => {
    n3 ? g("visible") : !U2(v2) && d3.current !== null && g("hidden");
  }, [n3, v2]);
  let r5 = { unmount: S3 }, f3 = o4(() => {
    var u4;
    o5 && i4(false), (u4 = e.beforeEnter) == null || u4.call(e);
  }), j3 = o4(() => {
    var u4;
    o5 && i4(false), (u4 = e.beforeLeave) == null || u4.call(e);
  }), H2 = L();
  return import_react11.default.createElement(M2.Provider, { value: v2 }, import_react11.default.createElement(w2.Provider, { value: s5 }, H2({ ourProps: { ...r5, as: import_react11.Fragment, children: import_react11.default.createElement(me, { ref: C3, ...r5, ...R2, beforeEnter: f3, beforeLeave: j3 }) }, theirProps: {}, defaultTag: import_react11.Fragment, features: fe, visible: h2 === "visible", name: "Transition" })));
}
function Le(e, t5) {
  let n3 = (0, import_react11.useContext)(w2) !== null, l4 = u3() !== null;
  return import_react11.default.createElement(import_react11.default.Fragment, null, !n3 && l4 ? import_react11.default.createElement(X, { ref: t5, ...e }) : import_react11.default.createElement(me, { ref: t5, ...e }));
}
var X = K(Ie);
var me = K(Ae);
var Fe = K(Le);
var ze = Object.assign(X, { Child: Fe, Root: X });

// app/components/Header.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Header.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Header.tsx"
  );
  import.meta.hot.lastModified = "1745277132092.873";
}
function Header() {
  _s();
  const [menuOpen, setMenuOpen] = (0, import_react13.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "bg-white shadow-md sticky top-0 z-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: "/logo.png", alt: "Schulbox Logo", className: "h-12" }, void 0, false, {
        fileName: "app/components/Header.tsx",
        lineNumber: 33,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/Header.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1 mx-4 block md:hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative w-full", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg", children: "\u{1F50D}" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 39,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", placeholder: "Produkt suche Artikelbezeichnung, Artikelnummer", className: "w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 40,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Header.tsx",
        lineNumber: 38,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/Header.tsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium ml-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/shop", className: "hover:text-blue-600", children: "Webshop" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 46,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/schulboxen", className: "hover:text-blue-600", children: "Schulboxen" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 47,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/ueber-uns", className: "hover:text-blue-600", children: "\xDCber uns" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 48,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Header.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hidden md:block flex-1 px-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative w-full max-w-xl mx-auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg", children: "\u{1F50D}" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 54,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", placeholder: "Produkt suche Artikelbezeichnung, Artikelnummer", className: "w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 55,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Header.tsx",
        lineNumber: 53,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/Header.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4 text-gray-600", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hidden md:block", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/login", title: "Einloggen", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { role: "img", "aria-label": "Login", className: "text-xl", children: "\u{1F464}" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 63,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 62,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 61,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/cart", title: "Warenkorb", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { role: "img", "aria-label": "Warenkorb", className: "text-xl", children: "\u{1F6D2}" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 67,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "md:hidden", onClick: () => setMenuOpen(!menuOpen), children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl", children: "\u2630" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 72,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 71,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Header.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Header.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ze, { show: menuOpen, enter: "transition duration-300 ease-out", enterFrom: "transform translate-x-full opacity-0", enterTo: "transform translate-x-0 opacity-100", leave: "transition duration-200 ease-in", leaveFrom: "transform translate-x-0 opacity-100", leaveTo: "transform translate-x-full opacity-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 px-6 py-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "absolute top-4 right-4 text-2xl", onClick: () => setMenuOpen(false), "aria-label": "Men\xFC schlie\xDFen", children: "\u2715" }, void 0, false, {
        fileName: "app/components/Header.tsx",
        lineNumber: 80,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-10 space-y-4 text-right", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/shop", className: "block text-gray-800 font-medium hover:text-blue-600", children: "Webshop" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 84,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/schulboxen", className: "block text-gray-800 font-medium hover:text-blue-600", children: "Schulboxen" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 85,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/ueber-uns", className: "block text-gray-800 font-medium hover:text-blue-600", children: "\xDCber uns" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {}, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 87,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/login", className: "block text-gray-800 font-medium hover:text-blue-600", children: "\u{1F464} Einloggen" }, void 0, false, {
          fileName: "app/components/Header.tsx",
          lineNumber: 88,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Header.tsx",
        lineNumber: 83,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Header.tsx",
      lineNumber: 79,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/Header.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Header.tsx",
    lineNumber: 29,
    columnNumber: 10
  }, this);
}
_s(Header, "K77eQVFAaxZgbvGoNWFAiCE7OTY=");
_c = Header;
var _c;
$RefreshReg$(_c, "Header");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/root.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\root.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\root.tsx"
  );
}
var links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap"
}];
function CustomMeta() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { charSet: "utf-8" }, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("title", { children: "Schulbox" }, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 64,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 61,
    columnNumber: 10
  }, this);
}
_c2 = CustomMeta;
function Layout({
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "de", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(CustomMeta, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Links, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { className: "bg-white text-gray-900 font-sans", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Header, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this),
      children,
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ScrollRestoration, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 79,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Scripts, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 80,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 76,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 71,
    columnNumber: 10
  }, this);
}
_c22 = Layout;
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Outlet, {}, void 0, false, {
    fileName: "app/root.tsx",
    lineNumber: 86,
    columnNumber: 10
  }, this);
}
_c3 = App;
var _c2;
var _c22;
var _c3;
$RefreshReg$(_c2, "CustomMeta");
$RefreshReg$(_c22, "Layout");
$RefreshReg$(_c3, "App");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Layout,
  App as default,
  links
};
//# sourceMappingURL=/build/root-FIADVSVC.js.map
