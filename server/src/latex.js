import { spawn } from "child_process";
import fs from "fs/promises";

const escapeInput = (text) => {
  return text;
};

const makeTex = (name, left, right, responses) => {
return `\\documentclass{article}
\\usepackage{fancyhdr}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\topmargin=-.45in
\\evensidemargin=0in
\\oddsidemargin=0in
\\textwidth=6.5in
\\textheight=9.0in
\\linespread{1.1}

\\pagestyle{fancy}
${left ? `\\lhead{${escapeInput(left)}}` : ''}
\\chead{${escapeInput(name)}}
${right ? `\\rhead{${escapeInput(right)}}` : ''}

\\begin{document}
${responses.map(r => `
\\section*{${escapeInput(r.name)}}

${r.text}
`).join('\n')}
\\end{document}

`};

export const projectToFile = async (project) => {
  const text = makeTex(project.name, project.left, project.right, project.responses);
  const cleanName = project.name.replaceAll(/[^a-zA-Z0-9]/g, '');
  const jobName = `${cleanName}-${Date.now()}`;
  const latex = spawn('pdflatex', ['--output-directory=docs', `--job-name=${jobName}`, '--']);
  await new Promise((resolve, reject) => {
    latex.on('exit', resolve);
    latex.stdin.write(text, (err) => err && reject(err));
  });
  return `docs/${jobName}.pdf`;
};



