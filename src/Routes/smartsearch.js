'use strict';


const { Router } = require('express');

const Hospital = require('../model/hospital')
const cors = require('cors');
const smartsearchideal=require('../model/smartsearch')







let smart_search = Router();
smart_search.use(cors());

smart_search.get('/ideal', async (req, res) => {
    try {
         const sm =await smartsearchideal.find({})
            
            return res.status(200).json({ payload: sm[0] })
        
    }
    catch (err) {
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }
});

smart_search.get('', async (req, res) => {
    try {
        console.log(req.query)
        if(req.query.insurance==='',req.query.speciality===''){
            return res.status(200).json({ message: "empty filed" })
        }
        if (req.query.insurance) {
            const insurance = req.query.insurance;
            console.log(insurance)
            let enqurie = await Hospital.find({
                insurance: {
                    $elemMatch: {
                        insurance_company_name:  new RegExp(insurance, 'i')
                      }
                }
            })
            if(req.query.speciality /*&& enqurie.length !==0*/ ){
                for(const sp of enqurie){
                    console.log(req.query.speciality)
                   if( sp.speciality.find(item => item === req.query.speciality)){
                    console.log("inside")
                   }else{
                    console.log("outside")
                    enqurie= enqurie.filter(item => item._id !== sp._id)
                    console.log(enqurie.length)
                   }


                }

            }
            return res.status(200).json({ payload: enqurie })
        }
        if (req.query.speciality) {
            const speciality = req.query.speciality;
            console.log(speciality)
            let enqurie = await Hospital.find({
                speciality: 
                    new RegExp(speciality, 'i')
                      
                
            })
           
            
            return res.status(200).json({ payload: enqurie })
        }
    }
    catch (err) {
        return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
    }
});
module.exports = smart_search;