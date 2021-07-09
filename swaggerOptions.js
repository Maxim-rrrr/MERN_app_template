const swaggerOptions = {
    swaggerDefinition: {
        info: {
        version: "1.0.0",
        title: "Документация API",
        description: "",
        contact: {
            name: "Maxim Semenov <kewin.rrrr@gmail.com>"
        },
        servers: ["http://localhost:4000"]
        }
    },
    // ['.routes/*.js']
    apis: [
        "./routers/authRouter.js"
    ]
};

export default swaggerOptions