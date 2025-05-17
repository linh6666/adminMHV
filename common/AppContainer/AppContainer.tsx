import React, { ReactNode } from "react";
import classes from "./AppContainer.module.css";

type AppContainerProps = {
  children?: ReactNode;
  className?: string;
};

const AppContainer: React.FC<AppContainerProps> = ({
  children,
  className = "",
  ...otherProps
}) => {
  return (
    <div className={`${classes.root} ${className}`} {...otherProps}>
      {children}
    </div>
  );
};

export default AppContainer;
