import '../styles/Home.scss';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="section">
        <h1 className="title is-3">LaTeXLess</h1>
        <p>
          Welcome to LaTeXLess, a website where you can interactively
          build nicely formatted documents without learning all the
          nuances and intricacies of LaTeX!
        </p>
        <p>
          The <code>Equations</code> tab allows you to create some
          default equations that will automatically be included in all
          new projects that you start.
        </p>
        <p>
          The <code>Projects</code> tab allows you to create, edit,
          and delete any projects you may have made.
        </p>
      </div>
      <div className="section">
        <h2 className="title is-5">Keyboard Shortcuts</h2>
        <p>
          The following keyboard shortcuts work while you are editing
          a project.
        </p>
        <p>
          Press <code>ctrl + s</code> at any time to save your work.
        </p>
        <p>
          Press <code>ctrl + p</code> at any time to export your work.
        </p>
      </div>
    </div>
  );
};

export default Home;
