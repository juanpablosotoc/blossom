import ErrorBoundary from "@/components/errorBoundary";
import React from "react";

export default function MyNode (props: React.PropsWithChildren<{title: string}>) {
    return (
        <ErrorBoundary errorMessage="Error in MyNode component" onError={(error)=>{console.error(error)}}>
        {props.children}
        </ErrorBoundary>
    )
}
