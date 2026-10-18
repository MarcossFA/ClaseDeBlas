import type { Equipo } from "../model/futbol.model.ts";

export let equipos: Equipo[] = [];

let siguienteEquipoId: number = 1;
let siguienteJugadorId: number = 1;

export const changeEquipos = (newEquipos: Equipo[]) => {
    equipos = newEquipos;
}

export const generarEquipoId = (): number => {
    return siguienteEquipoId++;
}

export const generarJugadorId = (): number => {
    return siguienteJugadorId++;
}