const esbuild = require("esbuild");

esbuild.build({
    bundle: true,
    sourcemap: false,
    minify: true,
    keepNames: true,
    loader: {
        ".png": "dataurl",
        ".glsl": "text",
        ".mp3": "binary",
    },
    entryPoints: ["example/game.ts"],
    globalName: "kanovel",
    format: "iife",
    outfile: "example/main.js",
});
