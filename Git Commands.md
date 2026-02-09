# **Git Workflow with GitHub (Feature Branch + Pull Request)**

This document describes an end-to-end Git workflow for repositories hosted on GitHub, using feature branches and Pull Requests (PRs).

---

Assumptions:

- The repo is already cloned locally.
- `origin` points to GitHub (e.g., `git@github.com:org/repo.git`).
- `main` is the default branch on GitHub.
- You create Pull Requests on GitHub to merge changes into `main`.

---

## **1. Start from `main` and sync with GitHub**

``` 
git checkout main           # switch to local main
git pull origin main        # update local main from GitHub
```

**What this does:** Ensures you are on `main` and brings in the latest commits from `origin/main` (GitHub).

### **Create a feature branch for your work**

```
git checkout -b feature/my-new-feature
# or (newer syntax):
# git switch -c feature/my-new-feature
```

**What this does:** Creates `feature/my-new-feature` from the current `main` tip and switches your working directory to the new branch.

**Best practice:** Use descriptive names like `feature/user-login`, `bugfix/issue-123`, or `chore/update-deps`.

## **2. Develop, check status, and inspect changes**

While coding, periodically run:

```
git status            # shows branch, staged/unstaged, untracked files
git diff              # shows unstaged changes
git diff --cached     # shows staged (staged vs. unstaged) changes
```

**What this does:** Helps you see what has changed and what will be committed.

## **3. Stage changes**

Stage specific files:

```
git add path/to/file1 path/to/file2
```

Stage everything in the current directory:

```
git add .
```

Only stage modified/deleted tracked files (not new untracked files):

```
git add -u
```

**What this does:** Moves selected changes to the staging area so they will be included in the next commit.

## **4. Commit your work with clear messages**

Create a commit:

```
git commit -m "Implement user login form validation"
```

**What this does:** Records the staged changes as a new commit on your feature branch.

Amend the last commit (before pushing):

```
git add another/file
git commit --amend
```

**What this does:** Updates the previous commit with new changes and/or message.

**Note:** Avoid amending commits that are already pushed and shared.

## **5. Push your feature branch to GitHub**

First push for this branch:

```
git push -u origin feature/my-new-feature
```

**What this does:** Creates the branch `feature/my-new-feature` on GitHub and sets the upstream so later you can simply use `git push` and `git pull`.

Subsequent pushes:

```
git push
```

**What this does:** Sends new local commits on the current branch to the corresponding branch on GitHub.

## **6. Open a Pull Request (PR) on GitHub**

After pushing your branch:

- Go to your repository on GitHub.
- You will typically see a banner like: "Compare & pull request".
- Click "Compare & pull request".
- Select:
	- Base branch: `main`
	- Compare branch: `feature/my-new-feature`
- Fill in the PR title and description (reference issues if relevant, e.g., `Fixes #123`).
- Click "Create pull request".

This creates a PR where others can review your changes, run checks, and comment.

## **7. Keep your feature branch up-to-date with `main`**

When `main` receives new commits (e.g., from other PRs), update your feature branch so your PR merges cleanly.

### Option A – Merge `main` into your feature branch:

```
git checkout feature/my-new-feature
git fetch origin
git merge origin/main
```

**What this does:** Fetches latest `main` from GitHub and merges `origin/main` into your feature branch, possibly creating a merge commit.

If there are merge conflicts: resolve them manually, then:

```
git add path/to/conflicted-file
git commit
git push
```

### Option B – Rebase feature branch on top of `main`:

```
git checkout feature/my-new-feature
git fetch origin
git rebase origin/main
```

**What this does:** Replays your feature branch commits on top of the latest `origin/main` and creates a linear history.

If conflicts occur during rebase, fix conflicts, then:

```
git add path/to/conflicted-file
git rebase --continue
```

To abort a rebase in progress:

```
git rebase --abort
```

If your branch was already pushed before rebase, you must force-push carefully:

```
git push --force-with-lease
```

**What this does:** Updates the remote branch to match your rebased history. `--force-with-lease` is safer than `--force` because it refuses to overwrite remote changes you do not have locally.

## **8. Complete the Pull Request on GitHub**

When your PR is approved and checks pass:

- On GitHub, open the PR.
- Choose a merge strategy (depending on repo settings and team policy):
	- "Create a merge commit"
	- "Squash and merge"
	- "Rebase and merge"
- Click "Merge pull request" (or the equivalent option).

**What this does:** Integrates your changes into the `main` branch on GitHub and closes the PR.

**Note:** If your team uses "Squash and merge", your multiple commits on the feature branch will be combined into one commit on `main`.

## **9. Sync your local `main` after the PR is merged**

```
git checkout main
git pull origin main
```

**What this does:** Switches to local `main` and pulls the merged commits from GitHub so your local `main` contains the feature’s changes.

## **10. Clean up the feature branch (local and remote)**

Delete the local feature branch:

```
git branch -d feature/my-new-feature
# or force if it is not marked as merged (use with care):
# git branch -D feature/my-new-feature
```

Delete the remote feature branch on GitHub:

```
git push origin --delete feature/my-new-feature
```

Alternatively, GitHub often provides a "Delete branch" button on the PR page after merge.

## **11. Routine workflow summary (GitHub-oriented)**

Typical life cycle for a feature:

```
# 1. Start from an up-to-date main
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feature/my-new-feature

# 3. Work, stage, commit
git status
git add .
git commit -m "Implement feature X"

# 4. Push branch to GitHub
git push -u origin feature/my-new-feature

# 5. Open PR on GitHub: feature/my-new-feature -> main (via GitHub UI)

# 6. Optionally update branch with latest main while PR is open
# Option A: merge
git checkout feature/my-new-feature
git fetch origin
git merge origin/main
git push

# Option B: rebase
git checkout feature/my-new-feature
git fetch origin
git rebase origin/main
git push --force-with-lease

# 7. Merge the PR on GitHub (via web UI)

# 8. Update local main after PR merge
git checkout main
git pull origin main

# 9. Clean up branches
git branch -d feature/my-new-feature
git push origin --delete feature/my-new-feature
```

---

**Summary:** Use `main` as your stable base branch tied to GitHub. Create feature branches locally, push them, and open PRs on GitHub. Keep feature branches in sync with `main` via merge or rebase as needed. Merge PRs in GitHub, then pull `origin/main` locally and clean up merged feature branches.
