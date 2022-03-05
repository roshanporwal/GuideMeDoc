"use strict";

const { Router } = require("express");
const bodyParser = require("body-parser");
const util = require("util");
const path = require("path");
const fs = require("fs");
var fileupload = require("express-fileupload");
const enquries = require("../model/enquriespatient");
const generatePassword = require("../Api/password");
const cors = require("cors");
var authenticateToken = require("../middleware/verifytoken");
var isadmin = require("../middleware/isadmin");
var constants = require("../constant");
var sendmailenquirycompletion = require("../middleware/sendmailenquirycompletion");

let addEnquriespatient = Router();
addEnquriespatient.use(fileupload());
addEnquriespatient.use(cors());

addEnquriespatient.get(
  "/:id/enquiry/:patient",
  [authenticateToken, isadmin],
  async (req, res) => {
    try {
      const enqurie = await enquries.find({ _id: req.params.patient });
      return res.status(200).json({ payload: enqurie });
    } catch (err) {
      return res
        .status(404)
        .json({ error: err, message: "something went wrong pls check filed" });
    }
  }
);
addEnquriespatient.get(
  "/:id/:spec",
  [authenticateToken, isadmin],
  async (req, res) => {
    try {
      if (req.params.spec === "null") {
        const enqurie = await enquries.find({});
        return res.status(200).json({ payload: enqurie });
      }
      const enqurie = await enquries.find({ type: req.params.spec });
      return res.status(200).json({ payload: enqurie });
    } catch (err) {
      return res
        .status(404)
        .json({ error: err, message: "something went wrong pls check filed" });
    }
  }
);
//add new enquries
addEnquriespatient.post("/:id/create", authenticateToken, async (req, res) => {
  try {
    console.log("hi");
    const formValues = JSON.parse(req.body.formValues);
    console.log(formValues);
    formValues['enquiry_date'] = new Date()
    const dir = `./tmp/${formValues.name}`;
    formValues.reports = [];
    if (req.files !== null) {
      //check insurance_card_copy is present or not
      if (req.files.insurance_card_copy) {
        let insurance = req.files.insurance_card_copy;
        fs.mkdir(dir, { recursive: true }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("New directory successfully created.");
          }
        });
        let insurance_path = `${dir}/` + insurance.name;
        let insurance_viewurl =
           "/view?filepath=" + insurance_path;
        let insurance_downloadurl =
           "/download?filepath=" + insurance_path;
        formValues.insurance_card_copy = [
          insurance_viewurl,
          insurance_downloadurl,
        ];
        insurance.mv(insurance_path, function (err, result) {
          if (err) throw err;
        });
      }
      //check for patient_document present or not
      if (req.files.patient_document) {
        let identification = req.files.patient_document;
        fs.mkdir(dir, { recursive: true }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("New directory successfully created.");
          }
        });
        let identification_path = `${dir}/` + identification.name;
        let identification_viewurl =
           "/view?filepath=" + identification_path;
        let identification_downloadurl =
           "/download?filepath=" + identification_path;
        formValues.identification_document = [
          identification_viewurl,
          identification_downloadurl,
        ];

        identification.mv(identification_path, function (err, result) {
          if (err) throw err;
        });
      }
      //check for patient_reports present or not
      if (req.files.patient_reports) {
        if (req.files.patient_reports.length === undefined) {
          let patient_report = req.files.patient_reports;
          fs.mkdir(dir, { recursive: true }, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("New directory successfully created.");
            }
          });

          let patient_report_path = `${dir}/` + patient_report.name;
          let patient_report_viewurl =
             "/view?filepath=" + patient_report_path;
          let patient_report_downloadurl =
             "/download?filepath=" + patient_report_path;
          formValues.reports = [
            patient_report_viewurl,
            patient_report_downloadurl,
          ];
          patient_report.mv(patient_report_path, function (err, result) {
            if (err) throw err;
          });
        } else {
          for (const rp of req.files.patient_reports) {
            let patient_report = rp;
            fs.mkdir(dir, { recursive: true }, function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("New directory successfully created.");
              }
            });

            let patient_report_path = `${dir}/` + patient_report.name;
            let patient_report_viewurl =
               "/view?filepath=" + patient_report_path;
            let patient_report_downloadurl =
              
              "/download?filepath=" +
              patient_report_path;
            formValues.reports.push(patient_report_viewurl);
            formValues.reports.push(patient_report_downloadurl);
            patient_report.mv(patient_report_path, function (err, result) {
              if (err) throw err;
            });
          }
        }
      }
    }
    const creq = await enquries.create(formValues);

    let date = new Date();
    let year = date.getFullYear().toString();
    date = date.toJSON().split("-");
    let final = year[3] + date[2][0] + date[2][1] + date[1] + "_" + creq._id;
    console.log(final);
    const modify = {
      $set: {
        id: final,
      },
    };
    const _id = {
      _id: creq._id,
    };
    await enquries.updateOne(_id, modify);

    return res.status(200).json({ payload: creq });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ error: err, message: "something went wrong pls check filed" });
  }
});

addEnquriespatient.get(
  "/:id/admin/status",
  [authenticateToken, isadmin],
  async (req, res) => {
    try {
      const enqurie = await enquries.find({});
      const enquriesstatus = {
        total: 0,
        new: 0,
        lost: 0,
        completed: 0,
        inprogress: 0,
      };

      for (const en of enqurie) {
        enquriesstatus.total += 1;
        if (en.status === "New") {
          enquriesstatus.new += 1;
        } else if (en.status === "In Progress") {
          enquriesstatus.inprogress += 1;
        } else if (en.status === "Completed") {
          enquriesstatus.completed += 1;
        } else if (en.status === "Lost") {
          enquriesstatus.lost += 1;
        }
      }
      return res.status(200).json({ payload: [enquriesstatus] });
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .json({ error: err, message: "something went wrong pls check filed" });
    }
  }
);

addEnquriespatient.post("/:id/status", async (req, res) => {
  try {
    const formValues = JSON.parse(req.body.formValues);
    enquries.findById(req.params.id).then((enquiry) => {
      enquiry.hospital_name = formValues.hospital_name;
      enquiry.commission = formValues.commision_value;
      enquiry.bill_amount = formValues.bill_amount;
      enquiry.status = req.body.status;
      enquiry.save();
      if (enquiry.status === "Completed") {
        sendmailenquirycompletion(enquiry);
      }
    });
    return res.status(200).json({ payload: true });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ error: err, message: "something went wrong pls check filed" });
  }
});

module.exports = addEnquriespatient;
