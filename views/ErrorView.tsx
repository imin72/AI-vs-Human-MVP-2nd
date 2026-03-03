import React from 'react';
import { Button } from '../components/Button';

interface ErrorViewProps {
  t: any;
  message: string;
  onReset: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ t, message, onReset }) => {
  return (
    <div className="glass-panel p-8 text-center text-red-400 rounded-3xl">
      <h3 className="text-xl font-bold mb-4">{t.title}</h3>
      <p className="mb-6">{message}</p>
      <Button onClick={onReset} variant="outline" className="mt-4">{t.btn_reset}</Button>
    </div>
  );
};
