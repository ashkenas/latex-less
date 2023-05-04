import { spawn } from "child_process";

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
  '\\': '\\textbackslash{}'
};

const escapeInput = (text) => {
  return text.replaceAll(/[\^\\`~$&%#{}]/g, (c) => encodings[c]);
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
\\section*{${r.name}}

${r.text}
`).join('\n')}
\\end{document}

`};

const equationRegex = /(.*?)((?<!{)(?:{{[^{}]*?}})(?!})|(?:{{{[^{}]*?}}}))/gs;

const processResponse = equations => response => {
  let compiled = '';
  let match;
  let lastIndex = -1;
  while ((match = equationRegex.exec(response.text)) !== null) {
    const block = match[2].startsWith('{{{');
    const offset = block ? 3 : 2;
    const name = match[2].substring(offset, match[2].length - offset).trim();
    const equation = equations[name];
    if (block && equation) {
      compiled += escapeInput(match[1]) + '\\begin{equation*}' + equation + '\\end{equation*}';
    } else {
      compiled += escapeInput(match[1]) + (equation ? `$${equation}$` : escapeInput(match[2]));
    }
    lastIndex = equationRegex.lastIndex;
  }
  compiled += escapeInput(response.text.substring(lastIndex + 1))
  return {
    name: escapeInput(response.name),
    text: compiled.split('\n').join('\\\\')
  };
};

export const projectToFile = async (project) => {
  const equations = project.equations.reduce((es, e) => (es[e.name] = e.text, es), {});
  const processed = project.responses.map(processResponse(equations));
  const text = makeTex(project.name, project.left, project.right, processed);
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



