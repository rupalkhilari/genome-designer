import { assert, expect } from 'chai';
import sinon from 'sinon';
import autosavingCreator from '../../src/store/autosaving';

describe('Store', () => {
  describe.only('Autosaving', () => {
    //simple reducer + actions
    const initialState = { counter: 0 };
    const increment = (number = 1) => ({ type: 'increment', number });
    const decrement = (number = 1) => ({ type: 'decrement', number });
    const counterReducer = (state = initialState, action) => {
      switch (action.type) {
      case 'increment':
        return { counter: state.counter + action.number };
      case 'decrement':
        return { counter: state.counter - action.number };
      default:
        return state;
      }
    };

    const saveSpy = sinon.spy();
    const throttleTime = 1000;
    const waitTime = 500;
    const forceSaveActionType = 'FORCE_SAVE';
    const autosaving = autosavingCreator({
      time: throttleTime,
      wait: waitTime,
      onSave: saveSpy,
      forceSaveActionType,
    });

    const {
      autosaveReducerEnhancer,
      isDirty,
      getLastSaved,
    } = autosaving;

    const savingCounter = autosaveReducerEnhancer(counterReducer);
    let state = savingCounter(undefined, {});

    it('accepts a configuration, requiring onSave, returns object', () => {
      const validConfig = { onSave: () => {} };
      expect(typeof autosavingCreator).to.equal('function');
      expect(autosavingCreator.bind(null, { config: 'stuff' })).to.throw();
      expect(autosavingCreator.bind(null, validConfig)).to.not.throw();
      const autosavingObject = autosavingCreator(validConfig);
      expect(typeof autosavingObject).to.equal('object');
      expect(typeof autosavingObject.autosaveReducerEnhancer).to.equal('function');
    });

    it('doesnt call save on initial state', () => {
      expect(saveSpy.called).to.equal(false);
    });

    it('allows force saving action type', (done) => {
      const callCount = saveSpy.callCount;
      state = savingCounter(state, {
        type: forceSaveActionType,
      });
      expect(saveSpy.callCount).to.equal(callCount + 1);

      setTimeout(done, throttleTime); //make sure throttle ends
    });

    it('returns last saved time', () => {
      expect(typeof getLastSaved).to.equal('function');
      assert(getLastSaved() > Date.now() - 5000);
    });

    it('only saves when state changes', (done) => {
      const callCount = saveSpy.callCount;
      const startSaved = getLastSaved();

      state = savingCounter(state, { type: 'bogus' });
      assert(startSaved === getLastSaved(), 'wrong saved time');
      expect(saveSpy.callCount).to.equal(callCount);

      state = savingCounter(state, increment(1));
      assert(startSaved < getLastSaved(), 'wrong saved time');
      expect(saveSpy.callCount).to.equal(callCount + 1);

      setTimeout(done, throttleTime); //make sure throttle ends
    });

    it('marks dirty when in between throttles', (done) => {
      const callCount = saveSpy.callCount;
      assert(!isDirty(), 'wrong dirty state');

      //doesnt trigger save
      state = savingCounter(state, { type: 'bogus' });
      assert(!isDirty(), 'wrong dirty state');
      expect(saveSpy.callCount).to.equal(callCount);

      //triggers first save
      state = savingCounter(state, increment(1));
      assert(!isDirty(), 'should only be dirty when in middle of throttle');
      expect(saveSpy.callCount).to.equal(callCount + 1);

      //marks dirty, waits to call until throttle done
      state = savingCounter(state, increment(1));
      assert(isDirty(), 'shuold be dirty while in throttle');
      expect(saveSpy.callCount).to.equal(callCount + 1);

      //todo - timeout, should call again soon
      setTimeout(() => {
        assert(!isDirty(), 'not dirty after throttle over');
        expect(saveSpy.callCount).to.equal(callCount + 2);
        done();
      }, throttleTime);
    });
  });
});
