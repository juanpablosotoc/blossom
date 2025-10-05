import React from "react";

export default function MyNode (props: React.PropsWithChildren<{title: string}>) {
    return (
        <>
        {props.children}
        </>
    )
}
