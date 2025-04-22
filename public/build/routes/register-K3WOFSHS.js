import "/build/_shared/chunk-UFLCS4P4.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import "/build/_shared/chunk-XBXWO5VA.js";
import "/build/_shared/chunk-PH7FC7E6.js";
import {
  Form,
  useActionData,
  useNavigation
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/register.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\register.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\register.tsx"
  );
  import.meta.hot.lastModified = "1745273377101.2861";
}
function Register() {
  _s();
  const navigation = useNavigation();
  const actionData = useActionData();
  const [showSuccess, setShowSuccess] = (0, import_react2.useState)(false);
  const [countdown, setCountdown] = (0, import_react2.useState)(10);
  (0, import_react2.useEffect)(() => {
    if (actionData?.success) {
      setShowSuccess(true);
    }
  }, [actionData]);
  (0, import_react2.useEffect)(() => {
    if (showSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = "/";
          }
          return prev - 1;
        });
      }, 1e3);
      return () => clearInterval(timer);
    }
  }, [showSuccess]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col items-center justify-start min-h-screen px-4 pt-12 text-sm max-w-4xl mx-auto", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold mb-8 w-full", children: "\u{1F4DD} Registrieren" }, void 0, false, {
      fileName: "app/routes/register.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this),
    showSuccess && actionData?.email && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 w-full", children: [
      "Die Registrierung bei Schulbox war erfolgreich, um Ihre E-Mail verifizieren zu k\xF6nnen, wurde soeben ein Best\xE4tigungslink an",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-green-700 font-medium", children: actionData.email }, void 0, false, {
        fileName: "app/routes/register.tsx",
        lineNumber: 109,
        columnNumber: 11
      }, this),
      " geschickt.",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm", children: [
        "...Weiterleitung zur Startseite in ",
        countdown,
        " Sekunden",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 111,
          columnNumber: 68
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/", className: "text-blue-600 underline", children: "oder hier direkt zur Startseite" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 112,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 110,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/register.tsx",
      lineNumber: 106,
      columnNumber: 44
    }, this),
    !showSuccess && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "grid grid-cols-1 md:grid-cols-2 gap-4 w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "vorname", children: "Vorname *" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 119,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "vorname", name: "vorname", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 120,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 118,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "nachname", children: "Nachname *" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 123,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "nachname", name: "nachname", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 124,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 122,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col md:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "stra\xDFe", children: "Stra\xDFe *" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 129,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "stra\xDFe", name: "stra\xDFe", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 130,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 128,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-3 gap-2 md:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "hausnummer", children: "Nr. *" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 136,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "hausnummer", name: "hausnummer", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 137,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/register.tsx",
          lineNumber: 135,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "t\xFCrnummer", children: "T\xFCrNr." }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 140,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "t\xFCrnummer", name: "t\xFCrnummer", className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 141,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/register.tsx",
          lineNumber: 139,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "stiege", children: "Stiege" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 144,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "stiege", name: "stiege", className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 145,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/register.tsx",
          lineNumber: 143,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 134,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-3 gap-2 md:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "postleitzahl", children: "Postleitzahl *" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 152,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "postleitzahl", name: "postleitzahl", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 153,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/register.tsx",
          lineNumber: 151,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "ort", children: "Ort *" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 156,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "ort", name: "ort", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 157,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/register.tsx",
          lineNumber: 155,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "telefonnummer", children: "Telefonnummer" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 160,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "telefonnummer", name: "telefonnummer", className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
            fileName: "app/routes/register.tsx",
            lineNumber: 161,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/register.tsx",
          lineNumber: 159,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 150,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col md:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "email", children: "E-Mail *" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 167,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "email", name: "email", type: "email", required: true, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 168,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 166,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col md:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "password", children: "Passwort *" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 173,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "password", name: "password", type: "password", required: true, minLength: 6, className: "border border-gray-300 p-2 rounded w-full" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 174,
          columnNumber: 5
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-500 text-xs mt-1", children: "Mindestens 6 Zeichen oder Zahlen erforderlich" }, void 0, false, {
          fileName: "app/routes/register.tsx",
          lineNumber: 175,
          columnNumber: 5
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/register.tsx",
        lineNumber: 172,
        columnNumber: 3
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: navigation.state === "submitting", className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition", children: navigation.state === "submitting" ? "Wird gesendet..." : "Registrieren" }, void 0, false, {
        fileName: "app/routes/register.tsx",
        lineNumber: 180,
        columnNumber: 5
      }, this) }, void 0, false, {
        fileName: "app/routes/register.tsx",
        lineNumber: 179,
        columnNumber: 3
      }, this),
      "error" in (actionData ?? {}) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "col-span-2 mt-2 text-red-600 text-sm", children: actionData?.error }, void 0, false, {
        fileName: "app/routes/register.tsx",
        lineNumber: 186,
        columnNumber: 37
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/register.tsx",
      lineNumber: 116,
      columnNumber: 24
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/register.tsx",
    lineNumber: 103,
    columnNumber: 10
  }, this);
}
_s(Register, "qjriVPXh2XXe4okbGoSFDJObatg=", false, function() {
  return [useNavigation, useActionData];
});
_c = Register;
var _c;
$RefreshReg$(_c, "Register");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Register as default
};
//# sourceMappingURL=/build/routes/register-K3WOFSHS.js.map
