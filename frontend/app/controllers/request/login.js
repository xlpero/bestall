import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  request: Ember.inject.controller(),
  showForm: false,

  actions: {
    login() {
      let { username, password } = this.getProperties('username', 'password');
      this.get('session').authenticate('authenticator:cas', {username: username, password: password}).catch((reason) => {
        console.log(reason);
        this.set('errorMessage', reason.error || reason);
      });
    }
  },

  casLoginUrl: Ember.computed(function() {
    return this.get('store').peekRecord('config', 1).get('casurl') + '/login';
  }),
  returnUrl: Ember.computed('request.model.biblio.id', function() {
    let id = this.get('request.model.biblio.id');
    let baseUrl = window.location.origin;
    let routeUrl = this.target.router.generate('request', {id: id}, {queryParams: {SSOscanner: null}});
    return baseUrl + routeUrl;
  }),
  scannerReturnUrl: Ember.computed('request.model.biblio.id', function() {
    let id = this.get('request.model.biblio.id');
    let baseUrl = window.location.origin;
    let routeUrl = this.target.router.generate('request', {id: id}, {queryParams: {SSOscanner: true}});
    return baseUrl + routeUrl;
  }),
  casUrl: Ember.computed('casLoginUrl', 'returnUrl', function() {
    let url = this.get('casLoginUrl') +
        '?' +
        Ember.$.param({service: this.get('returnUrl')});
    return url;
  }),
  scannerCasUrl: Ember.computed('casLoginUrl', 'scannerReturnUrl', function() {
    let url = this.get('casLoginUrl') +
        '?' +
        Ember.$.param({service: this.get('scannerReturnUrl')});
    return url;
  })

});
