import { Button } from "primereact/button";
import { NavLink } from "react-router";
import { ROUTE_HEADERS } from "~/routes";

export default function NationalChampionshipAbout() {
    return (
        <>
            <h1>National Championship</h1>
            <p className="pb-3">
                Mistrovství ČR v Carcassonne se koná každoročně od roku 2003 v
                říjnu jako součást festivalu Deskohraní. V roce 2020 se MČR
                nehrálo kvůli pandemii koronaviru.
            </p>
            <p className="pb-3">
                Formát MČR určují organizátoři z organizace{" "}
                <a href="https://www.duha.cz/">Duha-Děsír</a>, kteří ho upravují
                podle počtu účastníků nebo kapacity prostor.
            </p>
            <nav className="flex justify-center pb-3">
                <NavLink to={""} className="pr-3 ">
                    <Button>History</Button>
                </NavLink>
                <NavLink to={ROUTE_HEADERS.HALL_OF_FAME} className="pl-3">
                    <Button>Hall Of Fame</Button>
                </NavLink>
            </nav>
        </>
    );
}
