import React, { useEffect, useState, useCallback } from 'react';

import { advanceTo } from 'jest-date-mock';

import { cGhostBlue, cUltraBlue } from './constants';


function UltraConsole() {
    let con = JSON.parse(localStorage.getItem("chronobreak") ?? "false");

    useEffect(() => {
        if (!con) return;

        let dayJump = parseInt(localStorage.getItem("dayjump") ?? "0");
        let timeModifier = parseInt(localStorage.getItem("timemod") ?? "100");
    
        let today = JSON.parse(localStorage.getItem("timehack") ?? JSON.stringify(new Date()));
    
        // Jump forward in time
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + dayJump);
        advanceTo(tomorrow)

        if (dayJump !== 0) {
            localStorage.setItem("dayjump", "0");
        }
    
        // Emulate temporal progression
        setInterval(() => {
            let tomorrow = new Date();
            tomorrow.setMilliseconds(tomorrow.getMilliseconds() + 100 * timeModifier);
            advanceTo(tomorrow);
            localStorage.setItem("timehack", JSON.stringify(tomorrow));
        }, 100);
    }, []);

    let previousLogs: string[] = JSON.parse(localStorage.getItem("logs") ?? "[]");

    const [ entry, setEntry ] = useState("");
    const [ log, setLog ] = useState(previousLogs);

    const typeCommandEntry = useCallback((e: any) => {
        setEntry(e.target.value);
    }, [setEntry])
    const fireCommandEntry = useCallback((e: any) => {
        function niceDate(date: Date): string {
            let raw = date.toString();
            const [ _, month, day, year, time ] = raw.split(" ");
            return `${month} ${day} ${year} ${time}`;
        }

        function scribe(text: string) {
            let newLog = [
                ...log,
                `${niceDate(new Date())}: ${text}`
            ];
            setLog(newLog);
            localStorage.setItem("logs", JSON.stringify(newLog));
        }

        e.preventDefault();
        setEntry("");

        let strVal: string = entry;
        if (strVal.startsWith("jump ") &&
            !isNaN(parseInt(strVal.split(" ")[1]))) {
            let timeComponent = strVal.split(" ");
            let nDays = timeComponent[1];
            localStorage.setItem("dayjump", nDays);

            scribe(`Jumping ahead by ${nDays} days...`);

            window.location.reload();
        } else if (strVal.startsWith("accelerate ") &&
            !isNaN(parseInt(strVal.split(" ")[1]))) {
            let timeComponent = strVal.split(" ");
            let mod = timeComponent[1];
            localStorage.setItem("timemod", mod);

            scribe(`Accelerating time by ${mod}x...`);

            window.location.reload();
        } else if (strVal === "clear") {
            setLog([]);
            localStorage.setItem("logs", "[]");
        } else if (strVal === "help") {
            scribe(`You'll get no help here.`);
        } else {
            scribe(`"${strVal}" isn't a valid input. Do you belong here?`);
        }

        setTimeout(() => {
            let dLog = document.getElementById("eco");
            dLog?.scrollTo(0, dLog.scrollHeight);
        }, 10);
    }, [entry, setEntry, log, setLog])

    setTimeout(() => {
        let dLog = document.getElementById("eco");
        dLog?.scrollTo(0, dLog.scrollHeight);
    }, 10);

    if (!con)
        return <></>

    return (
        <div className="mt-4 d-inline-block" style={{
            border: `8px solid ${cGhostBlue}`,
            borderRadius: "4px",
            width: "33vw",
            minHeight: "20vh",
            backgroundColor: cGhostBlue
        }}>
            <span style={{
                fontFamily: "Inter",
                color: cUltraBlue,
                fontSize: "3rem"
            }}>
                Chronobreak
            </span>
            <div id="eco" className="mx-auto p-1" style={{
                backgroundColor: "#1C1E26",
                fontFamily: "Inter",
                color: cGhostBlue,
                minHeight: "16vh",
                maxHeight: "16vh",
                textAlign: "left",
                borderBottom: "none",
                overflowY: "scroll"
            }}>
                {log.map((el: string) => <div>{el}</div>)}
            </div>
            <form onSubmit={fireCommandEntry}>
                <input className="p-1"
                style={{
                    backgroundColor: "#1C1E26",
                    fontFamily: "Inter",
                    minHeight: "4vh",
                    width: "100%",
                    color: cGhostBlue,
                    border: "none",
                    borderTop: "1px solid #FFF",
                }}
                value={entry}
                onChange={typeCommandEntry}>
                </input>
            </form>
        </div>
    )
}

export default UltraConsole;