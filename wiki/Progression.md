# Streaks
A core feature of Ultra, responsible for driving both neuroplastic and habitual growth.

## Formalisation of Streak Rules
It's important to formalise the rules of streaks, as they're a deceptively complex mechanic, acting within the interaction between time and ultra progression.

### Waking Day
A "waking day" is defined as a day, from the moment you wake up to the 
moment you sleep. At the end of a waking day, all streaks reset. The end of 
a waking day is considered (for leniancy), to be 4am the next day of a 
particular day.

#### Example

If the date is the 11th April 2020, and the time is 8pm, the waking
day is the 11th April. If the date is now the 12th April 2020, and the 
time is 3am, the waking day is still the 11th April. When the time is 
4:01am, the waking day is now the 12th April. Thus the 'waking day' assumes the user sleeps at exactly 4am. Whether they actually do that is a philosophical and chronobiological question, and right now, I don't really care, I just want a mechanic that works with the user, not against them.

#### Why use the waking day system?
1. Most people are still awake some minutes and hours past 12 o'clock
     midnight. This means that if they forget to do their streaks and
     remember at a time like 11pm or 11:30pm, it will be too late. This is 
     unfair and the waking day system mitigates this.

### Streak Obtained
"Streak obtained" is a flag variable on the "Talent" type. If its true, a streak hit can't be made for the rest of the waking day, and its assumed a streak hit was already made at some point during the waking day.

#### Rules
1. A talent is flagged as streak obtained when a session of at least 30 minutes in length starts just after the beginning of a waking day, and ends before the end of a waking day.
2. A talent is not flagged as streak obtained when there has been one session or more, but no session has a length of at least 30 minutes (a streak hit).
3. A talent is not flagged as streak obtained when there are no sessions.

### Expiring
A talent is considered to be "expiring" when the last streak hit had been made over 28 hours ago.

#### Rules
1. A talent is flagged as expiring when the last streak hit had ended over 28 hours ago.
2. A talent is not flagged as expiring when the last streak hit ended over 48 hours ago. If this is the first time this was detected, an expiration should occur.

### Expiration
A talent undergoes "expiration" when the last streak hit has been made over 48 hours ago.

#### Rules
1. During the first time that the last streak hit made over 48 hours ago is detected, 1 ultra should be removed and the streak counter should be reset to 0. This initiates a burndown.
2. A burndown is where every 24 hours that a streak hit fails to be made, another ultra is removed.
3. The burndown stops when a streak hit is made.

#### Implementation Thoughts
Although seemingly complicated, if the amount of ultras held and their current progress is stored at the end of every session, we can use basic functions to extrapolate from timestamps what the current state of the progression should be.