import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import type { JSX } from "react";
import { NavLink } from "react-router";
import { ROUTE_HEADERS } from "~/routes";

interface Item {
    to?: string;
    label: string;
    template?: (item: Item) => JSX.Element;
    icon?: string;
    items?: Item[];
}

export default function NavBar() {
    const itemRenderer = (item: Item) => (
        <NavLink
            to={item.to ?? ""}
            className="flex align-items-center p-menuitem-link"
        >
            {item.icon && <span className={item.icon} />}
            <span>{item.label}</span>
        </NavLink>
    );

    const items: Item[] = [
        {
            label: "Home",
            to: "/",
            template: itemRenderer,
        },
        {
            label: "Players",
            to: `/${ROUTE_HEADERS.PLAYERS}`,
            template: itemRenderer,
        },
        {
            label: "Contests",
            items: [
                {
                    label: "National Championship",
                    to: `/${ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP}`,
                    template: itemRenderer,
                },
                {
                    label: "Online Championship",
                    to: `/${ROUTE_HEADERS.ONLINE_CHAMPIONSHIP}`,
                    template: itemRenderer,
                },
            ],
        },
    ];

    const start = (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <img alt="logo" src="/assets/logo.jpg" height="40"></img>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "0 1rem", fontWeight: "600" }}>
                    Carcassonne Czechia
                </div>
            </div>
        </div>
    );

    return (
        <div className="card">
            <Menubar
                model={items as MenuItem[]}
                start={start}
                style={{ fontSize: "16px" }}
            />
        </div>
    );
}
