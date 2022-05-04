# Development

## Setup

Run `yarn` after checkout to install all dependencies.

## Tests

Tests can be run with `yarn test`.

Please add new tests for any new features and bug fixes.
Language-specific tests should be included in their respective `sqldialect.test.ts` files.
Tests that apply to all languages should be in `behavesLikeSqlFormatter.ts`.

## Publish Flow

For those who have admin access on the repo, the new release publish flow is as such:

- `release-it` (bumps version, git tag, git release, npm release)
- `git subtree push --prefix static origin gh-pages` (pushes demo page to GH pages)
- `git dio develop` (moves origin/develop branch head to master)
  - alias for `git push --force-with-lease origin HEAD:develop`

# Contributors

- Adrien Pyke <adpyke@gmail.com>
- Alexandr Kozhevnikov <aedkozhevnikov@sberbank.ru>
- Andrew
- Benjamin Bellamy
- bingou
- Damon Davison <ddavison@avalere.com>
- Davut Can Abacigil <can@teamsql.io>
- Erik Hirmo <erik.hirmo@roguewave.com>
- George Leslie-Waksman <waksman@gmail.com>
- Ian Campbell <icampbell@immuta.com>
- ivan baktsheev
- João Pimentel Ferreira
- Justin Dane Vallar <jdvallar@gmail.com>
- Martin Nowak <code@dawg.eu>
- Matheus Salmi <mathsalmi@gmail.com>
- Matheus Teixeira <matheus.mtxr@gmail.com>
- Nicolas Dermine <nicolas.dermine@gmail.com>
- Offir Baron <ofir@panoply.io>
- Olexandr Sydorchuk <olexandr.syd@gmail.com>
- Rafael Pinto <raprp@posteo.de>
- Rahel Rjadnev-Meristo <rahelini@gmail.com>
- Rene Saarsoo <nene@triin.net>
- Rodrigo Stuchi
- Romain Rigaux <hello@getromain.com>
- Sasha Aliashkevich <olsender@gmail.com>
- Sean Song <mail@seansong.dev>
- Sergei Egorov <sergei.egorov@zeroturnaround.com>
- Steven Yung <stevenyung@fastmail.com>
- Toliver <teejae@gmail.com>
- Tyler Jones <tyler.jones@txwormhole.com>
- Uku Pattak <ukupat@gmail.com>
- Xin Hu <hoosin.git@gmail.com>
