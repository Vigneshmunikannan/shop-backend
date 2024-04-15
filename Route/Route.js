const express = require('express');
const { add,categories, getitem,deleteitem,update,senddetails} = require('../Controller/ownerController');

const router = express.Router();

router.post('/additems', add);

router.get('/categories',categories)

router.get('/item/:itemCategory', getitem);

router.delete('/item/:itemName',deleteitem)

router.put('/item/:itemName',update)

router.post('/place-order',senddetails)

module.exports = router;
