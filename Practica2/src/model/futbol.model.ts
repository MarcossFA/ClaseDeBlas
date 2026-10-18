export interface Jugador {
    id: number;
    nombre: string;
    goles: number;
}

export interface Equipo {
    id: number;
    nombre: string;
    division: string;
    jugadores: Jugador[];
}