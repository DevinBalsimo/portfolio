# Common Git Scenarios

## Undo last commit (keep changes)
```sh
git reset --soft HEAD~1
```

## Undo last commit (discard changes)
```sh
git reset --hard HEAD~1
```

## Create and switch to a new branch
```sh
git checkout -b feature/my-feature
```

## Merge a branch
```sh
git checkout main
git merge feature/my-feature
```
