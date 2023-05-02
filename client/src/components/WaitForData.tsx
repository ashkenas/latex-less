import ErrorPage from "./ErrorPage";
import "../styles/WaitForData.scss";

type WaitForDataType = React.FC<{
  loading?: boolean,
  error?: any
}>;

const WaitForData: WaitForDataType = ({ loading, error }) => {
  if (loading) return (
    <div className="level">
      <div className="level-item">
        <div className="spinner"></div>
      </div>
    </div>
  );
  if (error) return <ErrorPage code={500} message={error.message} />
  return <p>Invalid use of WaitForData</p>;
}

export default WaitForData;
