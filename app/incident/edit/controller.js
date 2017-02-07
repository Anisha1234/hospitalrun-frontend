import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import IncidentSubmodule from 'hospitalrun/mixins/incident-submodule';
import UserSession from 'hospitalrun/mixins/user-session';
import IncidentCategoryList from 'hospitalrun/mixins/incident-category';
import IncidentLocationsList from 'hospitalrun/mixins/incident-locations-list';
import IncidentContributingFactors from 'hospitalrun/mixins/incident-contributing-factors-classification';
import SelectValues from 'hospitalrun/utils/select-values';
import HarmScoreOptions from 'hospitalrun/mixins/incident-harm-score';
import IncidentRisk from 'hospitalrun/mixins/incident-risk';

const { get } = Ember;

export default AbstractEditController.extend(IncidentSubmodule, IncidentCategoryList, IncidentLocationsList,
  IncidentContributingFactors, SelectValues, UserSession, HarmScoreOptions, IncidentRisk, {
    database: Ember.inject.service(),
    incidentController: Ember.inject.controller('incident'),

    categoryNameList: Ember.computed.map('incidentCategoryList', function(value) {
      return {
        id: value.get('incidentCategoryName'),
        value: value.get('incidentCategoryName')
      };
    }),

    displayPreScore: function() {
      let i18n = this.get('i18n');
      if (Ember.isBlank(this.get('model.preRiskScore'))) {
        return i18n.t('incident.messages.fillIn');
      } else {
        return `${this.get('model.preRiskScore')} -`;
      }
    }.property('model.preRiskScore'),
    displayPreResults: function() {
      return this.get('model.preRiskResults');
    }.property('model.preRiskResults'),

    displayPostScore: function() {
      let i18n = this.get('i18n');
      if (Ember.isBlank(this.get('model.postRiskScore'))) {
        return i18n.t('incident.messages.fillIn');
      } else {
        return `${this.get('model.postRiskScore')} -`;
      }
    }.property('model.postRiskScore'),
    displayPostResults: function() {
      return this.get('model.postRiskResults');
    }.property('model.postRiskResults'),

    canAddFeedback: function() {
      let canAdd = true;
      if (this.get('model.statusOfIncident') === 'Closed') {
        canAdd = false;
      }
      return canAdd;
    }.property('model.statusOfIncident'),

    canEditFeedback: function() {
      return this.currentUserCan('add_feedback');
    }.property(),

    canAddReviewer: function() {
      return this.currentUserCan('add_reviewer');
    }.property(),

    canAddInvestigationFinding: function() {
      return this.currentUserCan('add_investigation_finding');
    }.property(),

    canAddContributingFactor: function() {
      return this.currentUserCan('add_contributing_factor');
    }.property(),

    canAddRecommendation: function() {
      return this.currentUserCan('add_recommendation');
    }.property(),

    canAddRisk: function() {
      return this.currentUserCan('add_risk');
    }.property(),

    canAddSummary: function() {
      return this.currentUserCan('add_summary');
    }.property(),

    canDeleteFeedback: function() {
      return this.currentUserCan('delete_feedback');
    }.property(),

    canDeleteReviewer: function() {
      return this.currentUserCan('delete_reviewer');
    }.property(),

    canDeleteInvestigationFinding: function() {
      return this.currentUserCan('delete_investigation_finding');
    }.property(),

    canDeleteContributingFactor: function() {
      return this.currentUserCan('delete_contributing_factor');
    }.property(),

    canDeleteRecommendation: function() {
      return this.currentUserCan('delete_recommendation');
    }.property(),

    canDeleteRisk: function() {
      return this.currentUserCan('delete_risk');
    }.property(),

    patientContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('patientFactors', 'patientContributingFactors');
    }.observes('model.patientContributingFactors.[]'),

    staffContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('staffFactors', 'staffContributingFactors');
    }.observes('model.staffContributingFactors.[]'),

    taskContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('taskFactors', 'taskContributingFactors');
    }.observes('model.taskContributingFactors.[]'),

    communicationContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('communicationFactors', 'communicationContributingFactors');
    }.observes('model.communicationContributingFactors.[]'),

    equipmentContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('equipmentFactors', 'equipmentContributingFactors');
    }.observes('model.equipmentContributingFactors.[]'),

    wrkEnvironmentContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('workEnvFactors', 'wrkEnvironmentContributingFactors');
    }.observes('model.wrkEnvironmentContributingFactors.[]'),

    organizationalContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('organisationalFactors', 'organizationalContributingFactors');
    }.observes('model.organizationalContributingFactors.[]'),

    eduTrainingContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('educationAndTrainingFactors', 'eduTrainingContributingFactors');
    }.observes('model.eduTrainingContributingFactors.[]'),

    teamContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('teamFactors', 'teamContributingFactors');
    }.observes('model.teamContributingFactors.[]'),

    _reEnableCheckboxOnLoading(factorsList, contributingFactorsList) {
      let model = this.get('model');
      let factors = this.get(factorsList);
      model.get(contributingFactorsList).then(function(contributingFactors) {
        factors.forEach(function(factor) {
          factor.components.forEach(function(component) {
            if (!Ember.isEmpty(contributingFactors.findBy('component', component.name))) {
              model.set(component.id, true); // Check the checkbox by setting the checkbox value/property to true.
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    },

    incidentLocationsList: Ember.computed.alias('incidentController.incidentLocationsList.value'),
    incidentCategoryList: Ember.computed.alias('incidentController.incidentCategoryList'),

    incidentLocations: function() {
      let defaultIncidentLocations = this.get('defaultIncidentLocations');
      let incidentLocationsList = this.get('incidentLocationsList');
      if (Ember.isEmpty(incidentLocationsList)) {
        return SelectValues.selectValues(defaultIncidentLocations);
      } else {
        return SelectValues.selectValues(incidentLocationsList);
      }
    }.property('incidentLocationsList', 'defaultIncidentLocations'),

    newIncident: false,

    updateCapability: 'add_incident',

    _completeBeforeUpdate(sequence, resolve, reject) {
      let sequenceValue = null;
      let friendlyId = sequence.get('prefix');
      let model = this.get('model');
      let promises = [];

      sequence.incrementProperty('value', 1);
      sequenceValue = sequence.get('value');
      if (sequenceValue < 100000) {
        friendlyId += String(`00000${sequenceValue}`).slice(-5);
      } else {
        friendlyId += sequenceValue;
      }
      model.set('friendlyId', friendlyId);
      promises.push(sequence.save());
      Ember.RSVP.all(promises, 'All before update done for Incident item').then(function() {
        resolve();
      }, function(error) {
        reject(error);
      });
    },

    _findSequence(type, resolve, reject) {
      let sequenceFinder = new Ember.RSVP.Promise(function(resolve) {
        this._checkNextSequence(resolve, type, 0);
      }.bind(this));
      sequenceFinder.then(function(prefixChars) {
        let store = this.get('store');
        let newSequence = store.push(store.normalize('sequence', {
          id: `incident_${type}`,
          prefix: type.toLowerCase().substr(0, prefixChars),
          value: 0
        }));
        this._completeBeforeUpdate(newSequence, resolve, reject);
      }.bind(this));
    },

    _findSequenceByPrefix(type, prefixChars) {
      let database = this.get('database');
      let sequenceQuery = {
        key: type.toLowerCase().substr(0, prefixChars)
      };
      return database.queryMainDB(sequenceQuery, 'sequence_by_prefix');
    },

    _checkNextSequence(resolve, type, prefixChars) {
      prefixChars++;
      this._findSequenceByPrefix(type, prefixChars).then(function(records) {
        if (Ember.isEmpty(records.rows)) {
          resolve(prefixChars);
        } else {
          this._checkNextSequence(resolve, type, prefixChars);
        }
      }.bind(this), function() {
        resolve(prefixChars);
      });
    },

    afterUpdate() {
      let i18n = this.get('i18n');
      if (this.get('model.statusOfIncident') === 'Opened') {
        this.set('model.statusOfIncident', 'Reported');
      }
      this.displayAlert(i18n.t('incident.titles.incidentSaved'), i18n.t('incident.messages.saved'));
    },

    beforeUpdate() {
      if (this.get('model.isNew')) {
        this.set('newIncident', true);
        let type = 'incident';
        return new Ember.RSVP.Promise(function(resolve, reject) {
          this.store.find('sequence', `incident_${type}`).then(function(sequence) {
            this._completeBeforeUpdate(sequence, resolve, reject);
          }.bind(this), function() {
            this._findSequence(type, resolve, reject);
          }.bind(this));
        }.bind(this));
      } else {
        // We need to return a promise because we need to ensure we have saved the inc-contributing-factor records first.
        return new Ember.RSVP.Promise(function(resolve, reject) {
          let model = this.get('model');
          let patientFactors = this.get('patientFactors');
          let savePromises = [];

          model.get('patientContributingFactors').then(function(patientContributingFactors) {
            savePromises = this._addContributingFactors(patientFactors, patientContributingFactors);
          }.bind(this));

          let staffFactors = this.get('staffFactors');
          model.get('staffContributingFactors').then(function(staffContributingFactors) {
            savePromises = this._addContributingFactors(staffFactors, staffContributingFactors);
          }.bind(this));

          let taskFactors = this.get('taskFactors');
          model.get('taskContributingFactors').then(function(taskContributingFactors) {
            savePromises = this._addContributingFactors(taskFactors, taskContributingFactors);
          }.bind(this));

          let communicationFactors = this.get('communicationFactors');
          model.get('communicationContributingFactors').then(function(communicationContributingFactors) {
            savePromises = this._addContributingFactors(communicationFactors, communicationContributingFactors);
          }.bind(this));

          let equipmentFactors = this.get('equipmentFactors');
          model.get('equipmentContributingFactors').then(function(equipmentContributingFactors) {
            savePromises = this._addContributingFactors(equipmentFactors, equipmentContributingFactors);
          }.bind(this));

          let workEnvFactors = this.get('workEnvFactors');
          model.get('wrkEnvironmentContributingFactors').then(function(wrkEnvironmentContributingFactors) {
            savePromises = this._addContributingFactors(workEnvFactors, wrkEnvironmentContributingFactors);
          }.bind(this));

          let organisationalFactors = this.get('organisationalFactors');
          model.get('organizationalContributingFactors').then(function(organizationalContributingFactors) {
            savePromises = this._addContributingFactors(organisationalFactors, organizationalContributingFactors);
          }.bind(this));

          let educationAndTrainingFactors = this.get('educationAndTrainingFactors');
          model.get('eduTrainingContributingFactors').then(function(eduTrainingContributingFactors) {
            savePromises = this._addContributingFactors(educationAndTrainingFactors, eduTrainingContributingFactors);
          }.bind(this));

          let teamFactors = this.get('teamFactors');
          model.get('teamContributingFactors').then(function(teamContributingFactors) {
            savePromises = this._addContributingFactors(teamFactors, teamContributingFactors);
          }.bind(this));

          Ember.RSVP.all(savePromises, 'Updated contributing factor records before incident update').then(function() {
            resolve();
          }, function(error) {
            reject(error);
          });
        }.bind(this));
      }
    },

    _getCurrentUserName() {
      let incident = this.get('model');
      return incident.getUserName(true);
    },

    havePatientContributingFactors: function() {
      let model = this.get('model');
      let patientFactorsLength = model.get('patientContributingFactors.length');
      return (patientFactorsLength > 0);
    }.property('patientContributingFactors.length'),

    haveStaffContributingFactors: function() {
      let model = this.get('model');
      let staffFactorsLength = model.get('staffContributingFactors.length');
      return (staffFactorsLength > 0);
    }.property('staffContributingFactors.length'),

    haveTaskContributingFactors: function() {
      let model = this.get('model');
      let taskFactorsLength = model.get('taskContributingFactors.length');
      return (taskFactorsLength > 0);
    }.property('taskContributingFactors.length'),

    haveCommunicationContributingFactors: function() {
      let model = this.get('model');
      let communicationFactorsLength = model.get('communicationContributingFactors.length');
      return (communicationFactorsLength > 0);
    }.property('communicationContributingFactors.length'),

    haveEquipmentContributingFactors: function() {
      let model = this.get('model');
      let equipmentFactorsLength = model.get('equipmentContributingFactors.length');
      return (equipmentFactorsLength > 0);
    }.property('equipmentContributingFactors.length'),

    haveWorkEnvironmentContributingFactors: function() {
      let model = this.get('model');
      let wrkEnvironmentFactorsLength = model.get('wrkEnvironmentContributingFactors.length');
      return (wrkEnvironmentFactorsLength > 0);
    }.property('wrkEnvironmentContributingFactors.length'),

    haveOrganizationalContributingFactors: function() {
      let model = this.get('model');
      let organizationalFactorsLength = model.get('organizationalContributingFactors.length');
      return (organizationalFactorsLength > 0);
    }.property('organizationalContributingFactors.length'),

    haveEducationTrainingContributingFactors: function() {
      let model = this.get('model');
      let eduTrainingFactorsLength = model.get('eduTrainingContributingFactors.length');
      return (eduTrainingFactorsLength > 0);
    }.property('eduTrainingContributingFactors.length'),

    haveTeamContributingFactors: function() {
      let model = this.get('model');
      let teamFactorsLength = model.get('teamContributingFactors.length');
      return (teamFactorsLength > 0);
    }.property('teamContributingFactors.length'),

    itemList: function() {
      let categoryNameSelected = this.get('model.categoryName');
      if (!Ember.isEmpty(categoryNameSelected)) {
        let categoryList = this.get('incidentCategoryList');
        let incidentCategory = categoryList.findBy('incidentCategoryName', categoryNameSelected);
        return incidentCategory.get('incidentCategoryItems');
      }
    }.property('model.categoryName'),

    _findIndexOfProperty(arrayObj, property, value) {
      for (let i = 0; i < arrayObj.length; i += 1) {
        if (arrayObj[i][property] === value) {
          return i;
        }
      }
    },

    _addContributingFactors(factorsList, contributingFactors) {
      let savePromises = [];
      let checkboxValue = null;
      let existingFactor = null;
      let model = this.get('model');
      factorsList.forEach(function(factor) {
        factor.components.forEach(function(component) {
          checkboxValue = model.get(component.id);
          existingFactor = contributingFactors.findBy('component', component.name);
          if (Ember.isEmpty(checkboxValue)) {
            // Checkbox isn't checked, delete from list if in list
            if (!Ember.isEmpty(existingFactor)) {
              contributingFactors.removeObject(existingFactor);
              savePromises.push(existingFactor.destroyRecord());
            }
          } else {
            if (Ember.isEmpty(existingFactor)) {
              // Checkbox is checked, but value isn't stored on the model, so save it
              existingFactor = this.store.createRecord('inc-contributing-factor', {
                component: component.name,
                factorType: factor.type
              });
              savePromises.push(existingFactor.save());
              contributingFactors.addObject(existingFactor);
            }
          }

        }.bind(this));
      }.bind(this));
      return savePromises;
    },

    /**
     * Adds or removes the specified object from the specified list.
     * @param {String} listName The name of the list to operate on.
     * @param {Object} listObject The object to add or removed from the
     * specified list.
     * @param {boolean} removeObject If true remove the object from the list;
     * otherwise add the specified object to the list.
     */
    updateList(listName, listObject, removeObject) {
      let model = get('model');
      get(model, listName).then(function(list) {
        if (removeObject) {
          list.removeObject(listObject);
        } else {
          list.addObject(listObject);
        }
        this.send('update', true);
        this.send('closeModal');
      }.bind(this));
    },

    actions: {

      cancel() {
        let cancelledItem = this.get('model');
        if (this.get('isNew')) {
          cancelledItem.deleteRecord();
        } else {
          cancelledItem.rollback();
        }
        this.send(this.get('cancelAction'));
      },

      // Feedback Functions

      addFeedback(newFeedback) {
        this.updateList('feedbacks', newFeedback);
      },

      showAddFeedback() {
        let newFeedback = this.get('store').createRecord('inc-feedback', {
          dateRecorded: new Date(),
          givenBy: this._getCurrentUserName()
        });
        this.send('openModal', 'incident.feedback.edit', newFeedback);
      },

      deleteFeedback(feedback) {
        this.updateList('feedbacks', feedback, true);
      },

      showDeleteFeedback(feedback) {
        this.send('openModal', 'incident.feedback.delete', feedback);
      },

      showEditFeedback(feedback) {
        this.send('openModal', 'incident.feedback.edit', feedback);
      },

      // Reviewers functions

      addReviewer(newReviewer) {
        this.set('model.statusOfIncident', 'Active');
        this.updateList('reviewers', newReviewer);
      },

      showAddReviewer() {
        let newReviewer = this.get('store').createRecord('inc-reviewer', {
          dateRecorded: new Date(),
          addedBy: this._getCurrentUserName(),
          incident: this.get('model')
        });
        this.send('openModal', 'incident.reviewer.edit', newReviewer);
      },

      deleteReviewer(reviewer) {
        this.updateList('reviewers', reviewer, true);
      },

      showDeleteReviewer(reviewer) {
        this.send('openModal', 'incident.reviewer.delete', reviewer);
      },

      showEditReviewer(reviewer) {
        this.send('openModal', 'incident.reviewer.edit', reviewer);
      },

      // Investigating Finding Functions

      addInvestigationFinding(newInvestigationFinding) {
        this.updateList('investigationFindings', newInvestigationFinding);
      },

      showAddInvestigationFinding() {
        let newInvestigationFinding = this.get('store').createRecord('inc-investigation-finding', {
          dateRecorded: new Date()
        });
        this.send('openModal', 'incident.investigation-finding.edit', newInvestigationFinding);
      },

      deleteInvestigationFinding(investigationFinding) {
        this.updateList('investigationFindings', investigationFinding, true);
      },

      showDeleteInvestigationFinding(investigationFinding) {
        this.send('openModal', 'incident.investigation-finding.delete', investigationFinding);
      },

      showEditInvestigationFinding(investigationFinding) {
        this.send('openModal', 'incident.investigation-finding.edit', investigationFinding);
      },

      // Recommendation Functions

      addRecommendation(newRecommendation) {
        this.set('model.statusOfIncident', 'Follow-up');
        this.updateList('recommendations', newRecommendation);
      },

      showAddRecommendation() {
        let newRecommendation = this.get('store').createRecord('inc-recommendation', {
          dateRecorded: new Date()
        });
        this.send('openModal', 'incident.recommendation.edit', newRecommendation);
      },

      deleteRecommendation(recommendation) {
        this.updateList('recommendations', recommendation, true);
      },

      showDeleteRecommendation(recommendation) {
        this.send('openModal', 'incident.recommendation.delete', recommendation);
      },

      showEditRecommendation(recommendation) {
        this.send('openModal', 'incident.recommendation.edit', recommendation);
      },

      generateSummary() {
        this.set('model.statusOfIncident', 'Closed');
        this.set('showSummary', true);
      }
    }
  });
