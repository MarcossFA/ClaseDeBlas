import type { Request, Response } from "express";

import {
    changeEquipos,
    equipos,
    generarEquipoId,
    generarJugadorId
} from "../data/futbol.data.js";

import type {
    Equipo,
    Jugador
} from "../model/futbol.model.js";


// ======================================
// FUNCIONES AUXILIARES
// ======================================

// Comprobar que un ID es válido
const validarId = (valor: string): number | null => {

    if (!/^[1-9][0-9]*$/.test(valor)) {
        return null;
    }

    const id = Number(valor);

    if (!Number.isSafeInteger(id)) {
        return null;
    }

    return id;
}


// Buscar un equipo por ID
export const findEquipo = (
    id: number,
    res: Response
): Equipo | undefined => {

    const equipo = equipos.find(x => x.id === id);

    if (!equipo) {
        res.status(404).json({
            message: "Equipo no encontrado"
        });

        return;
    }

    return equipo;
}


// Validar los datos de un equipo
const validarEquipo = (
    datos: unknown
): datos is { nombre: string; division: string } => {

    return (
        typeof datos === "object" &&
        datos !== null &&
        !Array.isArray(datos) &&
        "nombre" in datos &&
        "division" in datos &&
        typeof datos.nombre === "string" &&
        typeof datos.division === "string" &&
        datos.nombre.trim() !== "" &&
        datos.division.trim() !== ""
    );
}


// Validar los datos de un jugador
const validarJugador = (
    datos: unknown
): datos is { nombre: string; goles: number } => {

    return (
        typeof datos === "object" &&
        datos !== null &&
        !Array.isArray(datos) &&
        "nombre" in datos &&
        "goles" in datos &&
        typeof datos.nombre === "string" &&
        datos.nombre.trim() !== "" &&
        typeof datos.goles === "number" &&
        Number.isSafeInteger(datos.goles) &&
        datos.goles >= 0
    );
}


// ======================================
// MÉTODOS DE EQUIPOS
// ======================================


// GET - Obtener todos los equipos
export const getEquipos = (
    req: Request,
    res: Response
) => {

    res.status(200).json(equipos);
}


// GET - Obtener un equipo por ID
export const getEquipoWithID = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    if (id === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipo = findEquipo(id, res);

    if (equipo) {
        res.status(200).json(equipo);
    }
}


// POST - Crear un equipo
export const createEquipo = (
    req: Request,
    res: Response
) => {

    const datos: unknown = req.body;

    if (!validarEquipo(datos)) {
        res.status(400).json({
            message: "Nombre y división obligatorios"
        });

        return;
    }

    const nuevoEquipo: Equipo = {
        id: generarEquipoId(),
        nombre: datos.nombre.trim(),
        division: datos.division.trim(),
        jugadores: []
    };

    changeEquipos([...equipos, nuevoEquipo]);

    res.status(201).json(nuevoEquipo);
}


// DELETE - Eliminar un equipo
export const deleteEquipo = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    if (id === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipo = findEquipo(id, res);

    if (equipo) {

        changeEquipos(
            equipos.filter(x => x.id !== id)
        );

        res.status(200).json({
            message: "Equipo y jugadores eliminados correctamente"
        });
    }
}


// PUT - Modificar un equipo
export const changeEquipo = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    if (id === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipo = findEquipo(id, res);

    if (!equipo) {
        return;
    }

    const datos: unknown = req.body;

    if (!validarEquipo(datos)) {
        res.status(400).json({
            message: "Datos del equipo no válidos"
        });

        return;
    }

    const updatedEquipo: Equipo = {
        ...equipo,
        nombre: datos.nombre.trim(),
        division: datos.division.trim()
    };

    changeEquipos(
        equipos.map(x => x.id === id ? updatedEquipo : x)
    );

    res.status(200).json({
        message: "Equipo actualizado correctamente",
        equipo: updatedEquipo
    });
}


// ======================================
// MÉTODOS DE JUGADORES
// ======================================


// GET - Obtener los jugadores de un equipo
export const getJugadores = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    if (id === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipo = findEquipo(id, res);

    if (equipo) {
        res.status(200).json(equipo.jugadores);
    }
}


// POST - Añadir un jugador a un equipo
export const createJugador = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    if (id === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipo = findEquipo(id, res);

    if (!equipo) {
        return;
    }

    const datos: unknown = req.body;

    if (!validarJugador(datos)) {
        res.status(400).json({
            message: "Datos del jugador no válidos"
        });

        return;
    }

    const nuevoJugador: Jugador = {
        id: generarJugadorId(),
        nombre: datos.nombre.trim(),
        goles: datos.goles
    };

    equipo.jugadores.push(nuevoJugador);

    res.status(201).json(nuevoJugador);
}


// DELETE - Eliminar un jugador de un equipo
export const deleteJugador = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    const jugadorId = validarId(
        String(req.params.jugadorId)
    );

    if (id === null || jugadorId === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipo = findEquipo(id, res);

    if (!equipo) {
        return;
    }

    const jugador = equipo.jugadores.find(
        x => x.id === jugadorId
    );

    if (!jugador) {
        res.status(404).json({
            message: "Jugador no encontrado en este equipo"
        });

        return;
    }

    equipo.jugadores = equipo.jugadores.filter(
        x => x.id !== jugadorId
    );

    res.status(200).json({
        message: "Jugador eliminado correctamente"
    });
}


// PATCH - Cambiar un jugador de equipo
export const moveJugador = (
    req: Request,
    res: Response
) => {

    const id = validarId(String(req.params.id));

    const jugadorId = validarId(
        String(req.params.jugadorId)
    );

    if (id === null || jugadorId === null) {
        res.status(400).json({
            message: "ID no válido"
        });

        return;
    }

    const equipoOrigen = findEquipo(id, res);

    if (!equipoOrigen) {
        return;
    }

    const jugador = equipoOrigen.jugadores.find(
        x => x.id === jugadorId
    );

    if (!jugador) {
        res.status(404).json({
            message: "Jugador no encontrado en este equipo"
        });

        return;
    }

    const datos: unknown = req.body;

    if (
        typeof datos !== "object" ||
        datos === null ||
        Array.isArray(datos) ||
        !("equipoDestinoId" in datos) ||
        typeof datos.equipoDestinoId !== "number" ||
        !Number.isSafeInteger(datos.equipoDestinoId) ||
        datos.equipoDestinoId <= 0
    ) {
        res.status(400).json({
            message: "ID del equipo destino no válido"
        });

        return;
    }

    const destinoId = datos.equipoDestinoId;

    if (id === destinoId) {
        res.status(400).json({
            message: "El jugador ya pertenece a este equipo"
        });

        return;
    }

    const equipoDestino = equipos.find(
        x => x.id === destinoId
    );

    if (!equipoDestino) {
        res.status(404).json({
            message: "Equipo destino no encontrado"
        });

        return;
    }

    // Eliminar jugador del equipo de origen
    equipoOrigen.jugadores = equipoOrigen.jugadores.filter(
        x => x.id !== jugadorId
    );

    // Añadir jugador al equipo de destino
    equipoDestino.jugadores.push(jugador);

    res.status(200).json({
        message: "Jugador cambiado de equipo correctamente",
        jugador: jugador,
        equipoOrigen: equipoOrigen.nombre,
        equipoDestino: equipoDestino.nombre
    });
}