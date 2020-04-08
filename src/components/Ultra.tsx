import React from 'react';

import { ReactComponent as UltraImage } from '../assets/images/Ultra.svg';
import { cGhostBlue, cUltraBlue, cGold } from './constants';

type UltraProps = {
    progress: number,
    progressTarget: number,
    background?: string,
    backgroundOpacity?: string,
}

function Ultra(props: UltraProps) {
    let scaleRatio = 33 / 50;

    let initialWidth = 126;
    let progressNorm = props.progress / props.progressTarget;
    let newWidth = progressNorm * initialWidth;

    let newTopOffset = (initialWidth - newWidth) * scaleRatio * scaleRatio;

    let backgroundOpacity = props.backgroundOpacity ?? "1";

    let topFill = progressNorm === 1 ? cGold : cUltraBlue;

    return (
        <>
        <UltraImage opacity={backgroundOpacity}
            fill={props.background ?? cGhostBlue} />
        <UltraImage fill={topFill} style={{
            position: "absolute",
            top: `${newTopOffset}px`,
            left: "15px",
            right: "0",
            bottom: "0",
            width: `${newWidth}px`
        }} />
        </>
    )
}

export default Ultra;