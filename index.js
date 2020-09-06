const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const db = require('./utils/DBConfig.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// const { User } = require('./models/Model');
const Role = db.role;
const ROLEs = require('./utils/config.js').ROLEs;

// force: true will drop the table if it already exists <<<<<<<<<<<
sequelize_force = false

db.sequelize.sync({
    force: sequelize_force
}).then(() => {
    sequelize_force ? 
    console.log("\x1b[31m"+'----> Drop and Resync with { force: '+sequelize_force+' }', "\x1b[0m") :
    console.log("\x1b[32m"+'----> Drop and Resync with { force: '+sequelize_force+' }', "\x1b[0m");
    (async () => {
        initial();
    })();
});

app.use(cors());
app.use(bodyParser.json());
require('./routes/router.js')(app);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => console.log(`\x1b[33mExample app listening at http://localhost:${port} \x1b[0m`));

function initial() {
    for (let index = 0; index < ROLEs.length; index++) {
        Role.create({
            id: index + 1,
            name: ROLEs[index]
        }).catch( () => {});
    }
}
