import { useContext } from "react";
import { LangContext } from "~/i18n/lang-context";

export default function OnlineChampionshipAbout() {
    const { lang } = useContext(LangContext);

    return lang === "cs" ? (
        <>
            <h1>Online mistrovství ČR</h1>
            <div style={{ padding: "0 0.5rem" }}>
                <p>
                    Online mistrovství ČR se koná každoročně na podzim a
                    organizuje ho naše komunita. Vítězové nás reprezentují v
                    následujícím ročníku Carcassonne Champions League.
                </p>
            </div>
        </>
    ) : (
        <>
            <h1>Online national championship</h1>
            <div style={{ padding: "0 0.5rem" }}>
                <p>
                    The Czech Online National Championship is organized by our
                    community every year in fall. The winners get a chance to
                    represent Czechia in the Carcassonne Champions League.
                </p>
            </div>
        </>
    );
}

/*
<p>
    The format for 2025 will be presented later. The inaugural
    championship took place in 2024 with six participants in a
    round-robin + play-off format, and we may think about doing
    something similar in 2025.
</p>
<p>
    Eligibility is decided on a case-by-case basis. Most
    importantly, a player must not participate in an online
    championship of multiple countries in the same season.
    Whenever applicable, all games must follow recent WTCOC and
    CCL rules.
</p>
<p>
    Formát pro rok 2025 bude ještě upřesněn podle zájmu, ale
    určitě se máte na co těšit a doporučujeme se zúčastnit. V
    roce 2024 se hrálo systémem každý s každým, po kterém
    následovalo play off pro čtyři nejlepší ze šesti účastníků.
</p>
<p>
    Každý hráč se smí účastnit v jedné sezóně online mistrovství
    pouze jedné země. Co se týče pravidel, neplánujeme{" "}
</p>
*/
