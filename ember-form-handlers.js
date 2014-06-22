// This mixin is for use in controllers for validating and saving form info
// It's automatically implemented on all controllers (see bottom)
App.FormSaving = Em.Mixin.create(
  Em.Validations.Mixin, {

  serverError: false,
  formSubmitted: false,
  destroySubmitted: false,
  needsReset: false,

  editing: function() {
    return this.toString().indexOf('Edit') > -1;
  }.property(),

  new: function() {
    return this.toString().indexOf('New') > -1;
  }.property(),

  showServerError: function(xhr) {
    // If this is a special use case and a error message string is hardcoded, for
    // example with filepicker...
    if (typeof xhr === 'string') {
      Em.notify('error', xhr);

    // Else, proceed to generate the error message from Ember-parsed error object
    } else {
      var errors = xhr.errors;
      var properties = [];
      var message;

      // Get just the first error message of the first error object
      for (var property in errors) {
        var errorMessages = errors[property];
        var firstMessage = errorMessages[0];
        break;
      }

      message = property + ' ' + firstMessage;
      Em.notify('error', message);
    }

    this.set('formSubmitted', false);
  },

  validateAndSave: function() {
    var _this = this;

    if (_this.runCustomValidations) {
      Em.warn('If your custom validations method has a reject method, remember to set the controller\'s isValid property to false when the form content is invalid');
      _this.runCustomValidations();
    }

    if (!_this.get('isValid')) {
      _this.set('formSubmitted', false);
      return false;
    } else {
      Em.assert('You need to specify a save method on this controller', this.save);
      this.save();
    }
  },
});

// Give mixin access to all controllers
Em.ControllerMixin.reopen(
  App.FormSaving, {

});

// This mixin is for use in view handling form submission (button clicking)
// You need to manually mix it into form views
App.FormSubmission = Em.Mixin.create({

  actions: {
    cancel: function() {
      var controller = this.get('controller');

      controller.set('formSubmitted', true);

      if (this.cancelHandler) {
        Em.warn('Remember to set the controller\'s formSubmitted property to false when using a custom cancelHandler() method');
        this.cancelHandler();
      } else {
        Em.assert('You need to specify a cancel method on this view\'s controller', controller.cancel);
        controller.cancel();
      }
    },

    destroy: function() {
      var controller = this.get('controller');

      controller.setProperties({
        formSubmitted: true,
        destroySubmitted: true,
      });

      if (this.destroyHandler) {
        this.destroyHandler();
      } else {
        Em.assert('You need to specify a destroy method on this view\'s controller', controller.destroy);
        controller.destroy();
      }
    },
  },

  submit: function(event) {
    var controller = this.get('controller');

    event.preventDefault();
    event.stopPropagation();

    controller.set('formSubmitted', true);

    if (this.submitHandler) {
      this.submitHandler(); // Write submitHandler function in view
    } else {
      controller.validateAndSave();
    }
  },

  resetForm: function() {
    var controller = this.get('controller');

    controller.setProperties({
      formSubmitted: false,
      destroySubmitted: false,
    });
  }.on('willInsertElement'),

  autofocus: function() {
    var input = this.$().find('input').first();
    input.focus();
  }.on('didInsertElement'),
});
