import React from 'react';
import { useAlert } from '../AlertContext';
import './Alert.css';

function Alert() {
  const { alert } = useAlert();

  if (!alert) return null;

  return <div className={`alert alert--${alert.type}`}>{alert.msg}</div>;
}

export default Alert;
