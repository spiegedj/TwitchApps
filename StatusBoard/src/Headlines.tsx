import * as React from "react";

declare const marquee: any;

interface IHeadlineProps
{
    headlines: Response.Headline[];
}

export const Headlines = ({ headlines }: IHeadlineProps) =>
{
    return <div className="marquee">
        <div>
            {headlines.map(headline => <span className="headline" dangerouslySetInnerHTML={{ __html: headline.Title }}></span>)}
        </div>
    </div>;
}