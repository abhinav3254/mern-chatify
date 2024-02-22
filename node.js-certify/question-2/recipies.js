var express = require('express');
var router = express.Router();
var recipes = require('../recipes.json');

router.get('/step/:id', (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id) || id < 1 || id > recipes.length) {
        return res.status(400).send("NOT_FOUND");
    }

    const recipe = recipes[id - 1];
    let elapsedTime = parseInt(req.query.elapsedTime) || 0;

    if (isNaN(elapsedTime) || elapsedTime < 0) {
        return res.status(400).send("INVALID_ELAPSED_TIME");
    }

    // Return index 0 if elapsedTime is 0
    if (elapsedTime === 0) {
        return res.json({ index: 0 });
    }

    let currentStepIndex = 0;
    let totalElapsedTime = 0;

    for (let i = 0; i < recipe.timers.length; i++) {
        totalElapsedTime += recipe.timers[i];
        if (totalElapsedTime > elapsedTime) {
            currentStepIndex = i;
            break;
        }
    }

    res.json({ index: currentStepIndex });
});

module.exports = router;
