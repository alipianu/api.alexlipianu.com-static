#!/bin/bash
readonly repo_path=$(git rev-parse --show-toplevel)
if [ $? -ne 0 ]; then
  echo "ERROR: Unable to get repo path." >&2
  exit 1
fi

# navigate to repo root
cd "$repo_path"

# navigate up one directory into environment repo
cd ..

# get the environment path
readonly env_path=$(git rev-parse --show-toplevel)
if [ $? -ne 0 ]; then
  echo "ERROR: Unable to get environment path." >&2
  exit 2
fi

# navigate back to repo root
cd "$repo_path"

# run pm2 up
"$env_path/scripts/pm2-start.sh"
exit $?
