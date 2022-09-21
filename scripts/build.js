const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const ts = require("typescript");

const srcDir = "src";
const distDir = "dist";

const fmts = [
    { format: "iife", ext: "js" },
    { format: "cjs", ext: "cjs" },
    { format: "esm", ext: "mjs" },
];

fmts.forEach((fmt) => {
    const srcPath = `${srcDir}/kanovel.ts`;
    const distPath = `${distDir}/kanovel.${fmt.ext}`;
    const log = () => console.log(`-> ${distPath}`);

    esbuild
        .build({
            bundle: true,
            sourcemap: true,
            minify: true,
            keepNames: true,
            loader: {
                ".png": "dataurl",
                ".glsl": "text",
                ".mp3": "binary",
            },
            entryPoints: [srcPath],
            globalName: "kanovel",
            format: fmt.format,
            outfile: distPath,
        })
        .then(log);
});

function writeFile(path, content) {
    fs.writeFileSync(path, content);
    console.log(`-> ${path}`);
}

buildTypes();

// generate .d.ts / docs data
function buildTypes() {
    let dts = fs.readFileSync(`${srcDir}/types.ts`, "utf-8");

    const f = ts.createSourceFile("ts", dts, ts.ScriptTarget.Latest, true);

    function transform(o, f) {
        for (const k in o) {
            if (o[k] == null) {
                continue;
            }
            const v = f(k, o[k]);
            if (v != null) {
                o[k] = v;
            } else {
                delete o[k];
            }
            if (typeof o[k] === "object") {
                transform(o[k], f);
            }
        }
        return o;
    }

    // transform and prune typescript ast to a format more meaningful to us
    const stmts = transform(f.statements, (k, v) => {
        switch (k) {
            case "end":
            case "flags":
            case "parent":
            case "modifiers":
            case "transformFlags":
            case "modifierFlagsCache":
                return;
            case "name":
            case "typeName":
            case "tagName":
                return v.escapedText;
            case "pos":
                return typeof v === "number" ? undefined : v;
            case "kind":
                return ts.SyntaxKind[v];
            case "questionToken":
                return true;
            case "members": {
                const members = {};
                for (const mem of v) {
                    const name = mem.name?.escapedText;
                    if (!name || name === "toString") {
                        continue;
                    }
                    if (!members[name]) {
                        members[name] = [];
                    }
                    members[name].push(mem);
                }
                return members;
            }
            case "jsDoc": {
                const doc = v[0];
                const taglist = doc.tags ?? [];
                const tags = {};
                for (const tag of taglist) {
                    const name = tag.tagName.escapedText;
                    if (!tags[name]) {
                        tags[name] = [];
                    }
                    tags[name].push(tag.comment);
                }
                return {
                    doc: doc.comment,
                    tags: tags,
                };
            }
            default:
                return v;
        }
    });

    // check if global defs are being generated
    let globalGenerated = false;

    // window attribs to overwrite
    const overwrites = new Set(["origin", "focus"]);

    // contain the type data for doc gen
    const types = {};
    const sections = [
        {
            name: "Start",
            entries: ["kaboom"],
        },
    ];

    // generate global decls for KaboomCtx members
    let globalDts = "";

    globalDts += `import { KaNovelPlugin } from "kanovel"\n`;
    globalDts += "declare global {\n";

    for (const stmt of stmts) {
        if (!types[stmt.name]) {
            types[stmt.name] = [];
        }

        types[stmt.name].push(stmt);

        if (stmt.name === "KaNovelPlugin") {
            if (stmt.kind !== "InterfaceDeclaration") {
                throw new Error("KaNovelPlugin must be an interface.");
            }

            for (const name in stmt.members) {
                const mem = stmt.members[name];

                if (overwrites.has(name)) {
                    globalDts += "\t// @ts-ignore\n";
                }

                globalDts += `\tconst ${name}: KaNovelPlugin["${name}"]\n`;

                const tags = mem[0].jsDoc?.tags ?? {};

                if (tags["section"]) {
                    const name = tags["section"][0];
                    const docPath = path.resolve(`doc/sections/${name}.md`);
                    sections.push({
                        name: name,
                        entries: [],
                        doc: fs.existsSync(docPath)
                            ? fs.readFileSync(docPath, "utf8")
                            : null,
                    });
                }

                const curSection = sections[sections.length - 1];

                if (name && !curSection.entries.includes(name)) {
                    curSection.entries.push(name);
                }
            }

            globalGenerated = true;
        }
    }

    globalDts += "}\n";

    if (!globalGenerated) {
        throw new Error("KaboomCtx not found, failed to generate global defs.");
    }

    writeFile(`${distDir}/kanovel.d.ts`, dts);
    writeFile(`${distDir}/global.d.ts`, globalDts);
}
