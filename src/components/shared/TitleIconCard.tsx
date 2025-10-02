
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import React from "react";

interface TitleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  onDownload?: () => void;
}

const TitleIconCard: React.FC<TitleCardProps> = ({
  children,
  className,
  title,
  onDownload,
}) => {


  return (
    <Card className={`card-elevated p-0 ${className}`}>
      <div className="flex justify-between items-center border-b border-border dark:border-darkborder card-spacing-sm">
        <h5 className="heading-4">{title}</h5>

        <Button
          className="btn-primary flex items-center"
          size="sm"
          onClick={onDownload}
        >
          <Icon
            icon="solar:download-minimalistic-bold-duotone"
            width={20}
            height={20}
          />
        </Button>
      </div>
      <div className="card-spacing">{children}</div>
    </Card>
  );
};

export default TitleIconCard;
