App.FormSubmissionComponent = Em.Component.extend({
  // cancel, cancelText, and submitText can all be overwritten in the hbs
  // e.g. {{form-submission submitText='Create account'}}
  cancel: true,
  cancelText: 'Cancel',
  classNames: ['buttons', 'form_submission'],
  layoutName: 'components/form_submission',
  submitText: 'Save',

  formSubmitted: function() {
    var page = this.get('parentView');
    var controller = page.get('controller');
    var formSubmitted = controller.get('formSubmitted');

    return formSubmitted;
  }.property('parentView.controller.formSubmitted'),
});

App.DestroySubmissionComponent = Em.Component.extend(
  Em.ViewTargetActionSupport, {

  cancel: true,
  classNameBindings: ['destroySubmitted:button-alt:button-primary'],
  destroyText: 'Delete',
  tagName: 'button',
  layoutName: 'components/destroy_submission',

  click: function() {
    this.triggerAction({
      action: 'destroy',
      target: this.get('parentView'),
    });
  },

  destroySubmitted: function() {
    var page = this.get('parentView');
    var controller = page.get('controller');
    var formSubmitted = controller.get('formSubmitted');

    return formSubmitted;
  }.property('parentView.controller.formSubmitted'),
});
