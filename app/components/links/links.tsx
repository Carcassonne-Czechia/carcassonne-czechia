import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { LangContext, type Lang } from "~/i18n/lang-context";

const linkStubs = ["carcassonne-gg", "forum"] as const;
type LinkStub = (typeof linkStubs)[number];

const getLinkName = (item: LinkStub) => {
    if (item === "carcassonne-gg") return "Carcassonne Online Platform";
    if (item === "forum") return "Carcassonne fórum";
};

const getLinkUrl = (item: LinkStub) => {
    if (item === "carcassonne-gg") {
        return "https://carcassonne.gg";
    }
    if (item === "forum") {
        return "https://www.carcassonneforum.cz/";
    }
};

const getLinkDescription = (item: LinkStub, lang: Lang): string | null => {
    if (item === "carcassonne-gg" && lang === "en") {
        return "The central hub of competitive Carcassonne. All the buzz is shared there.";
    }
    if (item === "carcassonne-gg" && lang === "cs") {
        return "Hlavní světová stránka věnující se soutěžnímu Carcassonne. Všechny novinky se člověk dozví nejdříve tady.";
    }
    if (item === "forum" && lang === "cs") {
        return "České Carcassonne fórum. Diskuse o všem možném moderované hráči milujícími tuto hru.";
    } else return null;
};

export default function Links() {
    const { lang } = useContext(LangContext);

    const itemTemplate = (item: LinkStub, lang: Lang, index: number) => {
        const linkDescription = getLinkDescription(item, lang);

        return linkDescription ? (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100px",
                    padding: "1rem",
                }}
                key={item}
                className={classNames({
                    "border-top-1": index !== 0,
                })}
            >
                <a
                    href={getLinkUrl(item)}
                    style={{ paddingRight: "1rem", height: "100%" }}
                >
                    <img
                        src={`/assets/links/${item}.jpg`}
                        alt={item}
                        style={{ height: "100%" }}
                    />
                </a>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                    }}
                >
                    <div style={{ fontWeight: 600, fontSize: "16px" }}>
                        {getLinkName(item)}
                    </div>
                    <div>{linkDescription}</div>
                </div>
            </div>
        ) : (
            <React.Fragment key={item} />
        );
    };

    const listTemplate = (items: LinkStub[]) => {
        if (!items || items.length === 0) return null;

        const list = items.map((item, index) => {
            return itemTemplate(item, lang, index);
        });

        return <div>{list}</div>;
    };

    return (
        <main>
            <DataView value={[...linkStubs]} listTemplate={listTemplate} />
        </main>
    );
}
