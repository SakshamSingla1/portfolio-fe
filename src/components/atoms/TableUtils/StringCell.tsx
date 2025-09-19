import React from 'react';

interface StringCellProps {
    data: string;
    props: { [key: string]: any };
}

const StringCell: React.FC<StringCellProps> = ({ data, props }) => {
    const truncatedText = data?.length > 30 ? `${data.substring(0, 30)}...` : data;
    return (
        <div title={data} {...props}>
            {/* <span>{truncatedText}</span> */}
            <span>{data}</span>
        </div>
    );
}
export default StringCell