import React from 'react';

const SVG = ({ children, component: Component = 'svg', width = 24, height = 24, viewBox = "0 0 24 24", fill = "#6f6f6f" }) => (
  <Component width={width} height={height} viewBox={viewBox} fill={fill}>
    {children}
  </Component>
)

const Database = () => (
  <SVG>
    <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
  </SVG>
);

const Close = () => (
  <SVG>
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" /><path fill="none" d="M0 0h24v24H0z" />
  </SVG>
);


const Open = () => (
  <SVG>
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /><path fill="none" d="M0 0h24v24H0z" />
  </SVG>
);

export { SVG, Database, Open, Close };