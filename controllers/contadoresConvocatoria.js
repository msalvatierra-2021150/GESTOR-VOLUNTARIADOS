//Importación del modelo
const ContadoresConvocatoria = require('../models/contadoresConvocatoria');

const getContadoresConvocatoria = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const contadoresConvocatoria = await ContadoresConvocatoria.findOne({ convocatoria: id });
        return res.json({ contadoresConvocatoria });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const postContadoresConvocatoriaPrimeraVez = async (id) => {
    try {
        const contadoresConvocatoria = new ContadoresConvocatoria({ convocatoria: id });
        await contadoresConvocatoria.save();
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    postContadoresConvocatoriaPrimeraVez,
    getContadoresConvocatoria
}