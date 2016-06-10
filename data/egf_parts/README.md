This directory is the sequences for andrea's parts. It should be cloned into storage/sequence on app start so that the sequences are available. It is outside of that directory so that it is not gitignored and properly present.

copyToStorage.js is called when the server starts up to ensure that all the expected sequences are present in /storage

copyFromStorage.js copies sequences with md5 matching those of the parts from /storage into this directory.

To actually convert andrea's parts using the excel sheets, look in src/inventory/andrea
This script should write the files here, but double-check and if not you can use copyFromStorage
