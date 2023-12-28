#!/bin/sh

# Set the INPUT_* environment variables from script arguments
export INPUT_NODE=$1
export INPUT_SEED=$2
export INPUT_FOLDER=$3

echo  "ARGS:" $@

# Providing a default value for INPUT_FOLDER if not set
if [ -z "$INPUT_FOLDER" ]
then
  export INPUT_FOLDER="public"
fi

echo "Publishing to node: $INPUT_NODE"
echo "Publishing folder: $INPUT_FOLDER"

# Example command (replace with your actual command)
bun ./src/index.ts
