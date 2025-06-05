import { useContext } from "react";
import { LangContext } from "~/i18n/lang-context";

export default function NationalChampionshipAbout() {
    const { lang } = useContext(LangContext);

    return lang === "cs" ? (
        <div>
            <h1>Mistrovství ČR</h1>
            <p>
                Mistrovství ČR v Carcassonne se koná každoročně od roku 2003 v
                říjnu jako součást festivalu Deskohraní. V roce 2020 se MČR
                nehrálo kvůli pandemii koronaviru.
            </p>
            <p>
                Formát MČR určují organizátoři z organizace{" "}
                <a href="https://www.duha.cz/">Duha-Děsír</a>, kteří ho upravují
                podle počtu účastníků nebo kapacity prostor.
            </p>
        </div>
    ) : (
        <div>
            <h1>National Championship</h1>
            <p>
                The Czech National Championship in Carcassonne has been held
                annually since 2003 in October as part of the Deskohraní
                festival. In 2020, the championship was not played due to the
                pandemic.
            </p>
            <p>
                The championship format is determined by the organizers from{" "}
                <a href="https://www.duha.cz/">Duha-Děsír</a>, who adjust it
                based on the number of participants or venue capacity.
            </p>
        </div>
    );
}
