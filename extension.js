// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const doc = dom.window.document;
const el = doc.createElement('div');

dom.window.NodeList.prototype.forEach = dom.window.HTMLCollection.prototype.forEach =
  Array.prototype.forEach;

function genCss(node) {
  if (node.__proto__.constructor.name === 'HTMLCollection') {
    let str = '';
    node.forEach((t, i) => {
      const curStr = genCss(t);
      str += curStr;
    });
    return str;
  } else {
    // 第一个class 或 tag
    const myClass =
      node.classList && node.classList.value ? node.classList[0] : '';
    const tag = node.tagName.toLocaleLowerCase();
    let str = `${myClass ? '.' + myClass : tag}{`;

    if (node.children) {
      node.children.forEach((t, i) => {
        const curStr = genCss(t);
        str += curStr;
      });
    }
    return str + '}';
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "scssBoost" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.scssBoost',
    function () {
      // The code you place here will be executed every time your command is executed

      // 步骤分解
      // 1. 获取选中文本信息
      // 2. 获取选中文本位置
      // 3. 获取console分隔符配置
      // 4. 添加console代码

      const activeTextEditor = vscode.window.activeTextEditor;
      const activeDocument = activeTextEditor.document;
      // 1. 获取所有选中行信息
      const selection = activeTextEditor.selection;
      // 当前选中文本内容
      const curText = activeDocument.getText(selection);

      el.innerHTML = curText;
      const r = genCss(el.children);
      console.log(r);

      const clipboardy = require('clipboardy');

      clipboardy.writeSync('// 🦄 \r\n' + r);
      // 调用编辑接口
      //   const insertPositon = new vscode.Position(1, 1);
      //   TextEditorEdit.insert(insertPositon, `console.log('r', ${r});\n`);
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
