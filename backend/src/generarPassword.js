const bcrypt = require("bcrypt");


async function generar(){

    const password = "CrediNissan2026*";


    const hash = await bcrypt.hash(
        password,
        10
    );


    console.log(hash);

}


generar();