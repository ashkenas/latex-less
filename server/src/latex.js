import { spawn } from "child_process";
import fs from "fs/promises";

const encodings = {
  '`': '\\`{}',
  '^': '\\^{}',
  '~': '$\\sim$',
  '$': '\\$',
  '&': '\\&',
  '%': '\\%',
  '#': '\\#',
  '$': '\\$',
  '{': '\\{',
  '}': '\\}',
  '\\': '\\\\'
};

const escapeInput = (text) => {
  return text.replaceAll(/([\^\\`~$&%#{}])/g, (match, c, offset, string, groups) => encodings[c]);
};

const makeTex = (name, left, right, responses) => {
return `\\documentclass{article}
\\usepackage{fancyhdr}
\\usepackage[utf8]{inputenc}
\\usepackage{csquotes}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\topmargin=-.45in
\\evensidemargin=0in
\\oddsidemargin=0in
\\textwidth=6.5in
\\textheight=9.0in
\\linespread{1.1}

\\MakeOuterQuote{"}

\\pagestyle{fancy}
${left ? `\\lhead{${escapeInput(left)}}` : ''}
\\chead{${escapeInput(name)}}
${right ? `\\rhead{${escapeInput(right)}}` : ''}

\\begin{document}
${responses.map(r => `
\\section*{${escapeInput(r.name)}}

${escapeInput(r.text)}
`).join('\n')}
\\end{document}

`};

export const projectToFile = async (project) => {
  const text = makeTex(project.name, project.left, project.right, project.responses);
  const cleanName = project.name.replaceAll(/[^a-zA-Z0-9]/g, '');
  const jobName = `${cleanName}-${Date.now()}`;
  const latex = spawn('pdflatex', ['-output-directory=docs', `-job-name=${jobName}`, '-halt-on-error', '--']);
  let output = '';
  latex.stderr.on('data', d => output += d.toString());
  latex.stdout.on('data', d => output += d.toString());
  const code = await new Promise((resolve, reject) => {
    latex.on('exit', resolve);
    latex.on('error', reject);
    latex.stdin.write(text, (err) => err && reject(err));
  });
  if (code)
    throw output;
  return `docs/${jobName}.pdf`;
};



