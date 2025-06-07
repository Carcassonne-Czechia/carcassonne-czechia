import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { useContext, useEffect, useState, type JSX } from "react";
import { NavLink } from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { ROUTE_HEADERS } from "~/routes";
import "flag-icons/css/flag-icons.min.css";
import { SelectButton } from "primereact/selectbutton";
import { LangContext, type Lang } from "~/i18n/lang-context";

interface Item {
    to?: string;
    label: string;
    template?: (item: Item) => JSX.Element;
    icon?: string;
    items?: Item[];
}

export default function NavBar() {
    // Stop NavBar elements from flickering before full hydration
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    const { lang, setLang } = useContext(LangContext);
    const langs: Lang[] = ["cs", "en"];

    const itemRenderer = (item: Item) => (
        <NavLink
            to={`/${item.to}`}
            className="flex align-items-center p-menuitem-link"
        >
            {item.icon && <span className={item.icon} />}
            <span>{item.label}</span>
        </NavLink>
    );

    const items: Item[] = [
        {
            label: DICTIONARY.home[lang],
            to: "",
            template: itemRenderer,
        },
        {
            label: DICTIONARY.players[lang],
            to: `${ROUTE_HEADERS.PLAYERS}`,
            template: itemRenderer,
        },
        {
            label: DICTIONARY.tournaments[lang],
            items: [
                {
                    label: DICTIONARY.nationalChampionship[lang],
                    to: `${ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP}`,
                    template: itemRenderer,
                },
                {
                    label: DICTIONARY.onlineChampionship[lang],
                    to: `${ROUTE_HEADERS.ONLINE_CHAMPIONSHIP}`,
                    template: itemRenderer,
                },
                {
                    label: DICTIONARY.hallOfFame[lang],
                    to: `${ROUTE_HEADERS.HALL_OF_FAME}`,
                    template: itemRenderer,
                },
            ],
        },
        {
            label: DICTIONARY.links[lang],
            to: `${ROUTE_HEADERS.LINKS}`,
            template: itemRenderer,
        },
    ];

    const start = (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <img alt="logo" src={`/assets/logo.jpg`} height="40"></img>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "0 1rem", fontWeight: "600" }}>
                    {DICTIONARY.hook[lang]}
                </div>
            </div>
        </div>
    );

    const end = (
        <div style={{ height: "100%" }}>
            <SelectButton
                value={lang}
                options={langs}
                onChange={(e) => {
                    if (setLang && (e.value === "cs" || e.value === "en")) {
                        setLang(e.value);
                    }
                }}
                itemTemplate={(l) => (
                    <span
                        className={`fi fi-${l === "cs" ? "cz" : "gb"} fis`}
                        style={{
                            height: "100%",
                            borderRadius: "1px",
                        }}
                    ></span>
                )}
                style={{ marginLeft: "0.5rem" }}
            />
        </div>
    );

    return hydrated ? (
        <div className="card" style={{ marginBottom: "0.5rem" }} key={lang}>
            <Menubar
                model={items as MenuItem[]}
                start={start}
                end={end}
                style={{ fontSize: "16px" }}
            />
        </div>
    ) : (
        <></>
    );
}
