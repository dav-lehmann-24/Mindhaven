const BuddyChecklistSubject = require('./BuddyChecklistSubject');
const BuddyStreakObserver = require('./BuddyStreakObserver');

const checklistSubject = new BuddyChecklistSubject();
checklistSubject.subscribe(new BuddyStreakObserver());

exports.notifyTaskToggled = (event, callback) => checklistSubject.notify(event, callback);
