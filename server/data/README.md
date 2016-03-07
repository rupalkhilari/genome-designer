# Data API

## Overview

This section of the API is for saving Projects and Blocks. Projects are saved as directories, and versioned under git. Blocks are directories under projects. Using the provided persistence interface, git versioning should be handled automatically.

Sequences are saved under their md5 hash, and in a separate folder. The md5 is computed on the client, and `block.sequence.md5` notes this value, which is used for retrieving the sequence.

### When things happen

A project will NOT gain a commit whenever something happens (e.g. create, save, destroy). Commits happen with autosaving, which will be triggered by the client every few minutes when there are changes. 

Snapshots are just commits with a specific message.

### Format

Autosaving / loading models are passed as a `rollup`, which takes the format:

```
{
  project: <projectManifest>,
  blocks: [
    <blockManifest>,
    ...
  ]
```

### Directory Structure 

In the scheme below, `/data/` is under git version control

```
/<projectId>
    permissions.json
    data/
        manifest.json
        /blocks
            /<blockId>
                manifest.json
            /<blockId>
                manifest.json
/sequence
    /<md5>
    /<md5>
```

## Files

### index.js

Express Router, largely relying on persistence interface

### versioning.js

git utilities, relying on nodegit

### persistence.js

Interface for checking existence / creating / replacing / merging / deleting projects and blocks

### filePaths.js

Create file system paths for projects, blocks, manifest files, sequence files

### commitMessages.js

Constants for various commit messages + generators so messages are consistent + easier to filter

### rollup.js

Utilities for creating / reading / writing rollups.
