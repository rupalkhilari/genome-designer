import * as filePaths from '../../server/utils/filePaths';
import * as fileSystem from '../../server/utils/fileSystem';

const directorySequences = filePaths.createStorageUrl(filePaths.sequencePath);
const sequenceFiles = fileSystem.directoryContents(__dirname);

export default function copyToStorage() {
  return Promise.all(sequenceFiles.map(fileName => {
    const source = `${__dirname}/${fileName}`;
    const dest = `${directorySequences}/${fileName}`;
    return fileSystem.fileCopy(source, dest);
  }));
}
