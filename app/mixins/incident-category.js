import Ember from 'ember';
export default Ember.Mixin.create({
  incidentCategory: [{
    name: 'Accident or Injury',
    items: ['Patient', 'Staff', 'Visitor', 'Other']
  }, {
    name: 'Adverse Drug Reaction',
    items: ['Rash', 'Hypotension', 'Arrythmia', 'Hematologic Problem', 'Nephrotoxicity', 'Mental Status Change', 'Other']
  }, {
    name: 'Against Medical Advise (AMA)',
    items: ['NA']
  }, {
    name: 'Anesthesia Event',
    items: ['Failed Regional Block', 'Unintentional Dural Puncture', 'Reaction to Anesthetic Agent', 'Significant hypotension, bradycardia, tachycardia',
      'Problem with vascular access', 'Extreme nausea/vomiting', 'Hypo/hyperthermia', 'Other'
    ]
  }, {
    name: 'Communication Breakdown',
    items: ['NA']
  }, {
    name: 'Emergency Code',
    items: ['Red - Fire', 'Purple - External Disaster', 'Orange - Evacuate Building',
      'Black - Bomb Threat', 'Blue - Medical Emergency', 'Yellow - Missing Patient', 'White - Violent', 'Other'
    ]
  }, {
    name: 'Equipment',
    items: ['Breakdown', 'Malfunction', 'Missing', 'Safety-Situation', 'Unavailability', 'Other']
  }, {
    name: 'Facility Safety',
    items: ['Electrical/Water Failure', 'Fire Safety', 'Inadequate Supplies',
      'Malfunction', 'Misuse', 'Security-Theft or Vandalism', 'Other']
  }, {
    name: 'Hospital Vehicle Incident',
    items: ['NA']
  }, {
    name: 'Infection Control',
    items: ['Surgical Site Infection', 'Hospital Acquired Infection', 'Needle Stick', 'Other']
  }, {
    name: 'Information Technology',
    items: ['HIS System Issue', 'MAIDIS System Issue', 'Other']
  }, {
    name: 'Insurance/Payment Issue',
    items: ['NA']
  }, {
    name: 'IV Site Complication',
    items: ['Compartment Syndrome', 'Extravasation of drug', 'Infiltration', 'Multiple Attempts', 'Other']
  }, {
    name: 'Laboratory Issue', items: ['NA']
  }, {
    name: 'Medical Record, File Documentation', items: ['Misplaced', 'Wrong File', 'Other']
  }, {
    name: 'Medication',
    items: ['Broken/Damaged', 'Expired Medication', 'Known Clinical Contraindication',
      'Known Medicine Allergy', 'Missing/Lost', 'Omitted/Delayed Medicine', 'Vendor/Manufacturing',
      'Wrong Administration', 'Wrong Dispensing/Preparation', 'Wrong Documentation', 'Wrong Dose', 'Wrong Medicine Prescription',
      'Wrong Monitoring', 'Wrong Patient', 'Wrong Route', 'Wrong Storage', 'Other']
  }, {
    name: 'Patient Falls',
    items: ['From bed', 'Sitting in chair', 'Ambulating', 'Grounds of Facility', 'Other']
  }, {
    name: 'Patient Identification Issue',
    items: ['No ID Band', 'No Name', 'Wrong Med. Rec. No.', 'Other']
  }, {
    name: 'Radiology / Radiation Safety Issue', items: ['NA']
  }, {
    name: 'Readmission (Patient)', items: ['Planned', 'Unplanned/Non-Preventable', 'Unplanned/Preventable', 'Other']
  }, {
    name: 'Sentinel Event',
    items: [
      'Discharge of an Infant to the Wrong Family',
      'Hemolytic transfusion reaction involving administration of blood or blood products', 'Intra-partum Maternal Death',
      'Patient Fall Resulting Death', 'Peri-natal Death(unrelated to a congenital condition)',
      'Prolonged fluoroscopy with cumulative dose greater than 1500 rads', 'Rape or physical assault of a patient',
      'Severe neonatal hyperbilirubinemia', 'Suicide of any patient or within 72 hours of inpatient discharge',
      'Surgery on the wrong patient or wrong body part', 'Unanticipated death of a full-term infant',
      'Unintended retention of a foreign object in a patient after surgery or other', 'Other'
    ]
  }, {
    name: 'Transfusion',
    items: ['Mismatch', 'Reaction', 'Other']
  }, {
    name: 'Workplace Violence', items: ['Verbal Abuse', 'Harassment', 'Threats', 'Physical Assault', 'Other']
  },
      { name: 'Other', items: ['NA'] }
  ]
});
