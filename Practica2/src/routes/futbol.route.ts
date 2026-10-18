import { Router } from "express";

import {
    getEquipos,
    getEquipoWithID,
    createEquipo,
    deleteEquipo,
    changeEquipo,
    getJugadores,
    createJugador,
    deleteJugador,
    moveJugador
} from "../controllers/futbol.controller.js";

const router = Router();

router.get("/equipos", getEquipos);
router.get("/equipos/:id", getEquipoWithID);
router.post("/equipos", createEquipo);
router.put("/equipos/:id", changeEquipo);
router.delete("/equipos/:id", deleteEquipo);

router.get("/equipos/:id/jugadores", getJugadores);
router.post("/equipos/:id/jugadores", createJugador);
router.delete("/equipos/:id/jugadores/:jugadorId", deleteJugador);
router.patch("/equipos/:id/jugadores/:jugadorId/mover", moveJugador);

export default router;