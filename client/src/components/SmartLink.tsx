import React, { PropsWithChildren } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import '../styles/SmartLink.scss';

const SmartLink: React.FC<PropsWithChildren<LinkProps>> = ({ to, children }) => {
  const { pathname } = useLocation();
  const className = 'navbar-item' + (pathname === to ? ' here' : '');
  return <Link to={to} className={className}>{children}</Link>;
};

export default SmartLink;
