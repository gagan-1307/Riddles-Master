import React from 'react';
import { ErrorBoundary } from './error';

function ProfileContent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profile Page</h1>
      <p>This is a placeholder page for Testing. Protected route test works!</p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}
