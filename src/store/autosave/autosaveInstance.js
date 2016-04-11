import autosaveCreator from './autosaveCreator';

const autosave = autosaveCreator({
  onSave: () => {
    console.log('autosaving!');
  }, //todo
});

export default autosave;
