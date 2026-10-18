import express from "express";

import type {
    Request,
    Response,
    NextFunction
} from "express";

import futbolRoutes from "./routes/futbol.route.js";

const app = express();

const PORT: number = 3001;

// Permitir recibir datos JSON
app.use(express.json());

// Rutas de la API
app.use("/api", futbolRoutes);

// Gestión de errores
app.use((
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({
            message: "JSON incorrecto"
        });
        return;
    }

    console.error(error);

    res.status(500).json({
        message: "Error interno del servidor"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );
});