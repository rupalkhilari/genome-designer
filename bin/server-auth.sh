#!/usr/bin/env bash
set -e

correct_cwd () {
    if [ ! -f "package.json" ]
    then
        echo "current working directory error: are you in the genome-designer root directory?"
        exit 1
    fi
    PROJECT=$(grep '"name":' package.json | tr -d ' ' | tr -d ',' | tr -d '"' | cut -f 2 -d :)
    if [ "$PROJECT" != "genome-designer" ]
    then
        echo "unexpected project name: $PROJECT"
        exit 1
    fi
}

correct_cwd
TARGET="npm start"
if [ "$COMMAND" != "" ]
then
    TARGET=$COMMAND
fi

echo "executing $TARGET with authentication enabled..."
npm install git+https://git.autodesk.com:bionano/bio-user-platform.git#v0.0.1
BIO_NANO_AUTH=1 $TARGET