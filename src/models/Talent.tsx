export type Talent = {
    id: number
    name: string
    progress: number
    whiteStars: number
}

export function createTalent(id: number, name: string, progress: number, whiteStars: number): Talent {
    return {
        id: id,
        name: name,
        progress: progress,
        whiteStars: whiteStars
    }
}

export function cloneTalent(talent: Talent): Talent {
    return {
        id: talent.id,
        name: talent.name,
        progress: talent.progress,
        whiteStars: talent.whiteStars
    }
}