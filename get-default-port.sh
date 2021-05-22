#!/bin/bash
readonly repo_path=$(git rev-parse --show-toplevel)
readonly config_port_regex="\"port\":[[:space:]]*([[:digit:]]{2,}00)"
readonly config_path="$repo_path/src/config/config.json"
readonly config=$(cat "$config_path")

# error if config file doesn't exist
if [ $? -ne 0 ]; then
  echo "ERROR: Unable to get default port, config file not found." >&2
  exit 1
fi

# error if port doesn't exist in config
[[ "$config" =~ $config_port_regex ]]
if [ $? -ne 0 ]; then
  echo "ERROR: Unable to get default port, port not specified in config file or does not match expected default port number." >&2
  exit 2
fi

# print port
echo "${BASH_REMATCH[1]}"
