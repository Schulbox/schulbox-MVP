import {
  supabase
} from "/build/_shared/chunk-UFLCS4P4.js";
import "/build/_shared/chunk-XBXWO5VA.js";
import "/build/_shared/chunk-PH7FC7E6.js";
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/test-register.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\test-register.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\test-register.tsx"
  );
  import.meta.hot.lastModified = "1745246238000.6565";
}
function TestRegister() {
  _s();
  const [email, setEmail] = (0, import_react.useState)("kamal.a15190@gmail.com");
  const [password, setPassword] = (0, import_react.useState)("12345678");
  const [message, setMessage] = (0, import_react.useState)("");
  const handleTestRegister = async () => {
    console.log("\u2705 signup() wurde aufgerufen");
    setMessage("\u23F3 Registrierung wird verarbeitet...");
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      console.error("\u274C Fehler bei der Registrierung:", error.message);
      setMessage("\u274C Fehler: " + error.message);
    } else {
      console.log("\u2705 Registrierung erfolgreich:", data);
      setMessage("\u2705 Registrierung erfolgreich! Bitte E-Mail best\xE4tigen.");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
    display: "flex",
    justifyContent: "center",
    padding: "3rem"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
    maxWidth: "400px",
    width: "100%",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { children: "Testregistrierung" }, void 0, false, {
      fileName: "app/routes/test-register.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "E-Mail", style: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      borderRadius: "5px",
      border: "1px solid #ccc"
    } }, void 0, false, {
      fileName: "app/routes/test-register.tsx",
      lineNumber: 59,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Passwort", style: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1.5rem",
      borderRadius: "5px",
      border: "1px solid #ccc"
    } }, void 0, false, {
      fileName: "app/routes/test-register.tsx",
      lineNumber: 67,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleTestRegister, style: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#2563eb",
      color: "#fff",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1e40af", onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#2563eb", children: "Testregistrieren" }, void 0, false, {
      fileName: "app/routes/test-register.tsx",
      lineNumber: 75,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { style: {
      marginTop: "1.5rem",
      color: "#333"
    }, children: message }, void 0, false, {
      fileName: "app/routes/test-register.tsx",
      lineNumber: 89,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/test-register.tsx",
    lineNumber: 52,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/test-register.tsx",
    lineNumber: 47,
    columnNumber: 10
  }, this);
}
_s(TestRegister, "xJWfA2JSvWXgP/EncuMWB2b/o6M=");
_c = TestRegister;
var _c;
$RefreshReg$(_c, "TestRegister");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  TestRegister as default
};
//# sourceMappingURL=/build/routes/test-register-CHYP42WL.js.map
