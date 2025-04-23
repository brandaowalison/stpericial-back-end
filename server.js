require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/connect.js')
const { swaggerUi, swaggerSpec } = require('./src/docs/swagger.js')
const casesRouter = require('./src/routes/case.route.js')
const usersRouter = require('./src/routes/user.route.js')
const evidencesRouter = require('./src/routes/evidence.route.js')
const reportsRouter = require('./src/routes/report.route.js')
const victimsRouter = require('./src/routes/victim.route.js')
const dentalRouter = require('./src/routes/dentalRecord.route.js')
const generalRecord = require('./src/routes/gR.route.js')


const PORT = process.env.PORT || 3000
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use('/api/cases', casesRouter)
app.use('/api/users', usersRouter)
app.use('/api/evidences', evidencesRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/victims', victimsRouter)
app.use('/api/dentalRecord', dentalRouter)
app.use('/api/genRecord', generalRecord)

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server in running on http://localhost:${PORT}`);
        });
    } catch(error) {
        console.log(`Error starting the server on http://localhost:${PORT}`, error);
        process.exit(1);
    }
};

startServer();
