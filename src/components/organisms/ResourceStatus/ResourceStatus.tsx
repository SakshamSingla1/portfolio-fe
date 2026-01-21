import React from "react";
import { RESOURCE_STATUS } from "../../../utils/constant";
import { useColors } from "../../../utils/types";

interface ResourceStatusProps {
    status: string;
    colourMap?: { [key: string]: string }
}

const ResourceStatus: React.FC<ResourceStatusProps> = ({ status, colourMap }) => {
    const colors = useColors();
    const STATUS_COLOR = {
        [RESOURCE_STATUS.ACTIVE]: colors.success500,
        [RESOURCE_STATUS.INACTIVE]: colors.warning500,
        [RESOURCE_STATUS.BLOCKED]: colors.error500,
        [RESOURCE_STATUS.DELETED]: colors.error500,
    };

    const STATUS_BACKGROUND_COLOR = {
        [RESOURCE_STATUS.ACTIVE]: colors.success50,
        [RESOURCE_STATUS.INACTIVE]: colors.warning50,
        [RESOURCE_STATUS.BLOCKED]: colors.error50,
        [RESOURCE_STATUS.DELETED]: colors.error50,
    };

    const STATUS_BORDER_COLOR = {
        [RESOURCE_STATUS.ACTIVE]: colors.success500,
        [RESOURCE_STATUS.INACTIVE]: colors.warning500,
        [RESOURCE_STATUS.BLOCKED]: colors.error500,
        [RESOURCE_STATUS.DELETED]: colors.error500,
    };
    
    const getStatusColor = (status: string) => {
        return colourMap ? colourMap[status] : STATUS_COLOR[status];
    };
    const getBackgroundColor = (status: string) => {
        return colourMap ? colourMap[status] : STATUS_BACKGROUND_COLOR[status];
    };

    const getBorderColor = (status: string) => {
        return colourMap ? colourMap[status] : STATUS_BORDER_COLOR[status];
    };
    
    return (
        <span 
            style={{ 
                color: getStatusColor(status), 
                backgroundColor: getBackgroundColor(status), 
                borderRadius: '9999px', 
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'capitalize',
                border: `1px solid ${getBorderColor(status)}`,
            }}
        >
            {status}
        </span>
    );
}

export default ResourceStatus;