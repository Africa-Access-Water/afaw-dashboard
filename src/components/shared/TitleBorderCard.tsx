
import { Card } from "flowbite-react";
import React from "react";

interface TitleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  onDownload?: () => void;
}

const TitleCard: React.FC<TitleCardProps> = ({
  children,
  className,
  title,
}) => {


  return (
    <Card className={`card-elevated p-0 ${className}`}>
      <div className="flex justify-between items-center border-b border-border dark:border-darkborder card-spacing-sm">
        <h5 className="heading-4">{title}</h5>
      </div>
      <div className="card-spacing">{children}</div>
    </Card>
  );
};

export default TitleCard;
