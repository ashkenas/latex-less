import fs from "fs";

const escapeInput = (text) => {
  return text;
};

const makeTex = (name, responses) => {
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
\\lhead{Student Name}
\\chead{${escapeInput(name)}}
\\rhead{Additional Text}

\\begin{document}



Problem Response

${responses.map(r => `
\\section*{${escapeInput(r.name)}}

${r.text}
`).join('\n')}

\\end{document}`
};

export const projectToFile = async (project) => {
  const text = makeTex(project.name, project.responses);
  fs.writeFile(`tmp/${project._id}.tex`)
};



