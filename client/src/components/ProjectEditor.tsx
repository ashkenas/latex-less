import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_PROJECT } from '../queries';
import '../styles/Project.css';
import WaitForData from './WaitForData';

const ProjectEditor: React.FC = () => {
    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_PROJECT, {
        variables: { id: id }
    });

    if (loading || error)
        return <WaitForData loading={loading} error={error} />;

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default ProjectEditor;
