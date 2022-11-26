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
    entryPoints: ["test/game.ts"],
    globalName: "kanovel",
    format: "iife",
    outfile: "test/main.js",
});
