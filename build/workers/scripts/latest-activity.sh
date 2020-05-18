#!/bin/bash

# globals
githubUrlBase="https://github.com/"
result=""
failed=""

# matches all event JSON where alipianu is the actor
# NOTE: issue with using this pattern with grep is that it matches multiple JSON data, so a work around (as is explained in (*) below) is necessary to isolate first match
eventPattern="(\{[^}]+\"actor\"[^}]+\"login\"[[:space:]]*:[[:space:]]*\"alipianu\".*?\"public\"[[:space:]]*:[^,]+,[[:space:]]*\"created_at\"[^}]+\})"
createdatDataPattern="[^\\]\"created_at\"[[:space:]]*:[[:space:]]*(\"[^\"]+\")[^}]+\}[[:space:]]*$"
privateJSONPattern="[^\\](\"private\"[[:space:]]*:[[:space:]]*[^,]+),"
descriptionJSONPattern="[^\\](\"description\"[[:space:]]*:[[:space:]]*[^,]+),"
nameJSONPattern="[^\\](\"name\"[[:space:]]*:[[:space:]]*[^,]+),"
repoDataPattern="$nameJSONPattern.*$privateJSONPattern.*$descriptionJSONPattern"

# make requests
for url in "${@:2}"; do
  status=0

  # make repo events request
  project=${url##$githubUrlBase}
  reqUrl="https://api.github.com/repos/$project/events"
  response=$(curl -f -s -u $DEV_USERNAME:$DEV_TOKEN $reqUrl)
  status=$?
  if [ $status -eq 0 ]; then

    # (*) check for match in response (use grep with -H to generate "(standard input):" delimiters, then trim delimiters)
    # NOTE: I admit, this approach leads to issues if the event data has alipianu as the actor AND includes the text "(standard input):", however this
    #       is an edge case that can be avoided by me by simply not using this text in pull requests/issues/commits/etc
    response=$(echo $response | grep -m 1 -oPH "$eventPattern")
    response=${response#(standard input):} # trim leading delimiter
    response=${response%%[[:space:]](standard input)*} # trim trailing delimiter along with other matches

    # activity from alipianu exists
    if [[ ! -z "$response" ]]; then

      # extract created_at
      [[ "$response" =~ $createdatDataPattern ]];
      createdatData="${BASH_REMATCH[1]}"

      # make repo details request
      reqUrl=${reqUrl%/events}
      response=$(curl -s -u $DEV_USERNAME:$DEV_TOKEN $reqUrl)
      status=$?
      if [ $status -eq 0 ]; then

        # extract repo data
        [[ "$response" =~ $repoDataPattern ]];
        nameJSON="${BASH_REMATCH[1]}"
        privateJSON="${BASH_REMATCH[2]}"
        descriptionJSON="${BASH_REMATCH[3]}"

        # add matched JSON to result
        if [ ! -z "$result" ]; then
          result="$result,"
        fi
        result="$result{\"platform\":\"github\",\"url\":\"$url\",$nameJSON,$privateJSON,$descriptionJSON,\"lastActivity\":$createdatData}"
      fi
    fi
  fi

  # build error list
  if [ $status -ne 0 ]; then
    # add url to error list
    if [ ! -z "$failed" ]; then
      failed="$failed,"
    fi
    failed="$failed\"$url\""
  fi
done

# print success to stdout
echo "{\"data\":[$result]}"

# print error to stderr
echo "{\"error\":[$failed]}" >&2

# exit successfully if at least one success, otherwise signal error
[ ! -z "$result" ]
exit $?