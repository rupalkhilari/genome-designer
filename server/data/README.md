# Data API

Todos

- move blocks under block directory
- test the REST interface
- test the /block/<blockId> interface

## Overview

This section of the API is for saving Projects and Blocks. Projects are saved as directories, and versioned under git. Blocks are directories under projects. Using the provided persistence interface, git versioning should be handled automatically. 

### Directory Structure 

/<projectId>
    manifest.json
    /<blockId>
        manifest.json
        sequence
    /<blockId>
        manifest.json
        sequence

## Files

### index.js

Express Router, largely relying on persistence interface

### git.js

git utilities, relying on nodegit

### persistence.js

Interface for checking existence / creating / replacing / merging / deleting projects and blocks

### filePaths.js

Create file system paths for projects, blocks, manifest files, sequence files