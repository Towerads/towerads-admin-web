(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "https://towerads-backend.onrender.com");
async function api(path, options = {}) {
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("admin_token") : "TURBOPACK unreachable";
    const headers = {
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {},
        ...options.headers || {}
    };
    if (options.body) {
        headers["Content-Type"] = "application/json";
    }
    const res = await fetch(`${API_URL}${path}`, {
        mode: "cors",
        credentials: "include",
        ...options,
        headers
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `API error ${res.status}`);
    }
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(admin)/creatives/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreativesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const TABS = [
    {
        key: "pending",
        label: "Новые заявки"
    },
    {
        key: "approved",
        label: "Одобрены"
    },
    {
        key: "rejected",
        label: "Отклонены"
    }
];
function CreativesPage() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    const [creatives, setCreatives] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rejectReason, setRejectReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreativesPage.useEffect": ()=>{
            loadCreatives();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CreativesPage.useEffect"], [
        activeTab
    ]);
    async function loadCreatives() {
        setLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"])(`/admin/creatives?status=${activeTab}`);
            setCreatives(data.creatives || []);
        } finally{
            setLoading(false);
        }
    }
    async function approve(id) {
        setActionLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"])("/admin/creatives/approve", {
                method: "POST",
                body: JSON.stringify({
                    creative_id: id
                })
            });
            setSelected(null);
            loadCreatives();
        } finally{
            setActionLoading(false);
        }
    }
    async function reject(id) {
        if (!rejectReason.trim()) return;
        setActionLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"])("/admin/creatives/reject", {
                method: "POST",
                body: JSON.stringify({
                    creative_id: id,
                    reason: rejectReason.trim()
                })
            });
            setRejectReason("");
            setSelected(null);
            loadCreatives();
        } finally{
            setActionLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-inner",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            marginBottom: 24
                        },
                        children: "Модерация креативов"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 10,
                            marginBottom: 24
                        },
                        children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab.key),
                                style: {
                                    padding: "8px 16px",
                                    borderRadius: 999,
                                    fontWeight: 700,
                                    fontSize: 14,
                                    background: activeTab === tab.key ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
                                    border: activeTab === tab.key ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)"
                                },
                                children: tab.label
                            }, tab.key, false, {
                                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: "Загрузка…"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                        lineNumber: 115,
                        columnNumber: 21
                    }, this),
                    !loading && creatives.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            opacity: 0.6
                        },
                        children: "Креативов нет"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 14
                        },
                        children: creatives.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setSelected(c),
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "160px 1fr 120px",
                                    gap: 20,
                                    alignItems: "center",
                                    padding: 14,
                                    borderRadius: 14,
                                    cursor: "pointer",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                        src: c.media_url,
                                        muted: true,
                                        preload: "metadata",
                                        style: {
                                            width: "100%",
                                            height: 90,
                                            objectFit: "cover",
                                            borderRadius: 10,
                                            background: "#000"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 700
                                                },
                                                children: c.advertiser_email
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                lineNumber: 153,
                                                columnNumber: 17
                                            }, this),
                                            c.pricing_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 13,
                                                    opacity: 0.75
                                                },
                                                children: [
                                                    c.pricing_name,
                                                    " ·",
                                                    " ",
                                                    c.impressions?.toLocaleString(),
                                                    " показов · $",
                                                    c.price_usd
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                lineNumber: 158,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 12,
                                                    opacity: 0.5
                                                },
                                                children: new Date(c.created_at).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            justifySelf: "end",
                                            padding: "6px 10px",
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            background: c.status === "pending" ? "rgba(250,204,21,0.15)" : c.status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                                            color: c.status === "pending" ? "#facc15" : c.status === "approved" ? "#22c55e" : "#ef4444"
                                        },
                                        children: c.status === "pending" ? "Ожидает" : c.status === "approved" ? "Одобрен" : "Отклонён"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, c.id, true, {
                                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                lineNumber: 124,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>{
                    setSelected(null);
                    setRejectReason("");
                },
                style: {
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.65)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    style: {
                        width: 900,
                        maxWidth: "95%",
                        background: "#0b0b12",
                        borderRadius: 20,
                        padding: 24,
                        display: "grid",
                        gridTemplateColumns: "480px 1fr",
                        gap: 24
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            src: selected.media_url,
                            controls: true,
                            style: {
                                width: "100%",
                                borderRadius: 14
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        marginBottom: 14
                                    },
                                    children: "Заявка на рекламу"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                    lineNumber: 239,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Рекламодатель:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 19
                                                }, this),
                                                " ",
                                                selected.advertiser_email
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this),
                                        selected.pricing_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Тариф:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                selected.pricing_name,
                                                " ·",
                                                " ",
                                                selected.impressions?.toLocaleString(),
                                                " показов"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                            lineNumber: 247,
                                            columnNumber: 19
                                        }, this),
                                        selected.price_usd !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 26,
                                                fontWeight: 900
                                            },
                                            children: [
                                                "$",
                                                selected.price_usd
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 13,
                                                opacity: 0.6
                                            },
                                            children: [
                                                "Создано:",
                                                " ",
                                                new Date(selected.created_at).toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                    lineNumber: 241,
                                    columnNumber: 15
                                }, this),
                                selected.status === "pending" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            placeholder: "Причина отклонения (обязательно)",
                                            value: rejectReason,
                                            onChange: (e)=>setRejectReason(e.target.value),
                                            style: {
                                                marginTop: 16,
                                                minHeight: 70,
                                                padding: 10,
                                                borderRadius: 10,
                                                background: "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                color: "#fff"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                            lineNumber: 267,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                gap: 12,
                                                marginTop: "auto"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>approve(selected.id),
                                                    disabled: actionLoading,
                                                    style: {
                                                        flex: 1,
                                                        padding: "12px",
                                                        borderRadius: 12,
                                                        fontWeight: 800,
                                                        background: "rgba(34,197,94,0.18)",
                                                        color: "#22c55e",
                                                        border: "1px solid rgba(34,197,94,0.4)"
                                                    },
                                                    children: "Одобрить"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>reject(selected.id),
                                                    disabled: !rejectReason.trim() || actionLoading,
                                                    style: {
                                                        flex: 1,
                                                        padding: "12px",
                                                        borderRadius: 12,
                                                        fontWeight: 800,
                                                        background: "rgba(239,68,68,0.18)",
                                                        color: "#ef4444",
                                                        border: "1px solid rgba(239,68,68,0.4)",
                                                        opacity: !rejectReason.trim() ? 0.5 : 1
                                                    },
                                                    children: "Отклонить"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                                            lineNumber: 282,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                            lineNumber: 238,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                    lineNumber: 219,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(admin)/creatives/page.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(admin)/creatives/page.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_s(CreativesPage, "mwBwnBYs2SeMX9ELVjT5BBkB6sY=");
_c = CreativesPage;
var _c;
__turbopack_context__.k.register(_c, "CreativesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_7fa73a88._.js.map