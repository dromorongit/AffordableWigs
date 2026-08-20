const fs = require("fs");
const path = require("path");

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

const copy = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.warn(`Skip missing source: ${src}`);
    return;
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${src} -> ${dest}`);
};

copy(path.join(root, "public"), path.join(standaloneDir, "public"));
copy(path.join(root, ".next", "static"), path.join(standaloneDir, ".next", "static"));
