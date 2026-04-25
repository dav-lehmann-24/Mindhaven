class BuddyChecklistSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(event, callback) {
    let index = 0;
    const finalEvent = event;

    const runNext = () => {
      if (index >= this.observers.length) {
        return callback(null, finalEvent);
      }

      const observer = this.observers[index];
      index += 1;

      return observer.update(finalEvent, (err, nextEvent = finalEvent) => {
        if (err) return callback(err);
        return runNext(nextEvent);
      });
    };

    return runNext();
  }
}

module.exports = BuddyChecklistSubject;
