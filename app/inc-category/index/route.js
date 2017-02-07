import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  modelName: 'inc-category',
  pageTitle: 'Incident Categories',

  newButtonAction: function() {
    return 'newItem';
  }.property(),
  newButtonText: '+ new category',

  actions: {
    newItem() {
      this.transitionTo('inc-category.edit', 'new');
    },

    editItem(category) {
      this.transitionTo('inc-category.edit', category);
    }
  }
});
