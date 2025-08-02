import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { useContext } from "react";
import { NEWS } from "./news";
import type { NewsItem } from "./news";
import { LangContext } from "../../i18n/lang-context";
import type { Lang } from "../../i18n/lang-context";
import { Link } from "react-router";

export default function News() {
    const { lang } = useContext(LangContext);

    const itemTemplate = (item: NewsItem, lang: Lang, index: number) => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "100px",
                    padding: "1rem",
                }}
                key={item.title[lang]}
                className={classNames({
                    "border-top-1": index !== 0,
                })}
            >
                {item.linkTo ? (
                    <Link
                        to={item.linkTo}
                        style={{
                            paddingRight: "1rem",
                            height: "100%",
                            flexBasis: "80px",
                            flexGrow: 0,
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src={item.imageSource || "/assets/news/default.jpg"}
                            alt={item.title[lang]}
                            style={{ width: "100%" }}
                        />
                    </Link>
                ) : (
                    <div style={{ paddingRight: "1rem", height: "100%" }}>
                        <img
                            src={item.imageSource || "/assets/news/default.jpg"}
                            alt={item.title[lang]}
                            style={{ height: "100%" }}
                        />
                    </div>
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 600,
                            fontSize: "16px",
                            paddingBottom: "0.5rem",
                        }}
                    >
                        {item.title[lang]}
                    </div>
                    <div style={{ fontSize: "12px" }}>{item.content[lang]}</div>
                </div>
            </div>
        );
    };

    const listTemplate = (items: NewsItem[]) => {
        if (!items || items.length === 0) return null;

        const list = items.map((item, index) => {
            return itemTemplate(item, lang, index);
        });

        return <div>{list}</div>;
    };

    return (
        <div>
            <DataView value={NEWS} listTemplate={listTemplate} />
        </div>
    );
}
