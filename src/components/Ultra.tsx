import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { ReactComponent as UltraImage } from '../assets/images/Ultra.svg';
import { cGhostBlue, cUltraBlue, cGold } from './constants';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const FlashingUltra = styled(UltraImage)`
@-webkit-keyframes flash {
	0% { opacity: 1; } 
    20% { opacity: 0; }
    80% { opacity: 0; }
	100% { opacity: 1; }
}
@keyframes flash {
	0% { opacity: 1; } 
    20% { opacity: 0; }
    80% { opacity: 0; }
	100% { opacity: 1; }
}

-webkit-animation: flash linear 1s infinite;
animation: flash linear 1s infinite;
`;

type UltraProps = {
    progress: number,
    progressTarget: number,
    todaysProgress?: number,
    closeTarget?: number,
    background?: string,
    backgroundOpacity?: string,
    beingTimed?: boolean
}

function Ultra(props: UltraProps) {
    let progress = 0;
    let progressNorm = 0;
    let flashbarScale = 0;
    let todaysProgress = 0;
    if (props.todaysProgress !== undefined) {
        // Limit progress as emulated progress results in values greater than 1
        progress = Math.min(props.progress, props.progressTarget)
        progressNorm = (progress - props.todaysProgress) / props.progressTarget;
        progressNorm = Math.max(progressNorm, 0);
        // progressNorm = Math.floor(progressNorm * 100) / 100;

        todaysProgress = Math.min((progress + props.todaysProgress) / props.progressTarget, 1);

        flashbarScale = Math.min(props.beingTimed ? progressNorm + 0.05 : 0, 1);
    }

    let backgroundOpacity = props.backgroundOpacity ?? "1";
    let topFill = progressNorm === 1 ? cGold : cUltraBlue;
    let closeTarget = Math.min(props.closeTarget ?? 0, 1);

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
            <UltraImage opacity={0.5} fill={topFill}
                style={{
                    position: "relative",
                    transform: `scale(${closeTarget})`,
                    transformOrigin: "bottom left",
                    transitionTimingFunction: "ease-out",
                    transitionDuration: "300ms",
                    gridColumn: 1,
                    gridRow: 1,
                }} />
            <FlashingUltra fill={cGold}
                style={{
                    position: "relative",
                    transform: `scale(${flashbarScale})`,
                    transformOrigin: "bottom left",
                    transitionTimingFunction: "ease-out",
                    transitionDuration: "300ms",
                    gridColumn: 1,
                    gridRow: 1
                }} />
            <UltraImage fill={topFill}
                style={{
                    position: "relative",
                    transform: `scale(${todaysProgress})`,
                    transformOrigin: "bottom left",
                    transitionTimingFunction: "ease-out",
                    transitionDuration: "300ms",
                    gridColumn: 1,
                    gridRow: 1,
                }} />
            <UltraImage fill="#FFF"
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