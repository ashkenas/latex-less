import '../styles/ErrorPage.css';

type ErrorProps = {
    code: number,
    message: string
}

const ErrorPage: React.FC<ErrorProps> = ({ code, message }) => {
    return (<div className="error">
        <h1>{code}</h1>
        <p>{message}</p>
    </div>);
};

export default ErrorPage;
