# Carcassonne Czechia website

## Getting Started

### Prerequisites

Have [Node](https://nodejs.org/en) and [npm](https://www.npmjs.com/) installed. Start by [cloning](https://www.geeksforgeeks.org/how-to-git-clone-a-remote-repository/) the repository.

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Údržba

Převážně je potřeba zajistit aktuálnost dat.

Pokud nejste technicky zdatní, tak se dá upravovat přímo na GitHubu kliknutím na tlačítko se symbolem tužky nahoře. Jestli si nejste jistí, zda jste něco nerozbili, tak na to v dnešní době poměrně dobře funguje AI, když dostane pozměněný soubor a prompt na nahlášení čehokoli podezřelého. Může se i povést jenom AI říct, co upravit, a ona to sepíše sama, přeci jenom ten kód ve vstupních souborech je dobře čitelný.

Pokud nejste maintainer, tak musíte naklonovat repo a vyrobit merge request, který vám musí maintainer schválit. V případě úpravy souborů přímo na GitHubu vás tímto procesem GitHub intuitivně provede.

Pokud jste maintainer, pak rozhodně doporučuji lokální instalaci, dostanete zdarma type checking a možnost testovat na localhostu.

Zde je přehled toho, co je potřeba aktualizovat:

### Změny ve členech nebo kapitánovi týmu

Zde stačí upravit proměnné `currentTeamMemberBGAUsernames` a `formerTeamMemberBGAUsernames` v souboru [team-members.ts](https://github.com/posij118/carcassonne-czechia/blob/main/app/players/team-members.ts). Pro změny v kapitánovi tu jsou proměnné `teamCaptain` a `formerTeamCaptain`.

### Týmy pro týmové soutěže

V souboru [team-members.ts](https://github.com/posij118/carcassonne-czechia/blob/main/app/players/team-members.ts) najděte proměnnou `teamCompetitionMembers` a upravte její obsah.

### Výsledky v mezinárodních individuálních soutěžích

V roce 2025 jde o Carcassonne Champions League a Mistrovství světa. V souboru [tournament-results.ts](https://github.com/posij118/carcassonne-czechia/blob/main/app/players/tournament-results.ts) najděte proměnnou `rareTournamentResults` a upravte ji. V případě přidání nového turnaje je potřeba ho ještě přidat do konstanty `_rareTournamentNames` a funkce `getShortIndividualTournamentName`.

### Výsledky mistrovství ČR

Objeví se automaticky na konci října. Jenom je potřeba zkontrolovat, že organizátoři zase nezměnili jejich formát.

### Výsledky online mistrovství ČR

Je potřeba je přidat do souboru [all_data.csv](https://github.com/posij118/carcassonne-czechia/blob/main/src/raw-data/online-championships/all_data.csv). Jestli bude formát konzistentní, pak je možné vyrobit skript nebo případně excelovskou tabulku a exportovat z ní jako csv.

### Avatary členů týmu

Patří do složky [player-avatars](https://github.com/posij118/carcassonne-czechia/tree/main/public/assets/player-avatars).

Měly by splňovat:

- Název souboru `${BGA_Username}.jpg`, například tedy `posij118.jpg`.
- Velikost zhruba kolem 200 x 200 (to jenom z důvodu, aby se načetly rychle v případě pomalého připojení).
- Pokud byste z nějakého důvodu chtěli vektorový obrázek, pak můžete upravit komponentu `<PlayerAvatar />`.

Nakonec je potřeba přidat svoje jméno na BGA do pole `HAS_AVATAR` v souboru [existing-content](https://github.com/posij118/carcassonne-czechia/blob/main/app/existing-content.ts). Je mi to líto, ale lepší řešení jsem nenašel.

### Jména a přezdívky na BGA

Nacházejí se v souboru [`bga-stats.ts`](https://github.com/posij118/carcassonne-czechia/blob/main/app/players/bga-stats.ts).

- Ke každé bga přezdívce je potřeba přidat BGA id. To jde zjistit kliknutím na profil (ale ne svůj!) na BGA, kde je součástí URL. Tímto budou fungovat odkazy na BGA.
- Jméno je nepovinné, ale doporučuji ho sdílet.
- Ještě je možnost přidat maximální dosažené ELO na BGA, ale zatím ho stránka nepoužívá.

### Bio (info o sobě)

Přidává se do složky [`bios`](https://github.com/posij118/carcassonne-czechia/tree/main/src/bios) ve formátu Markdown.

- Je možné psát v angličtině nebo češtině, ideální však je si to třeba nechat přeložit od AI a zkontrolovat.
- Nepatří sem úspěchy v Carcassonne, ty se vypisují automaticky, ani jméno a přezdívka na BGA.
- Mělo by se po chvíli automaticky objevit na stránce (ale pár minut to může trvat).
- Kreativitě se meze nekladou.
