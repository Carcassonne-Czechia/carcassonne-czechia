import { Button } from "primereact/button";
import { useContext } from "react";
import { Link } from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { BASE_URL, ROUTE_HEADERS } from "~/routes";

export default function NationalChampionshipNavigation() {
    const { lang } = useContext(LangContext);

    return (
        <nav>
            <Link to={`/${BASE_URL}/${ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP}`}>
                <Button>{DICTIONARY.history[lang]}</Button>
            </Link>
            <Link
                to={`/${BASE_URL}/${ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP}/${ROUTE_HEADERS.HALL_OF_FAME}`}
            >
                <Button>{DICTIONARY.hallOfFame[lang]}</Button>
            </Link>
        </nav>
    );
}
