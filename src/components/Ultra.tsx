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
    let progressNorm = props.progress / props.progressTarget;
    progressNorm = Math.floor(progressNorm * 100) / 100;

    let backgroundOpacity = props.backgroundOpacity ?? "1";
    let topFill = progressNorm === 1 ? cGold : cUltraBlue;
    return (
        <>
        <div style={{
            display: "grid"
        }}>
            <UltraImage opacity={backgroundOpacity}
                fill={props.background ?? cGhostBlue}
                style={{
                    gridColumn: 1,
                    gridRow: 1
                }} />
            <UltraImage fill={topFill}
                style={{
                    position: "relative",
                    transform: `scale(${progressNorm})`,
                    transformOrigin: "bottom left",
                    transitionTimingFunction: "ease-out",
                    transitionDuration: "300ms",
                    gridColumn: 1,
                    gridRow: 1,
                }} />
        </div>
        </>
    )
}

export default Ultra;