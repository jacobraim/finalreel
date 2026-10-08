// Builds index.html from src/template.html + src/data.js + src/engine.js
const fs = require("fs"), path = require("path");
const src = f => fs.readFileSync(path.join(__dirname, "src", f), "utf8");
let body = src("template.html")
  .replace("/*DATA*/", () => src("data.js"))
  .replace("/*ENGINE*/", () => src("engine.js"));
const title = body.match(/<title>.*?<\/title>/)[0];
body = body.replace(title, "");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${title}
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("Built index.html");
