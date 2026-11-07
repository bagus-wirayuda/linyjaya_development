const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath, pathToFileURL } = require("node:url");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((x) =>
      x.isDirectory() ? walk(path.join(dir, x.name)) : [path.join(dir, x.name)],
    );
}
let failed = false;
const areas = ["public", "admin", "client", "karyawan", "pimpinan"];
const sources = ["js", "css", ...areas].flatMap((dir) =>
  walk(path.join(root, dir)),
);
const files = sources.filter((f) => f.endsWith(".js"));
for (const file of files) {
  const r = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (r.status) {
    failed = true;
    console.error(r.stderr);
  }
}
function checkAsset(source, base, reference) {
  const destination = path.resolve(base, reference);
  if (
    !destination.startsWith(root + path.sep) ||
    !fs.existsSync(destination) ||
    !fs.statSync(destination).isFile()
  ) {
    console.error(`${path.relative(root, source)}: missing asset ${reference}`);
    failed = true;
  }
}
const entries = [
  ...fs.readdirSync(root).map((name) => path.join(root, name)),
  ...sources,
].filter((file) => file.endsWith(".html"));
for (const file of entries) {
  const html = fs.readFileSync(file, "utf8");
  const baseHref = /<base href="([^"]+)"/.exec(html)?.[1] || ".";
  const fileBase = new URL(baseHref, pathToFileURL(file));
  const stylesheets = [
    ...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g),
  ];
  if (stylesheets.length !== 1 || stylesheets[0][1] !== "css/style.css") {
    console.error(`${path.relative(root, file)}: expected one shared stylesheet`);
    failed = true;
  }
  for (const [, reference] of html.matchAll(
    /(?:src|href)="([^"#]+)"/g,
  )) {
    const target = new URL(reference, fileBase);
    if (target.protocol === "file:" && reference !== baseHref)
      checkAsset(file, root, fileURLToPath(target));
  }
}
const stylesheets = sources.filter((f) => f.endsWith(".css"));
if (
  stylesheets.length !== 1 ||
  stylesheets[0] !== path.join(root, "css", "style.css")
) {
  console.error("Expected exactly one CSS file at css/style.css.");
  failed = true;
}
for (const file of stylesheets) {
  const css = fs.readFileSync(file, "utf8");
  if (/@import\b/.test(css)) {
    console.error("The shared stylesheet must not import other stylesheets.");
    failed = true;
  }
  for (const [, reference] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (!/^(?:data:|https?:|#)/.test(reference))
      checkAsset(file, path.dirname(file), reference);
  }
}
if (failed) process.exitCode = 1;
else
  console.log(
    `Validated ${files.length} JavaScript files, ${entries.length} HTML files, and local CSS assets.`,
  );
