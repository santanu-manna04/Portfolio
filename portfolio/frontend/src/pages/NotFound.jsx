import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Page not found');
  return (
    <div className="container section center">
      <h1 className="big-404">404</h1>
      <p className="lead">This page does not exist or has moved.</p>
      <Link className="btn btn-primary" to="/">Back to home</Link>
    </div>
  );
}
