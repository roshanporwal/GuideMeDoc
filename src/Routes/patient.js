"use strict";

const { Router } = require("express");
var fileupload = require("express-fileupload");
const Patient = require("../model/patient");
const cors = require("cors");
const fs = require("fs");
var token = require("../middleware/genratetoken");
var authenticateToken = require("../middleware/verifytoken");
var fileupload = require("express-fileupload");
var constants = require("../constant");

let patient_api = Router();
patient_api.use(fileupload());
patient_api.use(cors());

//create Patient
patient_api.post("/create", async (req, res) => {
  try {
    console.log("JO");
    const formValues = JSON.parse(req.body.formValues);
    console.log(formValues);
    const dir = `./tmp/${formValues.name}`;
    console.log(req.files);
    fs.mkdir(dir, { recursive: true }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("New directory successfully created.");
      }
    });
    const login_id = formValues.mobile;
    formValues.login_id = formValues.mobile;

    formValues.reports = [];
    if (req.files !== null) {
      //check insurance_card_copy is present or not
      if (req.files.insurance_card_copy) {
        console.log("HI");

        let insurance = req.files.insurance_card_copy;
        
        let insurance_path = `${dir}/` + insurance.name;
        let insurance_viewurl =
          constants.apiBaseURL + "/view?filepath=" + insurance_path;
        let insurance_downloadurl =
          constants.apiBaseURL + "/download?filepath=" + insurance_path;
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
          constants.apiBaseURL + "/view?filepath=" + identification_path;
        let identification_downloadurl =
          constants.apiBaseURL + "/download?filepath=" + identification_path;
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
            constants.apiBaseURL + "/view?filepath=" + patient_report_path;
          let patient_report_downloadurl =
            constants.apiBaseURL + "/download?filepath=" + patient_report_path;
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
              constants.apiBaseURL + "/view?filepath=" + patient_report_path;
            let patient_report_downloadurl =
              constants.apiBaseURL +
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

    const Patient_present = await Patient.findOne({ login_id }).lean();
    if (!Patient_present) {
      const create = await Patient.create(formValues).catch((error) => {
        return res
          .status(500)
          .json({
            error: "Not Found",
            message: "something went wrong pls check filed",
          });
      });

      if (create !== null) {
        return res.status(200).json({ payload: true });
      } else {
        return res
          .status(500)
          .json({
            error: "Not Found",
            message: "something went wrong pls check filed",
          });
      }
    } else {
      return res.status(200).json({ message: "user already present" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err, message: "something went wrong pls check filed" });
  }
});

//login Patient
patient_api.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const login_id = req.body.login_id;
    const Patient_present = await Patient.findOne({ login_id }).lean();
    if (Patient_present) {
      // if (Patient_present.password == req.body.password) {
      const auth = token.generateAccessToken({ login_id: login_id });
      Patient_present.token = auth;
      Patient_present.Patient = true;
      return res.status(200).json({ payload: Patient_present });
      /*} else {
      return res.status(404).json({ error: "Not Found", message: "Password incorrect" })
    }*/
    } else {
      return res
        .status(404)
        .json({ error: "Not Found", message: "login_id incorrect" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err, message: "something went wrong pls check filed" });
  }
});

patient_api.get("/:id/getfamily", async (req, res) => {
  Patient.findById(req.params.id).then((patient) => {
    try {
      const family = patient.family;

      return res.status(200).json({ payload: family });
    } catch (err) {
      return res
        .status(500)
        .json({ error: err, message: "something went wrong pls check filed" });
    }
  });
});
//add family Patient
patient_api.post("/:id/addfamily", async (req, res) => {
  Patient.findById(req.params.id).then((patient) => {
    if (patient.family.length < 5) {
      try {
        const dir = `./tmp/${patient.name}`;
        fs.mkdir(dir, { recursive: true }, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log("New directory successfully created.")
          }
        })
        if (req.files !== null) {
          //check insurance_card_copy is present or not
          if (req.files.insurance_card_copy) {
            let insurance = req.files.insurance_card_copy;
            let insurance_path = `${dir}/` + insurance.name;
            let insurance_viewurl =
              constants.apiBaseURL + "/view?filepath=" + insurance_path;
            let insurance_downloadurl =
              constants.apiBaseURL + "/download?filepath=" + insurance_path;
            req.body.insurance_card_copy = [
              insurance_viewurl,
              insurance_downloadurl,
            ];
            insurance.mv(insurance_path, function (err, result) {
              if (err) {console.log(err);throw err};
            });
          }
        }
        patient.family.push(req.body);
        patient.save();

        return res.status(200).json({ payload: true });
      } catch (err) {
        return res
          .status(500)
          .json({
            error: err,
            message: "something went wrong pls check filed",
          });
      }
    } else
      return res
        .status(500)
        .json({ message: "Family Member limit reached." });
  });
});

module.exports = patient_api;
