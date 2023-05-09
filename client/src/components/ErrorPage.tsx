import '../styles/ErrorPage.scss';

type ErrorProps = {
  code: number,
  message: string
}

const ErrorPage: React.FC<ErrorProps> = ({ code, message }) => {
  return (
    <div className="container">
      <div className="section">
        <h1 className="title">{code}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
