import React, { PropsWithChildren } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import styles from '../styles/SmartLink.module.scss';

const SmartLink: React.FC<PropsWithChildren<LinkProps>> = ({ to, children }) => {
  const { pathname } = useLocation();
  const className = pathname === to ? styles.here : '';
  return <Link to={to} className={className}>{children}</Link>;
};

export default SmartLink;
