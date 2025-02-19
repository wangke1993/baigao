const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const vueCompiler = require("vue-template-compiler");
const generate = require("@babel/generator").default;

// 配置参数
const TARGET_DIR = process.cwd(); // 当前工作目录

const EXTENSIONS = [".js", ".vue"]; // 目标文件扩展名

// 存储分析结果
const apiReferences = new Map();
const arr = [
  "api",
  "uview-ui",
  "uni_modules",
  "node_modules",
  "uni-datetime-picker",
  "uni-data-picker",
  "lime-signature",
];
const EXCLUDE_DIR_ARR = []; // 排除的目录
arr.forEach((item) => {
  EXCLUDE_DIR_ARR.push(path.join(TARGET_DIR, item));
});
const excludedDirectory = (fullPath) => {
  return EXCLUDE_DIR_ARR.some((dir) => fullPath.startsWith(dir));
};

// 1. 文件遍历器
function scanFiles(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  return files.flatMap((file) => {
    const fullPath = path.join(dirPath, file.name);
    // 跳过排除目录
    if (excludedDirectory(fullPath)) return [];
    if (file.isDirectory()) {
      return scanFiles(fullPath);
    } else if (EXTENSIONS.includes(path.extname(file.name))) {
      return [fullPath];
    }
    return [];
  });
}

// 2. 解析文件内容
function parseFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  // 处理 Vue 单文件组件
  if (path.extname(filePath) === ".vue") {
    const parsed = vueCompiler.parseComponent(content); // 正确用法
    content = parsed.script?.content || ""; // 提取 <script> 部分
  }
  try {
    return parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  } catch (e) {
    console.warn(`解析失败: ${filePath}`, e.message);
    return null;
  }
}

// 3. 分析API引用
function analyzeAPICalls(ast, filePath) {
  traverse(ast, {
    ImportDeclaration(babelPath) {
      const source = babelPath.node.source.value;
      if (source.indexOf("api") == -1) return;
      const importPath = path.resolve(
        path.dirname(filePath), // 正确引用Node.js path模块
        source
      );
      const apiMethods = [];
      babelPath.node.specifiers.forEach((specifier) => {
        if (specifier.type === "ImportSpecifier") {
          apiMethods.push({
            imported: specifier.imported.name,
            local: specifier.local.name,
          });
        } else if (specifier.type === "ImportDefaultSpecifier") {
          apiMethods.push({
            imported: "default",
            local: specifier.local.name,
          });
        }
      });
      // 记录引用关系
      if (apiMethods.length > 0) {
        const relativePath = path.relative(TARGET_DIR, importPath);
        const entry = apiReferences.get(relativePath) || {
          file: relativePath,
          methods: new Set(),
          referencedBy: new Set(),
        };
        apiMethods.forEach((m) => entry.methods.add(m.imported));
        entry.referencedBy.add(path.relative(TARGET_DIR, filePath));
        let key = relativePath.split("\\").pop();
        if (!key.endsWith(".js")) {
          key += ".js";
        }
        apiReferences.set(key, entry);
      }
    },
  });
}

// 执行分析
const allFiles = scanFiles(TARGET_DIR);
console.log("allFiles", allFiles.length);
allFiles.forEach((file) => {
  //   console.log("file", file);
  const ast = parseFile(file);
  if (ast) analyzeAPICalls(ast, file);
});

// 输出结果
const obj = {};
apiReferences.forEach((value, key) => {
  //   console.log(`\nAPI文件: ${key}`);
  obj[key] = { methods: Array.from(value.methods) };
  //   console.log(`被引用的方法: ${Array.from(value.methods).join(", ")}`);
  //   console.log(
  //     `引用者文件: ${Array.from(value.referencedBy).join("\n          ")}`
  //   );
});
// fs.writeFileSync("obj.json", JSON.stringify(obj), "utf-8");
// API 目录路径
const apiDir = path.join(__dirname, "api");
// 获取所有 JS 文件
const files = fs
  .readdirSync(apiDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => ({
    fileName: file,
    fullPath: path.join(apiDir, file),
  }));
// 处理单个文件
function processFile(file) {
  const { fileName, fullPath } = file;
  // 如果文件不在 obj 中，直接删除
  if (!Boolean(obj[fileName])) {
    fs.unlinkSync(fullPath);
    // console.log(`🗑️ 删除文件: ${fileName}`);
    return;
  }

  // 需要保留的方法列表
  const keepMethods = obj[fileName].methods;

  // 读取文件内容
  const content = fs.readFileSync(fullPath, "utf8");

  // 解析 AST
  const ast = parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"], // 按需添加插件
  });

  // 遍历 AST 删除未保留的方法
  traverse(ast, {
    // 处理函数声明
    FunctionDeclaration(mPath) {
      const funcName = mPath.node.id?.name;
      //   console.log("方法名", funcName, keepMethods.includes(funcName));
      if (!keepMethods.includes(funcName)) {
        mPath.remove();
      }
    },
  });

  // 生成新代码
  //   const newContent = generate(ast).code;
  //   fs.writeFileSync(fullPath, newContent);
}
files.forEach(processFile);
