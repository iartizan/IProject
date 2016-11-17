/**
 * Created by artizan.he on 2016/3/25.
 */
/**
 * Created by artizan.he on 2016/3/24.
 */

self = "undefined" != typeof window ? window: "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self: {};
var Prism = function() {
    var a = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
        b = self.Prism = {
            util: {
                encode: function(a) {
                    return a instanceof c ? new c(a.type, b.util.encode(a.content), a.alias) : "Array" === b.util.type(a) ? a.map(b.util.encode) : a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                },
                type: function(a) {
                    return Object.prototype.toString.call(a).match(/\[object (\w+)\]/)[1]
                },
                clone: function(a) {
                    var c = b.util.type(a);
                    switch (c) {
                        case "Object":
                            var d = {};
                            for (var e in a) a.hasOwnProperty(e) && (d[e] = b.util.clone(a[e]));
                            return d;
                        case "Array":
                            return a.slice()
                    }
                    return a
                }
            },
            languages: {
                extend: function(a, c) {
                    var d = b.util.clone(b.languages[a]);
                    for (var e in c) d[e] = c[e];
                    return d
                },
                insertBefore: function(a, c, d, e) {
                    e = e || b.languages;
                    var f = e[a];
                    if (2 == arguments.length) {
                        d = arguments[1];
                        for (var g in d) d.hasOwnProperty(g) && (f[g] = d[g]);
                        return f
                    }
                    var h = {};
                    for (var i in f) if (f.hasOwnProperty(i)) {
                        if (i == c) for (var g in d) d.hasOwnProperty(g) && (h[g] = d[g]);
                        h[i] = f[i]
                    }
                    return b.languages.DFS(b.languages,
                        function(b, c) {
                            c === e[a] && b != a && (this[b] = h)
                        }),
                        e[a] = h
                },
                DFS: function(a, c, d) {
                    for (var e in a) a.hasOwnProperty(e) && (c.call(a, e, a[e], d || e), "Object" === b.util.type(a[e]) ? b.languages.DFS(a[e], c) : "Array" === b.util.type(a[e]) && b.languages.DFS(a[e], c, e))
                }
            },
            highlightAll: function(a, c) {
                for (var d, e = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), f = 0; d = e[f++];) b.highlightElement(d, a === !0, c)
            },
            highlightElement: function(d, e, f) {
                for (var g, h, i = d; i && !a.test(i.className);) i = i.parentNode;
                if (i && (g = (i.className.match(a) || [, ""])[1], h = b.languages[g]), h) {
                    d.className = d.className.replace(a, "").replace(/\s+/g, " ") + " language-" + g,
                        i = d.parentNode,
                    /pre/i.test(i.nodeName) && (i.className = i.className.replace(a, "").replace(/\s+/g, " ") + " language-" + g);
                    var j = d.textContent;
                    if (j) {
                        var k = {
                            element: d,
                            language: g,
                            grammar: h,
                            code: j
                        };
                        if (b.hooks.run("before-highlight", k), e && self.Worker) {
                            var l = new Worker(b.filename);
                            l.onmessage = function(a) {
                                k.highlightedCode = c.stringify(JSON.parse(a.data), g),
                                    b.hooks.run("before-insert", k),
                                    k.element.innerHTML = k.highlightedCode,
                                f && f.call(k.element),
                                    b.hooks.run("after-highlight", k)
                            },
                                l.postMessage(JSON.stringify({
                                    language: k.language,
                                    code: k.code
                                }))
                        } else k.highlightedCode = b.highlight(k.code, k.grammar, k.language),
                            b.hooks.run("before-insert", k),
                            k.element.innerHTML = k.highlightedCode,
                        f && f.call(d),
                            b.hooks.run("after-highlight", k)
                    }
                }
            },
            highlight: function(a, d, e) {
                var f = b.tokenize(a, d);
                return c.stringify(b.util.encode(f), e)
            },
            tokenize: function(a, c) {
                var d = b.Token,
                    e = [a],
                    f = c.rest;
                if (f) {
                    for (var g in f) c[g] = f[g];
                    delete c.rest
                }
                a: for (var g in c) if (c.hasOwnProperty(g) && c[g]) {
                    var h = c[g];
                    h = "Array" === b.util.type(h) ? h: [h];
                    for (var i = 0; i < h.length; ++i) {
                        var j = h[i],
                            k = j.inside,
                            l = !!j.lookbehind,
                            m = 0,
                            n = j.alias;
                        j = j.pattern || j;
                        for (var o = 0; o < e.length; o++) {
                            var p = e[o];
                            if (e.length > a.length) break a;
                            if (! (p instanceof d)) {
                                j.lastIndex = 0;
                                var q = j.exec(p);
                                if (q) {
                                    l && (m = q[1].length);
                                    var r = q.index - 1 + m,
                                        q = q[0].slice(m),
                                        s = q.length,
                                        t = r + s,
                                        u = p.slice(0, r + 1),
                                        v = p.slice(t + 1),
                                        w = [o, 1];
                                    u && w.push(u);
                                    var x = new d(g, k ? b.tokenize(q, k) : q, n);
                                    w.push(x),
                                    v && w.push(v),
                                        Array.prototype.splice.apply(e, w)
                                }
                            }
                        }
                    }
                }
                return e
            },
            hooks: {
                all: {},
                add: function(a, c) {
                    var d = b.hooks.all;
                    d[a] = d[a] || [],
                        d[a].push(c)
                },
                run: function(a, c) {
                    var d = b.hooks.all[a];
                    if (d && d.length) for (var e, f = 0; e = d[f++];) e(c)
                }
            }
        },
        c = b.Token = function(a, b, c) {
            this.type = a,
                this.content = b,
                this.alias = c
        };
    if (c.stringify = function(a, d, e) {
            if ("string" == typeof a) return a;
            if ("[object Array]" == Object.prototype.toString.call(a)) return a.map(function(b) {
                return c.stringify(b, d, a)
            }).join("");
            var f = {
                type: a.type,
                content: c.stringify(a.content, d, e),
                tag: "span",
                classes: ["token", a.type],
                attributes: {},
                language: d,
                parent: e
            };
            if ("comment" == f.type && (f.attributes.spellcheck = "true"), a.alias) {
                var g = "Array" === b.util.type(a.alias) ? a.alias: [a.alias];
                Array.prototype.push.apply(f.classes, g)
            }
            b.hooks.run("wrap", f);
            var h = "";
            for (var i in f.attributes) h += i + '="' + (f.attributes[i] || "") + '"';
            return "<" + f.tag + ' class="' + f.classes.join(" ") + '" ' + h + ">" + f.content + "</" + f.tag + ">"
        },
            !self.document) return self.addEventListener ? (self.addEventListener("message",
        function(a) {
            var c = JSON.parse(a.data),
                d = c.language,
                e = c.code;
            self.postMessage(JSON.stringify(b.util.encode(b.tokenize(e, b.languages[d])))),
                self.close()
        },
        !1), self.Prism) : self.Prism;
    var d = document.getElementsByTagName("script");
    return d = d[d.length - 1],
    d && (b.filename = d.src, document.addEventListener && !d.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", b.highlightAll)),
        self.Prism
} ();
"undefined" != typeof module && module.exports && (module.exports = Prism),
    Prism.languages.markup = {
        comment: /<!--[\w\W]*?-->/g,
        prolog: /<\?.+?\?>/,
        doctype: /<!DOCTYPE.+?>/,
        cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
        tag: {
            pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
            inside: {
                tag: {
                    pattern: /^<\/?[\w:-]+/i,
                    inside: {
                        punctuation: /^<\/?/,
                        namespace: /^[\w-]+?:/
                    }
                },
                "attr-value": {
                    pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
                    inside: {
                        punctuation: /=|>|"/g
                    }
                },
                punctuation: /\/?>/g,
                "attr-name": {
                    pattern: /[\w:-]+/g,
                    inside: {
                        namespace: /^[\w-]+?:/
                    }
                }
            }
        },
        entity: /\&#?[\da-z]{1,8};/gi
    },
    Prism.hooks.add("wrap",
        function(a) {
            "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
        }),
    Prism.languages.css = {
        comment: /\/\*[\w\W]*?\*\//g,
        atrule: {
            pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
            inside: {
                punctuation: /[;:]/g
            }
        },
        url: /url\((["']?).*?\1\)/gi,
        selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
        property: /(\b|\B)[\w-]+(?=\s*:)/gi,
        string: /("|')(\\?.)*?\1/g,
        important: /\B!important\b/gi,
        punctuation: /[\{\};:]/g,
        "function": /[-a-z0-9]+(?=\()/gi
    },
Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
    style: {
        pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/gi,
        inside: {
            tag: {
                pattern: /<style[\w\W]*?>|<\/style>/gi,
                inside: Prism.languages.markup.tag.inside
            },
            rest: Prism.languages.css
        },
        alias: "language-css"
    }
}), Prism.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /\s*style=("|').+?\1/gi,
            inside: {
                "attr-name": {
                    pattern: /^\s*style/gi,
                    inside: Prism.languages.markup.tag.inside
                },
                punctuation: /^\s*=\s*['"]|['"]\s*$/,
                "attr-value": {
                    pattern: /.+/gi,
                    inside: Prism.languages.css
                }
            },
            alias: "language-css"
        }
    },
    Prism.languages.markup.tag)),
    Prism.languages.clike = {
        comment: [{
            pattern: /(^|[^\\])\/\*[\w\W]*?\*\//g,
            lookbehind: !0
        },
            {
                pattern: /(^|[^\\:])\/\/.*?(\r?\n|$)/g,
                lookbehind: !0
            }],
        string: /("|')(\\?.)*?\1/g,
        "class-name": {
            pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,
            lookbehind: !0,
            inside: {
                punctuation: /(\.|\\)/
            }
        },
        keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
        "boolean": /\b(true|false)\b/g,
        "function": {
            pattern: /[a-z0-9_]+\(/gi,
            inside: {
                punctuation: /\(/
            }
        },
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
        operator: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
        ignore: /&(lt|gt|amp);/gi,
        punctuation: /[{}[\];(),.:]/g
    },
    Prism.languages.javascript = Prism.languages.extend("clike", {
        keyword: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
    }),
    Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            //pattern: /(^|[^/])\ / ( ? !\ / )(\ [. + ?] | \\. | [ ^ /\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g, lookbehind: !0
}
}),
Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/gi,
        inside: {
            tag: {
                pattern: /<script[\w\W]*?>|<\/script>/gi,
                inside: Prism.languages.markup.tag.inside
            },
            rest: Prism.languages.javascript
        },
        alias: "language-javascript"
    }
}),
    Prism.languages.scss = Prism.languages.extend("css", {
        comment: {
            pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
            lookbehind: !0
        },
        atrule: /@[\w-]+(?=\s+(\(|\{|;))/gi,
        url: /([-a-z]+-)*url(?=\()/gi,
        selector: /([^@;\{\}\(\)]?([^@;\{\}\(\)]|&|\#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm
    }),
    Prism.languages.insertBefore("scss", "atrule", {
        keyword: /@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)|(?=@for\s+\$[-_\w]+\s)+from/i
    }),
    Prism.languages.insertBefore("scss", "property", {
        variable: /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i
    }),
    Prism.languages.insertBefore("scss", "ignore", {
        placeholder: /%[-_\w]+/i,
        statement: /\B!(default|optional)\b/gi,
        "boolean": /\b(true|false)\b/g,
        "null": /\b(null)\b/g,
        operator: /\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|\%)\s+/g
    }),
    Prism.hooks.add("after-highlight",
        function(a) {
            var b = a.element.parentNode;
            if (b && /pre/i.test(b.nodeName) && -1 !== b.className.indexOf("line-numbers")) {
                var c, d = 1 + a.code.split("\n").length;
                lines = new Array(d),
                    lines = lines.join("<span></span>"),
                    c = document.createElement("span"),
                    c.className = "line-numbers-rows",
                    c.innerHTML = lines,
                b.hasAttribute("data-start") && (b.style.counterReset = "linenumber " + (parseInt(b.getAttribute("data-start"), 10) - 1)),
                    a.element.appendChild(c)
            }
        }),
    function(a, b, c) {
        "use strict";
        function d(a, b) {
            return b = b || Error,
                function() {
                    var c, d, e = arguments[0],
                        f = "[" + (a ? a + ":": "") + e + "] ",
                        g = arguments[1],
                        h = arguments;
                    for (c = f + g.replace(/\{\d+\}/g,
                            function(a) {
                                var b = +a.slice(1, -1);
                                return b + 2 < h.length ? mb(h[b + 2]) : a
                            }), c = c + "\nhttp://errors.angularjs.org/1.3.13/" + (a ? a + "/": "") + e, d = 2; d < arguments.length; d++) c = c + (2 == d ? "?": "&") + "p" + (d - 2) + "=" + encodeURIComponent(mb(arguments[d]));
                    return new b(c)
                }
        }
        function e(a) {
            if (null == a || z(a)) return ! 1;
            var b = a.length;
            return a.nodeType === qe && b ? !0 : u(a) || je(a) || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
        }
        function f(a, b, c) {
            var d, g;
            if (a) if (x(a)) for (d in a)"prototype" == d || "length" == d || "name" == d || a.hasOwnProperty && !a.hasOwnProperty(d) || b.call(c, a[d], d, a);
            else if (je(a) || e(a)) {
                var h = "object" != typeof a;
                for (d = 0, g = a.length; g > d; d++)(h || d in a) && b.call(c, a[d], d, a)
            } else if (a.forEach && a.forEach !== f) a.forEach(b, c, a);
            else for (d in a) a.hasOwnProperty(d) && b.call(c, a[d], d, a);
            return a
        }
        function g(a) {
            return Object.keys(a).sort()
        }
        function h(a, b, c) {
            for (var d = g(a), e = 0; e < d.length; e++) b.call(c, a[d[e]], d[e]);
            return d
        }
        function i(a) {
            return function(b, c) {
                a(c, b)
            }
        }
        function j() {
            return++he
        }
        function k(a, b) {
            b ? a.$$hashKey = b: delete a.$$hashKey
        }
        function l(a) {
            for (var b = a.$$hashKey,
                     c = 1,
                     d = arguments.length; d > c; c++) {
                var e = arguments[c];
                if (e) for (var f = Object.keys(e), g = 0, h = f.length; h > g; g++) {
                    var i = f[g];
                    a[i] = e[i]
                }
            }
            return k(a, b),
                a
        }
        function m(a) {
            return parseInt(a, 10)
        }
        function n(a, b) {
            return l(Object.create(a), b)
        }
        function o() {}
        function p(a) {
            return a
        }
        function q(a) {
            return function() {
                return a
            }
        }
        function r(a) {
            return "undefined" == typeof a
        }
        function s(a) {
            return "undefined" != typeof a
        }
        function t(a) {
            return null !== a && "object" == typeof a
        }
        function u(a) {
            return "string" == typeof a
        }
        function v(a) {
            return "number" == typeof a
        }
        function w(a) {
            return "[object Date]" === ee.call(a)
        }
        function x(a) {
            return "function" == typeof a
        }
        function y(a) {
            return "[object RegExp]" === ee.call(a)
        }
        function z(a) {
            return a && a.window === a
        }
        function A(a) {
            return a && a.$evalAsync && a.$watch
        }
        function B(a) {
            return "[object File]" === ee.call(a)
        }
        function C(a) {
            return "[object FormData]" === ee.call(a)
        }
        function D(a) {
            return "[object Blob]" === ee.call(a)
        }
        function E(a) {
            return "boolean" == typeof a
        }
        function F(a) {
            return a && x(a.then)
        }
        function G(a) {
            return ! (!a || !(a.nodeName || a.prop && a.attr && a.find))
        }
        function H(a) {
            var b, c = {},
                d = a.split(",");
            for (b = 0; b < d.length; b++) c[d[b]] = !0;
            return c
        }
        function I(a) {
            return Ud(a.nodeName || a[0] && a[0].nodeName)
        }
        function J(a, b) {
            var c = a.indexOf(b);
            return c >= 0 && a.splice(c, 1),
                b
        }
        function K(a, b, c, d) {
            if (z(a) || A(a)) throw fe("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
            if (b) {
                if (a === b) throw fe("cpi", "Can't copy! Source and destination are identical.");
                if (c = c || [], d = d || [], t(a)) {
                    var e = c.indexOf(a);
                    if ( - 1 !== e) return d[e];
                    c.push(a),
                        d.push(b)
                }
                var g;
                if (je(a)) {
                    b.length = 0;
                    for (var h = 0; h < a.length; h++) g = K(a[h], null, c, d),
                    t(a[h]) && (c.push(a[h]), d.push(g)),
                        b.push(g)
                } else {
                    var i = b.$$hashKey;
                    je(b) ? b.length = 0 : f(b,
                        function(a, c) {
                            delete b[c]
                        });
                    for (var j in a) a.hasOwnProperty(j) && (g = K(a[j], null, c, d), t(a[j]) && (c.push(a[j]), d.push(g)), b[j] = g);
                    k(b, i)
                }
            } else if (b = a, a) if (je(a)) b = K(a, [], c, d);
            else if (w(a)) b = new Date(a.getTime());
            else if (y(a)) b = new RegExp(a.source, a.toString().match(/[^\/]*$/)[0]),
                b.lastIndex = a.lastIndex;
            else if (t(a)) {
                var l = Object.create(Object.getPrototypeOf(a));
                b = K(a, l, c, d)
            }
            return b
        }
        function L(a, b) {
            if (je(a)) {
                b = b || [];
                for (var c = 0,
                         d = a.length; d > c; c++) b[c] = a[c]
            } else if (t(a)) {
                b = b || {};
                for (var e in a)("$" !== e.charAt(0) || "$" !== e.charAt(1)) && (b[e] = a[e])
            }
            return b || a
        }
        function M(a, b) {
            if (a === b) return ! 0;
            if (null === a || null === b) return ! 1;
            if (a !== a && b !== b) return ! 0;
            var d, e, f, g = typeof a,
                h = typeof b;
            if (g == h && "object" == g) {
                if (!je(a)) {
                    if (w(a)) return w(b) ? M(a.getTime(), b.getTime()) : !1;
                    if (y(a) && y(b)) return a.toString() == b.toString();
                    if (A(a) || A(b) || z(a) || z(b) || je(b)) return ! 1;
                    f = {};
                    for (e in a) if ("$" !== e.charAt(0) && !x(a[e])) {
                        if (!M(a[e], b[e])) return ! 1;
                        f[e] = !0
                    }
                    for (e in b) if (!f.hasOwnProperty(e) && "$" !== e.charAt(0) && b[e] !== c && !x(b[e])) return ! 1;
                    return ! 0
                }
                if (!je(b)) return ! 1;
                if ((d = a.length) == b.length) {
                    for (e = 0; d > e; e++) if (!M(a[e], b[e])) return ! 1;
                    return ! 0
                }
            }
            return ! 1
        }
        function N(a, b, c) {
            return a.concat(be.call(b, c))
        }
        function O(a, b) {
            return be.call(a, b || 0)
        }
        function P(a, b) {
            var c = arguments.length > 2 ? O(arguments, 2) : [];
            return ! x(b) || b instanceof RegExp ? b: c.length ?
                function() {
                    return arguments.length ? b.apply(a, N(c, arguments, 0)) : b.apply(a, c)
                }: function() {
                return arguments.length ? b.apply(a, arguments) : b.call(a)
            }
        }
        function Q(a, d) {
            var e = d;
            return "string" == typeof a && "$" === a.charAt(0) && "$" === a.charAt(1) ? e = c: z(d) ? e = "$WINDOW": d && b === d ? e = "$DOCUMENT": A(d) && (e = "$SCOPE"),
                e
        }
        function R(a, b) {
            return "undefined" == typeof a ? c: (v(b) || (b = b ? 2 : null), JSON.stringify(a, Q, b))
        }
        function S(a) {
            return u(a) ? JSON.parse(a) : a
        }
        function T(a) {
            a = $d(a).clone();
            try {
                a.empty()
            } catch(b) {}
            var c = $d("<div>").append(a).html();
            try {
                return a[0].nodeType === re ? Ud(c) : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
                    function(a, b) {
                        return "<" + Ud(b)
                    })
            } catch(b) {
                return Ud(c)
            }
        }
        function U(a) {
            try {
                return decodeURIComponent(a)
            } catch(b) {}
        }
        function V(a) {
            var b, c, d = {};
            return f((a || "").split("&"),
                function(a) {
                    if (a && (b = a.replace(/\+/g, "%20").split("="), c = U(b[0]), s(c))) {
                        var e = s(b[1]) ? U(b[1]) : !0;
                        Vd.call(d, c) ? je(d[c]) ? d[c].push(e) : d[c] = [d[c], e] : d[c] = e
                    }
                }),
                d
        }
        function W(a) {
            var b = [];
            return f(a,
                function(a, c) {
                    je(a) ? f(a,
                        function(a) {
                            b.push(Y(c, !0) + (a === !0 ? "": "=" + Y(a, !0)))
                        }) : b.push(Y(c, !0) + (a === !0 ? "": "=" + Y(a, !0)))
                }),
                b.length ? b.join("&") : ""
        }
        function X(a) {
            return Y(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
        }
        function Y(a, b) {
            return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, b ? "%20": "+")
        }
        function Z(a, b) {
            var c, d, e = ne.length;
            for (a = $d(a), d = 0; e > d; ++d) if (c = ne[d] + b, u(c = a.attr(c))) return c;
            return null
        }
        function $(a, b) {
            var c, d, e = {};
            f(ne,
                function(b) {
                    var e = b + "app"; ! c && a.hasAttribute && a.hasAttribute(e) && (c = a, d = a.getAttribute(e))
                }),
                f(ne,
                    function(b) {
                        var e, f = b + "app"; ! c && (e = a.querySelector("[" + f.replace(":", "\\:") + "]")) && (c = e, d = e.getAttribute(f))
                    }),
            c && (e.strictDi = null !== Z(c, "strict-di"), b(c, d ? [d] : [], e))
        }
        function _(c, d, e) {
            t(e) || (e = {});
            var g = {
                strictDi: !1
            };
            e = l(g, e);
            var h = function() {
                    if (c = $d(c), c.injector()) {
                        var a = c[0] === b ? "document": T(c);
                        throw fe("btstrpd", "App Already Bootstrapped with this Element '{0}'", a.replace(/</, "&lt;").replace(/>/, "&gt;"))
                    }
                    d = d || [],
                        d.unshift(["$provide",
                            function(a) {
                                a.value("$rootElement", c)
                            }]),
                    e.debugInfoEnabled && d.push(["$compileProvider",
                        function(a) {
                            a.debugInfoEnabled(!0)
                        }]),
                        d.unshift("ng");
                    var f = Sb(d, e.strictDi);
                    return f.invoke(["$rootScope", "$rootElement", "$compile", "$injector",
                        function(a, b, c, d) {
                            a.$apply(function() {
                                b.data("$injector", d),
                                    c(b)(a)
                            })
                        }]),
                        f
                },
                i = /^NG_ENABLE_DEBUG_INFO!/,
                j = /^NG_DEFER_BOOTSTRAP!/;
            return a && i.test(a.name) && (e.debugInfoEnabled = !0, a.name = a.name.replace(i, "")),
                a && !j.test(a.name) ? h() : (a.name = a.name.replace(j, ""), ge.resumeBootstrap = function(a) {
                    return f(a,
                        function(a) {
                            d.push(a)
                        }),
                        h()
                },
                    void(x(ge.resumeDeferredBootstrap) && ge.resumeDeferredBootstrap()))
        }
        function ab() {
            a.name = "NG_ENABLE_DEBUG_INFO!" + a.name,
                a.location.reload()
        }
        function bb(a) {
            var b = ge.element(a).injector();
            if (!b) throw fe("test", "no injector found for element argument to getTestability");
            return b.get("$$testability")
        }
        function cb(a, b) {
            return b = b || "_",
                a.replace(oe,
                    function(a, c) {
                        return (c ? b: "") + a.toLowerCase()
                    })
        }
        function db() {
            var b;
            pe || (_d = a.jQuery, _d && _d.fn.on ? ($d = _d, l(_d.fn, {
                scope: Je.scope,
                isolateScope: Je.isolateScope,
                controller: Je.controller,
                injector: Je.injector,
                inheritedData: Je.inheritedData
            }), b = _d.cleanData, _d.cleanData = function(a) {
                var c;
                if (ie) ie = !1;
                else for (var d, e = 0; null != (d = a[e]); e++) c = _d._data(d, "events"),
                c && c.$destroy && _d(d).triggerHandler("$destroy");
                b(a)
            }) : $d = ub, ge.element = $d, pe = !0)
        }
        function eb(a, b, c) {
            if (!a) throw fe("areq", "Argument '{0}' is {1}", b || "?", c || "required");
            return a
        }
        function fb(a, b, c) {
            return c && je(a) && (a = a[a.length - 1]),
                eb(x(a), b, "not a function, got " + (a && "object" == typeof a ? a.constructor.name || "Object": typeof a)),
                a
        }
        function gb(a, b) {
            if ("hasOwnProperty" === a) throw fe("badname", "hasOwnProperty is not a valid {0} name", b)
        }
        function hb(a, b, c) {
            if (!b) return a;
            for (var d, e = b.split("."), f = a, g = e.length, h = 0; g > h; h++) d = e[h],
            a && (a = (f = a)[d]);
            return ! c && x(a) ? P(f, a) : a
        }
        function ib(a) {
            var b = a[0],
                c = a[a.length - 1],
                d = [b];
            do {
                if (b = b.nextSibling, !b) break;
                d.push(b)
            } while ( b !== c );
            return $d(d)
        }
        function jb() {
            return Object.create(null)
        }
        function kb(a) {
            function b(a, b, c) {
                return a[b] || (a[b] = c())
            }
            var c = d("$injector"),
                e = d("ng"),
                f = b(a, "angular", Object);
            return f.$$minErr = f.$$minErr || d,
                b(f, "module",
                    function() {
                        var a = {};
                        return function(d, f, g) {
                            var h = function(a, b) {
                                if ("hasOwnProperty" === a) throw e("badname", "hasOwnProperty is not a valid {0} name", b)
                            };
                            return h(d, "module"),
                            f && a.hasOwnProperty(d) && (a[d] = null),
                                b(a, d,
                                    function() {
                                        function a(a, c, d, e) {
                                            return e || (e = b),
                                                function() {
                                                    return e[d || "push"]([a, c, arguments]),
                                                        j
                                                }
                                        }
                                        if (!f) throw c("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", d);
                                        var b = [],
                                            e = [],
                                            h = [],
                                            i = a("$injector", "invoke", "push", e),
                                            j = {
                                                _invokeQueue: b,
                                                _configBlocks: e,
                                                _runBlocks: h,
                                                requires: f,
                                                name: d,
                                                provider: a("$provide", "provider"),
                                                factory: a("$provide", "factory"),
                                                service: a("$provide", "service"),
                                                value: a("$provide", "value"),
                                                constant: a("$provide", "constant", "unshift"),
                                                animation: a("$animateProvider", "register"),
                                                filter: a("$filterProvider", "register"),
                                                controller: a("$controllerProvider", "register"),
                                                directive: a("$compileProvider", "directive"),
                                                config: i,
                                                run: function(a) {
                                                    return h.push(a),
                                                        this
                                                }
                                            };
                                        return g && i(g),
                                            j
                                    })
                        }
                    })
        }
        function lb(a) {
            var b = [];
            return JSON.stringify(a,
                function(a, c) {
                    if (c = Q(a, c), t(c)) {
                        if (b.indexOf(c) >= 0) return "<<already seen>>";
                        b.push(c)
                    }
                    return c
                })
        }
        function mb(a) {
            return "function" == typeof a ? a.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof a ? "undefined": "string" != typeof a ? lb(a) : a
        }
        function nb(b) {
            l(b, {
                bootstrap: _,
                copy: K,
                extend: l,
                equals: M,
                element: $d,
                forEach: f,
                injector: Sb,
                noop: o,
                bind: P,
                toJson: R,
                fromJson: S,
                identity: p,
                isUndefined: r,
                isDefined: s,
                isString: u,
                isFunction: x,
                isObject: t,
                isNumber: v,
                isElement: G,
                isArray: je,
                version: ve,
                isDate: w,
                lowercase: Ud,
                uppercase: Wd,
                callbacks: {
                    counter: 0
                },
                getTestability: bb,
                $$minErr: d,
                $$csp: me,
                reloadWithDebugInfo: ab
            }),
                ae = kb(a);
            try {
                ae("ngLocale")
            } catch(c) {
                ae("ngLocale", []).provider("$locale", qc)
            }
            ae("ng", ["ngLocale"], ["$provide",
                function(a) {
                    a.provider({
                        $$sanitizeUri: Wc
                    }),
                        a.provider("$compile", Zb).directive({
                            a: Cf,
                            input: Tf,
                            textarea: Tf,
                            form: Hf,
                            script: Ig,
                            select: Lg,
                            style: Ng,
                            option: Mg,
                            ngBind: Wf,
                            ngBindHtml: Yf,
                            ngBindTemplate: Xf,
                            ngClass: $f,
                            ngClassEven: ag,
                            ngClassOdd: _f,
                            ngCloak: bg,
                            ngController: cg,
                            ngForm: If,
                            ngHide: Cg,
                            ngIf: fg,
                            ngInclude: gg,
                            ngInit: ig,
                            ngNonBindable: wg,
                            ngPluralize: xg,
                            ngRepeat: yg,
                            ngShow: Bg,
                            ngStyle: Dg,
                            ngSwitch: Eg,
                            ngSwitchWhen: Fg,
                            ngSwitchDefault: Gg,
                            ngOptions: Kg,
                            ngTransclude: Hg,
                            ngModel: tg,
                            ngList: jg,
                            ngChange: Zf,
                            pattern: Pg,
                            ngPattern: Pg,
                            required: Og,
                            ngRequired: Og,
                            minlength: Rg,
                            ngMinlength: Rg,
                            maxlength: Qg,
                            ngMaxlength: Qg,
                            ngValue: Vf,
                            ngModelOptions: vg
                        }).directive({
                            ngInclude: hg
                        }).directive(Df).directive(dg),
                        a.provider({
                            $anchorScroll: Tb,
                            $animate: Te,
                            $browser: Wb,
                            $cacheFactory: Xb,
                            $controller: bc,
                            $document: cc,
                            $exceptionHandler: dc,
                            $filter: gd,
                            $interpolate: oc,
                            $interval: pc,
                            $http: kc,
                            $httpBackend: mc,
                            $location: Ec,
                            $log: Fc,
                            $parse: Qc,
                            $rootScope: Vc,
                            $q: Rc,
                            $$q: Sc,
                            $sce: $c,
                            $sceDelegate: Zc,
                            $sniffer: _c,
                            $templateCache: Yb,
                            $templateRequest: ad,
                            $$testability: bd,
                            $timeout: cd,
                            $window: fd,
                            $$rAF: Uc,
                            $$asyncCallback: Ub,
                            $$jqLite: Nb
                        })
                }])
        }
        function ob() {
            return++xe
        }
        function pb(a) {
            return a.replace(Ae,
                function(a, b, c, d) {
                    return d ? c.toUpperCase() : c
                }).replace(Be, "Moz$1")
        }
        function qb(a) {
            return ! Fe.test(a)
        }
        function rb(a) {
            var b = a.nodeType;
            return b === qe || !b || b === te
        }
        function sb(a, b) {
            var c, d, e, g, h = b.createDocumentFragment(),
                i = [];
            if (qb(a)) i.push(b.createTextNode(a));
            else {
                for (c = c || h.appendChild(b.createElement("div")), d = (Ge.exec(a) || ["", ""])[1].toLowerCase(), e = Ie[d] || Ie._default, c.innerHTML = e[1] + a.replace(He, "<$1></$2>") + e[2], g = e[0]; g--;) c = c.lastChild;
                i = N(i, c.childNodes),
                    c = h.firstChild,
                    c.textContent = ""
            }
            return h.textContent = "",
                h.innerHTML = "",
                f(i,
                    function(a) {
                        h.appendChild(a)
                    }),
                h
        }
        function tb(a, c) {
            c = c || b;
            var d;
            return (d = Ee.exec(a)) ? [c.createElement(d[1])] : (d = sb(a, c)) ? d.childNodes: []
        }
        function ub(a) {
            if (a instanceof ub) return a;
            var b;
            if (u(a) && (a = ke(a), b = !0), !(this instanceof ub)) {
                if (b && "<" != a.charAt(0)) throw De("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
                return new ub(a)
            }
            b ? Eb(this, tb(a)) : Eb(this, a)
        }
        function vb(a) {
            return a.cloneNode(!0)
        }
        function wb(a, b) {
            if (b || yb(a), a.querySelectorAll) for (var c = a.querySelectorAll("*"), d = 0, e = c.length; e > d; d++) yb(c[d])
        }
        function xb(a, b, c, d) {
            if (s(d)) throw De("offargs", "jqLite#off() does not support the `selector` argument");
            var e = zb(a),
                g = e && e.events,
                h = e && e.handle;
            if (h) if (b) f(b.split(" "),
                function(b) {
                    if (s(c)) {
                        var d = g[b];
                        if (J(d || [], c), d && d.length > 0) return
                    }
                    ze(a, b, h),
                        delete g[b]
                });
            else for (b in g)"$destroy" !== b && ze(a, b, h),
                    delete g[b]
        }
        function yb(a, b) {
            var d = a.ng339,
                e = d && we[d];
            if (e) {
                if (b) return void delete e.data[b];
                e.handle && (e.events.$destroy && e.handle({},
                    "$destroy"), xb(a)),
                    delete we[d],
                    a.ng339 = c
            }
        }
        function zb(a, b) {
            var d = a.ng339,
                e = d && we[d];
            return b && !e && (a.ng339 = d = ob(), e = we[d] = {
                events: {},
                data: {},
                handle: c
            }),
                e
        }
        function Ab(a, b, c) {
            if (rb(a)) {
                var d = s(c),
                    e = !d && b && !t(b),
                    f = !b,
                    g = zb(a, !e),
                    h = g && g.data;
                if (d) h[b] = c;
                else {
                    if (f) return h;
                    if (e) return h && h[b];
                    l(h, b)
                }
            }
        }
        function Bb(a, b) {
            return a.getAttribute ? (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ") > -1 : !1
        }
        function Cb(a, b) {
            b && a.setAttribute && f(b.split(" "),
                function(b) {
                    a.setAttribute("class", ke((" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + ke(b) + " ", " ")))
                })
        }
        function Db(a, b) {
            if (b && a.setAttribute) {
                var c = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
                f(b.split(" "),
                    function(a) {
                        a = ke(a),
                        -1 === c.indexOf(" " + a + " ") && (c += a + " ")
                    }),
                    a.setAttribute("class", ke(c))
            }
        }
        function Eb(a, b) {
            if (b) if (b.nodeType) a[a.length++] = b;
            else {
                var c = b.length;
                if ("number" == typeof c && b.window !== b) {
                    if (c) for (var d = 0; c > d; d++) a[a.length++] = b[d]
                } else a[a.length++] = b
            }
        }
        function Fb(a, b) {
            return Gb(a, "$" + (b || "ngController") + "Controller")
        }
        function Gb(a, b, d) {
            a.nodeType == te && (a = a.documentElement);
            for (var e = je(b) ? b: [b]; a;) {
                for (var f = 0,
                         g = e.length; g > f; f++) if ((d = $d.data(a, e[f])) !== c) return d;
                a = a.parentNode || a.nodeType === ue && a.host
            }
        }
        function Hb(a) {
            for (wb(a, !0); a.firstChild;) a.removeChild(a.firstChild)
        }
        function Ib(a, b) {
            b || wb(a);
            var c = a.parentNode;
            c && c.removeChild(a)
        }
        function Jb(b, c) {
            c = c || a,
                "complete" === c.document.readyState ? c.setTimeout(b) : $d(c).on("load", b)
        }
        function Kb(a, b) {
            var c = Ke[b.toLowerCase()];
            return c && Le[I(a)] && c
        }
        function Lb(a, b) {
            var c = a.nodeName;
            return ("INPUT" === c || "TEXTAREA" === c) && Me[b]
        }
        function Mb(a, b) {
            var c = function(c, d) {
                c.isDefaultPrevented = function() {
                    return c.defaultPrevented
                };
                var e = b[d || c.type],
                    f = e ? e.length: 0;
                if (f) {
                    if (r(c.immediatePropagationStopped)) {
                        var g = c.stopImmediatePropagation;
                        c.stopImmediatePropagation = function() {
                            c.immediatePropagationStopped = !0,
                            c.stopPropagation && c.stopPropagation(),
                            g && g.call(c)
                        }
                    }
                    c.isImmediatePropagationStopped = function() {
                        return c.immediatePropagationStopped === !0
                    },
                    f > 1 && (e = L(e));
                    for (var h = 0; f > h; h++) c.isImmediatePropagationStopped() || e[h].call(a, c)
                }
            };
            return c.elem = a,
                c
        }
        function Nb() {
            this.$get = function() {
                return l(ub, {
                    hasClass: function(a, b) {
                        return a.attr && (a = a[0]),
                            Bb(a, b)
                    },
                    addClass: function(a, b) {
                        return a.attr && (a = a[0]),
                            Db(a, b)
                    },
                    removeClass: function(a, b) {
                        return a.attr && (a = a[0]),
                            Cb(a, b)
                    }
                })
            }
        }
        function Ob(a, b) {
            var c = a && a.$$hashKey;
            if (c) return "function" == typeof c && (c = a.$$hashKey()),
                c;
            var d = typeof a;
            return c = "function" == d || "object" == d && null !== a ? a.$$hashKey = d + ":" + (b || j)() : d + ":" + a
        }
        function Pb(a, b) {
            if (b) {
                var c = 0;
                this.nextUid = function() {
                    return++c
                }
            }
            f(a, this.put, this)
        }
        function Qb(a) {
            var b = a.toString().replace(Qe, ""),
                c = b.match(Ne);
            return c ? "function(" + (c[1] || "").replace(/[\s\r\n]+/, " ") + ")": "fn"
        }
        function Rb(a, b, c) {
            var d, e, g, h;
            if ("function" == typeof a) {
                if (! (d = a.$inject)) {
                    if (d = [], a.length) {
                        if (b) throw u(c) && c || (c = a.name || Qb(a)),
                            Re("strictdi", "{0} is not using explicit annotation and cannot be invoked in strict mode", c);
                        e = a.toString().replace(Qe, ""),
                            g = e.match(Ne),
                            f(g[1].split(Oe),
                                function(a) {
                                    a.replace(Pe,
                                        function(a, b, c) {
                                            d.push(c)
                                        })
                                })
                    }
                    a.$inject = d
                }
            } else je(a) ? (h = a.length - 1, fb(a[h], "fn"), d = a.slice(0, h)) : fb(a, "fn", !0);
            return d
        }
        function Sb(a, b) {
            function d(a) {
                return function(b, c) {
                    return t(b) ? void f(b, i(a)) : a(b, c)
                }
            }
            function e(a, b) {
                if (gb(a, "service"), (x(b) || je(b)) && (b = A.instantiate(b)), !b.$get) throw Re("pget", "Provider '{0}' must define $get factory method.", a);
                return z[a + v] = b
            }
            function g(a, b) {
                return function() {
                    var c = C.invoke(b, this);
                    if (r(c)) throw Re("undef", "Provider '{0}' must return a value from $get factory method.", a);
                    return c
                }
            }
            function h(a, b, c) {
                return e(a, {
                    $get: c !== !1 ? g(a, b) : b
                })
            }
            function j(a, b) {
                return h(a, ["$injector",
                    function(a) {
                        return a.instantiate(b)
                    }])
            }
            function k(a, b) {
                return h(a, q(b), !1)
            }
            function l(a, b) {
                gb(a, "constant"),
                    z[a] = b,
                    B[a] = b
            }
            function m(a, b) {
                var c = A.get(a + v),
                    d = c.$get;
                c.$get = function() {
                    var a = C.invoke(d, c);
                    return C.invoke(b, null, {
                        $delegate: a
                    })
                }
            }
            function n(a) {
                var b, c = [];
                return f(a,
                    function(a) {
                        function d(a) {
                            var b, c;
                            for (b = 0, c = a.length; c > b; b++) {
                                var d = a[b],
                                    e = A.get(d[0]);
                                e[d[1]].apply(e, d[2])
                            }
                        }
                        if (!y.get(a)) {
                            y.put(a, !0);
                            try {
                                u(a) ? (b = ae(a), c = c.concat(n(b.requires)).concat(b._runBlocks), d(b._invokeQueue), d(b._configBlocks)) : x(a) ? c.push(A.invoke(a)) : je(a) ? c.push(A.invoke(a)) : fb(a, "module")
                            } catch(e) {
                                throw je(a) && (a = a[a.length - 1]),
                                e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack),
                                    Re("modulerr", "Failed to instantiate module {0} due to:\n{1}", a, e.stack || e.message || e)
                            }
                        }
                    }),
                    c
            }
            function p(a, c) {
                function d(b, d) {
                    if (a.hasOwnProperty(b)) {
                        if (a[b] === s) throw Re("cdep", "Circular dependency found: {0}", b + " <- " + w.join(" <- "));
                        return a[b]
                    }
                    try {
                        return w.unshift(b),
                            a[b] = s,
                            a[b] = c(b, d)
                    } catch(e) {
                        throw a[b] === s && delete a[b],
                            e
                    } finally {
                        w.shift()
                    }
                }
                function e(a, c, e, f) {
                    "string" == typeof e && (f = e, e = null);
                    var g, h, i, j = [],
                        k = Sb.$$annotate(a, b, f);
                    for (h = 0, g = k.length; g > h; h++) {
                        if (i = k[h], "string" != typeof i) throw Re("itkn", "Incorrect injection token! Expected service name as string, got {0}", i);
                        j.push(e && e.hasOwnProperty(i) ? e[i] : d(i, f))
                    }
                    return je(a) && (a = a[g]),
                        a.apply(c, j)
                }
                function f(a, b, c) {
                    var d = Object.create((je(a) ? a[a.length - 1] : a).prototype || null),
                        f = e(a, d, b, c);
                    return t(f) || x(f) ? f: d
                }
                return {
                    invoke: e,
                    instantiate: f,
                    get: d,
                    annotate: Sb.$$annotate,
                    has: function(b) {
                        return z.hasOwnProperty(b + v) || a.hasOwnProperty(b)
                    }
                }
            }
            b = b === !0;
            var s = {},
                v = "Provider",
                w = [],
                y = new Pb([], !0),
                z = {
                    $provide: {
                        provider: d(e),
                        factory: d(h),
                        service: d(j),
                        value: d(k),
                        constant: d(l),
                        decorator: m
                    }
                },
                A = z.$injector = p(z,
                    function(a, b) {
                        throw ge.isString(b) && w.push(b),
                            Re("unpr", "Unknown provider: {0}", w.join(" <- "))
                    }),
                B = {},
                C = B.$injector = p(B,
                    function(a, b) {
                        var d = A.get(a + v, b);
                        return C.invoke(d.$get, d, c, a)
                    });
            return f(n(a),
                function(a) {
                    C.invoke(a || o)
                }),
                C
        }
        function Tb() {
            var a = !0;
            this.disableAutoScrolling = function() {
                a = !1
            },
                this.$get = ["$window", "$location", "$rootScope",
                    function(b, c, d) {
                        function e(a) {
                            var b = null;
                            return Array.prototype.some.call(a,
                                function(a) {
                                    return "a" === I(a) ? (b = a, !0) : void 0
                                }),
                                b
                        }
                        function f() {
                            var a = h.yOffset;
                            if (x(a)) a = a();
                            else if (G(a)) {
                                var c = a[0],
                                    d = b.getComputedStyle(c);
                                a = "fixed" !== d.position ? 0 : c.getBoundingClientRect().bottom
                            } else v(a) || (a = 0);
                            return a
                        }
                        function g(a) {
                            if (a) {
                                a.scrollIntoView();
                                var c = f();
                                if (c) {
                                    var d = a.getBoundingClientRect().top;
                                    b.scrollBy(0, d - c)
                                }
                            } else b.scrollTo(0, 0)
                        }
                        function h() {
                            var a, b = c.hash();
                            b ? (a = i.getElementById(b)) ? g(a) : (a = e(i.getElementsByName(b))) ? g(a) : "top" === b && g(null) : g(null)
                        }
                        var i = b.document;
                        return a && d.$watch(function() {
                                return c.hash()
                            },
                            function(a, b) { (a !== b || "" !== a) && Jb(function() {
                                d.$evalAsync(h)
                            })
                            }),
                            h
                    }]
        }
        function Ub() {
            this.$get = ["$$rAF", "$timeout",
                function(a, b) {
                    return a.supported ?
                        function(b) {
                            return a(b)
                        }: function(a) {
                        return b(a, 0, !1)
                    }
                }]
        }
        function Vb(a, b, d, e) {
            function g(a) {
                try {
                    a.apply(null, O(arguments, 1))
                } finally {
                    if (x--, 0 === x) for (; y.length;) try {
                        y.pop()()
                    } catch(b) {
                        d.error(b)
                    }
                }
            }
            function h(a) {
                var b = a.indexOf("#");
                return - 1 === b ? "": a.substr(b + 1)
            }
            function i(a, b) { !
                function c() {
                    f(A,
                        function(a) {
                            a()
                        }),
                        z = b(c, a)
                } ()
            }
            function j() {
                k(),
                    l()
            }
            function k() {
                B = a.history.state,
                    B = r(B) ? null: B,
                M(B, I) && (B = I),
                    I = B
            }
            function l() { (D !== n.url() || C !== B) && (D = n.url(), C = B, f(G,
                function(a) {
                    a(n.url(), B)
                }))
            }
            function m(a) {
                try {
                    return decodeURIComponent(a)
                } catch(b) {
                    return a
                }
            }
            var n = this,
                p = b[0],
                q = a.location,
                s = a.history,
                t = a.setTimeout,
                v = a.clearTimeout,
                w = {};
            n.isMock = !1;
            var x = 0,
                y = [];
            n.$$completeOutstandingRequest = g,
                n.$$incOutstandingRequestCount = function() {
                    x++
                },
                n.notifyWhenNoOutstandingRequests = function(a) {
                    f(A,
                        function(a) {
                            a()
                        }),
                        0 === x ? a() : y.push(a)
                };
            var z, A = [];
            n.addPollFn = function(a) {
                return r(z) && i(100, t),
                    A.push(a),
                    a
            };
            var B, C, D = q.href,
                E = b.find("base"),
                F = null;
            k(),
                C = B,
                n.url = function(b, c, d) {
                    if (r(d) && (d = null), q !== a.location && (q = a.location), s !== a.history && (s = a.history), b) {
                        var f = C === d;
                        if (D === b && (!e.history || f)) return n;
                        var g = D && vc(D) === vc(b);
                        return D = b,
                            C = d,
                            !e.history || g && f ? (g || (F = b), c ? q.replace(b) : g ? q.hash = h(b) : q.href = b) : (s[c ? "replaceState": "pushState"](d, "", b), k(), C = B),
                            n
                    }
                    return F || q.href.replace(/%27/g, "'")
                },
                n.state = function() {
                    return B
                };
            var G = [],
                H = !1,
                I = null;
            n.onUrlChange = function(b) {
                return H || (e.history && $d(a).on("popstate", j), $d(a).on("hashchange", j), H = !0),
                    G.push(b),
                    b
            },
                n.$$checkUrlChange = l,
                n.baseHref = function() {
                    var a = E.attr("href");
                    return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, "") : ""
                };
            var J = {},
                K = "",
                L = n.baseHref();
            n.cookies = function(a, b) {
                var e, f, g, h, i;
                if (!a) {
                    if (p.cookie !== K) for (K = p.cookie, f = K.split("; "), J = {},
                                                 h = 0; h < f.length; h++) g = f[h],
                        i = g.indexOf("="),
                    i > 0 && (a = m(g.substring(0, i)), J[a] === c && (J[a] = m(g.substring(i + 1))));
                    return J
                }
                b === c ? p.cookie = encodeURIComponent(a) + "=;path=" + L + ";expires=Thu, 01 Jan 1970 00:00:00 GMT": u(b) && (e = (p.cookie = encodeURIComponent(a) + "=" + encodeURIComponent(b) + ";path=" + L).length + 1, e > 4096 && d.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + e + " > 4096 bytes)!"))
            },
                n.defer = function(a, b) {
                    var c;
                    return x++,
                        c = t(function() {
                                delete w[c],
                                    g(a)
                            },
                            b || 0),
                        w[c] = !0,
                        c
                },
                n.defer.cancel = function(a) {
                    return w[a] ? (delete w[a], v(a), g(o), !0) : !1
                }
        }
        function Wb() {
            this.$get = ["$window", "$log", "$sniffer", "$document",
                function(a, b, c, d) {
                    return new Vb(a, d, b, c)
                }]
        }
        function Xb() {
            this.$get = function() {
                function a(a, c) {
                    function e(a) {
                        a != m && (n ? n == a && (n = a.n) : n = a, f(a.n, a.p), f(a, m), m = a, m.n = null)
                    }
                    function f(a, b) {
                        a != b && (a && (a.p = b), b && (b.n = a))
                    }
                    if (a in b) throw d("$cacheFactory")("iid", "CacheId '{0}' is already taken!", a);
                    var g = 0,
                        h = l({},
                            c, {
                                id: a
                            }),
                        i = {},
                        j = c && c.capacity || Number.MAX_VALUE,
                        k = {},
                        m = null,
                        n = null;
                    return b[a] = {
                        put: function(a, b) {
                            if (j < Number.MAX_VALUE) {
                                var c = k[a] || (k[a] = {
                                        key: a
                                    });
                                e(c)
                            }
                            if (!r(b)) return a in i || g++,
                                i[a] = b,
                            g > j && this.remove(n.key),
                                b
                        },
                        get: function(a) {
                            if (j < Number.MAX_VALUE) {
                                var b = k[a];
                                if (!b) return;
                                e(b)
                            }
                            return i[a]
                        },
                        remove: function(a) {
                            if (j < Number.MAX_VALUE) {
                                var b = k[a];
                                if (!b) return;
                                b == m && (m = b.p),
                                b == n && (n = b.n),
                                    f(b.n, b.p),
                                    delete k[a]
                            }
                            delete i[a],
                                g--
                        },
                        removeAll: function() {
                            i = {},
                                g = 0,
                                k = {},
                                m = n = null
                        },
                        destroy: function() {
                            i = null,
                                h = null,
                                k = null,
                                delete b[a]
                        },
                        info: function() {
                            return l({},
                                h, {
                                    size: g
                                })
                        }
                    }
                }
                var b = {};
                return a.info = function() {
                    var a = {};
                    return f(b,
                        function(b, c) {
                            a[c] = b.info()
                        }),
                        a
                },
                    a.get = function(a) {
                        return b[a]
                    },
                    a
            }
        }
        function Yb() {
            this.$get = ["$cacheFactory",
                function(a) {
                    return a("templates")
                }]
        }
        function Zb(a, d) {
            function e(a, b) {
                var c = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,
                    d = {};
                return f(a,
                    function(a, e) {
                        var f = a.match(c);
                        if (!f) throw Ue("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", b, e, a);
                        d[e] = {
                            mode: f[1][0],
                            collection: "*" === f[2],
                            optional: "?" === f[3],
                            attrName: f[4] || e
                        }
                    }),
                    d
            }
            var g = {},
                h = "Directive",
                j = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
                k = /(([\w\-]+)(?:\:([^;]+))?;?)/,
                m = H("ngSrc,ngSrcset,src,srcset"),
                r = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
                v = /^(on[a-z]+|formaction)$/;
            this.directive = function y(b, c) {
                return gb(b, "directive"),
                    u(b) ? (eb(c, "directiveFactory"), g.hasOwnProperty(b) || (g[b] = [], a.factory(b + h, ["$injector", "$exceptionHandler",
                        function(a, c) {
                            var d = [];
                            return f(g[b],
                                function(f, g) {
                                    try {
                                        var h = a.invoke(f);
                                        x(h) ? h = {
                                            compile: q(h)
                                        }: !h.compile && h.link && (h.compile = q(h.link)),
                                            h.priority = h.priority || 0,
                                            h.index = g,
                                            h.name = h.name || b,
                                            h.require = h.require || h.controller && h.name,
                                            h.restrict = h.restrict || "EA",
                                        t(h.scope) && (h.$$isolateBindings = e(h.scope, h.name)),
                                            d.push(h)
                                    } catch(i) {
                                        c(i)
                                    }
                                }),
                                d
                        }])), g[b].push(c)) : f(b, i(y)),
                    this
            },
                this.aHrefSanitizationWhitelist = function(a) {
                    return s(a) ? (d.aHrefSanitizationWhitelist(a), this) : d.aHrefSanitizationWhitelist()
                },
                this.imgSrcSanitizationWhitelist = function(a) {
                    return s(a) ? (d.imgSrcSanitizationWhitelist(a), this) : d.imgSrcSanitizationWhitelist()
                };
            var w = !0;
            this.debugInfoEnabled = function(a) {
                return s(a) ? (w = a, this) : w
            },
                this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri",
                    function(a, d, e, i, q, s, y, z, B, C, D) {
                        function E(a, b) {
                            try {
                                a.addClass(b)
                            } catch(c) {}
                        }
                        function F(a, b, c, d, e) {
                            a instanceof $d || (a = $d(a)),
                                f(a,
                                    function(b, c) {
                                        b.nodeType == re && b.nodeValue.match(/\S+/) && (a[c] = $d(b).wrap("<span></span>").parent()[0])
                                    });
                            var g = H(a, b, a, c, d, e);
                            F.$$addScopeClass(a);
                            var h = null;
                            return function(b, c, d) {
                                eb(b, "scope"),
                                    d = d || {};
                                var e = d.parentBoundTranscludeFn,
                                    f = d.transcludeControllers,
                                    i = d.futureParentElement;
                                e && e.$$boundTransclude && (e = e.$$boundTransclude),
                                h || (h = G(i));
                                var j;
                                if (j = "html" !== h ? $d($(h, $d("<div>").append(a).html())) : c ? Je.clone.call(a) : a, f) for (var k in f) j.data("$" + k + "Controller", f[k].instance);
                                return F.$$addScopeInfo(j, b),
                                c && c(j, b),
                                g && g(b, j, j, e),
                                    j
                            }
                        }
                        function G(a) {
                            var b = a && a[0];
                            return b && "foreignobject" !== I(b) && b.toString().match(/SVG/) ? "svg": "html"
                        }
                        function H(a, b, d, e, f, g) {
                            function h(a, d, e, f) {
                                var g, h, i, j, k, l, m, n, q;
                                if (o) {
                                    var r = d.length;
                                    for (q = new Array(r), k = 0; k < p.length; k += 3) m = p[k],
                                        q[m] = d[m]
                                } else q = d;
                                for (k = 0, l = p.length; l > k;) i = q[p[k++]],
                                    g = p[k++],
                                    h = p[k++],
                                    g ? (g.scope ? (j = a.$new(), F.$$addScopeInfo($d(i), j)) : j = a, n = g.transcludeOnThisElement ? K(a, g.transclude, f, g.elementTranscludeOnThisElement) : !g.templateOnThisElement && f ? f: !f && b ? K(a, b) : null, g(h, j, i, e, n)) : h && h(a, i.childNodes, c, f)
                            }
                            for (var i, j, k, l, m, n, o, p = [], q = 0; q < a.length; q++) i = new gb,
                                j = L(a[q], [], i, 0 === q ? e: c, f),
                                k = j.length ? Q(j, a[q], i, b, d, null, [], [], g) : null,
                            k && k.scope && F.$$addScopeClass(i.$$element),
                                m = k && k.terminal || !(l = a[q].childNodes) || !l.length ? null: H(l, k ? (k.transcludeOnThisElement || !k.templateOnThisElement) && k.transclude: b),
                            (k || m) && (p.push(q, k, m), n = !0, o = o || k),
                                g = null;
                            return n ? h: null
                        }
                        function K(a, b, c) {
                            var d = function(d, e, f, g, h) {
                                return d || (d = a.$new(!1, h), d.$$transcluded = !0),
                                    b(d, e, {
                                        parentBoundTranscludeFn: c,
                                        transcludeControllers: f,
                                        futureParentElement: g
                                    })
                            };
                            return d
                        }
                        function L(a, b, c, d, e) {
                            var f, g, h = a.nodeType,
                                i = c.$attr;
                            switch (h) {
                                case qe:
                                    S(b, $b(I(a)), "E", d, e);
                                    for (var l, m, n, o, p, q, r = a.attributes,
                                             s = 0,
                                             v = r && r.length; v > s; s++) {
                                        var w = !1,
                                            x = !1;
                                        l = r[s],
                                            m = l.name,
                                            p = ke(l.value),
                                            o = $b(m),
                                        (q = lb.test(o)) && (m = m.replace(Ve, "").substr(8).replace(/_(.)/g,
                                            function(a, b) {
                                                return b.toUpperCase()
                                            }));
                                        var y = o.replace(/(Start|End)$/, "");
                                        U(y) && o === y + "Start" && (w = m, x = m.substr(0, m.length - 5) + "end", m = m.substr(0, m.length - 6)),
                                            n = $b(m.toLowerCase()),
                                            i[n] = m,
                                        (q || !c.hasOwnProperty(n)) && (c[n] = p, Kb(a, n) && (c[n] = !0)),
                                            ab(a, b, p, n, q),
                                            S(b, n, "A", d, e, w, x)
                                    }
                                    if (g = a.className, t(g) && (g = g.animVal), u(g) && "" !== g) for (; f = k.exec(g);) n = $b(f[2]),
                                    S(b, n, "C", d, e) && (c[n] = ke(f[3])),
                                        g = g.substr(f.index + f[0].length);
                                    break;
                                case re:
                                    Z(b, a.nodeValue);
                                    break;
                                case se:
                                    try {
                                        f = j.exec(a.nodeValue),
                                        f && (n = $b(f[1]), S(b, n, "M", d, e) && (c[n] = ke(f[2])))
                                    } catch(z) {}
                            }
                            return b.sort(X),
                                b
                        }
                        function N(a, b, c) {
                            var d = [],
                                e = 0;
                            if (b && a.hasAttribute && a.hasAttribute(b)) {
                                do {
                                    if (!a) throw Ue("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", b, c);
                                    a.nodeType == qe && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--), d.push(a), a = a.nextSibling
                                } while ( e > 0 )
                            } else d.push(a);
                            return $d(d)
                        }
                        function P(a, b, c) {
                            return function(d, e, f, g, h) {
                                return e = N(e[0], b, c),
                                    a(d, e, f, g, h)
                            }
                        }
                        function Q(a, g, h, i, j, k, l, m, n) {
                            function o(a, b, c, d) {
                                a && (c && (a = P(a, c, d)), a.require = z.require, a.directiveName = B, (I === z || z.$$isolateScope) && (a = db(a, {
                                    isolateScope: !0
                                })), l.push(a)),
                                b && (c && (b = P(b, c, d)), b.require = z.require, b.directiveName = B, (I === z || z.$$isolateScope) && (b = db(b, {
                                    isolateScope: !0
                                })), m.push(b))
                            }
                            function p(a, b, c, d) {
                                var e, g, h = "data",
                                    i = !1,
                                    j = c;
                                if (u(b)) {
                                    if (g = b.match(r), b = b.substring(g[0].length), g[3] && (g[1] ? g[3] = null: g[1] = g[3]), "^" === g[1] ? h = "inheritedData": "^^" === g[1] && (h = "inheritedData", j = c.parent()), "?" === g[2] && (i = !0), e = null, d && "data" === h && (e = d[b]) && (e = e.instance), e = e || j[h]("$" + b + "Controller"), !e && !i) throw Ue("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", b, a);
                                    return e || null
                                }
                                return je(b) && (e = [], f(b,
                                    function(b) {
                                        e.push(p(a, b, c, d))
                                    })),
                                    e
                            }
                            function v(a, b, e, i, j) {
                                function k(a, b, d) {
                                    var e;
                                    return A(a) || (d = b, b = a, a = c),
                                    U && (e = v),
                                    d || (d = U ? x.parent() : x),
                                        j(a, b, e, d, D)
                                }
                                var n, o, r, t, u, v, w, x, z;
                                if (g === e ? (z = h, x = h.$$element) : (x = $d(e), z = new gb(x, h)), I && (u = b.$new(!0)), j && (w = k, w.$$boundTransclude = j), H && (y = {},
                                        v = {},
                                        f(H,
                                            function(a) {
                                                var c, d = {
                                                    $scope: a === I || a.$$isolateScope ? u: b,
                                                    $element: x,
                                                    $attrs: z,
                                                    $transclude: w
                                                };
                                                t = a.controller,
                                                "@" == t && (t = z[a.name]),
                                                    c = s(t, d, !0, a.controllerAs),
                                                    v[a.name] = c,
                                                U || x.data("$" + a.name + "Controller", c.instance),
                                                    y[a.name] = c
                                            })), I) {
                                    F.$$addScopeInfo(x, u, !0, !(J && (J === I || J === I.$$originalDirective))),
                                        F.$$addScopeClass(x, !0);
                                    var B = y && y[I.name],
                                        C = u;
                                    B && B.identifier && I.bindToController === !0 && (C = B.instance),
                                        f(u.$$isolateBindings = I.$$isolateBindings,
                                            function(a, c) {
                                                var e, f, g, h, i = a.attrName,
                                                    j = a.optional,
                                                    k = a.mode;
                                                switch (k) {
                                                    case "@":
                                                        z.$observe(i,
                                                            function(a) {
                                                                C[c] = a
                                                            }),
                                                            z.$$observers[i].$$scope = b,
                                                        z[i] && (C[c] = d(z[i])(b));
                                                        break;
                                                    case "=":
                                                        if (j && !z[i]) return;
                                                        f = q(z[i]),
                                                            h = f.literal ? M: function(a, b) {
                                                                return a === b || a !== a && b !== b
                                                            },
                                                            g = f.assign ||
                                                                function() {
                                                                    throw e = C[c] = f(b),
                                                                        Ue("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", z[i], I.name)
                                                                },
                                                            e = C[c] = f(b);
                                                        var l = function(a) {
                                                            return h(a, C[c]) || (h(a, e) ? g(b, a = C[c]) : C[c] = a),
                                                                e = a
                                                        };
                                                        l.$stateful = !0;
                                                        var m;
                                                        m = a.collection ? b.$watchCollection(z[i], l) : b.$watch(q(z[i], l), null, f.literal),
                                                            u.$on("$destroy", m);
                                                        break;
                                                    case "&":
                                                        f = q(z[i]),
                                                            C[c] = function(a) {
                                                                return f(b, a)
                                                            }
                                                }
                                            })
                                }
                                for (y && (f(y,
                                    function(a) {
                                        a()
                                    }), y = null), n = 0, o = l.length; o > n; n++) r = l[n],
                                    fb(r, r.isolateScope ? u: b, x, z, r.require && p(r.directiveName, r.require, x, v), w);
                                var D = b;
                                for (I && (I.template || null === I.templateUrl) && (D = u), a && a(D, e.childNodes, c, j), n = m.length - 1; n >= 0; n--) r = m[n],
                                    fb(r, r.isolateScope ? u: b, x, z, r.require && p(r.directiveName, r.require, x, v), w)
                            }
                            n = n || {};
                            for (var w, y, z, B, C, D, E, G = -Number.MAX_VALUE,
                                     H = n.controllerDirectives,
                                     I = n.newIsolateScopeDirective,
                                     J = n.templateDirective,
                                     K = n.nonTlbTranscludeDirective,
                                     Q = !1,
                                     S = !1,
                                     U = n.hasElementTranscludeDirective,
                                     X = h.$$element = $d(g), Z = k, _ = i, ab = 0, cb = a.length; cb > ab; ab++) {
                                z = a[ab];
                                var eb = z.$$start,
                                    hb = z.$$end;
                                if (eb && (X = N(g, eb, hb)), C = c, G > z.priority) break;
                                if ((E = z.scope) && (z.templateUrl || (t(E) ? (Y("new/isolated scope", I || w, z, X), I = z) : Y("new/isolated scope", I, z, X)), w = w || z), B = z.name, !z.templateUrl && z.controller && (E = z.controller, H = H || {},
                                        Y("'" + B + "' controller", H[B], z, X), H[B] = z), (E = z.transclude) && (Q = !0, z.$$tlb || (Y("transclusion", K, z, X), K = z), "element" == E ? (U = !0, G = z.priority, C = X, X = h.$$element = $d(b.createComment(" " + B + ": " + h[B] + " ")), g = X[0], bb(j, O(C), g), _ = F(C, i, G, Z && Z.name, {
                                        nonTlbTranscludeDirective: K
                                    })) : (C = $d(vb(g)).contents(), X.empty(), _ = F(C, i))), z.template) if (S = !0, Y("template", J, z, X), J = z, E = x(z.template) ? z.template(X, h) : z.template, E = kb(E), z.replace) {
                                    if (Z = z, C = qb(E) ? [] : ac($(z.templateNamespace, ke(E))), g = C[0], 1 != C.length || g.nodeType !== qe) throw Ue("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", B, "");
                                    bb(j, X, g);
                                    var ib = {
                                            $attr: {}
                                        },
                                        jb = L(g, [], ib),
                                        lb = a.splice(ab + 1, a.length - (ab + 1));
                                    I && R(jb),
                                        a = a.concat(jb).concat(lb),
                                        V(h, ib),
                                        cb = a.length
                                } else X.html(E);
                                if (z.templateUrl) S = !0,
                                    Y("template", J, z, X),
                                    J = z,
                                z.replace && (Z = z),
                                    v = W(a.splice(ab, a.length - ab), X, h, j, Q && _, l, m, {
                                        controllerDirectives: H,
                                        newIsolateScopeDirective: I,
                                        templateDirective: J,
                                        nonTlbTranscludeDirective: K
                                    }),
                                    cb = a.length;
                                else if (z.compile) try {
                                    D = z.compile(X, h, _),
                                        x(D) ? o(null, D, eb, hb) : D && o(D.pre, D.post, eb, hb)
                                } catch(mb) {
                                    e(mb, T(X))
                                }
                                z.terminal && (v.terminal = !0, G = Math.max(G, z.priority))
                            }
                            return v.scope = w && w.scope === !0,
                                v.transcludeOnThisElement = Q,
                                v.elementTranscludeOnThisElement = U,
                                v.templateOnThisElement = S,
                                v.transclude = _,
                                n.hasElementTranscludeDirective = U,
                                v
                        }
                        function R(a) {
                            for (var b = 0,
                                     c = a.length; c > b; b++) a[b] = n(a[b], {
                                $$isolateScope: !0
                            })
                        }
                        function S(b, d, f, i, j, k, l) {
                            if (d === j) return null;
                            var m = null;
                            if (g.hasOwnProperty(d)) for (var o, p = a.get(d + h), q = 0, r = p.length; r > q; q++) try {
                                o = p[q],
                                (i === c || i > o.priority) && -1 != o.restrict.indexOf(f) && (k && (o = n(o, {
                                    $$start: k,
                                    $$end: l
                                })), b.push(o), m = o)
                            } catch(s) {
                                e(s)
                            }
                            return m
                        }
                        function U(b) {
                            if (g.hasOwnProperty(b)) for (var c, d = a.get(b + h), e = 0, f = d.length; f > e; e++) if (c = d[e], c.multiElement) return ! 0;
                            return ! 1
                        }
                        function V(a, b) {
                            var c = b.$attr,
                                d = a.$attr,
                                e = a.$$element;
                            f(a,
                                function(d, e) {
                                    "$" != e.charAt(0) && (b[e] && b[e] !== d && (d += ("style" === e ? ";": " ") + b[e]), a.$set(e, d, !0, c[e]))
                                }),
                                f(b,
                                    function(b, f) {
                                        "class" == f ? (E(e, b), a["class"] = (a["class"] ? a["class"] + " ": "") + b) : "style" == f ? (e.attr("style", e.attr("style") + ";" + b), a.style = (a.style ? a.style + ";": "") + b) : "$" == f.charAt(0) || a.hasOwnProperty(f) || (a[f] = b, d[f] = c[f])
                                    })
                        }
                        function W(a, b, c, d, e, g, h, j) {
                            var k, l, m = [],
                                o = b[0],
                                p = a.shift(),
                                q = n(p, {
                                    templateUrl: null,
                                    transclude: null,
                                    replace: null,
                                    $$originalDirective: p
                                }),
                                r = x(p.templateUrl) ? p.templateUrl(b, c) : p.templateUrl,
                                s = p.templateNamespace;
                            return b.empty(),
                                i(B.getTrustedResourceUrl(r)).then(function(i) {
                                    var n, u, v, w;
                                    if (i = kb(i), p.replace) {
                                        if (v = qb(i) ? [] : ac($(s, ke(i))), n = v[0], 1 != v.length || n.nodeType !== qe) throw Ue("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", p.name, r);
                                        u = {
                                            $attr: {}
                                        },
                                            bb(d, b, n);
                                        var x = L(n, [], u);
                                        t(p.scope) && R(x),
                                            a = x.concat(a),
                                            V(c, u)
                                    } else n = o,
                                        b.html(i);
                                    for (a.unshift(q), k = Q(a, n, c, e, b, p, g, h, j), f(d,
                                        function(a, c) {
                                            a == n && (d[c] = b[0])
                                        }), l = H(b[0].childNodes, e); m.length;) {
                                        var y = m.shift(),
                                            z = m.shift(),
                                            A = m.shift(),
                                            B = m.shift(),
                                            C = b[0];
                                        if (!y.$$destroyed) {
                                            if (z !== o) {
                                                var D = z.className;
                                                j.hasElementTranscludeDirective && p.replace || (C = vb(n)),
                                                    bb(A, $d(z), C),
                                                    E($d(C), D)
                                            }
                                            w = k.transcludeOnThisElement ? K(y, k.transclude, B) : B,
                                                k(l, y, C, d, w)
                                        }
                                    }
                                    m = null
                                }),
                                function(a, b, c, d, e) {
                                    var f = e;
                                    b.$$destroyed || (m ? m.push(b, c, d, f) : (k.transcludeOnThisElement && (f = K(b, k.transclude, e)), k(l, b, c, d, f)))
                                }
                        }
                        function X(a, b) {
                            var c = b.priority - a.priority;
                            return 0 !== c ? c: a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
                        }
                        function Y(a, b, c, d) {
                            if (b) throw Ue("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", b.name, c.name, a, T(d))
                        }
                        function Z(a, b) {
                            var c = d(b, !0);
                            c && a.push({
                                priority: 0,
                                compile: function(a) {
                                    var b = a.parent(),
                                        d = !!b.length;
                                    return d && F.$$addBindingClass(b),
                                        function(a, b) {
                                            var e = b.parent();
                                            d || F.$$addBindingClass(e),
                                                F.$$addBindingInfo(e, c.expressions),
                                                a.$watch(c,
                                                    function(a) {
                                                        b[0].nodeValue = a
                                                    })
                                        }
                                }
                            })
                        }
                        function $(a, c) {
                            switch (a = Ud(a || "html")) {
                                case "svg":
                                case "math":
                                    var d = b.createElement("div");
                                    return d.innerHTML = "<" + a + ">" + c + "</" + a + ">",
                                        d.childNodes[0].childNodes;
                                default:
                                    return c
                            }
                        }
                        function _(a, b) {
                            if ("srcdoc" == b) return B.HTML;
                            var c = I(a);
                            return "xlinkHref" == b || "form" == c && "action" == b || "img" != c && ("src" == b || "ngSrc" == b) ? B.RESOURCE_URL: void 0
                        }
                        function ab(a, b, c, e, f) {
                            var g = _(a, e);
                            f = m[e] || f;
                            var h = d(c, !0, g, f);
                            if (h) {
                                if ("multiple" === e && "select" === I(a)) throw Ue("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", T(a));
                                b.push({
                                    priority: 100,
                                    compile: function() {
                                        return {
                                            pre: function(a, b, i) {
                                                var j = i.$$observers || (i.$$observers = {});
                                                if (v.test(e)) throw Ue("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                                var k = i[e];
                                                k !== c && (h = k && d(k, !0, g, f), c = k),
                                                h && (i[e] = h(a), (j[e] || (j[e] = [])).$$inter = !0, (i.$$observers && i.$$observers[e].$$scope || a).$watch(h,
                                                    function(a, b) {
                                                        "class" === e && a != b ? i.$updateClass(a, b) : i.$set(e, a)
                                                    }))
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        function bb(a, c, d) {
                            var e, f, g = c[0],
                                h = c.length,
                                i = g.parentNode;
                            if (a) for (e = 0, f = a.length; f > e; e++) if (a[e] == g) {
                                a[e++] = d;
                                for (var j = e,
                                         k = j + h - 1,
                                         l = a.length; l > j; j++, k++) l > k ? a[j] = a[k] : delete a[j];
                                a.length -= h - 1,
                                a.context === g && (a.context = d);
                                break
                            }
                            i && i.replaceChild(d, g);
                            var m = b.createDocumentFragment();
                            m.appendChild(g),
                                $d(d).data($d(g).data()),
                                _d ? (ie = !0, _d.cleanData([g])) : delete $d.cache[g[$d.expando]];
                            for (var n = 1,
                                     o = c.length; o > n; n++) {
                                var p = c[n];
                                $d(p).remove(),
                                    m.appendChild(p),
                                    delete c[n]
                            }
                            c[0] = d,
                                c.length = 1
                        }
                        function db(a, b) {
                            return l(function() {
                                    return a.apply(null, arguments)
                                },
                                a, b)
                        }
                        function fb(a, b, c, d, f, g) {
                            try {
                                a(b, c, d, f, g)
                            } catch(h) {
                                e(h, T(c))
                            }
                        }
                        var gb = function(a, b) {
                            if (b) {
                                var c, d, e, f = Object.keys(b);
                                for (c = 0, d = f.length; d > c; c++) e = f[c],
                                    this[e] = b[e]
                            } else this.$attr = {};
                            this.$$element = a
                        };
                        gb.prototype = {
                            $normalize: $b,
                            $addClass: function(a) {
                                a && a.length > 0 && C.addClass(this.$$element, a)
                            },
                            $removeClass: function(a) {
                                a && a.length > 0 && C.removeClass(this.$$element, a)
                            },
                            $updateClass: function(a, b) {
                                var c = _b(a, b);
                                c && c.length && C.addClass(this.$$element, c);
                                var d = _b(b, a);
                                d && d.length && C.removeClass(this.$$element, d)
                            },
                            $set: function(a, b, d, g) {
                                var h, i = this.$$element[0],
                                    j = Kb(i, a),
                                    k = Lb(i, a),
                                    l = a;
                                if (j ? (this.$$element.prop(a, b), g = j) : k && (this[k] = b, l = k), this[a] = b, g ? this.$attr[a] = g: (g = this.$attr[a], g || (this.$attr[a] = g = cb(a, "-"))), h = I(this.$$element), "a" === h && "href" === a || "img" === h && "src" === a) this[a] = b = D(b, "src" === a);
                                else if ("img" === h && "srcset" === a) {
                                    for (var m = "",
                                             n = ke(b), o = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, p = /\s/.test(n) ? o: /(,)/, q = n.split(p), r = Math.floor(q.length / 2), s = 0; r > s; s++) {
                                        var t = 2 * s;
                                        m += D(ke(q[t]), !0),
                                            m += " " + ke(q[t + 1])
                                    }
                                    var u = ke(q[2 * s]).split(/\s/);
                                    m += D(ke(u[0]), !0),
                                    2 === u.length && (m += " " + ke(u[1])),
                                        this[a] = b = m
                                }
                                d !== !1 && (null === b || b === c ? this.$$element.removeAttr(g) : this.$$element.attr(g, b));
                                var v = this.$$observers;
                                v && f(v[l],
                                    function(a) {
                                        try {
                                            a(b)
                                        } catch(c) {
                                            e(c)
                                        }
                                    })
                            },
                            $observe: function(a, b) {
                                var c = this,
                                    d = c.$$observers || (c.$$observers = jb()),
                                    e = d[a] || (d[a] = []);
                                return e.push(b),
                                    y.$evalAsync(function() { ! e.$$inter && c.hasOwnProperty(a) && b(c[a])
                                    }),
                                    function() {
                                        J(e, b)
                                    }
                            }
                        };
                        var hb = d.startSymbol(),
                            ib = d.endSymbol(),
                            kb = "{{" == hb || "}}" == ib ? p: function(a) {
                                return a.replace(/\{\{/g, hb).replace(/}}/g, ib)
                            },
                            lb = /^ngAttr[A-Z]/;
                        return F.$$addBindingInfo = w ?
                            function(a, b) {
                                var c = a.data("$binding") || [];
                                je(b) ? c = c.concat(b) : c.push(b),
                                    a.data("$binding", c)
                            }: o,
                            F.$$addBindingClass = w ?
                                function(a) {
                                    E(a, "ng-binding")
                                }: o,
                            F.$$addScopeInfo = w ?
                                function(a, b, c, d) {
                                    var e = c ? d ? "$isolateScopeNoTemplate": "$isolateScope": "$scope";
                                    a.data(e, b)
                                }: o,
                            F.$$addScopeClass = w ?
                                function(a, b) {
                                    E(a, b ? "ng-isolate-scope": "ng-scope")
                                }: o,
                            F
                    }]
        }
        function $b(a) {
            return pb(a.replace(Ve, ""))
        }
        function _b(a, b) {
            var c = "",
                d = a.split(/\s+/),
                e = b.split(/\s+/);
            a: for (var f = 0; f < d.length; f++) {
                for (var g = d[f], h = 0; h < e.length; h++) if (g == e[h]) continue a;
                c += (c.length > 0 ? " ": "") + g
            }
            return c
        }
        function ac(a) {
            a = $d(a);
            var b = a.length;
            if (1 >= b) return a;
            for (; b--;) {
                var c = a[b];
                c.nodeType === se && ce.call(a, b, 1)
            }
            return a
        }
        function bc() {
            var a = {},
                b = !1,
                e = /^(\S+)(\s+as\s+(\w+))?$/;
            this.register = function(b, c) {
                gb(b, "controller"),
                    t(b) ? l(a, b) : a[b] = c
            },
                this.allowGlobals = function() {
                    b = !0
                },
                this.$get = ["$injector", "$window",
                    function(f, g) {
                        function h(a, b, c, e) {
                            if (!a || !t(a.$scope)) throw d("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", e, b);
                            a.$scope[b] = c
                        }
                        return function(d, i, j, k) {
                            var m, n, o, p;
                            if (j = j === !0, k && u(k) && (p = k), u(d)) {
                                if (n = d.match(e), !n) throw We("ctrlfmt", "Badly formed controller string '{0}'. Must match `__name__ as __id__` or `__name__`.", d);
                                o = n[1],
                                    p = p || n[3],
                                    d = a.hasOwnProperty(o) ? a[o] : hb(i.$scope, o, !0) || (b ? hb(g, o, !0) : c),
                                    fb(d, o, !0)
                            }
                            if (j) {
                                var q = (je(d) ? d[d.length - 1] : d).prototype;
                                return m = Object.create(q || null),
                                p && h(i, p, m, o || d.name),
                                    l(function() {
                                            return f.invoke(d, m, i, o),
                                                m
                                        },
                                        {
                                            instance: m,
                                            identifier: p
                                        })
                            }
                            return m = f.instantiate(d, i, o),
                            p && h(i, p, m, o || d.name),
                                m
                        }
                    }]
        }
        function cc() {
            this.$get = ["$window",
                function(a) {
                    return $d(a.document)
                }]
        }
        function dc() {
            this.$get = ["$log",
                function(a) {
                    return function() {
                        a.error.apply(a, arguments)
                    }
                }]
        }
        function ec(a, b) {
            if (u(a)) {
                var c = a.replace(_e, "").trim();
                if (c) {
                    var d = b("Content-Type"); (d && 0 === d.indexOf(Xe) || fc(c)) && (a = S(c))
                }
            }
            return a
        }
        function fc(a) {
            var b = a.match(Ze);
            return b && $e[b[0]].test(a)
        }
        function gc(a) {
            var b, c, d, e = jb();
            return a ? (f(a.split("\n"),
                function(a) {
                    d = a.indexOf(":"),
                        b = Ud(ke(a.substr(0, d))),
                        c = ke(a.substr(d + 1)),
                    b && (e[b] = e[b] ? e[b] + ", " + c: c)
                }), e) : e
        }
        function hc(a) {
            var b = t(a) ? a: c;
            return function(c) {
                if (b || (b = gc(a)), c) {
                    var d = b[Ud(c)];
                    return void 0 === d && (d = null),
                        d
                }
                return b
            }
        }
        function ic(a, b, c, d) {
            return x(d) ? d(a, b, c) : (f(d,
                function(d) {
                    a = d(a, b, c)
                }), a)
        }
        function jc(a) {
            return a >= 200 && 300 > a
        }
        function kc() {
            var a = this.defaults = {
                    transformResponse: [ec],
                    transformRequest: [function(a) {
                        return ! t(a) || B(a) || D(a) || C(a) ? a: R(a)
                    }],
                    headers: {
                        common: {
                            Accept: "application/json, text/plain, */*"
                        },
                        post: L(Ye),
                        put: L(Ye),
                        patch: L(Ye)
                    },
                    xsrfCookieName: "XSRF-TOKEN",
                    xsrfHeaderName: "X-XSRF-TOKEN"
                },
                b = !1;
            this.useApplyAsync = function(a) {
                return s(a) ? (b = !!a, this) : b
            };
            var e = this.interceptors = [];
            this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector",
                function(g, i, j, k, m, n) {
                    function o(b) {
                        function e(a) {
                            var b = l({},
                                a);
                            return b.data = a.data ? ic(a.data, a.headers, a.status, i.transformResponse) : a.data,
                                jc(a.status) ? b: m.reject(b)
                        }
                        function g(a) {
                            var b, c = {};
                            return f(a,
                                function(a, d) {
                                    x(a) ? (b = a(), null != b && (c[d] = b)) : c[d] = a
                                }),
                                c
                        }
                        function h(b) {
                            var c, d, e, f = a.headers,
                                h = l({},
                                    b.headers);
                            f = l({},
                                f.common, f[Ud(b.method)]);
                            a: for (c in f) {
                                d = Ud(c);
                                for (e in h) if (Ud(e) === d) continue a;
                                h[c] = f[c]
                            }
                            return g(h)
                        }
                        if (!ge.isObject(b)) throw d("$http")("badreq", "Http request configuration must be an object.  Received: {0}", b);
                        var i = l({
                                method: "get",
                                transformRequest: a.transformRequest,
                                transformResponse: a.transformResponse
                            },
                            b);
                        i.headers = h(b),
                            i.method = Wd(i.method);
                        var j = function(b) {
                                var d = b.headers,
                                    g = ic(b.data, hc(d), c, b.transformRequest);
                                return r(g) && f(d,
                                    function(a, b) {
                                        "content-type" === Ud(b) && delete d[b]
                                    }),
                                r(b.withCredentials) && !r(a.withCredentials) && (b.withCredentials = a.withCredentials),
                                    v(b, g).then(e, e)
                            },
                            k = [j, c],
                            n = m.when(i);
                        for (f(A,
                            function(a) { (a.request || a.requestError) && k.unshift(a.request, a.requestError),
                            (a.response || a.responseError) && k.push(a.response, a.responseError)
                            }); k.length;) {
                            var o = k.shift(),
                                p = k.shift();
                            n = n.then(o, p)
                        }
                        return n.success = function(a) {
                            return n.then(function(b) {
                                a(b.data, b.status, b.headers, i)
                            }),
                                n
                        },
                            n.error = function(a) {
                                return n.then(null,
                                    function(b) {
                                        a(b.data, b.status, b.headers, i)
                                    }),
                                    n
                            },
                            n
                    }
                    function p() {
                        f(arguments,
                            function(a) {
                                o[a] = function(b, c) {
                                    return o(l(c || {},
                                        {
                                            method: a,
                                            url: b
                                        }))
                                }
                            })
                    }
                    function q() {
                        f(arguments,
                            function(a) {
                                o[a] = function(b, c, d) {
                                    return o(l(d || {},
                                        {
                                            method: a,
                                            url: b,
                                            data: c
                                        }))
                                }
                            })
                    }
                    function v(d, e) {
                        function f(a, c, d, e) {
                            function f() {
                                h(c, a, d, e)
                            }
                            n && (jc(a) ? n.put(w, [a, c, gc(d), e]) : n.remove(w)),
                                b ? k.$applyAsync(f) : (f(), k.$$phase || k.$apply())
                        }
                        function h(a, b, c, e) {
                            b = Math.max(b, 0),
                                (jc(b) ? q.resolve: q.reject)({
                                    data: a,
                                    status: b,
                                    headers: hc(c),
                                    config: d,
                                    statusText: e
                                })
                        }
                        function j(a) {
                            h(a.data, a.status, L(a.headers()), a.statusText)
                        }
                        function l() {
                            var a = o.pendingRequests.indexOf(d); - 1 !== a && o.pendingRequests.splice(a, 1)
                        }
                        var n, p, q = m.defer(),
                            u = q.promise,
                            v = d.headers,
                            w = y(d.url, d.params);
                        if (o.pendingRequests.push(d), u.then(l, l), !d.cache && !a.cache || d.cache === !1 || "GET" !== d.method && "JSONP" !== d.method || (n = t(d.cache) ? d.cache: t(a.cache) ? a.cache: z), n && (p = n.get(w), s(p) ? F(p) ? p.then(j, j) : je(p) ? h(p[1], p[0], L(p[2]), p[3]) : h(p, 200, {},
                                "OK") : n.put(w, u)), r(p)) {
                            var x = ed(d.url) ? i.cookies()[d.xsrfCookieName || a.xsrfCookieName] : c;
                            x && (v[d.xsrfHeaderName || a.xsrfHeaderName] = x),
                                g(d.method, w, e, f, v, d.timeout, d.withCredentials, d.responseType)
                        }
                        return u
                    }
                    function y(a, b) {
                        if (!b) return a;
                        var c = [];
                        return h(b,
                            function(a, b) {
                                null === a || r(a) || (je(a) || (a = [a]), f(a,
                                    function(a) {
                                        t(a) && (a = w(a) ? a.toISOString() : R(a)),
                                            c.push(Y(b) + "=" + Y(a))
                                    }))
                            }),
                        c.length > 0 && (a += ( - 1 == a.indexOf("?") ? "?": "&") + c.join("&")),
                            a
                    }
                    var z = j("$http"),
                        A = [];
                    return f(e,
                        function(a) {
                            A.unshift(u(a) ? n.get(a) : n.invoke(a))
                        }),
                        o.pendingRequests = [],
                        p("get", "delete", "head", "jsonp"),
                        q("post", "put", "patch"),
                        o.defaults = a,
                        o
                }]
        }
        function lc() {
            return new a.XMLHttpRequest
        }
        function mc() {
            this.$get = ["$browser", "$window", "$document",
                function(a, b, c) {
                    return nc(a, lc, a.defer, b.angular.callbacks, c[0])
                }]
        }
        function nc(a, b, d, e, g) {
            function h(a, b, c) {
                var d = g.createElement("script"),
                    f = null;
                return d.type = "text/javascript",
                    d.src = a,
                    d.async = !0,
                    f = function(a) {
                        ze(d, "load", f),
                            ze(d, "error", f),
                            g.body.removeChild(d),
                            d = null;
                        var h = -1,
                            i = "unknown";
                        a && ("load" !== a.type || e[b].called || (a = {
                            type: "error"
                        }), i = a.type, h = "error" === a.type ? 404 : 200),
                        c && c(h, i)
                    },
                    ye(d, "load", f),
                    ye(d, "error", f),
                    g.body.appendChild(d),
                    f
            }
            return function(g, i, j, k, l, m, n, p) {
                function q() {
                    u && u(),
                    v && v.abort()
                }
                function r(b, e, f, g, h) {
                    y !== c && d.cancel(y),
                        u = v = null,
                        b(e, f, g, h),
                        a.$$completeOutstandingRequest(o)
                }
                if (a.$$incOutstandingRequestCount(), i = i || a.url(), "jsonp" == Ud(g)) {
                    var t = "_" + (e.counter++).toString(36);
                    e[t] = function(a) {
                        e[t].data = a,
                            e[t].called = !0
                    };
                    var u = h(i.replace("JSON_CALLBACK", "angular.callbacks." + t), t,
                        function(a, b) {
                            r(k, a, e[t].data, "", b),
                                e[t] = o
                        })
                } else {
                    var v = b();
                    v.open(g, i, !0),
                        f(l,
                            function(a, b) {
                                s(a) && v.setRequestHeader(b, a)
                            }),
                        v.onload = function() {
                            var a = v.statusText || "",
                                b = "response" in v ? v.response: v.responseText,
                                c = 1223 === v.status ? 204 : v.status;
                            0 === c && (c = b ? 200 : "file" == dd(i).protocol ? 404 : 0),
                                r(k, c, b, v.getAllResponseHeaders(), a)
                        };
                    var w = function() {
                        r(k, -1, null, null, "")
                    };
                    if (v.onerror = w, v.onabort = w, n && (v.withCredentials = !0), p) try {
                        v.responseType = p
                    } catch(x) {
                        if ("json" !== p) throw x
                    }
                    v.send(j || null)
                }
                if (m > 0) var y = d(q, m);
                else F(m) && m.then(q)
            }
        }
        function oc() {
            var a = "{{",
                b = "}}";
            this.startSymbol = function(b) {
                return b ? (a = b, this) : a
            },
                this.endSymbol = function(a) {
                    return a ? (b = a, this) : b
                },
                this.$get = ["$parse", "$exceptionHandler", "$sce",
                    function(c, d, e) {
                        function f(a) {
                            return "\\\\\\" + a
                        }
                        function g(f, g, m, n) {
                            function o(c) {
                                return c.replace(j, a).replace(k, b)
                            }
                            function p(a) {
                                try {
                                    return a = D(a),
                                        n && !s(a) ? a: E(a)
                                } catch(b) {
                                    var c = af("interr", "Can't interpolate: {0}\n{1}", f, b.toString());
                                    d(c)
                                }
                            }
                            n = !!n;
                            for (var q, t, u, v = 0,
                                     w = [], y = [], z = f.length, A = [], B = []; z > v;) {
                                if ( - 1 == (q = f.indexOf(a, v)) || -1 == (t = f.indexOf(b, q + h))) {
                                    v !== z && A.push(o(f.substring(v)));
                                    break
                                }
                                v !== q && A.push(o(f.substring(v, q))),
                                    u = f.substring(q + h, t),
                                    w.push(u),
                                    y.push(c(u, p)),
                                    v = t + i,
                                    B.push(A.length),
                                    A.push("")
                            }
                            if (m && A.length > 1) throw af("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", f);
                            if (!g || w.length) {
                                var C = function(a) {
                                        for (var b = 0,
                                                 c = w.length; c > b; b++) {
                                            if (n && r(a[b])) return;
                                            A[B[b]] = a[b]
                                        }
                                        return A.join("")
                                    },
                                    D = function(a) {
                                        return m ? e.getTrusted(m, a) : e.valueOf(a)
                                    },
                                    E = function(a) {
                                        if (null == a) return "";
                                        switch (typeof a) {
                                            case "string":
                                                break;
                                            case "number":
                                                a = "" + a;
                                                break;
                                            default:
                                                a = R(a)
                                        }
                                        return a
                                    };
                                return l(function(a) {
                                        var b = 0,
                                            c = w.length,
                                            e = new Array(c);
                                        try {
                                            for (; c > b; b++) e[b] = y[b](a);
                                            return C(e)
                                        } catch(g) {
                                            var h = af("interr", "Can't interpolate: {0}\n{1}", f, g.toString());
                                            d(h)
                                        }
                                    },
                                    {
                                        exp: f,
                                        expressions: w,
                                        $$watchDelegate: function(a, b, c) {
                                            var d;
                                            return a.$watchGroup(y,
                                                function(c, e) {
                                                    var f = C(c);
                                                    x(b) && b.call(this, f, c !== e ? d: f, a),
                                                        d = f
                                                },
                                                c)
                                        }
                                    })
                            }
                        }
                        var h = a.length,
                            i = b.length,
                            j = new RegExp(a.replace(/./g, f), "g"),
                            k = new RegExp(b.replace(/./g, f), "g");
                        return g.startSymbol = function() {
                            return a
                        },
                            g.endSymbol = function() {
                                return b
                            },
                            g
                    }]
        }
        function pc() {
            this.$get = ["$rootScope", "$window", "$q", "$$q",
                function(a, b, c, d) {
                    function e(e, g, h, i) {
                        var j = b.setInterval,
                            k = b.clearInterval,
                            l = 0,
                            m = s(i) && !i,
                            n = (m ? d: c).defer(),
                            o = n.promise;
                        return h = s(h) ? h: 0,
                            o.then(null, null, e),
                            o.$$intervalId = j(function() {
                                    n.notify(l++),
                                    h > 0 && l >= h && (n.resolve(l), k(o.$$intervalId), delete f[o.$$intervalId]),
                                    m || a.$apply()
                                },
                                g),
                            f[o.$$intervalId] = n,
                            o
                    }
                    var f = {};
                    return e.cancel = function(a) {
                        return a && a.$$intervalId in f ? (f[a.$$intervalId].reject("canceled"), b.clearInterval(a.$$intervalId), delete f[a.$$intervalId], !0) : !1
                    },
                        e
                }]
        }
        function qc() {
            this.$get = function() {
                return {
                    id: "en-us",
                    NUMBER_FORMATS: {
                        DECIMAL_SEP: ".",
                        GROUP_SEP: ",",
                        PATTERNS: [{
                            minInt: 1,
                            minFrac: 0,
                            maxFrac: 3,
                            posPre: "",
                            posSuf: "",
                            negPre: "-",
                            negSuf: "",
                            gSize: 3,
                            lgSize: 3
                        },
                            {
                                minInt: 1,
                                minFrac: 2,
                                maxFrac: 2,
                                posPre: "陇",
                                posSuf: "",
                                negPre: "(陇",
                                negSuf: ")",
                                gSize: 3,
                                lgSize: 3
                            }],
                        CURRENCY_SYM: "$"
                    },
                    DATETIME_FORMATS: {
                        MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                        SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                        DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                        SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                        AMPMS: ["AM", "PM"],
                        medium: "MMM d, y h:mm:ss a",
                        "short": "M/d/yy h:mm a",
                        fullDate: "EEEE, MMMM d, y",
                        longDate: "MMMM d, y",
                        mediumDate: "MMM d, y",
                        shortDate: "M/d/yy",
                        mediumTime: "h:mm:ss a",
                        shortTime: "h:mm a"
                    },
                    pluralCat: function(a) {
                        return 1 === a ? "one": "other"
                    }
                }
            }
        }
        function rc(a) {
            for (var b = a.split("/"), c = b.length; c--;) b[c] = X(b[c]);
            return b.join("/")
        }
        function sc(a, b) {
            var c = dd(a);
            b.$$protocol = c.protocol,
                b.$$host = c.hostname,
                b.$$port = m(c.port) || cf[c.protocol] || null
        }
        function tc(a, b) {
            var c = "/" !== a.charAt(0);
            c && (a = "/" + a);
            var d = dd(a);
            b.$$path = decodeURIComponent(c && "/" === d.pathname.charAt(0) ? d.pathname.substring(1) : d.pathname),
                b.$$search = V(d.search),
                b.$$hash = decodeURIComponent(d.hash),
            b.$$path && "/" != b.$$path.charAt(0) && (b.$$path = "/" + b.$$path)
        }
        function uc(a, b) {
            return 0 === b.indexOf(a) ? b.substr(a.length) : void 0
        }
        function vc(a) {
            var b = a.indexOf("#");
            return - 1 == b ? a: a.substr(0, b)
        }
        function wc(a) {
            return a.replace(/(#.+)|#$/, "$1")
        }
        function xc(a) {
            return a.substr(0, vc(a).lastIndexOf("/") + 1)
        }
        function yc(a) {
            return a.substring(0, a.indexOf("/", a.indexOf("//") + 2))
        }
        function zc(a, b) {
            this.$$html5 = !0,
                b = b || "";
            var d = xc(a);
            sc(a, this),
                this.$$parse = function(a) {
                    var b = uc(d, a);
                    if (!u(b)) throw df("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', a, d);
                    tc(b, this),
                    this.$$path || (this.$$path = "/"),
                        this.$$compose()
                },
                this.$$compose = function() {
                    var a = W(this.$$search),
                        b = this.$$hash ? "#" + X(this.$$hash) : "";
                    this.$$url = rc(this.$$path) + (a ? "?" + a: "") + b,
                        this.$$absUrl = d + this.$$url.substr(1)
                },
                this.$$parseLinkUrl = function(e, f) {
                    if (f && "#" === f[0]) return this.hash(f.slice(1)),
                        !0;
                    var g, h, i;
                    return (g = uc(a, e)) !== c ? (h = g, i = (g = uc(b, g)) !== c ? d + (uc("/", g) || g) : a + h) : (g = uc(d, e)) !== c ? i = d + g: d == e + "/" && (i = d),
                    i && this.$$parse(i),
                        !!i
                }
        }
        function Ac(a, b) {
            var c = xc(a);
            sc(a, this),
                this.$$parse = function(d) {
                    function e(a, b, c) {
                        var d, e = /^\/[A-Z]:(\/.*)/;
                        return 0 === b.indexOf(c) && (b = b.replace(c, "")),
                            e.exec(b) ? a: (d = e.exec(a), d ? d[1] : a)
                    }
                    var f, g = uc(a, d) || uc(c, d);
                    "#" === g.charAt(0) ? (f = uc(b, g), r(f) && (f = g)) : f = this.$$html5 ? g: "",
                        tc(f, this),
                        this.$$path = e(this.$$path, f, a),
                        this.$$compose()
                },
                this.$$compose = function() {
                    var c = W(this.$$search),
                        d = this.$$hash ? "#" + X(this.$$hash) : "";
                    this.$$url = rc(this.$$path) + (c ? "?" + c: "") + d,
                        this.$$absUrl = a + (this.$$url ? b + this.$$url: "")
                },
                this.$$parseLinkUrl = function(b) {
                    return vc(a) == vc(b) ? (this.$$parse(b), !0) : !1
                }
        }
        function Bc(a, b) {
            this.$$html5 = !0,
                Ac.apply(this, arguments);
            var c = xc(a);
            this.$$parseLinkUrl = function(d, e) {
                if (e && "#" === e[0]) return this.hash(e.slice(1)),
                    !0;
                var f, g;
                return a == vc(d) ? f = d: (g = uc(c, d)) ? f = a + b + g: c === d + "/" && (f = c),
                f && this.$$parse(f),
                    !!f
            },
                this.$$compose = function() {
                    var c = W(this.$$search),
                        d = this.$$hash ? "#" + X(this.$$hash) : "";
                    this.$$url = rc(this.$$path) + (c ? "?" + c: "") + d,
                        this.$$absUrl = a + b + this.$$url
                }
        }
        function Cc(a) {
            return function() {
                return this[a]
            }
        }
        function Dc(a, b) {
            return function(c) {
                return r(c) ? this[a] : (this[a] = b(c), this.$$compose(), this)
            }
        }
        function Ec() {
            var a = "",
                b = {
                    enabled: !1,
                    requireBase: !0,
                    rewriteLinks: !0
                };
            this.hashPrefix = function(b) {
                return s(b) ? (a = b, this) : a
            },
                this.html5Mode = function(a) {
                    return E(a) ? (b.enabled = a, this) : t(a) ? (E(a.enabled) && (b.enabled = a.enabled), E(a.requireBase) && (b.requireBase = a.requireBase), E(a.rewriteLinks) && (b.rewriteLinks = a.rewriteLinks), this) : b
                },
                this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window",
                    function(c, d, e, f, g) {
                        function h(a, b, c) {
                            var e = j.url(),
                                f = j.$$state;
                            try {
                                d.url(a, b, c),
                                    j.$$state = d.state()
                            } catch(g) {
                                throw j.url(e),
                                    j.$$state = f,
                                    g
                            }
                        }
                        function i(a, b) {
                            c.$broadcast("$locationChangeSuccess", j.absUrl(), a, j.$$state, b)
                        }
                        var j, k, l, m = d.baseHref(),
                            n = d.url();
                        if (b.enabled) {
                            if (!m && b.requireBase) throw df("nobase", "$location in HTML5 mode requires a <base> tag to be present!");
                            l = yc(n) + (m || "/"),
                                k = e.history ? zc: Bc
                        } else l = vc(n),
                            k = Ac;
                        j = new k(l, "#" + a),
                            j.$$parseLinkUrl(n, n),
                            j.$$state = d.state();
                        var o = /^\s*(javascript|mailto):/i;
                        f.on("click",
                            function(a) {
                                if (b.rewriteLinks && !a.ctrlKey && !a.metaKey && !a.shiftKey && 2 != a.which && 2 != a.button) {
                                    for (var e = $d(a.target);
                                         "a" !== I(e[0]);) if (e[0] === f[0] || !(e = e.parent())[0]) return;
                                    var h = e.prop("href"),
                                        i = e.attr("href") || e.attr("xlink:href");
                                    t(h) && "[object SVGAnimatedString]" === h.toString() && (h = dd(h.animVal).href),
                                    o.test(h) || !h || e.attr("target") || a.isDefaultPrevented() || j.$$parseLinkUrl(h, i) && (a.preventDefault(), j.absUrl() != d.url() && (c.$apply(), g.angular["ff-684208-preventDefault"] = !0))
                                }
                            }),
                        wc(j.absUrl()) != wc(n) && d.url(j.absUrl(), !0);
                        var p = !0;
                        return d.onUrlChange(function(a, b) {
                            c.$evalAsync(function() {
                                var d, e = j.absUrl(),
                                    f = j.$$state;
                                j.$$parse(a),
                                    j.$$state = b,
                                    d = c.$broadcast("$locationChangeStart", a, e, b, f).defaultPrevented,
                                j.absUrl() === a && (d ? (j.$$parse(e), j.$$state = f, h(e, !1, f)) : (p = !1, i(e, f)))
                            }),
                            c.$$phase || c.$digest()
                        }),
                            c.$watch(function() {
                                var a = wc(d.url()),
                                    b = wc(j.absUrl()),
                                    f = d.state(),
                                    g = j.$$replace,
                                    k = a !== b || j.$$html5 && e.history && f !== j.$$state; (p || k) && (p = !1, c.$evalAsync(function() {
                                    var b = j.absUrl(),
                                        d = c.$broadcast("$locationChangeStart", b, a, j.$$state, f).defaultPrevented;
                                    j.absUrl() === b && (d ? (j.$$parse(a), j.$$state = f) : (k && h(b, g, f === j.$$state ? null: j.$$state), i(a, f)))
                                })),
                                    j.$$replace = !1
                            }),
                            j
                    }]
        }
        function Fc() {
            var a = !0,
                b = this;
            this.debugEnabled = function(b) {
                return s(b) ? (a = b, this) : a
            },
                this.$get = ["$window",
                    function(c) {
                        function d(a) {
                            return a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack: a.stack: a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line)),
                                a
                        }
                        function e(a) {
                            var b = c.console || {},
                                e = b[a] || b.log || o,
                                g = !1;
                            try {
                                g = !!e.apply
                            } catch(h) {}
                            return g ?
                                function() {
                                    var a = [];
                                    return f(arguments,
                                        function(b) {
                                            a.push(d(b))
                                        }),
                                        e.apply(b, a)
                                }: function(a, b) {
                                e(a, null == b ? "": b)
                            }
                        }
                        return {
                            log: e("log"),
                            info: e("info"),
                            warn: e("warn"),
                            error: e("error"),
                            debug: function() {
                                var c = e("debug");
                                return function() {
                                    a && c.apply(b, arguments)
                                }
                            } ()
                        }
                    }]
        }
        function Gc(a, b) {
            if ("__defineGetter__" === a || "__defineSetter__" === a || "__lookupGetter__" === a || "__lookupSetter__" === a || "__proto__" === a) throw ff("isecfld", "Attempting to access a disallowed field in Angular expressions! Expression: {0}", b);
            return a
        }
        function Hc(a, b) {
            if (a) {
                if (a.constructor === a) throw ff("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", b);
                if (a.window === a) throw ff("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", b);
                if (a.children && (a.nodeName || a.prop && a.attr && a.find)) throw ff("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", b);
                if (a === Object) throw ff("isecobj", "Referencing Object in Angular expressions is disallowed! Expression: {0}", b)
            }
            return a
        }
        function Ic(a, b) {
            if (a) {
                if (a.constructor === a) throw ff("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", b);
                if (a === gf || a === hf || a === jf) throw ff("isecff", "Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}", b)
            }
        }
        function Jc(a) {
            return a.constant
        }
        function Kc(a, b, c, d, e) {
            Hc(a, e),
                Hc(b, e);
            for (var f, g = c.split("."), h = 0; g.length > 1; h++) {
                f = Gc(g.shift(), e);
                var i = 0 === h && b && b[f] || a[f];
                i || (i = {},
                    a[f] = i),
                    a = Hc(i, e)
            }
            return f = Gc(g.shift(), e),
                Hc(a[f], e),
                a[f] = d,
                d
        }
        function Lc(a) {
            return "constructor" == a
        }
        function Mc(a, b, d, e, f, g, h) {
            Gc(a, g),
                Gc(b, g),
                Gc(d, g),
                Gc(e, g),
                Gc(f, g);
            var i = function(a) {
                    return Hc(a, g)
                },
                j = h || Lc(a) ? i: p,
                k = h || Lc(b) ? i: p,
                l = h || Lc(d) ? i: p,
                m = h || Lc(e) ? i: p,
                n = h || Lc(f) ? i: p;
            return function(g, h) {
                var i = h && h.hasOwnProperty(a) ? h: g;
                return null == i ? i: (i = j(i[a]), b ? null == i ? c: (i = k(i[b]), d ? null == i ? c: (i = l(i[d]), e ? null == i ? c: (i = m(i[e]), f ? null == i ? c: i = n(i[f]) : i) : i) : i) : i)
            }
        }
        function Nc(a, b) {
            return function(c, d) {
                return a(c, d, Hc, b)
            }
        }
        function Oc(a, b, d) {
            var e = b.expensiveChecks,
                g = e ? qf: pf,
                h = g[a];
            if (h) return h;
            var i = a.split("."),
                j = i.length;
            if (b.csp) h = 6 > j ? Mc(i[0], i[1], i[2], i[3], i[4], d, e) : function(a, b) {
                var f, g = 0;
                do f = Mc(i[g++], i[g++], i[g++], i[g++], i[g++], d, e)(a, b),
                    b = c,
                    a = f;
                while (j > g);
                return f
            };
            else {
                var k = "";
                e && (k += "s = eso(s, fe);\nl = eso(l, fe);\n");
                var l = e;
                f(i,
                    function(a, b) {
                        Gc(a, d);
                        var c = (b ? "s": '((l&&l.hasOwnProperty("' + a + '"))?l:s)') + "." + a; (e || Lc(a)) && (c = "eso(" + c + ", fe)", l = !0),
                            k += "if(s == null) return undefined;\ns=" + c + ";\n"
                    }),
                    k += "return s;";
                var m = new Function("s", "l", "eso", "fe", k);
                m.toString = q(k),
                l && (m = Nc(m, d)),
                    h = m
            }
            return h.sharedGetter = !0,
                h.assign = function(b, c, d) {
                    return Kc(b, d, a, c, a)
                },
                g[a] = h,
                h
        }
        function Pc(a) {
            return x(a.valueOf) ? a.valueOf() : rf.call(a)
        }
        function Qc() {
            var a = jb(),
                b = jb();
            this.$get = ["$filter", "$sniffer",
                function(c, d) {
                    function e(a) {
                        var b = a;
                        return a.sharedGetter && (b = function(b, c) {
                            return a(b, c)
                        },
                            b.literal = a.literal, b.constant = a.constant, b.assign = a.assign),
                            b
                    }
                    function g(a, b) {
                        for (var c = 0,
                                 d = a.length; d > c; c++) {
                            var e = a[c];
                            e.constant || (e.inputs ? g(e.inputs, b) : -1 === b.indexOf(e) && b.push(e))
                        }
                        return b
                    }
                    function h(a, b) {
                        return null == a || null == b ? a === b: "object" == typeof a && (a = Pc(a), "object" == typeof a) ? !1 : a === b || a !== a && b !== b
                    }
                    function i(a, b, c, d) {
                        var e, f = d.$$inputs || (d.$$inputs = g(d.inputs, []));
                        if (1 === f.length) {
                            var i = h;
                            return f = f[0],
                                a.$watch(function(a) {
                                        var b = f(a);
                                        return h(b, i) || (e = d(a), i = b && Pc(b)),
                                            e
                                    },
                                    b, c)
                        }
                        for (var j = [], k = 0, l = f.length; l > k; k++) j[k] = h;
                        return a.$watch(function(a) {
                                for (var b = !1,
                                         c = 0,
                                         g = f.length; g > c; c++) {
                                    var i = f[c](a); (b || (b = !h(i, j[c]))) && (j[c] = i && Pc(i))
                                }
                                return b && (e = d(a)),
                                    e
                            },
                            b, c)
                    }
                    function j(a, b, c, d) {
                        var e, f;
                        return e = a.$watch(function(a) {
                                return d(a)
                            },
                            function(a, c, d) {
                                f = a,
                                x(b) && b.apply(this, arguments),
                                s(a) && d.$$postDigest(function() {
                                    s(f) && e()
                                })
                            },
                            c)
                    }
                    function k(a, b, c, d) {
                        function e(a) {
                            var b = !0;
                            return f(a,
                                function(a) {
                                    s(a) || (b = !1)
                                }),
                                b
                        }
                        var g, h;
                        return g = a.$watch(function(a) {
                                return d(a)
                            },
                            function(a, c, d) {
                                h = a,
                                x(b) && b.call(this, a, c, d),
                                e(a) && d.$$postDigest(function() {
                                    e(h) && g()
                                })
                            },
                            c)
                    }
                    function l(a, b, c, d) {
                        var e;
                        return e = a.$watch(function(a) {
                                return d(a)
                            },
                            function() {
                                x(b) && b.apply(this, arguments),
                                    e()
                            },
                            c)
                    }
                    function m(a, b) {
                        if (!b) return a;
                        var c = a.$$watchDelegate,
                            d = c !== k && c !== j,
                            e = d ?
                                function(c, d) {
                                    var e = a(c, d);
                                    return b(e, c, d)
                                }: function(c, d) {
                                var e = a(c, d),
                                    f = b(e, c, d);
                                return s(e) ? f: e
                            };
                        return a.$$watchDelegate && a.$$watchDelegate !== i ? e.$$watchDelegate = a.$$watchDelegate: b.$stateful || (e.$$watchDelegate = i, e.inputs = [a]),
                            e
                    }
                    var n = {
                            csp: d.csp,
                            expensiveChecks: !1
                        },
                        p = {
                            csp: d.csp,
                            expensiveChecks: !0
                        };
                    return function(d, f, g) {
                        var h, q, r;
                        switch (typeof d) {
                            case "string":
                                r = d = d.trim();
                                var s = g ? b: a;
                                if (h = s[r], !h) {
                                    ":" === d.charAt(0) && ":" === d.charAt(1) && (q = !0, d = d.substring(2));
                                    var t = g ? p: n,
                                        u = new nf(t),
                                        v = new of(u, c, t);
                                    h = v.parse(d),
                                        h.constant ? h.$$watchDelegate = l: q ? (h = e(h), h.$$watchDelegate = h.literal ? k: j) : h.inputs && (h.$$watchDelegate = i),
                                        s[r] = h
                                }
                                return m(h, f);
                            case "function":
                                return m(d, f);
                            default:
                                return m(o, f)
                        }
                    }
                }]
        }
        function Rc() {
            this.$get = ["$rootScope", "$exceptionHandler",
                function(a, b) {
                    return Tc(function(b) {
                            a.$evalAsync(b)
                        },
                        b)
                }]
        }
        function Sc() {
            this.$get = ["$browser", "$exceptionHandler",
                function(a, b) {
                    return Tc(function(b) {
                            a.defer(b)
                        },
                        b)
                }]
        }
        function Tc(a, b) {
            function e(a, b, c) {
                function d(b) {
                    return function(c) {
                        e || (e = !0, b.call(a, c))
                    }
                }
                var e = !1;
                return [d(b), d(c)]
            }
            function g() {
                this.$$state = {
                    status: 0
                }
            }
            function h(a, b) {
                return function(c) {
                    b.call(a, c)
                }
            }
            function i(a) {
                var d, e, f;
                f = a.pending,
                    a.processScheduled = !1,
                    a.pending = c;
                for (var g = 0,
                         h = f.length; h > g; ++g) {
                    e = f[g][0],
                        d = f[g][a.status];
                    try {
                        x(d) ? e.resolve(d(a.value)) : 1 === a.status ? e.resolve(a.value) : e.reject(a.value)
                    } catch(i) {
                        e.reject(i),
                            b(i)
                    }
                }
            }
            function j(b) { ! b.processScheduled && b.pending && (b.processScheduled = !0, a(function() {
                i(b)
            }))
            }
            function k() {
                this.promise = new g,
                    this.resolve = h(this, this.resolve),
                    this.reject = h(this, this.reject),
                    this.notify = h(this, this.notify)
            }
            function l(a) {
                var b = new k,
                    c = 0,
                    d = je(a) ? [] : {};
                return f(a,
                    function(a, e) {
                        c++,
                            r(a).then(function(a) {
                                    d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d))
                                },
                                function(a) {
                                    d.hasOwnProperty(e) || b.reject(a)
                                })
                    }),
                0 === c && b.resolve(d),
                    b.promise
            }
            var m = d("$q", TypeError),
                n = function() {
                    return new k
                };
            g.prototype = {
                then: function(a, b, c) {
                    var d = new k;
                    return this.$$state.pending = this.$$state.pending || [],
                        this.$$state.pending.push([d, a, b, c]),
                    this.$$state.status > 0 && j(this.$$state),
                        d.promise
                },
                "catch": function(a) {
                    return this.then(null, a)
                },
                "finally": function(a, b) {
                    return this.then(function(b) {
                            return q(b, !0, a)
                        },
                        function(b) {
                            return q(b, !1, a)
                        },
                        b)
                }
            },
                k.prototype = {
                    resolve: function(a) {
                        this.promise.$$state.status || (a === this.promise ? this.$$reject(m("qcycle", "Expected promise to be resolved with value other than itself '{0}'", a)) : this.$$resolve(a))
                    },
                    $$resolve: function(a) {
                        var c, d;
                        d = e(this, this.$$resolve, this.$$reject);
                        try { (t(a) || x(a)) && (c = a && a.then),
                            x(c) ? (this.promise.$$state.status = -1, c.call(a, d[0], d[1], this.notify)) : (this.promise.$$state.value = a, this.promise.$$state.status = 1, j(this.promise.$$state))
                        } catch(f) {
                            d[1](f),
                                b(f)
                        }
                    },
                    reject: function(a) {
                        this.promise.$$state.status || this.$$reject(a)
                    },
                    $$reject: function(a) {
                        this.promise.$$state.value = a,
                            this.promise.$$state.status = 2,
                            j(this.promise.$$state)
                    },
                    notify: function(c) {
                        var d = this.promise.$$state.pending;
                        this.promise.$$state.status <= 0 && d && d.length && a(function() {
                            for (var a, e, f = 0,
                                     g = d.length; g > f; f++) {
                                e = d[f][0],
                                    a = d[f][3];
                                try {
                                    e.notify(x(a) ? a(c) : c)
                                } catch(h) {
                                    b(h)
                                }
                            }
                        })
                    }
                };
            var o = function(a) {
                    var b = new k;
                    return b.reject(a),
                        b.promise
                },
                p = function(a, b) {
                    var c = new k;
                    return b ? c.resolve(a) : c.reject(a),
                        c.promise
                },
                q = function(a, b, c) {
                    var d = null;
                    try {
                        x(c) && (d = c())
                    } catch(e) {
                        return p(e, !1)
                    }
                    return F(d) ? d.then(function() {
                            return p(a, b)
                        },
                        function(a) {
                            return p(a, !1)
                        }) : p(a, b)
                },
                r = function(a, b, c, d) {
                    var e = new k;
                    return e.resolve(a),
                        e.promise.then(b, c, d)
                },
                s = function u(a) {
                    function b(a) {
                        d.resolve(a)
                    }
                    function c(a) {
                        d.reject(a)
                    }
                    if (!x(a)) throw m("norslvr", "Expected resolverFn, got '{0}'", a);
                    if (! (this instanceof u)) return new u(a);
                    var d = new k;
                    return a(b, c),
                        d.promise
                };
            return s.defer = n,
                s.reject = o,
                s.when = r,
                s.all = l,
                s
        }
        function Uc() {
            this.$get = ["$window", "$timeout",
                function(a, b) {
                    var c = a.requestAnimationFrame || a.webkitRequestAnimationFrame,
                        d = a.cancelAnimationFrame || a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame,
                        e = !!c,
                        f = e ?
                            function(a) {
                                var b = c(a);
                                return function() {
                                    d(b)
                                }
                            }: function(a) {
                            var c = b(a, 16.66, !1);
                            return function() {
                                b.cancel(c)
                            }
                        };
                    return f.supported = e,
                        f
                }]
        }
        function Vc() {
            var a = 10,
                b = d("$rootScope"),
                c = null,
                g = null;
            this.digestTtl = function(b) {
                return arguments.length && (a = b),
                    a
            },
                this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser",
                    function(d, h, i, k) {
                        function l() {
                            this.$id = j(),
                                this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null,
                                this.$root = this,
                                this.$$destroyed = !1,
                                this.$$listeners = {},
                                this.$$listenerCount = {},
                                this.$$isolateBindings = null
                        }
                        function m(a) {
                            if (v.$$phase) throw b("inprog", "{0} already in progress", v.$$phase);
                            v.$$phase = a
                        }
                        function n() {
                            v.$$phase = null
                        }
                        function p(a, b, c) {
                            do a.$$listenerCount[c] -= b,
                            0 === a.$$listenerCount[c] && delete a.$$listenerCount[c];
                            while (a = a.$parent)
                        }
                        function q() {}
                        function s() {
                            for (; z.length;) try {
                                z.shift()()
                            } catch(a) {
                                h(a)
                            }
                            g = null
                        }
                        function u() {
                            null === g && (g = k.defer(function() {
                                v.$apply(s)
                            }))
                        }
                        l.prototype = {
                            constructor: l,
                            $new: function(a, b) {
                                function c() {
                                    d.$$destroyed = !0
                                }
                                var d;
                                return b = b || this,
                                    a ? (d = new l, d.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = function() {
                                        this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null,
                                            this.$$listeners = {},
                                            this.$$listenerCount = {},
                                            this.$id = j(),
                                            this.$$ChildScope = null
                                    },
                                        this.$$ChildScope.prototype = this), d = new this.$$ChildScope),
                                    d.$parent = b,
                                    d.$$prevSibling = b.$$childTail,
                                    b.$$childHead ? (b.$$childTail.$$nextSibling = d, b.$$childTail = d) : b.$$childHead = b.$$childTail = d,
                                (a || b != this) && d.$on("$destroy", c),
                                    d
                            },
                            $watch: function(a, b, d) {
                                var e = i(a);
                                if (e.$$watchDelegate) return e.$$watchDelegate(this, b, d, e);
                                var f = this,
                                    g = f.$$watchers,
                                    h = {
                                        fn: b,
                                        last: q,
                                        get: e,
                                        exp: a,
                                        eq: !!d
                                    };
                                return c = null,
                                x(b) || (h.fn = o),
                                g || (g = f.$$watchers = []),
                                    g.unshift(h),
                                    function() {
                                        J(g, h),
                                            c = null
                                    }
                            },
                            $watchGroup: function(a, b) {
                                function c() {
                                    i = !1,
                                        j ? (j = !1, b(e, e, h)) : b(e, d, h)
                                }
                                var d = new Array(a.length),
                                    e = new Array(a.length),
                                    g = [],
                                    h = this,
                                    i = !1,
                                    j = !0;
                                if (!a.length) {
                                    var k = !0;
                                    return h.$evalAsync(function() {
                                        k && b(e, e, h)
                                    }),
                                        function() {
                                            k = !1
                                        }
                                }
                                return 1 === a.length ? this.$watch(a[0],
                                    function(a, c, f) {
                                        e[0] = a,
                                            d[0] = c,
                                            b(e, a === c ? e: d, f)
                                    }) : (f(a,
                                    function(a, b) {
                                        var f = h.$watch(a,
                                            function(a, f) {
                                                e[b] = a,
                                                    d[b] = f,
                                                i || (i = !0, h.$evalAsync(c))
                                            });
                                        g.push(f)
                                    }),
                                    function() {
                                        for (; g.length;) g.shift()()
                                    })
                            },
                            $watchCollection: function(a, b) {
                                function c(a) {
                                    f = a;
                                    var b, c, d, h, i;
                                    if (!r(f)) {
                                        if (t(f)) if (e(f)) {
                                            g !== n && (g = n, q = g.length = 0, l++),
                                                b = f.length,
                                            q !== b && (l++, g.length = q = b);
                                            for (var j = 0; b > j; j++) i = g[j],
                                                h = f[j],
                                                d = i !== i && h !== h,
                                            d || i === h || (l++, g[j] = h)
                                        } else {
                                            g !== o && (g = o = {},
                                                q = 0, l++),
                                                b = 0;
                                            for (c in f) f.hasOwnProperty(c) && (b++, h = f[c], i = g[c], c in g ? (d = i !== i && h !== h, d || i === h || (l++, g[c] = h)) : (q++, g[c] = h, l++));
                                            if (q > b) {
                                                l++;
                                                for (c in g) f.hasOwnProperty(c) || (q--, delete g[c])
                                            }
                                        } else g !== f && (g = f, l++);
                                        return l
                                    }
                                }
                                function d() {
                                    if (p ? (p = !1, b(f, f, j)) : b(f, h, j), k) if (t(f)) if (e(f)) {
                                        h = new Array(f.length);
                                        for (var a = 0; a < f.length; a++) h[a] = f[a]
                                    } else {
                                        h = {};
                                        for (var c in f) Vd.call(f, c) && (h[c] = f[c])
                                    } else h = f
                                }
                                c.$stateful = !0;
                                var f, g, h, j = this,
                                    k = b.length > 1,
                                    l = 0,
                                    m = i(a, c),
                                    n = [],
                                    o = {},
                                    p = !0,
                                    q = 0;
                                return this.$watch(m, d)
                            },
                            $digest: function() {
                                var d, e, f, i, j, l, o, p, r, t, u = a,
                                    z = this,
                                    A = [];
                                m("$digest"),
                                    k.$$checkUrlChange(),
                                this === v && null !== g && (k.defer.cancel(g), s()),
                                    c = null;
                                do {
                                    for (l = !1, p = z; w.length;) {
                                        try {
                                            t = w.shift(),
                                                t.scope.$eval(t.expression, t.locals)
                                        } catch(B) {
                                            h(B)
                                        }
                                        c = null
                                    }
                                    a: do {
                                        if (i = p.$$watchers) for (j = i.length; j--;) try {
                                            if (d = i[j]) if ((e = d.get(p)) === (f = d.last) || (d.eq ? M(e, f) : "number" == typeof e && "number" == typeof f && isNaN(e) && isNaN(f))) {
                                                if (d === c) {
                                                    l = !1;
                                                    break a
                                                }
                                            } else l = !0,
                                                c = d,
                                                d.last = d.eq ? K(e, null) : e,
                                                d.fn(e, f === q ? e: f, p),
                                            5 > u && (r = 4 - u, A[r] || (A[r] = []), A[r].push({
                                                msg: x(d.exp) ? "fn: " + (d.exp.name || d.exp.toString()) : d.exp,
                                                newVal: e,
                                                oldVal: f
                                            }))
                                        } catch(B) {
                                            h(B)
                                        }
                                        if (! (o = p.$$childHead || p !== z && p.$$nextSibling)) for (; p !== z && !(o = p.$$nextSibling);) p = p.$parent
                                    } while ( p = o );
                                    if ((l || w.length) && !u--) throw n(), b("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", a, A)
                                } while ( l || w . length );
                                for (n(); y.length;) try {
                                    y.shift()()
                                } catch(B) {
                                    h(B)
                                }
                            },
                            $destroy: function() {
                                if (!this.$$destroyed) {
                                    var a = this.$parent;
                                    if (this.$broadcast("$destroy"), this.$$destroyed = !0, this !== v) {
                                        for (var b in this.$$listenerCount) p(this, this.$$listenerCount[b], b);
                                        a.$$childHead == this && (a.$$childHead = this.$$nextSibling),
                                        a.$$childTail == this && (a.$$childTail = this.$$prevSibling),
                                        this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling),
                                        this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling),
                                            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = o,
                                            this.$on = this.$watch = this.$watchGroup = function() {
                                                return o
                                            },
                                            this.$$listeners = {},
                                            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null
                                    }
                                }
                            },
                            $eval: function(a, b) {
                                return i(a)(this, b)
                            },
                            $evalAsync: function(a, b) {
                                v.$$phase || w.length || k.defer(function() {
                                    w.length && v.$digest()
                                }),
                                    w.push({
                                        scope: this,
                                        expression: a,
                                        locals: b
                                    })
                            },
                            $$postDigest: function(a) {
                                y.push(a)
                            },
                            $apply: function(a) {
                                try {
                                    return m("$apply"),
                                        this.$eval(a)
                                } catch(b) {
                                    h(b)
                                } finally {
                                    n();
                                    try {
                                        v.$digest()
                                    } catch(b) {
                                        throw h(b),
                                            b
                                    }
                                }
                            },
                            $applyAsync: function(a) {
                                function b() {
                                    c.$eval(a)
                                }
                                var c = this;
                                a && z.push(b),
                                    u()
                            },
                            $on: function(a, b) {
                                var c = this.$$listeners[a];
                                c || (this.$$listeners[a] = c = []),
                                    c.push(b);
                                var d = this;
                                do d.$$listenerCount[a] || (d.$$listenerCount[a] = 0),
                                    d.$$listenerCount[a]++;
                                while (d = d.$parent);
                                var e = this;
                                return function() {
                                    var d = c.indexOf(b); - 1 !== d && (c[d] = null, p(e, 1, a))
                                }
                            },
                            $emit: function(a) {
                                var b, c, d, e = [],
                                    f = this,
                                    g = !1,
                                    i = {
                                        name: a,
                                        targetScope: f,
                                        stopPropagation: function() {
                                            g = !0
                                        },
                                        preventDefault: function() {
                                            i.defaultPrevented = !0
                                        },
                                        defaultPrevented: !1
                                    },
                                    j = N([i], arguments, 1);
                                do {
                                    for (b = f.$$listeners[a] || e, i.currentScope = f, c = 0, d = b.length; d > c; c++) if (b[c]) try {
                                        b[c].apply(null, j)
                                    } catch(k) {
                                        h(k)
                                    } else b.splice(c, 1), c--, d--;
                                    if (g) return i.currentScope = null, i;
                                    f = f.$parent
                                } while ( f );
                                return i.currentScope = null,
                                    i
                            },
                            $broadcast: function(a) {
                                var b = this,
                                    c = b,
                                    d = b,
                                    e = {
                                        name: a,
                                        targetScope: b,
                                        preventDefault: function() {
                                            e.defaultPrevented = !0
                                        },
                                        defaultPrevented: !1
                                    };
                                if (!b.$$listenerCount[a]) return e;
                                for (var f, g, i, j = N([e], arguments, 1); c = d;) {
                                    for (e.currentScope = c, f = c.$$listeners[a] || [], g = 0, i = f.length; i > g; g++) if (f[g]) try {
                                        f[g].apply(null, j)
                                    } catch(k) {
                                        h(k)
                                    } else f.splice(g, 1),
                                        g--,
                                        i--;
                                    if (! (d = c.$$listenerCount[a] && c.$$childHead || c !== b && c.$$nextSibling)) for (; c !== b && !(d = c.$$nextSibling);) c = c.$parent
                                }
                                return e.currentScope = null,
                                    e
                            }
                        };
                        var v = new l,
                            w = v.$$asyncQueue = [],
                            y = v.$$postDigestQueue = [],
                            z = v.$$applyAsyncQueue = [];
                        return v
                    }]
        }
        function Wc() {
            var a = /^\s*(https?|ftp|mailto|tel|file):/,
                b = /^\s*((https?|ftp|file|blob):|data:image\/)/;
            this.aHrefSanitizationWhitelist = function(b) {
                return s(b) ? (a = b, this) : a
            },
                this.imgSrcSanitizationWhitelist = function(a) {
                    return s(a) ? (b = a, this) : b
                },
                this.$get = function() {
                    return function(c, d) {
                        var e, f = d ? b: a;
                        return e = dd(c).href,
                            "" === e || e.match(f) ? c: "unsafe:" + e
                    }
                }
        }
        function Xc(a) {
            if ("self" === a) return a;
            if (u(a)) {
                if (a.indexOf("***") > -1) throw sf("iwcard", "Illegal sequence *** in string matcher.  String: {0}", a);
                return a = le(a).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"),
                    new RegExp("^" + a + "$")
            }
            if (y(a)) return new RegExp("^" + a.source + "$");
            throw sf("imatcher", 'Matchers may only be "self", string patterns or RegExp objects')
        }
        function Yc(a) {
            var b = [];
            return s(a) && f(a,
                function(a) {
                    b.push(Xc(a))
                }),
                b
        }
        function Zc() {
            this.SCE_CONTEXTS = tf;
            var a = ["self"],
                b = [];
            this.resourceUrlWhitelist = function(b) {
                return arguments.length && (a = Yc(b)),
                    a
            },
                this.resourceUrlBlacklist = function(a) {
                    return arguments.length && (b = Yc(a)),
                        b
                },
                this.$get = ["$injector",
                    function(d) {
                        function e(a, b) {
                            return "self" === a ? ed(b) : !!a.exec(b.href)
                        }
                        function f(c) {
                            var d, f, g = dd(c.toString()),
                                h = !1;
                            for (d = 0, f = a.length; f > d; d++) if (e(a[d], g)) {
                                h = !0;
                                break
                            }
                            if (h) for (d = 0, f = b.length; f > d; d++) if (e(b[d], g)) {
                                h = !1;
                                break
                            }
                            return h
                        }
                        function g(a) {
                            var b = function(a) {
                                this.$$unwrapTrustedValue = function() {
                                    return a
                                }
                            };
                            return a && (b.prototype = new a),
                                b.prototype.valueOf = function() {
                                    return this.$$unwrapTrustedValue()
                                },
                                b.prototype.toString = function() {
                                    return this.$$unwrapTrustedValue().toString()
                                },
                                b
                        }
                        function h(a, b) {
                            var d = m.hasOwnProperty(a) ? m[a] : null;
                            if (!d) throw sf("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", a, b);
                            if (null === b || b === c || "" === b) return b;
                            if ("string" != typeof b) throw sf("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", a);
                            return new d(b)
                        }
                        function i(a) {
                            return a instanceof l ? a.$$unwrapTrustedValue() : a
                        }
                        function j(a, b) {
                            if (null === b || b === c || "" === b) return b;
                            var d = m.hasOwnProperty(a) ? m[a] : null;
                            if (d && b instanceof d) return b.$$unwrapTrustedValue();
                            if (a === tf.RESOURCE_URL) {
                                if (f(b)) return b;
                                throw sf("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", b.toString())
                            }
                            if (a === tf.HTML) return k(b);
                            throw sf("unsafe", "Attempting to use an unsafe value in a safe context.")
                        }
                        var k = function() {
                            throw sf("unsafe", "Attempting to use an unsafe value in a safe context.")
                        };
                        d.has("$sanitize") && (k = d.get("$sanitize"));
                        var l = g(),
                            m = {};
                        return m[tf.HTML] = g(l),
                            m[tf.CSS] = g(l),
                            m[tf.URL] = g(l),
                            m[tf.JS] = g(l),
                            m[tf.RESOURCE_URL] = g(m[tf.URL]),
                        {
                            trustAs: h,
                            getTrusted: j,
                            valueOf: i
                        }
                    }]
        }
        function $c() {
            var a = !0;
            this.enabled = function(b) {
                return arguments.length && (a = !!b),
                    a
            },
                this.$get = ["$parse", "$sceDelegate",
                    function(b, c) {
                        if (a && 8 > Zd) throw sf("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
                        var d = L(tf);
                        d.isEnabled = function() {
                            return a
                        },
                            d.trustAs = c.trustAs,
                            d.getTrusted = c.getTrusted,
                            d.valueOf = c.valueOf,
                        a || (d.trustAs = d.getTrusted = function(a, b) {
                            return b
                        },
                            d.valueOf = p),
                            d.parseAs = function(a, c) {
                                var e = b(c);
                                return e.literal && e.constant ? e: b(c,
                                    function(b) {
                                        return d.getTrusted(a, b)
                                    })
                            };
                        var e = d.parseAs,
                            g = d.getTrusted,
                            h = d.trustAs;
                        return f(tf,
                            function(a, b) {
                                var c = Ud(b);
                                d[pb("parse_as_" + c)] = function(b) {
                                    return e(a, b)
                                },
                                    d[pb("get_trusted_" + c)] = function(b) {
                                        return g(a, b)
                                    },
                                    d[pb("trust_as_" + c)] = function(b) {
                                        return h(a, b)
                                    }
                            }),
                            d
                    }]
        }
        function _c() {
            this.$get = ["$window", "$document",
                function(a, b) {
                    var c, d, e = {},
                        f = m((/android (\d+)/.exec(Ud((a.navigator || {}).userAgent)) || [])[1]),
                        g = /Boxee/i.test((a.navigator || {}).userAgent),
                        h = b[0] || {},
                        i = /^(Moz|webkit|ms)(?=[A-Z])/,
                        j = h.body && h.body.style,
                        k = !1,
                        l = !1;
                    if (j) {
                        for (var n in j) if (d = i.exec(n)) {
                            c = d[0],
                                c = c.substr(0, 1).toUpperCase() + c.substr(1);
                            break
                        }
                        c || (c = "WebkitOpacity" in j && "webkit"),
                            k = !!("transition" in j || c + "Transition" in j),
                            l = !!("animation" in j || c + "Animation" in j),
                        !f || k && l || (k = u(h.body.style.webkitTransition), l = u(h.body.style.webkitAnimation))
                    }
                    return {
                        history: !(!a.history || !a.history.pushState || 4 > f || g),
                        hasEvent: function(a) {
                            if ("input" === a && 11 >= Zd) return ! 1;
                            if (r(e[a])) {
                                var b = h.createElement("div");
                                e[a] = "on" + a in b
                            }
                            return e[a]
                        },
                        csp: me(),
                        vendorPrefix: c,
                        transitions: k,
                        animations: l,
                        android: f
                    }
                }]
        }
        function ad() {
            this.$get = ["$templateCache", "$http", "$q",
                function(a, b, c) {
                    function d(e, f) {
                        function g(a) {
                            if (!f) throw Ue("tpload", "Failed to load template: {0}", e);
                            return c.reject(a)
                        }
                        d.totalPendingRequests++;
                        var h = b.defaults && b.defaults.transformResponse;
                        je(h) ? h = h.filter(function(a) {
                            return a !== ec
                        }) : h === ec && (h = null);
                        var i = {
                            cache: a,
                            transformResponse: h
                        };
                        return b.get(e, i)["finally"](function() {
                            d.totalPendingRequests--
                        }).then(function(a) {
                                return a.data
                            },
                            g)
                    }
                    return d.totalPendingRequests = 0,
                        d
                }]
        }
        function bd() {
            this.$get = ["$rootScope", "$browser", "$location",
                function(a, b, c) {
                    var d = {};
                    return d.findBindings = function(a, b, c) {
                        var d = a.getElementsByClassName("ng-binding"),
                            e = [];
                        return f(d,
                            function(a) {
                                var d = ge.element(a).data("$binding");
                                d && f(d,
                                    function(d) {
                                        if (c) {
                                            var f = new RegExp("(^|\\s)" + le(b) + "(\\s|\\||$)");
                                            f.test(d) && e.push(a)
                                        } else - 1 != d.indexOf(b) && e.push(a)
                                    })
                            }),
                            e
                    },
                        d.findModels = function(a, b, c) {
                            for (var d = ["ng-", "data-ng-", "ng\\:"], e = 0; e < d.length; ++e) {
                                var f = c ? "=": "*=",
                                    g = "[" + d[e] + "model" + f + '"' + b + '"]',
                                    h = a.querySelectorAll(g);
                                if (h.length) return h
                            }
                        },
                        d.getLocation = function() {
                            return c.url()
                        },
                        d.setLocation = function(b) {
                            b !== c.url() && (c.url(b), a.$digest())
                        },
                        d.whenStable = function(a) {
                            b.notifyWhenNoOutstandingRequests(a)
                        },
                        d
                }]
        }
        function cd() {
            this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler",
                function(a, b, c, d, e) {
                    function f(f, h, i) {
                        var j, k = s(i) && !i,
                            l = (k ? d: c).defer(),
                            m = l.promise;
                        return j = b.defer(function() {
                                try {
                                    l.resolve(f())
                                } catch(b) {
                                    l.reject(b),
                                        e(b)
                                } finally {
                                    delete g[m.$$timeoutId]
                                }
                                k || a.$apply()
                            },
                            h),
                            m.$$timeoutId = j,
                            g[j] = l,
                            m
                    }
                    var g = {};
                    return f.cancel = function(a) {
                        return a && a.$$timeoutId in g ? (g[a.$$timeoutId].reject("canceled"), delete g[a.$$timeoutId], b.defer.cancel(a.$$timeoutId)) : !1
                    },
                        f
                }]
        }
        function dd(a) {
            var b = a;
            return Zd && (uf.setAttribute("href", b), b = uf.href),
                uf.setAttribute("href", b),
            {
                href: uf.href,
                protocol: uf.protocol ? uf.protocol.replace(/:$/, "") : "",
                host: uf.host,
                search: uf.search ? uf.search.replace(/^\?/, "") : "",
                hash: uf.hash ? uf.hash.replace(/^#/, "") : "",
                hostname: uf.hostname,
                port: uf.port,
                pathname: "/" === uf.pathname.charAt(0) ? uf.pathname: "/" + uf.pathname
            }
        }
        function ed(a) {
            var b = u(a) ? dd(a) : a;
            return b.protocol === vf.protocol && b.host === vf.host
        }
        function fd() {
            this.$get = q(a)
        }
        function gd(a) {
            function b(d, e) {
                if (t(d)) {
                    var g = {};
                    return f(d,
                        function(a, c) {
                            g[c] = b(c, a)
                        }),
                        g
                }
                return a.factory(d + c, e)
            }
            var c = "Filter";
            this.register = b,
                this.$get = ["$injector",
                    function(a) {
                        return function(b) {
                            return a.get(b + c)
                        }
                    }],
                b("currency", kd),
                b("date", vd),
                b("filter", hd),
                b("json", wd),
                b("limitTo", xd),
                b("lowercase", Af),
                b("number", ld),
                b("orderBy", yd),
                b("uppercase", Bf)
        }
        function hd() {
            return function(a, b, c) {
                if (!je(a)) return a;
                var d, e;
                switch (typeof b) {
                    case "function":
                        d = b;
                        break;
                    case "boolean":
                    case "number":
                    case "string":
                        e = !0;
                    case "object":
                        d = id(b, c, e);
                        break;
                    default:
                        return a
                }
                return a.filter(d)
            }
        }
        function id(a, b, c) {
            var d, e = t(a) && "$" in a;
            return b === !0 ? b = M: x(b) || (b = function(a, b) {
                return t(a) || t(b) ? !1 : (a = Ud("" + a), b = Ud("" + b), -1 !== a.indexOf(b))
            }),
                d = function(d) {
                    return e && !t(d) ? jd(d, a.$, b, !1) : jd(d, a, b, c)
                }
        }
        function jd(a, b, c, d, e) {
            var f = typeof a,
                g = typeof b;
            if ("string" === g && "!" === b.charAt(0)) return ! jd(a, b.substring(1), c, d);
            if (je(a)) return a.some(function(a) {
                return jd(a, b, c, d)
            });
            switch (f) {
                case "object":
                    var h;
                    if (d) {
                        for (h in a) if ("$" !== h.charAt(0) && jd(a[h], b, c, !0)) return ! 0;
                        return e ? !1 : jd(a, b, c, !1)
                    }
                    if ("object" === g) {
                        for (h in b) {
                            var i = b[h];
                            if (!x(i)) {
                                var j = "$" === h,
                                    k = j ? a: a[h];
                                if (!jd(k, i, c, j, j)) return ! 1
                            }
                        }
                        return ! 0
                    }
                    return c(a, b);
                case "function":
                    return ! 1;
                default:
                    return c(a, b)
            }
        }
        function kd(a) {
            var b = a.NUMBER_FORMATS;
            return function(a, c, d) {
                return r(c) && (c = b.CURRENCY_SYM),
                r(d) && (d = b.PATTERNS[1].maxFrac),
                    null == a ? a: md(a, b.PATTERNS[1], b.GROUP_SEP, b.DECIMAL_SEP, d).replace(/\u00A4/g, c)
            }
        }
        function ld(a) {
            var b = a.NUMBER_FORMATS;
            return function(a, c) {
                return null == a ? a: md(a, b.PATTERNS[0], b.GROUP_SEP, b.DECIMAL_SEP, c)
            }
        }
        function md(a, b, c, d, e) {
            if (!isFinite(a) || t(a)) return "";
            var f = 0 > a;
            a = Math.abs(a);
            var g = a + "",
                h = "",
                i = [],
                j = !1;
            if ( - 1 !== g.indexOf("e")) {
                var k = g.match(/([\d\.]+)e(-?)(\d+)/);
                k && "-" == k[2] && k[3] > e + 1 ? a = 0 : (h = g, j = !0)
            }
            if (j) e > 0 && 1 > a && (h = a.toFixed(e), a = parseFloat(h));
            else {
                var l = (g.split(wf)[1] || "").length;
                r(e) && (e = Math.min(Math.max(b.minFrac, l), b.maxFrac)),
                    a = +(Math.round( + (a.toString() + "e" + e)).toString() + "e" + -e);
                var m = ("" + a).split(wf),
                    n = m[0];
                m = m[1] || "";
                var o, p = 0,
                    q = b.lgSize,
                    s = b.gSize;
                if (n.length >= q + s) for (p = n.length - q, o = 0; p > o; o++)(p - o) % s === 0 && 0 !== o && (h += c),
                    h += n.charAt(o);
                for (o = p; o < n.length; o++)(n.length - o) % q === 0 && 0 !== o && (h += c),
                    h += n.charAt(o);
                for (; m.length < e;) m += "0";
                e && "0" !== e && (h += d + m.substr(0, e))
            }
            return 0 === a && (f = !1),
                i.push(f ? b.negPre: b.posPre, h, f ? b.negSuf: b.posSuf),
                i.join("")
        }
        function nd(a, b, c) {
            var d = "";
            for (0 > a && (d = "-", a = -a), a = "" + a; a.length < b;) a = "0" + a;
            return c && (a = a.substr(a.length - b)),
            d + a
        }
        function od(a, b, c, d) {
            return c = c || 0,
                function(e) {
                    var f = e["get" + a]();
                    return (c > 0 || f > -c) && (f += c),
                    0 === f && -12 == c && (f = 12),
                        nd(f, b, d)
                }
        }
        function pd(a, b) {
            return function(c, d) {
                var e = c["get" + a](),
                    f = Wd(b ? "SHORT" + a: a);
                return d[f][e]
            }
        }
        function qd(a) {
            var b = -1 * a.getTimezoneOffset(),
                c = b >= 0 ? "+": "";
            return c += nd(Math[b > 0 ? "floor": "ceil"](b / 60), 2) + nd(Math.abs(b % 60), 2)
        }
        function rd(a) {
            var b = new Date(a, 0, 1).getDay();
            return new Date(a, 0, (4 >= b ? 5 : 12) - b)
        }
        function sd(a) {
            return new Date(a.getFullYear(), a.getMonth(), a.getDate() + (4 - a.getDay()))
        }
        function td(a) {
            return function(b) {
                var c = rd(b.getFullYear()),
                    d = sd(b),
                    e = +d - +c,
                    f = 1 + Math.round(e / 6048e5);
                return nd(f, a)
            }
        }
        function ud(a, b) {
            return a.getHours() < 12 ? b.AMPMS[0] : b.AMPMS[1]
        }
        function vd(a) {
            function b(a) {
                var b;
                if (b = a.match(c)) {
                    var d = new Date(0),
                        e = 0,
                        f = 0,
                        g = b[8] ? d.setUTCFullYear: d.setFullYear,
                        h = b[8] ? d.setUTCHours: d.setHours;
                    b[9] && (e = m(b[9] + b[10]), f = m(b[9] + b[11])),
                        g.call(d, m(b[1]), m(b[2]) - 1, m(b[3]));
                    var i = m(b[4] || 0) - e,
                        j = m(b[5] || 0) - f,
                        k = m(b[6] || 0),
                        l = Math.round(1e3 * parseFloat("0." + (b[7] || 0)));
                    return h.call(d, i, j, k, l),
                        d
                }
                return a
            }
            var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
            return function(c, d, e) {
                var g, h, i = "",
                    j = [];
                if (d = d || "mediumDate", d = a.DATETIME_FORMATS[d] || d, u(c) && (c = zf.test(c) ? m(c) : b(c)), v(c) && (c = new Date(c)), !w(c)) return c;
                for (; d;) h = yf.exec(d),
                    h ? (j = N(j, h, 1), d = j.pop()) : (j.push(d), d = null);
                return e && "UTC" === e && (c = new Date(c.getTime()), c.setMinutes(c.getMinutes() + c.getTimezoneOffset())),
                    f(j,
                        function(b) {
                            g = xf[b],
                                i += g ? g(c, a.DATETIME_FORMATS) : b.replace(/(^'|'$)/g, "").replace(/''/g, "'")
                        }),
                    i
            }
        }
        function wd() {
            return function(a, b) {
                return r(b) && (b = 2),
                    R(a, b)
            }
        }
        function xd() {
            return function(a, b) {
                return v(a) && (a = a.toString()),
                    je(a) || u(a) ? (b = 1 / 0 === Math.abs(Number(b)) ? Number(b) : m(b), b ? b > 0 ? a.slice(0, b) : a.slice(b) : u(a) ? "": []) : a
            }
        }
        function yd(a) {
            return function(b, c, d) {
                function f(a, b) {
                    for (var d = 0; d < c.length; d++) {
                        var e = c[d](a, b);
                        if (0 !== e) return e
                    }
                    return 0
                }
                function g(a, b) {
                    return b ?
                        function(b, c) {
                            return a(c, b)
                        }: a
                }
                function h(a) {
                    switch (typeof a) {
                        case "number":
                        case "boolean":
                        case "string":
                            return ! 0;
                        default:
                            return ! 1
                    }
                }
                function i(a) {
                    return null === a ? "null": "function" == typeof a.valueOf && (a = a.valueOf(), h(a)) ? a: "function" == typeof a.toString && (a = a.toString(), h(a)) ? a: ""
                }
                function j(a, b) {
                    var c = typeof a,
                        d = typeof b;
                    return c === d && "object" === c && (a = i(a), b = i(b)),
                        c === d ? ("string" === c && (a = a.toLowerCase(), b = b.toLowerCase()), a === b ? 0 : b > a ? -1 : 1) : d > c ? -1 : 1
                }
                return e(b) ? (c = je(c) ? c: [c], 0 === c.length && (c = ["+"]), c = c.map(function(b) {
                    var c = !1,
                        d = b || p;
                    if (u(b)) {
                        if (("+" == b.charAt(0) || "-" == b.charAt(0)) && (c = "-" == b.charAt(0), b = b.substring(1)), "" === b) return g(j, c);
                        if (d = a(b), d.constant) {
                            var e = d();
                            return g(function(a, b) {
                                    return j(a[e], b[e])
                                },
                                c)
                        }
                    }
                    return g(function(a, b) {
                            return j(d(a), d(b))
                        },
                        c)
                }), be.call(b).sort(g(f, d))) : b
            }
        }
        function zd(a) {
            return x(a) && (a = {
                link: a
            }),
                a.restrict = a.restrict || "AC",
                q(a)
        }
        function Ad(a, b) {
            a.$name = b
        }
        function Bd(a, b, d, e, g) {
            var h = this,
                i = [],
                j = h.$$parentForm = a.parent().controller("form") || Ef;
            h.$error = {},
                h.$$success = {},
                h.$pending = c,
                h.$name = g(b.name || b.ngForm || "")(d),
                h.$dirty = !1,
                h.$pristine = !0,
                h.$valid = !0,
                h.$invalid = !1,
                h.$submitted = !1,
                j.$addControl(h),
                h.$rollbackViewValue = function() {
                    f(i,
                        function(a) {
                            a.$rollbackViewValue()
                        })
                },
                h.$commitViewValue = function() {
                    f(i,
                        function(a) {
                            a.$commitViewValue()
                        })
                },
                h.$addControl = function(a) {
                    gb(a.$name, "input"),
                        i.push(a),
                    a.$name && (h[a.$name] = a)
                },
                h.$$renameControl = function(a, b) {
                    var c = a.$name;
                    h[c] === a && delete h[c],
                        h[b] = a,
                        a.$name = b
                },
                h.$removeControl = function(a) {
                    a.$name && h[a.$name] === a && delete h[a.$name],
                        f(h.$pending,
                            function(b, c) {
                                h.$setValidity(c, null, a)
                            }),
                        f(h.$error,
                            function(b, c) {
                                h.$setValidity(c, null, a)
                            }),
                        f(h.$$success,
                            function(b, c) {
                                h.$setValidity(c, null, a)
                            }),
                        J(i, a)
                },
                Qd({
                    ctrl: this,
                    $element: a,
                    set: function(a, b, c) {
                        var d = a[b];
                        if (d) {
                            var e = d.indexOf(c); - 1 === e && d.push(c)
                        } else a[b] = [c]
                    },
                    unset: function(a, b, c) {
                        var d = a[b];
                        d && (J(d, c), 0 === d.length && delete a[b])
                    },
                    parentForm: j,
                    $animate: e
                }),
                h.$setDirty = function() {
                    e.removeClass(a, mg),
                        e.addClass(a, ng),
                        h.$dirty = !0,
                        h.$pristine = !1,
                        j.$setDirty()
                },
                h.$setPristine = function() {
                    e.setClass(a, mg, ng + " " + Ff),
                        h.$dirty = !1,
                        h.$pristine = !0,
                        h.$submitted = !1,
                        f(i,
                            function(a) {
                                a.$setPristine()
                            })
                },
                h.$setUntouched = function() {
                    f(i,
                        function(a) {
                            a.$setUntouched()
                        })
                },
                h.$setSubmitted = function() {
                    e.addClass(a, Ff),
                        h.$submitted = !0,
                        j.$setSubmitted()
                }
        }
        function Cd(a) {
            a.$formatters.push(function(b) {
                return a.$isEmpty(b) ? b: b.toString()
            })
        }
        function Dd(a, b, c, d, e, f) {
            Ed(a, b, c, d, e, f),
                Cd(d)
        }
        function Ed(a, b, c, d, e, f) {
            var g = Ud(b[0].type);
            if (!e.android) {
                var h = !1;
                b.on("compositionstart",
                    function() {
                        h = !0
                    }),
                    b.on("compositionend",
                        function() {
                            h = !1,
                                i()
                        })
            }
            var i = function(a) {
                if (j && (f.defer.cancel(j), j = null), !h) {
                    var e = b.val(),
                        i = a && a.type;
                    "password" === g || c.ngTrim && "false" === c.ngTrim || (e = ke(e)),
                    (d.$viewValue !== e || "" === e && d.$$hasNativeValidators) && d.$setViewValue(e, i)
                }
            };
            if (e.hasEvent("input")) b.on("input", i);
            else {
                var j, k = function(a, b, c) {
                    j || (j = f.defer(function() {
                        j = null,
                        b && b.value === c || i(a)
                    }))
                };
                b.on("keydown",
                    function(a) {
                        var b = a.keyCode;
                        91 === b || b > 15 && 19 > b || b >= 37 && 40 >= b || k(a, this, this.value)
                    }),
                e.hasEvent("paste") && b.on("paste cut", k)
            }
            b.on("change", i),
                d.$render = function() {
                    b.val(d.$isEmpty(d.$viewValue) ? "": d.$viewValue)
                }
        }
        function Fd(a, b) {
            if (w(a)) return a;
            if (u(a)) {
                Pf.lastIndex = 0;
                var c = Pf.exec(a);
                if (c) {
                    var d = +c[1],
                        e = +c[2],
                        f = 0,
                        g = 0,
                        h = 0,
                        i = 0,
                        j = rd(d),
                        k = 7 * (e - 1);
                    return b && (f = b.getHours(), g = b.getMinutes(), h = b.getSeconds(), i = b.getMilliseconds()),
                        new Date(d, 0, j.getDate() + k, f, g, h, i)
                }
            }
            return 0 / 0
        }
        function Gd(a, b) {
            return function(c, d) {
                var e, g;
                if (w(c)) return c;
                if (u(c)) {
                    if ('"' == c.charAt(0) && '"' == c.charAt(c.length - 1) && (c = c.substring(1, c.length - 1)), Jf.test(c)) return new Date(c);
                    if (a.lastIndex = 0, e = a.exec(c)) return e.shift(),
                        g = d ? {
                            yyyy: d.getFullYear(),
                            MM: d.getMonth() + 1,
                            dd: d.getDate(),
                            HH: d.getHours(),
                            mm: d.getMinutes(),
                            ss: d.getSeconds(),
                            sss: d.getMilliseconds() / 1e3
                        }: {
                            yyyy: 1970,
                            MM: 1,
                            dd: 1,
                            HH: 0,
                            mm: 0,
                            ss: 0,
                            sss: 0
                        },
                        f(e,
                            function(a, c) {
                                c < b.length && (g[b[c]] = +a)
                            }),
                        new Date(g.yyyy, g.MM - 1, g.dd, g.HH, g.mm, g.ss || 0, 1e3 * g.sss || 0)
                }
                return 0 / 0
            }
        }
        function Hd(a, b, d, e) {
            return function(f, g, h, i, j, k, l) {
                function m(a) {
                    return a && !(a.getTime && a.getTime() !== a.getTime())
                }
                function n(a) {
                    return s(a) ? w(a) ? a: d(a) : c
                }
                Id(f, g, h, i),
                    Ed(f, g, h, i, j, k);
                var o, p = i && i.$options && i.$options.timezone;
                if (i.$$parserName = a, i.$parsers.push(function(a) {
                        if (i.$isEmpty(a)) return null;
                        if (b.test(a)) {
                            var e = d(a, o);
                            return "UTC" === p && e.setMinutes(e.getMinutes() - e.getTimezoneOffset()),
                                e
                        }
                        return c
                    }), i.$formatters.push(function(a) {
                        if (a && !w(a)) throw rg("datefmt", "Expected `{0}` to be a date", a);
                        if (m(a)) {
                            if (o = a, o && "UTC" === p) {
                                var b = 6e4 * o.getTimezoneOffset();
                                o = new Date(o.getTime() + b)
                            }
                            return l("date")(a, e, p)
                        }
                        return o = null,
                            ""
                    }), s(h.min) || h.ngMin) {
                    var q;
                    i.$validators.min = function(a) {
                        return ! m(a) || r(q) || d(a) >= q
                    },
                        h.$observe("min",
                            function(a) {
                                q = n(a),
                                    i.$validate()
                            })
                }
                if (s(h.max) || h.ngMax) {
                    var t;
                    i.$validators.max = function(a) {
                        return ! m(a) || r(t) || d(a) <= t
                    },
                        h.$observe("max",
                            function(a) {
                                t = n(a),
                                    i.$validate()
                            })
                }
            }
        }
        function Id(a, b, d, e) {
            var f = b[0],
                g = e.$$hasNativeValidators = t(f.validity);
            g && e.$parsers.push(function(a) {
                var d = b.prop(Td) || {};
                return d.badInput && !d.typeMismatch ? c: a
            })
        }
        function Jd(a, b, d, e, f, g) {
            if (Id(a, b, d, e), Ed(a, b, d, e, f, g), e.$$parserName = "number", e.$parsers.push(function(a) {
                    return e.$isEmpty(a) ? null: Mf.test(a) ? parseFloat(a) : c
                }), e.$formatters.push(function(a) {
                    if (!e.$isEmpty(a)) {
                        if (!v(a)) throw rg("numfmt", "Expected `{0}` to be a number", a);
                        a = a.toString()
                    }
                    return a
                }), d.min || d.ngMin) {
                var h;
                e.$validators.min = function(a) {
                    return e.$isEmpty(a) || r(h) || a >= h
                },
                    d.$observe("min",
                        function(a) {
                            s(a) && !v(a) && (a = parseFloat(a, 10)),
                                h = v(a) && !isNaN(a) ? a: c,
                                e.$validate()
                        })
            }
            if (d.max || d.ngMax) {
                var i;
                e.$validators.max = function(a) {
                    return e.$isEmpty(a) || r(i) || i >= a
                },
                    d.$observe("max",
                        function(a) {
                            s(a) && !v(a) && (a = parseFloat(a, 10)),
                                i = v(a) && !isNaN(a) ? a: c,
                                e.$validate()
                        })
            }
        }
        function Kd(a, b, c, d, e, f) {
            Ed(a, b, c, d, e, f),
                Cd(d),
                d.$$parserName = "url",
                d.$validators.url = function(a, b) {
                    var c = a || b;
                    return d.$isEmpty(c) || Kf.test(c)
                }
        }
        function Ld(a, b, c, d, e, f) {
            Ed(a, b, c, d, e, f),
                Cd(d),
                d.$$parserName = "email",
                d.$validators.email = function(a, b) {
                    var c = a || b;
                    return d.$isEmpty(c) || Lf.test(c)
                }
        }
        function Md(a, b, c, d) {
            r(c.name) && b.attr("name", j());
            var e = function(a) {
                b[0].checked && d.$setViewValue(c.value, a && a.type)
            };
            b.on("click", e),
                d.$render = function() {
                    var a = c.value;
                    b[0].checked = a == d.$viewValue
                },
                c.$observe("value", d.$render)
        }
        function Nd(a, b, c, e, f) {
            var g;
            if (s(e)) {
                if (g = a(e), !g.constant) throw d("ngModel")("constexpr", "Expected constant expression for `{0}`, but saw `{1}`.", c, e);
                return g(b)
            }
            return f
        }
        function Od(a, b, c, d, e, f, g, h) {
            var i = Nd(h, a, "ngTrueValue", c.ngTrueValue, !0),
                j = Nd(h, a, "ngFalseValue", c.ngFalseValue, !1),
                k = function(a) {
                    d.$setViewValue(b[0].checked, a && a.type)
                };
            b.on("click", k),
                d.$render = function() {
                    b[0].checked = d.$viewValue
                },
                d.$isEmpty = function(a) {
                    return a === !1
                },
                d.$formatters.push(function(a) {
                    return M(a, i)
                }),
                d.$parsers.push(function(a) {
                    return a ? i: j
                })
        }
        function Pd(a, b) {
            return a = "ngClass" + a,
                ["$animate",
                    function(c) {
                        function d(a, b) {
                            var c = [];
                            a: for (var d = 0; d < a.length; d++) {
                                for (var e = a[d], f = 0; f < b.length; f++) if (e == b[f]) continue a;
                                c.push(e)
                            }
                            return c
                        }
                        function e(a) {
                            if (je(a)) return a;
                            if (u(a)) return a.split(" ");
                            if (t(a)) {
                                var b = [];
                                return f(a,
                                    function(a, c) {
                                        a && (b = b.concat(c.split(" ")))
                                    }),
                                    b
                            }
                            return a
                        }
                        return {
                            restrict: "AC",
                            link: function(g, h, i) {
                                function j(a) {
                                    var b = l(a, 1);
                                    i.$addClass(b)
                                }
                                function k(a) {
                                    var b = l(a, -1);
                                    i.$removeClass(b)
                                }
                                function l(a, b) {
                                    var c = h.data("$classCounts") || {},
                                        d = [];
                                    return f(a,
                                        function(a) { (b > 0 || c[a]) && (c[a] = (c[a] || 0) + b, c[a] === +(b > 0) && d.push(a))
                                        }),
                                        h.data("$classCounts", c),
                                        d.join(" ")
                                }
                                function m(a, b) {
                                    var e = d(b, a),
                                        f = d(a, b);
                                    e = l(e, 1),
                                        f = l(f, -1),
                                    e && e.length && c.addClass(h, e),
                                    f && f.length && c.removeClass(h, f)
                                }
                                function n(a) {
                                    if (b === !0 || g.$index % 2 === b) {
                                        var c = e(a || []);
                                        if (o) {
                                            if (!M(a, o)) {
                                                var d = e(o);
                                                m(d, c)
                                            }
                                        } else j(c)
                                    }
                                    o = L(a)
                                }
                                var o;
                                g.$watch(i[a], n, !0),
                                    i.$observe("class",
                                        function() {
                                            n(g.$eval(i[a]))
                                        }),
                                "ngClass" !== a && g.$watch("$index",
                                    function(c, d) {
                                        var f = 1 & c;
                                        if (f !== (1 & d)) {
                                            var h = e(g.$eval(i[a]));
                                            f === b ? j(h) : k(h)
                                        }
                                    })
                            }
                        }
                    }]
        }
        function Qd(a) {
            function b(a, b, i) {
                b === c ? d("$pending", a, i) : e("$pending", a, i),
                    E(b) ? b ? (l(h.$error, a, i), k(h.$$success, a, i)) : (k(h.$error, a, i), l(h.$$success, a, i)) : (l(h.$error, a, i), l(h.$$success, a, i)),
                    h.$pending ? (f(qg, !0), h.$valid = h.$invalid = c, g("", null)) : (f(qg, !1), h.$valid = Rd(h.$error), h.$invalid = !h.$valid, g("", h.$valid));
                var j;
                j = h.$pending && h.$pending[a] ? c: h.$error[a] ? !1 : h.$$success[a] ? !0 : null,
                    g(a, j),
                    m.$setValidity(a, j, h)
            }
            function d(a, b, c) {
                h[a] || (h[a] = {}),
                    k(h[a], b, c)
            }
            function e(a, b, d) {
                h[a] && l(h[a], b, d),
                Rd(h[a]) && (h[a] = c)
            }
            function f(a, b) {
                b && !j[a] ? (n.addClass(i, a), j[a] = !0) : !b && j[a] && (n.removeClass(i, a), j[a] = !1)
            }
            function g(a, b) {
                a = a ? "-" + cb(a, "-") : "",
                    f(kg + a, b === !0),
                    f(lg + a, b === !1)
            }
            var h = a.ctrl,
                i = a.$element,
                j = {},
                k = a.set,
                l = a.unset,
                m = a.parentForm,
                n = a.$animate;
            j[lg] = !(j[kg] = i.hasClass(kg)),
                h.$setValidity = b
        }
        function Rd(a) {
            if (a) for (var b in a) return ! 1;
            return ! 0
        }
        var Sd = /^\/(.+)\/([a-z]*)$/,
            Td = "validity",
            Ud = function(a) {
                return u(a) ? a.toLowerCase() : a
            },
            Vd = Object.prototype.hasOwnProperty,
            Wd = function(a) {
                return u(a) ? a.toUpperCase() : a
            },
            Xd = function(a) {
                return u(a) ? a.replace(/[A-Z]/g,
                    function(a) {
                        return String.fromCharCode(32 | a.charCodeAt(0))
                    }) : a
            },
            Yd = function(a) {
                return u(a) ? a.replace(/[a-z]/g,
                    function(a) {
                        return String.fromCharCode( - 33 & a.charCodeAt(0))
                    }) : a
            };
        "i" !== "I".toLowerCase() && (Ud = Xd, Wd = Yd);
        var Zd, $d, _d, ae, be = [].slice,
            ce = [].splice,
            de = [].push,
            ee = Object.prototype.toString,
            fe = d("ng"),
            ge = a.angular || (a.angular = {}),
            he = 0;
        Zd = b.documentMode,
            o.$inject = [],
            p.$inject = [];
        var ie, je = Array.isArray,
            ke = function(a) {
                return u(a) ? a.trim() : a
            },
            le = function(a) {
                return a.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
            },
            me = function() {
                if (s(me.isActive_)) return me.isActive_;
                var a = !(!b.querySelector("[ng-csp]") && !b.querySelector("[data-ng-csp]"));
                if (!a) try {
                    new Function("")
                } catch(c) {
                    a = !0
                }
                return me.isActive_ = a
            },
            ne = ["ng-", "data-ng-", "ng:", "x-ng-"],
            oe = /[A-Z]/g,
            pe = !1,
            qe = 1,
            re = 3,
            se = 8,
            te = 9,
            ue = 11,
            ve = {
                full: "1.3.13",
                major: 1,
                minor: 3,
                dot: 13,
                codeName: "meticulous-riffleshuffle"
            };
        ub.expando = "ng339";
        var we = ub.cache = {},
            xe = 1,
            ye = function(a, b, c) {
                a.addEventListener(b, c, !1)
            },
            ze = function(a, b, c) {
                a.removeEventListener(b, c, !1)
            };
        ub._data = function(a) {
            return this.cache[a[this.expando]] || {}
        };
        var Ae = /([\:\-\_]+(.))/g,
            Be = /^moz([A-Z])/,
            Ce = {
                mouseleave: "mouseout",
                mouseenter: "mouseover"
            },
            De = d("jqLite"),
            Ee = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            Fe = /<|&#?\w+;/,
            Ge = /<([\w:]+)/,
            He = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            Ie = {
                option: [1, '<select multiple="multiple">', "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
        Ie.optgroup = Ie.option,
            Ie.tbody = Ie.tfoot = Ie.colgroup = Ie.caption = Ie.thead,
            Ie.th = Ie.td;
        var Je = ub.prototype = {
                ready: function(c) {
                    function d() {
                        e || (e = !0, c())
                    }
                    var e = !1;
                    "complete" === b.readyState ? setTimeout(d) : (this.on("DOMContentLoaded", d), ub(a).on("load", d))
                },
                toString: function() {
                    var a = [];
                    return f(this,
                        function(b) {
                            a.push("" + b)
                        }),
                    "[" + a.join(", ") + "]"
                },
                eq: function(a) {
                    return $d(a >= 0 ? this[a] : this[this.length + a])
                },
                length: 0,
                push: de,
                sort: [].sort,
                splice: [].splice
            },
            Ke = {};
        f("multiple,selected,checked,disabled,readOnly,required,open".split(","),
            function(a) {
                Ke[Ud(a)] = a
            });
        var Le = {};
        f("input,select,option,textarea,button,form,details".split(","),
            function(a) {
                Le[a] = !0
            });
        var Me = {
            ngMinlength: "minlength",
            ngMaxlength: "maxlength",
            ngMin: "min",
            ngMax: "max",
            ngPattern: "pattern"
        };
        f({
                data: Ab,
                removeData: yb
            },
            function(a, b) {
                ub[b] = a
            }),
            f({
                    data: Ab,
                    inheritedData: Gb,
                    scope: function(a) {
                        return $d.data(a, "$scope") || Gb(a.parentNode || a, ["$isolateScope", "$scope"])
                    },
                    isolateScope: function(a) {
                        return $d.data(a, "$isolateScope") || $d.data(a, "$isolateScopeNoTemplate")
                    },
                    controller: Fb,
                    injector: function(a) {
                        return Gb(a, "$injector")
                    },
                    removeAttr: function(a, b) {
                        a.removeAttribute(b)
                    },
                    hasClass: Bb,
                    css: function(a, b, c) {
                        return b = pb(b),
                            s(c) ? void(a.style[b] = c) : a.style[b]
                    },
                    attr: function(a, b, d) {
                        var e = Ud(b);
                        if (Ke[e]) {
                            if (!s(d)) return a[b] || (a.attributes.getNamedItem(b) || o).specified ? e: c;
                            d ? (a[b] = !0, a.setAttribute(b, e)) : (a[b] = !1, a.removeAttribute(e))
                        } else if (s(d)) a.setAttribute(b, d);
                        else if (a.getAttribute) {
                            var f = a.getAttribute(b, 2);
                            return null === f ? c: f
                        }
                    },
                    prop: function(a, b, c) {
                        return s(c) ? void(a[b] = c) : a[b]
                    },
                    text: function() {
                        function a(a, b) {
                            if (r(b)) {
                                var c = a.nodeType;
                                return c === qe || c === re ? a.textContent: ""
                            }
                            a.textContent = b
                        }
                        return a.$dv = "",
                            a
                    } (),
                    val: function(a, b) {
                        if (r(b)) {
                            if (a.multiple && "select" === I(a)) {
                                var c = [];
                                return f(a.options,
                                    function(a) {
                                        a.selected && c.push(a.value || a.text)
                                    }),
                                    0 === c.length ? null: c
                            }
                            return a.value
                        }
                        a.value = b
                    },
                    html: function(a, b) {
                        return r(b) ? a.innerHTML: (wb(a, !0), void(a.innerHTML = b))
                    },
                    empty: Hb
                },
                function(a, b) {
                    ub.prototype[b] = function(b, d) {
                        var e, f, g = this.length;
                        if (a !== Hb && (2 == a.length && a !== Bb && a !== Fb ? b: d) === c) {
                            if (t(b)) {
                                for (e = 0; g > e; e++) if (a === Ab) a(this[e], b);
                                else for (f in b) a(this[e], f, b[f]);
                                return this
                            }
                            for (var h = a.$dv,
                                     i = h === c ? Math.min(g, 1) : g, j = 0; i > j; j++) {
                                var k = a(this[j], b, d);
                                h = h ? h + k: k
                            }
                            return h
                        }
                        for (e = 0; g > e; e++) a(this[e], b, d);
                        return this
                    }
                }),
            f({
                    removeData: yb,
                    on: function Sg(a, b, c, d) {
                        if (s(d)) throw De("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
                        if (rb(a)) {
                            var e = zb(a, !0),
                                f = e.events,
                                g = e.handle;
                            g || (g = e.handle = Mb(a, f));
                            for (var h = b.indexOf(" ") >= 0 ? b.split(" ") : [b], i = h.length; i--;) {
                                b = h[i];
                                var j = f[b];
                                j || (f[b] = [], "mouseenter" === b || "mouseleave" === b ? Sg(a, Ce[b],
                                    function(a) {
                                        var c = this,
                                            d = a.relatedTarget; (!d || d !== c && !c.contains(d)) && g(a, b)
                                    }) : "$destroy" !== b && ye(a, b, g), j = f[b]),
                                    j.push(c)
                            }
                        }
                    },
                    off: xb,
                    one: function(a, b, c) {
                        a = $d(a),
                            a.on(b,
                                function d() {
                                    a.off(b, c),
                                        a.off(b, d)
                                }),
                            a.on(b, c)
                    },
                    replaceWith: function(a, b) {
                        var c, d = a.parentNode;
                        wb(a),
                            f(new ub(b),
                                function(b) {
                                    c ? d.insertBefore(b, c.nextSibling) : d.replaceChild(b, a),
                                        c = b
                                })
                    },
                    children: function(a) {
                        var b = [];
                        return f(a.childNodes,
                            function(a) {
                                a.nodeType === qe && b.push(a)
                            }),
                            b
                    },
                    contents: function(a) {
                        return a.contentDocument || a.childNodes || []
                    },
                    append: function(a, b) {
                        var c = a.nodeType;
                        if (c === qe || c === ue) {
                            b = new ub(b);
                            for (var d = 0,
                                     e = b.length; e > d; d++) {
                                var f = b[d];
                                a.appendChild(f)
                            }
                        }
                    },
                    prepend: function(a, b) {
                        if (a.nodeType === qe) {
                            var c = a.firstChild;
                            f(new ub(b),
                                function(b) {
                                    a.insertBefore(b, c)
                                })
                        }
                    },
                    wrap: function(a, b) {
                        b = $d(b).eq(0).clone()[0];
                        var c = a.parentNode;
                        c && c.replaceChild(b, a),
                            b.appendChild(a)
                    },
                    remove: Ib,
                    detach: function(a) {
                        Ib(a, !0)
                    },
                    after: function(a, b) {
                        var c = a,
                            d = a.parentNode;
                        b = new ub(b);
                        for (var e = 0,
                                 f = b.length; f > e; e++) {
                            var g = b[e];
                            d.insertBefore(g, c.nextSibling),
                                c = g
                        }
                    },
                    addClass: Db,
                    removeClass: Cb,
                    toggleClass: function(a, b, c) {
                        b && f(b.split(" "),
                            function(b) {
                                var d = c;
                                r(d) && (d = !Bb(a, b)),
                                    (d ? Db: Cb)(a, b)
                            })
                    },
                    parent: function(a) {
                        var b = a.parentNode;
                        return b && b.nodeType !== ue ? b: null
                    },
                    next: function(a) {
                        return a.nextElementSibling
                    },
                    find: function(a, b) {
                        return a.getElementsByTagName ? a.getElementsByTagName(b) : []
                    },
                    clone: vb,
                    triggerHandler: function(a, b, c) {
                        var d, e, g, h = b.type || b,
                            i = zb(a),
                            j = i && i.events,
                            k = j && j[h];
                        k && (d = {
                            preventDefault: function() {
                                this.defaultPrevented = !0
                            },
                            isDefaultPrevented: function() {
                                return this.defaultPrevented === !0
                            },
                            stopImmediatePropagation: function() {
                                this.immediatePropagationStopped = !0
                            },
                            isImmediatePropagationStopped: function() {
                                return this.immediatePropagationStopped === !0
                            },
                            stopPropagation: o,
                            type: h,
                            target: a
                        },
                        b.type && (d = l(d, b)), e = L(k), g = c ? [d].concat(c) : [d], f(e,
                            function(b) {
                                d.isImmediatePropagationStopped() || b.apply(a, g)
                            }))
                    }
                },
                function(a, b) {
                    ub.prototype[b] = function(b, c, d) {
                        for (var e, f = 0,
                                 g = this.length; g > f; f++) r(e) ? (e = a(this[f], b, c, d), s(e) && (e = $d(e))) : Eb(e, a(this[f], b, c, d));
                        return s(e) ? e: this
                    },
                        ub.prototype.bind = ub.prototype.on,
                        ub.prototype.unbind = ub.prototype.off
                }),
            Pb.prototype = {
                put: function(a, b) {
                    this[Ob(a, this.nextUid)] = b
                },
                get: function(a) {
                    return this[Ob(a, this.nextUid)]
                },
                remove: function(a) {
                    var b = this[a = Ob(a, this.nextUid)];
                    return delete this[a],
                        b
                }
            };
        var Ne = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
            Oe = /,/,
            Pe = /^\s*(_?)(\S+?)\1\s*$/,
            Qe = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
            Re = d("$injector");
        Sb.$$annotate = Rb;
        var Se = d("$animate"),
            Te = ["$provide",
                function(a) {
                    this.$$selectors = {},
                        this.register = function(b, c) {
                            var d = b + "-animation";
                            if (b && "." != b.charAt(0)) throw Se("notcsel", "Expecting class selector starting with '.' got '{0}'.", b);
                            this.$$selectors[b.substr(1)] = d,
                                a.factory(d, c)
                        },
                        this.classNameFilter = function(a) {
                            return 1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a: null),
                                this.$$classNameFilter
                        },
                        this.$get = ["$$q", "$$asyncCallback", "$rootScope",
                            function(a, b, c) {
                                function d(b) {
                                    var d, e = a.defer();
                                    return e.promise.$$cancelFn = function() {
                                        d && d()
                                    },
                                        c.$$postDigest(function() {
                                            d = b(function() {
                                                e.resolve()
                                            })
                                        }),
                                        e.promise
                                }
                                function e(a, b) {
                                    var c = [],
                                        d = [],
                                        e = jb();
                                    return f((a.attr("class") || "").split(/\s+/),
                                        function(a) {
                                            e[a] = !0
                                        }),
                                        f(b,
                                            function(a, b) {
                                                var f = e[b];
                                                a === !1 && f ? d.push(b) : a !== !0 || f || c.push(b)
                                            }),
                                    c.length + d.length > 0 && [c.length ? c: null, d.length ? d: null]
                                }
                                function g(a, b, c) {
                                    for (var d = 0,
                                             e = b.length; e > d; ++d) {
                                        var f = b[d];
                                        a[f] = c
                                    }
                                }
                                function h() {
                                    return j || (j = a.defer(), b(function() {
                                        j.resolve(),
                                            j = null
                                    })),
                                        j.promise
                                }
                                function i(a, b) {
                                    if (ge.isObject(b)) {
                                        var c = l(b.from || {},
                                            b.to || {});
                                        a.css(c)
                                    }
                                }
                                var j;
                                return {
                                    animate: function(a, b, c) {
                                        return i(a, {
                                            from: b,
                                            to: c
                                        }),
                                            h()
                                    },
                                    enter: function(a, b, c, d) {
                                        return i(a, d),
                                            c ? c.after(a) : b.prepend(a),
                                            h()
                                    },
                                    leave: function(a) {
                                        return a.remove(),
                                            h()
                                    },
                                    move: function(a, b, c, d) {
                                        return this.enter(a, b, c, d)
                                    },
                                    addClass: function(a, b, c) {
                                        return this.setClass(a, b, [], c)
                                    },
                                    $$addClassImmediately: function(a, b, c) {
                                        return a = $d(a),
                                            b = u(b) ? b: je(b) ? b.join(" ") : "",
                                            f(a,
                                                function(a) {
                                                    Db(a, b)
                                                }),
                                            i(a, c),
                                            h()
                                    },
                                    removeClass: function(a, b, c) {
                                        return this.setClass(a, [], b, c)
                                    },
                                    $$removeClassImmediately: function(a, b, c) {
                                        return a = $d(a),
                                            b = u(b) ? b: je(b) ? b.join(" ") : "",
                                            f(a,
                                                function(a) {
                                                    Cb(a, b)
                                                }),
                                            i(a, c),
                                            h()
                                    },
                                    setClass: function(a, b, c, f) {
                                        var h = this,
                                            i = "$$animateClasses",
                                            j = !1;
                                        a = $d(a);
                                        var k = a.data(i);
                                        k ? f && k.options && (k.options = ge.extend(k.options || {},
                                            f)) : (k = {
                                            classes: {},
                                            options: f
                                        },
                                            j = !0);
                                        var l = k.classes;
                                        return b = je(b) ? b: b.split(" "),
                                            c = je(c) ? c: c.split(" "),
                                            g(l, b, !0),
                                            g(l, c, !1),
                                        j && (k.promise = d(function(b) {
                                            var c = a.data(i);
                                            if (a.removeData(i), c) {
                                                var d = e(a, c.classes);
                                                d && h.$$setClassImmediately(a, d[0], d[1], c.options)
                                            }
                                            b()
                                        }), a.data(i, k)),
                                            k.promise
                                    },
                                    $$setClassImmediately: function(a, b, c, d) {
                                        return b && this.$$addClassImmediately(a, b),
                                        c && this.$$removeClassImmediately(a, c),
                                            i(a, d),
                                            h()
                                    },
                                    enabled: o,
                                    cancel: o
                                }
                            }]
                }],
            Ue = d("$compile");
        Zb.$inject = ["$provide", "$$sanitizeUriProvider"];
        var Ve = /^((?:x|data)[\:\-_])/i,
            We = d("$controller"),
            Xe = "application/json",
            Ye = {
                "Content-Type": Xe + ";charset=utf-8"
            },
            Ze = /^\[|^\{(?!\{)/,
            $e = {
                "[": /]$/,
                "{": /}$/
            },
            _e = /^\)\]\}',?\n/,
            af = d("$interpolate"),
            bf = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
            cf = {
                http: 80,
                https: 443,
                ftp: 21
            },
            df = d("$location"),
            ef = {
                $$html5: !1,
                $$replace: !1,
                absUrl: Cc("$$absUrl"),
                url: function(a) {
                    if (r(a)) return this.$$url;
                    var b = bf.exec(a);
                    return (b[1] || "" === a) && this.path(decodeURIComponent(b[1])),
                    (b[2] || b[1] || "" === a) && this.search(b[3] || ""),
                        this.hash(b[5] || ""),
                        this
                },
                protocol: Cc("$$protocol"),
                host: Cc("$$host"),
                port: Cc("$$port"),
                path: Dc("$$path",
                    function(a) {
                        return a = null !== a ? a.toString() : "",
                            "/" == a.charAt(0) ? a: "/" + a
                    }),
                search: function(a, b) {
                    switch (arguments.length) {
                        case 0:
                            return this.$$search;
                        case 1:
                            if (u(a) || v(a)) a = a.toString(),
                                this.$$search = V(a);
                            else {
                                if (!t(a)) throw df("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                                a = K(a, {}),
                                    f(a,
                                        function(b, c) {
                                            null == b && delete a[c]
                                        }),
                                    this.$$search = a
                            }
                            break;
                        default:
                            r(b) || null === b ? delete this.$$search[a] : this.$$search[a] = b
                    }
                    return this.$$compose(),
                        this
                },
                hash: Dc("$$hash",
                    function(a) {
                        return null !== a ? a.toString() : ""
                    }),
                replace: function() {
                    return this.$$replace = !0,
                        this
                }
            };
        f([Bc, Ac, zc],
            function(a) {
                a.prototype = Object.create(ef),
                    a.prototype.state = function(b) {
                        if (!arguments.length) return this.$$state;
                        if (a !== zc || !this.$$html5) throw df("nostate", "History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");
                        return this.$$state = r(b) ? null: b,
                            this
                    }
            });
        var ff = d("$parse"),
            gf = Function.prototype.call,
            hf = Function.prototype.apply,
            jf = Function.prototype.bind,
            kf = jb();
        f({
                "null": function() {
                    return null
                },
                "true": function() {
                    return ! 0
                },
                "false": function() {
                    return ! 1
                },
                undefined: function() {}
            },
            function(a, b) {
                a.constant = a.literal = a.sharedGetter = !0,
                    kf[b] = a
            }),
            kf["this"] = function(a) {
                return a
            },
            kf["this"].sharedGetter = !0;
        var lf = l(jb(), {
                "+": function(a, b, d, e) {
                    return d = d(a, b),
                        e = e(a, b),
                        s(d) ? s(e) ? d + e: d: s(e) ? e: c
                },
                "-": function(a, b, c, d) {
                    return c = c(a, b),
                        d = d(a, b),
                    (s(c) ? c: 0) - (s(d) ? d: 0)
                },
                "*": function(a, b, c, d) {
                    return c(a, b) * d(a, b)
                },
                "/": function(a, b, c, d) {
                    return c(a, b) / d(a, b)
                },
                "%": function(a, b, c, d) {
                    return c(a, b) % d(a, b)
                },
                "===": function(a, b, c, d) {
                    return c(a, b) === d(a, b)
                },
                "!==": function(a, b, c, d) {
                    return c(a, b) !== d(a, b)
                },
                "==": function(a, b, c, d) {
                    return c(a, b) == d(a, b)
                },
                "!=": function(a, b, c, d) {
                    return c(a, b) != d(a, b)
                },
                "<": function(a, b, c, d) {
                    return c(a, b) < d(a, b)
                },
                ">": function(a, b, c, d) {
                    return c(a, b) > d(a, b)
                },
                "<=": function(a, b, c, d) {
                    return c(a, b) <= d(a, b)
                },
                ">=": function(a, b, c, d) {
                    return c(a, b) >= d(a, b)
                },
                "&&": function(a, b, c, d) {
                    return c(a, b) && d(a, b)
                },
                "||": function(a, b, c, d) {
                    return c(a, b) || d(a, b)
                },
                "!": function(a, b, c) {
                    return ! c(a, b)
                },
                "=": !0,
                "|": !0
            }),
            mf = {
                n: "\n",
                f: "\f",
                r: "\r",
                t: "	",
                v: "",
                "'": "'",
                '"': '"'
            },
            nf = function(a) {
                this.options = a
            };
        nf.prototype = {
            constructor: nf,
            lex: function(a) {
                for (this.text = a, this.index = 0, this.tokens = []; this.index < this.text.length;) {
                    var b = this.text.charAt(this.index);
                    if ('"' === b || "'" === b) this.readString(b);
                    else if (this.isNumber(b) || "." === b && this.isNumber(this.peek())) this.readNumber();
                    else if (this.isIdent(b)) this.readIdent();
                    else if (this.is(b, "(){}[].,;:?")) this.tokens.push({
                        index: this.index,
                        text: b
                    }),
                        this.index++;
                    else if (this.isWhitespace(b)) this.index++;
                    else {
                        var c = b + this.peek(),
                            d = c + this.peek(2),
                            e = lf[b],
                            f = lf[c],
                            g = lf[d];
                        if (e || f || g) {
                            var h = g ? d: f ? c: b;
                            this.tokens.push({
                                index: this.index,
                                text: h,
                                operator: !0
                            }),
                                this.index += h.length
                        } else this.throwError("Unexpected next character ", this.index, this.index + 1)
                    }
                }
                return this.tokens
            },
            is: function(a, b) {
                return - 1 !== b.indexOf(a)
            },
            peek: function(a) {
                var b = a || 1;
                return this.index + b < this.text.length ? this.text.charAt(this.index + b) : !1
            },
            isNumber: function(a) {
                return a >= "0" && "9" >= a && "string" == typeof a
            },
            isWhitespace: function(a) {
                return " " === a || "\r" === a || "	" === a || "\n" === a || "" === a || "聽" === a
            },
            isIdent: function(a) {
                return a >= "a" && "z" >= a || a >= "A" && "Z" >= a || "_" === a || "$" === a
            },
            isExpOperator: function(a) {
                return "-" === a || "+" === a || this.isNumber(a)
            },
            throwError: function(a, b, c) {
                c = c || this.index;
                var d = s(b) ? "s " + b + "-" + this.index + " [" + this.text.substring(b, c) + "]": " " + c;
                throw ff("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", a, d, this.text)
            },
            readNumber: function() {
                for (var a = "",
                         b = this.index; this.index < this.text.length;) {
                    var c = Ud(this.text.charAt(this.index));
                    if ("." == c || this.isNumber(c)) a += c;
                    else {
                        var d = this.peek();
                        if ("e" == c && this.isExpOperator(d)) a += c;
                        else if (this.isExpOperator(c) && d && this.isNumber(d) && "e" == a.charAt(a.length - 1)) a += c;
                        else {
                            if (!this.isExpOperator(c) || d && this.isNumber(d) || "e" != a.charAt(a.length - 1)) break;
                            this.throwError("Invalid exponent")
                        }
                    }
                    this.index++
                }
                this.tokens.push({
                    index: b,
                    text: a,
                    constant: !0,
                    value: Number(a)
                })
            },
            readIdent: function() {
                for (var a = this.index; this.index < this.text.length;) {
                    var b = this.text.charAt(this.index);
                    if (!this.isIdent(b) && !this.isNumber(b)) break;
                    this.index++
                }
                this.tokens.push({
                    index: a,
                    text: this.text.slice(a, this.index),
                    identifier: !0
                })
            },
            readString: function(a) {
                var b = this.index;
                this.index++;
                for (var c = "",
                         d = a,
                         e = !1; this.index < this.text.length;) {
                    var f = this.text.charAt(this.index);
                    if (d += f, e) {
                        if ("u" === f) {
                            var g = this.text.substring(this.index + 1, this.index + 5);
                            g.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + g + "]"),
                                this.index += 4,
                                c += String.fromCharCode(parseInt(g, 16))
                        } else {
                            var h = mf[f];
                            c += h || f
                        }
                        e = !1
                    } else if ("\\" === f) e = !0;
                    else {
                        if (f === a) return this.index++,
                            void this.tokens.push({
                                index: b,
                                text: d,
                                constant: !0,
                                value: c
                            });
                        c += f
                    }
                    this.index++
                }
                this.throwError("Unterminated quote", b)
            }
        };
        var of = function(a, b, c) {
            this.lexer = a,
                this.$filter = b,
                this.options = c
        };
        of.ZERO = l(function() {
                return 0
            },
            {
                sharedGetter: !0,
                constant: !0
            }),
            of.prototype = {
                constructor: of,
                parse: function(a) {
                    this.text = a,
                        this.tokens = this.lexer.lex(a);
                    var b = this.statements();
                    return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]),
                        b.literal = !!b.literal,
                        b.constant = !!b.constant,
                        b
                },
                primary: function() {
                    var a;
                    this.expect("(") ? (a = this.filterChain(), this.consume(")")) : this.expect("[") ? a = this.arrayDeclaration() : this.expect("{") ? a = this.object() : this.peek().identifier && this.peek().text in kf ? a = kf[this.consume().text] : this.peek().identifier ? a = this.identifier() : this.peek().constant ? a = this.constant() : this.throwError("not a primary expression", this.peek());
                    for (var b, c; b = this.expect("(", "[", ".");)"(" === b.text ? (a = this.functionCall(a, c), c = null) : "[" === b.text ? (c = a, a = this.objectIndex(a)) : "." === b.text ? (c = a, a = this.fieldAccess(a)) : this.throwError("IMPOSSIBLE");
                    return a
                },
                throwError: function(a, b) {
                    throw ff("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", b.text, a, b.index + 1, this.text, this.text.substring(b.index))
                },
                peekToken: function() {
                    if (0 === this.tokens.length) throw ff("ueoe", "Unexpected end of expression: {0}", this.text);
                    return this.tokens[0]
                },
                peek: function(a, b, c, d) {
                    return this.peekAhead(0, a, b, c, d)
                },
                peekAhead: function(a, b, c, d, e) {
                    if (this.tokens.length > a) {
                        var f = this.tokens[a],
                            g = f.text;
                        if (g === b || g === c || g === d || g === e || !b && !c && !d && !e) return f
                    }
                    return ! 1
                },
                expect: function(a, b, c, d) {
                    var e = this.peek(a, b, c, d);
                    return e ? (this.tokens.shift(), e) : !1
                },
                consume: function(a) {
                    if (0 === this.tokens.length) throw ff("ueoe", "Unexpected end of expression: {0}", this.text);
                    var b = this.expect(a);
                    return b || this.throwError("is unexpected, expecting [" + a + "]", this.peek()),
                        b
                },
                unaryFn: function(a, b) {
                    var c = lf[a];
                    return l(function(a, d) {
                            return c(a, d, b)
                        },
                        {
                            constant: b.constant,
                            inputs: [b]
                        })
                },
                binaryFn: function(a, b, c, d) {
                    var e = lf[b];
                    return l(function(b, d) {
                            return e(b, d, a, c)
                        },
                        {
                            constant: a.constant && c.constant,
                            inputs: !d && [a, c]
                        })
                },
                identifier: function() {
                    for (var a = this.consume().text; this.peek(".") && this.peekAhead(1).identifier && !this.peekAhead(2, "(");) a += this.consume().text + this.consume().text;
                    return Oc(a, this.options, this.text)
                },
                constant: function() {
                    var a = this.consume().value;
                    return l(function() {
                            return a
                        },
                        {
                            constant: !0,
                            literal: !0
                        })
                },
                statements: function() {
                    for (var a = [];;) if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && a.push(this.filterChain()), !this.expect(";")) return 1 === a.length ? a[0] : function(b, c) {
                        for (var d, e = 0,
                                 f = a.length; f > e; e++) d = a[e](b, c);
                        return d
                    }
                },
                filterChain: function() {
                    for (var a, b = this.expression(); a = this.expect("|");) b = this.filter(b);
                    return b
                },
                filter: function(a) {
                    var b, d, e = this.$filter(this.consume().text);
                    if (this.peek(":")) for (b = [], d = []; this.expect(":");) b.push(this.expression());
                    var f = [a].concat(b || []);
                    return l(function(f, g) {
                            var h = a(f, g);
                            if (d) {
                                d[0] = h;
                                for (var i = b.length; i--;) d[i + 1] = b[i](f, g);
                                return e.apply(c, d)
                            }
                            return e(h)
                        },
                        {
                            constant: !e.$stateful && f.every(Jc),
                            inputs: !e.$stateful && f
                        })
                },
                expression: function() {
                    return this.assignment()
                },
                assignment: function() {
                    var a, b, c = this.ternary();
                    return (b = this.expect("=")) ? (c.assign || this.throwError("implies assignment but [" + this.text.substring(0, b.index) + "] can not be assigned to", b), a = this.ternary(), l(function(b, d) {
                            return c.assign(b, a(b, d), d)
                        },
                        {
                            inputs: [c, a]
                        })) : c
                },
                ternary: function() {
                    var a, b, c = this.logicalOR();
                    if ((b = this.expect("?")) && (a = this.assignment(), this.consume(":"))) {
                        var d = this.assignment();
                        return l(function(b, e) {
                                return c(b, e) ? a(b, e) : d(b, e)
                            },
                            {
                                constant: c.constant && a.constant && d.constant
                            })
                    }
                    return c
                },
                logicalOR: function() {
                    for (var a, b = this.logicalAND(); a = this.expect("||");) b = this.binaryFn(b, a.text, this.logicalAND(), !0);
                    return b
                },
                logicalAND: function() {
                    for (var a, b = this.equality(); a = this.expect("&&");) b = this.binaryFn(b, a.text, this.equality(), !0);
                    return b
                },
                equality: function() {
                    for (var a, b = this.relational(); a = this.expect("==", "!=", "===", "!==");) b = this.binaryFn(b, a.text, this.relational());
                    return b
                },
                relational: function() {
                    for (var a, b = this.additive(); a = this.expect("<", ">", "<=", ">=");) b = this.binaryFn(b, a.text, this.additive());
                    return b
                },
                additive: function() {
                    for (var a, b = this.multiplicative(); a = this.expect("+", "-");) b = this.binaryFn(b, a.text, this.multiplicative());
                    return b
                },
                multiplicative: function() {
                    for (var a, b = this.unary(); a = this.expect("*", "/", "%");) b = this.binaryFn(b, a.text, this.unary());
                    return b
                },
                unary: function() {
                    var a;
                    return this.expect("+") ? this.primary() : (a = this.expect("-")) ? this.binaryFn(of.ZERO, a.text, this.unary()) : (a = this.expect("!")) ? this.unaryFn(a.text, this.unary()) : this.primary()
                },
                fieldAccess: function(a) {
                    var b = this.identifier();
                    return l(function(d, e, f) {
                            var g = f || a(d, e);
                            return null == g ? c: b(g)
                        },
                        {
                            assign: function(c, d, e) {
                                var f = a(c, e);
                                return f || a.assign(c, f = {},
                                    e),
                                    b.assign(f, d)
                            }
                        })
                },
                objectIndex: function(a) {
                    var b = this.text,
                        d = this.expression();
                    return this.consume("]"),
                        l(function(e, f) {
                                var g, h = a(e, f),
                                    i = d(e, f);
                                return Gc(i, b),
                                    h ? g = Hc(h[i], b) : c
                            },
                            {
                                assign: function(c, e, f) {
                                    var g = Gc(d(c, f), b),
                                        h = Hc(a(c, f), b);
                                    return h || a.assign(c, h = {},
                                        f),
                                        h[g] = e
                                }
                            })
                },
                functionCall: function(a, b) {
                    var d = [];
                    if (")" !== this.peekToken().text) do d.push(this.expression());
                    while (this.expect(","));
                    this.consume(")");
                    var e = this.text,
                        f = d.length ? [] : null;
                    return function(g, h) {
                        var i = b ? b(g, h) : s(b) ? c: g,
                            j = a(g, h, i) || o;
                        if (f) for (var k = d.length; k--;) f[k] = Hc(d[k](g, h), e);
                        Hc(i, e),
                            Ic(j, e);
                        var l = j.apply ? j.apply(i, f) : j(f[0], f[1], f[2], f[3], f[4]);
                        return f && (f.length = 0),
                            Hc(l, e)
                    }
                },
                arrayDeclaration: function() {
                    var a = [];
                    if ("]" !== this.peekToken().text) do {
                        if (this.peek("]")) break;
                        a.push(this.expression())
                    } while ( this . expect (","));
                    return this.consume("]"),
                        l(function(b, c) {
                                for (var d = [], e = 0, f = a.length; f > e; e++) d.push(a[e](b, c));
                                return d
                            },
                            {
                                literal: !0,
                                constant: a.every(Jc),
                                inputs: a
                            })
                },
                object: function() {
                    var a = [],
                        b = [];
                    if ("}" !== this.peekToken().text) do {
                        if (this.peek("}")) break;
                        var c = this.consume();
                        c.constant ? a.push(c.value) : c.identifier ? a.push(c.text) : this.throwError("invalid key", c), this.consume(":"), b.push(this.expression())
                    } while ( this . expect (","));
                    return this.consume("}"),
                        l(function(c, d) {
                                for (var e = {},
                                         f = 0,
                                         g = b.length; g > f; f++) e[a[f]] = b[f](c, d);
                                return e
                            },
                            {
                                literal: !0,
                                constant: b.every(Jc),
                                inputs: b
                            })
                }
            };
        var pf = jb(),
            qf = jb(),
            rf = Object.prototype.valueOf,
            sf = d("$sce"),
            tf = {
                HTML: "html",
                CSS: "css",
                URL: "url",
                RESOURCE_URL: "resourceUrl",
                JS: "js"
            },
            Ue = d("$compile"),
            uf = b.createElement("a"),
            vf = dd(a.location.href);
        gd.$inject = ["$provide"],
            kd.$inject = ["$locale"],
            ld.$inject = ["$locale"];
        var wf = ".",
            xf = {
                yyyy: od("FullYear", 4),
                yy: od("FullYear", 2, 0, !0),
                y: od("FullYear", 1),
                MMMM: pd("Month"),
                MMM: pd("Month", !0),
                MM: od("Month", 2, 1),
                M: od("Month", 1, 1),
                dd: od("Date", 2),
                d: od("Date", 1),
                HH: od("Hours", 2),
                H: od("Hours", 1),
                hh: od("Hours", 2, -12),
                h: od("Hours", 1, -12),
                mm: od("Minutes", 2),
                m: od("Minutes", 1),
                ss: od("Seconds", 2),
                s: od("Seconds", 1),
                sss: od("Milliseconds", 3),
                EEEE: pd("Day"),
                EEE: pd("Day", !0),
                a: ud,
                Z: qd,
                ww: td(2),
                w: td(1)
            },
            yf = /((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,
            zf = /^\-?\d+$/;
        vd.$inject = ["$locale"];
        var Af = q(Ud),
            Bf = q(Wd);
        yd.$inject = ["$parse"];
        var Cf = q({
                restrict: "E",
                compile: function(a, b) {
                    return b.href || b.xlinkHref || b.name ? void 0 : function(a, b) {
                        if ("a" === b[0].nodeName.toLowerCase()) {
                            var c = "[object SVGAnimatedString]" === ee.call(b.prop("href")) ? "xlink:href": "href";
                            b.on("click",
                                function(a) {
                                    b.attr(c) || a.preventDefault()
                                })
                        }
                    }
                }
            }),
            Df = {};
        f(Ke,
            function(a, b) {
                if ("multiple" != a) {
                    var c = $b("ng-" + b);
                    Df[c] = function() {
                        return {
                            restrict: "A",
                            priority: 100,
                            link: function(a, d, e) {
                                a.$watch(e[c],
                                    function(a) {
                                        e.$set(b, !!a)
                                    })
                            }
                        }
                    }
                }
            }),
            f(Me,
                function(a, b) {
                    Df[b] = function() {
                        return {
                            priority: 100,
                            link: function(a, c, d) {
                                if ("ngPattern" === b && "/" == d.ngPattern.charAt(0)) {
                                    var e = d.ngPattern.match(Sd);
                                    if (e) return void d.$set("ngPattern", new RegExp(e[1], e[2]))
                                }
                                a.$watch(d[b],
                                    function(a) {
                                        d.$set(b, a)
                                    })
                            }
                        }
                    }
                }),
            f(["src", "srcset", "href"],
                function(a) {
                    var b = $b("ng-" + a);
                    Df[b] = function() {
                        return {
                            priority: 99,
                            link: function(c, d, e) {
                                var f = a,
                                    g = a;
                                "href" === a && "[object SVGAnimatedString]" === ee.call(d.prop("href")) && (g = "xlinkHref", e.$attr[g] = "xlink:href", f = null),
                                    e.$observe(b,
                                        function(b) {
                                            return b ? (e.$set(g, b), void(Zd && f && d.prop(f, e[g]))) : void("href" === a && e.$set(g, null))
                                        })
                            }
                        }
                    }
                });
        var Ef = {
                $addControl: o,
                $$renameControl: Ad,
                $removeControl: o,
                $setValidity: o,
                $setDirty: o,
                $setPristine: o,
                $setSubmitted: o
            },
            Ff = "ng-submitted";
        Bd.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
        var Gf = function(a) {
                return ["$timeout",
                    function(b) {
                        var d = {
                            name: "form",
                            restrict: a ? "EAC": "E",
                            controller: Bd,
                            compile: function(a) {
                                return a.addClass(mg).addClass(kg),
                                {
                                    pre: function(a, d, e, f) {
                                        if (! ("action" in e)) {
                                            var g = function(b) {
                                                a.$apply(function() {
                                                    f.$commitViewValue(),
                                                        f.$setSubmitted()
                                                }),
                                                    b.preventDefault()
                                            };
                                            ye(d[0], "submit", g),
                                                d.on("$destroy",
                                                    function() {
                                                        b(function() {
                                                                ze(d[0], "submit", g)
                                                            },
                                                            0, !1)
                                                    })
                                        }
                                        var h = f.$$parentForm,
                                            i = f.$name;
                                        i && (Kc(a, null, i, f, i), e.$observe(e.name ? "name": "ngForm",
                                            function(b) {
                                                i !== b && (Kc(a, null, i, c, i), i = b, Kc(a, null, i, f, i), h.$$renameControl(f, i))
                                            })),
                                            d.on("$destroy",
                                                function() {
                                                    h.$removeControl(f),
                                                    i && Kc(a, null, i, c, i),
                                                        l(f, Ef)
                                                })
                                    }
                                }
                            }
                        };
                        return d
                    }]
            },
            Hf = Gf(),
            If = Gf(!0),
            Jf = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
            Kf = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
            Lf = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
            Mf = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
            Nf = /^(\d{4})-(\d{2})-(\d{2})$/,
            Of = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
            Pf = /^(\d{4})-W(\d\d)$/,
            Qf = /^(\d{4})-(\d\d)$/,
            Rf = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
            Sf = {
                text: Dd,
                date: Hd("date", Nf, Gd(Nf, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
                "datetime-local": Hd("datetimelocal", Of, Gd(Of, ["yyyy", "MM", "dd", "HH", "mm", "ss", "sss"]), "yyyy-MM-ddTHH:mm:ss.sss"),
                time: Hd("time", Rf, Gd(Rf, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
                week: Hd("week", Pf, Fd, "yyyy-Www"),
                month: Hd("month", Qf, Gd(Qf, ["yyyy", "MM"]), "yyyy-MM"),
                number: Jd,
                url: Kd,
                email: Ld,
                radio: Md,
                checkbox: Od,
                hidden: o,
                button: o,
                submit: o,
                reset: o,
                file: o
            },
            Tf = ["$browser", "$sniffer", "$filter", "$parse",
                function(a, b, c, d) {
                    return {
                        restrict: "E",
                        require: ["?ngModel"],
                        link: {
                            pre: function(e, f, g, h) {
                                h[0] && (Sf[Ud(g.type)] || Sf.text)(e, f, g, h[0], b, a, c, d)
                            }
                        }
                    }
                }],
            Uf = /^(true|false|\d+)$/,
            Vf = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    compile: function(a, b) {
                        return Uf.test(b.ngValue) ?
                            function(a, b, c) {
                                c.$set("value", a.$eval(c.ngValue))
                            }: function(a, b, c) {
                            a.$watch(c.ngValue,
                                function(a) {
                                    c.$set("value", a)
                                })
                        }
                    }
                }
            },
            Wf = ["$compile",
                function(a) {
                    return {
                        restrict: "AC",
                        compile: function(b) {
                            return a.$$addBindingClass(b),
                                function(b, d, e) {
                                    a.$$addBindingInfo(d, e.ngBind),
                                        d = d[0],
                                        b.$watch(e.ngBind,
                                            function(a) {
                                                d.textContent = a === c ? "": a
                                            })
                                }
                        }
                    }
                }],
            Xf = ["$interpolate", "$compile",
                function(a, b) {
                    return {
                        compile: function(d) {
                            return b.$$addBindingClass(d),
                                function(d, e, f) {
                                    var g = a(e.attr(f.$attr.ngBindTemplate));
                                    b.$$addBindingInfo(e, g.expressions),
                                        e = e[0],
                                        f.$observe("ngBindTemplate",
                                            function(a) {
                                                e.textContent = a === c ? "": a
                                            })
                                }
                        }
                    }
                }],
            Yf = ["$sce", "$parse", "$compile",
                function(a, b, c) {
                    return {
                        restrict: "A",
                        compile: function(d, e) {
                            var f = b(e.ngBindHtml),
                                g = b(e.ngBindHtml,
                                    function(a) {
                                        return (a || "").toString()
                                    });
                            return c.$$addBindingClass(d),
                                function(b, d, e) {
                                    c.$$addBindingInfo(d, e.ngBindHtml),
                                        b.$watch(g,
                                            function() {
                                                d.html(a.getTrustedHtml(f(b)) || "")
                                            })
                                }
                        }
                    }
                }],
            Zf = q({
                restrict: "A",
                require: "ngModel",
                link: function(a, b, c, d) {
                    d.$viewChangeListeners.push(function() {
                        a.$eval(c.ngChange)
                    })
                }
            }),
            $f = Pd("", !0),
            _f = Pd("Odd", 0),
            ag = Pd("Even", 1),
            bg = zd({
                compile: function(a, b) {
                    b.$set("ngCloak", c),
                        a.removeClass("ng-cloak")
                }
            }),
            cg = [function() {
                return {
                    restrict: "A",
                    scope: !0,
                    controller: "@",
                    priority: 500
                }
            }],
            dg = {},
            eg = {
                blur: !0,
                focus: !0
            };
        f("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),
            function(a) {
                var b = $b("ng-" + a);
                dg[b] = ["$parse", "$rootScope",
                    function(c, d) {
                        return {
                            restrict: "A",
                            compile: function(e, f) {
                                var g = c(f[b], null, !0);
                                return function(b, c) {
                                    c.on(a,
                                        function(c) {
                                            var e = function() {
                                                g(b, {
                                                    $event: c
                                                })
                                            };
                                            eg[a] && d.$$phase ? b.$evalAsync(e) : b.$apply(e)
                                        })
                                }
                            }
                        }
                    }]
            });
        var fg = ["$animate",
                function(a) {
                    return {
                        multiElement: !0,
                        transclude: "element",
                        priority: 600,
                        terminal: !0,
                        restrict: "A",
                        $$tlb: !0,
                        link: function(c, d, e, f, g) {
                            var h, i, j;
                            c.$watch(e.ngIf,
                                function(c) {
                                    c ? i || g(function(c, f) {
                                        i = f,
                                            c[c.length++] = b.createComment(" end ngIf: " + e.ngIf + " "),
                                            h = {
                                                clone: c
                                            },
                                            a.enter(c, d.parent(), d)
                                    }) : (j && (j.remove(), j = null), i && (i.$destroy(), i = null), h && (j = ib(h.clone), a.leave(j).then(function() {
                                        j = null
                                    }), h = null))
                                })
                        }
                    }
                }],
            gg = ["$templateRequest", "$anchorScroll", "$animate", "$sce",
                function(a, b, c, d) {
                    return {
                        restrict: "ECA",
                        priority: 400,
                        terminal: !0,
                        transclude: "element",
                        controller: ge.noop,
                        compile: function(e, f) {
                            var g = f.ngInclude || f.src,
                                h = f.onload || "",
                                i = f.autoscroll;
                            return function(e, f, j, k, l) {
                                var m, n, o, p = 0,
                                    q = function() {
                                        n && (n.remove(), n = null),
                                        m && (m.$destroy(), m = null),
                                        o && (c.leave(o).then(function() {
                                            n = null
                                        }), n = o, o = null)
                                    };
                                e.$watch(d.parseAsResourceUrl(g),
                                    function(d) {
                                        var g = function() { ! s(i) || i && !e.$eval(i) || b()
                                            },
                                            j = ++p;
                                        d ? (a(d, !0).then(function(a) {
                                                if (j === p) {
                                                    var b = e.$new();
                                                    k.template = a;
                                                    var i = l(b,
                                                        function(a) {
                                                            q(),
                                                                c.enter(a, null, f).then(g)
                                                        });
                                                    m = b,
                                                        o = i,
                                                        m.$emit("$includeContentLoaded", d),
                                                        e.$eval(h)
                                                }
                                            },
                                            function() {
                                                j === p && (q(), e.$emit("$includeContentError", d))
                                            }), e.$emit("$includeContentRequested", d)) : (q(), k.template = null)
                                    })
                            }
                        }
                    }
                }],
            hg = ["$compile",
                function(a) {
                    return {
                        restrict: "ECA",
                        priority: -400,
                        require: "ngInclude",
                        link: function(c, d, e, f) {
                            return /SVG/.test(d[0].toString()) ? (d.empty(), void a(sb(f.template, b).childNodes)(c,
                                function(a) {
                                    d.append(a)
                                },
                                {
                                    futureParentElement: d
                                })) : (d.html(f.template), void a(d.contents())(c))
                        }
                    }
                }],
            ig = zd({
                priority: 450,
                compile: function() {
                    return {
                        pre: function(a, b, c) {
                            a.$eval(c.ngInit)
                        }
                    }
                }
            }),
            jg = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    require: "ngModel",
                    link: function(a, b, d, e) {
                        var g = b.attr(d.$attr.ngList) || ", ",
                            h = "false" !== d.ngTrim,
                            i = h ? ke(g) : g,
                            j = function(a) {
                                if (!r(a)) {
                                    var b = [];
                                    return a && f(a.split(i),
                                        function(a) {
                                            a && b.push(h ? ke(a) : a)
                                        }),
                                        b
                                }
                            };
                        e.$parsers.push(j),
                            e.$formatters.push(function(a) {
                                return je(a) ? a.join(g) : c
                            }),
                            e.$isEmpty = function(a) {
                                return ! a || !a.length
                            }
                    }
                }
            },
            kg = "ng-valid",
            lg = "ng-invalid",
            mg = "ng-pristine",
            ng = "ng-dirty",
            og = "ng-untouched",
            pg = "ng-touched",
            qg = "ng-pending",
            rg = new d("ngModel"),
            sg = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate",
                function(a, b, d, e, g, h, i, j, k, l) {
                    this.$viewValue = Number.NaN,
                        this.$modelValue = Number.NaN,
                        this.$$rawModelValue = c,
                        this.$validators = {},
                        this.$asyncValidators = {},
                        this.$parsers = [],
                        this.$formatters = [],
                        this.$viewChangeListeners = [],
                        this.$untouched = !0,
                        this.$touched = !1,
                        this.$pristine = !0,
                        this.$dirty = !1,
                        this.$valid = !0,
                        this.$invalid = !1,
                        this.$error = {},
                        this.$$success = {},
                        this.$pending = c,
                        this.$name = l(d.name || "", !1)(a);
                    var m = g(d.ngModel),
                        n = m.assign,
                        p = m,
                        q = n,
                        t = null,
                        u = this;
                    this.$$setOptions = function(a) {
                        if (u.$options = a, a && a.getterSetter) {
                            var b = g(d.ngModel + "()"),
                                c = g(d.ngModel + "($$$p)");
                            p = function(a) {
                                var c = m(a);
                                return x(c) && (c = b(a)),
                                    c
                            },
                                q = function(a) {
                                    x(m(a)) ? c(a, {
                                        $$$p: u.$modelValue
                                    }) : n(a, u.$modelValue)
                                }
                        } else if (!m.assign) throw rg("nonassign", "Expression '{0}' is non-assignable. Element: {1}", d.ngModel, T(e))
                    },
                        this.$render = o,
                        this.$isEmpty = function(a) {
                            return r(a) || "" === a || null === a || a !== a
                        };
                    var w = e.inheritedData("$formController") || Ef,
                        y = 0;
                    Qd({
                        ctrl: this,
                        $element: e,
                        set: function(a, b) {
                            a[b] = !0
                        },
                        unset: function(a, b) {
                            delete a[b]
                        },
                        parentForm: w,
                        $animate: h
                    }),
                        this.$setPristine = function() {
                            u.$dirty = !1,
                                u.$pristine = !0,
                                h.removeClass(e, ng),
                                h.addClass(e, mg)
                        },
                        this.$setDirty = function() {
                            u.$dirty = !0,
                                u.$pristine = !1,
                                h.removeClass(e, mg),
                                h.addClass(e, ng),
                                w.$setDirty()
                        },
                        this.$setUntouched = function() {
                            u.$touched = !1,
                                u.$untouched = !0,
                                h.setClass(e, og, pg)
                        },
                        this.$setTouched = function() {
                            u.$touched = !0,
                                u.$untouched = !1,
                                h.setClass(e, pg, og)
                        },
                        this.$rollbackViewValue = function() {
                            i.cancel(t),
                                u.$viewValue = u.$$lastCommittedViewValue,
                                u.$render()
                        },
                        this.$validate = function() {
                            if (!v(u.$modelValue) || !isNaN(u.$modelValue)) {
                                var a = u.$$lastCommittedViewValue,
                                    b = u.$$rawModelValue,
                                    d = u.$$parserName || "parse",
                                    e = u.$error[d] ? !1 : c,
                                    f = u.$valid,
                                    g = u.$modelValue,
                                    h = u.$options && u.$options.allowInvalid;
                                u.$$runValidators(e, b, a,
                                    function(a) {
                                        h || f === a || (u.$modelValue = a ? b: c, u.$modelValue !== g && u.$$writeModelToScope())
                                    })
                            }
                        },
                        this.$$runValidators = function(a, b, d, e) {
                            function g(a) {
                                var b = u.$$parserName || "parse";
                                if (a === c) j(b, null);
                                else if (j(b, a), !a) return f(u.$validators,
                                    function(a, b) {
                                        j(b, null)
                                    }),
                                    f(u.$asyncValidators,
                                        function(a, b) {
                                            j(b, null)
                                        }),
                                    !1;
                                return ! 0
                            }
                            function h() {
                                var a = !0;
                                return f(u.$validators,
                                    function(c, e) {
                                        var f = c(b, d);
                                        a = a && f,
                                            j(e, f)
                                    }),
                                    a ? !0 : (f(u.$asyncValidators,
                                        function(a, b) {
                                            j(b, null)
                                        }), !1)
                            }
                            function i() {
                                var a = [],
                                    e = !0;
                                f(u.$asyncValidators,
                                    function(f, g) {
                                        var h = f(b, d);
                                        if (!F(h)) throw rg("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", h);
                                        j(g, c),
                                            a.push(h.then(function() {
                                                    j(g, !0)
                                                },
                                                function() {
                                                    e = !1,
                                                        j(g, !1)
                                                }))
                                    }),
                                    a.length ? k.all(a).then(function() {
                                            l(e)
                                        },
                                        o) : l(!0)
                            }
                            function j(a, b) {
                                m === y && u.$setValidity(a, b)
                            }
                            function l(a) {
                                m === y && e(a)
                            }
                            y++;
                            var m = y;
                            return g(a) && h() ? void i() : void l(!1)
                        },
                        this.$commitViewValue = function() {
                            var a = u.$viewValue;
                            i.cancel(t),
                            (u.$$lastCommittedViewValue !== a || "" === a && u.$$hasNativeValidators) && (u.$$lastCommittedViewValue = a, u.$pristine && this.$setDirty(), this.$$parseAndValidate())
                        },
                        this.$$parseAndValidate = function() {
                            function b() {
                                u.$modelValue !== h && u.$$writeModelToScope()
                            }
                            var d = u.$$lastCommittedViewValue,
                                e = d,
                                f = r(e) ? c: !0;
                            if (f) for (var g = 0; g < u.$parsers.length; g++) if (e = u.$parsers[g](e), r(e)) {
                                f = !1;
                                break
                            }
                            v(u.$modelValue) && isNaN(u.$modelValue) && (u.$modelValue = p(a));
                            var h = u.$modelValue,
                                i = u.$options && u.$options.allowInvalid;
                            u.$$rawModelValue = e,
                            i && (u.$modelValue = e, b()),
                                u.$$runValidators(f, e, u.$$lastCommittedViewValue,
                                    function(a) {
                                        i || (u.$modelValue = a ? e: c, b())
                                    })
                        },
                        this.$$writeModelToScope = function() {
                            q(a, u.$modelValue),
                                f(u.$viewChangeListeners,
                                    function(a) {
                                        try {
                                            a()
                                        } catch(c) {
                                            b(c)
                                        }
                                    })
                        },
                        this.$setViewValue = function(a, b) {
                            u.$viewValue = a,
                            (!u.$options || u.$options.updateOnDefault) && u.$$debounceViewValueCommit(b)
                        },
                        this.$$debounceViewValueCommit = function(b) {
                            var c, d = 0,
                                e = u.$options;
                            e && s(e.debounce) && (c = e.debounce, v(c) ? d = c: v(c[b]) ? d = c[b] : v(c["default"]) && (d = c["default"])),
                                i.cancel(t),
                                d ? t = i(function() {
                                        u.$commitViewValue()
                                    },
                                    d) : j.$$phase ? u.$commitViewValue() : a.$apply(function() {
                                    u.$commitViewValue()
                                })
                        },
                        a.$watch(function() {
                            var b = p(a);
                            if (b !== u.$modelValue) {
                                u.$modelValue = u.$$rawModelValue = b;
                                for (var d = u.$formatters,
                                         e = d.length,
                                         f = b; e--;) f = d[e](f);
                                u.$viewValue !== f && (u.$viewValue = u.$$lastCommittedViewValue = f, u.$render(), u.$$runValidators(c, b, f, o))
                            }
                            return b
                        })
                }],
            tg = ["$rootScope",
                function(a) {
                    return {
                        restrict: "A",
                        require: ["ngModel", "^?form", "^?ngModelOptions"],
                        controller: sg,
                        priority: 1,
                        compile: function(b) {
                            return b.addClass(mg).addClass(og).addClass(kg),
                            {
                                pre: function(a, b, c, d) {
                                    var e = d[0],
                                        f = d[1] || Ef;
                                    e.$$setOptions(d[2] && d[2].$options),
                                        f.$addControl(e),
                                        c.$observe("name",
                                            function(a) {
                                                e.$name !== a && f.$$renameControl(e, a)
                                            }),
                                        a.$on("$destroy",
                                            function() {
                                                f.$removeControl(e)
                                            })
                                },
                                post: function(b, c, d, e) {
                                    var f = e[0];
                                    f.$options && f.$options.updateOn && c.on(f.$options.updateOn,
                                        function(a) {
                                            f.$$debounceViewValueCommit(a && a.type)
                                        }),
                                        c.on("blur",
                                            function() {
                                                f.$touched || (a.$$phase ? b.$evalAsync(f.$setTouched) : b.$apply(f.$setTouched))
                                            })
                                }
                            }
                        }
                    }
                }],
            ug = /(\s+|^)default(\s+|$)/,
            vg = function() {
                return {
                    restrict: "A",
                    controller: ["$scope", "$attrs",
                        function(a, b) {
                            var d = this;
                            this.$options = a.$eval(b.ngModelOptions),
                                this.$options.updateOn !== c ? (this.$options.updateOnDefault = !1, this.$options.updateOn = ke(this.$options.updateOn.replace(ug,
                                    function() {
                                        return d.$options.updateOnDefault = !0,
                                            " "
                                    }))) : this.$options.updateOnDefault = !0
                        }]
                }
            },
            wg = zd({
                terminal: !0,
                priority: 1e3
            }),
            xg = ["$locale", "$interpolate",
                function(a, b) {
                    var c = /{}/g,
                        d = /^when(Minus)?(.+)$/;
                    return {
                        restrict: "EA",
                        link: function(e, g, h) {
                            function i(a) {
                                g.text(a || "")
                            }
                            var j, k = h.count,
                                l = h.$attr.when && g.attr(h.$attr.when),
                                m = h.offset || 0,
                                n = e.$eval(l) || {},
                                o = {},
                                p = b.startSymbol(),
                                q = b.endSymbol(),
                                r = p + k + "-" + m + q,
                                s = ge.noop;
                            f(h,
                                function(a, b) {
                                    var c = d.exec(b);
                                    if (c) {
                                        var e = (c[1] ? "-": "") + Ud(c[2]);
                                        n[e] = g.attr(h.$attr[b])
                                    }
                                }),
                                f(n,
                                    function(a, d) {
                                        o[d] = b(a.replace(c, r))
                                    }),
                                e.$watch(k,
                                    function(b) {
                                        var c = parseFloat(b),
                                            d = isNaN(c);
                                        d || c in n || (c = a.pluralCat(c - m)),
                                        c === j || d && isNaN(j) || (s(), s = e.$watch(o[c], i), j = c)
                                    })
                        }
                    }
                }],
            yg = ["$parse", "$animate",
                function(a, g) {
                    var h = "$$NG_REMOVED",
                        i = d("ngRepeat"),
                        j = function(a, b, c, d, e, f, g) {
                            a[c] = d,
                            e && (a[e] = f),
                                a.$index = b,
                                a.$first = 0 === b,
                                a.$last = b === g - 1,
                                a.$middle = !(a.$first || a.$last),
                                a.$odd = !(a.$even = 0 === (1 & b))
                        },
                        k = function(a) {
                            return a.clone[0]
                        },
                        l = function(a) {
                            return a.clone[a.clone.length - 1]
                        };
                    return {
                        restrict: "A",
                        multiElement: !0,
                        transclude: "element",
                        priority: 1e3,
                        terminal: !0,
                        $$tlb: !0,
                        compile: function(d, m) {
                            var n = m.ngRepeat,
                                o = b.createComment(" end ngRepeat: " + n + " "),
                                p = n.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                            if (!p) throw i("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", n);
                            var q = p[1],
                                r = p[2],
                                s = p[3],
                                t = p[4];
                            if (p = q.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/), !p) throw i("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", q);
                            var u = p[3] || p[1],
                                v = p[2];
                            if (s && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(s) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(s))) throw i("badident", "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", s);
                            var w, x, y, z, A = {
                                $id: Ob
                            };
                            return t ? w = a(t) : (y = function(a, b) {
                                return Ob(b)
                            },
                                z = function(a) {
                                    return a
                                }),
                                function(a, b, d, m, p) {
                                    w && (x = function(b, c, d) {
                                        return v && (A[v] = b),
                                            A[u] = c,
                                            A.$index = d,
                                            w(a, A)
                                    });
                                    var q = jb();
                                    a.$watchCollection(r,
                                        function(d) {
                                            var m, r, t, w, A, B, C, D, E, F, G, H, I = b[0],
                                                J = jb();
                                            if (s && (a[s] = d), e(d)) E = d,
                                                D = x || y;
                                            else {
                                                D = x || z,
                                                    E = [];
                                                for (var K in d) d.hasOwnProperty(K) && "$" != K.charAt(0) && E.push(K);
                                                E.sort()
                                            }
                                            for (w = E.length, G = new Array(w), m = 0; w > m; m++) if (A = d === E ? m: E[m], B = d[A], C = D(A, B, m), q[C]) F = q[C],
                                                delete q[C],
                                                J[C] = F,
                                                G[m] = F;
                                            else {
                                                if (J[C]) throw f(G,
                                                    function(a) {
                                                        a && a.scope && (q[a.id] = a)
                                                    }),
                                                    i("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", n, C, B);
                                                G[m] = {
                                                    id: C,
                                                    scope: c,
                                                    clone: c
                                                },
                                                    J[C] = !0
                                            }
                                            for (var L in q) {
                                                if (F = q[L], H = ib(F.clone), g.leave(H), H[0].parentNode) for (m = 0, r = H.length; r > m; m++) H[m][h] = !0;
                                                F.scope.$destroy()
                                            }
                                            for (m = 0; w > m; m++) if (A = d === E ? m: E[m], B = d[A], F = G[m], F.scope) {
                                                t = I;
                                                do t = t.nextSibling;
                                                while (t && t[h]);
                                                k(F) != t && g.move(ib(F.clone), null, $d(I)),
                                                    I = l(F),
                                                    j(F.scope, m, u, B, v, A, w)
                                            } else p(function(a, b) {
                                                F.scope = b;
                                                var c = o.cloneNode(!1);
                                                a[a.length++] = c,
                                                    g.enter(a, null, $d(I)),
                                                    I = c,
                                                    F.clone = a,
                                                    J[F.id] = F,
                                                    j(F.scope, m, u, B, v, A, w)
                                            });
                                            q = J
                                        })
                                }
                        }
                    }
                }],
            zg = "ng-hide",
            Ag = "ng-hide-animate",
            Bg = ["$animate",
                function(a) {
                    return {
                        restrict: "A",
                        multiElement: !0,
                        link: function(b, c, d) {
                            b.$watch(d.ngShow,
                                function(b) {
                                    a[b ? "removeClass": "addClass"](c, zg, {
                                        tempClasses: Ag
                                    })
                                })
                        }
                    }
                }],
            Cg = ["$animate",
                function(a) {
                    return {
                        restrict: "A",
                        multiElement: !0,
                        link: function(b, c, d) {
                            b.$watch(d.ngHide,
                                function(b) {
                                    a[b ? "addClass": "removeClass"](c, zg, {
                                        tempClasses: Ag
                                    })
                                })
                        }
                    }
                }],
            Dg = zd(function(a, b, c) {
                a.$watchCollection(c.ngStyle,
                    function(a, c) {
                        c && a !== c && f(c,
                            function(a, c) {
                                b.css(c, "")
                            }),
                        a && b.css(a)
                    })
            }),
            Eg = ["$animate",
                function(a) {
                    return {
                        restrict: "EA",
                        require: "ngSwitch",
                        controller: ["$scope",
                            function() {
                                this.cases = {}
                            }],
                        link: function(c, d, e, g) {
                            var h = e.ngSwitch || e.on,
                                i = [],
                                j = [],
                                k = [],
                                l = [],
                                m = function(a, b) {
                                    return function() {
                                        a.splice(b, 1)
                                    }
                                };
                            c.$watch(h,
                                function(c) {
                                    var d, e;
                                    for (d = 0, e = k.length; e > d; ++d) a.cancel(k[d]);
                                    for (k.length = 0, d = 0, e = l.length; e > d; ++d) {
                                        var h = ib(j[d].clone);
                                        l[d].$destroy();
                                        var n = k[d] = a.leave(h);
                                        n.then(m(k, d))
                                    }
                                    j.length = 0,
                                        l.length = 0,
                                    (i = g.cases["!" + c] || g.cases["?"]) && f(i,
                                        function(c) {
                                            c.transclude(function(d, e) {
                                                l.push(e);
                                                var f = c.element;
                                                d[d.length++] = b.createComment(" end ngSwitchWhen: ");
                                                var g = {
                                                    clone: d
                                                };
                                                j.push(g),
                                                    a.enter(d, f.parent(), f)
                                            })
                                        })
                                })
                        }
                    }
                }],
            Fg = zd({
                transclude: "element",
                priority: 1200,
                require: "^ngSwitch",
                multiElement: !0,
                link: function(a, b, c, d, e) {
                    d.cases["!" + c.ngSwitchWhen] = d.cases["!" + c.ngSwitchWhen] || [],
                        d.cases["!" + c.ngSwitchWhen].push({
                            transclude: e,
                            element: b
                        })
                }
            }),
            Gg = zd({
                transclude: "element",
                priority: 1200,
                require: "^ngSwitch",
                multiElement: !0,
                link: function(a, b, c, d, e) {
                    d.cases["?"] = d.cases["?"] || [],
                        d.cases["?"].push({
                            transclude: e,
                            element: b
                        })
                }
            }),
            Hg = zd({
                restrict: "EAC",
                link: function(a, b, c, e, f) {
                    if (!f) throw d("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", T(b));
                    f(function(a) {
                        b.empty(),
                            b.append(a)
                    })
                }
            }),
            Ig = ["$templateCache",
                function(a) {
                    return {
                        restrict: "E",
                        terminal: !0,
                        compile: function(b, c) {
                            if ("text/ng-template" == c.type) {
                                var d = c.id,
                                    e = b[0].text;
                                a.put(d, e)
                            }
                        }
                    }
                }],
            Jg = d("ngOptions"),
            Kg = q({
                restrict: "A",
                terminal: !0
            }),
            Lg = ["$compile", "$parse",
                function(a, d) {
                    var e = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
                        h = {
                            $setViewValue: o
                        };
                    return {
                        restrict: "E",
                        require: ["select", "?ngModel"],
                        controller: ["$element", "$scope", "$attrs",
                            function(a, b, c) {
                                var d, e, f = this,
                                    g = {},
                                    i = h;
                                f.databound = c.ngModel,
                                    f.init = function(a, b, c) {
                                        i = a,
                                            d = b,
                                            e = c
                                    },
                                    f.addOption = function(b, c) {
                                        gb(b, '"option value"'),
                                            g[b] = !0,
                                        i.$viewValue == b && (a.val(b), e.parent() && e.remove()),
                                        c && c[0].hasAttribute("selected") && (c[0].selected = !0)
                                    },
                                    f.removeOption = function(a) {
                                        this.hasOption(a) && (delete g[a], i.$viewValue === a && this.renderUnknownOption(a))
                                    },
                                    f.renderUnknownOption = function(b) {
                                        var c = "? " + Ob(b) + " ?";
                                        e.val(c),
                                            a.prepend(e),
                                            a.val(c),
                                            e.prop("selected", !0)
                                    },
                                    f.hasOption = function(a) {
                                        return g.hasOwnProperty(a)
                                    },
                                    b.$on("$destroy",
                                        function() {
                                            f.renderUnknownOption = o
                                        })
                            }],
                        link: function(h, i, j, k) {
                            function l(a, b, c, d) {
                                c.$render = function() {
                                    var a = c.$viewValue;
                                    d.hasOption(a) ? (z.parent() && z.remove(), b.val(a), "" === a && o.prop("selected", !0)) : r(a) && o ? b.val("") : d.renderUnknownOption(a)
                                },
                                    b.on("change",
                                        function() {
                                            a.$apply(function() {
                                                z.parent() && z.remove(),
                                                    c.$setViewValue(b.val())
                                            })
                                        })
                            }
                            function m(a, b, c) {
                                var d;
                                c.$render = function() {
                                    var a = new Pb(c.$viewValue);
                                    f(b.find("option"),
                                        function(b) {
                                            b.selected = s(a.get(b.value))
                                        })
                                },
                                    a.$watch(function() {
                                        M(d, c.$viewValue) || (d = L(c.$viewValue), c.$render())
                                    }),
                                    b.on("change",
                                        function() {
                                            a.$apply(function() {
                                                var a = [];
                                                f(b.find("option"),
                                                    function(b) {
                                                        b.selected && a.push(b.value)
                                                    }),
                                                    c.$setViewValue(a)
                                            })
                                        })
                            }
                            function n(b, h, i) {
                                function j(a, c, d) {
                                    return M[B] = d,
                                    E && (M[E] = c),
                                        a(b, M)
                                }
                                function k() {
                                    b.$apply(function() {
                                        var a, c = H(b) || [];
                                        if (t) a = [],
                                            f(h.val(),
                                                function(b) {
                                                    b = J ? K[b] : b,
                                                        a.push(l(b, c[b]))
                                                });
                                        else {
                                            var d = J ? K[h.val()] : h.val();
                                            a = l(d, c[d])
                                        }
                                        i.$setViewValue(a),
                                            r()
                                    })
                                }
                                function l(a, b) {
                                    if ("?" === a) return c;
                                    if ("" === a) return null;
                                    var d = D ? D: G;
                                    return j(d, a, b)
                                }
                                function m() {
                                    var a, c = H(b);
                                    if (c && je(c)) {
                                        a = new Array(c.length);
                                        for (var d = 0,
                                                 e = c.length; e > d; d++) a[d] = j(A, d, c[d]);
                                        return a
                                    }
                                    if (c) {
                                        a = {};
                                        for (var f in c) c.hasOwnProperty(f) && (a[f] = j(A, f, c[f]))
                                    }
                                    return a
                                }
                                function n(a) {
                                    var b;
                                    if (t) if (J && je(a)) {
                                        b = new Pb([]);
                                        for (var c = 0; c < a.length; c++) b.put(j(J, null, a[c]), !0)
                                    } else b = new Pb(a);
                                    else J && (a = j(J, null, a));
                                    return function(c, d) {
                                        var e;
                                        return e = J ? J: D ? D: G,
                                            t ? s(b.remove(j(e, c, d))) : a === j(e, c, d)
                                    }
                                }
                                function o() {
                                    w || (b.$$postDigest(r), w = !0)
                                }
                                function q(a, b, c) {
                                    a[b] = a[b] || 0,
                                        a[b] += c ? 1 : -1
                                }
                                function r() {
                                    w = !1;
                                    var a, c, d, e, k, l, m, o, r, u, z, B, C, D, G, I, N, O = {
                                            "": []
                                        },
                                        P = [""],
                                        Q = i.$viewValue,
                                        R = H(b) || [],
                                        S = E ? g(R) : R,
                                        T = {},
                                        U = n(Q),
                                        V = !1;
                                    for (K = {},
                                             B = 0; u = S.length, u > B; B++) m = B,
                                    E && (m = S[B], "$" === m.charAt(0)) || (o = R[m], a = j(F, m, o) || "", (c = O[a]) || (c = O[a] = [], P.push(a)), C = U(m, o), V = V || C, I = j(A, m, o), I = s(I) ? I: "", N = J ? J(b, M) : E ? S[B] : B, J && (K[N] = m), c.push({
                                        id: N,
                                        label: I,
                                        selected: C
                                    }));
                                    for (t || (v || null === Q ? O[""].unshift({
                                        id: "",
                                        label: "",
                                        selected: !V
                                    }) : V || O[""].unshift({
                                        id: "?",
                                        label: "",
                                        selected: !0
                                    })), z = 0, r = P.length; r > z; z++) {
                                        for (a = P[z], c = O[a], L.length <= z ? (e = {
                                            element: y.clone().attr("label", a),
                                            label: c.label
                                        },
                                            k = [e], L.push(k), h.append(e.element)) : (k = L[z], e = k[0], e.label != a && e.element.attr("label", e.label = a)), D = null, B = 0, u = c.length; u > B; B++) d = c[B],
                                            (l = k[B + 1]) ? (D = l.element, l.label !== d.label && (q(T, l.label, !1), q(T, d.label, !0), D.text(l.label = d.label), D.prop("label", l.label)), l.id !== d.id && D.val(l.id = d.id), D[0].selected !== d.selected && (D.prop("selected", l.selected = d.selected), Zd && D.prop("selected", l.selected))) : ("" === d.id && v ? G = v: (G = x.clone()).val(d.id).prop("selected", d.selected).attr("selected", d.selected).prop("label", d.label).text(d.label), k.push(l = {
                                                element: G,
                                                label: d.label,
                                                id: d.id,
                                                selected: d.selected
                                            }), q(T, d.label, !0), D ? D.after(G) : e.element.append(G), D = G);
                                        for (B++; k.length > B;) d = k.pop(),
                                            q(T, d.label, !1),
                                            d.element.remove()
                                    }
                                    for (; L.length > z;) {
                                        for (c = L.pop(), B = 1; B < c.length; ++B) q(T, c[B].label, !1);
                                        c[0].element.remove()
                                    }
                                    f(T,
                                        function(a, b) {
                                            a > 0 ? p.addOption(b) : 0 > a && p.removeOption(b)
                                        })
                                }
                                var z;
                                if (! (z = u.match(e))) throw Jg("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", u, T(h));
                                var A = d(z[2] || z[1]),
                                    B = z[4] || z[6],
                                    C = / as /.test(z[0]) && z[1],
                                    D = C ? d(C) : null,
                                    E = z[5],
                                    F = d(z[3] || ""),
                                    G = d(z[2] ? z[1] : B),
                                    H = d(z[7]),
                                    I = z[8],
                                    J = I ? d(z[8]) : null,
                                    K = {},
                                    L = [[{
                                        element: h,
                                        label: ""
                                    }]],
                                    M = {};
                                v && (a(v)(b), v.removeClass("ng-scope"), v.remove()),
                                    h.empty(),
                                    h.on("change", k),
                                    i.$render = r,
                                    b.$watchCollection(H, o),
                                    b.$watchCollection(m, o),
                                t && b.$watchCollection(function() {
                                        return i.$modelValue
                                    },
                                    o)
                            }
                            if (k[1]) {
                                for (var o, p = k[0], q = k[1], t = j.multiple, u = j.ngOptions, v = !1, w = !1, x = $d(b.createElement("option")), y = $d(b.createElement("optgroup")), z = x.clone(), A = 0, B = i.children(), C = B.length; C > A; A++) if ("" === B[A].value) {
                                    o = v = B.eq(A);
                                    break
                                }
                                p.init(q, v, z),
                                t && (q.$isEmpty = function(a) {
                                    return ! a || 0 === a.length
                                }),
                                    u ? n(h, i, q) : t ? m(h, i, q) : l(h, i, q, p)
                            }
                        }
                    }
                }],
            Mg = ["$interpolate",
                function(a) {
                    var b = {
                        addOption: o,
                        removeOption: o
                    };
                    return {
                        restrict: "E",
                        priority: 100,
                        compile: function(c, d) {
                            if (r(d.value)) {
                                var e = a(c.text(), !0);
                                e || d.$set("value", c.text())
                            }
                            return function(a, c, d) {
                                var f = "$selectController",
                                    g = c.parent(),
                                    h = g.data(f) || g.parent().data(f);
                                h && h.databound || (h = b),
                                    e ? a.$watch(e,
                                        function(a, b) {
                                            d.$set("value", a),
                                            b !== a && h.removeOption(b),
                                                h.addOption(a, c)
                                        }) : h.addOption(d.value, c),
                                    c.on("$destroy",
                                        function() {
                                            h.removeOption(d.value)
                                        })
                            }
                        }
                    }
                }],
            Ng = q({
                restrict: "E",
                terminal: !1
            }),
            Og = function() {
                return {
                    restrict: "A",
                    require: "?ngModel",
                    link: function(a, b, c, d) {
                        d && (c.required = !0, d.$validators.required = function(a, b) {
                            return ! c.required || !d.$isEmpty(b)
                        },
                            c.$observe("required",
                                function() {
                                    d.$validate()
                                }))
                    }
                }
            },
            Pg = function() {
                return {
                    restrict: "A",
                    require: "?ngModel",
                    link: function(a, b, e, f) {
                        if (f) {
                            var g, h = e.ngPattern || e.pattern;
                            e.$observe("pattern",
                                function(a) {
                                    if (u(a) && a.length > 0 && (a = new RegExp("^" + a + "$")), a && !a.test) throw d("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", h, a, T(b));
                                    g = a || c,
                                        f.$validate()
                                }),
                                f.$validators.pattern = function(a) {
                                    return f.$isEmpty(a) || r(g) || g.test(a)
                                }
                        }
                    }
                }
            },
            Qg = function() {
                return {
                    restrict: "A",
                    require: "?ngModel",
                    link: function(a, b, c, d) {
                        if (d) {
                            var e = -1;
                            c.$observe("maxlength",
                                function(a) {
                                    var b = m(a);
                                    e = isNaN(b) ? -1 : b,
                                        d.$validate()
                                }),
                                d.$validators.maxlength = function(a, b) {
                                    return 0 > e || d.$isEmpty(b) || b.length <= e
                                }
                        }
                    }
                }
            },
            Rg = function() {
                return {
                    restrict: "A",
                    require: "?ngModel",
                    link: function(a, b, c, d) {
                        if (d) {
                            var e = 0;
                            c.$observe("minlength",
                                function(a) {
                                    e = m(a) || 0,
                                        d.$validate()
                                }),
                                d.$validators.minlength = function(a, b) {
                                    return d.$isEmpty(b) || b.length >= e
                                }
                        }
                    }
                }
            };
        return a.angular.bootstrap ? void console.log("WARNING: Tried to load angular more than once.") : (db(), nb(ge), void $d(b).ready(function() {
            $(b, _)
        }))
    } (window, document),
!window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>'),
    function(a, b) {
        "use strict";
        function c() {
            function a(a, c) {
                return b.extend(Object.create(a), c)
            }
            function c(a, b) {
                var c = b.caseInsensitiveMatch,
                    d = {
                        originalPath: a,
                        regexp: a
                    },
                    e = d.keys = [];
                return a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,
                    function(a, b, c, d) {
                        var f = "?" === d ? d: null,
                            g = "*" === d ? d: null;
                        return e.push({
                            name: c,
                            optional: !!f
                        }),
                            b = b || "",
                        "" + (f ? "": b) + "(?:" + (f ? b: "") + (g && "(.+?)" || "([^/]+)") + (f || "") + ")" + (f || "")
                    }).replace(/([\/$\*])/g, "\\$1"),
                    d.regexp = new RegExp("^" + a + "$", c ? "i": ""),
                    d
            }
            var d = {};
            this.when = function(a, e) {
                var f = b.copy(e);
                if (b.isUndefined(f.reloadOnSearch) && (f.reloadOnSearch = !0), b.isUndefined(f.caseInsensitiveMatch) && (f.caseInsensitiveMatch = this.caseInsensitiveMatch), d[a] = b.extend(f, a && c(a, f)), a) {
                    var g = "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/";
                    d[g] = b.extend({
                            redirectTo: a
                        },
                        c(g, f))
                }
                return this
            },
                this.caseInsensitiveMatch = !1,
                this.otherwise = function(a) {
                    return "string" == typeof a && (a = {
                        redirectTo: a
                    }),
                        this.when(null, a),
                        this
                },
                this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$templateRequest", "$sce",
                    function(c, e, f, g, i, j, k) {
                        function l(a, b) {
                            var c = b.keys,
                                d = {};
                            if (!b.regexp) return null;
                            var e = b.regexp.exec(a);
                            if (!e) return null;
                            for (var f = 1,
                                     g = e.length; g > f; ++f) {
                                var h = c[f - 1],
                                    i = e[f];
                                h && i && (d[h.name] = i)
                            }
                            return d
                        }
                        function m(a) {
                            var d = t.current;
                            q = o(),
                                r = q && d && q.$$route === d.$$route && b.equals(q.pathParams, d.pathParams) && !q.reloadOnSearch && !s,
                            r || !d && !q || c.$broadcast("$routeChangeStart", q, d).defaultPrevented && a && a.preventDefault()
                        }
                        function n() {
                            var a = t.current,
                                d = q;
                            r ? (a.params = d.params, b.copy(a.params, f), c.$broadcast("$routeUpdate", a)) : (d || a) && (s = !1, t.current = d, d && d.redirectTo && (b.isString(d.redirectTo) ? e.path(p(d.redirectTo, d.params)).search(d.params).replace() : e.url(d.redirectTo(d.pathParams, e.path(), e.search())).replace()), g.when(d).then(function() {
                                if (d) {
                                    var a, c, e = b.extend({},
                                        d.resolve);
                                    return b.forEach(e,
                                        function(a, c) {
                                            e[c] = b.isString(a) ? i.get(a) : i.invoke(a, null, null, c)
                                        }),
                                        b.isDefined(a = d.template) ? b.isFunction(a) && (a = a(d.params)) : b.isDefined(c = d.templateUrl) && (b.isFunction(c) && (c = c(d.params)), c = k.getTrustedResourceUrl(c), b.isDefined(c) && (d.loadedTemplateUrl = c, a = j(c))),
                                    b.isDefined(a) && (e.$template = a),
                                        g.all(e)
                                }
                            }).then(function(e) {
                                    d == t.current && (d && (d.locals = e, b.copy(d.params, f)), c.$broadcast("$routeChangeSuccess", d, a))
                                },
                                function(b) {
                                    d == t.current && c.$broadcast("$routeChangeError", d, a, b)
                                }))
                        }
                        function o() {
                            var c, f;
                            return b.forEach(d,
                                function(d) { ! f && (c = l(e.path(), d)) && (f = a(d, {
                                    params: b.extend({},
                                        e.search(), c),
                                    pathParams: c
                                }), f.$$route = d)
                                }),
                            f || d[null] && a(d[null], {
                                params: {},
                                pathParams: {}
                            })
                        }
                        function p(a, c) {
                            var d = [];
                            return b.forEach((a || "").split(":"),
                                function(a, b) {
                                    if (0 === b) d.push(a);
                                    else {
                                        var e = a.match(/(\w+)(?:[?*])?(.*)/),
                                            f = e[1];
                                        d.push(c[f]),
                                            d.push(e[2] || ""),
                                            delete c[f]
                                    }
                                }),
                                d.join("")
                        }
                        var q, r, s = !1,
                            t = {
                                routes: d,
                                reload: function() {
                                    s = !0,
                                        c.$evalAsync(function() {
                                            m(),
                                                n()
                                        })
                                },
                                updateParams: function(a) {
                                    if (!this.current || !this.current.$$route) throw h("norout", "Tried updating route when with no current route");
                                    a = b.extend({},
                                        this.current.params, a),
                                        e.path(p(this.current.$$route.originalPath, a)),
                                        e.search(a)
                                }
                            };
                        return c.$on("$locationChangeStart", m),
                            c.$on("$locationChangeSuccess", n),
                            t
                    }]
        }
        function d() {
            this.$get = function() {
                return {}
            }
        }
        function e(a, c, d) {
            return {
                restrict: "ECA",
                terminal: !0,
                priority: 400,
                transclude: "element",
                link: function(e, f, g, h, i) {
                    function j() {
                        n && (d.cancel(n), n = null),
                        l && (l.$destroy(), l = null),
                        m && (n = d.leave(m), n.then(function() {
                            n = null
                        }), m = null)
                    }
                    function k() {
                        var g = a.current && a.current.locals,
                            h = g && g.$template;
                        if (b.isDefined(h)) {
                            var k = e.$new(),
                                n = a.current,
                                q = i(k,
                                    function(a) {
                                        d.enter(a, null, m || f).then(function() { ! b.isDefined(o) || o && !e.$eval(o) || c()
                                        }),
                                            j()
                                    });
                            m = q,
                                l = n.scope = k,
                                l.$emit("$viewContentLoaded"),
                                l.$eval(p)
                        } else j()
                    }
                    var l, m, n, o = g.autoscroll,
                        p = g.onload || "";
                    e.$on("$routeChangeSuccess", k),
                        k()
                }
            }
        }
        function f(a, b, c) {
            return {
                restrict: "ECA",
                priority: -400,
                link: function(d, e) {
                    var f = c.current,
                        g = f.locals;
                    e.html(g.$template);
                    var h = a(e.contents());
                    if (f.controller) {
                        g.$scope = d;
                        var i = b(f.controller, g);
                        f.controllerAs && (d[f.controllerAs] = i),
                            e.data("$ngControllerController", i),
                            e.children().data("$ngControllerController", i)
                    }
                    h(d)
                }
            }
        }
        var g = b.module("ngRoute", ["ng"]).provider("$route", c),
            h = b.$$minErr("ngRoute");
        g.provider("$routeParams", d),
            g.directive("ngView", e),
            g.directive("ngView", f),
            e.$inject = ["$route", "$anchorScroll", "$animate"],
            f.$inject = ["$compile", "$controller", "$route"]
    } (window, window.angular),
    function(a, b) {
        "use strict";
        function c() {
            this.$get = ["$$sanitizeUri",
                function(a) {
                    return function(b) {
                        var c = [];
                        return f(b, i(c,
                            function(b, c) {
                                return ! /^unsafe/.test(a(b, c))
                            })),
                            c.join("")
                    }
                }]
        }
        function d(a) {
            var c = [],
                d = i(c, b.noop);
            return d.chars(a),
                c.join("")
        }
        function e(a) {
            var b, c = {},
                d = a.split(",");
            for (b = 0; b < d.length; b++) c[d[b]] = !0;
            return c
        }
        function f(a, c) {
            function d(a, d, f, h) {
                if (d = b.lowercase(d), y[d]) for (; t.last() && z[t.last()];) e("", t.last());
                x[d] && t.last() == d && e("", d),
                    h = u[d] || !!h,
                h || t.push(d);
                var i = {};
                f.replace(m,
                    function(a, b, c, d, e) {
                        var f = c || d || e || "";
                        i[b] = g(f)
                    }),
                c.start && c.start(d, i, h)
            }
            function e(a, d) {
                var e, f = 0;
                if (d = b.lowercase(d)) for (f = t.length - 1; f >= 0 && t[f] != d; f--);
                if (f >= 0) {
                    for (e = t.length - 1; e >= f; e--) c.end && c.end(t[e]);
                    t.length = f
                }
            }
            "string" != typeof a && (a = null === a || "undefined" == typeof a ? "": "" + a);
            var f, h, i, s, t = [],
                v = a;
            for (t.last = function() {
                return t[t.length - 1]
            }; a;) {
                if (s = "", h = !0, t.last() && B[t.last()] ? (a = a.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*" + t.last() + "[^>]*>", "i"),
                        function(a, b) {
                            return b = b.replace(p, "$1").replace(r, "$1"),
                            c.chars && c.chars(g(b)),
                                ""
                        }), e("", t.last())) : (0 === a.indexOf("<!--") ? (f = a.indexOf("--", 4), f >= 0 && a.lastIndexOf("-->", f) === f && (c.comment && c.comment(a.substring(4, f)), a = a.substring(f + 3), h = !1)) : q.test(a) ? (i = a.match(q), i && (a = a.replace(i[0], ""), h = !1)) : o.test(a) ? (i = a.match(l), i && (a = a.substring(i[0].length), i[0].replace(l, e), h = !1)) : n.test(a) && (i = a.match(k), i ? (i[4] && (a = a.substring(i[0].length), i[0].replace(k, d)), h = !1) : (s += "<", a = a.substring(1))), h && (f = a.indexOf("<"), s += 0 > f ? a: a.substring(0, f), a = 0 > f ? "": a.substring(f), c.chars && c.chars(g(s)))), a == v) throw j("badparse", "The sanitizer was unable to parse the following block of html: {0}", a);
                v = a
            }
            e()
        }
        function g(a) {
            if (!a) return "";
            var b = I.exec(a),
                c = b[1],
                d = b[3],
                e = b[2];
            return e && (H.innerHTML = e.replace(/</g, "&lt;"), e = "textContent" in H ? H.textContent: H.innerText),
            c + e + d
        }
        function h(a) {
            return a.replace(/&/g, "&amp;").replace(s,
                function(a) {
                    var b = a.charCodeAt(0),
                        c = a.charCodeAt(1);
                    return "&#" + (1024 * (b - 55296) + (c - 56320) + 65536) + ";"
                }).replace(t,
                function(a) {
                    return "&#" + a.charCodeAt(0) + ";"
                }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        function i(a, c) {
            var d = !1,
                e = b.bind(a, a.push);
            return {
                start: function(a, f, g) {
                    a = b.lowercase(a),
                    !d && B[a] && (d = a),
                    d || C[a] !== !0 || (e("<"), e(a), b.forEach(f,
                        function(d, f) {
                            var g = b.lowercase(f),
                                i = "img" === a && "src" === g || "background" === g;
                            G[g] !== !0 || D[g] === !0 && !c(d, i) || (e(" "), e(f), e('="'), e(h(d)), e('"'))
                        }), e(g ? "/>": ">"))
                },
                end: function(a) {
                    a = b.lowercase(a),
                    d || C[a] !== !0 || (e("</"), e(a), e(">")),
                    a == d && (d = !1)
                },
                chars: function(a) {
                    d || e(h(a))
                }
            }
        }
        var j = b.$$minErr("$sanitize"),
            k = /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
            l = /^<\/\s*([\w:-]+)[^>]*>/,
            m = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
            n = /^</,
            o = /^<\//,
            p = /<!--(.*?)-->/g,
            q = /<!DOCTYPE([^>]*?)>/i,
            r = /<!\[CDATA\[(.*?)]]>/g,
            s = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
            t = /([^\#-~| |!])/g,
            u = e("area,br,col,hr,img,wbr"),
            v = e("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
            w = e("rp,rt"),
            x = b.extend({},
                w, v),
            y = b.extend({},
                v, e("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),
            z = b.extend({},
                w, e("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),
            A = e("animate,animateColor,animateMotion,animateTransform,circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,set,stop,svg,switch,text,title,tspan,use"),
            B = e("script,style"),
            C = b.extend({},
                u, y, z, x, A),
            D = e("background,cite,href,longdesc,src,usemap,xlink:href"),
            E = e("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width"),
            F = e("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,attributeName,attributeType,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan"),
            G = b.extend({},
                D, F, E),
            H = document.createElement("pre"),
            I = /^(\s*)([\s\S]*?)(\s*)$/;
        b.module("ngSanitize", []).provider("$sanitize", c),
            b.module("ngSanitize").filter("linky", ["$sanitize",
                function(a) {
                    //var c = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"鈥濃€橾/,
                    e = /^mailto:/;
                    return function(f, g) {
                        function h(a) {
                            a && n.push(d(a))
                        }
                        function i(a, c) {
                            n.push("<a "),
                            b.isDefined(g) && n.push('target="', g, '" '),
                                n.push('href="', a.replace(/"/g, "&quot;"), '">'),
                                h(c),
                                n.push("</a>")
                        }
                        if (!f) return f;
                        for (var j, k, l, m = f,
                                 n = []; j = m.match(c);) k = j[0],
                        j[2] || j[4] || (k = (j[3] ? "http://": "mailto:") + k),
                            l = j.index,
                            h(m.substr(0, l)),
                            i(k, j[0].replace(e, "")),
                            m = m.substring(l + j[0].length);
                        return h(m),
                            a(n.join(""))
                    }
                }])
    } (window, window.angular),
    function(a, b) {
        "use strict";
        function c(a, b) {
            for (var c = a.length; c--;) if (a[c] === b) return ! 0;
            return ! 1
        }
        var d = a.module("bp.img.cropper", []);
        String.prototype.ucfirst = function() {
            return this.charAt(0).toUpperCase() + this.slice(1)
        },
            String.prototype.lcfirst = function() {
                return this.charAt(0).toLowerCase() + this.slice(1)
            },
            d.constant("CroppableDefaults", {
                aspectRatio: 0,
                ruleOfThirds: !0,
                outputType: "base64",
                widthMin: 50,
                widthMax: 0,
                heightMin: 50,
                heightMax: 0,
                autoCropping: !0,
                imageType: "jpeg",
                centerHandles: !0,
                sizeHint: !0,
                loadingClass: "cropper-loading",
                backdropOpacity: 50,
                eventPrefix: "crop",
                optionsPrefix: "crop",
                directiveName: "$croppable",
                preloader: !0
            }),
            d.controller("CroppableController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$log", "$window", "$document", "$timeout", "$interpolate", "CroppableDefaults",
                function(d, e, f, g, h, i, j, k, l, m, n, o) {
                    function p(b) {
                        return a.isDefined(fb.$cropper) && (P(), R(), V(), fb.$hasSelection = N(), T(b), s(), t(), T("onUpdate")),
                            fb
                    }
                    function q() {
                        hb.imgSrc = f.ngSrc,
                            e.wrap('<div class="crop-it-container"></div>'),
                            fb.$cropContainer = e.parent().prepend(r()),
                            fb.$cropper = a.element(fb.$cropContainer[0].querySelector(".cropper")),
                            fb.$cropArea = a.element(fb.$cropper[0].querySelector(".crop-area")),
                            fb.$overlayedImg = a.element(fb.$cropArea[0].querySelector("img")),
                            fb.$cropHandles = a.element(fb.$cropper[0].querySelector(".crop-handles")),
                            fb.$centerHandles = a.element(fb.$cropHandles[0].querySelectorAll(".center-handle")),
                            fb.$sizeHint = a.element(fb.$cropper[0].querySelector(".size-hint")),
                            fb.$ruleOfThirds = a.element(fb.$cropArea[0].querySelectorAll(".rule-of-thirds"))
                    }
                    function r() {
                        var b = "";
                        return b += '<span ng-if="options.preloader" class="crop-loader"><span class="crop-loader-inner"></span></span>',
                            b += '<div class="cropper" style="display: none;">',
                            b += '<div class="crop-area">',
                            b += '<img ng-src="{{ imgSrc }}">',
                            b += '<span class="rule-of-thirds vertical-1"></span>',
                            b += '<span class="rule-of-thirds vertical-2"></span>',
                            b += '<span class="rule-of-thirds horizontal-1"></span>',
                            b += '<span class="rule-of-thirds horizontal-2"></span>',
                            b += "</div>",
                            b += '<div class="crop-handles">',
                            b += '<div class="handle top-left"></div>',
                            b += '<div class="handle center-handle top"></div>',
                            b += '<div class="handle top-right"></div>',
                            b += '<div class="handle center-handle right"></div>',
                            b += '<div class="handle bottom-right"></div>',
                            b += '<div class="handle center-handle bottom"></div>',
                            b += '<div class="handle bottom-left"></div>',
                            b += '<div class="handle center-handle left"></div>',
                            b += "</div>",
                            b += '<span class="size-hint"></span>',
                            b += "</div>",
                            b = a.element(b),
                            hb.options = bb,
                            g(b)(hb)
                    }
                    function s() {
                        fb.$cropper.css({
                            display: fb.$active && fb.$hasSelection ? "block": "none",
                            top: fb.$measurements.top + "px",
                            left: fb.$measurements.left + "px",
                            width: fb.$measurements.width + "px",
                            height: fb.$measurements.height + "px"
                        }),
                            fb.$overlayedImg.css({
                                width: e[0].offsetWidth + "px",
                                height: e[0].offsetHeight + "px",
                                top: "-" + fb.$measurements.top + "px",
                                left: "-" + fb.$measurements.left + "px"
                            }),
                            e.css({
                                opacity: fb.$active && fb.$hasSelection ? bb.backdropOpacity / 100 : "1"
                            }),
                            fb.$sizeHint.text(Math.round(fb.$data.width) + "x" + Math.round(fb.$data.height)).css({
                                opacity: bb.sizeHint && fb.$selecting && fb.$hasSelection ? 1 : 0
                            }),
                            fb.$ruleOfThirds.css({
                                display: bb.ruleOfThirds && fb.$hasSelection ? "block": "none"
                            })
                    }
                    function t() {
                        fb.$cropHandles.css({
                            display: fb.$hasSelection && !fb.$selecting && !fb.$moving && fb.$active ? "block": "none"
                        }),
                            fb.$centerHandles.css({
                                display: bb.centerHandles ? "block": "none"
                            })
                    }
                    function u(c) {
                        e.off("$destroy", u),
                        a.isDefined(c) && a.isDefined(fb.$name) && delete h(bb.directiveName)(d)[fb.$name],
                        a.isDefined(fb.$cropContainer) && (D(!0), a.isUndefined(f.ngSrc) && a.isUndefined(c) && (e.removeAttr("src"), e.attr("ng-src", fb.$srcAttr)), fb.$cropContainer.replaceWith(e), fb.$cropContainer = b, fb.$cropper = b, fb.$cropArea = b, fb.$cropHandles = b, fb.$overlayedImg = b, fb.$centerHandles = b, fb.$sizeHint = b, fb.$ruleOfThirds = b),
                            a.forEach(mb,
                                function(a) {
                                    a()
                                }),
                            w(),
                            y(),
                        lb || (B(), kb = fb.$initialized = !1),
                            fb.$data.base64 = null,
                            T("onDestroy")
                    }
                    function v() {
                        cb = d.$watch(f.croppable,
                            function(b, c) {
                                b !== c && a.isDefined(b) && !lb && (a.isObject(b) ? (b.width && c.width && b.width !== c.width ? ib = !0 : b.height && c.height && b.height !== c.height && (jb = !0), fb.$data.top = b.top || fb.$data.top, fb.$data.left = b.left || fb.$data.left, fb.$data.width = b.width || fb.$data.width, fb.$data.height = b.height || fb.$data.height, Q(), p(), ib = !1, jb = !1) : j.warn("The new value in the " + (f.croppable + " variable " || "croppable attribute ") + "is not an object!"))
                            },
                            !0)
                    }
                    function w() {
                        return a.isUndefined(cb) ? !1 : (cb(), cb = b, !0)
                    }
                    function x() {
                        db = d.$watch(f[bb.optionsPrefix + "Options"],
                            function(b, c) {
                                b !== c && a.isDefined(b) ? X(b) : b !== c && a.isUndefined(b) && X(o)
                            },
                            !0)
                    }
                    function y() {
                        return a.isUndefined(db) ? !1 : (db(), db = b, !0)
                    }
                    function z() {
                        v(),
                        f.hasOwnProperty(bb.optionsPrefix + "Show") && O(f[bb.optionsPrefix + "Show"],
                            function(a, b) {
                                a === b || "boolean" != typeof a || a === b || lb || (a === !1 ? D() : C())
                            }),
                        f.hasOwnProperty(bb.optionsPrefix + "Options") && x(),
                            O(function() {
                                    return fb.$loading
                                },
                                function(b, c) {
                                    b !== c && a.isDefined(fb.$cropContainer) && bb.preloader && fb.$cropContainer.toggleClass(bb.loadingClass, b)
                                })
                    }
                    function A() {
                        eb = f.$observe("ngSrc",
                            function(b) {
                                if (kb) {
                                    if (lb = !0, a.isUndefined(b)) return u(),
                                        void(lb = !1);
                                    a.isUndefined(cb) && (X(d.$eval(f[bb.optionsPrefix + "Options"])), z()),
                                        D(!0),
                                        hb.imgSrc = b,
                                        W().then(function() {
                                            $(a.isUndefined(d.$eval(f.croppable)) ? {
                                                width: 0,
                                                height: 0,
                                                left: 0,
                                                top: 0
                                            }: a.extend({},
                                                fb.$data, d.$eval(f.croppable))),
                                                lb = !1,
                                                C()
                                        })
                                }
                            })
                    }
                    function B() {
                        return a.isUndefined(eb) ? !1 : (eb(), eb = b, !0)
                    }
                    function C() {
                        if (fb.$active === !1 && a.isDefined(f.ngSrc)) {
                            if (a.isDefined(f[bb.optionsPrefix + "Show"]) && !!d.$eval(f[bb.optionsPrefix + "Show"]) == !1) return fb;
                            a.isUndefined(fb.$cropContainer) && q(),
                                fb.$active = !0,
                                fb.$cropContainer.on("touchstart mousedown", E).addClass("crop-active"),
                                fb.$cropHandles.children().on("touchstart mousedown", J),
                                fb.$cropper.on("touchstart mousedown", H),
                                a.element(k).on("resize", K),
                            f.hasOwnProperty(bb.optionsPrefix + "Show") && h(f[bb.optionsPrefix + "Show"]).assign(d, !0),
                                p("onEnable")
                        }
                        return fb
                    }
                    function D(b) {
                        return fb.$active === !0 && (fb.$active = !1, fb.$cropContainer.off("touchstart mousedown", E).removeClass("crop-active"), fb.$cropHandles.children().off("touchstart mousedown", J), fb.$cropper.off("touchstart mousedown", H), a.element(k).off("resize", K), f.hasOwnProperty(bb.optionsPrefix + "Show") && b !== !0 && h(f[bb.optionsPrefix + "Show"]).assign(d, !1), p("onDisable")),
                            fb
                    }
                    function E(b) {
                        1 === b.which && (b.preventDefault(), a.element(k).on("touchend mouseup", G), a.element(k).on("touchmove mousemove", F), _ = M(b), fb.$selecting = !0, fb.$measurements.top = 0, fb.$measurements.left = 0, fb.$measurements.width = 0, fb.$measurements.height = 0, fb.$data.base64 = null, p("onSelectStart"))
                    }
                    function F(a) {
                        if (fb.$selecting) {
                            a.preventDefault(),
                                ab = M(a);
                            var b = ab.x - _.x,
                                c = ab.y - _.y;
                            bb.aspectRatio && ib ? (c = c > 0 ? Math.min(e[0].offsetHeight - _.y, Math.abs(Math.round(b / bb.aspectRatio))) : Math.min(_.y, Math.abs(Math.round(b / bb.aspectRatio))), b = c * bb.aspectRatio) : bb.aspectRatio && jb && (b = b > 0 ? Math.min(e[0].offsetWidth - _.x, Math.abs(c * bb.aspectRatio)) : Math.min(_.x, Math.abs(c * bb.aspectRatio)), c = b / bb.aspectRatio),
                                fb.$measurements.left = ab.x - _.x > 0 || !ib ? _.x: Math.max(0, _.x - Math.abs(b)),
                                fb.$measurements.top = ab.y - _.y > 0 || !jb ? _.y: Math.max(0, _.y - Math.abs(c)),
                                bb.aspectRatio || ib && jb ? (fb.$measurements.width = Math.abs(b), fb.$measurements.height = Math.abs(c)) : ib ? fb.$measurements.width = Math.abs(b) : jb && (fb.$measurements.height = Math.abs(c)),
                                p("onSelect")
                        }
                    }
                    function G(c) {
                        c.stopPropagation(),
                            ib = !0,
                            jb = !0,
                            a.element(k).off("touchend mouseup", G),
                            fb.$moving ? (a.element(k).off("touchmove mousemove", I), fb.$moving = !1, p("onMoveEnd")) : fb.$selecting && (a.element(k).off("touchmove mousemove", F), fb.$selecting = !1, p("onSelectEnd"), ab = b)
                    }
                    function H(b) {
                        if (1 === b.which && (b.stopPropagation(), b.preventDefault(), !fb.$moving)) {
                            a.element(k).on("touchmove mousemove", I),
                                a.element(k).on("touchend mouseup", G);
                            var c = M(b);
                            fb.$moving = !0,
                                gb.posX = c.x - fb.$cropper[0].offsetLeft,
                                gb.posY = c.y - fb.$cropper[0].offsetTop,
                                p("onMoveStart")
                        }
                    }
                    function I(a) {
                        fb.$data.base64 = null;
                        var b = M(a);
                        fb.$measurements.left = Math.max(0, Math.min(b.x - gb.posX, e[0].offsetWidth - fb.$cropper[0].offsetWidth)),
                            fb.$measurements.top = Math.max(0, Math.min(b.y - gb.posY, e[0].offsetHeight - fb.$cropper[0].offsetHeight)),
                            p("onMove")
                    }
                    function J(b) {
                        if (1 === b.which) {
                            b.preventDefault(),
                                b.stopPropagation();
                            var c = a.element(b.target);
                            fb.$selecting = !0,
                                c.hasClass("top-left") ? (_.x = fb.$measurements.left + fb.$measurements.width, _.y = fb.$measurements.top + fb.$measurements.height) : c.hasClass("top") ? (ib = !1, _.x = fb.$measurements.left, _.y = fb.$measurements.top + fb.$measurements.height) : c.hasClass("top-right") ? (_.x = fb.$measurements.left, _.y = fb.$measurements.top + fb.$measurements.height) : c.hasClass("right") ? (jb = !1, _.x = fb.$measurements.left, _.y = fb.$measurements.top) : c.hasClass("bottom-right") ? (_.x = fb.$measurements.left, _.y = fb.$measurements.top) : c.hasClass("bottom") ? (ib = !1, _.x = fb.$measurements.left, _.y = fb.$measurements.top) : c.hasClass("bottom-left") ? (_.x = fb.$measurements.left + fb.$measurements.width, _.y = fb.$measurements.top) : c.hasClass("left") && (jb = !1, _.x = fb.$measurements.left + fb.$measurements.width, _.y = fb.$measurements.top),
                                a.element(k).on("touchmove mousemove", F),
                                a.element(k).on("touchend mouseup", G)
                        }
                    }
                    function K() {
                        Q(),
                            p()
                    }
                    function L(a) {
                        var b = a[0].getBoundingClientRect();
                        return {
                            top: b.top + k.pageYOffset - l[0].documentElement.clientTop,
                            left: b.left + k.pageXOffset - l[0].documentElement.clientLeft
                        }
                    }
                    function M(a) {
                        var b = a.touches && a.touches.length ? a.touches: [a],
                            c = a.changedTouches && a.changedTouches[0] || a.originalEvent && a.originalEvent.changedTouches && a.originalEvent.changedTouches[0] || b[0].originalEvent || b[0],
                            d = L(e),
                            f = c.pageX - d.left,
                            g = c.pageY - d.top;
                        return {
                            x: Math.max(0, Math.min(f, e[0].offsetWidth)),
                            y: Math.max(0, Math.min(g, e[0].offsetHeight))
                        }
                    }
                    function N() {
                        return fb.$measurements.width > 0 || fb.$measurements.height > 0
                    }
                    function O(a, b, c) {
                        var e = d.$watch(a, b, c || !1);
                        mb.push(e)
                    }
                    function P() {
                        fb.$imgInfo.scaleRatio = Math.min(fb.$imgInfo.originalWidth / e[0].offsetWidth, fb.$imgInfo.originalHeight / e[0].offsetHeight),
                            fb.$data.top = fb.$measurements.top * fb.$imgInfo.scaleRatio,
                            fb.$data.left = fb.$measurements.left * fb.$imgInfo.scaleRatio,
                            fb.$data.width = fb.$measurements.width * fb.$imgInfo.scaleRatio,
                            fb.$data.height = fb.$measurements.height * fb.$imgInfo.scaleRatio
                    }
                    function Q() {
                        fb.$imgInfo.scaleRatio = Math.min(fb.$imgInfo.originalWidth / e[0].offsetWidth, fb.$imgInfo.originalHeight / e[0].offsetHeight),
                            fb.$measurements.top = fb.$data.top / fb.$imgInfo.scaleRatio,
                            fb.$measurements.left = fb.$data.left / fb.$imgInfo.scaleRatio,
                            fb.$measurements.width = fb.$data.width / fb.$imgInfo.scaleRatio,
                            fb.$measurements.height = fb.$data.height / fb.$imgInfo.scaleRatio
                    }
                    function R() {
                        var a, c, d = bb.heightMax ? bb.heightMax / fb.$imgInfo.scaleRatio: b,
                            f = bb.widthMax ? bb.widthMax / fb.$imgInfo.scaleRatio: b,
                            g = bb.heightMin ? bb.heightMin / fb.$imgInfo.scaleRatio: b,
                            h = bb.widthMin ? bb.widthMin / fb.$imgInfo.scaleRatio: b;
                        N() && (bb.aspectRatio && ib ? fb.$measurements.height = fb.$measurements.width / bb.aspectRatio: bb.aspectRatio && jb && (fb.$measurements.width = fb.$measurements.height * bb.aspectRatio), f && fb.$measurements.width > f && f > h && !fb.$moving && (fb.$measurements.width = f, fb.$measurements.height = bb.aspectRatio ? d: fb.$measurements.height, fb.$measurements.top = ab && ab.y - _.y < 0 ? _.y - fb.$measurements.height: fb.$measurements.top, fb.$measurements.left = ab && ab.x - _.x < 0 ? _.x - fb.$measurements.width: fb.$measurements.left), d && fb.$measurements.height > d && d > g && !fb.$moving && (fb.$measurements.height = d, fb.$measurements.width = bb.aspectRatio ? f: fb.$measurements.width, fb.$measurements.top = ab && ab.y - _.y < 0 ? _.y - fb.$measurements.height: fb.$measurements.top), !fb.$selecting && h && fb.$measurements.width < h && (fb.$measurements.width = h, fb.$measurements.height = bb.aspectRatio ? g: fb.$measurements.height), !fb.$selecting && g && fb.$measurements.height < g && (fb.$measurements.height = g, fb.$measurements.width = bb.aspectRatio ? h: fb.$measurements.width), c = e[0].offsetWidth - (fb.$measurements.left + fb.$measurements.width), a = e[0].offsetHeight - (fb.$measurements.top + fb.$measurements.height), 0 > c && (fb.$measurements.width = fb.$measurements.left + c < 0 ? e[0].offsetWidth: fb.$measurements.width, fb.$measurements.left = fb.$measurements.left + c < 0 ? 0 : fb.$measurements.left + c), 0 > a && (fb.$measurements.height = fb.$measurements.top + a < 0 ? e[0].offsetHeight: fb.$measurements.height, fb.$measurements.top = fb.$measurements.top + a < 0 ? 0 : fb.$measurements.top + a), P())
                    }
                    function S() {
                        bb.aspectRatio && bb.widthMax ? bb.heightMax = bb.widthMax / bb.aspectRatio: bb.aspectRatio && bb.heightMax && (bb.widthMax = bb.heightMax * bb.aspectRatio),
                            bb.aspectRatio && bb.widthMin ? bb.heightMin = bb.widthMin / bb.aspectRatio: bb.aspectRatio && bb.heightMin && (bb.widthMin = bb.heightMin * bb.aspectRatio),
                            m(function() {
                                var a = y();
                                h(f[bb.optionsPrefix + "Options"]).assign(d, bb),
                                a && x()
                            })
                    }
                    function T(e) {
                        var g = a.isString(e) ? e: b;
                        return a.isUndefined(g) || c(nb, g) === !1 ? !1 : void m(function() {
                                var a = null !== e.match(/\^?before/) && "before" === e.match(/\^?before/)[0] ? e: e.replace(/\^?on/, "").lcfirst();
                                fb[g](),
                                    d.$emit(bb.eventPrefix + "." + a, fb.$data, fb, d.$eval(f.cropData))
                            },
                            0)
                    }
                    function U() {
                        m(function() {
                            var a = {
                                width: Math.round(fb.$data.width),
                                height: Math.round(fb.$data.height),
                                top: Math.round(fb.$data.top),
                                left: Math.round(fb.$data.left),
                                base64: fb.$data.base64
                            };
                            w(),
                                h(f.croppable).assign(d, a),
                            kb && v()
                        })
                    }
                    function V() {
                        var a, b;
                        if (!lb) if (fb.$selecting || fb.$moving || !N()) U();
                        else if (bb.autoCropping) {
                            a = l[0].createElement("canvas"),
                                a.width = fb.$data.width,
                                a.height = fb.$data.height,
                                b = a.getContext("2d"),
                                b.drawImage(e[0], fb.$data.left, fb.$data.top, fb.$data.width, fb.$data.height, 0, 0, fb.$data.width, fb.$data.height);
                            try {
                                fb.$data.base64 = a.toDataURL("image/" + bb.imageType)
                            } catch(c) {
                                j.error(c.message)
                            } finally {
                                return U(),
                                    fb.$data.base64
                            }
                        }
                    }
                    function W() {
                        T("beforeImageLoad"),
                            fb.$loading = !0;
                        var a = i.defer(),
                            b = new Image;
                        return b.onload = function() {
                            fb.$imgInfo.originalWidth = b.width,
                                fb.$imgInfo.originalHeight = b.height,
                                a.resolve(),
                                fb.$loading = !1,
                                T("onImageLoad")
                        },
                            b.src = f.ngSrc,
                            a.promise
                    }
                    function X(b, c) {
                        if (b = b || o, a.isObject(b)) bb = a.extend({},
                            o, b);
                        else if (a.isDefined(c) && a.isString(b)) bb[b] = c;
                        else if (a.isString(b) && a.isUndefined(c)) return bb[b];
                        return S(),
                        lb || p(),
                            fb
                    }
                    function Y() {
                        a.forEach(nb,
                            function(b) {
                                fb[b] = a.isDefined(f[bb.optionsPrefix + b.ucfirst()]) ?
                                    function() {
                                        d.$eval(f[bb.optionsPrefix + b.ucfirst()], {
                                            $data: fb.$data,
                                            $croppable: fb
                                        })
                                    }: a.noop
                            })
                    }
                    function Z() {
                        return N() && (fb.$data = {
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0,
                            base64: null
                        },
                            Q(), p("onReset")),
                            fb
                    }
                    function $(b, c) {
                        return a.isUndefined(b) ? fb: (a.isArray(b) ? (fb.$data.top = a.isDefined(b[0]) && a.isNumber(b[0]) ? b[0] : fb.$data.top, fb.$data.left = a.isDefined(b[1]) && a.isNumber(b[1]) ? b[1] : fb.$data.left, fb.$data.width = a.isDefined(b[2]) && a.isNumber(b[2]) ? b[2] : fb.$data.width, fb.$data.height = a.isDefined(b[3]) && a.isNumber(b[3]) ? b[3] : fb.$data.height) : a.isObject(b) ? fb.$data = a.extend({},
                            fb.$data, b) : a.isString(b) && a.isNumber(c) && (fb.$data[b] = c), Q(), _ = {
                            x: fb.$measurements.left,
                            y: fb.$measurements.top
                        },
                            R(), fb)
                    }
                    var _, ab, bb, cb, db, eb, fb = this,
                        gb = {},
                        hb = d.$new(!0),
                        ib = !0,
                        jb = !0,
                        kb = !1,
                        lb = !1,
                        mb = [],
                        nb = ["onSelectStart", "onSelect", "onSelectEnd", "onMoveStart", "onMove", "onMoveEnd", "onEnable", "onDisable", "onReset", "onUpdate", "onDestroy", "onReady", "beforeImageLoad", "onImageLoad"];
                    fb.$name,
                        fb.$selecting = !1,
                        fb.$moving = !1,
                        fb.$loading = !1,
                        fb.$measurements = {
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0
                        },
                        fb.$data = {
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0,
                            base64: null
                        },
                        fb.$imgInfo = {},
                        fb.$active = !1,
                        fb.$hasSelection = !1,
                        fb.$initialized = !1,
                        fb.$cropContainer,
                        fb.$cropper,
                        fb.$cropArea,
                        fb.$overlayedImg,
                        fb.$cropHandles,
                        fb.$centerHandles,
                        fb.$sizeHint,
                        fb.$ruleOfThirds,
                        e.on("$destroy", u),
                        fb.$options = X,
                        fb.$clear = Z,
                        fb.$toggle = function() {
                            return fb.$active ? fb.disableCrop() : fb.enableCrop()
                        },
                        fb.$cropIt = function(b, c) {
                            return a.isDefined(b) ? void fb.setArea(b, c) : fb.makeCropData()
                        },
                        fb.$destroy = function() {
                            return u(),
                                fb
                        },
                        fb.$init = function(b) {
                            return kb ? void j.info("The cropper has already been initialized!") : (X(b), Y(), a.isDefined(f.ngSrc) ? W().then(function() {
                                $(d.$eval(f.croppable)),
                                    C(),
                                    z(),
                                    A(),
                                    T("onReady"),
                                    m(function() {
                                        kb = fb.$initialized = !0
                                    })
                            }) : (A(), m(function() {
                                kb = fb.$initialized = !0
                            })), fb)
                        }
                }]),
            d.directive("croppable", ["$parse", "$interpolate", "CroppableDefaults",
                function(b, c, d) {
                    return {
                        restict: "A",
                        priority: 100,
                        controller: "CroppableController",
                        link: {
                            pre: function(a, b, c, d) {
                                d.$srcAttr = c.ngSrc
                            },
                            post: function(e, f, g, h) {
                                if ("IMG" !== f[0].tagName) throw "The croppable element must be an image tag!";
                                if (!g.hasOwnProperty("ngSrc") && !g.hasOwnProperty("src")) throw "The image tag has no ngSrc or src attribute, croppable directive can't function without this";
                                var i = {};
                                g.hasOwnProperty("cropOptions") && a.isDefined(g.cropOptions) && a.isObject(e.$eval(g.cropOptions)) && (i = a.extend(i, e.$eval(g.cropOptions)));
                                for (var j in d) a.isDefined(e.$eval(g[d.optionsPrefix + j.ucfirst()])) && (i[j] = e.$eval(g[d.optionsPrefix + j.ucfirst()]));
                                h.$init(i),
                                g.hasOwnProperty(h.$options("optionsPrefix") + "Name") && a.isString(g[h.$options("optionsPrefix") + "Name"]) && (h.$name = c(g[h.$options("optionsPrefix") + "Name"])(e), b(d.directiveName + "." + h.$name).assign(e, h))
                            }
                        }
                    }
                }])
    } (window.angular),
    function() {
        "use strict";
        var a = {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            BACKSPACE: 8,
            DELETE: 46,
            COMMAND: 91,
            MAP: {
                91 : "COMMAND",
                8 : "BACKSPACE",
                9 : "TAB",
                13 : "ENTER",
                16 : "SHIFT",
                17 : "CTRL",
                18 : "ALT",
                19 : "PAUSEBREAK",
                20 : "CAPSLOCK",
                27 : "ESC",
                32 : "SPACE",
                33 : "PAGE_UP",
                34 : "PAGE_DOWN",
                35 : "END",
                36 : "HOME",
                37 : "LEFT",
                38 : "UP",
                39 : "RIGHT",
                40 : "DOWN",
                43 : "+",
                44 : "PRINTSCREEN",
                45 : "INSERT",
                46 : "DELETE",
                48 : "0",
                49 : "1",
                50 : "2",
                51 : "3",
                52 : "4",
                53 : "5",
                54 : "6",
                55 : "7",
                56 : "8",
                57 : "9",
                59 : ";",
                61 : "=",
                65 : "A",
                66 : "B",
                67 : "C",
                68 : "D",
                69 : "E",
                70 : "F",
                71 : "G",
                72 : "H",
                73 : "I",
                74 : "J",
                75 : "K",
                76 : "L",
                77 : "M",
                78 : "N",
                79 : "O",
                80 : "P",
                81 : "Q",
                82 : "R",
                83 : "S",
                84 : "T",
                85 : "U",
                86 : "V",
                87 : "W",
                88 : "X",
                89 : "Y",
                90 : "Z",
                96 : "0",
                97 : "1",
                98 : "2",
                99 : "3",
                100 : "4",
                101 : "5",
                102 : "6",
                103 : "7",
                104 : "8",
                105 : "9",
                106 : "*",
                107 : "+",
                109 : "-",
                110 : ".",
                111 : "/",
                112 : "F1",
                113 : "F2",
                114 : "F3",
                115 : "F4",
                116 : "F5",
                117 : "F6",
                118 : "F7",
                119 : "F8",
                120 : "F9",
                121 : "F10",
                122 : "F11",
                123 : "F12",
                144 : "NUMLOCK",
                145 : "SCROLLLOCK",
                186 : ";",
                187 : "=",
                188 : "SPACE",
                189 : "-",
                190 : ".",
                191 : "/",
                192 : "`",
                219 : "[",
                220 : "\\",
                221 : "]",
                222 : "'"
            },
            isControl: function(b) {
                var c = b.which;
                switch (c) {
                    case a.COMMAND:
                    case a.SHIFT:
                    case a.CTRL:
                    case a.ALT:
                        return ! 0
                }
                return b.metaKey ? !0 : !1
            },
            isFunctionKey: function(a) {
                return a = a.which ? a.which: a,
                a >= 112 && 123 >= a
            },
            isVerticalMovement: function(b) {
                return~ [a.UP, a.DOWN].indexOf(b)
            },
            isHorizontalMovement: function(b) {
                return~ [a.LEFT, a.RIGHT, a.BACKSPACE, a.DELETE].indexOf(b)
            }
        };
        void 0 === angular.element.prototype.querySelectorAll && (angular.element.prototype.querySelectorAll = function(a) {
            return angular.element(this[0].querySelectorAll(a))
        }),
            angular.module("ui.select", []).constant("uiSelectConfig", {
                theme: "bootstrap",
                searchEnabled: !0,
                placeholder: "",
                refreshDelay: 1e3,
                closeOnSelect: !0
            }).service("uiSelectMinErr",
                function() {
                    var a = angular.$$minErr("ui.select");
                    return function() {
                        var b = a.apply(this, arguments),
                            c = b.message.replace(new RegExp("\nhttp://errors.angularjs.org/.*"), "");
                        return new Error(c)
                    }
                }).service("RepeatParser", ["uiSelectMinErr", "$parse",
                function(a, b) {
                    var c = this;
                    c.parse = function(c) {
                        var d = c.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                        if (!d) throw a("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", c);
                        return {
                            itemName: d[2],
                            source: b(d[3]),
                            trackByExp: d[4],
                            modelMapper: b(d[1] || d[2])
                        }
                    },
                        c.getGroupNgRepeatExpression = function() {
                            return "$group in $select.groups"
                        },
                        c.getNgRepeatExpression = function(a, b, c, d) {
                            var e = a + " in " + (d ? "$group.items": b);
                            return c && (e += " track by " + c),
                                e
                        }
                }]).controller("uiSelectCtrl", ["$scope", "$element", "$timeout", "$filter", "RepeatParser", "uiSelectMinErr", "uiSelectConfig",
                function(b, c, d, e, f, g, h) {
                    function i() { (o.resetSearchInput || void 0 === o.resetSearchInput && h.resetSearchInput) && (o.search = p, o.selected && o.items.length && !o.multiple && (o.activeIndex = o.items.indexOf(o.selected)))
                    }
                    function j(b) {
                        var c = !0;
                        switch (b) {
                            case a.DOWN:
                                !o.open && o.multiple ? o.activate(!1, !0) : o.activeIndex < o.items.length - 1 && o.activeIndex++;
                                break;
                            case a.UP:
                                !o.open && o.multiple ? o.activate(!1, !0) : (o.activeIndex > 0 || 0 === o.search.length && o.tagging.isActivated) && o.activeIndex--;
                                break;
                            case a.TAB:
                                (!o.multiple || o.open) && o.select(o.items[o.activeIndex], !0);
                                break;
                            case a.ENTER:
                                o.open ? o.select(o.items[o.activeIndex]) : o.activate(!1, !0);
                                break;
                            case a.ESC:
                                o.close();
                                break;
                            default:
                                c = !1
                        }
                        return c
                    }
                    function k(b) {
                        function c() {
                            switch (b) {
                                case a.LEFT:
                                    return~o.activeMatchIndex ? j: g;
                                case a.RIGHT:
                                    return~o.activeMatchIndex && h !== g ? i: (o.activate(), !1);
                                case a.BACKSPACE:
                                    return~o.activeMatchIndex ? (o.removeChoice(h), j) : g;
                                case a.DELETE:
                                    return~o.activeMatchIndex ? (o.removeChoice(o.activeMatchIndex), h) : !1
                            }
                        }
                        var d = m(q[0]),
                            e = o.selected.length,
                            f = 0,
                            g = e - 1,
                            h = o.activeMatchIndex,
                            i = o.activeMatchIndex + 1,
                            j = o.activeMatchIndex - 1,
                            k = h;
                        return d > 0 || o.search.length && b == a.RIGHT ? !1 : (o.close(), k = c(), o.activeMatchIndex = o.selected.length && k !== !1 ? Math.min(g, Math.max(f, k)) : -1, !0)
                    }
                    function l(a, b) {
                        for (var c = angular.copy(a), d = -1, e = 0; e < c.length; e++) if (void 0 === o.tagging.fct) c[e] + " " + o.taggingLabel === b && (d = e);
                        else {
                            var f = c[e];
                            f.isTag = !0,
                            angular.equals(f, b) && (d = e)
                        }
                        return d
                    }
                    function m(a) {
                        return angular.isNumber(a.selectionStart) ? a.selectionStart: a.value.length
                    }
                    function n() {
                        var a = c.querySelectorAll(".ui-select-choices-content"),
                            b = a.querySelectorAll(".ui-select-choices-row");
                        if (b.length < 1) throw g("choices", "Expected multiple .ui-select-choices-row but got '{0}'.", b.length);
                        var d = b[o.activeIndex],
                            e = d.offsetTop + d.clientHeight - a[0].scrollTop,
                            f = a[0].offsetHeight;
                        e > f ? a[0].scrollTop += e - f: e < d.clientHeight && (o.isGrouped && 0 === o.activeIndex ? a[0].scrollTop = 0 : a[0].scrollTop -= d.clientHeight - e)
                    }
                    var o = this,
                        p = "";
                    o.placeholder = void 0,
                        o.search = p,
                        o.activeIndex = 0,
                        o.activeMatchIndex = -1,
                        o.items = [],
                        o.selected = void 0,
                        o.open = !1,
                        o.focus = !1,
                        o.focusser = void 0,
                        o.disabled = void 0,
                        o.searchEnabled = void 0,
                        o.resetSearchInput = void 0,
                        o.refreshDelay = void 0,
                        o.multiple = !1,
                        o.disableChoiceExpression = void 0,
                        o.tagging = {
                            isActivated: !1,
                            fct: void 0
                        },
                        o.taggingTokens = {
                            isActivated: !1,
                            tokens: void 0
                        },
                        o.lockChoiceExpression = void 0,
                        o.closeOnSelect = !0,
                        o.clickTriggeredSelect = !1,
                        o.$filter = e,
                        o.isEmpty = function() {
                            return angular.isUndefined(o.selected) || null === o.selected || "" === o.selected
                        };
                    var q = c.querySelectorAll("input.ui-select-search");
                    if (1 !== q.length) throw g("searchInput", "Expected 1 input.ui-select-search but got '{0}'.", q.length);
                    o.activate = function(a, b) {
                        o.disabled || o.open || (b || i(), o.focusser.prop("disabled", !0), o.open = !0, o.activeMatchIndex = -1, o.activeIndex = o.activeIndex >= o.items.length ? 0 : o.activeIndex, -1 === o.activeIndex && o.taggingLabel !== !1 && (o.activeIndex = 0), d(function() {
                            o.search = a || o.search,
                                q[0].focus()
                        }))
                    },
                        o.findGroupByName = function(a) {
                            return o.groups && o.groups.filter(function(b) {
                                    return b.name === a
                                })[0]
                        },
                        o.parseRepeatAttr = function(a, c) {
                            function d(a) {
                                o.groups = [],
                                    angular.forEach(a,
                                        function(a) {
                                            var d = b.$eval(c),
                                                e = angular.isFunction(d) ? d(a) : a[d],
                                                f = o.findGroupByName(e);
                                            f ? f.items.push(a) : o.groups.push({
                                                name: e,
                                                items: [a]
                                            })
                                        }),
                                    o.items = [],
                                    o.groups.forEach(function(a) {
                                        o.items = o.items.concat(a.items)
                                    })
                            }
                            function e(a) {
                                o.items = a
                            }
                            var h = c ? d: e;
                            o.parserResult = f.parse(a),
                                o.isGrouped = !!c,
                                o.itemProperty = o.parserResult.itemName,
                                b.$watchCollection(o.parserResult.source,
                                    function(a) {
                                        if (void 0 === a || null === a) o.items = [];
                                        else {
                                            if (!angular.isArray(a)) throw g("items", "Expected an array but got '{0}'.", a);
                                            if (o.multiple) {
                                                var b = a.filter(function(a) {
                                                    return o.selected.indexOf(a) < 0
                                                });
                                                h(b)
                                            } else h(a);
                                            o.ngModel.$modelValue = null
                                        }
                                    }),
                            o.multiple && b.$watchCollection("$select.selected",
                                function(a) {
                                    var c = o.parserResult.source(b);
                                    if (a.length) {
                                        if (void 0 !== c) {
                                            var d = c.filter(function(b) {
                                                return a.indexOf(b) < 0
                                            });
                                            h(d)
                                        }
                                    } else h(c);
                                    o.sizeSearchInput()
                                })
                        };
                    var r;
                    o.refresh = function(a) {
                        void 0 !== a && (r && d.cancel(r), r = d(function() {
                                b.$eval(a)
                            },
                            o.refreshDelay))
                    },
                        o.setActiveItem = function(a) {
                            o.activeIndex = o.items.indexOf(a)
                        },
                        o.isActive = function(a) {
                            if (!o.open) return ! 1;
                            var b = o.items.indexOf(a[o.itemProperty]),
                                c = b === o.activeIndex;
                            return ! c || 0 > b && o.taggingLabel !== !1 || 0 > b && o.taggingLabel === !1 ? !1 : (c && !angular.isUndefined(o.onHighlightCallback) && a.$eval(o.onHighlightCallback), c)
                        },
                        o.isDisabled = function(a) {
                            if (o.open) {
                                var b, c = o.items.indexOf(a[o.itemProperty]),
                                    d = !1;
                                return c >= 0 && !angular.isUndefined(o.disableChoiceExpression) && (b = o.items[c], d = !!a.$eval(o.disableChoiceExpression), b._uiSelectChoiceDisabled = d),
                                    d
                            }
                        },
                        o.select = function(a, c, d) {
                            if (void 0 === a || !a._uiSelectChoiceDisabled) {
                                if (!o.items && !o.search) return;
                                if (!a || !a._uiSelectChoiceDisabled) {
                                    if (o.tagging.isActivated) {
                                        if (o.taggingLabel === !1) if (o.activeIndex < 0) {
                                            if (a = void 0 !== o.tagging.fct ? o.tagging.fct(o.search) : o.search, angular.equals(o.items[0], a)) return
                                        } else a = o.items[o.activeIndex];
                                        else if (0 === o.activeIndex) {
                                            if (void 0 === a) return;
                                            a = void 0 !== o.tagging.fct ? o.tagging.fct(o.search) : a.replace(o.taggingLabel, "")
                                        }
                                        if (o.selected && o.selected.filter(function(b) {
                                                return angular.equals(b, a)
                                            }).length > 0) return void o.close(c)
                                    }
                                    var e = {};
                                    e[o.parserResult.itemName] = a,
                                        o.onSelectCallback(b, {
                                            $item: a,
                                            $model: o.parserResult.modelMapper(b, e)
                                        }),
                                        o.multiple ? (o.selected.push(a), o.sizeSearchInput()) : o.selected = a,
                                    (!o.multiple || o.closeOnSelect) && o.close(c),
                                    d && "click" === d.type && (o.clickTriggeredSelect = !0)
                                }
                            }
                        },
                        o.close = function(a) {
                            o.open && (i(), o.open = !1, o.multiple || d(function() {
                                    o.focusser.prop("disabled", !1),
                                    a || o.focusser[0].focus()
                                },
                                0, !1))
                        },
                        o.toggle = function(a) {
                            o.open ? o.close() : o.activate(),
                                a.preventDefault(),
                                a.stopPropagation()
                        },
                        o.isLocked = function(a, b) {
                            var c, d = o.selected[b];
                            return d && !angular.isUndefined(o.lockChoiceExpression) && (c = !!a.$eval(o.lockChoiceExpression), d._uiSelectChoiceLocked = c),
                                c
                        },
                        o.removeChoice = function(a) {
                            var c = o.selected[a];
                            if (!c._uiSelectChoiceLocked) {
                                var d = {};
                                d[o.parserResult.itemName] = c,
                                    o.selected.splice(a, 1),
                                    o.activeMatchIndex = -1,
                                    o.sizeSearchInput(),
                                    o.onRemoveCallback(b, {
                                        $item: c,
                                        $model: o.parserResult.modelMapper(b, d)
                                    })
                            }
                        },
                        o.getPlaceholder = function() {
                            return o.multiple && o.selected.length ? void 0 : o.placeholder
                        };
                    var s;
                    o.sizeSearchInput = function() {
                        var a = q[0],
                            c = q.parent().parent()[0];
                        q.css("width", "10px");
                        var e = function() {
                            var b = c.clientWidth - a.offsetLeft - 10;
                            50 > b && (b = c.clientWidth),
                                q.css("width", b + "px")
                        };
                        d(function() {
                                0 !== c.clientWidth || s ? s || e() : s = b.$watch(function() {
                                        return c.clientWidth
                                    },
                                    function(a) {
                                        0 !== a && (e(), s(), s = null)
                                    })
                            },
                            0, !1)
                    },
                        q.on("keydown",
                            function(c) {
                                var d = c.which;
                                b.$apply(function() {
                                    var b = !1;
                                    if (o.multiple && a.isHorizontalMovement(d) && (b = k(d)), !b && (o.items.length > 0 || o.tagging.isActivated) && (b = j(d), o.taggingTokens.isActivated)) for (var e = 0; e < o.taggingTokens.tokens.length; e++) o.taggingTokens.tokens[e] === a.MAP[c.keyCode] && o.search.length > 0 && (o.select(null, !0), q.triggerHandler("tagged"));
                                    b && d != a.TAB && (c.preventDefault(), c.stopPropagation())
                                }),
                                a.isVerticalMovement(d) && o.items.length > 0 && n()
                            }),
                        q.on("keyup",
                            function(c) {
                                if (a.isVerticalMovement(c.which) || b.$evalAsync(function() {
                                        o.activeIndex = o.taggingLabel === !1 ? -1 : 0
                                    }), o.tagging.isActivated && o.search.length > 0) {
                                    if (c.which === a.TAB || a.isControl(c) || a.isFunctionKey(c) || c.which === a.ESC || a.isVerticalMovement(c.which)) return;
                                    if (o.activeIndex = o.taggingLabel === !1 ? -1 : 0, o.taggingLabel === !1) return;
                                    var d, e, f, g, h = angular.copy(o.items),
                                        i = angular.copy(o.items),
                                        j = !1,
                                        k = -1;
                                    if (void 0 !== o.tagging.fct) {
                                        if (f = o.$filter("filter")(h, {
                                                isTag: !0
                                            }), f.length > 0 && (g = f[0]), h.length > 0 && g && (j = !0, h = h.slice(1, h.length), i = i.slice(1, i.length)), d = o.tagging.fct(o.search), d.isTag = !0, i.filter(function(a) {
                                                return angular.equals(a, o.tagging.fct(o.search))
                                            }).length > 0) return
                                    } else {
                                        if (f = o.$filter("filter")(h,
                                                function(a) {
                                                    return a.match(o.taggingLabel)
                                                }), f.length > 0 && (g = f[0]), e = h[0], void 0 !== e && h.length > 0 && g && (j = !0, h = h.slice(1, h.length), i = i.slice(1, i.length)), d = o.search + " " + o.taggingLabel, l(o.selected, o.search) > -1) return;
                                        if (i.filter(function(a) {
                                                return a.toUpperCase() === o.search.toUpperCase()
                                            }).length > 0) return void(j && (h = i, b.$evalAsync(function() {
                                            o.activeIndex = 0,
                                                o.items = h
                                        })));
                                        if (o.selected.filter(function(a) {
                                                return a.toUpperCase() === o.search.toUpperCase()
                                            }).length > 0) return void(j && (o.items = i.slice(1, i.length)))
                                    }
                                    j && (k = l(o.selected, d)),
                                        k > -1 ? h = h.slice(k + 1, h.length - 1) : (h = [], h.push(d), h = h.concat(i)),
                                        b.$evalAsync(function() {
                                            o.activeIndex = 0,
                                                o.items = h
                                        })
                                }
                            }),
                        q.on("tagged",
                            function() {
                                d(function() {
                                    i()
                                })
                            }),
                        q.on("blur",
                            function() {
                                d(function() {
                                    o.activeMatchIndex = -1
                                })
                            }),
                        b.$on("$destroy",
                            function() {
                                q.off("keyup keydown tagged blur")
                            })
                }]).directive("uiSelect", ["$document", "uiSelectConfig", "uiSelectMinErr", "$compile", "$parse",
                function(b, c, d, e, f) {
                    return {
                        restrict: "EA",
                        templateUrl: function(a, b) {
                            var d = b.theme || c.theme;
                            return d + (angular.isDefined(b.multiple) ? "/select-multiple.tpl.html": "/select.tpl.html")
                        },
                        replace: !0,
                        transclude: !0,
                        require: ["uiSelect", "ngModel"],
                        scope: !0,
                        controller: "uiSelectCtrl",
                        controllerAs: "$select",
                        link: function(g, h, i, j, k) {
                            function l(a) {
                                var b = !1;
                                b = window.jQuery ? window.jQuery.contains(h[0], a.target) : h[0].contains(a.target),
                                b || m.clickTriggeredSelect || (m.close(), g.$digest()),
                                    m.clickTriggeredSelect = !1
                            }
                            var m = j[0],
                                n = j[1],
                                o = h.querySelectorAll("input.ui-select-search");
                            m.multiple = angular.isDefined(i.multiple) && ("" === i.multiple || "multiple" === i.multiple.toLowerCase() || "true" === i.multiple.toLowerCase()),
                                m.closeOnSelect = angular.isDefined(i.closeOnSelect) && "false" === i.closeOnSelect.toLowerCase() ? !1 : c.closeOnSelect,
                                m.onSelectCallback = f(i.onSelect),
                                m.onRemoveCallback = f(i.onRemove),
                                n.$parsers.unshift(function(a) {
                                    var b, c = {};
                                    if (m.multiple) {
                                        for (var d = [], e = m.selected.length - 1; e >= 0; e--) c = {},
                                            c[m.parserResult.itemName] = m.selected[e],
                                            b = m.parserResult.modelMapper(g, c),
                                            d.unshift(b);
                                        return d
                                    }
                                    return c = {},
                                        c[m.parserResult.itemName] = a,
                                        b = m.parserResult.modelMapper(g, c)
                                }),
                                n.$formatters.unshift(function(a) {
                                    var b, c = m.parserResult.source(g, {
                                            $select: {
                                                search: ""
                                            }
                                        }),
                                        d = {};
                                    if (c) {
                                        if (m.multiple) {
                                            var e = [],
                                                f = function(a, c) {
                                                    if (a && a.length) {
                                                        for (var f = a.length - 1; f >= 0; f--) if (d[m.parserResult.itemName] = a[f], b = m.parserResult.modelMapper(g, d), b == c) return e.unshift(a[f]),
                                                            !0;
                                                        return ! 1
                                                    }
                                                };
                                            if (!a) return e;
                                            for (var h = a.length - 1; h >= 0; h--) f(m.selected, a[h]) || f(c, a[h]);
                                            return e
                                        }
                                        var i = function(c) {
                                            return d[m.parserResult.itemName] = c,
                                                b = m.parserResult.modelMapper(g, d),
                                            b == a
                                        };
                                        if (m.selected && i(m.selected)) return m.selected;
                                        for (var j = c.length - 1; j >= 0; j--) if (i(c[j])) return c[j]
                                    }
                                    return a
                                }),
                                m.ngModel = n;
                            var p = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' aria-haspopup='true' role='button' />");
                            i.tabindex && i.$observe("tabindex",
                                function(a) {
                                    m.multiple ? o.attr("tabindex", a) : p.attr("tabindex", a),
                                        h.removeAttr("tabindex")
                                }),
                                e(p)(g),
                                m.focusser = p,
                            m.multiple || (h.append(p), p.bind("focus",
                                function() {
                                    g.$evalAsync(function() {
                                        m.focus = !0
                                    })
                                }), p.bind("blur",
                                function() {
                                    g.$evalAsync(function() {
                                        m.focus = !1
                                    })
                                }), p.bind("keydown",
                                function(b) {
                                    return b.which === a.BACKSPACE ? (b.preventDefault(), b.stopPropagation(), m.select(void 0), void g.$apply()) : void(b.which === a.TAB || a.isControl(b) || a.isFunctionKey(b) || b.which === a.ESC || ((b.which == a.DOWN || b.which == a.UP || b.which == a.ENTER || b.which == a.SPACE) && (b.preventDefault(), b.stopPropagation(), m.activate()), g.$digest()))
                                }), p.bind("keyup input",
                                function(b) {
                                    b.which === a.TAB || a.isControl(b) || a.isFunctionKey(b) || b.which === a.ESC || b.which == a.ENTER || b.which === a.BACKSPACE || (m.activate(p.val()), p.val(""), g.$digest())
                                })),
                                g.$watch("searchEnabled",
                                    function() {
                                        var a = g.$eval(i.searchEnabled);
                                        m.searchEnabled = void 0 !== a ? a: c.searchEnabled
                                    }),
                                i.$observe("disabled",
                                    function() {
                                        m.disabled = void 0 !== i.disabled ? i.disabled: !1
                                    }),
                                i.$observe("resetSearchInput",
                                    function() {
                                        var a = g.$eval(i.resetSearchInput);
                                        m.resetSearchInput = void 0 !== a ? a: !0
                                    }),
                                i.$observe("tagging",
                                    function() {
                                        if (void 0 !== i.tagging) {
                                            var a = g.$eval(i.tagging);
                                            m.tagging = {
                                                isActivated: !0,
                                                fct: a !== !0 ? a: void 0
                                            }
                                        } else m.tagging = {
                                            isActivated: !1,
                                            fct: void 0
                                        }
                                    }),
                                i.$observe("taggingLabel",
                                    function() {
                                        void 0 !== i.tagging && void 0 !== i.taggingLabel && (m.taggingLabel = "false" === i.taggingLabel ? !1 : void 0 !== i.taggingLabel ? i.taggingLabel: "(new)")
                                    }),
                                i.$observe("taggingTokens",
                                    function() {
                                        if (void 0 !== i.tagging) {
                                            var a = void 0 !== i.taggingTokens ? i.taggingTokens.split("|") : [",", "ENTER"];
                                            m.taggingTokens = {
                                                isActivated: !0,
                                                tokens: a
                                            }
                                        }
                                    }),
                                m.multiple ? (g.$watchCollection(function() {
                                        return n.$modelValue
                                    },
                                    function(a, b) {
                                        b != a && (n.$modelValue = null)
                                    }), g.$watchCollection("$select.selected",
                                    function() {
                                        n.$setViewValue(Date.now())
                                    }), p.prop("disabled", !0)) : g.$watch("$select.selected",
                                    function(a) {
                                        n.$viewValue !== a && n.$setViewValue(a)
                                    }),
                                n.$render = function() {
                                    if (m.multiple && !angular.isArray(n.$viewValue)) {
                                        if (!angular.isUndefined(n.$viewValue) && null !== n.$viewValue) throw d("multiarr", "Expected model value to be array but got '{0}'", n.$viewValue);
                                        m.selected = []
                                    }
                                    m.selected = n.$viewValue
                                },
                                b.on("click", l),
                                g.$on("$destroy",
                                    function() {
                                        b.off("click", l)
                                    }),
                                k(g,
                                    function(a) {
                                        var b = angular.element("<div>").append(a),
                                            c = b.querySelectorAll(".ui-select-match");
                                        if (c.removeAttr("ui-select-match"), 1 !== c.length) throw d("transcluded", "Expected 1 .ui-select-match but got '{0}'.", c.length);
                                        h.querySelectorAll(".ui-select-match").replaceWith(c);
                                        var e = b.querySelectorAll(".ui-select-choices");
                                        if (e.removeAttr("ui-select-choices"), 1 !== e.length) throw d("transcluded", "Expected 1 .ui-select-choices but got '{0}'.", e.length);
                                        h.querySelectorAll(".ui-select-choices").replaceWith(e)
                                    })
                        }
                    }
                }]).directive("uiSelectChoices", ["uiSelectConfig", "RepeatParser", "uiSelectMinErr", "$compile",
                function(a, b, c, d) {
                    return {
                        restrict: "EA",
                        require: "^uiSelect",
                        replace: !0,
                        transclude: !0,
                        templateUrl: function(b) {
                            var c = b.parent().attr("theme") || a.theme;
                            return c + "/choices.tpl.html"
                        },
                        compile: function(e, f) {
                            if (!f.repeat) throw c("repeat", "Expected 'repeat' expression.");
                            return function(e, f, g, h, i) {
                                var j = g.groupBy;
                                if (h.parseRepeatAttr(g.repeat, j), h.disableChoiceExpression = g.uiDisableChoice, h.onHighlightCallback = g.onHighlight, j) {
                                    var k = f.querySelectorAll(".ui-select-choices-group");
                                    if (1 !== k.length) throw c("rows", "Expected 1 .ui-select-choices-group but got '{0}'.", k.length);
                                    k.attr("ng-repeat", b.getGroupNgRepeatExpression())
                                }
                                var l = f.querySelectorAll(".ui-select-choices-row");
                                if (1 !== l.length) throw c("rows", "Expected 1 .ui-select-choices-row but got '{0}'.", l.length);
                                l.attr("ng-repeat", b.getNgRepeatExpression(h.parserResult.itemName, "$select.items", h.parserResult.trackByExp, j)).attr("ng-if", "$select.open").attr("ng-mouseenter", "$select.setActiveItem(" + h.parserResult.itemName + ")").attr("ng-click", "$select.select(" + h.parserResult.itemName + ",false,$event)");
                                var m = f.querySelectorAll(".ui-select-choices-row-inner");
                                if (1 !== m.length) throw c("rows", "Expected 1 .ui-select-choices-row-inner but got '{0}'.", m.length);
                                m.attr("uis-transclude-append", ""),
                                    d(f, i)(e),
                                    e.$watch("$select.search",
                                        function(a) {
                                            a && !h.open && h.multiple && h.activate(!1, !0),
                                                h.activeIndex = h.tagging.isActivated ? -1 : 0,
                                                h.refresh(g.refresh)
                                        }),
                                    g.$observe("refreshDelay",
                                        function() {
                                            var b = e.$eval(g.refreshDelay);
                                            h.refreshDelay = void 0 !== b ? b: a.refreshDelay
                                        })
                            }
                        }
                    }
                }]).directive("uisTranscludeAppend",
                function() {
                    return {
                        link: function(a, b, c, d, e) {
                            e(a,
                                function(a) {
                                    b.append(a)
                                })
                        }
                    }
                }).directive("uiSelectMatch", ["uiSelectConfig",
                function(a) {
                    return {
                        restrict: "EA",
                        require: "^uiSelect",
                        replace: !0,
                        transclude: !0,
                        templateUrl: function(b) {
                            var c = b.parent().attr("theme") || a.theme,
                                d = b.parent().attr("multiple");
                            return c + (d ? "/match-multiple.tpl.html": "/match.tpl.html")
                        },
                        link: function(b, c, d, e) {
                            e.lockChoiceExpression = d.uiLockChoice,
                                d.$observe("placeholder",
                                    function(b) {
                                        e.placeholder = void 0 !== b ? b: a.placeholder
                                    }),
                                e.allowClear = angular.isDefined(d.allowClear) ? "" === d.allowClear ? !0 : "true" === d.allowClear.toLowerCase() : !1,
                            e.multiple && e.sizeSearchInput()
                        }
                    }
                }]).filter("highlight",
                function() {
                    function a(a) {
                        return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
                    }
                    return function(b, c) {
                        return c && b ? b.replace(new RegExp(a(c), "gi"), '<span class="ui-select-highlight">$&</span>') : b
                    }
                })
    } (),
    angular.module("ui.select").run(["$templateCache",
        function(a) {
            a.put("bootstrap/choices.tpl.html", '<ul class="ui-select-choices ui-select-choices-content dropdown-menu" role="menu" aria-labelledby="dLabel" ng-show="$select.items.length > 0"><li class="ui-select-choices-group"><div class="divider" ng-show="$select.isGrouped && $index > 0"></div><div ng-show="$select.isGrouped" class="ui-select-choices-group-label dropdown-header" ng-bind-html="$group.name"></div><div class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}"><a href="javascript:void(0)" class="ui-select-choices-row-inner"></a></div></li></ul>'),
                a.put("bootstrap/match-multiple.tpl.html", '<span class="ui-select-match"><span ng-repeat="$item in $select.selected"><span style="margin-right: 3px;" class="ui-select-match-item btn btn-default btn-xs" tabindex="-1" type="button" ng-disabled="$select.disabled" ng-click="$select.activeMatchIndex = $index;" ng-class="{\'btn-primary\':$select.activeMatchIndex === $index}"><span class="close ui-select-match-close" ng-hide="$select.disabled" ng-click="$select.removeChoice($index)">&nbsp;&times;</span> <span uis-transclude-append=""></span></span></span></span>'),
                a.put("bootstrap/match.tpl.html", '<button type="button" class="btn btn-default form-control ui-select-match" tabindex="-1" ng-hide="$select.open" ng-disabled="$select.disabled" ng-class="{\'btn-default-focus\':$select.focus}" ;="" ng-click="$select.activate()"><span ng-show="$select.isEmpty()" class="text-muted">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" ng-transclude=""></span> <span class="caret ui-select-toggle" ng-click="$select.toggle($event)"></span></button>'),
                a.put("bootstrap/select-multiple.tpl.html", '<div class="ui-select-multiple ui-select-bootstrap dropdown form-control" ng-class="{open: $select.open}"><div><div class="ui-select-match"></div><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="ui-select-search input-xs" placeholder="{{$select.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-click="$select.activate()" ng-model="$select.search"></div><div class="ui-select-choices"></div></div>'),
                a.put("bootstrap/select.tpl.html", '<div class="ui-select-bootstrap dropdown" ng-class="{open: $select.open}"><div class="ui-select-match"></div><input type="text" autocomplete="off" tabindex="-1" class="form-control ui-select-search" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-show="$select.searchEnabled && $select.open"><div class="ui-select-choices"></div></div>'),
                a.put("select2/choices.tpl.html", '<ul class="ui-select-choices ui-select-choices-content select2-results"><li class="ui-select-choices-group" ng-class="{\'select2-result-with-children\': $select.isGrouped}"><div ng-show="$select.isGrouped" class="ui-select-choices-group-label select2-result-label" ng-bind-html="$group.name"></div><ul ng-class="{\'select2-result-sub\': $select.isGrouped, \'select2-result-single\': !$select.isGrouped}"><li class="ui-select-choices-row" ng-class="{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}"><div class="select2-result-label ui-select-choices-row-inner"></div></li></ul></li></ul>'),
                a.put("select2/match-multiple.tpl.html", '<span class="ui-select-match"><li class="ui-select-match-item select2-search-choice" ng-repeat="$item in $select.selected" ng-class="{\'select2-search-choice-focus\':$select.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}"><span uis-transclude-append=""></span> <a href="javascript:;" class="ui-select-match-close select2-search-choice-close" ng-click="$select.removeChoice($index)" tabindex="-1"></a></li></span>'),
                a.put("select2/match.tpl.html", '<a class="select2-choice ui-select-match" ng-class="{\'select2-default\': $select.isEmpty()}" ng-click="$select.activate()"><span ng-show="$select.isEmpty()" class="select2-chosen">{{$select.placeholder}}</span> <span ng-hide="$select.isEmpty()" class="select2-chosen" ng-transclude=""></span> <abbr ng-if="$select.allowClear && !$select.isEmpty()" class="select2-search-choice-close" ng-click="$select.select(undefined)"></abbr> <span class="select2-arrow ui-select-toggle" ng-click="$select.toggle($event)"><b></b></span></a>'),
                a.put("select2/select-multiple.tpl.html", '<div class="ui-select-multiple select2 select2-container select2-container-multi" ng-class="{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled}"><ul class="select2-choices"><span class="ui-select-match"></span><li class="select2-search-field"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input ui-select-search" placeholder="{{$select.getPlaceholder()}}" ng-disabled="$select.disabled" ng-hide="$select.disabled" ng-model="$select.search" ng-click="$select.activate()" style="width: 34px;"></li></ul><div class="select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="ui-select-choices"></div></div></div>'),
                a.put("select2/select.tpl.html", '<div class="select2 select2-container" ng-class="{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled,\n                \'select2-container-active\': $select.focus, \n                \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}"><div class="ui-select-match"></div><div class="select2-drop select2-with-searchbox select2-drop-active" ng-class="{\'select2-display-none\': !$select.open}"><div class="select2-search" ng-show="$select.searchEnabled"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="ui-select-search select2-input" ng-model="$select.search"></div><div class="ui-select-choices"></div></div></div>'),
                a.put("selectize/choices.tpl.html", '<div ng-show="$select.open" class="ui-select-choices selectize-dropdown single"><div class="ui-select-choices-content selectize-dropdown-content"><div class="ui-select-choices-group optgroup"><div ng-show="$select.isGrouped" class="ui-select-choices-group-label optgroup-header" ng-bind-html="$group.name"></div><div class="ui-select-choices-row" ng-class="{active: $select.isActive(this), disabled: $select.isDisabled(this)}"><div class="option ui-select-choices-row-inner" data-selectable=""></div></div></div></div></div>'),
                a.put("selectize/match.tpl.html", '<div ng-hide="($select.open || $select.isEmpty())" class="ui-select-match" ng-transclude=""></div>'),
                a.put("selectize/select.tpl.html", '<div class="selectize-control single"><div class="selectize-input" ng-class="{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}" ng-click="$select.activate()"><div class="ui-select-match"></div><input type="text" autocomplete="off" tabindex="-1" class="ui-select-search ui-select-toggle" ng-click="$select.toggle($event)" placeholder="{{$select.placeholder}}" ng-model="$select.search" ng-hide="!$select.searchEnabled || ($select.selected && !$select.open)" ng-disabled="$select.disabled"></div><div class="ui-select-choices"></div></div>')
        }]),
    function(a) {
        "use strict";
        var b = a.module("AngularCropper", ["ngRoute", "ngSanitize", "ui.select", "bp.img.cropper"]);
        b.config(["$routeProvider",
            function(a) {
                a.when("/documentation", {
                    templateUrl: "documentation.html",
                    controller: "DocumentationController"
                }),
                    a.when("/how-to-use-it", {
                        templateUrl: "how-to-use-it.html",
                        controller: "HowToUseItController"
                    }),
                    a.when("/demo", {
                        templateUrl: "demo.html",
                        controller: "DemoController"
                    }),
                    a.otherwise("/documentation")
            }])
    } (window.angular),
    angular.module("AngularCropper").run(["$templateCache",
        function(a) {
            "use strict";
            a.put("demo.html", '<div class=sample-images><div class=img-container ng-repeat="image in images"><img ng-src="{{ image.cropped || image.thumb }}" ng-click=selectImage($index)></div></div><div class=crop-demo><div class=image-cropping><div class=selected-image ng-class="{ \'non-selected\': !selected.original }"><img ng-src="{{ selected.original }}" croppable=selected.cropResult crop-name=cropDemo crop-options=selected.cropOptions crop-show=selected.active></div><ul class=image-info ng-hide=!selected.original><li><label>Name:</label>{{ selected.name }}</li><li><label>Author:</label><a ng-href="{{ selected.url }}" target=_blank>{{ selected.author }}</a></li><li><label>Dimensions:</label>{{ $croppable.cropDemo.$loading ? \'Width\' : $croppable.cropDemo.$imgInfo.originalWidth }} x {{ $croppable.cropDemo.$loading ? \'Height\' : $croppable.cropDemo.$imgInfo.originalHeight }}</li></ul><div class=btn-group><button type=button class=btn ng-class="{ active: $croppable.cropDemo.$active }" ng-click="selected.active = true" ng-disabled="!selected.original || !$croppable.cropDemo.$initialized">Enable</button> <button type=button class=btn ng-class="{ active: !$croppable.cropDemo.$active }" ng-click="selected.active = false" ng-disabled="!selected.original || !$croppable.cropDemo.$initialized">Disable</button></div></div><div class=cropper-options><h4>Change the options to modify the croppers behaviour</h4><form><fieldset><div class=section-half><label class=inline for=width>Width:</label><div class=field-group><input class=form-control type=number name=width id=width ng-model=selected.cropResult.width ng-model-options="{ debounce: 500 }" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div><div class=section-half><label class=inline for=height>Height:</label><div class=field-group><input class=form-control type=number name=height id=height ng-model=selected.cropResult.height ng-model-options="{ debounce: 500 }" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div><div class=section-half><label class=inline for=top>Top:</label><div class=field-group><input class=form-control type=number name=top id=top ng-model=selected.cropResult.top ng-model-options="{ debounce: 500 }" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div><div class=section-half><label class=inline for=left>Left:</label><div class=field-group><input class=form-control type=number name=left id=left ng-model=selected.cropResult.left ng-model-options="{ debounce: 500 }" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div></fieldset><fieldset><div class=section-half><label class=inline for=min-width>Min-width:</label><div class=field-group><input class=form-control type=number name=min-width id=min-width ng-model=selected.cropOptions.widthMin ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div><div class=section-half><label class=inline for=max-width>Max-width:</label><div class=field-group><input class=form-control type=number name=max-width id=max-width ng-model=selected.cropOptions.widthMax ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div><div class=section-half><label class=inline for=min-height>Min-height:</label><div class=field-group><input class=form-control type=number name=min-height id=min-height ng-model=selected.cropOptions.heightMin ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div><div class=section-half><label class=inline for=max-height>Max-height:</label><div class=field-group><input class=form-control type=number name=max-height id=max-height ng-model=selected.cropOptions.heightMax ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>px</span></div></div></fieldset><fieldset><div class=section-half><label class=inline for=opacity>Opacity:</label><div class=field-group><input class=form-control type=number name=opacity id=opacity ng-model=selected.cropOptions.backdropOpacity max=100 min=0 ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span>%</span></div></div><div class=section-half><label class=inline for=ratio>Ratio:</label><div class=field-group><input class=form-control type=number name=ratio id=ratio ng-model=selected.cropOptions.aspectRatio ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active"> <span><sup>w</sup>&frasl;<sub>h</sub></span></div></div><div class=radio-btns><div class=section-third><label>Rule of thirds</label><div class=btn-group><button type=button class=btn ng-class="{ active: selected.cropOptions.ruleOfThirds }" ng-click="selected.cropOptions.ruleOfThirds = true" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active">On</button> <button type=button class=btn ng-class="{ active: !selected.cropOptions.ruleOfThirds }" ng-click="selected.cropOptions.ruleOfThirds = false" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active">Off</button></div></div><div class=section-third><label>Center handles</label><div class=btn-group><button type=button class=btn ng-class="{ active: selected.cropOptions.centerHandles }" ng-click="selected.cropOptions.centerHandles = true" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active">On</button> <button type=button class=btn ng-class="{ active: !selected.cropOptions.centerHandles }" ng-click="selected.cropOptions.centerHandles = false" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active">Off</button></div></div><div class=section-third><label>Size hint</label><div class=btn-group><button type=button class=btn ng-class="{ active: selected.cropOptions.sizeHint }" ng-click="selected.cropOptions.sizeHint = true" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active">On</button> <button type=button class=btn ng-class="{ active: !selected.cropOptions.sizeHint }" ng-click="selected.cropOptions.sizeHint = false" ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active">Off</button></div></div></div></fieldset><div class=form-footer><button type=button class=btn ng-click=cropIt() ng-disabled="!$croppable.cropDemo.$initialized || !$croppable.cropDemo.$active || !selected.cropResult.base64">Crop it!</button> <button type=button class=btn ng-click=$croppable.cropDemo.$clear() ng-disabled="!$croppable.cropDemo.$active || !$croppable.cropDemo.$hasSelection">Reset</button> <button type=button class=btn ng-if=$croppable.cropDemo.$initialized ng-click=$croppable.cropDemo.$destroy()>Destroy</button> <button type=button class=btn ng-if=!$croppable.cropDemo.$initialized ng-click=$croppable.cropDemo.$init(selected.cropOptions)>Rebuild</button></div></form></div></div>'),
                a.put("documentation.html", '<article><h3>Customizing</h3><p>The following list are all the available options for cutomizing the croppable directive, you can change the options in 3 different ways that will be shown at the end of the full list of options with their description.</p><div class=description-box><div class=description-header><h4>View description of option</h4><div ui-select ng-model=selected.option on-select=syntaxHighlight()><div ui-select-match placeholder="Select an option to inspect">{{$select.selected.name}}</div><div ui-select-choices repeat="option in options | filter: $select.search"><div ng-bind-html="option.name | highlight: $select.search"></div></div></div></div><div class=description-body ng-show=selected.option><ul class=variable-details><li><span>Name:</span> {{ selected.option.name }}</li><li><span>Default:</span> {{ selected.option.val }}</li><li><span>Type:</span> {{ selected.option.type }}</li></ul><p ng-bind-html=selected.option.description></p><h4>Example</h4><pre class=line-numbers><code class=language-markup ng-bind-html=selected.option.example></code></pre></div></div><h4>3 ways for overriding the default options</h4><p>You can change the options on configuration time of your application, this way you can set options that are going to be used globally, meaning that every instance of the cropper will use this set of options unless they get locally overriden.</p><pre class=line-numbers><code class=language-javascript ng-bind-html=sampleCode.documentation[0]></code></pre><p>The second way of changing the default options of the Angular Cropper is by building an options object and passing it as the value to the crop-options attribute on the image you want to modify.</p><pre class=line-numbers><code class=language-javascript ng-bind-html=sampleCode.documentation[1]></code></pre><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.documentation[2]></code></pre><p>Finally, the third way to customize the croppable image, is by passing the options individually as attributes with their corresponding value, you must prefix each option name with "crop-" followed by the options name from camel case to hyphenated.</p><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.documentation[3]></code></pre></article><article><h3>Callbacks</h3><p>This is a list of all available callbacks in the Angular Cropper directive, a callback can be set through the elements attributes, by prefixing the callback name with "crop-". Select a callback from the list to view it\'s description.</p><div class=description-box><div class=description-header><h4>View description of callback</h4><div ui-select ng-model=selected.callback on-select=syntaxHighlight()><div ui-select-match placeholder="Select a callback to inspect">{{$select.selected.name}}</div><div ui-select-choices repeat="callback in callbacks | filter: $select.search"><div ng-bind-html="callback.name | highlight: $select.search"></div></div></div></div><div class=description-body ng-show=selected.callback><ul class=variable-details><li><span>Name:</span> {{ selected.callback.name }}</li><li><span>Arguments:</span> {{ selected.callback.arguments }}</li></ul><p ng-bind-html=selected.callback.description></p><h4>Example</h4><div ng-bind-html=selected.callback.example></div></div></div><h4>Callback arguments</h4><p>Every callback can receive 2 optional arguments:</p><table><tbody><tr><td>$data<br>(optional)</td><td>This argument is an object containing the crop area positioning measurements and cropped image data if available. It has the Top and Left values of the crop area, as well as the width and height of it (This measurements are relative to the unscaled image dimension). Also it has the property named base64, which is the created image from the crop area in base64 format, this property will be set to null if no image can be created, either because is not enabled or the image violates the same origin policy, meaning that it doesn鈥檛 come from the same server.</td></tr><tr><td>$croppable<br>(optional)</td><td>This is an instance of the Angular Cropper controller, this instance belongs to the element on which the callback was fired, and it gives you access to the directives API from within your callback, for further information about the methods and properties it contains check out the directives API information.</td></tr></tbody></table><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.documentation[4]></code></pre></article><article><h3>Events</h3><p>This is the list of events that get emitted by the directive, for every callback there is a similar event that gets emitted, this is helpfull because listening to an event will not impact significantly the performance of your applicion, while evaluting a callback is a little more resource consuming. The event listener can receive up to 4 optional parameters.</p><p class=notification>You can change the prefix (crop) of the event name by changing the default option <code class=language-javascript>eventPrefix</code>, you can change this using any of the 3 available ways to modify default options. For example if you prefer that the event is prefixed with the word 鈥渋mageCrop鈥?, then after you set the 鈥渆ventPrefix鈥? option to this value you can now listen to an event like this <code class=language-javascript>$scope.$on(\'imageCrop.ready\', function() { ... } );</code></p><div class=description-box><div class=description-header><h4>View description of event</h4><div ui-select ng-model=selected.event on-select=syntaxHighlight()><div ui-select-match placeholder="Select an event to inspect">{{$select.selected.name}}</div><div ui-select-choices repeat="event in events | filter: $select.search"><div ng-bind-html="event.name | highlight: $select.search"></div></div></div></div><div class=description-body ng-show=selected.event><ul class=variable-details><li><span>Name:</span> {{ selected.event.name }}</li><li><span>Arguments:</span> {{ selected.event.arguments }}</li></ul><p ng-bind-html=selected.event.description></p><h4>Example</h4><div ng-bind-html=selected.event.example></div></div></div><h4>Event parameters</h4><p>Every event can receive 4 optional parameters, and they area passed in the following order, inside the event listener you can name them as you like:</p><table><tbody><tr><td>[event]</td><td>This is the Angular event object, it contains different attributes that give you more information about the event and let鈥檚 you modify it鈥檚 behaviour as well, to read more about it go here.</td></tr><tr><td>[$data]</td><td>This argument is an object containing the crop area positioning measurements and cropped image data if available. It has the Top and Left values of the crop area, as well as the width and height of it (This measurements are relative to the unscaled image dimensions). Also it has the property named base64, which is the created image from the crop area in base64 format, this property will be set to null if no image can be created, either because is not enabled or the image violates the same origin policy, meaning that it doesn鈥檛 come from the same server.</td></tr><tr><td>[$croppable]</td><td>This is an instance of the Angular Cropper controller, this instance belongs to the element on which the event was fired, and it gives you access to the directives API from within the event listener, for further information about the methods and properties it contains check out the directives API information.</td></tr><tr><td>[yourData]</td><td>This variable contains optional data passed to the cropper through the 鈥渃rop-data鈥? attribute, the cropper will take this data you provide and pass it as the 4th parameter for you to use, in case you need to know more information about the image that emitted the event, maybe you have 20 images with cropping capabilities and you need to know the ID of the image that emitted the event, you can pass that information through here. The 鈥渃rop-data鈥? attribute gets evalutated everytime an event is emitted, so if you change it before the event takes place, this change will be reflected in the parameter.</td></tr></tbody></table></article><article><h3>Directive API</h3><p>In this section you will find all the available properties and methods that are exposed to the public API of the Angular Cropper instances, the API in made available to you in 3 different ways.</p><ol><li>Through an event callback: The function you pass as a callback will receive a parameter named $croppable, this is an instance of the exposed API.</li><li>Through an event listener: The listener will receive a set of parameters when emitted, the 3rd parameter is the croppers exposed API.</li><li>Through the local $scope: If you set the 鈥渃rop-name鈥? attribute in the image element, the cropper will use this name to expose the API in the $scope under the property $croppable, this gives you access to the API from within your view and local scope.</li></ol><h4>Properties description</h4><div class=description-box><div class=description-header><h4>View description of property</h4><div ui-select ng-model=selected.property on-select=syntaxHighlight()><div ui-select-match placeholder="Select a property to inspect">{{$select.selected.name}}</div><div ui-select-choices repeat="property in properties | filter: $select.search"><div ng-bind-html="property.name | highlight: $select.search"></div></div></div></div><div class=description-body ng-show=selected.property><ul class=variable-details><li><span>Name:</span> {{ selected.property.name }}</li><li><span>Default:</span> {{ selected.property.val }}</li><li><span>Type:</span> {{ selected.property.type }}</li></ul><p ng-bind-html=selected.property.description></p><p class=notification ng-show=selected.property.notification ng-bind-html=selected.property.notification></p><h4 ng-show=selected.property.example>Example</h4><div ng-bind-html=selected.property.example></div></div></div><h4>Methods description</h4><div class=description-box><div class=description-header><h4>View description of method</h4><div ui-select ng-model=selected.method on-select=syntaxHighlight()><div ui-select-match placeholder="Select a method to inspect">{{$select.selected.name}}</div><div ui-select-choices repeat="method in methods | filter: $select.search"><div ng-bind-html="method.name | highlight: $select.search"></div></div></div></div><div class=description-body ng-show=selected.method><ul class=variable-details><li><span>Name:</span> {{ selected.method.name }}</li><li><span>Returns:</span> {{ selected.method.returns }}</li><li><span>Arguments:</span> {{ selected.method.params }}</li></ul><p ng-bind-html=selected.method.description></p><h4 ng-show=selected.method.example>Example</h4><div ng-bind-html=selected.method.example></div></div></div></article>'),
                a.put("how-to-use-it.html", '<div class=features><article><img src=img/sass-logo.png alt="Sass Logo"><h3>Easy to customize</h3><p>The styling is generated using Sass, in order to customize it, you just need to override the variables for the setting you desire and build an interface that follows your design.</p></article><article><img src=img/js-logo.png alt="Sass Logo"><h3>Easy to read code</h3><p>The source code is well documented through the extensive use of commets, as well as a detail documentation explaining it鈥檚 use and capabilities, among comprehensive demos.</p></article><article><img src=img/angular-logo.png alt="Sass Logo"><h3>Strong framework</h3><p>It is a directive built above a very robust framework, it uses it鈥檚 built in tools and follows best practives for creating reliable and easy to use and implement functionalities</p></article></div><article><h3>Installation</h3><h4 class=step>1. Load Angular Cropper CSS styling into your project</h4><p>You can either import the croppers SCSS file into your main SCSS file, this gives you the flexibility of overriding variable on compilation of your projects CSS and customising the interface to your needs.</p><pre class=line-numbers><code class=language-scss ng-bind-html=sampleCode.installation[0]></code></pre><p>Another way you can load the styling, is by adding the path to the location of the generated CSS file, this is less flexible but gets the job done.</p><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.installation[1]></code></pre><h4 class=step>2. Load Angular Cropper Javascript file into your project</h4><p>Load all the magical Angular core code first, and then add the Angular Cropper directive so that we can use it inside and everywhere we want in our application. No jQuery required!</p><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.installation[2]></code></pre><h4 class=step>3. Inject the Angular cropper module into your application dependency list.</h4><p>Now we need to let angular know that we are going to be using the Angular Cropper directive, therefore we have to insert the name of the cropper module into the list of the dependencies.</p><pre class=line-numbers><code class=language-javascript ng-bind-html=sampleCode.installation[3]></code></pre><h4 class=step>4. Add the croppable attribute to any image element you want to crop.</h4><p>You can turn any image element inside your document into a croppable element, simply add to the image tag the attribute named croppable and it will automagically turn it into a dynamic croppable image interface.</p><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.installation[4]></code></pre></article><article><h3>How to use it</h3><p>This directive does not create a new scope, and can only be used as an attribute inside an image tag element, it listens for the $destroy event on the image element in order to remove all inserted UI and remove any DOM listeners as well to detach any <code>$scope</code> events.</p><p>The directive runs in <strong>priority 100</strong> so it can obtain the ngSrc value before interpolation.</p><p class=notification>Remember that the values you pass and obtain from the cropper are relative to the unscaled image, this is due to the cropper\'s ability to work on responsive images, therefore all values are calculated based on the original width and height of the loaded image.</p><h4>Usage</h4><pre class=line-numbers><code class=language-markup ng-bind-html=sampleCode.installation[5]></code></pre><h4>Arguments</h4><div class=description-box><div class=description-header><h4>View description of attribute</h4><div ui-select ng-model=selected.attribute on-select=syntaxHighlight()><div ui-select-match placeholder="Select an attribute to inspect">{{$select.selected.name}}</div><div ui-select-choices repeat="attr in attributes | filter: $select.search"><div ng-bind-html="attr.name | highlight: $select.search"></div></div></div></div><div class=description-body><ul class=variable-details><li><span>Name:</span> {{ selected.attribute.name }}</li><li><span>Type:</span> {{ selected.attribute.type }}</li><li ng-class="{ required: selected.attribute.required }" class=optional>{{ selected.attribute.required ? \'Required\' : \'Optional\' }}</li></ul><p ng-bind-html=selected.attribute.description></p><h4>Example</h4><div ng-bind-html=selected.attribute.example></div></div></div></article>')
        }]),
    function(a, b) {
        "use strict";
        var c = a.module("AngularCropper");
        c.controller("DemoController", ["$scope",
            function(a) {
                var c = 0;
                a.images = [{
                    name: "Blue throated Macaw",
                    author: "Steve Wilson",
                    url: "http://albumarium.com/52fa55d77670733d85030000-animals/5380a6e176707301661e0000",
                    original: "img/samples/originals/parrot.jpg",
                    thumb: "img/samples/thumbs/parrot.jpg",
                    cropOptions: {
                        ruleOfThirds: !1,
                        centerHandles: !0,
                        sizeHint: !1,
                        backdropOpacity: 20,
                        aspectRatio: 16 / 9,
                        widthMin: 300,
                        widthMax: 800,
                        heightMin: 300,
                        heightMax: 900
                    },
                    active: !0,
                    cropResult: {
                        width: 800,
                        height: 450,
                        top: 80,
                        left: 250
                    }
                },
                    {
                        name: "Solo Meerkat",
                        author: "Max Herman",
                        url: "http://albumarium.com/52fa55d77670733d85030000-animals/53e3c1527670733ef56c0200",
                        original: "img/samples/originals/timon.jpg",
                        thumb: "img/samples/thumbs/timon.jpg",
                        active: !0,
                        cropResult: {
                            width: 1440,
                            height: 2030,
                            top: 200,
                            left: 1310
                        },
                        cropOptions: {
                            ruleOfThirds: !0,
                            centerHandles: !0,
                            sizeHint: !0,
                            backdropOpacity: 40,
                            widthMin: 300,
                            heightMin: 300
                        }
                    },
                    {
                        name: "Jasraj knows how to pose!",
                        author: "Tambako The Jaguar",
                        url: "http://albumarium.com/52fab12976707371d9030000-cats/52fab78f76707371d1110000",
                        original: "img/samples/originals/beautiful-lion.jpg",
                        thumb: "img/samples/thumbs/beautiful-lion.jpg",
                        active: !0,
                        cropResult: {
                            width: 1920,
                            height: 1920,
                            top: 225,
                            left: 345
                        },
                        cropOptions: {
                            aspectRatio: 9 / 16,
                            backdropOpacity: 60
                        }
                    },
                    {
                        name: "Kedi",
                        author: "Jenny Downing",
                        url: "http://albumarium.com/52fab12976707371d9030000-cats/53a5dadf7670732782eb3a00",
                        original: "img/samples/originals/kitty-cat.jpg",
                        thumb: "img/samples/thumbs/kitty-cat.jpg",
                        active: !0
                    },
                    {
                        name: "Puppy",
                        author: "Andr茅 Spieker",
                        url: "http://albumarium.com/52fa55d77670733d85030000-animals/52fa55e37670733d89050000",
                        original: "img/samples/originals/puppy.jpg",
                        thumb: "img/samples/thumbs/puppy.jpg",
                        active: !0,
                        cropResult: {
                            width: 590,
                            height: 590,
                            top: 50,
                            left: 400
                        },
                        cropOptions: {
                            backdropOpacity: 20,
                            ruleOfThirds: !1,
                            centerHandles: !1
                        }
                    },
                    {
                        name: "Babar",
                        author: "Christopher Michel",
                        url: "http://www.flickr.com/photos/50979393@N00/10502116486/",
                        original: "img/samples/originals/resting-elephant.jpg",
                        thumb: "img/samples/thumbs/resting-elephant.jpg",
                        active: !0
                    }],
                    a.selected = a.images[c],
                    a.selectImage = function(b) {
                        c = b,
                            a.selected = a.images[b]
                    },
                    a.cropIt = function() {
                        a.images[c].cropped = a.selected.cropResult.base64,
                            a.selected = b
                    }
            }])
    } (window.angular),
    function(a, b) {
        "use strict";
        var c = a.module("AngularCropper");
        c.controller("DocumentationController", ["$scope", "$timeout", "SampleCode",
            function(a, c, d) {
                function e() {
                    c(function() {
                            b.highlightAll()
                        },
                        0)
                }
                a.syntaxHighlight = e,
                    a.sampleCode = {
                        documentation: d.documentation
                    },
                    a.options = [{
                        name: "aspectRatio",
                        val: "0",
                        type: "Number",
                        description: "This option sets the aspect ratio for the crop area, it will restrict the width and height of the crop area to respect the ratio number you have provided. The format for fractions is width / height, therefore a ratio of 1 will keep the width the same as the height, while a ratio o 4/3 will make the with 1 unit larger than the height.",
                        example: d.options.aspectRatio
                    },
                        {
                            name: "ruleOfThirds",
                            val: "true",
                            type: "Boolean",
                            description: "Creates a thin grid over the image, the grid follows the rule of third principle and allows users to make a cropped image aligned to vertical and horizontal lines, with a visual balance and focal points.",
                            example: d.options.ruleOfThirds
                        },
                        {
                            name: "outputType",
                            val: "Base64",
                            type: "String",
                            description: "This sets the type of string format for the cropped image data, currently it only supports base64, but on next version it is planned to add support for Blob output strings.",
                            example: d.options.outputType
                        },
                        {
                            name: "widthMin",
                            val: "50",
                            type: "Number",
                            description: "This sets a minimum width for the crop area, if the area is less than the set value it will automatically expand to equal the value set in this option. The value is taken as pixels inside the the unscaled image width, something to consider in case you are using responsive images.",
                            example: d.options.widthMin
                        },
                        {
                            name: "widthMax",
                            val: "Null",
                            type: "Number",
                            description: "This sets a maximum width for the crop area, if the area exceeds the set value it will automatically stop expanding the crop area. The value is taken as pixels inside the the unscaled image width, something to consider in case you are using responsive images.",
                            example: d.options.widthMax
                        },
                        {
                            name: "heightMin",
                            val: "50",
                            type: "Number",
                            description: "This sets a minimum height for the crop area, if the area is less than the set value it will automatically expand to equal the value set in this option. The value is taken as pixels inside the the unscaled image height, something to consider in case you are using responsive images.",
                            example: d.options.heightMin
                        },
                        {
                            name: "heightMax",
                            val: "Null",
                            type: "Number",
                            description: "This sets a maximum height for the crop area, if the area exceeds the set value it will automatically stop expanding the crop area. The value is taken as pixels inside the the unscaled image height, something to consider in case you are using responsive images.",
                            example: d.options.heightMax
                        },
                        {
                            name: "autoCropping",
                            val: "true",
                            type: "Boolean",
                            description: 'Everytime you stop selecting an area or moving the crop area, it will automatically crop the image using the HTML5 canvas, and output it\'s value in base64 format, unless specified in another supported format, this value is bound to the $scope variable passed to the <code class="language-markup">croppable</code> attribute or through the emitted event of <code class="language-javascript">crop.selectEnd</code> and <code class="language-javascript">crop.moveEnd</code>.',
                            example: d.options.autoCropping
                        },
                        {
                            name: "imageType",
                            val: "jpeg",
                            type: "String",
                            description: 'This value is used to set the output image mime type in the HTML5 Canvas API, currently it supports png and jpeg, and some browsers also support webm, for further information on image types supported by the HTML5 Canvas API check its <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL">documentation</a>.',
                            example: d.options.imageType
                        },
                        {
                            name: "centerHandles",
                            val: "true",
                            type: "Boolean",
                            description: 'This option controls the visibility of the center handles, which allow the user to resize the crop area only vertically or horizontally, if this functionality is not desired for your application, you can disable their visibility by setting the option to false. This will set either <code class="language-css">display: hidden;</code> or <code class="language-css">display: block;</code> on the center handles, it will not remove them from the interface.',
                            example: d.options.centerHandles
                        },
                        {
                            name: "sizeHint",
                            val: "true",
                            type: "Boolean",
                            description: 'This option controls the visibility of the crop area size hint, which is displayed by default on the top-left corner of the selected crop area, if this functionality is not desired for your application, you can disable the visibility by setting the option to false. This will set either <code class="language-css">display: hidden;</code> or <code class="language-css">display: block;</code> on the size hint, it will not remove it from the interface. The values displayed in the size hint correspond to the width x height of the selected area, and the measurements are relative to the unscaled image width/height.',
                            example: d.options.sizeHint
                        },
                        {
                            name: "loadingClass",
                            val: "cropper-loading",
                            type: "String",
                            description: 'This is the class applied to the Cropper container, which wraps the original image and the cropping interface, and it is set only when the image is being loaded for calculating it\'s measurements, the image loading happens when the cropper is initiated or the image <code class="language-markup">ng-src</code> attribute changes, by default a preloader animation is applied to the container using this class. If you desire to implement another style of preloader, you can modify the Cropper CSS or use a loading class with your own styling',
                            example: d.options.loadingClass
                        },
                        {
                            name: "backdropOpacity",
                            val: "0.5",
                            type: "Number",
                            description: "This options gives you control on the opacity level of the backdrop image, the cropper sets the original image as a backdrop with a dark background and when the user selects an area, it sets the opacity of this backdrop to the value set in this option. You can also change the backdrop color in the Cropper CSS styling.",
                            example: d.options.backdropOpacity
                        },
                        {
                            name: "eventPrefix",
                            val: "crop",
                            type: "String",
                            description: "This value is used to prefix the name of the emitted events, the full format of the event name is as follows <code class=\"language-javascript\">'[eventPrefix].[eventName]'</code>. If you would like to prefix the event differently, go ahead and change this value as shown in the example.",
                            example: d.options.eventPrefix
                        },
                        {
                            name: "optionsPrefix",
                            val: "crop",
                            type: "String",
                            description: "The value of this option is used to know the prefix of the options passed as attributes that correspond to the Cropper directive, this is used to avoid clashes of attributes used by other directives applied to the same element. If you change this, you will need to prefix the subsequent attribute options with the value you pass here, except for this option, unless you globally change the default as shown in the next section on the 3 different ways to edit custom options.",
                            example: d.options.optionsPrefix
                        },
                        {
                            name: "directiveName",
                            val: "$croppable",
                            type: "String",
                            description: 'This option is used to name a variable in the current scope where it will store all the cropper instances to which you have provided a name, the Cropper gives you the ability to name the image so that you can access its Cropper instance API from within the scope, you can find out more of this in the <a href="#/how-to-use-it">How to use it</a> section. If you pass an empty string, the instance will be saved directly to scope using the image name but no longer under a single variable named $croppable or any provided string.',
                            example: d.options.directiveName
                        },
                        {
                            name: "preloader",
                            val: "true",
                            type: "Boolean",
                            description: 'This option gives you control on wether to show the Croppers preloader animation, if this is set to <code class="language-javascript">false</code>, it will not set the loading class option value to the Cropper container, and will not append the preloader UI to the cropper, therefore disabling the preloader animation.',
                            example: d.options.preloader
                        }],
                    a.callbacks = [{
                        name: "onSelectStart",
                        arguments: "$data, $croppable",
                        description: "This callback is called at the end of the mouse or touch start event, it first runs all code for the cropper event, and performs it's calculations and before updating the interface, it runs this callback. The $data argument will contain only the top and left position of the crop area because it's the start of the selection.",
                        example: d.callbacks.onSelectStart
                    },
                        {
                            name: "onSelect",
                            arguments: "$data, $croppable",
                            description: "This callback gets called on every mouse or touch move, so try to keep your code inside this callback very simple and light because it runs after making all the necessary calculations, right before the interface gets updated, so if your code is too complex here, it will make the dragging of the crop area a little sluggish, because it will wait for the callback to complete running.",
                            example: d.callbacks.onSelect
                        },
                        {
                            name: "onSelectEnd",
                            arguments: "$data, $croppable",
                            description: "This callbacks is called when the mouse or touch is released, after the cropper has performed it's calculations but before the interface is updated, the <code>$data</code> argument at this point will be completely populated since it is the end of the selection.",
                            example: d.callbacks.onSelectEnd
                        },
                        {
                            name: "onMoveStart",
                            arguments: "$data, $croppable",
                            description: "This callback gets called when there is a mouse or touch start within the crop area, it happens right after perfoming the internal calculations, before the interface is updated. The <code>$data</code> argument will be fully populated at this point since the crop area is only being moved.",
                            example: d.callbacks.onMoveStart
                        },
                        {
                            name: "onMove",
                            arguments: "$data, $croppable",
                            description: "This callback is called everytime the mouse or touch move event is triggered while holding the mouse or touch over the crop area, try to keep your code inside this callback as simple as possible because the cropper will wait for it to finish before updating the interface, if the callback is too complex it will make the crop area movement sluggish. The <code>$data</code> argument will only change the top and left values since the crop area is only being moved.",
                            example: d.callbacks.onMove
                        },
                        {
                            name: "onMoveEnd",
                            arguments: "$data, $croppable",
                            description: "This callback is called right after the mouse or touch releases over the crop area, right after the internal calculations are performed but before the interface is updated. The <code>$data</code> argument will contain the final values of the movement and if autocropping is set and possible, it will contain the cropped image as well.",
                            example: d.callbacks.onMoveEnd
                        },
                        {
                            name: "onEnable",
                            arguments: "$data, $croppable",
                            description: "This callabck gets called when ever the cropper is enabled, rigth after attaching all the event listeners to the interface but before any update to the view takes place.",
                            example: d.callbacks.onEnable
                        },
                        {
                            name: "onDisable",
                            arguments: "$data, $croppable",
                            description: "This callabck gets called when ever the cropper is disabled, rigth after detaching all the event listeners on the interface but before any update to the view takes place.",
                            example: d.callbacks.onDisable
                        },
                        {
                            name: "onReset",
                            arguments: "$data, $croppable",
                            description: "This callback is called when the cropper is manually resetted through the reset method in the API, it will zero out the <code>$data</code> object and then run this callback, right before updating the cropper interface.",
                            example: d.callbacks.onReset
                        },
                        {
                            name: "onUpdate",
                            arguments: "$data, $croppable",
                            description: "This callback runs everytime the cropper's interface is updated, this means that everytime something changes in the cropper view it will call this callback, and it runs after the changes to the interface have been applied. This callback is evaluated constantly, therefore try to keep it simple in here.",
                            example: d.callbacks.onUpdate
                        },
                        {
                            name: "onDestroy",
                            arguments: "$data, $croppable",
                            description: "This callback gets called after removing all the cropper interface and listeners, the cropper listens for the Angular <code>$destroy</code> event, in order to clean up the genereated elements and detach events, after this cleaning is completed it will run this callback.",
                            example: d.callbacks.onDestroy
                        },
                        {
                            name: "onReady",
                            arguments: "$data, $croppable",
                            description: "This callback is called after the cropper is ready to be used. The cropper internally loads the image to obtain it's dimension, this is an async action, therefore when this action is resolved it builds the interface and attaches the listeners to it, then it runs this callback. So the time it takes to run the callback depends on the loading of the source image.",
                            example: d.callbacks.onReady
                        },
                        {
                            name: "beforeImageLoad",
                            arguments: "$data, $croppable",
                            description: "When the cropper is initialized it loads the source image internally so that it can obtain it's true measurements, right before making the request for the image it will run this callback and it will wait for it to complete in order to load the image.",
                            example: d.callbacks.beforeImageLoad
                        },
                        {
                            name: "onImageLoad",
                            arguments: "$data, $croppable",
                            description: "When the cropper is initialized it loads the source image internally so that it can obtain it's true measurements, this is an async action, therefore when this action gets resolved it will set the true dimensions and finally run this callback.",
                            example: d.callbacks.onImageLoad
                        }],
                    a.events = [{
                        name: "crop.selectStart",
                        arguments: "event, $data, $croppable, cropData",
                        description: "This event is emitted at the end of the mouse or touch start event, it first runs all code for the cropper event, and performs it's calculations and before updating the interface, it emits this event. The $data argument will contain only the top and left position of the crop area because it's the start of the selection.",
                        example: d.events.selectStart
                    },
                        {
                            name: "crop.select",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event gets emitted on every mouse or touch move, so try to keep your code inside the event listener very simple and light because it runs after making all the necessary calculations, right before the interface gets updated, so if your code is too complex here, it will make the dragging of the crop area a little sluggish, because it will wait for the listener to complete running.",
                            example: d.events.select
                        },
                        {
                            name: "crop.selectEnd",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event is emitted when the mouse or touch is released, after the cropper has performed it's calculations but before the interface is updated, the <code>$data</code> argument at this point will be completely populated since it is the end of the selection.",
                            example: d.events.selectEnd
                        },
                        {
                            name: "crop.moveStart",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event gets emitted when there is a mouse or touch start within the crop area, it happens right after perfoming the internal calculations, before the interface is updated. The <code>$data</code> argument will be fully populated at this point since the crop area is only being moved.",
                            example: d.events.moveStart
                        },
                        {
                            name: "crop.move",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event is emitted everytime the mouse or touch move event is triggered while holding the mouse or touch over the crop area, try to keep your code inside the listener as simple as possible because the cropper will wait for it to finish before updating the interface, if the listener is too complex it will make the crop area movement sluggish. The <code>$data</code> argument will only change the top and left values since the crop area is only being moved.",
                            example: d.events.move
                        },
                        {
                            name: "crop.moveEnd",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event is emitted right after the mouse or touch releases over the crop area, right after the internal calculations are performed but before the interface is updated. The <code>$data</code> argument will contain the final values of the movement and if autocropping is set and possible, it will contain the cropped image as well.",
                            example: d.events.moveEnd
                        },
                        {
                            name: "crop.enable",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event gets emitted when ever the cropper is enabled, rigth after attaching all the event listeners to the interface but before any update to the view takes place.",
                            example: d.events.enable
                        },
                        {
                            name: "crop.disable",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event gets emitted when ever the cropper is disabled, rigth after detaching all the event listeners on the interface but before any update to the view takes place.",
                            example: d.events.disable
                        },
                        {
                            name: "crop.reset",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event is emitted when the cropper is manually resetted through the reset method in the API, it will zero out the <code>$data</code> object and then emit this event, right before updating the cropper interface.",
                            example: d.events.reset
                        },
                        {
                            name: "crop.update",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event is emitted everytime the cropper's interface is updated, this means that everytime something changes in the cropper view it will emit this event, and it runs after the changes to the interface have been applied. This event is emitted constantly, therefore try to keep it simple in here.",
                            example: d.events.update
                        },
                        {
                            name: "crop.destroy",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event gets emitted after removing all the cropper interface and listeners, the cropper listens for the Angular <code>$destroy</code> event, in order to clean up the genereated elements and detach events, after this cleaning is completed it will emit this event.",
                            example: d.events.destroy
                        },
                        {
                            name: "crop.ready",
                            arguments: "event, $data, $croppable, cropData",
                            description: "This event is emitted after the cropper is ready to be used. The cropper internally loads the image to obtain it's dimension, this is an async action, therefore when this action is resolved it builds the interface and attaches the listeners to it, then it emits this event. So the time it takes to emit the event depends on the loading of the source image.",
                            example: d.events.ready
                        },
                        {
                            name: "crop.beforeImageLoad",
                            arguments: "event, $data, $croppable, cropData",
                            description: "When the cropper is initialized it loads the source image internally so that it can obtain it's true measurements, right before making the request for the image it will emit this event and it will wait for it to complete in order to load the image.",
                            example: d.events.beforeImageLoad
                        },
                        {
                            name: "crop.imageLoad",
                            arguments: "event, $data, $croppable, cropData",
                            description: "When the cropper is initialized it loads the source image internally so that it can obtain it's true measurements, right before making the request for the image it will emit this event and it will wait for it to complete in order to load the image.",
                            example: d.events.imageLoad
                        }],
                    a.properties = [{
                        name: "$name",
                        val: "Undefined",
                        type: "String",
                        description: 'This is the name given to the croppable image through the <code class="language-markup">crop-name</code> attribute option, if no name is given to the image the property will remain as <code class="language-javascript">undefined</code>. You must provide a name to the image in order to have access to the API inside the html view and local scope.',
                        example: d.properties.$name
                    },
                        {
                            name: "$active",
                            val: "False",
                            type: "Boolean",
                            description: "This property indicates wether the cropper is active, meaning that is listening for click events, and the user is able to drag a selection over the croppable image. This is useful to show/hide UI elements for when the cropper is active.",
                            example: d.properties.$active
                        },
                        {
                            name: "$hasSelection",
                            val: "False",
                            type: "Boolean",
                            description: "This Boolean property indicates wether the cropper has a selected area or not, this is helpful in situations when you want to display or hide elements when there is a selection created or not.",
                            example: d.properties.$hasSelection
                        },
                        {
                            name: "$initialized",
                            val: "False",
                            type: "Boolean",
                            description: "This is a flag that indicates wether the cropper has been initialized or not, right when the cropper runs for the first time it is set to true and when manually destroyed it is set to false.",
                            example: d.properties.$initialized
                        },
                        {
                            name: "$loading",
                            val: "False",
                            type: "Boolean",
                            description: "This is a flag that indicated if the cropper is loading the image to crop, it is useful for displaying any sort of preloading animation or message when switching the image.",
                            example: d.properties.$loading
                        },
                        {
                            name: "$moving",
                            val: "False",
                            type: "Boolean",
                            description: "This is a flag that indicates if the crop area is being moved or not, it is helpful in case you want to disable certain elements or provide feedback to the user when the crop area is being changed.",
                            example: d.properties.$moving
                        },
                        {
                            name: "$selecting",
                            val: "False",
                            type: "Boolean",
                            description: "This is a flag that indicates if the user is actively selecting an area to crop, this is useful when you want to disable an element or display feedback when the user is generating a selection area.",
                            example: d.properties.$selecting
                        },
                        {
                            name: "$data",
                            val: "{top:0, left:0, width:0, height:0, base64: null}",
                            type: "Object",
                            description: "This property contains an object with the dimension and position of the crop area, the object contains 5 properties, top, left, width, height and base64 this values are relative to the true unscaled image. This property gives you access to the calculated values based on the source image, it also provides you with a base64 image of the cropped area, this data you can send it to your server to perform the cropping there or simply use the generated base64 image.",
                            notification: "Due to CORS (Cross Origin Resource Sharing) the base64 image generator can only be used on images from the same domain otherwise this property will stay as null, you can disable the use of the base64 by setting the option of <code>autoCropping</code> to <code>false</code>.",
                            example: d.properties.$data
                        },
                        {
                            name: "$imageInfo",
                            val: "{}",
                            type: "Object",
                            description: 'This property will store the image true dimensions, this object contains the following properties <code class="language-javascript">originalHeight:</code> which has the image true height or unscaled height in pixels, <code class="language-javascript">originalWidth:</code> same as with the height, contains the true width in pixels and <code class="language-javascript">scaleRatio:</code> is the scale ratio between the true dimension and the scaled image. This properties are set right after the image has finished loading.',
                            example: d.properties.$imageInfo
                        },
                        {
                            name: "$measurements",
                            val: "{top:0, left:0, width:0, height:0}",
                            type: "Object",
                            description: "This property contains an object with the measurements of the crop area, the object contains 4 properties, top, left, width and height of the crop area and this values are relative to the scaled image, or the visible image. Since we live in a web of responsive images, this helps us keep track of the position of the cropper inside the resized image, so always keep this in mind.",
                            example: d.properties.$measurements
                        },
                        {
                            name: "$cropContainer",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the whole crop container UI DOM element, this is the container that holds the source image along with the cropper interface and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$cropper",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the whole copper UI DOM element, this is the container that holds the cropper handles, the size hint, the overlayed image, the rule of thirds grid and the crop area or selection area and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$cropArea",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the crop area UI DOM element, this is the container that displays the area that has been selected, within it is the overlayed image and the rule of thirds grid and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$overlayedImg",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the image DOM element that is overlayed on top of the original image. This image is used to display the area that the user has selected, it is contained inside the <code>$cropArea</code> element, it's a duplicate image of the source and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$ruleOfThirds",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the rule of thirds DOM element grid lines. This are the thin vertical/horizontal lines that form a grid inside the selected area and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$cropHandles",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the copper handles UI DOM element, this is the container that holds all the cropper handles, which lie on top of the crop area and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$centerHandles",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the cropper UI center handles DOM element, this are the handles that control vertical/horizontal resizing and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$sizeHint",
                            val: "Undefined",
                            type: "Angular Element",
                            description: "This property gives you access to the size hint DOM element, this is the small box on the top left corner of the crop area that displays the true width and height of the selected area, and it is generated using the Angular.element method, which returns a jQLite or jQuery element handle."
                        },
                        {
                            name: "$srcAttr",
                            val: "Undefined",
                            type: "String",
                            description: "This property is simply a reference to the value of the ngSrc attribute before it is interpolated, it is used as a reference for when the cropper is manually destroyed and the interpolated image source is undefined, the original image gets unwrapped from the generated UI of the cropper, therefore if the source is undefined the ngSrc attribute by default will not be added back to the image, so the cropper manually sets it back to keep the binding the user originally setted."
                        }],
                    a.methods = [{
                        name: "$options",
                        returns: "Mixed",
                        params: "[Mixed option], [Mixed value]",
                        description: "This is a setter/getter method, if the first parameter is a string, it will return the value for that option if found in the global options object, otherwise you can pass an Object as the first argument, it will be merged into the global options, or alternatively you can pass a key, value pair of arguments, where the first argument is the key or option you want to set and the second argument the value. If setting an option, the method will return Self so you can chain methods.",
                        example: d.methods.$options
                    },
                        {
                            name: "$clear",
                            returns: "Self",
                            params: "None",
                            description: "This is a handy method for clearing out the selection area, this will zero out the calculated values and will update the interface to release the selected cropping area, it will return itself so you can chain methods together.",
                            example: d.methods.$clear
                        },
                        {
                            name: "$toggle",
                            returns: "Self",
                            params: "None",
                            description: "This allows you to manually toggle the cropper, if the cropper is not active it will enable it and start listening for events, and when clicked again it will revert this, by removing the listeners and setting the cropper as not active.",
                            example: d.methods.$toggle
                        },
                        {
                            name: "$cropIt",
                            returns: "Self || Object",
                            params: "[Mixed dimensionProp], [Number value]",
                            description: "This is a setter/getter method, it allows you to set a cropping area, either by passing an Object containing a top, left, width and height properties or an Array with those values in the same order [top, left, width, height], you can as well set values individually by passing to the first argument any of the previously mentioned strings with the second argument being it's value and it will return Self so you can chain methods. If you don't pass any argument, the method will calculate the true measurements and generate the base64 image if enabled, then it will return an object containing the top, left, width, height and base64 image as properties, remember that the values are relative to the original image dimension.",
                            example: d.methods.$cropIt
                        },
                        {
                            name: "$destroy",
                            returns: "Self",
                            params: "None",
                            description: "This method allows you to manually destroy the cropper, this will remove any listeners and watchers from the DOM and Scope, and will remove any genereated DOM content, reverting the image back to it's original state. It returns Self so you can chain up methods.",
                            example: d.methods.$destroy
                        },
                        {
                            name: "$init",
                            returns: "Self",
                            params: "[Object options]",
                            description: "This method allows you to manually initialize the cropper, it will generate the cropper interface and attach any listeners and watchers, you can optionally provide an object of options that will be setted on the cropper before initialization and be used as defaults.",
                            example: d.methods.$init
                        }],
                    a.selected = {
                        option: a.options[0],
                        callback: a.callbacks[0],
                        event: a.events[0],
                        property: a.properties[0],
                        method: a.methods[0]
                    }
            }])
    } (window.angular, window.Prism),
    function(a) {
        "use strict";
        var b = a.module("AngularCropper");
        b.controller("FooterController", ["$scope",
            function(a) {
                var b = 2015,
                    c = (new Date).getFullYear();
                a.year = b === c ? b: b + " - " + c
            }])
    } (window.angular),
    function(a) {
        "use strict";
        var b = a.module("AngularCropper");
        b.controller("HowToUseItController", ["$scope", "$timeout", "SampleCode",
            function(a, b, c) {
                function d() {
                    b(function() {
                            Prism.highlightAll()
                        },
                        0)
                }
                a.syntaxHighlight = d,
                    a.sampleCode = {
                        installation: c.installation
                    },
                    a.attributes = [{
                        name: "ngSrc",
                        type: "Expression",
                        required: !0,
                        description: 'Using Angular markup like <code>{{hash}}</code> in a <code>src</code> attribute doesn\'t work right: The browser will fetch from the URL with the literal text <code>{{hash}}</code> until Angular replaces the expression inside <code>{{hash}}</code>. The ngSrc directive solves this problem. For more information check the <a href="https://docs.angularjs.org/api/ng/directive/ngSrc">Angular ngSrc documentation</a>',
                        example: c.attributes.ngSrc
                    },
                        {
                            name: "croppable",
                            type: "Object",
                            required: !0,
                            description: "This attaches the directive to the image element, you can optionally pass an object on which the crop area positioning values will be two way bound, if you pass an object containing the properties top, left, width and height, those values will be used to initialize the crop area, this values should be relative to the unscaled image dimensions.",
                            example: c.attributes.croppable
                        },
                        {
                            name: "cropName",
                            type: "String",
                            required: !1,
                            description: 'Gives you access to the image cropper API from within your view or controller, it attaches the image cropper instance to a property named <code>$croppable</code> inside the local scope, all instances by default are childrens of the <code>$croppable</code> property, if you wish to change the name of the property <code>$croppable</code> you can do so through the <code>cropDirectiveName</code> option, read more about this in the options section of the <a href="#/documentation">Documentation</a>, in this section you can also find information about the available properties and methods in the API.',
                            example: c.attributes.cropName
                        },
                        {
                            name: "cropOptions",
                            type: "Object",
                            required: !1,
                            description: "Provides the ability to set all the options you want to change in a single object, you simply build an object with option names and their corresponding value, pass this object to this attribute and voila! the cropper will follow your custom orders.",
                            example: c.attributes.cropOptions
                        },
                        {
                            name: "cropData",
                            type: "*",
                            required: !1,
                            description: 'If you decide to listen to any of the events emitted by the cropper, this attribute let\'s you optionally pass data to the event listener that will handle such event, the data is passed as the 4th parameter in the handler function, to learn more about this you should check out the events section in the <a href="#/documentation">documentation</a> page. This is useful in case you for example need the ID of the image that triggered the event, then you can set it here and you will have access to it inside the event listener.',
                            example: c.attributes.cropData
                        },
                        {
                            name: "cropShow",
                            type: "Boolean",
                            required: !1,
                            description: "If you require for the cropping functionality to be disabled when instanciated, then set this attribute to <code>False</code> and it will simply create the interface but it will not attach the mouse listeners and will leave the image as is, then you can manually enable the cropping functionality when the user requires it, or to apply another functionality that may collide with the cropper. This attribute is watched, so if you bind it to a variable it will enable the cropper when the variable changes.",
                            example: c.attributes.cropShow
                        }],
                    a.selected = {
                        attribute: a.attributes[0]
                    }
            }])
    } (window.angular),
    function(a) {
        "use strict";
        var b = a.module("AngularCropper");
        b.controller("NavController", ["$scope", "$location", "$timeout",
            function(a, b, c) {
                function d() {
                    c(function() {
                            Prism.highlightAll()
                        },
                        0)
                }
                a.current = b.path(),
                    a.$on("$routeChangeSuccess",
                        function() {
                            a.current = b.path(),
                                d()
                        })
            }])
    } (window.angular),
    function(a) {
        "use strict";
        var b = a.module("AngularCropper");
        b.factory("SampleCode", [function() {
            function a(a) {
                return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
            }
            function b(a, b) {
                return '<pre class="line-numbers"><code class="language-' + b + '">' + a + "</code></pre>"
            }
            function c() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-ratio="16/9"\n',
                    b += "/>",
                    a(b)
            }
            function d() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- This will disable the grid -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-rule-of-thids="false"\n',
                    b += "/>",
                    a(b)
            }
            function e() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- Remember to always quote string values in the attribute -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += "	crop-outout-type=\"'base64'\"\n",
                    b += "/>",
                    a(b)
            }
            function f() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- The value is relative to the unscaled image width -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-width-min="100"\n',
                    b += "/>",
                    a(b)
            }
            function g() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- The value is relative to the unscaled image width -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-width-max="800"\n',
                    b += "/>",
                    a(b)
            }
            function h() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- The value is relative to the unscaled image height -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-height-min="100"\n',
                    b += "/>",
                    a(b)
            }
            function i() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- The value is relative to the unscaled image height -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-height-max="800"\n',
                    b += "/>",
                    a(b)
            }
            function j() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- This will disable the autocropping -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += '	croppable="variableHoldingResult"\n',
                    b += '	crop-auto-cropping="false"\n',
                    b += "/>",
                    a(b)
            }
            function k() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- Remember to always quote string values in the attribute -->\n",
                    b += "<!鈥?- This will output the image as png -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += "	crop-image-type=\"'png'\"\n",
                    b += "/>",
                    a(b)
            }
            function l() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- This will hide the center handles by default -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-center-handles="false"\n',
                    b += "/>",
                    a(b)
            }
            function m() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- This will hide the size hint by default -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-size-hint="false"\n',
                    b += "/>",
                    a(b)
            }
            function n() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- Remember to always quote string values in the attribute -->\n",
                    b += "<!鈥?- This will set my own loading class to the cropper container -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += "	crop-loading-class=\"'my-custom-loader'\"\n",
                    b += "/>",
                    a(b)
            }
            function o() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- This will set opacity of the backdrop image to 0.3 -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-backdrop-opacity="0.3"\n',
                    b += "/>",
                    a(b)
            }
            function p() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- Remember to always quote string values in the attribute -->\n",
                    b += "<!鈥?- This will set the event prefix to customEvent -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += "	crop-event-prefix=\"'customEvent'\"\n",
                    b += "/>",
                    a(b)
            }
            function q() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- Remember to always quote string values in the attribute -->\n",
                    b += "<!鈥?- This will set the attribute options prefix to cropper -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += "	crop-options-prefix=\"'cropper'\"\n",
                    b += '	cropper-width-min="200"\n',
                    b += '	cropper-width-max="800"\n',
                    b += "/>",
                    a(b)
            }
            function r() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- Remember to always quote string values in the attribute -->\n",
                    b += "<!鈥?- This will use the scope variable $cropApis to store all the Cropper instances of named images -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += "	crop-directive-name=\"'$cropApis'\"\n",
                    b += "	crop-name=\"'yourImageInstance'\"\n",
                    b += "/>",
                    a(b)
            }
            function s() {
                var b = "";
                return b += "<!鈥?- Inside your HTML view -->\n\n",
                    b += "<!鈥?- This will disable the cropper's preloader animation -->\n",
                    b += "<img\n",
                    b += '	ng-src="{{ yourImage.src }}"\n',
                    b += "	croppable\n",
                    b += '	crop-preloader="false"\n',
                    b += "/>",
                    a(b)
            }
            function t() {
                var b = [],
                    c = "";
                return c += "// ----- Inside your Angular application file ----- //\n\n",
                    c += "var module = angular.module('yourApp', ['bp.img.cropper']);\n\n",
                    c += "// Inject the cropper default options into your applications configuration\n",
                    c += "module.config(['CroppableDefaults', function(CroppableDefaults) {\n",
                    c += "	CroppableDefaults.aspectRatio = 1;\n",
                    c += "	CroppableDefaults.widthMin    = 100;\n",
                    c += "}]);",
                    b.push(a(c)),
                    c = "",
                    c += "// ----- This should preferibly be inside a controller but can be anywhere ----- //\n\n",
                    c += "// We are getting a handle of the already created module\n",
                    c += "var module = angular.module('yourApp');\n\n",
                    c += "// Controller that will nest the croppable image or images\n",
                    c += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    c += "	$scope.cropperOptions = {\n",
                    c += "		aspectRatio: 1,\n",
                    c += "		widthMin: 100,\n",
                    c += "		widthMax: 400\n",
                    c += "	};\n",
                    c += "}]);",
                    b.push(a(c)),
                    c = "",
                    c += "<!-- Inside your HTML file -->\n\n",
                    c += '<div ng-controller="SampleController">\n',
                    c += "	<img\n",
                    c += '		ng-src="{{ yourImage.src }}"\n',
                    c += "		croppable\n",
                    c += '		crop-options="cropperOptions"\n',
                    c += "	/>\n",
                    c += "</div>",
                    b.push(a(c)),
                    c = "",
                    c += "<!-- Inside your HTML file -->\n\n",
                    c += "<img\n",
                    c += '	ng-src="{{ yourImage.src }}"\n',
                    c += "	croppable\n",
                    c += '	crop-aspect-ratio="1"\n',
                    c += '	crop-min-width="100"\n',
                    c += "/>",
                    b.push(a(c)),
                    c = "",
                    c += "<!-- Inside your HTML file -->\n\n",
                    c += "<!-- You can pass either the $data or the $croppable parameter or both, it doesn鈥檛 matter the order -->\n",
                    c += "<!-- You can also pass any other parameters you need in the callback -->\n",
                    c += "<img\n",
                    c += '	ng-src="{{ yourImage.src }}"\n',
                    c += "	croppable\n",
                    c += '	crop-on-ready="yourCallback($data, $croppable, [yourParameters...])"\n',
                    c += "/>",
                    b.push(a(c)),
                    c = "",
                    b
            }
            function u() {
                var c = {},
                    d = "";
                return c.onSelectStart = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-select-start="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onSelectStart.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take before the interface gets updated\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("Starting crop area selection!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onSelectStart.push(b(a(d), "javascript")),
                    c.onSelectStart.join(""),
                    d = "",
                    c.onSelect = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-select="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onSelect.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take everytime the mouse/touch moves\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("Selecting a crop area!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onSelect.push(b(a(d), "javascript")),
                    c.onSelect.join(""),
                    d = "",
                    c.onSelectEnd = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-select-end="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onSelectEnd.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take at the end of a selection before the interface is updated\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("Finished selecting a crop area!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onSelectEnd.push(b(a(d), "javascript")),
                    c.onSelectEnd.join(""),
                    d = "",
                    c.onMoveStart = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-move-start="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onMoveStart.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take before the crop area is moved\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("Starting to move the crop area!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onMoveStart.push(b(a(d), "javascript")),
                    c.onMoveStart.join(""),
                    d = "",
                    c.onMove = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-move="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onMove.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take everytime the crop area is moved, keep it simple here\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("Moving the crop area!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onMove.push(b(a(d), "javascript")),
                    c.onMove.join(""),
                    d = "",
                    c.onMoveEnd = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-move-end="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onMoveEnd.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take at the end of moving the crop area\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("Stopped moving the crop area!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onMoveEnd.push(b(a(d), "javascript")),
                    c.onMoveEnd.join(""),
                    d = "",
                    c.onEnable = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-enable="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onEnable.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take when the cropper is enabled\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper has been enabled!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onEnable.push(b(a(d), "javascript")),
                    c.onEnable.join(""),
                    d = "",
                    c.onDisable = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-disable="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onDisable.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take when the cropper gets disabled\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper has been disabled!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onDisable.push(b(a(d), "javascript")),
                    c.onDisable.join(""),
                    d = "",
                    c.onReset = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-reset="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onReset.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take when the cropper gets resetted\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper has been resetted!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onReset.push(b(a(d), "javascript")),
                    c.onReset.join(""),
                    d = "",
                    c.onUpdate = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-update="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onUpdate.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take when the cropper interface is updated\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper interface has been updated!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onUpdate.push(b(a(d), "javascript")),
                    c.onUpdate.join(""),
                    d = "",
                    c.onDestroy = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-destroy="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onDestroy.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take after the cropper is destroyed\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper interface has been destroyed and listeners detached!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onDestroy.push(b(a(d), "javascript")),
                    c.onDestroy.join(""),
                    d = "",
                    c.onReady = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-ready="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onReady.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take after the cropper is ready to be used\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper is ready to be used!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onReady.push(b(a(d), "javascript")),
                    c.onReady.join(""),
                    d = "",
                    c.beforeImageLoad = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-before-image-load="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.beforeImageLoad.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take before the source image is loaded\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper is waiting to load the image!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.beforeImageLoad.push(b(a(d), "javascript")),
                    c.beforeImageLoad.join(""),
                    d = "",
                    c.onImageLoad = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-on-image-load="yourCallback()"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.onImageLoad.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Actions you want to take after the source image has been loaded\n",
                    d += "	$scope.yourCallback = function() {\n",
                    d += '		console.log("The cropper has successfully loaded the image!");\n',
                    d += "	};\n",
                    d += "}]);",
                    c.onImageLoad.push(b(a(d), "javascript")),
                    c.onImageLoad.join(""),
                    d = "",
                    c
            }
            function v() {
                var c = {},
                    d = "";
                return d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when a selection starts\n",
                    d += "	$scope.$on('crop.selectStart', function(event, $data, $croppable) {\n",
                    d += '		console.log("Starting crop area selection!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.selectStart = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when a selection is being generated\n",
                    d += "	$scope.$on('crop.select', function(event, $data, $croppable) {\n",
                    d += '		console.log("Selecting an area to crop!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.select = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when a selection is made by the user\n",
                    d += "	$scope.$on('crop.selectEnd', function(event, $data, $croppable) {\n",
                    d += '		console.log("A selection has been generated!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.selectEnd = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the crop area is about to be moved\n",
                    d += "	$scope.$on('crop.moveStart', function(event, $data, $croppable) {\n",
                    d += '		console.log("The crop area has being grabbed to be moved!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.moveStart = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the crop area is being moved\n",
                    d += "	$scope.$on('crop.move', function(event, $data, $croppable) {\n",
                    d += '		console.log("The selection is being moved!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.move = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the crop area finished moving\n",
                    d += "	$scope.$on('crop.moveEnd', function(event, $data, $croppable) {\n",
                    d += '		console.log("The selection finished moving!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.moveEnd = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the cropper is enabled\n",
                    d += "	$scope.$on('crop.enable', function(event, $data, $croppable) {\n",
                    d += '		console.log("The cropper has been enabled!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.enable = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the cropper is disabled\n",
                    d += "	$scope.$on('crop.disable', function(event, $data, $croppable) {\n",
                    d += '		console.log("The cropper has been disabled!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.disable = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the cropper gets manually resetted\n",
                    d += "	$scope.$on('crop.reset', function(event, $data, $croppable) {\n",
                    d += '		console.log("The cropper has been resetted!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.reset = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the cropper interface is updated\n",
                    d += "	$scope.$on('crop.update', function(event, $data, $croppable) {\n",
                    d += '		console.log("The cropper interface has been updated!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.update = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the cropper interface gets destroyed\n",
                    d += "	$scope.$on('crop.destroy', function(event, $data, $croppable) {\n",
                    d += '		console.log("The cropper interface has been destroyed and listeners detached!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.destroy = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take when the cropper interface is ready for use\n",
                    d += "	$scope.$on('crop.ready', function(event, $data, $croppable) {\n",
                    d += '		console.log("The cropper is ready to be used!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.ready = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take before the source image is loaded internally\n",
                    d += "	$scope.$on('crop.beforeImageLoad', function(event, $data, $croppable) {\n",
                    d += '		console.log("The source image is about to be loaded!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.beforeImageLoad = b(a(d), "javascript"),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n",
                    d += "	// Actions you want to take after the image is loaded internally\n",
                    d += "	$scope.$on('crop.imageLoad', function(event, $data, $croppable) {\n",
                    d += '		console.log("The source image has been successfully loaded!");\n',
                    d += "	});\n",
                    d += "}]);",
                    c.imageLoad = b(a(d), "javascript"),
                    d = "",
                    c
            }
            function w() {
                var c = {},
                    d = "";
                return d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += '<!-- This will display the name of the croppable, in this case would be "myImage" -->\n',
                    d += "<p>{{ $croppable.myImage.$name }}</p>",
                    c.$name = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will provide feedback for when the user can make use of the cropper -->\n",
                    d += '<p ng-show="$croppable.myImage.$active">Cropper is active!</p>\n',
                    d += '<p ng-show="!$croppable.myImage.$active">Cropper is NOT active!</p>',
                    c.$active = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will allow user to crop the image only when there is a selection -->\n",
                    d += '<button type="button" ng-disabled="!$croppable.myImage.$hasSelection" ng-click="cropImage()">Crop image!</button>',
                    c.$hasSelection = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will destroy the cropper only if initialized -->\n",
                    d += "<button \n",
                    d += '	type="button" \n',
                    d += '	ng-disabled="!$croppable.myImage.$initialized" \n',
                    d += '	ng-click="$croppable.myImage.$destroy()" \n',
                    d += ">\n",
                    d += "	Destroy!\n",
                    d += "</button>",
                    c.$initialized = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-hide="$croppable.myImage.$loading">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-name="myImage"\n',
                    d += "	>\n",
                    d += "</di>\n\n",
                    d += '<div ng-show="$croppable.myImage.$loading">\n',
                    d += "	Loading the image...\n",
                    d += "</div>",
                    c.$loading = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This message will only be displayed when moving the crop area -->\n",
                    d += '<div ng-show="$croppable.myImage.$moving">\n',
                    d += "	Currently moving the cropped area\n",
                    d += "</div>",
                    c.$moving = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This message will only be displayed when selecting a crop area -->\n",
                    d += '<div ng-show="$croppable.myImage.$selecting">\n',
                    d += "	Currently selecting an area to crop\n",
                    d += "</div>",
                    c.$selecting = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will display the positioning of the crop area -->\n",
                    d += "<p>\n",
                    d += "	The area to crop is:\n",
                    d += "	<ul>\n",
                    d += "		<li>Top: {{ $croppable.myImage.$data.top }}\n",
                    d += "		<li>Left: {{ $croppable.myImage.$data.left }}\n",
                    d += "		<li>Width: {{ $croppable.myImage.$data.width }}\n",
                    d += "		<li>Height: {{ $croppable.myImage.$data.height }}\n",
                    d += "	</ul>\n",
                    d += "</p>",
                    c.$data = b(a(d), "markup"),
                    d = "",
                    d += "<!-- This will display the true dimensions of the image -->\n",
                    d += "<p>\n",
                    d += "	The original image size is \n",
                    d += "		<ul>\n",
                    d += "			<li>Width: {{ $croppable.myImage.$imageInfo.originalWidth }}</li>\n",
                    d += "			<li>Height: {{ $croppable.myImage.$imageInfo.originalHeight }}</li>\n",
                    d += "		</ul>\n",
                    d += "</p>\n\n",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">",
                    c.$imageInfo = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "	The crop area position is:\n",
                    d += "	<ul>\n",
                    d += "		<li>Top: {{ $croppable.myImage.$measurements.top }}\n",
                    d += "		<li>Left: {{ $croppable.myImage.$measurements.left }}\n",
                    d += "		<li>Width: {{ $croppable.myImage.$measurements.width }}\n",
                    d += "		<li>Height: {{ $croppable.myImage.$measurements.height }}\n",
                    d += "	</ul>\n",
                    d += "</p>",
                    c.$measurements = b(a(d), "markup"),
                    d = "",
                    c
            }
            function x() {
                var c = {},
                    d = "";
                return d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will disable the rule of thirds option -->\n",
                    d += '<button type="button" ng-click="$croppable.myImage.$options(\'ruleOfThirds\', false)">Hide grid</button>',
                    c.$options = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will reset the selected area -->\n",
                    d += '<button type="button" ng-click="$croppable.myImage.$clear()">Reset crop!</button>',
                    c.$clear = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will disable/enable the cropper -->\n",
                    d += '<button type="button" ng-click="$croppable.myImage.$toggle()">\n',
                    d += '	{{ $croppable.myImage.$active ? "Disable" : "Enable" }}\n',
                    d += "</button>",
                    c.$toggle = b(a(d), "markup"),
                    d = "",
                    c.$cropIt = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will set a crop area -->\n",
                    d += '<button type="button" ng-click="setArea()">\n',
                    d += "	Set crop area\n",
                    d += "</button>",
                    d += "<!-- This will crop the selected area -->\n",
                    d += '<button type="button" ng-click="cropImage()" ng-disabled="!$croppable.myImage.$hasSelection">\n',
                    d += "	Crop it!\n",
                    d += "</button>",
                    c.$cropIt.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Sets a crop area\n",
                    d += "	$scope.setArea = function() {\n",
                    d += "		var area {\n",
                    d += "			width: 100,\n",
                    d += "			height: 100,\n",
                    d += "			top: 150,\n",
                    d += "			left: 80,\n",
                    d += "		};\n",
                    d += "		$scope.$croppable.myImage.$cropIt(area);\n",
                    d += "	};\n",
                    d += "	// Crops the image\n",
                    d += "	$scope.cropImage = function() {\n",
                    d += "		$scope.yourImage.src = $scope.$croppable.myImage.$cropIt().base64;\n",
                    d += "	};\n",
                    d += "}]);",
                    c.$cropIt.push(b(a(d), "javascript")),
                    c.$cropIt.join(""),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will remove the cropper UI -->\n",
                    d += '<button type="button" ng-click="$croppable.myImage.$destroy()">\n',
                    d += "	Destroy cropper!\n",
                    d += "</button>",
                    c.$destroy = b(a(d), "markup"),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '	ng-src="{{ yourImage.src }}"\n',
                    d += "	croppable\n",
                    d += '	crop-name="myImage"\n',
                    d += ">\n\n",
                    d += "<!-- This will remove the cropper UI -->\n",
                    d += '<button type="button" ng-click="$croppable.myImage.$destroy()" ng-show="$croppable.myImage.$initialized">\n',
                    d += "	Destroy cropper!\n",
                    d += "</button>\n",
                    d += "<!-- This will initialize the cropper -->\n",
                    d += '<button type="button" ng-click="$croppable.myImage.$init()" ng-hide="$croppable.myImage.$initialized">\n',
                    d += "	Rebuild cropper!\n",
                    d += "</button>",
                    c.$init = b(a(d), "markup"),
                    d = "",
                    c
            }
            function y() {
                var b = [],
                    c = "";
                return c += "// 鈥?-- Inside your main SCSS files 鈥斺€?- //\n\n",
                    c += "// First override the default variables\n",
                    c += '@import "path/to/my-variables.scss";\n\n',
                    c += "// Then import the croppers styling file\n",
                    c += '@import "path/to/angular.cropper.scss";',
                    b.push(a(c)),
                    c = "",
                    c += "<!-- Inside your HTML header 鈥斺€?>\n\n",
                    c += "<!鈥?- Load the croppers styling 鈥?->\n",
                    c += '<link rel="stylesheet" href="path/to/angular.cropper.css">',
                    b.push(a(c)),
                    c = "",
                    c += "<!鈥?- Before your closing body tag 鈥?->\n\n",
                    c += "<!鈥?- Load all the magical Angular code 鈥?->\n",
                    c += '<script src="path/to/angular.js"></script>\n\n',
                    c += "<!鈥?- Load the cropping directive -->\n",
                    c += '<script src="path/to/angular.cropper.js"></script>',
                    b.push(a(c)),
                    c = "",
                    c += "// Inside your applications module creation file\n\n",
                    c += "angular.module('yourApp', ['bp.img.cropper']);",
                    b.push(a(c)),
                    c = "",
                    c += "<!鈥?- Inside your HTML document -->\n",
                    c += '<img ng-src="{{ yourImage.src }}" croppable />',
                    b.push(a(c)),
                    c = "",
                    c += "<!鈥?- Inside your HTML document -->\n",
                    c += "<img\n",
                    c += '	ng-src=""\n',
                    c += '	croppable=""\n',
                    c += '	crop-name=""\n',
                    c += '	crop-options=""\n',
                    c += '	crop-data=""\n',
                    c += '	crop-show=""\n',
                    c += "/>",
                    b.push(a(c)),
                    c = "",
                    b
            }
            function z() {
                var c = {},
                    d = "";
                return d += "<!-- The buggy way to write it -->\n",
                    d += '<img src="http://www.gravatar.com/avatar/{{hash}}"/>\n\n',
                    d += "<!-- The correct way to write it -->\n",
                    d += '<img ng-src="http://www.gravatar.com/avatar/{{hash}}"/>',
                    c.ngSrc = b(a(d), "markup"),
                    d = "",
                    c.croppable = [],
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	// This values will be used to initialize crop area\n",
                    d += "	// values should be relative to the unscaled image size\n",
                    d += "	// any changes to the crop area will be updated by cropper to this model\n",
                    d += "	$scope.cropResult = {\n",
                    d += "		top: 10,\n",
                    d += "		left: 10,\n",
                    d += "		width: 350,\n",
                    d += "		height: 400\n",
                    d += "	};\n\n",
                    d += "}]);",
                    c.croppable.push(b(a(d), "javascript")),
                    d = "",
                    d += "<!鈥?- Inside your HTML view -->\n\n",
                    d += "<img\n",
                    d += '  ng-src="{{ yourImage.src }}"\n',
                    d += '  croppable="cropResult"\n',
                    d += ">",
                    c.croppable.push(b(a(d), "markup")),
                    c.croppable.join(""),
                    d = "",
                    c.cropName = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-name="cropInstance"\n',
                    d += "	>\n\n",
                    d += '	<p ng-hide="$croppable.cropInstance.active && $croppable.cropInstance.hasSelection">\n',
                    d += "		Please click and drag on the image to select a crop area\n",
                    d += "	</p>\n\n",
                    d += '	<button type="button" ng-show="$croppable.cropInstance.hasSelection" ng-click="saveCrop()">Crop it!</button>\n',
                    d += "</div>",
                    c.cropName.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// You can send the crop area positioning to the server here and do the cropping in the server\n",
                    d += "	// and then update the url of the newly cropped image.\n",
                    d += "	$scope.saveCrop = function() {\n",
                    d += "		// Update the image source using the generated base64 string\n",
                    d += "		$scope.yourImage.src = $scope.$croppable.cropInstance.$cropIt().base64;\n",
                    d += "		// Disable the cropper so that the image is no longer active for cropping\n",
                    d += "		$scope.$croppable.cropInstance.toggle();\n",
                    d += "	};\n",
                    d += "}]);",
                    c.cropName.push(b(a(d), "javascript")),
                    c.cropName.join(""),
                    d = "",
                    c.cropOptions = [],
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	$scope.cropperOptions = {\n",
                    d += "		heightMin: 10,\n",
                    d += "		heightMax: 400\n",
                    d += "		aspectRatio: 1\n",
                    d += "	}\n",
                    d += "}]);",
                    c.cropOptions.push(b(a(d), "javascript")),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-options="cropperOptions"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.cropOptions.push(b(a(d), "markup")),
                    c.cropOptions.join(""),
                    d = "",
                    c.cropData = [],
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-data="yourImage.id"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.cropData.push(b(a(d), "markup")),
                    d = "",
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg', // png's are supported as well\n",
                    d += "		id: 10\n",
                    d += "	};\n\n",
                    d += "	$scope.$on('crop.selectStart', function(event, $data, $croppable, imageId) {\n",
                    d += "		// This is the value you passed through the crop-data attribute\n",
                    d += "		console.log(imageId); // This will print 10\n",
                    d += "	});\n",
                    d += "}]);",
                    c.cropData.push(b(a(d), "javascript")),
                    c.cropData.join(""),
                    d = "",
                    c.cropShow = [],
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // png's are supported as well\n",
                    d += "	};\n\n",
                    d += "	// Disable the cropper by default\n",
                    d += "	$scope.cropEnabled = false;\n",
                    d += "}]);",
                    c.cropShow.push(b(a(d), "javascript")),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-show="cropEnabled"\n',
                    d += "	>\n\n",
                    d += "	<button type=\"button\" ng-click=\"!cropEnabled\">{{ cropEnabled ? 'Disable' : 'Enable' }} Cropper</button>\n",
                    d += "</div>",
                    c.cropShow.push(b(a(d), "markup")),
                    c.cropShow.join(""),
                    d = "",
                    c.cropImageDimensions = [],
                    d += "// ----- Anywhere inside your Angular application -----//\n\n",
                    d += "// Get a handle of your already created app module\n",
                    d += "var module = angular.module('yourApp');\n\n",
                    d += "// Inside the scope that holds the image\n",
                    d += "module.controller('SampleController', ['$scope', function($scope) {\n\n",
                    d += "	$scope.yourImage = {\n",
                    d += "		src: '/your/image/url.jpeg' // This image has been reduced in size to save bandwidth, it is 300 x 900 pixels\n",
                    d += "	};\n\n",
                    d += "	// This are the dimensions of the original image\n",
                    d += "	// so the cropper can use the right value to calculate the crop area position\n",
                    d += "	// and when you crop the original image on the server you have the correct positioning\n",
                    d += "	$scope.imageDimensions = {\n",
                    d += "		width: 1200,\n",
                    d += "		height: 3600\n",
                    d += "}]);",
                    c.cropImageDimensions.push(b(a(d), "javascript")),
                    d = "",
                    d += "<!-- Inside your HTML view -->\n\n",
                    d += '<div ng-controller="SampleController">\n',
                    d += "	<img\n",
                    d += '		ng-src="{{ yourImage.src }}"\n',
                    d += "		croppable\n",
                    d += '		crop-image-dimensions="imageDimensions"\n',
                    d += "	>\n",
                    d += "</div>",
                    c.cropImageDimensions.push(b(a(d), "markup")),
                    c.cropImageDimensions.join(""),
                    d = "",
                    c
            }
            var A = {};
            return A.options = {
                aspectRatio: c(),
                ruleOfThirds: d(),
                outputType: e(),
                widthMin: f(),
                widthMax: g(),
                heightMin: h(),
                heightMax: i(),
                autoCropping: j(),
                imageType: k(),
                centerHandles: l(),
                sizeHint: m(),
                loadingClass: n(),
                backdropOpacity: o(),
                eventPrefix: p(),
                optionsPrefix: q(),
                directiveName: r(),
                preloader: s()
            },
                A.documentation = t(),
                A.callbacks = u(),
                A.events = v(),
                A.properties = w(),
                A.methods = x(),
                A.installation = y(),
                A.attributes = z(),
                A
        }])
    } (window.angular);
