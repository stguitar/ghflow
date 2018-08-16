# GitHub based Git Flow helper

The goal of this utility is to provide alias commands of creating release branches and merging them quickly back to the parent branch and master (trunk).  Additionally, we will create a GitHub Release of master after the merge occurs, and send an email notification to inform others of these actions.

This is based on a typical git-flow setup is in use, with a single trunk (defaulting to 'master') branch is used, with a development stream branch known by default as 'dev'.

After a release branch is merged back into development and master, a GH release will be created on GitHub.

The first time you run this utility, a configuration file (~/.ghflow/config) will be generated.  See the configuration section for options supported.

## Configuration

Most command options can be provided as CLI parameters, but a GitHub auth token is needed and can be read from the configuration file located at `~/.ghflow/config`.

In the configuration file, the following can be adjusted:

* githubToken - GitHub Authorization token see [https://github.com/settings/tokens] for more information.  This token permits access to the repository.
* tagNameFormat - Controls the format of the tag name when applied as a GitHub Release
```
     Default: rel_%version%_%releaseBranch%

     %version% will be substitued with the supplied version
     %releaseBranch% will be substitued with the supplied Release Branch name
 ```



* tagDescriptionFormat - Controls the format of the tag description when applied as a GitHub Release

```
     Default: Release %version% for %date%

     %version% will be substitued with the supplied version
     %date% will be substitued with the current date
 ```


## General Usage

```
  Usage: ghflow [options] [command]

  Options:

    -h, --help                                  output usage information

  Commands:

    create-release|cr [releaseBranch]           Create a new release branch
    merge-release|mr [releaseBranch]            Merge a release branch
    help [cmd]                                  display help for [cmd]
```

## Sub-commands

The utility uses sub-commands in the style of git itself, where the 2 main functions
are 'creating a release' branch, and 'merging a release branch' back into the trunk.

### Create Release

`ghflow create-release <branch_name>` will create a branch based off of a source branch,
which defaults to a branch in the repository named 'dev'.  The following commands are all equal,
showing the various options supported

```
ghflow create-release rc1234
ghflow create-release rc1234 -s dev
ghflow create-release rc1234 --source dev
ghflow cr rc1234
ghflow cr rc1234 -s dev
ghflow cr rc1234 --source dev
```

### Merge Release

`ghflow merge-release <branch_name> -v <version_name>` will merge the named branch into both upstream branches
following the typical git-flow approach.  The default target branch names for the merge is 'dev' and 'master'.
The provided `version` flag allows for naming the version which is used to produce the tag applied to the target trunk
branch in GitHub as a release.

The name of the tag is created as:
`rel_<version_name>_<branch_name>`

**If the version is omitted,** the utility will interactively prompt the user for the version name!

The following commands are all equal, showing the various options supported

```
ghflow merge-release rc1234 -v 11.0
ghflow merge-release rc1234 --version 11.0
ghflow merge-release rc1234 -v 11.0 -t master
ghflow merge-release rc1234 --version 11.0 -d dev
ghflow merge-release rc1234 -v 11.0 --tagtarget master
ghflow merge-release rc1234 --version 11.0 --devbranch dev

ghflow mr rc1234 -v 11.0
ghflow mr rc1234 --version 11.0
ghflow mr rc1234 -v 11.0 -t master
ghflow mr rc1234 --version 11.0 -d dev
ghflow mr rc1234 -v 11.0 --tagtarget master
ghflow mr rc1234 --version 11.0 --devbranch dev
```

### Global Options

There are a few provided global options that can  be added to any of the previous commands

```
-e, --email       Email Address for completion notification email
-q, --quiet       Do not send completion notification
```